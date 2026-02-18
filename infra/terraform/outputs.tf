output "ec2_instance_id" {
  description = "Web EC2 instance ID"
  value       = aws_instance.web.id
}

output "ec2_public_ip" {
  description = "Web EC2 public IP"
  value       = aws_instance.web.public_ip
}

output "ci_role_arn" {
  description = "GitHub Actions OIDC role ARN"
  value       = aws_iam_role.ci.arn
}

output "ec2_role_arn" {
  description = "EC2 IAM role ARN"
  value       = aws_iam_role.ec2.arn
}
