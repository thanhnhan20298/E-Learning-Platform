#!/bin/bash

# E-Learning Platform Deployment Script
# Usage: ./deploy.sh [environment] [region]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-1}
PROJECT_NAME="e-learning"

echo -e "${BLUE}🚀 Deploying E-Learning Platform${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Region: ${AWS_REGION}${NC}"
echo ""

# Check prerequisites
check_requirements() {
    echo -e "${YELLOW}📋 Checking requirements...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI${NC}"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}❌ Terraform not found. Please install Terraform${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found. Please install Node.js${NC}"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure'${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}🏗️  Building frontend...${NC}"
    cd ../frontend
    
    # Install dependencies
    npm ci
    
    # Build for production
    npm run build
    
    cd ../aws
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
}

# Package backend for Lambda
package_backend() {
    echo -e "${YELLOW}📦 Packaging backend...${NC}"
    
    # Create lambda directory if it doesn't exist
    mkdir -p lambda
    
    cd ../backend
    
    # Install production dependencies
    npm ci --production
    
    # Create Lambda handler
    cat > lambda.js << 'EOF'
const serverless = require('serverless-http');
const app = require('./src/index');

module.exports.handler = serverless(app);
EOF
    
    # Package for Lambda
    zip -r ../aws/lambda/backend.zip . -x "*.log" ".env*" "node_modules/aws-sdk/*"
    
    cd ../aws
    echo -e "${GREEN}✅ Backend packaged successfully${NC}"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "${YELLOW}🏗️  Deploying infrastructure...${NC}"
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan \
        -var="environment=${ENVIRONMENT}" \
        -var="aws_region=${AWS_REGION}" \
        -out=tfplan
    
    # Apply deployment
    echo -e "${YELLOW}📋 Review the plan above. Continue? (y/n)${NC}"
    read -r confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        terraform apply tfplan
        echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
    else
        echo -e "${YELLOW}⏸️  Deployment cancelled${NC}"
        exit 0
    fi
    
    cd ..
}

# Deploy frontend to S3
deploy_frontend() {
    echo -e "${YELLOW}☁️  Deploying frontend to S3...${NC}"
    cd terraform
    
    # Get S3 bucket name from Terraform output
    BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
    CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
    
    cd ..
    
    # Sync frontend files to S3
    aws s3 sync ../frontend/out s3://${BUCKET_NAME} --delete
    
    # Invalidate CloudFront cache if distribution exists
    if [[ -n "$CLOUDFRONT_ID" ]]; then
        echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
        aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"
    fi
    
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
}

# Update API configuration
update_api_config() {
    echo -e "${YELLOW}⚙️  Updating API configuration...${NC}"
    cd terraform
    
    # Get API Gateway URL
    API_URL=$(terraform output -raw api_gateway_url)
    
    cd ../../frontend
    
    # Update environment configuration
    cat > .env.production << EOF
NEXT_PUBLIC_API_URL=${API_URL}/api
NEXT_PUBLIC_ENVIRONMENT=production
EOF
    
    echo -e "${GREEN}✅ API configuration updated${NC}"
    cd ../aws
}

# Display deployment information
show_deployment_info() {
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    cd terraform
    
    echo -e "${BLUE}📊 Deployment Information:${NC}"
    echo -e "${BLUE}Frontend URL: ${NC}$(terraform output -raw cloudfront_distribution_url)"
    echo -e "${BLUE}API Gateway URL: ${NC}$(terraform output -raw api_gateway_url)"
    echo ""
    
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "1. Update your Gemini API key in AWS Secrets Manager"
    echo "2. Configure your domain in Route 53 (if using custom domain)"
    echo "3. Monitor your application in CloudWatch"
    echo ""
    
    echo -e "${BLUE}🔧 Useful Commands:${NC}"
    echo "- Check logs: aws logs tail /aws/lambda/${ENVIRONMENT}-e-learning-backend --follow"
    echo "- Update secret: aws secretsmanager update-secret --secret-id ${ENVIRONMENT}-e-learning-gemini-api-key --secret-string YOUR_API_KEY"
    
    cd ..
}

# Main deployment flow
main() {
    check_requirements
    build_frontend
    package_backend
    deploy_infrastructure
    update_api_config
    build_frontend  # Rebuild with production API URL
    deploy_frontend
    show_deployment_info
}

# Run main function
main
