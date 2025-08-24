# AWS E-Learning Platform Infrastructure

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 (Static)   │    │   API Gateway   │
│   (Frontend)    │    │   (Frontend)    │────│   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                              ┌─────────────────┐
                                              │   Lambda/ECS    │
                                              │   (Backend)     │
                                              └─────────────────┘
                                                        │
                                              ┌─────────────────┐
                                              │   RDS/DynamoDB  │
                                              │   (Database)    │
                                              └─────────────────┘
```

## Services Used

### Frontend (Static Website)
- **S3**: Static website hosting
- **CloudFront**: CDN for global distribution
- **Route 53**: Domain management

### Backend (API)
- **API Gateway**: REST API endpoints
- **Lambda**: Serverless functions (development/small scale)
- **ECS/Fargate**: Containerized deployment (production/scale)
- **ALB**: Application Load Balancer

### Database
- **DynamoDB**: NoSQL for exercises, user progress
- **RDS**: PostgreSQL for user management, analytics

### Security & Monitoring
- **IAM**: Access control
- **Secrets Manager**: API keys, database credentials
- **CloudWatch**: Logging and monitoring
- **WAF**: Web Application Firewall

## Deployment Strategies

### 1. Serverless (Lambda) - Development/MVP
- Low cost
- Auto-scaling
- Good for API-heavy workloads

### 2. Containerized (ECS/Fargate) - Production
- Better for complex applications
- Full control over runtime
- Easier local development

## Cost Optimization
- Use AWS Free Tier where possible
- Lambda for API (pay per request)
- S3 + CloudFront for frontend (very cheap)
- DynamoDB on-demand pricing
