variable "aws_region" {
  description = "AWS region for bootstrap resources"
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
  default     = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

variable "terraform_state_bucket_name" {
  description = "S3 bucket name for Terraform remote state"
  type        = string
}

variable "terraform_lock_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
}
