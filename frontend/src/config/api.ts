// Simple API Configuration
const getApiUrl = (): string => {
  // Priority 1: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Priority 2: Browser detection (for mobile/network access)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Use same IP/hostname for API calls
    return `${protocol}//${hostname}:5000/api`;
  }

  // Priority 3: Server-side fallback
  return "http://localhost:5000/api";
};

// API configuration
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 10000,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Listening Practice
  LISTENING: "/listening",
  LISTENING_GENERATE: "/listening/generate",

  // Speaking Practice
  SPEAKING: "/speaking",
  SPEAKING_ANALYZE: "/speaking/analyze",
  SPEAKING_GENERATE: "/speaking/generate",
  SPEAKING_TTS: "/speaking/tts",

  // AI Tutor
  AI_CHAT: "/ai/chat",

  // Grammar Lessons
  GRAMMAR: "/grammar",

  // Test Preparation
  TEST_PREP: "/test-prep",
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Simple fetch wrapper with timeout
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export default API_CONFIG;
