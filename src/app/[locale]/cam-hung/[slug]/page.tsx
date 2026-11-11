import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import ProductCard from "@/components/client/ProductCard";

export const dynamic = "force-dynamic";

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  const post = await prisma.post.findUnique({
    where: { slug },
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
      },
    },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const title = tField(post.titleVi, post.titleEn, locale);
  const excerpt = tField(post.excerptVi, post.excerptEn, locale);
  const content = tField(post.contentVi, post.contentEn, locale);
  const linkedProducts = post.products.map((pp) => pp.product);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <Link
        href={`/${locale}/cam-hung`}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-wood-medium hover:text-wood-dark"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {locale === "en" ? "Back to Design Journal" : "Quay lại trang Cảm hứng"}
        </span>
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-wood-medium font-medium">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.publishedAt).toLocaleDateString(
                locale === "en" ? "en-US" : "vi-VN",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-wood-dark leading-tight">
            {title}
          </h1>
          {excerpt && (
            <p className="text-base sm:text-lg text-wood-charcoal/80 font-medium leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>

        {post.coverImage && (
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-wood-cream border border-wood-light/50 shadow-sm">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-10 border border-wood-light/50 text-base sm:text-lg text-wood-charcoal/90 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </article>

      {/* Sản phẩm liên quan được gắn trong bài viết (Mục 15.4 URD) */}
      {linkedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-wood-light/50">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            {locale === "en"
              ? "Featured Pieces in This Story"
              : "Sản phẩm xuất hiện trong bài viết"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {linkedProducts.map((product) => (
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
      )}
    </div>
  );
}
