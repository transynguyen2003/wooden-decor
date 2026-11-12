import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";

export const revalidate = 60;

export default async function InspirationListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, posts] = await Promise.all([
    getSiteConfig(locale),
    prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: {
        products: {
          include: { product: true },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <div className="bg-wood-cream rounded-3xl p-6 sm:p-10 lg:p-12 border border-wood-light/50 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
          {siteConfig.brandName}
        </span>
        <h1 className="font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-bold text-wood-dark">
          {dict.home.inspirationTitle}
        </h1>
        <p className="text-sm sm:text-base text-wood-charcoal/80 max-w-2xl">
          {dict.home.inspirationSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {posts.map((post) => {
          const title = tField(post.titleVi, post.titleEn, locale);
          const excerpt = tField(post.excerptVi, post.excerptEn, locale);
          return (
            <Link
              key={post.id}
              href={`/${locale}/cam-hung/${post.slug}`}
              className="group flex flex-col bg-wood-white rounded-2xl overflow-hidden border border-wood-light/50 hover:border-wood-medium transition-all shadow-sm"
            >
              <div className="aspect-[16/10] bg-wood-cream overflow-hidden">
                <img
                  src={post.coverImage || "/uploads/logo/logo.webp"}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-wood-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString(
                        locale === "en" ? "en-US" : "vi-VN"
                      )}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-wood-charcoal group-hover:text-wood-dark line-clamp-2">
                    {title}
                  </h2>
                  <p className="text-sm text-wood-charcoal/75 line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-wood-light/30 flex items-center justify-between text-xs font-semibold text-wood-dark">
                  <span>
                    {post.products.length > 0
                      ? `${post.products.length} ${
                          locale === "en" ? "featured products" : "sản phẩm đính kèm"
                        }`
                      : locale === "en"
                      ? "Workshop story"
                      : "Chuyện nghề mộc"}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {locale === "en" ? "Read more" : "Đọc tiếp"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
