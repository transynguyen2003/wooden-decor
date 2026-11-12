"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Locale, tField } from "@/lib/i18n";
import ProductCard, { ProductCardData } from "@/components/client/ProductCard";

export interface CatalogProductItem extends ProductCardData {
  materialVi: string;
  materialEn: string;
  descriptionVi: string;
  descriptionEn: string;
  createdAt: string;
  categorySlug: string;
  collectionSlugs: string[];
}

export interface CatalogCategoryItem {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
}

export interface CatalogCollectionItem {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
}

interface ProductCatalogClientProps {
  locale: Locale;
  brandName: string;
  usdExchangeRate: number;
  dict: {
    nav: {
      searchPlaceholder: string;
    };
    products: {
      title: string;
      subtitle: string;
      filterCategory: string;
      allCategories: string;
      filterCollection: string;
      allCollections: string;
      filterPrice: string;
      priceAll: string;
      priceUnder30M: string;
      price30To70M: string;
      priceOver70M: string;
      priceContact: string;
      sortBy: string;
      sortNewest: string;
      sortPriceAsc: string;
      sortPriceDesc: string;
      showingCount: string;
      resetFilters: string;
      noProducts: string;
      outOfStock: string;
      loadMore: string;
    };
  };
  categories: CatalogCategoryItem[];
  collections: CatalogCollectionItem[];
  products: CatalogProductItem[];
}

const PAGE_SIZE = 9;

export default function ProductCatalogClient({
  locale,
  brandName,
  usdExchangeRate,
  dict,
  categories,
  collections,
  products,
}: ProductCatalogClientProps) {
  const searchParams = useSearchParams();

  const [categorySlug, setCategorySlug] = useState(
    () => searchParams.get("category") || ""
  );
  const [collectionSlug, setCollectionSlug] = useState(
    () => searchParams.get("collection") || ""
  );
  const [priceRange, setPriceRange] = useState(
    () => searchParams.get("price") || "all"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "newest"
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [currentPage, setCurrentPage] = useState(() =>
    Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
  );

  // Đồng bộ khi người dùng điều hướng từ thanh tìm kiếm trên Navbar hoặc link bên ngoài
  useEffect(() => {
    setCategorySlug(searchParams.get("category") || "");
    setCollectionSlug(searchParams.get("collection") || "");
    setPriceRange(searchParams.get("price") || "all");
    setSortBy(searchParams.get("sort") || "newest");
    setSearchQuery(searchParams.get("q") || "");
    setCurrentPage(
      Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
    );
  }, [searchParams]);

  const syncUrlParams = (next: {
    category?: string;
    collection?: string;
    price?: string;
    sort?: string;
    q?: string;
    page?: number;
  }) => {
    if (typeof window === "undefined") return;
    const cat = next.category !== undefined ? next.category : categorySlug;
    const col = next.collection !== undefined ? next.collection : collectionSlug;
    const pr = next.price !== undefined ? next.price : priceRange;
    const sr = next.sort !== undefined ? next.sort : sortBy;
    const qVal = (next.q !== undefined ? next.q : searchQuery).trim();
    const pg = next.page !== undefined ? next.page : currentPage;

    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (col) params.set("collection", col);
    if (pr && pr !== "all") params.set("price", pr);
    if (sr && sr !== "newest") params.set("sort", sr);
    if (qVal) params.set("q", qVal);
    if (pg > 1) params.set("page", String(pg));

    const qs = params.toString();
    const newUrl = qs ? `/${locale}/san-pham?${qs}` : `/${locale}/san-pham`;
    window.history.replaceState(null, "", newUrl);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = products.filter((item) => {
      if (categorySlug && item.categorySlug !== categorySlug) {
        return false;
      }
      if (collectionSlug && !item.collectionSlugs.includes(collectionSlug)) {
        return false;
      }
      if (q) {
        const haystack = `${item.nameVi} ${item.nameEn} ${item.materialVi} ${item.materialEn} ${item.descriptionVi} ${item.descriptionEn}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (priceRange === "under30") {
        if (item.isContactPrice || item.price === null || item.price >= 30000000) {
          return false;
        }
      } else if (priceRange === "30to70") {
        if (
          item.isContactPrice ||
          item.price === null ||
          item.price < 30000000 ||
          item.price > 70000000
        ) {
          return false;
        }
      } else if (priceRange === "over70") {
        if (item.isContactPrice || item.price === null || item.price <= 70000000) {
          return false;
        }
      } else if (priceRange === "contact") {
        if (!item.isContactPrice) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === "price_asc") {
      return [...matched].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sortBy === "price_desc") {
      return [...matched].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return matched;
  }, [products, categorySlug, collectionSlug, priceRange, sortBy, searchQuery]);

  const totalCount = filteredProducts.length;
  const visibleProducts = filteredProducts.slice(0, currentPage * PAGE_SIZE);
  const hasMore = visibleProducts.length < totalCount;

  const resetAllFilters = () => {
    setCategorySlug("");
    setCollectionSlug("");
    setPriceRange("all");
    setSortBy("newest");
    setSearchQuery("");
    setCurrentPage(1);
    syncUrlParams({
      category: "",
      collection: "",
      price: "all",
      sort: "newest",
      q: "",
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-10">
      {/* Tiêu đề trang */}
      <div className="bg-wood-cream rounded-3xl p-6 sm:p-10 lg:p-12 border border-wood-light/50 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
            {brandName}
          </span>
          <h1 className="font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-bold text-wood-dark">
            {dict.products.title}
          </h1>
          <p className="text-sm sm:text-base text-wood-charcoal/80">
            {dict.products.subtitle}
          </p>
        </div>

        {/* Ô tìm kiếm tức thì trên trang sản phẩm */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
            syncUrlParams({ q: searchQuery, page: 1 });
          }}
          className="flex items-center bg-wood-white border border-wood-light rounded-full px-4 py-2.5 w-full lg:w-80 shadow-sm"
        >
          <Search className="w-4 h-4 text-wood-medium mr-2.5 shrink-0" />
          <input
            type="text"
            name="q"
            value={searchQuery}
            onChange={(e) => {
              const nextQ = e.target.value;
              setSearchQuery(nextQ);
              setCurrentPage(1);
              syncUrlParams({ q: nextQ, page: 1 });
            }}
            placeholder={dict.nav.searchPlaceholder}
            className="bg-transparent text-sm text-wood-charcoal w-full focus:outline-none"
          />
        </form>
      </div>

      {/* Bộ lọc nhanh 0ms theo Danh mục, Bộ sưu tập, Khoảng giá & Sắp xếp */}
      <div className="space-y-4 sm:space-y-5 bg-wood-white rounded-2xl p-4 sm:p-6 border border-wood-light/50 shadow-sm">
        {/* Hàng 1: Lọc Danh mục */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium mr-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {dict.products.filterCategory}:
          </span>
          <button
            type="button"
            onClick={() => {
              setCategorySlug("");
              setCurrentPage(1);
              syncUrlParams({ category: "", page: 1 });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              !categorySlug
                ? "bg-wood-dark text-white"
                : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
            }`}
          >
            {dict.products.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategorySlug(cat.slug);
                setCurrentPage(1);
                syncUrlParams({ category: cat.slug, page: 1 });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                categorySlug === cat.slug
                  ? "bg-wood-dark text-white"
                  : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
              }`}
            >
              {tField(cat.nameVi, cat.nameEn, locale)}
            </button>
          ))}
        </div>

        {/* Hàng 2: Lọc Bộ sưu tập */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-wood-light/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium mr-2">
            {dict.products.filterCollection}:
          </span>
          <button
            type="button"
            onClick={() => {
              setCollectionSlug("");
              setCurrentPage(1);
              syncUrlParams({ collection: "", page: 1 });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              !collectionSlug
                ? "bg-wood-medium text-white"
                : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
            }`}
          >
            {dict.products.allCollections}
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => {
                setCollectionSlug(col.slug);
                setCurrentPage(1);
                syncUrlParams({ collection: col.slug, page: 1 });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                collectionSlug === col.slug
                  ? "bg-wood-medium text-white"
                  : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
              }`}
            >
              {tField(col.nameVi, col.nameEn, locale)}
            </button>
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
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPriceRange(p.id);
                  setCurrentPage(1);
                  syncUrlParams({ price: p.id, page: 1 });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  priceRange === p.id
                    ? "bg-wood-charcoal text-white"
                    : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-wood-medium">
              {dict.products.sortBy}:
            </span>
            {[
              { id: "newest", label: dict.products.sortNewest },
              { id: "price_asc", label: dict.products.sortPriceAsc },
              { id: "price_desc", label: dict.products.sortPriceDesc },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSortBy(s.id);
                  syncUrlParams({ sort: s.id });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === s.id
                    ? "bg-wood-dark text-white"
                    : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả hiển thị */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-wood-charcoal/70">
        <p>
          {dict.products.showingCount} <strong>{visibleProducts.length}</strong> /{" "}
          <strong>{totalCount}</strong>{" "}
          {locale === "en" ? "products" : "sản phẩm"}
          {searchQuery.trim() ? ` ("${searchQuery.trim()}")` : ""}
        </p>
        {(categorySlug ||
          collectionSlug ||
          priceRange !== "all" ||
          searchQuery.trim()) && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 text-wood-medium hover:text-wood-dark font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{dict.products.resetFilters}</span>
          </button>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-3xl bg-wood-cream/70 border border-wood-light/50 p-8 sm:p-16 text-center space-y-4">
          <p className="font-serif text-xl text-wood-dark">
            {dict.products.noProducts}
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 bg-wood-dark text-white text-xs font-semibold px-6 py-3 rounded-full cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{dict.products.resetFilters}</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                usdExchangeRate={usdExchangeRate}
                outOfStockLabel={dict.products.outOfStock}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={() => {
                  const nextPg = currentPage + 1;
                  setCurrentPage(nextPg);
                  syncUrlParams({ page: nextPg });
                }}
                className="inline-flex items-center gap-2 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light font-semibold px-8 py-3.5 rounded-full transition-colors text-sm cursor-pointer"
              >
                <span>{dict.products.loadMore}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
