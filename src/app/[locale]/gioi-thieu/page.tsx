import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Ruler, Phone, MapPin, Clock } from "lucide-react";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Khối mở đầu câu chuyện */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
            {siteConfig.brandName}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-wood-dark leading-tight">
            {siteConfig.aboutTitle}
          </h1>
          <div className="text-sm sm:text-base text-wood-charcoal/85 leading-relaxed whitespace-pre-line space-y-4">
            {siteConfig.aboutStory}
          </div>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/san-pham`}
              className="bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              {dict.home.exploreProducts}
            </Link>
            <Link
              href={`/${locale}/lien-he`}
              className="bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light text-sm font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img
            src="/uploads/posts/xuong-che-tac-khung-sofa.webp"
            alt="Xưởng mộc Wooden Decor"
            className="rounded-2xl object-cover aspect-[4/5] w-full shadow-md border border-wood-light/50"
          />
          <img
            src="/uploads/products/giuong-ngu-go-cham-khac-hoang-gia-2.webp"
            alt="Chạm khắc gỗ thủ công"
            className="rounded-2xl object-cover aspect-[4/5] w-full mt-8 shadow-md border border-wood-light/50"
          />
        </div>
      </div>

      {/* 3 Giá trị cốt lõi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-wood-cream rounded-2xl p-8 border border-wood-light/50 space-y-3">
          <ShieldCheck className="w-8 h-8 text-wood-dark" />
          <h3 className="font-serif text-xl font-bold text-wood-dark">
            {dict.home.craftPoint1Title}
          </h3>
          <p className="text-sm text-wood-charcoal/80 leading-relaxed">
            {dict.home.craftPoint1Desc}
          </p>
        </div>

        <div className="bg-wood-cream rounded-2xl p-8 border border-wood-light/50 space-y-3">
          <Sparkles className="w-8 h-8 text-wood-dark" />
          <h3 className="font-serif text-xl font-bold text-wood-dark">
            {dict.home.craftPoint2Title}
          </h3>
          <p className="text-sm text-wood-charcoal/80 leading-relaxed">
            {dict.home.craftPoint2Desc}
          </p>
        </div>

        <div className="bg-wood-cream rounded-2xl p-8 border border-wood-light/50 space-y-3">
          <Ruler className="w-8 h-8 text-wood-dark" />
          <h3 className="font-serif text-xl font-bold text-wood-dark">
            {dict.home.craftPoint3Title}
          </h3>
          <p className="text-sm text-wood-charcoal/80 leading-relaxed">
            {dict.home.craftPoint3Desc}
          </p>
        </div>
      </div>

      {/* Thông tin xưởng & Bản đồ */}
      <div className="rounded-3xl bg-wood-cream border border-wood-light/60 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            {locale === "en" ? "Visit Our Showroom & Workshop" : "Ghé thăm Showroom & Xưởng chế tác"}
          </h2>
          <p className="flex items-start gap-3 text-sm text-wood-charcoal/85">
            <MapPin className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
            <span>{siteConfig.address}</span>
          </p>
          <p className="flex items-start gap-3 text-sm text-wood-charcoal/85">
            <Clock className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
            <span>{siteConfig.openingHours}</span>
          </p>
          <p className="flex items-center gap-3 text-sm font-semibold text-wood-dark">
            <Phone className="w-5 h-5 text-wood-medium shrink-0" />
            <span>{siteConfig.phone}</span>
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-wood-light h-72 bg-wood-white">
          <iframe
            src={siteConfig.mapEmbedUrl}
            title="Showroom Map"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
