"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Headphones,
  MessageSquare,
  Award,
  Brain,
  Menu,
  X,
  Mic,
} from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Trang chủ",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      href: "/aitutor/",
      label: "AI Tutor",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      href: "/listening/",
      label: "Luyện nghe",
      icon: <Headphones className="w-5 h-5" />,
    },
    {
      href: "/speaking/",
      label: "Luyện nói",
      icon: <Mic className="w-5 h-5" />,
    },
    {
      href: "/grammar/",
      label: "Ngữ pháp",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      href: "/test-prep/",
      label: "Luyện thi",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <header className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            E-Learn
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              console.log(`${item.href}: ${isActive} (pathname: ${pathname})`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-nav-link ${isActive ? "active" : ""}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
