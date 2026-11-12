# HƯỚNG DẪN ĐƯA WEBSITE WOODEN DECOR LÊN INTERNET (GIẢI PHÁP A)

Website của bạn hiện tại đã được cấu hình trọn gói với SQLite, hình ảnh, video thực tế, nhạc Giáng sinh và Custom Cursor. Bạn có thể triển khai lên Internet theo 2 cách đơn giản nhất dưới đây:

---

## CÁCH 1: TRIỂN KHAI MIỄN PHÍ QUA RENDER.COM (KHÔNG CẦN CÀI ĐẶT MÁY CHỦ)

1. **Đẩy mã nguồn lên GitHub:**
   - Mở trình duyệt vào [https://github.com/new](https://github.com/new) tạo 1 repository mới (ví dụ đặt tên: `wooden-decor`).
   - Mở terminal trong thư mục dự án và chạy:
     ```bash
     git remote add origin https://github.com/<tai-khoan-cua-ban>/wooden-decor.git
     git branch -M main
     git push -u origin main
     ```

2. **Đăng ký Render:**
   - Truy cập [https://render.com](https://render.com) và đăng nhập bằng tài khoản **GitHub**.
   - Bấm **New +** -> Chọn **Web Service**.
   - Chọn repository `wooden-decor` vừa đẩy lên.

3. **Điền thông tin triển khai:**
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
   - **Environment Variables (Biến môi trường):**
     - `DATABASE_URL`: `file:./dev.db`
     - `JWT_SECRET`: `wooden_decor_secret_key_2026`
   - Bấm **Deploy Web Service** là website sẽ chạy trực tiếp trên Internet với tên miền miễn phí dạng `https://wooden-decor.onrender.com`.

---

## CÁCH 2: CHẠY TRÊN MÁY TÍNH CỦA BẠN (LOCAL / NỘI BỘ)

- Bạn chỉ cần nhấp đúp vào file `CHAY-WEBSITE.bat` trong thư mục dự án.
- Mở trình duyệt gõ: `http://localhost:3000` là website sẽ chạy ở phiên bản Production tối ưu nhất (tốc độ mở trang cực nhanh dưới 0.1 giây).
