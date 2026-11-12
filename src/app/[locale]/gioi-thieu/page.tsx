import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Ruler, Phone, MapPin } from "lucide-react";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import LazyMap from "@/components/client/LazyMap";
import VideoShowcaseSection from "@/components/client/VideoShowcaseSection";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";

  const title =
    locale === "en"
      ? "Our Handcrafted Wood Decor Workshop | Wooden Decor"
      : "Câu Chuyện Xưởng Đồ Decor Gỗ Thủ Công | Wooden Decor";

  const description =
    locale === "en"
      ? "Over 15 years preserving the soul of natural timber at Wooden Decor workshop: handcrafted solid wood decor, mortise-and-tenon joinery, and fine sanding."
      : "Hơn 15 năm giữ hồn gỗ tự nhiên Việt Nam tại xưởng Wooden Decor Thiên An: chế tác đồ decor gỗ thủ công, ghép mộng truyền thống và chà nhám tỉ mỉ.";

  return buildPageMetadata({
    locale,
    path: "/gioi-thieu",
    title,
    description,
    image: "/uploads/posts/xuong-che-tac-khung-sofa.webp",
  });
}

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
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20">
      {/* Khối mở đầu câu chuyện */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
            {siteConfig.brandName}
          </span>
          <h1 className="font-serif text-[1.75rem] sm:text-4xl lg:text-5xl font-bold text-wood-dark leading-tight">
            {siteConfig.aboutTitle}
          </h1>
          <div className="text-sm sm:text-base text-wood-charcoal/85 leading-relaxed whitespace-pre-line space-y-4">
            {siteConfig.aboutStory}
          </div>
          <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <Link
              href={`/${locale}/san-pham`}
              className="bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-colors text-center"
            >
              {dict.home.exploreProducts}
            </Link>
            <Link
              href={`/${locale}/lien-he`}
              className="bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light text-sm font-semibold px-7 py-3.5 rounded-full transition-colors text-center"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img
            src="/uploads/posts/xuong-che-tac-khung-sofa.webp"
            alt="Xưởng mộc Wooden Decor chế tác đồ decor gỗ thủ công và nội thất gỗ tự nhiên"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="rounded-2xl object-cover aspect-[4/5] w-full shadow-md border border-wood-light/50"
          />
          <img
            src="/uploads/products/giuong-ngu-go-cham-khac-hoang-gia-2.webp"
            alt="Nghệ nhân chạm khắc đồ decor gỗ thủ công nguyên khối tại xưởng Wooden Decor"
            loading="lazy"
            decoding="async"
            className="rounded-2xl object-cover aspect-[4/5] w-full mt-8 shadow-md border border-wood-light/50"
          />
        </div>
      </header>

      {/* 3 Giá trị cốt lõi */}
      <section aria-labelledby="about-core-values-heading" className="space-y-6">
        <h2
          id="about-core-values-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark"
        >
          {locale === "en"
            ? "Our Core Craftsmanship Values"
            : "Giá Trị Cốt Lõi Tại Xưởng Chế Tác"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          <article className="bg-wood-cream rounded-2xl p-6 sm:p-8 border border-wood-light/50 space-y-3">
            <ShieldCheck className="w-8 h-8 text-wood-dark" />
            <h3 className="font-serif text-xl font-bold text-wood-dark">
              {dict.home.craftPoint1Title}
            </h3>
            <p className="text-sm text-wood-charcoal/80 leading-relaxed">
              {dict.home.craftPoint1Desc}
            </p>
          </article>

          <article className="bg-wood-cream rounded-2xl p-6 sm:p-8 border border-wood-light/50 space-y-3">
            <Sparkles className="w-8 h-8 text-wood-dark" />
            <h3 className="font-serif text-xl font-bold text-wood-dark">
              {dict.home.craftPoint2Title}
            </h3>
            <p className="text-sm text-wood-charcoal/80 leading-relaxed">
              {dict.home.craftPoint2Desc}
            </p>
          </article>

          <article className="bg-wood-cream rounded-2xl p-6 sm:p-8 border border-wood-light/50 space-y-3">
            <Ruler className="w-8 h-8 text-wood-dark" />
            <h3 className="font-serif text-xl font-bold text-wood-dark">
              {dict.home.craftPoint3Title}
            </h3>
            <p className="text-sm text-wood-charcoal/80 leading-relaxed">
              {dict.home.craftPoint3Desc}
            </p>
          </article>
        </div>
      </section>

      {/* Video thực tế tại xưởng */}
      <VideoShowcaseSection videos={siteConfig.showcaseVideos} locale={locale} />

      {/* Thông tin xưởng & Bản đồ */}
      <section
        aria-labelledby="about-showroom-heading"
        className="rounded-3xl bg-wood-cream border border-wood-light/60 p-5 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <div className="lg:col-span-6 space-y-4">
          <h2
            id="about-showroom-heading"
            className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark"
          >
            {locale === "en"
              ? "Visit Our Showroom & Workshop"
              : "Ghé thăm Showroom & Xưởng chế tác"}
          </h2>
          <address className="not-italic space-y-4">
            <p className="flex items-start gap-3 text-sm text-wood-charcoal/85">
              <MapPin className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
              <span>{siteConfig.address}</span>
            </p>
            <p className="flex items-center gap-3 text-sm font-semibold text-wood-dark">
              <Phone className="w-5 h-5 text-wood-medium shrink-0" />
              <span>{siteConfig.phone}</span>
            </p>
          </address>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-wood-light h-72 bg-wood-white">
          <LazyMap src={siteConfig.mapEmbedUrl} title="Showroom Map" />
        </div>
      </section>
    </article>
  );
}
