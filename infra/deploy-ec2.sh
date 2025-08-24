#!/bin/bash

# AWS EC2 Deployment Script
# Run this script on your EC2 instance

echo "🚀 Starting deployment..."

# Update system
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/e-learning
cd /var/www/e-learning

# Clone or update repository
if [ -d ".git" ]; then
    echo "📥 Updating existing repository..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/thanhnhan20298/E-Learning-Platform.git .
fi

# Install dependencies for backend
cd backend
echo "📦 Installing backend dependencies..."
npm install

# Install dependencies for frontend
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Create environment file
cd ../backend
echo "⚙️  Creating environment file..."
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=production
EOF

echo "⚠️  Don't forget to update .env with your actual API key!"

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'e-learning-backend',
    script: 'src/index.js',
    cwd: '/var/www/e-learning/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }, {
    name: 'e-learning-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/e-learning/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install and configure Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/e-learning << EOF
server {
    listen 80;
    server_name your-domain.com;

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
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/e-learning /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: http://your-ec2-ip"
echo "📝 Don't forget to:"
echo "   1. Update .env with your actual Gemini API key"
echo "   2. Configure your domain in Nginx config"
echo "   3. Set up SSL certificate with Let's Encrypt"

# Show running processes
pm2 status
