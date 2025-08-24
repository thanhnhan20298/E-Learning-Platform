"use client";

import Link from "next/link";
import {
  BookOpen,
  Headphones,
  MessageSquare,
  Award,
  Brain,
  Volume2,
  Mic,
} from "lucide-react";
import FeatureCard from "./ui/FeatureCard";

export default function HomePageContent() {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Tutor",
      description:
        "Học với trợ lý AI thông minh, nhận feedback tức thì về phát âm và ngữ pháp",
      href: "/aitutor",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Luyện Nghe",
      description:
        "Bài tập nghe đa dạng từ cơ bản đến nâng cao với nhiều giọng khác nhau",
      href: "/listening",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Luyện Nói",
      description:
        "Cải thiện phát âm và kỹ năng nói với AI speech recognition và feedback",
      href: "/speaking",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Ngữ Pháp",
      description:
        "Học ngữ pháp một cách có hệ thống với ví dụ thực tế và bài tập thực hành",
      href: "/grammar",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Luyện Thi",
      description:
        "Chuẩn bị cho TOEIC và IELTS với đề thi mẫu và chiến lược làm bài",
      href: "/test-prep",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-12 py-6 md:py-8">
      {/* Hero Section */}
      <section className="text-center py-6 md:py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 px-2">
            Master English with{" "}
            <span className="gradient-text">AI Technology</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 lg:mb-8 leading-relaxed px-4">
            Nền tảng học tiếng Anh thông minh với trợ lý AI, luyện nghe, ngữ
            pháp và chuẩn bị thi TOEIC/IELTS
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link
              href="/aitutor"
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] text-sm md:text-base"
            >
              <Brain className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs sm:text-sm md:text-base">
                Bắt đầu với AI Tutor
              </span>
            </Link>
            <Link
              href="/listening"
              className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] text-sm md:text-base"
            >
              <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs sm:text-sm md:text-base">
                Luyện nghe ngay
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-3 md:px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8">
          Tính năng chính
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg mx-3 md:mx-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8">
          Tại sao chọn E-Learn English?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 md:mb-2">
              10,000+
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Bài tập luyện nghe
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 md:mb-2">
              500+
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Chủ đề ngữ pháp
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 md:mb-2">
              95%
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Tỷ lệ đỗ TOEIC/IELTS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
