# E-Learn English - AI-Powered English Learning Platform

Nền tảng học tiếng Anh thông minh với kiến trúc microservice, tích hợp AI và hỗ trợ chuẩn bị thi TOEIC/IELTS.

## �️ Kiến trúc dự án

```
E-Learn/
├── frontend/          # Next.js React Application
├── backend/           # Node.js Express API
├── infra/            # Infrastructure & DevOps
├── .github/          # GitHub workflows
└── README.md         # Documentation
```

## 📁 Chi tiết cấu trúc

### 🎨 Frontend (`/frontend`)

- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Features**:
  - 🤖 AI Tutor Interface
  - 🎧 Interactive Listening Practice
  - 📚 Grammar Lessons
  - 🏆 TOEIC/IELTS Test Preparation
  - 📱 Responsive Design

### ⚡ Backend (`/backend`)

- **Framework**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Features**:
  - 🔐 Authentication & Authorization
  - 🤖 OpenAI Integration
  - 📊 Progress Tracking
  - 🎯 Test Management
  - 📈 Analytics

### � Infrastructure (`/infra`)

- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes manifests
- **Reverse Proxy**: Nginx
- **Caching**: Redis
- **Monitoring**: (Future: Prometheus + Grafana)

## 🚀 Quick Start

### Phát triển Local

#### 1. Frontend Development

```bash
cd frontend
npm install
npm run dev
# Truy cập: http://localhost:3000
```

#### 2. Backend Development

```bash
cd backend
npm install
cp .env.example .env
# Cấu hình environment variables
npm run dev
# API: http://localhost:5000
```

#### 3. Full Stack với Docker

```bash
cd infra/docker
docker-compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## 🛠️ Tech Stack

### Frontend Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### Backend Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **OpenAI API** - AI integration

### DevOps Stack

- **Docker** - Containerization
- **Docker Compose** - Multi-container apps
- **Nginx** - Reverse proxy
- **Redis** - Caching layer

## 🔑 Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearn
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=http://localhost:3000
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### AI Services

- `POST /api/ai/chat` - AI conversation
- `POST /api/ai/grammar-check` - Grammar checking
- `POST /api/ai/tts` - Text-to-speech

### Learning Content

- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `POST /api/lessons/:id/progress` - Save progress

### Testing

- `GET /api/tests` - Get available tests
- `POST /api/tests/:id/submit` - Submit test results

## 🎯 Development Roadmap

### Phase 1: Core Platform ✅

- [x] Project structure setup
- [x] Frontend UI/UX components
- [x] Backend API structure
- [x] Docker configuration

### Phase 2: AI Integration (In Progress)

- [ ] OpenAI API integration
- [ ] Real-time chat functionality
- [ ] Speech recognition & synthesis
- [ ] Grammar checking service

### Phase 3: Database & Auth

- [ ] MongoDB schema design
- [ ] User authentication system
- [ ] Progress tracking
- [ ] Test result storage

### Phase 4: Advanced Features

- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 5: Production Ready

- [ ] CI/CD pipelines
- [ ] Kubernetes deployment
- [ ] Monitoring & logging
- [ ] Performance optimization

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test
npm run test:e2e
```

### Backend Testing

```bash
cd backend
npm test
npm run test:integration
```

## 📦 Deployment

### Development

```bash
docker-compose -f infra/docker/docker-compose.yml up
```

### Production

```bash
# Using Kubernetes
kubectl apply -f infra/k8s/
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Team

- **Frontend**: React/Next.js developers
- **Backend**: Node.js/Express developers
- **DevOps**: Infrastructure engineers
- **AI/ML**: AI integration specialists

---

**Ghi chú**: Đây là phiên bản đầu tiên với kiến trúc microservice. Các tính năng đang được phát triển tích cực.
