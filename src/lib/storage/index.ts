import { IStorageProvider } from "./types";
import { LocalStorageProvider } from "./local";
import { CloudStorageProvider } from "./cloud";

export * from "./types";

/**
 * Hàm lấy bộ lưu trữ ảnh dựa theo biến môi trường STORAGE_DRIVER.
 * - Mặc định: "local" -> lưu vào `public/uploads`
 * - Tương lai: "cloud" -> lưu lên Cloudinary / Supabase Storage
 */
function createStorageService(): IStorageProvider {
  const driver = process.env.STORAGE_DRIVER || "local";
  if (driver === "cloud") {
    return new CloudStorageProvider();
  }
  return new LocalStorageProvider();
}

export const storageService: IStorageProvider = createStorageService();

// Kiểm tra định dạng và dung lượng file ảnh theo Mục 6.4 & 9 URD
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // Giới hạn 5 MB mỗi ảnh

export function validateImageFile(file: { type: string; size: number }): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.",
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Dung lượng ảnh vượt quá giới hạn 5 MB. Vui lòng chọn ảnh nhỏ hơn.",
    };
  }
  return { valid: true };
}
