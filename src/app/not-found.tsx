import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

/**
 * Mục 5.7 URD: Trang 404 thân thiện, có đường dẫn quay về trang chủ
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-wood-white">
      <div className="max-w-lg w-full bg-wood-cream rounded-3xl p-8 sm:p-12 border border-wood-light/60 text-center space-y-6 shadow-sm">
        <img
          src="/uploads/logo/logo.webp"
          alt="Wooden Decor"
          className="w-20 h-20 rounded-full mx-auto object-cover border border-wood-light"
        />
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-wood-medium">
            404 — Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-wood-dark">
            Trang bạn tìm không tồn tại
          </h1>
          <p className="text-sm text-wood-charcoal/75 leading-relaxed">
            Có thể sản phẩm đã được cập nhật đường dẫn mới hoặc tạm ẩn. Mời bạn quay lại trang chủ để khám phá bộ sưu tập nội thất gỗ tự nhiên.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/vi"
            className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ (VI)</span>
          </Link>
          <Link
            href="/vi/san-pham"
            className="inline-flex items-center gap-2 bg-wood-white hover:bg-wood-light/30 text-wood-dark border border-wood-light text-sm font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Sản Phẩm</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
