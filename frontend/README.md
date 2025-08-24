# E-Learn Frontend

Frontend application cho E-Learn English platform sử dụng Next.js 14.

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production server
npm start
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework với App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── aitutor/           # AI Tutor page
│   │   └── components/    # Page-specific components
│   ├── grammar/           # Grammar lessons page
│   │   └── components/    # Page-specific components
│   ├── listening/         # Listening practice page
│   │   └── components/    # Page-specific components
│   ├── speaking/          # Speaking practice page
│   │   └── components/    # Page-specific components
│   └── test-prep/         # Test preparation page
│       └── components/    # Page-specific components
├── components/            # Shared/Common components
│   ├── ui/               # Reusable UI components
│   ├── Navigation.tsx    # Global navigation
│   ├── Breadcrumbs.tsx   # Breadcrumb navigation
│   └── HomePageContent.tsx # Home page content
├── hooks/                 # Custom React hooks
│   ├── useListeningExercises.ts
│   └── useSpeakingPractice.ts
├── services/             # API service layer
│   ├── api/             # API calls
│   └── business/        # Business logic
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
└── config/               # Configuration files
```

## 🎨 Styling

Dự án sử dụng Tailwind CSS với custom theme:

```css
/* Custom CSS classes */
.gradient-text {
  /* Gradient text effect */
}
.card-hover {
  /* Hover animations */
}
.btn-primary {
  /* Primary button style */
}
.btn-secondary {
  /* Secondary button style */
}
```

## 🧩 Components

### Core Components

- `HomePage` - Main landing page
- `Header` - Navigation component
- `FeatureCard` - Feature display cards

### Feature Components

- `AITutor` - AI chat interface
- `ListeningPractice` - Audio exercises
- `GrammarLessons` - Grammar learning
- `TestPreparation` - TOEIC/IELTS tests

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Next.js Config

- Image optimization enabled
- API routes configured
- TypeScript strict mode

## 📱 Responsive Design

- Mobile-first approach
- Tailwind responsive breakpoints
- Optimized for all screen sizes

## 🎯 Development Guidelines

1. Use TypeScript for all components
2. Follow component-based architecture
3. Implement responsive design
4. Optimize for performance
5. Maintain accessibility standards
