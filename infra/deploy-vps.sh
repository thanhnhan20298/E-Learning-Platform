#!/bin/bash

# 🚀 One-Click Deployment Script for VPS
# Supports: Ubuntu 20.04/22.04, CentOS 8, Debian 11

set -e

echo "🎯 E-Learning Platform - VPS Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Installing dependencies...${NC}"

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install other dependencies
apt-get install -y git nginx certbot python3-certbot-nginx pm2

# Verify installations
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

# Create app directory
APP_DIR="/var/www/e-learning"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
echo -e "${YELLOW}📥 Cloning repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/thanhnhan20298/E-Learning-Platform.git .
fi

# Setup Backend
echo -e "${YELLOW}⚙️ Setting up backend...${NC}"
cd backend

# Install backend dependencies
npm install

# Create production environment file
cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
PORT=5000

# API Keys (UPDATE THESE!)
GEMINI_API_KEY=your_gemini_api_key_here

# Security
JWT_SECRET=$(openssl rand -base64 32)

# CORS
FRONTEND_URL=https://your-domain.com
EOF

echo -e "${RED}⚠️  IMPORTANT: Update .env file with your real API keys!${NC}"

# Setup Frontend
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"
cd ../frontend

# Install frontend dependencies
npm install

# Create production environment
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
EOF

# Build frontend
npm run build

# Setup PM2 ecosystem
cd ..
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'e-learning-backend',
      script: 'src/index.js',
      cwd: '$APP_DIR/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '$APP_DIR/logs/backend-error.log',
      out_file: '$APP_DIR/logs/backend-out.log',
      log_file: '$APP_DIR/logs/backend.log'
    },
    {
      name: 'e-learning-frontend',
      script: 'npm',
      args: 'start',
      cwd: '$APP_DIR/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '$APP_DIR/logs/frontend-error.log',
      out_file: '$APP_DIR/logs/frontend-out.log',
      log_file: '$APP_DIR/logs/frontend.log'
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Setup Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/e-learning << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/e-learning /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"

# Start PM2 processes
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Start nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your application is running at: http://$(curl -s ifconfig.me)"
echo ""
echo "📝 Next steps:"
echo "1. Update DNS records to point your domain to this server"
echo "2. Edit $APP_DIR/backend/.env with your real API keys"
echo "3. Edit $APP_DIR/frontend/.env.local with your domain"
echo "4. Run: pm2 restart all"
echo "5. Setup SSL: sudo certbot --nginx -d your-domain.com"
echo ""
echo "📊 Monitoring commands:"
echo "- pm2 status"
echo "- pm2 logs"
echo "- pm2 monit"
echo ""
echo "🔧 Configuration files:"
echo "- Backend env: $APP_DIR/backend/.env"
echo "- Frontend env: $APP_DIR/frontend/.env.local"
echo "- Nginx config: /etc/nginx/sites-available/e-learning"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to update your API keys and domain settings!${NC}"
