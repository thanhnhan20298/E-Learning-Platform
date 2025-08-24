# AWS Deployment Guide

## Phương án 1: AWS Amplify (Recommended cho beginners)

### Bước 1: Chuẩn bị project cho deployment

1. **Tạo file build script cho toàn bộ project:**

```bash
# amplify.yml sẽ được tạo tự động, nhưng chúng ta cần chuẩn bị structure
```

### Bước 2: Deploy với AWS Amplify

1. Đăng nhập [AWS Console](https://console.aws.amazon.com/)
2. Tìm service **"AWS Amplify"**
3. Click **"New app"** > **"Host web app"**
4. Chọn **GitHub** và authorize
5. Chọn repository **"E-Learning-Platform"**
6. Chọn branch **"main"**
7. AWS sẽ tự động detect và config build settings

### Bước 3: Environment Variables
Trong Amplify console, thêm Environment variables:
```
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

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
