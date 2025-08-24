# Lambda function for backend
resource "aws_lambda_function" "backend" {
  filename         = "../lambda/backend.zip"
  function_name    = "${var.environment}-e-learning-backend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "lambda.handler"
  source_code_hash = data.archive_file.backend_zip.output_base64sha256
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      NODE_ENV            = var.environment
      GEMINI_API_KEY     = aws_secretsmanager_secret_version.gemini_api_key.secret_string
      DYNAMODB_TABLE     = aws_dynamodb_table.exercises.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.lambda_logs,
  ]
}

# Package backend code
data "archive_file" "backend_zip" {
  type        = "zip"
  source_dir  = "../backend"
  output_path = "../lambda/backend.zip"
  excludes    = ["node_modules", ".env", "*.log"]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.environment}-e-learning-backend"
  retention_in_days = 7
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.environment}-e-learning-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda CloudWatch logs
resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.environment}-e-learning-lambda-logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# IAM policy for DynamoDB access
resource "aws_iam_policy" "lambda_dynamodb" {
  name        = "${var.environment}-e-learning-lambda-dynamodb"
  path        = "/"
  description = "IAM policy for DynamoDB access from lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = [
          aws_dynamodb_table.exercises.arn,
          "${aws_dynamodb_table.exercises.arn}/index/*"
        ]
      }
    ]
  })
}

# IAM policy for Secrets Manager access
resource "aws_iam_policy" "lambda_secrets" {
  name        = "${var.environment}-e-learning-lambda-secrets"
  path        = "/"
  description = "IAM policy for Secrets Manager access from lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.gemini_api_key.arn
      }
    ]
  })
}

# Attach policies to role
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}

resource "aws_iam_role_policy_attachment" "lambda_secrets" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_secrets.arn
}
