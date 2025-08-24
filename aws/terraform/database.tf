# DynamoDB table for exercises
resource "aws_dynamodb_table" "exercises" {
  name           = "${var.environment}-e-learning-exercises"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  range_key      = "type"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  attribute {
    name = "level"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  # Global Secondary Index for querying by type and level
  global_secondary_index {
    name     = "type-level-index"
    hash_key = "type"
    range_key = "level"
  }

  # Global Secondary Index for querying by type and creation date
  global_secondary_index {
    name     = "type-created-index"
    hash_key = "type"
    range_key = "created_at"
  }

  tags = {
    Name = "${var.environment}-e-learning-exercises"
  }
}

# Secrets Manager for API keys
resource "aws_secretsmanager_secret" "gemini_api_key" {
  name        = "${var.environment}-e-learning-gemini-api-key"
  description = "Gemini AI API key for E-Learning platform"

  tags = {
    Name = "${var.environment}-gemini-api-key"
  }
}

resource "aws_secretsmanager_secret_version" "gemini_api_key" {
  secret_id     = aws_secretsmanager_secret.gemini_api_key.id
  secret_string = "REPLACE_WITH_YOUR_GEMINI_API_KEY"

  lifecycle {
    ignore_changes = [secret_string]
  }
}
