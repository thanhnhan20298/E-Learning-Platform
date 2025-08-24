# Complete Deployment Guide - All Options

## 🎯 **Tổng quan:** Để web hoạt động hoàn chỉnh cần deploy cả Frontend + Backend

---

## 🚀 **PHƯƠNG ÁN 1: AWS Amplify + App Runner (RECOMMENDED)**

### ✅ **Ưu điểm:**

- Đơn giản nhất
- Auto-scaling
- Managed service
- Chi phí hợp lý (~$10-20/tháng)

### 🔧 **Cách deploy:**

#### **Bước 1: Deploy Backend (AWS App Runner)**

1. Vào [AWS Console > App Runner](https://console.aws.amazon.com/apprunner/)
2. **Create service**
3. **Source:** GitHub
4. **Repository:** E-Learning-Platform
5. **Source directory:** `backend`
6. **Build settings:** Auto-detect (sẽ dùng apprunner.yaml)
7. **Environment variables:**
   ```
   GEMINI_API_KEY=your_real_api_key
   NODE_ENV=production
   ```
8. **Deploy** → Lấy URL (ví dụ: `https://abc123.awsapprunner.com`)

#### **Bước 2: Deploy Frontend (AWS Amplify)**

1. Vào [AWS Console > Amplify](https://console.aws.amazon.com/amplify/)
2. **New app > Host web app**
3. **GitHub** → Authorize → Chọn repo
4. **Environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-apprunner-url.awsapprunner.com/api
   NODE_ENV=production
   ```
5. **Deploy** → Lấy URL frontend

#### **🎉 Hoàn thành!** Web sẽ hoạt động đầy đủ với:

- Frontend: `https://abc123.amplifyapp.com`
- Backend: `https://abc123.awsapprunner.com`

**💰 Chi phí ước tính: $15-25/tháng**

---

## 🖥️ **PHƯƠNG ÁN 2: Single VPS (COST EFFECTIVE)**

### ✅ **Ưu điểm:**

- Rẻ nhất (~$5/tháng)
- Full control
- Dễ debug

### 🔧 **Cách deploy:**

#### **Bước 1: Thuê VPS**

- **DigitalOcean/Linode:** $5/tháng (1GB RAM)
- **AWS EC2:** t2.micro (free tier 1 năm)

#### **Bước 2: Setup Server**

```bash
# SSH vào server
ssh root@your-server-ip

# Clone repo
git clone https://github.com/thanhnhan20298/E-Learning-Platform.git
cd E-Learning-Platform

# Run setup script
chmod +x infra/deploy-ec2.sh
./infra/deploy-ec2.sh
```

#### **Bước 3: Domain Setup**

- Mua domain (~$10/năm)
- Point A record đến server IP
- Setup SSL với Let's Encrypt (free)

**💰 Chi phí ước tính: $5-10/tháng**

---

## 🐳 **PHƯƠNG ÁN 3: Docker + AWS ECS (PROFESSIONAL)**

### ✅ **Ưu điểm:**

- Production ready
- Auto-scaling
- Load balancing
- High availability

### 🔧 **Cách deploy:**

```bash
# Build và push images
docker-compose -f infra/docker/docker-compose.prod.yml build
docker tag your-image:latest your-ecr-repo:latest
docker push your-ecr-repo:latest

# Deploy trên ECS
aws ecs create-service --cluster your-cluster --service-name e-learning
```

**💰 Chi phí ước tính: $30-50/tháng**

---

## 📋 **So sánh các phương án:**

| Phương án                | Chi phí/tháng | Độ khó     | Tính năng    | Recommend                 |
| ------------------------ | ------------- | ---------- | ------------ | ------------------------- |
| AWS Amplify + App Runner | $15-25        | ⭐⭐       | Auto-scale   | ✅ **Best cho beginners** |
| Single VPS               | $5-10         | ⭐⭐⭐     | Full control | ✅ **Best giá rẻ**        |
| Docker + ECS             | $30-50        | ⭐⭐⭐⭐⭐ | Enterprise   | ⭐ **Production grade**   |

---

## 🎯 **KHUYẾN NGHỊ:**

**Cho người mới bắt đầu:** Chọn **Phương án 1** (Amplify + App Runner)

- Đơn giản nhất
- Ít config nhất
- AWS managed services

**Bạn muốn thử phương án nào? Tôi sẽ hướng dẫn chi tiết! 🚀**
