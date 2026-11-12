"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface LazyMapProps {
  src: string;
  title?: string;
}

/**
 * Trì hoãn tải Google Maps iframe cho đến khi người dùng cuộn xuống gần bản đồ.
 * Giúp quá trình chuyển trang giữa Trang chủ / Giới thiệu / Liên hệ không bị khựng bởi Google Maps.
 */
export default function LazyMap({
  src,
  title = "Wooden Decor Showroom Map",
}: LazyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-wood-cream">
      {shouldLoad ? (
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-wood-medium/70 text-xs">
          <MapPin className="w-6 h-6 animate-pulse" />
          <span>Đang tải bản đồ Showroom...</span>
        </div>
      )}
    </div>
  );
}
