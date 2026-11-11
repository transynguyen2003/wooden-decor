import { prisma } from "./prisma";
import { Locale, tField } from "./i18n";

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
    vi: "/uploads/logo/logo.webp",
    en: "/uploads/logo/logo.webp",
  },
  phone: {
    vi: "0909 888 686",
    en: "+84 909 888 686",
  },
  zalo: {
    vi: "0909888686",
    en: "0909888686",
  },
  email: {
    vi: "lienhe@woodendecor.vn",
    en: "contact@woodendecor.vn",
  },
  address: {
    vi: "Số 168 Đường Nghệ Nhân, Khu Làng Nghề Mộc, TP. Thủ Đức, TP. Hồ Chí Minh",
    en: "168 Artisan Avenue, Woodworking Village, Thu Duc City, Ho Chi Minh City",
  },
  openingHours: {
    vi: "08:00 – 20:30 (Thứ Hai – Chủ Nhật)",
    en: "08:00 AM – 08:30 PM (Monday – Sunday)",
  },
  facebookUrl: {
    vi: "https://facebook.com",
    en: "https://facebook.com",
  },
  tiktokUrl: {
    vi: "https://tiktok.com",
    en: "https://tiktok.com",
  },
  mapEmbedUrl: {
    vi: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.484231881318!2d106.7697336!3d10.8507267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUUC5IQ00!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
    en: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.484231881318!2d106.7697336!3d10.8507267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUUC5IQ00!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
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

export async function getSiteConfig(locale: Locale): Promise<SiteConfig> {
  let rows: Array<{ key: string; valueVi: string; valueEn: string }> = [];
  try {
    rows = await prisma.siteSetting.findMany();
  } catch {
    rows = [];
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
  };
}
