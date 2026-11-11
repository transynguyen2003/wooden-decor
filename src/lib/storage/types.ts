/**
 * Giao diện chuẩn (Interface) cho lớp lưu trữ hình ảnh.
 * Mọi nơi trong dự án chỉ gọi qua chuẩn này để sau này đổi từ lưu trên máy (public/uploads)
 * sang lưu trên đám mây (Cloudinary / Supabase Storage / S3) mà không cần sửa code các trang.
 */

export type UploadFolder = "products" | "categories" | "collections" | "banners" | "posts" | "logo";

export interface UploadResult {
  /** Đường dẫn ảnh để lưu vào Database và hiển thị trên web (VD: /uploads/products/abc.webp hoặc https://...) */
  url: string;
  /** Tên file đã lưu */
  fileName: string;
  /** Kích thước file sau khi nén (bytes) */
  size: number;
  /** Chiều rộng ảnh sau khi tối ưu */
  width?: number;
  /** Chiều cao ảnh sau khi tối ưu */
  height?: number;
}

export interface UploadOptions {
  folder?: UploadFolder;
  maxWidth?: number;
  quality?: number;
}

export interface IStorageProvider {
  /**
   * Lưu một file ảnh từ Buffer hoặc File tải lên
   */
  uploadImage(
    buffer: Buffer,
    originalName: string,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Xóa một file ảnh theo đường dẫn URL đã lưu
   */
  deleteImage(url: string): Promise<boolean>;
}
