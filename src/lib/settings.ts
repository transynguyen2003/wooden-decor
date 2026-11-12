import { prisma } from "./prisma";
import { Locale, tField } from "./i18n";

export interface ShowcaseVideoItem {
  id: string;
  url: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  active: boolean;
}

export const DEFAULT_SHOWCASE_VIDEOS: ShowcaseVideoItem[] = [
  {
    id: "video-1",
    url: "/uploads/videos/showroom-video-1.mp4",
    titleVi: "Thước Phim Thực Tế Tại Xưởng & Showroom Thiên An",
    titleEn: "Inside Our Solid Wood Workshop & Showroom",
    descVi:
      "Cận cảnh từng đường vân gỗ tự nhiên nguyên khối và quá trình hoàn thiện thủ công tỉ mỉ từ các nghệ nhân lành nghề.",
    descEn:
      "Up-close view of natural solid wood grain and meticulous hand-finishing by our master craftsmen.",
    active: true,
  },
  {
    id: "video-promo-15s",
    url: "/uploads/videos/wooden-decor-promo-15s.mp4",
    titleVi: "TVC Nghệ Thuật Chế Tác Gỗ Tự Nhiên (15s Cinematic)",
    titleEn: "Solid Wood Artistry Promotional Film (15s Cinematic)",
    descVi:
      "Hành trình từ thớ gỗ Óc Chó nguyên bản, đôi bàn tay người nghệ nhân đến không gian sống tĩnh tại.",
    descEn:
      "From raw walnut grain and the craftsman’s hands to a serene contemporary living space.",
    active: true,
  },
];

export interface SiteConfig {
  brandName: string;
  slogan: string;
  logoUrl: string;
  phone: string;
  zalo: string;
  email: string;
  address: string;
  openingHours: string;
  facebookUrl: string;
  tiktokUrl: string;
  mapEmbedUrl: string;
  usdExchangeRate: number;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBannerImage: string;
  aboutTitle: string;
  aboutStory: string;
  showcaseVideos: ShowcaseVideoItem[];
}

const DEFAULT_SETTINGS: Record<string, { vi: string; en: string }> = {
  brandName: {
    vi: "Wooden Decor",
    en: "Wooden Decor",
  },
  slogan: {
    vi: "Nghệ Thuật Điêu Khắc Gỗ Tự Nhiên Đương Đại",
    en: "Contemporary Sculptural Solid Wood Artistry",
  },
  logoUrl: {
    vi: "/uploads/logo/logo-thien-an.webp",
    en: "/uploads/logo/logo-thien-an.webp",
  },
  phone: {
    vi: "0328990001",
    en: "0328990001",
  },
  zalo: {
    vi: "0328990001",
    en: "0328990001",
  },
  email: {
    vi: "lienhe@woodendecor.vn",
    en: "contact@woodendecor.vn",
  },
  address: {
    vi: "Thôn Đông Trước, xã Xuân Cẩm, Bắc Ninh",
    en: "Dong Truoc Village, Xuan Cam Commune, Bac Ninh",
  },
  openingHours: {
    vi: "08:00 – 20:30 (Thứ Hai – Chủ Nhật)",
    en: "08:00 AM – 08:30 PM (Monday – Sunday)",
  },
  facebookUrl: {
    vi: "https://www.facebook.com/share/19mzd2PcQz/?mibextid=wwXIfr",
    en: "https://www.facebook.com/share/19mzd2PcQz/?mibextid=wwXIfr",
  },
  tiktokUrl: {
    vi: "https://www.tiktok.com/@thienanthien26?_r=1&_t=ZS-9BKYcE9SLYI",
    en: "https://www.tiktok.com/@thienanthien26?_r=1&_t=ZS-9BKYcE9SLYI",
  },
  mapEmbedUrl: {
    vi: "https://www.google.com/maps?q=21.24277735164279,105.95178212554464&hl=vi&z=16&output=embed",
    en: "https://www.google.com/maps?q=21.24277735164279,105.95178212554464&hl=en&z=16&output=embed",
  },
  usdExchangeRate: {
    vi: "25000",
    en: "25000",
  },
  heroTitle: {
    vi: "Đường Cong Nguyên Bản Của Gỗ Tự Nhiên",
    en: "Sculpted Organic Curves in Solid Wood",
  },
  heroSubtitle: {
    vi: "Mỗi thiết kế tại Wooden Decor là một tác phẩm điêu khắc độc bản từ gỗ Óc Chó Bắc Mỹ, gỗ Mun và gỗ Gõ Đỏ — mang hơi ấm tĩnh tại vào không gian sống của bạn.",
    en: "Every piece at Wooden Decor is a bespoke sculpture crafted from North American Walnut, Ebony, and Rosewood — bringing serene warmth into your home.",
  },
  heroCtaText: {
    vi: "Xem sản phẩm",
    en: "Explore Products",
  },
  heroBannerImage: {
    vi: "/uploads/banners/hero-phong-khach-dang-song.webp",
    en: "/uploads/banners/hero-phong-khach-dang-song.webp",
  },
  aboutTitle: {
    vi: "Hơn 15 Năm Giữ Hồn Gỗ Tự Nhiên Việt Nam",
    en: "Over 15 Years Preserving the Soul of Natural Timber",
  },
  aboutStory: {
    vi: "Khởi nguồn từ một xưởng mộc thủ công chuyên chế tác nội thất gỗ nguyên khối, Wooden Decor theo đuổi triết lý tối giản ấm áp: loại bỏ những chi tiết rườm rà để tôn vinh trọn vẹn đường vân uốn lượn tự nhiên của từng thớ gỗ lâu năm.\n\nTại xưởng của chúng tôi, không có dây chuyền sản xuất đại trà. Từng bộ sofa dáng sóng, từng chiếc bàn trà vô cực hay hệ tủ vòm đều được các nghệ nhân lành nghề phác thảo, ghép mộng truyền thống và chà nhám thủ công suốt hàng trăm giờ đồng hồ.",
    en: "Born from an artisanal woodworking studio specializing in solid timber, Wooden Decor pursues a philosophy of warm minimalism: stripping away excess ornament to celebrate the organic grain of aged hardwood.\n\nIn our workshop, there is no mass production. Every wave-sculpted sofa, infinity coffee table, and arched cabinet is hand-shaped, joined with traditional mortise-and-tenon craftsmanship, and hand-sanded over hundreds of hours.",
  },
};

// Bộ nhớ đệm RAM giúp đọc cấu hình website trong 0ms khi chuyển trang (Tự động làm mới khi Admin lưu cài đặt)
let cachedSettingsRows: Array<{
  key: string;
  valueVi: string;
  valueEn: string;
}> | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 1000;

export function invalidateSiteConfigCache() {
  cachedSettingsRows = null;
  cachedAt = 0;
}

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  const now = Date.now();
  let rows = cachedSettingsRows;

  if (!rows || now - cachedAt > CACHE_TTL_MS) {
    try {
      rows = await prisma.siteSetting.findMany();
      cachedSettingsRows = rows;
      cachedAt = now;
    } catch {
      rows = [];
    }
  }

  const map = new Map(rows.map((r) => [r.key, r]));

  const pick = (key: string): string => {
    const row = map.get(key);
    const def = DEFAULT_SETTINGS[key] || { vi: "", en: "" };
    const vi = row?.valueVi || def.vi;
    const en = row?.valueEn || def.en;
    return tField(vi, en, locale);
  };

  const rateRaw = Number(pick("usdExchangeRate"));
  const usdExchangeRate = !isNaN(rateRaw) && rateRaw > 0 ? rateRaw : 25000;

  let showcaseVideos: ShowcaseVideoItem[] = DEFAULT_SHOWCASE_VIDEOS;
  const videoRow = map.get("showcaseVideos");
  if (videoRow && videoRow.valueVi.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(videoRow.valueVi);
      if (Array.isArray(parsed)) {
        showcaseVideos = parsed;
      }
    } catch {
      showcaseVideos = DEFAULT_SHOWCASE_VIDEOS;
    }
  }

  return {
    brandName: pick("brandName"),
    slogan: pick("slogan"),
    logoUrl: pick("logoUrl"),
    phone: pick("phone"),
    zalo: pick("zalo"),
    email: pick("email"),
    address: pick("address"),
    openingHours: pick("openingHours"),
    facebookUrl: pick("facebookUrl"),
    tiktokUrl: pick("tiktokUrl"),
    mapEmbedUrl: pick("mapEmbedUrl"),
    usdExchangeRate,
    heroTitle: pick("heroTitle"),
    heroSubtitle: pick("heroSubtitle"),
    heroCtaText: pick("heroCtaText"),
    heroBannerImage: pick("heroBannerImage"),
    aboutTitle: pick("aboutTitle"),
    aboutStory: pick("aboutStory"),
    showcaseVideos,
  };
}
