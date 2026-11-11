import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { IStorageProvider, UploadOptions, UploadResult } from "./types";

/**
 * Bộ lưu trữ ảnh cục bộ (Local Storage Provider).
 * - Lưu ảnh vào thư mục `public/uploads/<folder>/`
 * - Tự động dùng `sharp` để xoay đúng chiều, thu nhỏ cạnh dài (mặc định tối đa 1600px)
 *   và nén sang định dạng `.webp` nhẹ mượt theo yêu cầu Mục 6.4 & 9 URD.
 */
export class LocalStorageProvider implements IStorageProvider {
  private baseUploadDir: string;

  constructor() {
    this.baseUploadDir = path.join(process.cwd(), "public", "uploads");
  }

  async uploadImage(
    buffer: Buffer,
    originalName: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const folder = options?.folder || "products";
    const maxWidth = options?.maxWidth || 1600;
    const quality = options?.quality || 82;

    const targetDir = path.join(this.baseUploadDir, folder);
    await fs.mkdir(targetDir, { recursive: true });

    // Tạo tên file an toàn, dễ đọc + mã ngẫu nhiên ngắn tránh trùng
    const baseName = path
      .parse(originalName)
      .name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "image";

    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const fileName = `${baseName}-${uniqueSuffix}.webp`;
    const fullPath = path.join(targetDir, fileName);

    // Dùng sharp tự động xoay ảnh theo EXIF, thu nhỏ nếu ảnh quá lớn và nén sang WebP
    const processed = await sharp(buffer)
      .rotate()
      .resize({
        width: maxWidth,
        height: maxWidth,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(fullPath);

    return {
      url: `/uploads/${folder}/${fileName}`,
      fileName,
      size: processed.size,
      width: processed.width,
      height: processed.height,
    };
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      if (!url.startsWith("/uploads/")) {
        return false;
      }
      // Ngăn chặn truy cập ngoài thư mục public/uploads (Path Traversal protection)
      const relativePath = url.replace(/^\/uploads\//, "");
      const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
      const fullPath = path.join(this.baseUploadDir, safePath);

      if (!fullPath.startsWith(this.baseUploadDir)) {
        return false;
      }

      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
