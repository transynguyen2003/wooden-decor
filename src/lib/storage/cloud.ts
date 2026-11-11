import { IStorageProvider, UploadOptions, UploadResult } from "./types";

/**
 * Bộ lưu trữ ảnh đám mây (Cloud Storage Provider - Khung chờ sẵn cho Giai đoạn 5).
 * Khi đưa web lên mạng (Vercel / Cloud), bạn chỉ cần điền API của Cloudinary hoặc Supabase Storage
 * vào đây và đổi biến môi trường STORAGE_DRIVER="cloud" trong file .env.
 * Toàn bộ code của trang Admin và API Upload không cần sửa bất kỳ dòng nào.
 */
export class CloudStorageProvider implements IStorageProvider {
  async uploadImage(
    _buffer: Buffer,
    _originalName: string,
    _options?: UploadOptions
  ): Promise<UploadResult> {
    const cloudUrl = process.env.CLOUD_STORAGE_URL;
    if (!cloudUrl) {
      throw new Error(
        "Chưa cấu hình CLOUD_STORAGE_URL trong .env. Hiện tại hãy đặt STORAGE_DRIVER=\"local\" để lưu vào public/uploads."
      );
    }

    // Ví dụ tích hợp Cloudinary / Supabase Storage sau này:
    // 1. Nén ảnh sang WebP bằng sharp(buffer)
    // 2. Gửi lên Cloudinary / Supabase bucket
    // 3. Trả về { url: "https://res.cloudinary.com/...", fileName, size }
    throw new Error("CloudStorageProvider: Hãy cấu hình SDK đám mây khi triển khai Giai đoạn 5.");
  }

  async deleteImage(_url: string): Promise<boolean> {
    // Gọi API xóa ảnh trên Cloudinary / Supabase Storage
    return true;
  }
}
