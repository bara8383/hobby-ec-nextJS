output "ci_role_arn" {
  description = "GitHub Actions OIDC role ARN"
  value       = aws_iam_role.ci.arn
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.app.name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_instance_public_ip" {
  description = "ECS EC2 instance public IP"
  value       = aws_instance.ecs.public_ip
}
