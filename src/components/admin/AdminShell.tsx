"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  MessageSquareText,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();

  // Nếu đang ở trang /admin/login thì chỉ hiển thị form đăng nhập
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Sản phẩm & Giá", icon: Package },
    { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
    { href: "/admin/collections", label: "Bộ sưu tập", icon: Layers },
    { href: "/admin/inquiries", label: "Yêu cầu tư vấn", icon: MessageSquareText },
    { href: "/admin/posts", label: "Bài đăng hằng ngày", icon: FileText },
    { href: "/admin/settings", label: "Cài đặt chung & Mật khẩu", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-wood-cream/50 text-wood-charcoal">
      {/* Cột menu bên trái dành cho Chủ shop (đơn giản, thuần tiếng Việt - Mục 2 & 15.1 URD) */}
      <aside className="w-full lg:w-64 bg-wood-white border-b lg:border-b-0 lg:border-r border-wood-light/60 shrink-0 flex flex-col justify-between">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src="/uploads/logo/logo.webp"
                alt="Wooden Decor"
                className="w-10 h-10 rounded-full object-cover border border-wood-light"
              />
              <div>
                <span className="font-serif text-lg font-bold text-wood-dark block leading-none">
                  Wooden Decor
                </span>
                <span className="text-[11px] text-wood-medium font-medium">
                  Quản trị cửa hàng
                </span>
              </div>
            </Link>
            <Link
              href="/vi"
              target="_blank"
              className="lg:hidden inline-flex items-center gap-1 text-xs font-medium text-wood-medium"
            >
              <span>Xem web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-wood-dark text-white shadow-sm"
                      : "text-wood-charcoal/80 hover:bg-wood-cream"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-5 border-t border-wood-light/40 space-y-2">
          <Link
            href="/vi"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-wood-cream hover:bg-wood-light/40 text-xs font-semibold text-wood-dark transition-colors"
          >
            <span>Mở xem trang Khách</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Vùng nội dung chính */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
    </div>
  );
}
