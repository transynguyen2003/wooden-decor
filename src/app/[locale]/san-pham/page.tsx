import React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale, tField } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import ProductCard from "@/components/client/ProductCard";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProductListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    collection?: string;
    price?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const filters = await searchParams;
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  const categorySlug = filters.category || "";
  const collectionSlug = filters.collection || "";
  const priceRange = filters.price || "all";
  const sortBy = filters.sort || "newest";
  const searchQuery = (filters.q || "").trim();
  const currentPage = Math.max(1, parseInt(filters.page || "1", 10) || 1);
  const pageSize = 9;

  // Điều kiện lọc chỉ lấy sản phẩm đang hiển thị (Mục 5.3 URD)
  const where: Prisma.ProductWhereInput = {
    isVisible: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (collectionSlug) {
    where.collections = {
      some: {
        collection: { slug: collectionSlug },
      },
    };
  }

  if (searchQuery) {
    where.OR = [
      { nameVi: { contains: searchQuery } },
      { nameEn: { contains: searchQuery } },
      { materialVi: { contains: searchQuery } },
      { descriptionVi: { contains: searchQuery } },
    ];
  }

  if (priceRange === "under30") {
    where.isContactPrice = false;
    where.price = { lt: 30000000 };
  } else if (priceRange === "30to70") {
    where.isContactPrice = false;
    where.price = { gte: 30000000, lte: 70000000 };
  } else if (priceRange === "over70") {
    where.isContactPrice = false;
    where.price = { gt: 70000000 };
  } else if (priceRange === "contact") {
    where.isContactPrice = true;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price_desc") {
    orderBy = { price: "desc" };
  }

  const [categories, collections, totalCount, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy,
      take: currentPage * pageSize,
    }),
  ]);

  const hasMore = products.length < totalCount;

  const buildFilterUrl = (nextParams: Record<string, string | undefined>) => {
    const merged: Record<string, string> = {
      ...(categorySlug ? { category: categorySlug } : {}),
      ...(collectionSlug ? { collection: collectionSlug } : {}),
      ...(priceRange !== "all" ? { price: priceRange } : {}),
      ...(sortBy !== "newest" ? { sort: sortBy } : {}),
      ...(searchQuery ? { q: searchQuery } : {}),
    };

    for (const [k, v] of Object.entries(nextParams)) {
      if (!v || v === "all") {
        delete merged[k];
      } else {
        merged[k] = v;
      }
    }

    const qs = new URLSearchParams(merged).toString();
    return qs ? `/${locale}/san-pham?${qs}` : `/${locale}/san-pham`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Tiêu đề trang */}
      <div className="bg-wood-cream rounded-3xl p-8 sm:p-12 border border-wood-light/50 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
            {siteConfig.brandName}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-wood-dark">
            {dict.products.title}
          </h1>
          <p className="text-sm sm:text-base text-wood-charcoal/80">
            {dict.products.subtitle}
          </p>
        </div>

        {/* Ô tìm kiếm trực tiếp trên trang sản phẩm */}
        <form
          action={`/${locale}/san-pham`}
          method="GET"
          className="flex items-center bg-wood-white border border-wood-light rounded-full px-4 py-2.5 w-full lg:w-80 shadow-sm"
        >
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {collectionSlug && <input type="hidden" name="collection" value={collectionSlug} />}
          {priceRange !== "all" && <input type="hidden" name="price" value={priceRange} />}
          {sortBy !== "newest" && <input type="hidden" name="sort" value={sortBy} />}
          <Search className="w-4 h-4 text-wood-medium mr-2.5 shrink-0" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder={dict.nav.searchPlaceholder}
            className="bg-transparent text-sm text-wood-charcoal w-full focus:outline-none"
          />
        </form>
      </div>

      {/* Bộ lọc nhanh theo Danh mục, Bộ sưu tập, Khoảng giá & Sắp xếp (Mục 3, 5.3, 15.2 URD) */}
      <div className="space-y-5 bg-wood-white rounded-2xl p-6 border border-wood-light/50 shadow-sm">
        {/* Hàng 1: Lọc Danh mục */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium mr-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {dict.products.filterCategory}:
          </span>
          <Link
            href={buildFilterUrl({ category: undefined, page: undefined })}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !categorySlug
                ? "bg-wood-dark text-white"
                : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
            }`}
          >
            {dict.products.allCategories}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildFilterUrl({ category: cat.slug, page: undefined })}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                categorySlug === cat.slug
                  ? "bg-wood-dark text-white"
                  : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
              }`}
            >
              {tField(cat.nameVi, cat.nameEn, locale)}
            </Link>
          ))}
        </div>

        {/* Hàng 2: Lọc Bộ sưu tập */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-wood-light/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium mr-2">
            {dict.products.filterCollection}:
          </span>
          <Link
            href={buildFilterUrl({ collection: undefined, page: undefined })}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !collectionSlug
                ? "bg-wood-medium text-white"
                : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
            }`}
          >
            {dict.products.allCollections}
          </Link>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={buildFilterUrl({ collection: col.slug, page: undefined })}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                collectionSlug === col.slug
                  ? "bg-wood-medium text-white"
                  : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
              }`}
            >
              {tField(col.nameVi, col.nameEn, locale)}
            </Link>
          ))}
        </div>

        {/* Hàng 3: Khoảng giá & Sắp xếp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-wood-light/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium mr-2">
              {dict.products.filterPrice}:
            </span>
            {[
              { id: "all", label: dict.products.priceAll },
              { id: "under30", label: dict.products.priceUnder30M },
              { id: "30to70", label: dict.products.price30To70M },
              { id: "over70", label: dict.products.priceOver70M },
              { id: "contact", label: dict.products.priceContact },
            ].map((p) => (
              <Link
                key={p.id}
                href={buildFilterUrl({ price: p.id, page: undefined })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  priceRange === p.id
                    ? "bg-wood-charcoal text-white"
                    : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium">
              {dict.products.sortBy}:
            </span>
            {[
              { id: "newest", label: dict.products.sortNewest },
              { id: "price_asc", label: dict.products.sortPriceAsc },
              { id: "price_desc", label: dict.products.sortPriceDesc },
            ].map((s) => (
              <Link
                key={s.id}
                href={buildFilterUrl({ sort: s.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sortBy === s.id
                    ? "bg-wood-dark text-white"
                    : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả hiển thị */}
      <div className="flex items-center justify-between text-xs text-wood-charcoal/70">
        <p>
          {dict.products.showingCount} <strong>{products.length}</strong> /{" "}
          <strong>{totalCount}</strong>{" "}
          {locale === "en" ? "products" : "sản phẩm"}
          {searchQuery ? ` ("${searchQuery}")` : ""}
        </p>
        {(categorySlug || collectionSlug || priceRange !== "all" || searchQuery) && (
          <Link
            href={`/${locale}/san-pham`}
            className="inline-flex items-center gap-1.5 text-wood-medium hover:text-wood-dark font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{dict.products.resetFilters}</span>
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl bg-wood-cream/70 border border-wood-light/50 p-16 text-center space-y-4">
          <p className="font-serif text-xl text-wood-dark">
            {dict.products.noProducts}
          </p>
          <Link
            href={`/${locale}/san-pham`}
            className="inline-flex items-center gap-2 bg-wood-dark text-white text-xs font-semibold px-6 py-3 rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{dict.products.resetFilters}</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                usdExchangeRate={siteConfig.usdExchangeRate}
                outOfStockLabel={dict.products.outOfStock}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-6">
              <Link
                href={buildFilterUrl({ page: String(currentPage + 1) })}
                className="inline-flex items-center gap-2 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                <span>{dict.products.loadMore}</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
