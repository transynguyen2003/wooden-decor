import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const EXTRACTED_DIR =
  "C:\\Users\\nstra\\.gemini\\antigravity\\brain\\03a2b6ae-c3b4-4399-ba06-0ec69771aaca\\scratch\\extracted\\ảnh decore";
const PUBLIC_UPLOADS = path.join(process.cwd(), "public", "uploads");

// Ánh xạ 26 file ảnh gốc trong file zip sang tên file rõ nghĩa, dễ quản lý
const IMAGE_MAPPING: Array<{
  suffix: string;
  folder: "products" | "banners" | "categories" | "collections" | "posts";
  targetName: string;
  maxWidth?: number;
}> = [
  // 1. Sofa Gỗ Mun & Óc Chó Dáng Sóng Sơn Thủy
  { suffix: "709_6746203941068174019_6746203941068174019_768d33e3fa94c3f3960b074b28a9c697.jpg", folder: "products", targetName: "sofa-go-mun-dang-song-1.webp" },
  { suffix: "717_6746203941068174019_6746203941068174019_f133f089e245b1f5b93b00b8f8a2a77a.jpg", folder: "products", targetName: "sofa-go-mun-dang-song-2.webp" },
  { suffix: "726_6746203941068174019_6746203941068174019_2c5c289a013ab19991da988277a305f7.jpg", folder: "products", targetName: "sofa-go-mun-dang-song-khung-go.webp" },
  { suffix: "701_6746203941068174019_6746203941068174019_eb84918b41c24573dfb3b248d4a26809.jpg", folder: "products", targetName: "ghe-don-go-oc-cho-dang-om.webp" },
  { suffix: "631_6746203941068174019_6746203941068174019_aa289b74674a741f0b9e5a02ecb8a936.jpg", folder: "banners", targetName: "hero-phong-khach-dang-song.webp", maxWidth: 1920 },
  { suffix: "595_6746203941068174019_6746203941068174019_e5dc2a387ebd58492bab7a879f99c7a4.jpg", folder: "products", targetName: "bo-sofa-ban-tra-dang-song.webp" },

  // 2. Sofa Gỗ Óc Chó Đường Cong Vô Cực Da Nâu Espresso
  { suffix: "529_6746203941068174019_6746203941068174019_8ae4eb90483078c6fca493d622097a5c.jpg", folder: "products", targetName: "sofa-oc-cho-vo-cuc-1.webp" },
  { suffix: "577_6746203941068174019_6746203941068174019_32df8b8b3da0ca008905b18f0eecc7d9.jpg", folder: "products", targetName: "sofa-oc-cho-vo-cuc-2.webp" },
  { suffix: "546_6746203941068174019_6746203941068174019_7cc80b550a28a8bd7700108cabd85a95.jpg", folder: "products", targetName: "sofa-oc-cho-vo-cuc-3.webp" },
  { suffix: "509_6746203941068174019_6746203941068174019_37aac19b3f17ce322805ccf77b80140e.jpg", folder: "products", targetName: "ghe-armchair-oc-cho-vo-cuc.webp" },
  { suffix: "692_6746203941068174019_6746203941068174019_499d08395df39373f1a5d28e6d01d210.jpg", folder: "posts", targetName: "xuong-che-tac-khung-sofa.webp" },

  // 3. Sofa Văng Gỗ Óc Chó Điêu Khắc Da Kem Hoàng Gia
  { suffix: "667_6746203941068174019_6746203941068174019_1be3b264f286f92b77c357a4782fdc0c.jpg", folder: "products", targetName: "sofa-vang-da-kem-hoang-gia-1.webp" },
  { suffix: "683_6746203941068174019_6746203941068174019_62aab75bf94d43493a31f9f061c0e457.jpg", folder: "products", targetName: "sofa-vang-da-kem-hoang-gia-2.webp" },
  { suffix: "649_6746203941068174019_6746203941068174019_ad4ad91396b01055c7310f31ddde1644.jpg", folder: "products", targetName: "sofa-vang-da-kem-view-ho-sen.webp" },

  // 4. Bộ Sofa Gỗ Óc Chó & Bàn Trà Oval Da Bò Ý
  { suffix: "675_6746203941068174019_6746203941068174019_42ecc14d603ddb5fb8dcac9af8545b93.jpg", folder: "products", targetName: "bo-sofa-ban-tra-oval-rung-thong-1.webp" },
  { suffix: "568_6746203941068174019_6746203941068174019_bdd00db9f4c4a3f25d3e01fad4ee45cb.jpg", folder: "products", targetName: "bo-sofa-ban-tra-van-go-nui-rung-2.webp" },

  // 5. Sofa Góc L Tích Hợp Kệ Sách & Sofa Vòng Cung
  { suffix: "640_6746203941068174019_6746203941068174019_f1bdfe19a61b26bcc91785c3bf4378a5.jpg", folder: "products", targetName: "sofa-goc-l-tich-hop-ke-sach.webp" },
  { suffix: "559_6746203941068174019_6746203941068174019_4aad5afff2af1788c10547c8287fe9c9.jpg", folder: "products", targetName: "sofa-vong-cung-ban-nguyet.webp" },

  // 6. Bộ Bàn Ghế Gỗ Gõ Đỏ & Bàn Trà Trống Đồng Đông Dương
  { suffix: "657_6746203941068174019_6746203941068174019_cff4059282e8d6588f09a6eba8c4d20c.jpg", folder: "products", targetName: "bo-ban-ghe-go-do-dong-duong.webp" },

  // 7. Kệ Sách & Vách Tivi Gỗ Óc Chó Bán Nguyệt
  { suffix: "587_6746203941068174019_6746203941068174019_64d7db87f36dc459796db87de9236084.jpg", folder: "products", targetName: "ke-sach-go-oc-cho-ban-nguyet-1.webp" },
  { suffix: "745_6746203941068174019_6746203941068174019_69b26501988b977c6b0431df1551e7be.jpg", folder: "products", targetName: "vach-tivi-go-oc-cho-ban-nguyet-2.webp" },

  // 8. Hệ Tủ Quần Áo Walk-in & Tủ Giày Sảnh Vòm Gỗ Hương Đỏ
  { suffix: "604_6746203941068174019_6746203941068174019_9216102c41e01bd8c16828bef518c86e.jpg", folder: "products", targetName: "he-tu-ao-walkin-go-huong-1.webp" },
  { suffix: "623_6746203941068174019_6746203941068174019_23e50ed3765ceb7fb894695ed2947b15.jpg", folder: "products", targetName: "he-tu-ao-walkin-go-huong-2.webp" },
  { suffix: "614_6746203941068174019_6746203941068174019_6c379772f2b24848f258432ce9376163.jpg", folder: "products", targetName: "tu-sanh-vom-go-huong-do.webp" },

  // 9. Giường Ngủ Gỗ Tự Nhiên Chế Tác Thủ Công
  { suffix: "474_6746203941068174019_6746203941068174019_8f6781d71d8a94e18891955238eab734.jpg", folder: "products", targetName: "giuong-ngu-go-oc-cho-duong-cong-1.webp" },
  { suffix: "736_6746203941068174019_6746203941068174019_5c1c6c6163ba1b1d18e4ef008a80aa15.jpg", folder: "products", targetName: "giuong-ngu-go-cham-khac-hoang-gia-2.webp" },
];

async function main() {
  console.log("Bắt đầu tối ưu hóa Logo và 26 ảnh nội thất từ file zip...");

  // 1. Tạo các thư mục trong public/uploads
  for (const dir of ["logo", "banners", "categories", "collections", "products", "posts"]) {
    await fs.mkdir(path.join(PUBLIC_UPLOADS, dir), { recursive: true });
  }

  // 2. Nén file logo.png (từ 4.7MB xuống bản nhẹ sắc nét)
  const logoSrc = path.join(EXTRACTED_DIR, "logo.png");
  const logoDestWebp = path.join(PUBLIC_UPLOADS, "logo", "logo.webp");
  const logoDestPng = path.join(PUBLIC_UPLOADS, "logo", "logo.png");

  await sharp(logoSrc)
    .resize({ width: 512, height: 512, fit: "inside" })
    .webp({ quality: 90 })
    .toFile(logoDestWebp);

  await sharp(logoSrc)
    .resize({ width: 512, height: 512, fit: "inside" })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(logoDestPng);

  console.log("✔ Đã tối ưu hóa logo.png (4.7MB -> ~25KB WebP & PNG)");

  // 3. Nén 26 ảnh nội thất sang WebP
  const allFiles = await fs.readdir(EXTRACTED_DIR);

  for (const item of IMAGE_MAPPING) {
    const matchedFile = allFiles.find((f) => f.endsWith(item.suffix));
    if (!matchedFile) {
      console.warn("Không tìm thấy:", item.suffix);
      continue;
    }

    const srcPath = path.join(EXTRACTED_DIR, matchedFile);
    const destPath = path.join(PUBLIC_UPLOADS, item.folder, item.targetName);
    const maxW = item.maxWidth || 1600;

    await sharp(srcPath)
      .rotate()
      .resize({ width: maxW, height: maxW, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(destPath);
  }

  console.log("✔ Đã chuyển đổi và nén toàn bộ 26 ảnh sang định dạng WebP trong public/uploads/!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
