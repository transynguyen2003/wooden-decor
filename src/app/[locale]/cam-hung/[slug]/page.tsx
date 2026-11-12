import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import ProductCard from "@/components/client/ProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  // Trang chi tiết được dựng khi có người truy cập đầu tiên rồi lưu đệm (ISR), tránh quá tải DB lúc build
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";

  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublished) {
    return { title: "Bài viết không tồn tại | Wooden Decor" };
  }

  const rawTitle = tField(post.titleVi, post.titleEn, locale);
  const description =
    tField(post.excerptVi, post.excerptEn, locale) ||
    tField(post.contentVi, post.contentEn, locale);

  return buildPageMetadata({
    locale,
    path: `/cam-hung/${slug}`,
    title: rawTitle.length <= 42 ? `${rawTitle} | Wooden Decor` : rawTitle,
    description,
    image: post.coverImage || "/uploads/posts/xuong-che-tac-khung-sofa.webp",
    type: "article",
  });
}

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, post] = await Promise.all([
    getSiteConfig(locale),
    prisma.post.findUnique({
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
    }),
  ]);

  if (!post || !post.isPublished) {
    notFound();
  }

  const title = tField(post.titleVi, post.titleEn, locale);
  const excerpt = tField(post.excerptVi, post.excerptEn, locale);
  const content = tField(post.contentVi, post.contentEn, locale);
  const linkedProducts = post.products.map((pp) => pp.product);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14">
      <nav aria-label="Breadcrumb">
        <Link
          href={`/${locale}/cam-hung`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-wood-medium hover:text-wood-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {locale === "en"
              ? "Back to Design Journal"
              : "Quay lại trang Cảm hứng"}
          </span>
        </Link>
      </nav>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-wood-medium font-medium">
            <Calendar className="w-4 h-4" />
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString(
                locale === "en" ? "en-US" : "vi-VN",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </time>
          </div>
          <h1 className="font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-bold text-wood-dark">
            {title}
          </h1>
          {excerpt && (
            <p className="text-base sm:text-lg text-wood-charcoal/80 font-medium leading-relaxed">
              {excerpt}
            </p>
          )}
        </header>

        {post.coverImage && (
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-wood-cream border border-wood-light/50 shadow-sm">
            <img
              src={post.coverImage}
              alt={`${title} - Cảm hứng đồ decor gỗ thủ công Wooden Decor`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <section
          aria-label="Nội dung bài viết"
          className="bg-wood-cream/50 rounded-3xl p-5 sm:p-10 border border-wood-light/50 text-base sm:text-lg text-wood-charcoal/90 leading-relaxed whitespace-pre-line"
        >
          {content}
        </section>
      </article>

      {/* Sản phẩm liên quan được gắn trong bài viết */}
      {linkedProducts.length > 0 && (
        <section
          aria-labelledby="featured-post-products-heading"
          className="space-y-6 pt-8 border-t border-wood-light/50"
        >
          <h2
            id="featured-post-products-heading"
            className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark"
          >
            {locale === "en"
              ? "Featured Pieces in This Story"
              : "Sản phẩm xuất hiện trong bài viết"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
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
