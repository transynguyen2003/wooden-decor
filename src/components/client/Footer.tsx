import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { SiteConfig } from "@/lib/settings";
import { ZaloIcon, FacebookIcon, TikTokIcon } from "./SocialIcons";

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
    <footer className="bg-wood-cream border-t border-wood-light/60 text-wood-charcoal mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Cột 1: Thương hiệu */}
          <section aria-label={siteConfig.brandName} className="space-y-4">
            <div className="space-y-2.5">
              <img
                src={siteConfig.logoUrl || "/uploads/logo/logo-thien-an.webp"}
                alt={`${siteConfig.brandName} - Xưởng đồ decor gỗ thủ công và nội thất gỗ tự nhiên`}
                loading="lazy"
                decoding="async"
                className="h-14 sm:h-16 w-auto max-w-[250px] object-contain"
              />
              <p className="text-xs font-medium text-wood-medium">
                {siteConfig.slogan}
              </p>
            </div>
            <p className="text-sm text-wood-charcoal/80 leading-relaxed">
              {locale === "en"
                ? "Bespoke solid wood furniture handcrafted in Vietnam. Direct showroom & workshop consultation."
                : "Chế tác nội thất gỗ tự nhiên nguyên khối thủ công. Tư vấn và đặt đóng trực tiếp tại xưởng."}
            </p>
          </section>

          {/* Cột 2: Liên kết nhanh */}
          <nav aria-label={dict.footer.quickLinks}>
            <h2 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.quickLinks}
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-wood-medium transition-colors"
                >
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
          </nav>

          {/* Cột 3: Địa chỉ Showroom */}
          <section aria-label={dict.footer.address} className="space-y-4">
            <h2 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.address}
            </h2>
            <address className="not-italic flex items-start gap-3 text-sm text-wood-charcoal/85">
              <MapPin className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
              <span>{siteConfig.address}</span>
            </address>
          </section>

          {/* Cột 4: Liên hệ trực tiếp & Mạng xã hội */}
          <section aria-label={dict.footer.hotline} className="space-y-4">
            <h2 className="font-serif text-base font-semibold text-wood-dark mb-4">
              {dict.footer.hotline}
            </h2>
            <address className="not-italic space-y-4">
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
                  className="hover:text-wood-medium transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </div>
            </address>
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href={`https://zalo.me/${siteConfig.zalo.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wood-dark text-white text-xs font-medium hover:bg-wood-medium transition-colors"
              >
                <ZaloIcon className="w-4 h-4 shrink-0" />
                <span>Zalo: {siteConfig.zalo}</span>
              </a>
              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-wood-light text-xs font-medium hover:bg-wood-white transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 shrink-0" />
                  <span>Facebook</span>
                </a>
              )}
              {siteConfig.tiktokUrl && (
                <a
                  href={siteConfig.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-wood-light text-xs font-medium hover:bg-wood-white transition-colors"
                >
                  <TikTokIcon className="w-4 h-4 shrink-0" />
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </section>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-wood-light/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wood-charcoal/70 text-center sm:text-left">
          <p>{dict.footer.copyright}</p>
          <Link
            href="/admin"
            className="text-wood-medium hover:text-wood-dark underline underline-offset-4"
          >
            {locale === "en"
              ? "Store Owner Portal (/admin)"
              : "Trang Quản Trị Chủ Shop (/admin)"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
