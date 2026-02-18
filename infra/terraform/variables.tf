variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
}

variable "project_name" {
  description = "Project name used in tags and IAM role names"
  type        = string
}

variable "env" {
  description = "Deployment environment"
  type        = string
  default     = "prod"

  validation {
    condition     = var.env == "prod"
    error_message = "This Terraform stack only supports env=prod."
  }
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "allow_ssh" {
  description = "Allow inbound SSH when true"
  type        = bool
  default     = false
}

variable "ssh_cidr" {
  description = "Allowed CIDR for SSH when allow_ssh=true"
  type        = string
  default     = "0.0.0.0/32"
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
