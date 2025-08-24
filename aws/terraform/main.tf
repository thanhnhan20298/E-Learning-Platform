# Terraform Configuration for E-Learning Platform
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Store state in S3 (create bucket manually first)
  backend "s3" {
    bucket = "e-learning-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "E-Learning"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  default     = "dev"
}

variable "domain_name" {
  description = "Domain name for the application"
  default     = "e-learning.example.com"
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
