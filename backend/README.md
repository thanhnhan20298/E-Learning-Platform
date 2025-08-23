# E-Learn Backend API

Backend API cho E-Learn English platform sử dụng Node.js và Express.

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Copy environment variables
cp .env.example .env

# Chạy development server
npm run dev

# Chạy production server
npm start
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **OpenAI** - AI integration
- **JWT** - Authentication

## 📁 Project Structure

```
src/
├── controllers/          # Route controllers
├── models/              # Database models
├── routes/              # API routes
├── middleware/          # Custom middleware
├── services/           # Business logic
└── index.js            # Application entry point
```

## 🔗 API Endpoints

### Health Check

- `GET /api/health` - API status

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
- `POST /api/tests/:testId/submit` - Submit test results

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/progress` - Update progress

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearn
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,
  email: String,
  password: String,
  level: String,
  progress: Object,
  createdAt: Date
}
```

### Lesson Model

```javascript
{
  title: String,
  type: String,
  level: String,
  content: Object,
  exercises: Array
}
```

## 🤖 AI Integration

### OpenAI Chat

- Context-aware conversations
- Grammar correction
- Pronunciation feedback
- Vocabulary suggestions

### Features

- Multiple AI contexts (tutor, pronunciation, conversation)
- Rate limiting
- Error handling
- Response caching

## 🔒 Security

- JWT authentication
- CORS configuration
- Request validation
- Rate limiting
- Helmet security headers

## 🧪 Testing

```bash
# Run tests
npm test

# Run integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## 📊 Monitoring

- Request logging with Morgan
- Error tracking
- Performance monitoring
- Health checks
