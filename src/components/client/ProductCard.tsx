import React from "react";
import Link from "next/link";
import { Locale, tField, formatProductPrice } from "@/lib/i18n";

export interface ProductCardData {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  price: number | null;
  isContactPrice: boolean;
  priceNoteVi?: string;
  priceNoteEn?: string;
  stockStatus: string;
  isFeatured?: boolean;
  category?: {
    nameVi: string;
    nameEn: string;
  };
  images: Array<{
    url: string;
    altVi: string;
    altEn: string;
    isCover: boolean;
    sortOrder: number;
  }>;
}

interface ProductCardProps {
  product: ProductCardData;
  locale: Locale;
  usdExchangeRate: number;
  outOfStockLabel: string;
}

/**
 * Thẻ sản phẩm theo định hướng Nike.com & Apple.com (Mục 3 & 5.3 URD):
 * - Ảnh sản phẩm lớn, bo góc tinh tế
 * - Khi rê chuột (hover) tự động hiện ảnh thứ 2 của sản phẩm (nếu có)
 * - Hiển thị giá VND (và quy đổi USD ước tính khi ở bản tiếng Anh) hoặc "Liên hệ"
 */
export default function ProductCard({
  product,
  locale,
  usdExchangeRate,
  outOfStockLabel,
}: ProductCardProps) {
  const sortedImages = [...(product.images || [])].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const primaryImage = sortedImages[0]?.url || "/uploads/logo/logo.webp";
  const secondaryImage = sortedImages[1]?.url || null;

  const title = tField(product.nameVi, product.nameEn, locale);
  const categoryName = product.category
    ? tField(product.category.nameVi, product.category.nameEn, locale)
    : "";

  const priceDisplay = formatProductPrice({
    price: product.price,
    isContactPrice: product.isContactPrice,
    priceNoteVi: product.priceNoteVi,
    priceNoteEn: product.priceNoteEn,
    locale,
    usdExchangeRate,
  });

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <Link
      href={`/${locale}/san-pham/${product.slug}`}
      prefetch={true}
      className="group flex flex-col bg-wood-white rounded-2xl overflow-hidden border border-wood-light/40 hover:border-wood-medium/70 transition-all duration-300 hover:shadow-md"
    >
      {/* Khung ảnh tỷ lệ 4:3 lớn, hỗ trợ đổi sang ảnh thứ 2 khi rê chuột */}
      <div className="relative aspect-[4/3] w-full bg-wood-cream overflow-hidden">
        <img
          src={primaryImage}
          alt={title}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ${
            secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${title} - 2`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        )}

        {/* Nhãn Hết hàng (nếu có) */}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-wood-charcoal/90 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
            {outOfStockLabel}
          </span>
        )}

        {/* Chỉ báo có nhiều góc ảnh */}
        {sortedImages.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-wood-white/85 backdrop-blur-sm text-wood-charcoal text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-wood-light/50">
            {sortedImages.length} {locale === "en" ? "photos" : "ảnh"}
          </span>
        )}
      </div>

      {/* Thông tin sản phẩm gọn gàng, sang trọng */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {categoryName && (
            <p className="text-xs uppercase tracking-widest text-wood-medium font-medium mb-1">
              {categoryName}
            </p>
          )}
          <h3 className="font-serif text-lg font-semibold text-wood-charcoal group-hover:text-wood-dark transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="pt-2 border-t border-wood-light/30 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <span
            className={`text-base font-semibold ${
              priceDisplay.isContact ? "text-wood-medium" : "text-wood-dark"
            }`}
          >
            {priceDisplay.primary}
          </span>
          <span className="text-xs font-medium text-wood-medium group-hover:translate-x-1 transition-transform">
            {locale === "en" ? "View details →" : "Xem chi tiết →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
