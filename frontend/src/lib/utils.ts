import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100)
}

export function getTOEICScoreRange(percentage: number): string {
  if (percentage >= 90) return '900-990'
  if (percentage >= 80) return '800-895'
  if (percentage >= 70) return '700-795'
  if (percentage >= 60) return '600-695'
  if (percentage >= 50) return '500-595'
  return '300-495'
}

export function getIELTSBand(percentage: number): string {
  if (percentage >= 90) return '8.5-9.0'
  if (percentage >= 80) return '7.5-8.0'
  if (percentage >= 70) return '6.5-7.0'
  if (percentage >= 60) return '6.0-6.5'
  if (percentage >= 50) return '5.5-6.0'
  return '4.0-5.0'
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function getLevelColor(level: 'Beginner' | 'Intermediate' | 'Advanced'): string {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-800'
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'Advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
