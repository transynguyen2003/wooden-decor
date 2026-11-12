import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Phone, CheckCircle2, Layers, Box, Tag } from "lucide-react";
import { ZaloIcon } from "@/components/client/SocialIcons";
import { prisma } from "@/lib/prisma";
import {
  getDictionary,
  isValidLocale,
  Locale,
  tField,
  formatProductPrice,
} from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import ProductImageGallery from "@/components/client/ProductImageGallery";
import InquiryForm from "@/components/client/InquiryForm";
import ProductCard from "@/components/client/ProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  // Trang chi tiết được dựng khi có người truy cập đầu tiên rồi lưu đệm (ISR), tránh quá tải DB lúc build
  return [];
}

// Mục 5.4 & 9 URD: Tạo thông tin chia sẻ Zalo, Facebook (OpenGraph) và SEO cho từng sản phẩm
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product || !product.isVisible) {
    return { title: "Sản phẩm không tồn tại" };
  }

  const title = tField(product.nameVi, product.nameEn, locale);
  const description = tField(product.descriptionVi, product.descriptionEn, locale);
  const coverImage =
    product.images.find((i) => i.isCover)?.url ||
    product.images[0]?.url ||
    "/uploads/logo/logo.png";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Wooden Decor`,
      description,
      images: [coverImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);

  const [siteConfig, product] = await Promise.all([
    getSiteConfig(locale),
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        collections: { include: { collection: true } },
      },
    }),
  ]);

  if (!product || !product.isVisible) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isVisible: true,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    take: 3,
  });

  const name = tField(product.nameVi, product.nameEn, locale);
  const description = tField(product.descriptionVi, product.descriptionEn, locale);
  const material = tField(product.materialVi, product.materialEn, locale);
  const dimensions = tField(product.dimensionsVi, product.dimensionsEn, locale);
  const categoryName = tField(
    product.category.nameVi,
    product.category.nameEn,
    locale
  );

  const priceDisplay = formatProductPrice({
    price: product.price,
    isContactPrice: product.isContactPrice,
    priceNoteVi: product.priceNoteVi,
    priceNoteEn: product.priceNoteEn,
    locale,
    usdExchangeRate: siteConfig.usdExchangeRate,
  });

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const galleryImages = sortedImages.map((img) => ({
    id: img.id,
    url: img.url,
    alt: tField(img.altVi, img.altEn, locale) || name,
  }));

  const cleanPhone = siteConfig.phone.replace(/\s+/g, "");
  const cleanZalo = siteConfig.zalo.replace(/\D/g, "") || cleanPhone.replace(/\D/g, "");

  // Dữ liệu có cấu trúc JSON-LD cho Google hiểu sản phẩm (Mục 9 SEO URD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: galleryImages.map((i) => i.url),
    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price || 0,
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Đường dẫn Breadcrumb */}
      <nav className="text-xs text-wood-charcoal/70 flex flex-wrap items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-wood-dark">
          {dict.nav.home}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/san-pham`} className="hover:text-wood-dark">
          {dict.nav.products}
        </Link>
        <span>/</span>
        <Link
          href={`/${locale}/san-pham?category=${product.category.slug}`}
          className="hover:text-wood-dark"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-wood-dark font-medium">{name}</span>
      </nav>

      {/* Bố cục 2 cột: Bộ ảnh bên trái + Thông tin cố định bên phải khi cuộn (Mục 3 & 5.4 URD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cột trái: Bộ ảnh sản phẩm */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-10 min-w-0">
          <ProductImageGallery images={galleryImages} productName={name} />

          {/* Câu chuyện & Mô tả chi tiết kiểu cuộn dọc Apple */}
          <div className="bg-wood-cream/60 rounded-2xl p-5 sm:p-8 border border-wood-light/50 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-wood-dark">
              {locale === "en" ? "Craftsmanship & Story" : "Chi tiết chế tác & Mô tả"}
            </h2>
            <div className="text-sm sm:text-base text-wood-charcoal/85 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin & Nút liên hệ giữ cố định khi cuộn (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 min-w-0">
          <div className="bg-wood-white rounded-3xl p-5 sm:p-8 border border-wood-light/60 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${locale}/san-pham?category=${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-widest text-wood-medium bg-wood-cream px-3 py-1 rounded-full"
              >
                {categoryName}
              </Link>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                  product.stockStatus === "IN_STOCK"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-stone-100 text-stone-700 border border-stone-300"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {product.stockStatus === "IN_STOCK"
                  ? dict.products.inStock
                  : dict.products.outOfStock}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-charcoal leading-snug">
              {name}
            </h1>

            {/* Giá hiển thị rõ ràng + Ghi chú giá */}
            <div className="p-4 rounded-2xl bg-wood-cream border border-wood-light/50">
              <div className="text-xl sm:text-3xl font-bold text-wood-dark break-words">
                {priceDisplay.primary}
              </div>
              {priceDisplay.secondary && (
                <p className="text-xs text-wood-charcoal/75 mt-1">
                  {priceDisplay.secondary}
                </p>
              )}
            </div>

            {/* Bảng thông số: Chất liệu, Kích thước, Bộ sưu tập */}
            <div className="space-y-3.5 text-sm border-y border-wood-light/40 py-5">
              {material && (
                <div className="flex items-start gap-3">
                  <Layers className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-wood-charcoal/60 block">
                      {dict.products.material}
                    </span>
                    <span className="font-medium text-wood-charcoal">{material}</span>
                  </div>
                </div>
              )}

              {dimensions && (
                <div className="flex items-start gap-3">
                  <Box className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-wood-charcoal/60 block">
                      {dict.products.dimensions}
                    </span>
                    <span className="font-medium text-wood-charcoal">{dimensions}</span>
                  </div>
                </div>
              )}

              {product.collections.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-wood-medium shrink-0 mt-1" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-wood-charcoal/60 block mb-1">
                      {dict.products.collections}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.collections.map(({ collection }) => (
                        <Link
                          key={collection.id}
                          href={`/${locale}/san-pham?collection=${collection.slug}`}
                          className="text-xs bg-wood-cream hover:bg-wood-light/50 text-wood-dark px-2.5 py-1 rounded-md border border-wood-light/60"
                        >
                          {tField(collection.nameVi, collection.nameEn, locale)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3 nút hành động chính: Gọi ngay, Chat Zalo, Gửi yêu cầu tư vấn (Mục 5.4 URD) */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2 bg-wood-dark hover:bg-wood-medium text-white font-semibold py-3.5 px-5 rounded-xl transition-colors text-sm shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{dict.products.callConsult}</span>
                </a>
                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-medium font-semibold py-3.5 px-5 rounded-xl transition-colors text-sm"
                >
                  <ZaloIcon className="w-4 h-4 shrink-0" />
                  <span>{dict.products.zaloConsult}</span>
                </a>
              </div>

              <a
                href="#form-tu-van"
                className="block text-center w-full py-3 rounded-xl border border-wood-light text-xs font-semibold uppercase tracking-wider text-wood-charcoal hover:bg-wood-cream transition-colors"
              >
                ↓ {dict.products.sendInquiry}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Form gửi yêu cầu tư vấn điền sẵn tên sản phẩm (Mục 5.4 & 5.5 URD) */}
      <div id="form-tu-van" className="scroll-mt-28 max-w-3xl mx-auto">
        <InquiryForm
          productId={product.id}
          productName={name}
          dict={dict.inquiry}
        />
      </div>

      {/* Khối Sản phẩm liên quan cùng danh mục (Mục 5.4 URD) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-wood-light/50">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            {dict.products.relatedProducts}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
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
