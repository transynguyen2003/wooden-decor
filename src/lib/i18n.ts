import viDict from "@/dictionaries/vi.json";
import enDict from "@/dictionaries/en.json";

export type Locale = "vi" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";

export function isValidLocale(lang: string): lang is Locale {
  return SUPPORTED_LOCALES.includes(lang as Locale);
}

export function getDictionary(locale: Locale) {
  return locale === "en" ? enDict : viDict;
}

/**
 * Mục 15.1 URD: Nếu ô tiếng Anh trống, trang tiếng Anh tự động hiện tiếng Việt thay vì để trống.
 */
export function tField(
  viValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: Locale
): string {
  if (locale === "en" && enValue && enValue.trim().length > 0) {
    return enValue;
  }
  return viValue || "";
}

/**
 * Mục 15.1 & 15.3 URD (Đã chốt):
 * - Định dạng giá kiểu 1.250.000 ₫
 * - Khi ở tiếng Anh (EN), hiển thị kèm quy đổi USD ước tính: 48.000.000 ₫ (~$1,920)
 * - Nếu đánh dấu "Liên hệ" hoặc không có giá, hiển thị ghi chú giá hoặc "Liên hệ / Contact Us"
 */
export function formatProductPrice(options: {
  price?: number | null;
  isContactPrice?: boolean;
  priceNoteVi?: string | null;
  priceNoteEn?: string | null;
  locale: Locale;
  usdExchangeRate?: number;
}): {
  primary: string;
  secondary?: string;
  isContact: boolean;
} {
  const {
    price,
    isContactPrice = false,
    priceNoteVi,
    priceNoteEn,
    locale,
    usdExchangeRate = 25000,
  } = options;

  const note = tField(priceNoteVi, priceNoteEn, locale);

  if (isContactPrice || !price || price <= 0) {
    return {
      primary: note || (locale === "en" ? "Contact for Price" : "Liên hệ báo giá"),
      isContact: true,
    };
  }

  const vndFormatted = `${price.toLocaleString("vi-VN")} ₫`;

  if (locale === "en") {
    const rate = usdExchangeRate > 0 ? usdExchangeRate : 25000;
    const usdEstimate = Math.round(price / rate);
    const usdFormatted = `~$${usdEstimate.toLocaleString("en-US")}`;
    return {
      primary: `${vndFormatted} (${usdFormatted})`,
      secondary: note || undefined,
      isContact: false,
    };
  }

  return {
    primary: vndFormatted,
    secondary: note || undefined,
    isContact: false,
  };
}

/**
 * Tạo đường dẫn thân thiện (slug) từ chuỗi tiếng Việt
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
