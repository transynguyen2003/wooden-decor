"use client";

import React, { useState } from "react";
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
 * Mục 5.4 URD: Bộ ảnh lớn kèm ảnh thu nhỏ, bấm để phóng to (Lightbox), chuyển ảnh mượt trên điện thoại & máy tính
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

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Ảnh chính lớn */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-wood-cream border border-wood-light/50 group">
        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          onClick={() => setLightboxOpen(true)}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500"
        />

        {/* Nút phóng to */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Zoom image"
          className="absolute top-4 right-4 bg-wood-white/85 hover:bg-wood-white text-wood-charcoal p-2.5 rounded-full shadow-sm transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Nút điều hướng trái/phải nếu có nhiều ảnh */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-wood-white/85 hover:bg-wood-white text-wood-charcoal p-2.5 rounded-full shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-wood-white/85 hover:bg-wood-white text-wood-charcoal p-2.5 rounded-full shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Hàng ảnh thu nhỏ (Thumbnails) */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? "border-wood-dark ring-2 ring-wood-light/60"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${productName} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Hộp thoại phóng to ảnh toàn màn hình (Lightbox) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoom"
            className="absolute top-6 right-6 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full"
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
                aria-label="Previous"
                className="absolute left-4 sm:left-8 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next"
                className="absolute right-4 sm:right-8 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.alt || productName}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
