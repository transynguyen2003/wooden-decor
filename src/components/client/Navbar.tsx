"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Phone, Globe, Sun, Moon } from "lucide-react";
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

const THEME_STORAGE_KEY = "wooden_decor_theme";

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
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setPendingHref(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Đồng bộ trạng thái Sáng / Tối khi tải trang
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      const darkActive =
        saved === "dark" ||
        document.documentElement.classList.contains("dark");
      setIsDark(darkActive);
      document.documentElement.classList.toggle("dark", darkActive);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextDark ? "dark" : "light"
      );
    } catch {
      // Ignore storage errors
    }
  };

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
    setMobileMenuOpen(false);
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

  // Nạp sẵn (Prefetch) toàn bộ 6 tab ngay khi vào trang để bấm chuyển tab tức thì (0ms)
  useEffect(() => {
    navLinks.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [locale, router]);

  const activePath = pendingHref || pathname;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return activePath === href;
    return activePath === href || activePath.startsWith(`${href}/`);
  };

  const languageSwitcher = (
    <div
      className="flex items-center bg-wood-cream border border-wood-light/70 rounded-full p-0.5 text-xs font-semibold shrink-0"
      role="group"
      aria-label="Language switcher"
    >
      <Globe className="w-3.5 h-3.5 text-wood-medium ml-2 mr-1 hidden xl:inline" />
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
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-wood-white/85 backdrop-blur-md shadow-sm border-b border-wood-light/40"
          : "bg-wood-white/95 border-b border-wood-light/25"
      }`}
    >
      {pendingHref && pendingHref !== pathname && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-wood-light/30 overflow-hidden">
          <div className="h-full w-2/3 bg-wood-medium animate-pulse" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20">
          {/* Logo thương hiệu */}
          <Link
            href={`/${locale}`}
            prefetch={true}
            onClick={() => setPendingHref(`/${locale}`)}
            className="flex items-center group focus:outline-none min-w-0 shrink"
          >
            <img
              src={logoUrl || "/uploads/logo/logo-thien-an.webp"}
              alt={`${brandName} - Đồ decor gỗ thủ công và nội thất gỗ tự nhiên`}
              loading="eager"
              decoding="async"
              className="h-11 sm:h-13 lg:h-14 w-auto max-w-[175px] sm:max-w-[235px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Menu ngang chỉ hiện trên laptop (≥1024px), các tab không bao giờ xuống dòng */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center justify-center gap-4 xl:gap-7"
          >
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setPendingHref(item.href)}
                  className={`whitespace-nowrap text-sm xl:text-[15px] font-medium transition-colors py-1.5 border-b-2 ${
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

          {/* Cụm công cụ */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search products"
              title={dict.searchPlaceholder}
              className={`p-2 rounded-full transition-colors ${
                searchOpen
                  ? "bg-wood-dark text-white"
                  : "text-wood-charcoal hover:bg-wood-cream"
              }`}
            >
              <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            </button>

            {/* Nút gạt Sáng / Tối (Nâu trầm) */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? locale === "en"
                    ? "Switch to Light mode"
                    : "Chuyển sang giao diện Sáng"
                  : locale === "en"
                    ? "Switch to Dark Walnut mode"
                    : "Chuyển sang giao diện Tối (Nâu trầm)"
              }
              className="relative w-12 h-6 sm:w-14 sm:h-7 rounded-full bg-wood-cream border border-wood-light/80 flex items-center justify-between transition-colors duration-300 cursor-pointer shrink-0 shadow-inner"
            >
              <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 text-amber-600/70 shrink-0" />
              <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-wood-medium/80 shrink-0" />
              <span
                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 bg-wood-dark ${
                  isDark
                    ? "translate-x-6 sm:translate-x-7 text-amber-200"
                    : "translate-x-0 text-amber-300"
                }`}
              >
                {isDark ? (
                  <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </span>
            </button>

            {/* Chuyển ngôn ngữ — trên điện thoại được đưa vào menu */}
            <div className="hidden sm:block">{languageSwitcher}</div>

            {/* Nút mở menu cho điện thoại & tablet (<1024px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-full text-wood-charcoal hover:bg-wood-cream transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm nằm ở hàng dưới Header */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="pb-3 sm:pb-4 pt-1 max-w-xl mx-auto animate-fade-up"
          >
            <div className="flex items-center bg-wood-cream border border-wood-light rounded-full px-4 py-2.5 shadow-xs">
              <Search className="w-4 h-4 text-wood-medium mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                autoFocus
                className="bg-transparent text-sm text-wood-charcoal w-full min-w-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="text-wood-charcoal/50 hover:text-wood-dark ml-2 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Menu xổ xuống cho điện thoại & tablet */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu điều hướng di động"
          className="lg:hidden bg-wood-white border-b border-wood-light/50 px-4 sm:px-6 pt-2 pb-6 animate-fade-up max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => {
                    setPendingHref(item.href);
                    setMobileMenuOpen(false);
                  }}
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
          </div>

          <div className="max-w-7xl mx-auto pt-4 mt-3 border-t border-wood-light/40 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center justify-between sm:hidden px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium">
                {locale === "en" ? "Language" : "Ngôn ngữ"}
              </span>
              {languageSwitcher}
            </div>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-8 bg-wood-dark text-white py-3 rounded-xl font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>
                {dict.callNow}: {phone}
              </span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
