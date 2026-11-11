# Wooden Decor — Website Trưng Bày Nội Thất & Decor Gỗ Tự Nhiên

Dự án được xây dựng bằng **Next.js (App Router) + TypeScript + Tailwind CSS + SQLite (Prisma)** bám sát tài liệu URD.

## 1. Cách chạy dự án trên máy Windows (Dành cho người mới)

Mở Terminal tại thư mục `C:\Users\nstra\.gemini\antigravity\scratch\wooden-decor` và chạy:

```powershell
# Chạy máy chủ phát triển (Development server)
npm.cmd run dev
```

*(Lưu ý nhỏ trên Windows PowerShell: Dùng `npm.cmd` thay cho `npm` để không bị lỗi chặn script của Windows).*

Sau đó mở trình duyệt tại:
- **Website dành cho Khách (Tiếng Việt):** [http://localhost:3000/vi](http://localhost:3000/vi)
- **Website dành cho Khách (Tiếng Anh + Quy đổi USD ước tính):** [http://localhost:3000/en](http://localhost:3000/en)
- **Trang Quản trị dành cho Chủ shop:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - **Email mặc định:** `admin@woodendecor.vn`
  - **Mật khẩu mặc định:** `Admin@123`

## 2. Các lệnh hữu ích khác

```powershell
# Nạp lại dữ liệu mẫu ban đầu (nếu muốn làm mới Database)
npm.cmd run db:seed

# Sao lưu toàn bộ Database SQLite (dev.db) và thư mục ảnh (public/uploads)
npm.cmd run backup

# Mở giao diện xem bảng dữ liệu trực quan của Prisma
npm.cmd run db:studio
```

## 3. Cách chuyển từ lưu ảnh trên máy (`public/uploads`) sang Đám mây (Cloud) sau này

Toàn bộ logic tải ảnh đã được tách riêng trong thư mục `src/lib/storage/`:
- Hiện tại: `.env` đặt `STORAGE_DRIVER="local"` -> tự động dùng `LocalStorageProvider` (`src/lib/storage/local.ts`) để nén ảnh sang `.webp` bằng `sharp` và lưu vào `public/uploads/`.
- Khi đưa lên mạng: chỉ cần cấu hình SDK Cloudinary hoặc Supabase trong `src/lib/storage/cloud.ts` và đổi `.env` thành `STORAGE_DRIVER="cloud"` mà không cần sửa code của bất kỳ trang nào.
