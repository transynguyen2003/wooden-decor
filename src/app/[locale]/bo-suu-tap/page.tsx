import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import ProductCard from "@/components/client/ProductCard";

export const dynamic = "force-dynamic";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  const collections = await prisma.collection.findMany({
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
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="bg-wood-cream rounded-3xl p-8 sm:p-12 border border-wood-light/50 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
          {siteConfig.brandName}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-wood-dark">
          {dict.home.collectionsTitle}
        </h1>
        <p className="text-sm sm:text-base text-wood-charcoal/80 max-w-2xl">
          {dict.home.collectionsSubtitle}
        </p>
      </div>

      <div className="space-y-20">
        {collections.map((col) => {
          const colName = tField(col.nameVi, col.nameEn, locale);
          const colDesc = tField(col.descriptionVi, col.descriptionEn, locale);
          const items = col.products.map((pc) => pc.product);

          return (
            <section
              key={col.id}
              className="space-y-8 pb-12 border-b border-wood-light/40 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
}
