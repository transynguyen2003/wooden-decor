import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

/**
 * Mục 9 SEO URD: Sơ đồ trang (sitemap.xml) tự động cập nhật theo sản phẩm và bài đăng ở cả 2 ngôn ngữ VI/EN
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [products, posts] = await Promise.all([
    prisma.product.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = ["", "/san-pham", "/bo-suu-tap", "/cam-hung", "/gioi-thieu", "/lien-he"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["vi", "en"]) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    for (const prod of products) {
      entries.push({
        url: `${baseUrl}/${locale}/san-pham/${prod.slug}`,
        lastModified: prod.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/cam-hung/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
