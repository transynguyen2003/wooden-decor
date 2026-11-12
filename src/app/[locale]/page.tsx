import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Ruler, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import ProductCard from "@/components/client/ProductCard";
import LazyMap from "@/components/client/LazyMap";
import VideoShowcaseSection from "@/components/client/VideoShowcaseSection";
import { ZaloIcon } from "@/components/client/SocialIcons";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, categories, collections, featuredProducts, latestPosts] =
    await Promise.all([
      getSiteConfig(locale),
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { products: { where: { isVisible: true } } } },
        },
      }),
      prisma.collection.findMany({
        where: { isFeatured: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isVisible: true, isFeatured: true },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO BANNER CỠ LỚN (Phong cách Nike.com & Apple.com - Mục 3 & 5.2 URD) */}
      <section className="relative min-h-[78vh] sm:min-h-[82vh] flex items-center overflow-hidden bg-wood-charcoal">
        <img
          src={siteConfig.heroBannerImage || "/uploads/banners/hero-phong-khach-dang-song.webp"}
          alt={siteConfig.heroTitle}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-wood-charcoal/90 via-wood-charcoal/55 to-wood-charcoal/20 sm:to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
          <div className="max-w-2xl space-y-5 sm:space-y-6 animate-fade-up">
            <span className="inline-block uppercase tracking-[0.14em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-semibold text-wood-light bg-wood-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 rounded-full border border-wood-light/30 max-w-full">
              {siteConfig.slogan}
            </span>
            <h1 className="font-serif text-[2rem] leading-[1.2] sm:text-5xl lg:text-6xl font-bold text-white sm:leading-[1.15] break-words">
              {siteConfig.heroTitle}
            </h1>
            <p className="text-sm sm:text-lg text-wood-cream/90 leading-relaxed max-w-xl">
              {siteConfig.heroSubtitle}
            </p>
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <Link
                href={`/${locale}/san-pham`}
                className="inline-flex items-center justify-center gap-3 bg-wood-medium hover:bg-wood-dark text-white font-semibold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all shadow-lg text-sm sm:text-base"
              >
                <span>{siteConfig.heroCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/lien-he`}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 font-medium px-7 py-3.5 sm:py-4 rounded-full transition-all text-sm sm:text-base"
              >
                <span>
                  {locale === "en" ? "Book Showroom Visit" : "Đặt lịch xem mẫu tại xưởng"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHỐI DANH MỤC SẢN PHẨM (Mục 5.2 URD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
              {locale === "en" ? "By Category" : "Phân loại công năng"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark">
              {dict.home.categoriesTitle}
            </h2>
            <p className="text-wood-charcoal/75 text-sm sm:text-base">
              {dict.home.categoriesSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/san-pham`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium transition-colors"
          >
            <span>{dict.home.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const catName = tField(cat.nameVi, cat.nameEn, locale);
            const catDesc = tField(cat.descriptionVi, cat.descriptionEn, locale);
            return (
              <Link
                key={cat.id}
                href={`/${locale}/san-pham?category=${cat.slug}`}
                className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-wood-cream border border-wood-light/40 shadow-sm"
              >
                <img
                  src={cat.imageUrl || "/uploads/logo/logo.webp"}
                  alt={catName}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-charcoal/85 via-wood-charcoal/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-6 text-white">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-wood-light">
                    {cat._count.products} {locale === "en" ? "items" : "sản phẩm"}
                  </span>
                  <h3 className="font-serif text-sm sm:text-xl font-bold mt-1 leading-snug group-hover:text-wood-light transition-colors">
                    {catName}
                  </h3>
                  <p className="hidden sm:block text-xs text-white/80 mt-1.5 line-clamp-2">{catDesc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. KHỐI SẢN PHẨM NỔI BẬT (Mục 5.2 URD) */}
      <section className="bg-wood-cream/65 py-14 sm:py-20 border-y border-wood-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
                {locale === "en" ? "Curated Selection" : "Chủ xưởng tuyển chọn"}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark">
                {dict.home.featuredTitle}
              </h2>
              <p className="text-wood-charcoal/75 text-sm sm:text-base">
                {dict.home.featuredSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/san-pham`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium transition-colors"
            >
              <span>{dict.home.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                usdExchangeRate={siteConfig.usdExchangeRate}
                outOfStockLabel={dict.products.outOfStock}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. KHỐI VIDEO THỰC TẾ TẠI XƯỞNG & SHOWROOM */}
      <VideoShowcaseSection videos={siteConfig.showcaseVideos} locale={locale} />

      {/* 4. KHỐI BỘ SƯU TẬP NỔI BẬT (Mục 15.2 & 15.6 URD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
              {locale === "en" ? "Collections" : "Bộ sưu tập theo phong cách"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark">
              {dict.home.collectionsTitle}
            </h2>
            <p className="text-wood-charcoal/75 text-sm sm:text-base">
              {dict.home.collectionsSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/bo-suu-tap`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium transition-colors"
          >
            <span>{dict.home.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {collections.map((col) => {
            const colName = tField(col.nameVi, col.nameEn, locale);
            const colDesc = tField(col.descriptionVi, col.descriptionEn, locale);
            return (
              <Link
                key={col.id}
                href={`/${locale}/san-pham?collection=${col.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-wood-cream border border-wood-light/50 hover:border-wood-medium transition-all shadow-sm"
              >
                <div className="aspect-[16/10] overflow-hidden bg-wood-light/20">
                  <img
                    src={col.imageUrl || "/uploads/logo/logo.webp"}
                    alt={colName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-wood-dark group-hover:text-wood-medium transition-colors">
                      {colName}
                    </h3>
                    <p className="text-sm text-wood-charcoal/80 mt-2 leading-relaxed">
                      {colDesc}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-wood-dark">
                    {dict.home.exploreProducts} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. CÂU CHUYỆN CHẾ TÁC THỦ CÔNG TẠI XƯỞNG (Phong cách Apple.com - Mục 3 & 5.2 URD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-wood-cream border border-wood-light/60 p-5 sm:p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
              {locale === "en" ? "Direct from Our Workshop" : "Trực tiếp từ xưởng mộc Wooden Decor"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark leading-tight">
              {dict.home.craftTitle}
            </h2>
            <p className="text-wood-charcoal/80 leading-relaxed text-sm sm:text-base">
              {dict.home.craftSubtitle}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-wood-white border border-wood-light text-wood-dark">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-wood-dark">{dict.home.craftPoint1Title}</h4>
                  <p className="text-xs sm:text-sm text-wood-charcoal/75 mt-0.5">
                    {dict.home.craftPoint1Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-wood-white border border-wood-light text-wood-dark">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-wood-dark">{dict.home.craftPoint2Title}</h4>
                  <p className="text-xs sm:text-sm text-wood-charcoal/75 mt-0.5">
                    {dict.home.craftPoint2Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-wood-white border border-wood-light text-wood-dark">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-wood-dark">{dict.home.craftPoint3Title}</h4>
                  <p className="text-xs sm:text-sm text-wood-charcoal/75 mt-0.5">
                    {dict.home.craftPoint3Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/${locale}/gioi-thieu`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium underline underline-offset-4"
              >
                <span>
                  {locale === "en"
                    ? "Read our full workshop story →"
                    : "Xem câu chuyện xưởng mộc Wooden Decor →"}
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="/uploads/posts/xuong-che-tac-khung-sofa.webp"
              alt="Xưởng chế tác khung sofa gỗ"
              loading="lazy"
              className="rounded-2xl object-cover aspect-[4/5] w-full shadow-sm border border-wood-light/40"
            />
            <img
              src="/uploads/products/giuong-ngu-go-oc-cho-duong-cong-1.webp"
              alt="Nghệ nhân chà nhám thủ công tại xưởng"
              loading="lazy"
              className="rounded-2xl object-cover aspect-[4/5] w-full mt-8 shadow-sm border border-wood-light/40"
            />
          </div>
        </div>
      </section>

      {/* 6. KHỐI BÀI ĐĂNG CẢM HỨNG & NHẬT KÝ XƯỞNG MỚI NHẤT (Mục 15.4 URD) */}
      {latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
                {locale === "en" ? "Daily Workshop Journal" : "Cập nhật hằng ngày"}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark">
                {dict.home.inspirationTitle}
              </h2>
              <p className="text-wood-charcoal/75 text-sm sm:text-base">
                {dict.home.inspirationSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/cam-hung`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium transition-colors"
            >
              <span>{dict.home.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {latestPosts.map((post) => {
              const title = tField(post.titleVi, post.titleEn, locale);
              const excerpt = tField(post.excerptVi, post.excerptEn, locale);
              return (
                <Link
                  key={post.id}
                  href={`/${locale}/cam-hung/${post.slug}`}
                  className="group flex flex-col bg-wood-white rounded-2xl overflow-hidden border border-wood-light/50 hover:border-wood-medium transition-all"
                >
                  <div className="aspect-[16/10] bg-wood-cream overflow-hidden">
                    <img
                      src={post.coverImage || "/uploads/logo/logo.webp"}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs text-wood-medium">
                        {new Date(post.publishedAt).toLocaleDateString(
                          locale === "en" ? "en-US" : "vi-VN"
                        )}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-wood-charcoal group-hover:text-wood-dark mt-1 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-sm text-wood-charcoal/75 mt-2 line-clamp-3">
                        {excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-wood-dark group-hover:translate-x-1 transition-transform">
                      {locale === "en" ? "Read article →" : "Đọc bài viết →"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. KHỐI LIÊN HỆ & BẢN ĐỒ SHOWROOM (Mục 5.2 URD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-wood-dark text-white p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {dict.home.contactBannerTitle}
            </h2>
            <p className="text-wood-cream/85 text-sm sm:text-base leading-relaxed">
              {dict.home.contactBannerSubtitle}
            </p>
            <div className="space-y-2 text-sm text-wood-cream/90 pt-1">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-wood-light shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </p>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 bg-wood-medium hover:bg-wood-light hover:text-wood-charcoal text-white font-semibold px-6 py-3.5 rounded-full transition-colors text-sm justify-center"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {dict.nav.callNow}: {siteConfig.phone}
                </span>
              </a>
              <a
                href={`https://zalo.me/${siteConfig.zalo.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-wood-dark hover:bg-wood-cream font-semibold px-6 py-3.5 rounded-full transition-colors text-sm justify-center"
              >
                <ZaloIcon className="w-4 h-4 shrink-0" />
                <span>{dict.nav.chatZalo}</span>
              </a>
              <Link
                href={`/${locale}/lien-he`}
                className="inline-flex items-center gap-2 border border-wood-light/50 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-full transition-colors text-sm justify-center"
              >
                <span>{dict.inquiry.title}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-wood-light/30 h-64 sm:h-72 bg-wood-cream">
            <LazyMap
              src={siteConfig.mapEmbedUrl}
              title="Wooden Decor Showroom Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
