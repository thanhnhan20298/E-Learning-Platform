export interface User {
  id: string;
  name: string;
  email: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  targetTest?: "TOEIC" | "IELTS";
  progress: {
    listening: number;
    grammar: number;
    vocabulary: number;
    overall: number;
  };
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Listening Exercise types
export interface ListeningExercise {
  id: number | string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  transcript: string;
  audioUrl?: string;
  questions: ListeningQuestion[];
  generated?: boolean;
}

export interface ListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Speaking Exercise types
export interface SpeakingExercise {
  id: number;
  title: string;
  type: "pronunciation" | "conversation" | "reading" | "free_speech";
  level: "Beginner" | "Intermediate" | "Advanced";
  targetText: string;
  phonetic?: string;
  tips: string[];
  audioUrl?: string;
}

export interface RecordingResult {
  transcript: string;
  confidence: number;
  pronunciation_score?: number;
  feedback: string;
}

export interface AudioExercise {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  audioUrl: string;
  transcript: string;
  questions: Question[];
  category: "conversation" | "business" | "academic" | "news";
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  rules: string[];
  examples: Example[];
  exercises: Question[];
}

export interface Example {
  sentence: string;
  translation: string;
  highlight?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skill: "listening" | "reading" | "grammar" | "vocabulary";
}

export interface TestResult {
  id: string;
  testType: "TOEIC" | "IELTS";
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
  timeSpent: number;
  answers: number[];
  breakdown: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
  };
}
