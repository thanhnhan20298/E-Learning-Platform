'use client'

import { useState } from 'react'
import { BookOpen, Headphones, MessageSquare, Award, Brain, Volume2 } from 'lucide-react'
import Header from './ui/Header'
import FeatureCard from './ui/FeatureCard'
import AITutor from './AITutor'
import ListeningPractice from './ListeningPractice'
import GrammarLessons from './GrammarLessons'
import TestPreparation from './TestPreparation'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home')

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'AI Tutor',
      description: 'Học với trợ lý AI thông minh, nhận feedback tức thì về phát âm và ngữ pháp',
      section: 'ai-tutor'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Luyện Nghe',
      description: 'Bài tập nghe đa dạng từ cơ bản đến nâng cao với nhiều giọng khác nhau',
      section: 'listening'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Ngữ Pháp',
      description: 'Học ngữ pháp một cách có hệ thống với ví dụ thực tế và bài tập thực hành',
      section: 'grammar'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Luyện Thi',
      description: 'Chuẩn bị cho TOEIC và IELTS với đề thi mẫu và chiến lược làm bài',
      section: 'test-prep'
    }
  ]

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'ai-tutor':
        return <AITutor />
      case 'listening':
        return <ListeningPractice />
      case 'grammar':
        return <GrammarLessons />
      case 'test-prep':
        return <TestPreparation />
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Master English with{' '}
                  <span className="gradient-text">AI Technology</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Nền tảng học tiếng Anh thông minh với trợ lý AI, luyện nghe, ngữ pháp và chuẩn bị thi TOEIC/IELTS
                </p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setActiveSection('ai-tutor')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Brain className="w-5 h-5" />
                    Bắt đầu với AI Tutor
                  </button>
                  <button 
                    onClick={() => setActiveSection('listening')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    Luyện nghe ngay
                  </button>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => setActiveSection(feature.section)}
                />
              ))}
            </section>

            {/* Statistics */}
            <section className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8">Tại sao chọn E-Learn English?</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Bài tập luyện nghe</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                  <div className="text-gray-600">Chủ đề ngữ pháp</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                  <div className="text-gray-600">Tỷ lệ đỗ TOEIC/IELTS</div>
                </div>
              </div>
            </section>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  )
}
