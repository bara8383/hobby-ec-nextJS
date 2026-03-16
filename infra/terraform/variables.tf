variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
}

variable "project_name" {
  description = "Project name used in resource names"
  type        = string
}

variable "env" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "ECS container instance type"
  type        = string
  default     = "t3.small"
}

variable "github_owner" {
  description = "GitHub organization or user name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch allowed to assume OIDC role"
  type        = string
  default     = "main"
}

variable "github_thumbprints" {
  description = "GitHub OIDC root CA thumbprints"
  type        = list(string)
}

variable "container_port" {
  description = "Application container port"
  type        = number
  default     = 3000
}

variable "public_ingress_cidrs" {
  description = "Allowed CIDRs for inbound app traffic"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "ssm_parameters" {
  description = "Non-secret runtime configuration values stored in SSM Parameter Store"
  type        = map(string)
  default = {
    APP_ENV                = "prod"
    AWS_REGION             = "ap-northeast-1"
    SITE_URL               = "http://localhost:3000"
    LOG_LEVEL              = "info"
    CHAT_STORAGE_MODE      = "aws"
    CHAT_CONVERSATIONS_TABLE = "ChatConversations"
    CHAT_MESSAGES_TABLE    = "ChatMessages"
    CHAT_USER_QUEUE_TABLE  = "ChatUserQueue"
    CHAT_USER_QUEUE_PREFIX = "chat-user"
  }
}

variable "secrets_manager_values" {
  description = "Secret runtime values stored in AWS Secrets Manager"
  type        = map(string)
  sensitive   = true
  default = {
    DATABASE_URL   = ""
    JWT_SECRET     = ""
    SESSION_SECRET = ""
  }
}
