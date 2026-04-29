aws_region    = "ap-northeast-1"
project_name  = "hobby-ec"
env           = "prod"
instance_type = "t3.small"

container_port       = 3000
public_ingress_cidrs = ["0.0.0.0/0"]

ssm_parameters = {
  APP_ENV                  = "prod"
  AWS_REGION               = "ap-northeast-1"
  SITE_URL                 = "https://example.com"
  LOG_LEVEL                = "info"
  CHAT_STORAGE_MODE        = "aws"
  CHAT_CONVERSATIONS_TABLE = "ChatConversations"
  CHAT_MESSAGES_TABLE      = "ChatMessages"
  CHAT_USER_QUEUE_TABLE    = "ChatUserQueue"
  CHAT_USER_QUEUE_PREFIX   = "chat-user"
}

secrets_manager_values = {
  DATABASE_URL   = "postgresql://user:pass@host:5432/dbname"
  JWT_SECRET     = "replace-me"
  SESSION_SECRET = "replace-me"
}
