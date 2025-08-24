"use client";

import { useState } from "react";
import {
  BookOpen,
  Headphones,
  MessageSquare,
  Award,
  Brain,
  Volume2,
  Menu,
  X,
} from "lucide-react";
import Header from "./ui/Header";
import FeatureCard from "./ui/FeatureCard";
import AITutor from "./AITutor";
import ListeningPractice from "./ListeningPractice";
import GrammarLessons from "./GrammarLessons";
import TestPreparation from "./TestPreparation";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Tutor",
      description:
        "Học với trợ lý AI thông minh, nhận feedback tức thì về phát âm và ngữ pháp",
      section: "ai-tutor",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Luyện Nghe",
      description:
        "Bài tập nghe đa dạng từ cơ bản đến nâng cao với nhiều giọng khác nhau",
      section: "listening",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Ngữ Pháp",
      description:
        "Học ngữ pháp một cách có hệ thống với ví dụ thực tế và bài tập thực hành",
      section: "grammar",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Luyện Thi",
      description:
        "Chuẩn bị cho TOEIC và IELTS với đề thi mẫu và chiến lược làm bài",
      section: "test-prep",
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "ai-tutor":
        return <AITutor />;
      case "listening":
        return <ListeningPractice />;
      case "grammar":
        return <GrammarLessons />;
      case "test-prep":
        return <TestPreparation />;
      default:
        return (
          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            {/* Hero Section */}
            <section className="text-center py-6 md:py-8 lg:py-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 px-2">
                  Master English with{" "}
                  <span className="gradient-text">AI Technology</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 lg:mb-8 leading-relaxed px-4">
                  Nền tảng học tiếng Anh thông minh với trợ lý AI, luyện nghe,
                  ngữ pháp và chuẩn bị thi TOEIC/IELTS
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                  <button
                    onClick={() => setActiveSection("ai-tutor")}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] text-sm md:text-base"
                  >
                    <Brain className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs sm:text-sm md:text-base">
                      Bắt đầu với AI Tutor
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveSection("listening")}
                    className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] text-sm md:text-base"
                  >
                    <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs sm:text-sm md:text-base">
                      Luyện nghe ngay
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="px-3 md:px-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8">
                Tính năng chính
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    onClick={() => setActiveSection(feature.section)}
                  />
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
  };

  return (
    <div className="min-h-screen">
      {/* Mobile-First Responsive Header */}
      <header className="bg-white shadow-lg relative z-50">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <div
              onClick={() => setActiveSection("home")}
              className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
            >
              E-Learn
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveSection("home")}
                className={`nav-link ${
                  activeSection === "home" ? "active" : ""
                }`}
              >
                Trang chủ
              </button>
              <button
                onClick={() => setActiveSection("ai-tutor")}
                className={`nav-link ${
                  activeSection === "ai-tutor" ? "active" : ""
                }`}
              >
                AI Tutor
              </button>
              <button
                onClick={() => setActiveSection("listening")}
                className={`nav-link ${
                  activeSection === "listening" ? "active" : ""
                }`}
              >
                Luyện nghe
              </button>
              <button
                onClick={() => setActiveSection("grammar")}
                className={`nav-link ${
                  activeSection === "grammar" ? "active" : ""
                }`}
              >
                Ngữ pháp
              </button>
              <button
                onClick={() => setActiveSection("test-prep")}
                className={`nav-link ${
                  activeSection === "test-prep" ? "active" : ""
                }`}
              >
                Luyện thi
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[40px] min-h-[40px]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-14 md:top-16 left-0 right-0 bg-white shadow-lg border-t">
              <nav className="flex flex-col py-2 md:py-4">
                <button
                  onClick={() => {
                    setActiveSection("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "home" ? "active" : ""
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Trang chủ
                </button>
                <button
                  onClick={() => {
                    setActiveSection("ai-tutor");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "ai-tutor" ? "active" : ""
                  }`}
                >
                  <Brain className="w-5 h-5" />
                  AI Tutor
                </button>
                <button
                  onClick={() => {
                    setActiveSection("listening");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "listening" ? "active" : ""
                  }`}
                >
                  <Headphones className="w-5 h-5" />
                  Luyện nghe
                </button>
                <button
                  onClick={() => {
                    setActiveSection("grammar");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "grammar" ? "active" : ""
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Ngữ pháp
                </button>
                <button
                  onClick={() => {
                    setActiveSection("test-prep");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "test-prep" ? "active" : ""
                  }`}
                >
                  <Award className="w-5 h-5" />
                  Luyện thi
                </button>
                <button
                  onClick={() => {
                    setActiveSection("debug");
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${
                    activeSection === "debug" ? "active" : ""
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Debug Network
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-3 md:py-4 lg:py-8 mobile-optimized">
        <div className="animate-fade-in">{renderActiveSection()}</div>
      </main>
    </div>
  );
}
