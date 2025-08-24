import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

// Predefined breadcrumb mappings for better performance
export const staticBreadcrumbs: Record<string, Omit<BreadcrumbItem, "icon">[]> =
  {
    "/": [
      {
        label: "Trang chủ",
        href: "/",
      },
    ],
    "/aitutor": [
      {
        label: "Trang chủ",
        href: "/",
      },
      {
        label: "AI Tutor",
        href: "/aitutor",
      },
    ],
    "/grammar": [
      {
        label: "Trang chủ",
        href: "/",
      },
      {
        label: "Ngữ Pháp",
        href: "/grammar",
      },
    ],
    "/listening": [
      {
        label: "Trang chủ",
        href: "/",
      },
      {
        label: "Luyện Nghe",
        href: "/listening",
      },
    ],
    "/speaking": [
      {
        label: "Trang chủ",
        href: "/",
      },
      {
        label: "Luyện Nói",
        href: "/speaking",
      },
    ],
    "/test-prep": [
      {
        label: "Trang chủ",
        href: "/",
      },
      {
        label: "Luyện Thi",
        href: "/test-prep",
      },
    ],
  };

// Route segment labels
export const routeLabels: Record<string, string> = {
  aitutor: "AI Tutor",
  grammar: "Ngữ Pháp",
  listening: "Luyện Nghe",
  speaking: "Luyện Nói",
  "test-prep": "Luyện Thi",
  lesson: "Bài học",
  exercise: "Bài tập",
  result: "Kết quả",
};

// Utility function to generate breadcrumbs based on pathname
export function generateBreadcrumbs(
  pathname: string
): Omit<BreadcrumbItem, "icon">[] {
  // Use static breadcrumbs if available
  if (staticBreadcrumbs[pathname]) {
    return staticBreadcrumbs[pathname];
  }

  // Generate dynamic breadcrumbs for nested routes
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Omit<BreadcrumbItem, "icon">[] = [
    {
      label: "Trang chủ",
      href: "/",
    },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label =
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}
