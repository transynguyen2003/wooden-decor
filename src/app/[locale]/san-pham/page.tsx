import React, { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import ProductCatalogClient, {
  CatalogProductItem,
} from "@/components/client/ProductCatalogClient";

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
      ? "Handcrafted Wood Decor & Furniture Catalog | Wooden Decor"
      : "Sản Phẩm Đồ Decor Gỗ Thủ Công & Nội Thất | Wooden Decor";

  const description =
    locale === "en"
      ? "Explore our catalog of handcrafted solid wood decor, walnut sofas, infinity coffee tables, beds, and bespoke shelves crafted directly in our workshop."
      : "Khám phá danh mục đồ decor gỗ thủ công, sofa gỗ óc chó, bàn trà nguyên khối, giường ngủ và kệ trang trí chế tác tinh xảo trực tiếp tại xưởng Thiên An.";

  return buildPageMetadata({
    locale,
    path: "/san-pham",
    title,
    description,
  });
}

export default async function ProductListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, categories, collections, rawProducts] = await Promise.all([
    getSiteConfig(locale),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { isVisible: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        collections: {
          include: {
            collection: { select: { slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const products: CatalogProductItem[] = rawProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameVi: p.nameVi,
    nameEn: p.nameEn,
    price: p.price,
    isContactPrice: p.isContactPrice,
    priceNoteVi: p.priceNoteVi,
    priceNoteEn: p.priceNoteEn,
    stockStatus: p.stockStatus,
    isFeatured: p.isFeatured,
    materialVi: p.materialVi,
    materialEn: p.materialEn,
    descriptionVi: p.descriptionVi,
    descriptionEn: p.descriptionEn,
    createdAt: p.createdAt.toISOString(),
    categorySlug: p.category.slug,
    collectionSlugs: p.collections.map((c) => c.collection.slug),
    category: {
      nameVi: p.category.nameVi,
      nameEn: p.category.nameEn,
    },
    images: p.images.map((img) => ({
      url: img.url,
      altVi: img.altVi,
      altEn: img.altEn,
      isCover: img.isCover,
      sortOrder: img.sortOrder,
    })),
  }));

  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ProductCatalogClient
        locale={locale}
        brandName={siteConfig.brandName}
        usdExchangeRate={siteConfig.usdExchangeRate}
        dict={{
          nav: { searchPlaceholder: dict.nav.searchPlaceholder },
          products: dict.products,
        }}
        categories={categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          nameVi: c.nameVi,
          nameEn: c.nameEn,
        }))}
        collections={collections.map((c) => ({
          id: c.id,
          slug: c.slug,
          nameVi: c.nameVi,
          nameEn: c.nameEn,
        }))}
        products={products}
      />
    </Suspense>
  );
}
