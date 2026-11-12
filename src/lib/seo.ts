import type { Metadata } from "next";
import { Locale } from "./i18n";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://thienan-woodendecor.vercel.app"
).replace(/\/+$/, "");

export function toAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) return `${SITE_URL}/uploads/banners/hero-phong-khach-dang-song.webp`;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  if (urlOrPath.startsWith("data:")) {
    return `${SITE_URL}/uploads/banners/hero-phong-khach-dang-song.webp`;
  }
  return `${SITE_URL}${urlOrPath.startsWith("/") ? "" : "/"}${urlOrPath}`;
}

/**
 * Chuẩn hóa độ dài thẻ <title> dưới 60 ký tự và <meta name="description"> trong khoảng 140-155 ký tự chuẩn SEO
 */
export function clampSeoTitle(rawTitle: string, maxLen = 58): string {
  const clean = rawTitle.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

export function clampSeoDescription(rawDesc: string, locale: Locale = "vi"): string {
  const clean = rawDesc.replace(/\s+/g, " ").trim();
  const fallbackVi =
    "Xưởng chế tác đồ decor gỗ thủ công & nội thất gỗ tự nhiên nguyên khối cao cấp: sofa gỗ óc chó, bàn trà điêu khắc, giường ngủ và kệ gỗ nghệ thuật.";
  const fallbackEn =
    "Handcrafted solid wood decor & bespoke natural timber furniture studio in Vietnam: sculpted walnut sofas, coffee tables, beds, and artful shelves.";

  const base = clean || (locale === "en" ? fallbackEn : fallbackVi);
  if (base.length >= 140 && base.length <= 155) {
    return base;
  }
  if (base.length > 155) {
    return `${base.slice(0, 152).trim()}...`;
  }
  const suffix =
    locale === "en"
      ? " — Handcrafted solid wood decor & bespoke furniture at Wooden Decor."
      : " — Chế tác đồ decor gỗ thủ công & nội thất gỗ tự nhiên tại Wooden Decor.";
  const padded = `${base}${suffix}`;
  return padded.length > 155 ? `${padded.slice(0, 152).trim()}...` : padded;
}

interface BuildMetadataOptions {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  image = "/uploads/banners/hero-phong-khach-dang-song.webp",
  type = "website",
}: BuildMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") || path === "" ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}/${locale}${normalizedPath}`;
  const seoTitle = clampSeoTitle(title);
  const seoDescription = clampSeoDescription(description, locale);
  const ogImage = toAbsoluteUrl(image);

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "vi-VN": `${SITE_URL}/vi${normalizedPath}`,
        "en-US": `${SITE_URL}/en${normalizedPath}`,
        "x-default": `${SITE_URL}/vi${normalizedPath}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: "Wooden Decor",
      locale: locale === "en" ? "en_US" : "vi_VN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}
