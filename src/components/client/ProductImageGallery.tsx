"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productName: string;
}

/**
 * Mục 5.4 URD: Bộ ảnh lớn kèm ảnh thu nhỏ, bấm để phóng to (Lightbox),
 * hỗ trợ vuốt trái/phải cảm ứng (Touch Swipe) trên điện thoại & máy tính bảng.
 */
export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const safeImages =
    images.length > 0
      ? images
      : [{ id: "default", url: "/uploads/logo/logo.webp", alt: productName }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Theo dõi tọa độ chạm tay để vuốt ảnh trên điện thoại/tablet
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // Vuốt tối thiểu 40px
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Ảnh chính lớn - hỗ trợ vuốt tay trên điện thoại & tablet */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-wood-cream border border-wood-light/50 group select-none touch-pan-y"
      >
        <img
          src={currentImage.url}
          alt={
            currentImage.alt ||
            `${productName} - Đồ decor gỗ thủ công và nội thất gỗ tự nhiên Wooden Decor`
          }
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onClick={() => setLightboxOpen(true)}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
        />

        {/* Chỉ báo số thứ tự ảnh trên điện thoại (VD: 1 / 4) */}
        {safeImages.length > 1 && (
          <span className="absolute bottom-3 left-3 bg-wood-charcoal/75 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {activeIndex + 1} / {safeImages.length}
          </span>
        )}

        {/* Nút phóng to (đủ lớn >= 44px trên điện thoại - Mục 9 URD) */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Phóng to ảnh"
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center bg-wood-white/90 hover:bg-wood-white text-wood-charcoal rounded-full shadow-sm transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Nút điều hướng trái/phải */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-wood-white/85 hover:bg-wood-white text-wood-charcoal rounded-full shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-wood-white/85 hover:bg-wood-white text-wood-charcoal rounded-full shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Hàng ảnh thu nhỏ (Thumbnails) - cuộn ngang mượt trên màn hình nhỏ 360px */}
      {safeImages.length > 1 && (
        <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 sm:w-auto shrink-0 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? "border-wood-dark ring-2 ring-wood-light/60"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={
                  img.alt ||
                  `${productName} - Ảnh chi tiết góc ${idx + 1} đồ decor gỗ thủ công`
                }
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Hộp thoại phóng to ảnh toàn màn hình (Lightbox) - cũng hỗ trợ vuốt tay */}
      {lightboxOpen && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Ảnh trước"
                className="absolute left-2 sm:left-8 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Ảnh sau"
                className="absolute right-2 sm:right-8 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 text-white rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.alt || productName}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[94vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
