"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Phone, Globe } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface NavbarProps {
  locale: Locale;
  dict: {
    home: string;
    products: string;
    collections: string;
    inspiration: string;
    about: string;
    contact: string;
    searchPlaceholder: string;
    callNow: string;
  };
  brandName: string;
  logoUrl: string;
  phone: string;
}

export default function Navbar({
  locale,
  dict,
  brandName,
  logoUrl,
  phone,
}: NavbarProps) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đổi ngôn ngữ giữ nguyên trang đang xem + lưu cookie nhớ lựa chọn của khách (Mục 15.1 & 15.6 URD)
  const switchLocale = (targetLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;
    const segments = pathname.split("/");
    if (segments[1] === "vi" || segments[1] === "en") {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }
    const nextPath = segments.join("/") || `/${targetLocale}`;
    router.push(nextPath);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (q) {
      router.push(`/${locale}/san-pham?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/${locale}/san-pham`);
    }
  };

  const navLinks = [
    { href: `/${locale}`, label: dict.home, exact: true },
    { href: `/${locale}/san-pham`, label: dict.products },
    { href: `/${locale}/bo-suu-tap`, label: dict.collections },
    { href: `/${locale}/cam-hung`, label: dict.inspiration },
    { href: `/${locale}/gioi-thieu`, label: dict.about },
    { href: `/${locale}/lien-he`, label: dict.contact },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-wood-white/85 backdrop-blur-md shadow-sm border-b border-wood-light/40"
          : "bg-wood-white/95 border-b border-wood-light/25"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tên thương hiệu */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src={logoUrl || "/uploads/logo/logo.webp"}
              alt={brandName}
              className="h-12 w-12 rounded-full object-cover border border-wood-light/50 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-wood-dark">
                {brandName}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-wood-medium hidden sm:block">
                {locale === "en" ? "Solid Wood Artistry" : "Nội Thất Gỗ Tự Nhiên"}
              </span>
            </div>
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors py-1 border-b-2 ${
                    active
                      ? "border-wood-dark text-wood-dark font-semibold"
                      : "border-transparent text-wood-charcoal/80 hover:text-wood-medium"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Cụm công cụ: Tìm kiếm + Chuyển ngôn ngữ VI/EN + Nút gọi */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ô tìm kiếm trực tiếp trên màn hình rộng */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center bg-wood-cream border border-wood-light/60 rounded-full px-3.5 py-1.5 focus-within:border-wood-medium transition-colors"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="bg-transparent text-sm text-wood-charcoal placeholder:text-wood-charcoal/50 focus:outline-none w-44"
              />
              <button
                type="submit"
                aria-label="Search"
                className="text-wood-dark hover:text-wood-medium pl-1.5"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Nút mở tìm kiếm trên màn hình nhỏ/vừa */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search products"
              className="xl:hidden p-2.5 rounded-full text-wood-charcoal hover:bg-wood-cream transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Nút chuyển đổi ngôn ngữ VI / EN */}
            <div
              className="flex items-center bg-wood-cream border border-wood-light/70 rounded-full p-0.5 text-xs font-semibold"
              role="group"
              aria-label="Language switcher"
            >
              <Globe className="w-3.5 h-3.5 text-wood-medium ml-2 mr-1 hidden sm:inline" />
              <button
                type="button"
                onClick={() => switchLocale("vi")}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  locale === "vi"
                    ? "bg-wood-dark text-white shadow-sm"
                    : "text-wood-charcoal/75 hover:text-wood-dark"
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  locale === "en"
                    ? "bg-wood-dark text-white shadow-sm"
                    : "text-wood-charcoal/75 hover:text-wood-dark"
                }`}
              >
                EN
              </button>
            </div>

            {/* Nút Gọi nhanh trên máy tính */}
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="hidden sm:inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>

            {/* Nút mở menu trên điện thoại */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2.5 rounded-full text-wood-charcoal hover:bg-wood-cream transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm xổ xuống khi bấm kính lúp */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="xl:hidden pb-4 pt-1 animate-fade-up"
          >
            <div className="flex items-center bg-wood-cream border border-wood-light rounded-full px-4 py-2.5">
              <Search className="w-4 h-4 text-wood-medium mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                autoFocus
                className="bg-transparent text-sm text-wood-charcoal w-full focus:outline-none"
              />
            </div>
          </form>
        )}
      </div>

      {/* Menu mở ra trên điện thoại */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-wood-white border-b border-wood-light/50 px-4 pt-2 pb-6 space-y-2 animate-fade-up">
          {navLinks.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? "bg-wood-cream text-wood-dark font-semibold"
                    : "text-wood-charcoal hover:bg-wood-cream/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 px-4">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 w-full bg-wood-dark text-white py-3 rounded-xl font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>
                {dict.callNow}: {phone}
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
