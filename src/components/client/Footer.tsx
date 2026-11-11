import React from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { SiteConfig } from "@/lib/settings";

interface FooterProps {
  locale: Locale;
  siteConfig: SiteConfig;
  dict: {
    nav: {
      home: string;
      products: string;
      collections: string;
      inspiration: string;
      about: string;
      contact: string;
    };
    footer: {
      openingHours: string;
      address: string;
      hotline: string;
      quickLinks: string;
      copyright: string;
    };
  };
}

export default function Footer({ locale, siteConfig, dict }: FooterProps) {
  return (
    <footer className="bg-wood-cream border-t border-wood-light/60 text-wood-charcoal mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={siteConfig.logoUrl || "/uploads/logo/logo.webp"}
                alt={siteConfig.brandName}
                className="h-12 w-12 rounded-full object-cover border border-wood-light"
              />
              <div>
                <h3 className="font-serif text-xl font-bold text-wood-dark">
                  {siteConfig.brandName}
                </h3>
                <p className="text-xs text-wood-medium">{siteConfig.slogan}</p>
              </div>
            </div>
            <p className="text-sm text-wood-charcoal/80 leading-relaxed">
              {locale === "en"
                ? "Bespoke solid wood furniture handcrafted in Vietnam. Direct showroom & workshop consultation."
                : "Chế tác nội thất gỗ tự nhiên nguyên khối thủ công. Tư vấn và đặt đóng trực tiếp tại xưởng."}
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}`} className="hover:text-wood-medium transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/san-pham`}
                  className="hover:text-wood-medium transition-colors"
                >
                  {dict.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/bo-suu-tap`}
                  className="hover:text-wood-medium transition-colors"
                >
                  {dict.nav.collections}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cam-hung`}
                  className="hover:text-wood-medium transition-colors"
                >
                  {dict.nav.inspiration}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/gioi-thieu`}
                  className="hover:text-wood-medium transition-colors"
                >
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/lien-he`}
                  className="hover:text-wood-medium transition-colors"
                >
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Địa chỉ & Giờ mở cửa */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.address}
            </h4>
            <div className="flex items-start gap-3 text-sm text-wood-charcoal/85">
              <MapPin className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
              <span>{siteConfig.address}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-wood-charcoal/85">
              <Clock className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
              <div>
                <p className="font-medium text-wood-dark">{dict.footer.openingHours}</p>
                <p>{siteConfig.openingHours}</p>
              </div>
            </div>
          </div>

          {/* Cột 4: Liên hệ trực tiếp & Mạng xã hội */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.hotline}
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-wood-medium shrink-0" />
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="font-semibold text-wood-dark hover:text-wood-medium text-base"
              >
                {siteConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-wood-medium shrink-0" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-wood-medium transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://zalo.me/${siteConfig.zalo.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-wood-dark text-white text-xs font-medium hover:bg-wood-medium transition-colors"
              >
                Zalo: {siteConfig.zalo}
              </a>
              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full border border-wood-light text-xs font-medium hover:bg-wood-white transition-colors"
                >
                  Facebook
                </a>
              )}
              {siteConfig.tiktokUrl && (
                <a
                  href={siteConfig.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full border border-wood-light text-xs font-medium hover:bg-wood-white transition-colors"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-wood-light/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wood-charcoal/70">
          <p>{dict.footer.copyright}</p>
          <Link
            href="/admin"
            className="text-wood-medium hover:text-wood-dark underline underline-offset-4"
          >
            {locale === "en" ? "Store Owner Portal (/admin)" : "Trang Quản Trị Chủ Shop (/admin)"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
