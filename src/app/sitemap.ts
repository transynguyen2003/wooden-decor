import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

/**
 * Mục 9 SEO URD: Sơ đồ trang (sitemap.xml) tự động cập nhật toàn bộ đường dẫn chính,
 * danh mục sản phẩm và bài đăng ở cả 2 ngôn ngữ VI/EN.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Array<{ slug: string; updatedAt: Date }> = [];
  let posts: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    const [prodRows, postRows] = await Promise.all([
      prisma.product.findMany({
        where: { isVisible: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    products = prodRows;
    posts = postRows;
  } catch {
    // Fallback an toàn nếu DB đang khởi động
  }

  const staticRoutes = [
    "",
    "/san-pham",
    "/bo-suu-tap",
    "/cam-hung",
    "/gioi-thieu",
    "/huong-dan-mua-hang",
    "/lien-he",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["vi", "en"]) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1.0 : 0.85,
        alternates: {
          languages: {
            vi: `${SITE_URL}/vi${route}`,
            en: `${SITE_URL}/en${route}`,
          },
        },
      });
    }

    for (const prod of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/san-pham/${prod.slug}`,
        lastModified: prod.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            vi: `${SITE_URL}/vi/san-pham/${prod.slug}`,
            en: `${SITE_URL}/en/san-pham/${prod.slug}`,
          },
        },
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/cam-hung/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: {
          languages: {
            vi: `${SITE_URL}/vi/cam-hung/${post.slug}`,
            en: `${SITE_URL}/en/cam-hung/${post.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
