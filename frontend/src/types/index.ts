export interface User {
  id: string
  name: string
  email: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  targetTest?: 'TOEIC' | 'IELTS'
  progress: {
    listening: number
    grammar: number
    vocabulary: number
    overall: number
  }
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  score?: number
  completedAt?: Date
}

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  audioUrl?: string
}

export interface AudioExercise {
  id: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  audioUrl: string
  transcript: string
  questions: Question[]
  category: 'conversation' | 'business' | 'academic' | 'news'
}

export interface GrammarTopic {
  id: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  rules: string[]
  examples: Example[]
  exercises: Question[]
}

export interface Example {
  sentence: string
  translation: string
  highlight?: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  skill: 'listening' | 'reading' | 'grammar' | 'vocabulary'
}

export interface TestResult {
  id: string
  testType: 'TOEIC' | 'IELTS'
  score: number
  maxScore: number
  percentage: number
  completedAt: Date
  timeSpent: number
  answers: number[]
  breakdown: {
    listening?: number
    reading?: number
    writing?: number
    speaking?: number
  }
}
