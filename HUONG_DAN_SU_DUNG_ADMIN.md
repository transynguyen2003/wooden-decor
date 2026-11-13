# HƯỚNG DẪN BÀN GIAO & SỬ DỤNG HỆ THỐNG WEBSITE WOODEN DECOR
*(Dành cho Chủ sở hữu website & Bộ phận Quản trị)*

---

## 1. THÔNG TIN TRUY CẬP HỆ THỐNG

| Hạng mục | Đường dẫn / Thông tin | Ghi chú |
| :--- | :--- | :--- |
| **Trang chủ Website** | `https://thienan-woodendecor.vercel.app` *(hoặc tên miền chính thức của bạn)* | Khách hàng truy cập mua sắm, xem mẫu |
| **Trang Quản trị (Admin)**| `https://thienan-woodendecor.vercel.app/admin` | Khu vực quản lý toàn bộ dữ liệu |
| **Tài khoản đăng nhập mặc định** | `admin` | Tên đăng nhập |
| **Mật khẩu mặc định** | `admin123` | *Cần đổi ngay sau khi nhận bàn giao* |

> **Hành động đầu tiên sau khi nhận web:** Bạn hãy đăng nhập vào `/admin` -> Chọn menu **"Cài đặt & Mật khẩu"** -> Tiến hành **Đổi mật khẩu Admin mới** để đảm bảo tính bảo mật.

---

## 2. QUẢN LÝ THÔNG TIN CỬA HÀNG & THƯƠNG HIỆU

Truy cập menu: **"Cài đặt & Mật khẩu"** (`/admin/settings`)

Tại đây bạn có thể thay đổi toàn bộ thông tin xuất hiện trên Header, Footer và các trang giới thiệu:
1. **Tên thương hiệu & Slogan:** Thay đổi tên hiển thị (Ví dụ: *Wooden Decor - Đồ Gỗ Thủ Công Cao Cấp*).
2. **Thông tin liên hệ:**
   - **Số điện thoại Hotline:** Số khách bấm gọi trực tiếp trên web.
   - **Số Zalo:** Số nhận tin nhắn khi khách bấm nút "Chat Zalo".
   - **Email & Địa chỉ Showroom / Xưởng:** Xuất hiện tại Footer và trang Liên hệ.
   - **Giờ mở cửa:** Cập nhật thời gian làm việc để khách tiện ghé thăm.
3. **Mạng xã hội:** Điền đường link Fanpage Facebook, kênh TikTok của xưởng.
4. **Tỷ giá USD:** Cập nhật tỷ giá quy đổi hiển thị giá tự động khi khách xem giao diện Tiếng Anh (EN).

---

## 3. CẤU HÌNH TRỢ LÝ AI TƯ VẤN (GEMINI AI CHATBOT 24/7)

Hệ thống tích hợp sẵn Trợ lý AI tự động trả lời khách hàng ở góc dưới bên phải màn hình:

1. **Khóa API Google Gemini (`geminiApiKey`):**
   - Hệ thống đã tích hợp sẵn khóa API. Nếu bạn muốn dùng tài khoản Google AI Studio riêng của mình, chỉ cần lấy API Key từ [Google AI Studio](https://aistudio.google.com/) và dán vào ô này.
2. **Lời nhắc tùy chỉnh cho AI (`aiCustomPrompt`):**
   - Bạn có thể "dạy" thêm phong cách nói chuyện hoặc thông tin khuyến mãi cho AI.
   - *Ví dụ mẫu:* `"Tháng này xưởng đang giảm giá 10% cho trọn bộ phòng khách. Nếu khách hỏi địa chỉ thì mời khách ghé xưởng xem mộc trực tiếp."`
3. **Cơ chế an toàn (Dự phòng):** Nếu hết hạn ngạch Gemini hoặc mất mạng, web sẽ tự động chuyển sang chế độ NLU nội bộ để trả lời giá, tư vấn gỗ mà không bị gián đoạn.

---

## 4. QUẢN LÝ SẢN PHẨM & GIÁ BÁN

Truy cập menu: **"Sản phẩm & Giá"** (`/admin/products`)

### 4.1. Thêm sản phẩm mới
- Bấm nút **"+ Thêm sản phẩm mới"**.
- Điền các thông tin:
  - **Tên sản phẩm:** Điền tên tiếng Việt (và tiếng Anh nếu muốn hiển thị chuẩn song ngữ).
  - **Danh mục:** Chọn danh mục tương ứng (Sofa, Bàn trà, Giường ngủ, Kệ sách...).
  - **Chất liệu gỗ:** Ví dụ: *Gỗ Óc Chó Bắc Mỹ*, *Gỗ Mun*, *Gõ Đỏ*...
  - **Kích thước:** Điền kích thước Dài x Rộng x Cao (cm).
  - **Giá bán (VND):** Nhập giá số (Ví dụ: `28500000`). Nếu là hàng đặt làm riêng chưa có giá cố định, tích chọn **"Liên hệ báo giá"**.
  - **Hình ảnh sản phẩm:** Bấm chọn ảnh hoặc kéo thả ảnh vào khung. Hệ thống sẽ tự động nén tối ưu định dạng WebP sắc nét, tải nhanh. Bạn có thể chọn 1 ảnh làm "Ảnh đại diện" (Cover).
  - **Nổi bật (Featured):** Tích chọn để đưa sản phẩm ra mục "Tuyệt tác tiêu biểu" trên trang chủ.

### 4.2. Chỉnh sửa & Nhân bản nhanh
- **Sửa nhanh giá tại bảng:** Bạn có thể chỉnh sửa giá tiền ngay trên danh sách mà không cần mở form chi tiết.
- **Sửa giá hàng loạt theo %:** Hỗ trợ tăng/giảm giá theo mùa (Ví dụ nhập `5` để tăng 5%, hoặc `-10` để giảm 10% toàn bộ danh mục).
- **Nhân bản (Duplicate):** Bấm nút sao chép để tạo nhanh sản phẩm tương tự mà không cần nhập lại từ đầu.

---

## 5. QUẢN LÝ DANH MỤC & BỘ SƯU TẬP

- **Danh mục (`/admin/categories`):** Quản lý các nhóm sản phẩm (Phòng khách, Phòng ngủ, Kệ decor...). Bạn có thể đổi tên, tải ảnh đại diện danh mục và sắp xếp thứ tự hiển thị.
- **Bộ sưu tập (`/admin/collections`):** Gom các sản phẩm thành concept không gian (Ví dụ: *Bộ sưu tập Indochine Organic*, *Bộ sưu tập Tối giản Wabi-Sabi*).

---

## 6. QUẢN LÝ YÊU CẦU TƯ VẤN CỦA KHÁCH HÀNG (INQUIRIES)

Truy cập menu: **"Yêu cầu tư vấn"** (`/admin/inquiries`)

Mỗi khi khách hàng:
- Điền form tư vấn trên website.
- Hoặc để lại Số điện thoại trong khung Chat AI.

Hệ thống sẽ lập tức tạo một phiếu yêu cầu với đầy đủ:
- **Họ tên khách hàng**
- **Số điện thoại (kèm nút bấm gọi nhanh hoặc mở Zalo chat ngay)**
- **Sản phẩm khách đang xem**
- **Nội dung lời nhắn của khách**
- **Trạng thái xử lý:** Bạn có thể đổi trạng thái từ `Chưa xử lý` -> `Đã liên hệ` -> `Hoàn thành` để theo dõi tiến độ chăm sóc khách.

---

## 7. BÀI ĐĂNG CẢM HƯNG & VIDEO XƯỞNG

- **Bài đăng hằng ngày (`/admin/posts`):** Viết nhật ký xưởng mộc, bài viết chia sẻ kinh nghiệm chọn gỗ, kiến thức nội thất. Hỗ trợ SEO tự động, giúp tăng thứ hạng website trên Google.
- **Video xưởng & Thực tế (`/admin/videos`):** Đăng tải các clip ngắn (Reels/Shorts) quay cận cảnh nghệ nhân chà nhám, đục đẽo, hoàn thiện sản phẩm để tăng uy tín với khách hàng.

---

## 8. HƯỚNG DẪN VẬN HÀNH & XỬ LÝ LỖI NHANH

| Vấn đề thường gặp | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **Đăng ảnh sản phẩm bị chậm** | File ảnh gốc quá nặng (trên 15-20MB) | Nên dùng ảnh kích thước dưới 5MB. Hệ thống sẽ tự động tối ưu sang WebP. |
| **Sửa thông tin nhưng ngoài web chưa đổi ngay** | Bộ nhớ đệm (Cache) của trình duyệt | Bấm phím `Ctrl + F5` (hoặc mở tab ẩn danh) để làm mới dữ liệu lập tức. |
| **Quên mật khẩu Admin** | Chưa lưu mật khẩu mới | Nhờ kỹ thuật viên hỗ trợ reset mật khẩu qua Database hoặc chạy mã đổi mật khẩu. |
| **Chatbot trả lời nội dung chung chung** | Chưa điền hướng dẫn tùy chỉnh | Vào `/admin/settings` mục 5, viết thêm thông tin sản phẩm và chính sách xưởng vào ô `aiCustomPrompt`. |

---
*Tài liệu bàn giao bản quyền hệ thống Website Wooden Decor — Chế tác & Vận hành mượt mà.*
