"use client";

import React from "react";
import { Phone } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { ZaloIcon } from "./SocialIcons";

interface FloatingContactProps {
  phone: string;
  zalo: string;
  locale: Locale;
}

/**
 * Mục 5.1 & 9 URD: Nút liên hệ nhanh cố định ở góc màn hình (Gọi điện & Chat Zalo)
 * - Kích thước nút bấm tối thiểu 44x44px trên điện thoại (dễ bấm bằng ngón cái)
 * - Gọn gàng trên màn hình hẹp 360px
 */
export default function FloatingContact({
  phone,
  zalo,
  locale,
}: FloatingContactProps) {
  const cleanPhone = phone.replace(/\s+/g, "");
  const cleanZalo = zalo.replace(/\D/g, "") || cleanPhone.replace(/\D/g, "");

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Nút Chat Zalo */}
      <a
        href={`https://zalo.me/${cleanZalo}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="min-h-[44px] flex items-center gap-2 bg-wood-white/95 backdrop-blur-sm border-2 border-wood-medium text-wood-dark px-3.5 sm:px-4 py-2.5 rounded-full shadow-lg hover:bg-wood-cream transition-all"
      >
        <ZaloIcon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold tracking-wide">
          {locale === "en" ? "Zalo" : "Chat Zalo"}
        </span>
      </a>

      {/* Nút Gọi điện trực tiếp */}
      <a
        href={`tel:${cleanPhone}`}
        aria-label="Call Now"
        className="min-h-[44px] flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white px-3.5 sm:px-4 py-2.5 rounded-full shadow-lg transition-all"
      >
        <Phone className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold tracking-wide">
          {locale === "en" ? "Call Now" : "Gọi ngay"}
        </span>
      </a>
    </div>
  );
}
