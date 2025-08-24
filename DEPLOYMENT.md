# AWS Deployment Guide

# AWS Deployment Guide

## Phương án 1: AWS Amplify (Frontend) + AWS Lambda/EC2 (Backend)

### ⚠️ **Quan trọng**: AWS Amplify chỉ host frontend static files. Backend cần deploy riêng!

### Bước 1: Deploy Frontend với AWS Amplify

1. **Chuẩn bị Frontend:**
   - Frontend đã được cấu hình để export static files
   - File `amplify.yml` đã được tối ưu

2. **Deploy trên AWS Amplify:**
   - Đăng nhập [AWS Console](https://console.aws.amazon.com/)
   - Tìm service **"AWS Amplify"**
   - Click **"New app"** > **"Host web app"**
   - Chọn **GitHub** và authorize
   - Chọn repository **"E-Learning-Platform"**
   - Chọn branch **"main"**
   - AWS sẽ tự động sử dụng file `amplify.yml`

3. **Environment Variables cho Frontend:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   NODE_ENV=production
   ```

### Bước 2: Deploy Backend (Chọn 1 trong 3)

#### Option A: AWS Lambda + API Gateway (Serverless)
```bash
# Cần cấu hình serverless framework
npm install -g serverless
```

#### Option B: AWS EC2 (Recommended)
```bash
# Sử dụng script có sẵn
./infra/deploy-ec2.sh
```

#### Option C: AWS App Runner
- Đơn giản nhất cho backend
- Auto-scaling
- Connect trực tiếp với GitHub

---

## Phương án 2: AWS EC2 + PM2 (Có control nhiều hơn)

### Bước 1: Launch EC2 Instance
- Instance type: t2.micro (free tier)
- OS: Ubuntu 22.04 LTS
- Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

### Bước 2: Setup server
```bash
# SSH vào server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/thanhnhan20298/E-Learning-Platform.git
cd E-Learning-Platform
```

---

## Phương án 3: Docker + AWS ECS (Production ready)

Sử dụng Docker containers đã có trong `/infra/docker/`

---

**Khuyến nghị: Bắt đầu với AWS Amplify vì đơn giản nhất!**
