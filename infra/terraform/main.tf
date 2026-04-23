data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ssm_parameter" "ecs_optimized_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended/image_id"
}

locals {
  name_prefix    = "${var.project_name}-${var.env}"
  cluster_name   = "${local.name_prefix}-cluster"
  service_name   = "${local.name_prefix}-service"
  task_family    = "${local.name_prefix}-task"
  ecr_repo_name  = "${local.name_prefix}-app"
  log_group_name = "/ecs/${local.name_prefix}"
  github_subject = "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/${var.github_branch}"

  ssm_parameter_arns = {
    for key, value in aws_ssm_parameter.app :
    key => value.arn
  }

  secret_arns = {
    for key, value in aws_secretsmanager_secret.app :
    key => value.arn
  }

  common_tags = {
    Project = var.project_name
    Env     = var.env
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = local.log_group_name
  retention_in_days = 14
  tags              = local.common_tags
}

resource "aws_ecr_repository" "app" {
  name                 = local.ecr_repo_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

resource "aws_ssm_parameter" "app" {
  for_each = var.ssm_parameters

  name  = "/${var.project_name}/${var.env}/${each.key}"
  type  = "String"
  value = each.value
  tags  = local.common_tags
}

resource "aws_secretsmanager_secret" "app" {
  for_each = var.secrets_manager_values

  name                    = "${var.project_name}/${var.env}/${lower(each.key)}"
  recovery_window_in_days = 0
  tags                    = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app" {
  for_each = var.secrets_manager_values

  secret_id     = aws_secretsmanager_secret.app[each.key].id
  secret_string = each.value
}

resource "aws_iam_role" "ecs_instance" {
  name = "${local.name_prefix}-ecs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_instance_ecs" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "ecs_instance_ssm" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ecs" {
  name = "${local.name_prefix}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance.name
}

resource "aws_security_group" "ecs_instance" {
  name        = "${local.name_prefix}-ecs-instance-sg"
  description = "Direct ingress to ECS EC2 instance"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "App Port"
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = var.public_ingress_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster" "main" {
  name = local.cluster_name

  setting {
    name  = "containerInsights"
    value = "disabled"
  }

  tags = local.common_tags
}

resource "aws_instance" "ecs" {
  ami                    = data.aws_ssm_parameter.ecs_optimized_ami.value
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.ecs_instance.id]
  iam_instance_profile   = aws_iam_instance_profile.ecs.name

  user_data = <<-EOT
    #!/bin/bash
    set -euxo pipefail
    echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
  EOT

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-ecs-instance"
    Role = "ecs"
  })
}

resource "aws_iam_role" "task_execution" {
  name = "${local.name_prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "task_execution_base" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "task_execution_runtime" {
  name = "${local.name_prefix}-task-runtime-access"
  role = aws_iam_role.task_execution.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = ["ssm:GetParameters", "ssm:GetParameter"],
        Resource = values(local.ssm_parameter_arns)
      },
      {
        Effect = "Allow",
        Action = ["secretsmanager:GetSecretValue"],
        Resource = values(local.secret_arns)
      }
    ]
  })
}

resource "aws_iam_role" "task" {
  name = "${local.name_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })

  tags = local.common_tags
}

resource "aws_ecs_task_definition" "app" {
  family                   = local.task_family
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "APP_ENV"
          value = aws_ssm_parameter.app["APP_ENV"].value
        },
        {
          name  = "AWS_REGION"
          value = aws_ssm_parameter.app["AWS_REGION"].value
        },
        {
          name  = "SITE_URL"
          value = aws_ssm_parameter.app["SITE_URL"].value
        },
        {
          name  = "NEXT_PUBLIC_SITE_ORIGIN"
          value = aws_ssm_parameter.app["SITE_URL"].value
        },
        {
          name  = "CHAT_STORAGE_MODE"
          value = aws_ssm_parameter.app["CHAT_STORAGE_MODE"].value
        },
        {
          name  = "CHAT_CONVERSATIONS_TABLE"
          value = aws_ssm_parameter.app["CHAT_CONVERSATIONS_TABLE"].value
        },
        {
          name  = "CHAT_MESSAGES_TABLE"
          value = aws_ssm_parameter.app["CHAT_MESSAGES_TABLE"].value
        },
        {
          name  = "CHAT_USER_QUEUE_TABLE"
          value = aws_ssm_parameter.app["CHAT_USER_QUEUE_TABLE"].value
        },
        {
          name  = "CHAT_USER_QUEUE_PREFIX"
          value = aws_ssm_parameter.app["CHAT_USER_QUEUE_PREFIX"].value
        },
        {
          name  = "LOG_LEVEL"
          value = aws_ssm_parameter.app["LOG_LEVEL"].value
        }
      ]
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.app["DATABASE_URL"].arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_secretsmanager_secret.app["JWT_SECRET"].arn
        },
        {
          name      = "SESSION_SECRET"
          valueFrom = aws_secretsmanager_secret.app["SESSION_SECRET"].arn
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "app"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "wget --spider -q http://localhost:${var.container_port}/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 30
      }
    }
  ])

  tags = local.common_tags
}

resource "aws_ecs_service" "app" {
  name            = local.service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "EC2"

  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  depends_on = [
    aws_instance.ecs
  ]

  tags = local.common_tags
}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.github_thumbprints
  tags            = local.common_tags
}

resource "aws_iam_role" "ci" {
  name = "${local.name_prefix}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub" = local.github_subject
        }
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "ci_inline" {
  name = "${local.name_prefix}-ci-policy"
  role = aws_iam_role.ci.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "EcrPush",
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage"
        ],
        Resource = "*"
      },
      {
        Sid    = "EcsUpdateService",
        Effect = "Allow",
        Action = [
          "ecs:UpdateService",
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition"
        ],
        Resource = "*"
      },
      {
        Sid    = "IamPassRoleForTaskDefs",
        Effect = "Allow",
        Action = ["iam:PassRole"],
        Resource = [
          aws_iam_role.task_execution.arn,
          aws_iam_role.task.arn
        ]
      }
    ]
  })
}
