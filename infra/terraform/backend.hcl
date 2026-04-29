bucket         = "hobby-ec-prod-terraform-state"
key            = "infra/terraform/prod.tfstate"
region         = "ap-northeast-1"
dynamodb_table = "hobby-ec-prod-terraform-lock"
encrypt        = true
