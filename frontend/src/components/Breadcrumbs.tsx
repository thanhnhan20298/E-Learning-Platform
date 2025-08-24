"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Home,
  Brain,
  BookOpen,
  Headphones,
  Award,
  Mic,
} from "lucide-react";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null;
  }

  // Generate breadcrumbs and add icons
  const baseBreadcrumbs = generateBreadcrumbs(pathname);
  const breadcrumbs: BreadcrumbItem[] = baseBreadcrumbs.map((item) => {
    let icon: React.ReactNode = null;

    // Add icons based on href
    switch (item.href) {
      case "/":
        icon = <Home className="w-4 h-4" />;
        break;
      case "/aitutor/":
        icon = <Brain className="w-4 h-4" />;
        break;
      case "/grammar/":
        icon = <BookOpen className="w-4 h-4" />;
        break;
      case "/listening/":
        icon = <Headphones className="w-4 h-4" />;
        break;
      case "/speaking/":
        icon = <Mic className="w-4 h-4" />;
        break;
      case "/test-prep/":
        icon = <Award className="w-4 h-4" />;
        break;
    }

    return { ...item, icon };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-3 md:px-4 py-3">
        <ol className="flex items-center space-x-1 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
                )}

                {isLast ? (
                  <span className="flex items-center gap-2 text-gray-900 font-medium truncate">
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">
                      {item.label.length > 10
                        ? `${item.label.substring(0, 10)}...`
                        : item.label}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">
                      {item.label.length > 8
                        ? `${item.label.substring(0, 8)}...`
                        : item.label}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
