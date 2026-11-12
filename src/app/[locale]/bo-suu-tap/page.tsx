import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import ProductCard from "@/components/client/ProductCard";

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
      ? "Handcrafted Wood Decor Collections | Wooden Decor"
      : "Bộ Sưu Tập Đồ Decor Gỗ Thủ Công Cao Cấp | Wooden Decor";

  const description =
    locale === "en"
      ? "Curated collections of handcrafted solid wood decor and bespoke furniture for living rooms, bedrooms, and luxury villas by Wooden Decor."
      : "Tuyển tập các bộ sưu tập đồ decor gỗ thủ công và nội thất gỗ tự nhiên theo không gian phòng khách, phòng ngủ, biệt thự nghỉ dưỡng sang trọng ấm cúng.";

  return buildPageMetadata({
    locale,
    path: "/bo-suu-tap",
    title,
    description,
  });
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, collections] = await Promise.all([
    getSiteConfig(locale),
    prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { product: { isVisible: true } },
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } },
              },
            },
          },
          take: 3,
        },
      },
    }),
  ]);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16">
      <header className="bg-wood-cream rounded-3xl p-6 sm:p-10 lg:p-12 border border-wood-light/50 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
          {siteConfig.brandName}
        </span>
        <h1 className="font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-bold text-wood-dark">
          {dict.home.collectionsTitle}
        </h1>
        <p className="text-sm sm:text-base text-wood-charcoal/80 max-w-2xl">
          {dict.home.collectionsSubtitle}
        </p>
      </header>

      <div className="space-y-12 sm:space-y-20">
        {collections.map((col) => {
          const colName = tField(col.nameVi, col.nameEn, locale);
          const colDesc = tField(col.descriptionVi, col.descriptionEn, locale);
          const items = col.products.map((pc) => pc.product);

          return (
            <section
              key={col.id}
              aria-labelledby={`collection-heading-${col.slug}`}
              className="space-y-6 sm:space-y-8 pb-10 sm:pb-12 border-b border-wood-light/40 last:border-b-0"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h2
                    id={`collection-heading-${col.slug}`}
                    className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark"
                  >
                    {colName}
                  </h2>
                  <p className="text-sm sm:text-base text-wood-charcoal/75">
                    {colDesc}
                  </p>
                </div>
                <Link
                  href={`/${locale}/san-pham?collection=${col.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-wood-dark hover:text-wood-medium"
                >
                  <span>
                    {locale === "en"
                      ? `View all in ${colName}`
                      : `Xem trọn bộ sưu tập`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    usdExchangeRate={siteConfig.usdExchangeRate}
                    outOfStockLabel={dict.products.outOfStock}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
