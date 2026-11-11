"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface FloatingContactProps {
  phone: string;
  zalo: string;
  locale: Locale;
}

/**
 * Mục 5.1 URD: Nút liên hệ nhanh cố định ở góc màn hình (Gọi điện & Chat Zalo)
 */
export default function FloatingContact({
  phone,
  zalo,
  locale,
}: FloatingContactProps) {
  const cleanPhone = phone.replace(/\s+/g, "");
  const cleanZalo = zalo.replace(/\D/g, "") || cleanPhone.replace(/\D/g, "");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {/* Nút Chat Zalo */}
      <a
        href={`https://zalo.me/${cleanZalo}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="group flex items-center gap-2.5 bg-wood-white border-2 border-wood-medium text-wood-dark px-4 py-3 rounded-full shadow-lg hover:bg-wood-cream transition-all"
      >
        <MessageCircle className="w-5 h-5 text-wood-medium" />
        <span className="text-xs font-semibold tracking-wide">
          {locale === "en" ? "Chat Zalo" : "Nhắn Zalo"}
        </span>
      </a>

      {/* Nút Gọi điện trực tiếp */}
      <a
        href={`tel:${cleanPhone}`}
        aria-label="Call Now"
        className="flex items-center gap-2.5 bg-wood-dark hover:bg-wood-medium text-white px-4 py-3 rounded-full shadow-lg transition-all"
      >
        <Phone className="w-5 h-5" />
        <span className="text-xs font-semibold tracking-wide">
          {locale === "en" ? "Call Now" : "Gọi ngay"}
        </span>
      </a>
    </div>
  );
}
