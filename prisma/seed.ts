import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Đang khởi tạo dữ liệu mẫu cho Wooden Decor...");

  // 1. Tạo tài khoản Admin mặc định
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@woodendecor.vn" },
    update: {},
    create: {
      email: "admin@woodendecor.vn",
      passwordHash,
      name: "Chủ Xưởng Wooden Decor",
    },
  });

  // 2. Cài đặt chung của website (SiteSetting)
  const defaultSettings = [
    { key: "brandName", valueVi: "Wooden Decor", valueEn: "Wooden Decor", group: "general" },
    {
      key: "slogan",
      valueVi: "Nghệ Thuật Điêu Khắc Gỗ Tự Nhiên Đương Đại",
      valueEn: "Contemporary Sculptural Solid Wood Artistry",
      group: "general",
    },
    { key: "logoUrl", valueVi: "/uploads/logo/logo-thien-an.webp", valueEn: "/uploads/logo/logo-thien-an.webp", group: "general" },
    { key: "phone", valueVi: "0328990001", valueEn: "0328990001", group: "contact" },
    { key: "zalo", valueVi: "0328990001", valueEn: "0328990001", group: "contact" },
    { key: "email", valueVi: "lienhe@woodendecor.vn", valueEn: "contact@woodendecor.vn", group: "contact" },
    {
      key: "address",
      valueVi: "Thôn Đông Trước, xã Xuân Cẩm, Bắc Ninh",
      valueEn: "Dong Truoc Village, Xuan Cam Commune, Bac Ninh",
      group: "contact",
    },
    {
      key: "openingHours",
      valueVi: "08:00 – 20:30 (Thứ Hai – Chủ Nhật)",
      valueEn: "08:00 AM – 08:30 PM (Monday – Sunday)",
      group: "contact",
    },
    {
      key: "facebookUrl",
      valueVi: "https://www.facebook.com/share/19mzd2PcQz/?mibextid=wwXIfr",
      valueEn: "https://www.facebook.com/share/19mzd2PcQz/?mibextid=wwXIfr",
      group: "contact",
    },
    {
      key: "tiktokUrl",
      valueVi: "https://www.tiktok.com/@thienanthien26?_r=1&_t=ZS-9BKYcE9SLYI",
      valueEn: "https://www.tiktok.com/@thienanthien26?_r=1&_t=ZS-9BKYcE9SLYI",
      group: "contact",
    },
    { key: "usdExchangeRate", valueVi: "25000", valueEn: "25000", group: "general" },
    {
      key: "heroTitle",
      valueVi: "Đường Cong Nguyên Bản Của Gỗ Tự Nhiên",
      valueEn: "Sculpted Organic Curves in Solid Wood",
      group: "banner",
    },
    {
      key: "heroSubtitle",
      valueVi:
        "Mỗi thiết kế tại Wooden Decor là một tác phẩm điêu khắc độc bản từ gỗ Óc Chó Bắc Mỹ, gỗ Mun và gỗ Gõ Đỏ — mang hơi ấm tĩnh tại vào không gian sống của bạn.",
      valueEn:
        "Every piece at Wooden Decor is a bespoke sculpture crafted from North American Walnut, Ebony, and Rosewood — bringing serene warmth into your home.",
      group: "banner",
    },
    { key: "heroCtaText", valueVi: "Xem sản phẩm", valueEn: "Explore Products", group: "banner" },
    {
      key: "heroBannerImage",
      valueVi: "/uploads/banners/hero-phong-khach-dang-song.webp",
      valueEn: "/uploads/banners/hero-phong-khach-dang-song.webp",
      group: "banner",
    },
    {
      key: "aboutTitle",
      valueVi: "Hơn 15 Năm Giữ Hồn Gỗ Tự Nhiên Việt Nam",
      valueEn: "Over 15 Years Preserving the Soul of Natural Timber",
      group: "about",
    },
    {
      key: "aboutStory",
      valueVi:
        "Khởi nguồn từ một xưởng mộc thủ công chuyên chế tác nội thất gỗ nguyên khối, Wooden Decor theo đuổi triết lý tối giản ấm áp: loại bỏ những chi tiết rườm rà để tôn vinh trọn vẹn đường vân uốn lượn tự nhiên của từng thớ gỗ lâu năm.\n\nTại xưởng của chúng tôi, không có dây chuyền sản xuất đại trà. Từng bộ sofa dáng sóng, từng chiếc bàn trà vô cực hay hệ tủ vòm đều được các nghệ nhân lành nghề phác thảo, ghép mộng truyền thống và chà nhám thủ công suốt hàng trăm giờ đồng hồ.",
      valueEn:
        "Born from an artisanal woodworking studio specializing in solid timber, Wooden Decor pursues a philosophy of warm minimalism: stripping away excess ornament to celebrate the organic grain of aged hardwood.\n\nIn our workshop, there is no mass production. Every wave-sculpted sofa, infinity coffee table, and arched cabinet is hand-shaped, joined with traditional mortise-and-tenon craftsmanship, and hand-sanded over hundreds of hours.",
      group: "about",
    },
  ];

  for (const item of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }

  // Xóa dữ liệu sản phẩm/danh mục cũ nếu chạy lại seed
  await prisma.postProduct.deleteMany();
  await prisma.post.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();

  // 3. Tạo 4 Danh mục (Categories)
  const catSofa = await prisma.category.create({
    data: {
      slug: "sofa-ghe-go",
      nameVi: "Sofa & Ghế Điêu Khắc",
      nameEn: "Sculpted Sofas & Armchairs",
      descriptionVi: "Sofa gỗ tự nhiên uốn lượn nguyên khối kết hợp đệm da bò Ý cao cấp.",
      descriptionEn: "Fluid solid wood sofas paired with premium Italian leather upholstery.",
      imageUrl: "/uploads/products/sofa-oc-cho-vo-cuc-1.webp",
      sortOrder: 1,
    },
  });

  const catTable = await prisma.category.create({
    data: {
      slug: "ban-tra-ban-an",
      nameVi: "Bàn Trà & Bộ Phòng Khách",
      nameEn: "Coffee Tables & Living Sets",
      descriptionVi: "Bàn trà dáng sóng vô cực và bộ bàn ghế phòng khách đồng bộ.",
      descriptionEn: "Infinity wave coffee tables and complete solid wood living room sets.",
      imageUrl: "/uploads/products/bo-sofa-ban-tra-dang-song.webp",
      sortOrder: 2,
    },
  });

  const catShelf = await prisma.category.create({
    data: {
      slug: "ke-tu-trang-tri",
      nameVi: "Kệ Nghệ Thuật & Hệ Tủ Gỗ",
      nameEn: "Artistic Shelves & Wardrobes",
      descriptionVi: "Kệ sách bán nguyệt, vách tivi và hệ tủ quần áo gỗ tự nhiên.",
      descriptionEn: "Crescent moon bookshelves, TV wall units, and custom solid wood wardrobes.",
      imageUrl: "/uploads/products/ke-sach-go-oc-cho-ban-nguyet-1.webp",
      sortOrder: 3,
    },
  });

  const catBed = await prisma.category.create({
    data: {
      slug: "giuong-ngu-go",
      nameVi: "Giường Ngủ Gỗ Nguyên Khối",
      nameEn: "Solid Wood Master Beds",
      descriptionVi: "Giường ngủ chế tác thủ công từ gỗ Óc Chó và gỗ Gõ Đỏ tự nhiên.",
      descriptionEn: "Handcrafted master beds made from solid Walnut and Red Padauk.",
      imageUrl: "/uploads/products/giuong-ngu-go-oc-cho-duong-cong-1.webp",
      sortOrder: 4,
    },
  });

  // 4. Tạo 3 Bộ sưu tập (Collections)
  const colSculptural = await prisma.collection.create({
    data: {
      slug: "phong-khach-duong-cong-duong-dai",
      nameVi: "Phòng Khách Đường Cong Đương Đại",
      nameEn: "Sculptural Curves Living",
      descriptionVi: "Lấy cảm hứng từ dòng chảy tự nhiên của nước và vân gỗ lâu năm.",
      descriptionEn: "Inspired by the organic flow of water and aged timber grain.",
      imageUrl: "/uploads/products/sofa-go-mun-dang-song-1.webp",
      isFeatured: true,
      sortOrder: 1,
    },
  });

  const colSanctuary = await prisma.collection.create({
    data: {
      slug: "khong-gian-nghi-duong-am-cung",
      nameVi: "Không Gian Nghỉ Dưỡng Tự Nhiên",
      nameEn: "Warm Nature Sanctuary",
      descriptionVi: "Tông gỗ nâu trầm ấm áp hòa quyện cùng ánh sáng tự nhiên cho biệt thự và căn hộ cao cấp.",
      descriptionEn: "Warm walnut tones blending effortlessly with natural light for villas and penthouses.",
      imageUrl: "/uploads/products/bo-sofa-ban-tra-oval-rung-thong-1.webp",
      isFeatured: true,
      sortOrder: 2,
    },
  });

  const colBespoke = await prisma.collection.create({
    data: {
      slug: "tuyet-tac-che-tac-doc-ban",
      nameVi: "Tuyệt Tác Chế Tác Độc Bản",
      nameEn: "Bespoke Artisan Masterpieces",
      descriptionVi: "Những thiết kế đo ni đóng giày theo diện tích thực tế của từng gia chủ.",
      descriptionEn: "Custom-engineered woodwork tailored to the exact architecture of your home.",
      imageUrl: "/uploads/products/he-tu-ao-walkin-go-huong-1.webp",
      isFeatured: true,
      sortOrder: 3,
    },
  });

  // 5. Tạo 9 Sản phẩm tiêu biểu sử dụng toàn bộ 26 ảnh thật
  const p1 = await prisma.product.create({
    data: {
      slug: "sofa-go-mun-dang-song-son-thuy",
      categoryId: catSofa.id,
      nameVi: "Sofa Gỗ Mun & Óc Chó Dáng Sóng Sơn Thủy",
      nameEn: "Mountain Wave Sculpted Walnut & Ebony Sofa",
      price: 68500000,
      isContactPrice: false,
      priceNoteVi: "Đã bao gồm đệm da bò Ý tự nhiên",
      priceNoteEn: "Includes full-grain Italian leather cushions",
      materialVi: "Gỗ Óc Chó Bắc Mỹ & Gỗ Mun nguyên khối, Da bò Ý màu kem sữa",
      materialEn: "Solid North American Walnut & Ebony, Cream Italian Leather",
      dimensionsVi: "Dài 280 cm × Sâu 98 cm × Cao 86 cm",
      dimensionsEn: "L 280 cm × D 98 cm × H 86 cm",
      descriptionVi:
        "Thiết kế biểu tượng của Wooden Decor với phần tựa lưng uốn lượn mềm mại như dãy núi trùng điệp. Phần gầm ghế được đục rỗng nghệ thuật vừa tạo cảm giác thanh thoát vừa có thể đặt sách hoặc phụ kiện trang trí.",
      descriptionEn:
        "Wooden Decor's signature sofa featuring an undulating backrest inspired by rolling mountain ridges. The sculpted hollow base creates visual lightness while offering subtle display alcoves.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/sofa-go-mun-dang-song-1.webp",
            altVi: "Sofa Gỗ Mun Dáng Sóng góc nghiêng",
            altEn: "Mountain Wave Sofa 3/4 view",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/sofa-go-mun-dang-song-2.webp",
            altVi: "Sofa Gỗ Mun Dáng Sóng nhìn chính diện",
            altEn: "Mountain Wave Sofa front view",
            sortOrder: 2,
            isCover: false,
          },
          {
            url: "/uploads/products/sofa-go-mun-dang-song-khung-go.webp",
            altVi: "Khung gỗ nguyên khối trước khi đặt đệm da",
            altEn: "Hand-sculpted solid wood frame without cushions",
            sortOrder: 3,
            isCover: false,
          },
          {
            url: "/uploads/products/ghe-don-go-oc-cho-dang-om.webp",
            altVi: "Ghế đơn đồng bộ dáng ôm",
            altEn: "Matching sculpted single armchair",
            sortOrder: 4,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSculptural.id }, { collectionId: colBespoke.id }],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      slug: "sofa-go-oc-cho-duong-cong-vo-cuc",
      categoryId: catSofa.id,
      nameVi: "Sofa Gỗ Óc Chó Đường Cong Vô Cực Bọc Da Espresso",
      nameEn: "Infinity Curve Walnut & Espresso Leather Sofa",
      price: 54000000,
      isContactPrice: false,
      priceNoteVi: "Bảo hành khung gỗ 10 năm",
      priceNoteEn: "10-year solid wood frame warranty",
      materialVi: "Gỗ Óc Chó Bắc Mỹ hạng FAS, Da bò Nappa màu nâu Espresso",
      materialEn: "FAS-Grade North American Walnut, Espresso Nappa Leather",
      dimensionsVi: "Dài 240 cm × Sâu 95 cm × Cao 82 cm",
      dimensionsEn: "L 240 cm × D 95 cm × H 82 cm",
      descriptionVi:
        "Điểm nhấn của mẫu Sofa Vô Cực nằm ở hai tay vịn uốn vòng khép kín liền mạch từ tựa lưng xuống chân đế. Bề mặt gỗ được hoàn thiện bằng dầu lau thực vật giữ nguyên cảm giác mát mịn khi chạm tay.",
      descriptionEn:
        "Defined by its continuous loop armrests that flow seamlessly from the backrest to the base. Finished with natural plant-based oil to preserve the tactile warmth of solid walnut.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/sofa-oc-cho-vo-cuc-1.webp",
            altVi: "Sofa Gỗ Óc Chó Đường Cong Vô Cực",
            altEn: "Infinity Curve Walnut Sofa studio shot",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/sofa-oc-cho-vo-cuc-2.webp",
            altVi: "4 góc nhìn chi tiết trước, sau và ngang",
            altEn: "Four-angle view showing rear wood joinery",
            sortOrder: 2,
            isCover: false,
          },
          {
            url: "/uploads/products/sofa-oc-cho-vo-cuc-3.webp",
            altVi: "Bài trí thực tế trong phòng khách",
            altEn: "Styled in a modern living room",
            sortOrder: 3,
            isCover: false,
          },
          {
            url: "/uploads/products/ghe-armchair-oc-cho-vo-cuc.webp",
            altVi: "Ghế Armchair đơn đồng bộ",
            altEn: "Matching Infinity Curve Armchair",
            sortOrder: 4,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSculptural.id }, { collectionId: colSanctuary.id }],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      slug: "bo-ban-tra-va-sofa-go-mun-vo-cuc",
      categoryId: catTable.id,
      nameVi: "Bộ Bàn Trà Vô Cực & Sofa Gỗ Tự Nhiên (6 Món)",
      nameEn: "Complete Infinity Wave Living Room Suite (6-Piece)",
      price: 128000000,
      isContactPrice: false,
      priceNoteVi: "Trọn bộ gồm: 1 Sofa văng lớn, 2 Ghế đơn, 1 Bàn trà vô cực, 2 Đôn gỗ",
      priceNoteEn: "Includes: 1 Grand Sofa, 2 Armchairs, 1 Infinity Coffee Table, 2 Ottomans",
      materialVi: "Gỗ Mun & Gỗ Óc Chó nguyên khối, Đệm da kem cao cấp",
      materialEn: "Solid Ebony & Walnut, Premium Cream Leather",
      dimensionsVi: "Không gian đề xuất: Phòng khách từ 25 m² trở lên",
      dimensionsEn: "Recommended space: Living rooms from 25 m²+",
      descriptionVi:
        "Giải pháp trọn gói cho phòng khách biệt thự và căn hộ thông tầng. Chiếc bàn trà trung tâm được chế tác theo hình dáng dải lụa uốn cong không điểm dừng, tạo sự cân bằng hoàn hảo với bộ ghế bề thế.",
      descriptionEn:
        "A complete sculptural living room ensemble for villas and penthouses. The centerpiece coffee table is carved like a continuous ribbon of solid wood.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/bo-sofa-ban-tra-dang-song.webp",
            altVi: "Trọn bộ bàn trà vô cực và sofa dáng sóng",
            altEn: "Complete 6-piece Infinity Wave Living Suite",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/banners/hero-phong-khach-dang-song.webp",
            altVi: "Không gian phòng khách tối giản sang trọng",
            altEn: "Minimalist luxury living room setting",
            sortOrder: 2,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSculptural.id }, { collectionId: colBespoke.id }],
      },
    },
  });

  const p4 = await prisma.product.create({
    data: {
      slug: "ke-sach-go-oc-cho-ban-nguyet",
      categoryId: catShelf.id,
      nameVi: "Kệ Sách & Trưng Bày Gỗ Óc Chó Dáng Bán Nguyệt",
      nameEn: "Crescent Moon Sculpted Walnut Bookshelf",
      price: 26500000,
      isContactPrice: false,
      priceNoteVi: "Nhận chế tác kích thước theo yêu cầu",
      priceNoteEn: "Custom sizing available upon request",
      materialVi: "100% Gỗ Óc Chó tự nhiên ghép mộng âm dương",
      materialEn: "100% Solid Walnut with traditional mortise-and-tenon joinery",
      dimensionsVi: "Cao 185 cm × Rộng 165 cm × Sâu 36 cm",
      dimensionsEn: "H 185 cm × W 165 cm × D 36 cm",
      descriptionVi:
        "Lấy cảm hứng từ vầng trăng khuyết, chiếc kệ vừa là nơi lưu trữ sách, gốm sứ, trà cụ vừa là một tác phẩm điêu khắc nghệ thuật làm bừng sáng góc phòng khách hoặc phòng đọc sách.",
      descriptionEn:
        "Inspired by a crescent moon, this piece functions as both a display bookcase for ceramics and art books and a standalone wooden sculpture.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/ke-sach-go-oc-cho-ban-nguyet-1.webp",
            altVi: "Kệ sách gỗ óc chó dáng bán nguyệt",
            altEn: "Crescent Moon Walnut Bookshelf",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/vach-tivi-go-oc-cho-ban-nguyet-2.webp",
            altVi: "Phiên bản hệ vách Tivi bán nguyệt thi công thực tế",
            altEn: "Custom Crescent Moon TV Wall installation",
            sortOrder: 2,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSculptural.id }],
      },
    },
  });

  const p5 = await prisma.product.create({
    data: {
      slug: "bo-sofa-ban-tra-oval-go-oc-cho-da-cognac",
      categoryId: catTable.id,
      nameVi: "Bộ Sofa Gỗ Óc Chó & Bàn Trà Oval Da Bò Ý Cognac",
      nameEn: "Walnut & Cognac Italian Leather Lounge Suite",
      price: 92000000,
      isContactPrice: false,
      priceNoteVi: "Gồm 1 Sofa 3 chỗ, 2 Ghế Armchair, 1 Bàn trà Oval nguyên khối",
      priceNoteEn: "Includes 3-Seater Sofa, 2 Armchairs & Oval Coffee Table",
      materialVi: "Gỗ Óc Chó tự nhiên, Da bò Ý màu nâu Cognac ấm",
      materialEn: "Solid Walnut, Warm Cognac Italian Leather",
      dimensionsVi: "Sofa: 260×95 cm | Bàn trà Oval: 140×75×42 cm",
      dimensionsEn: "Sofa: 260×95 cm | Oval Table: 140×75×42 cm",
      descriptionVi:
        "Sự kết hợp ấm áp giữa vân gỗ óc chó nâu trầm và sắc da bò Cognac cổ điển. Phần tay vịn tạo rãnh thoáng 2 tầng có thể đặt tạp chí và khay trà tiện lợi.",
      descriptionEn:
        "A warm pairing of rich walnut wood grain and classic cognac leather. The dual-slotted curved armrests double as convenient side shelves.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/bo-sofa-ban-tra-oval-rung-thong-1.webp",
            altVi: "Bộ Sofa Gỗ Óc Chó và Bàn Trà Oval",
            altEn: "Walnut and Cognac Leather Lounge Suite",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/bo-sofa-ban-tra-van-go-nui-rung-2.webp",
            altVi: "Phiên bản bàn trà chữ nhật và đôn gỗ đồng bộ",
            altEn: "Rectangular coffee table and ottoman variation",
            sortOrder: 2,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSanctuary.id }],
      },
    },
  });

  const p6 = await prisma.product.create({
    data: {
      slug: "sofa-vang-go-oc-cho-da-kem-hoang-gia",
      categoryId: catSofa.id,
      nameVi: "Sofa Văng Gỗ Óc Chó Điêu Khắc Da Kem Hoàng Gia",
      nameEn: "Royal Cream Leather Sculpted Walnut Sofa",
      price: 59000000,
      isContactPrice: false,
      priceNoteVi: "",
      priceNoteEn: "",
      materialVi: "Gỗ Óc Chó Bắc Mỹ, Da bò tự nhiên màu kem ánh ngọc trai",
      materialEn: "North American Walnut, Pearl Cream Leather",
      dimensionsVi: "Dài 255 cm × Sâu 96 cm × Cao 80 cm",
      dimensionsEn: "L 255 cm × D 96 cm × H 80 cm",
      descriptionVi:
        "Thiết kế giao thoa giữa nét sang trọng tân cổ điển và đường cong hiện đại. Khung tay vịn mở rộng tạo mặt phẳng đặt tách trà ngay bên cạnh chỗ ngồi.",
      descriptionEn:
        "Blending neoclassical elegance with fluid modern curves. The wide sculpted armrest provides a built-in surface for a teacup or book.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: "/uploads/products/sofa-vang-da-kem-hoang-gia-1.webp",
            altVi: "Sofa Văng Gỗ Óc Chó Da Kem góc trái",
            altEn: "Royal Cream Leather Walnut Sofa left angle",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/sofa-vang-da-kem-hoang-gia-2.webp",
            altVi: "Sofa Văng Gỗ Óc Chó Da Kem góc phải",
            altEn: "Royal Cream Leather Walnut Sofa right angle",
            sortOrder: 2,
            isCover: false,
          },
          {
            url: "/uploads/products/sofa-vang-da-kem-view-ho-sen.webp",
            altVi: "Phiên bản tay vịn bàn trà bên hồ sen",
            altEn: "Lotus pond pavilion edition",
            sortOrder: 3,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSanctuary.id }, { collectionId: colSculptural.id }],
      },
    },
  });

  const p7 = await prisma.product.create({
    data: {
      slug: "sofa-goc-l-go-oc-cho-tich-hop-ke-sach",
      categoryId: catSofa.id,
      nameVi: "Sofa Góc L Gỗ Óc Chó Tích Hợp Kệ Sách Đa Năng",
      nameEn: "L-Shape Walnut Sectional Sofa with Integrated Bookcase",
      price: 76000000,
      isContactPrice: false,
      priceNoteVi: "Kèm bàn trà kính âm gỗ đồng bộ",
      priceNoteEn: "Includes matching glass-inlaid walnut coffee table",
      materialVi: "Gỗ Óc Chó tự nhiên, Đệm nỉ/da cao cấp tùy chọn",
      materialEn: "Solid Walnut, Custom Leather or Fabric Upholstery",
      dimensionsVi: "Dài 310 cm × Góc L 185 cm × Cao 82 cm",
      dimensionsEn: "L 310 cm × Chaise 185 cm × H 82 cm",
      descriptionVi:
        "Thiết kế thông minh tích hợp hộc kệ sách ngay bên hông tay vịn và hệ kệ chạy dọc lưng ghế, tối ưu không gian cho phòng khách căn hộ cao cấp.",
      descriptionEn:
        "Smart space-saving luxury: features built-in bookshelf compartments inside the curved armrest and a matching rear console shelf.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: false,
      images: {
        create: [
          {
            url: "/uploads/products/sofa-goc-l-tich-hop-ke-sach.webp",
            altVi: "Sofa Góc L Gỗ Óc Chó tích hợp kệ sách",
            altEn: "L-Shape Walnut Sectional with bookcase",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/sofa-vong-cung-ban-nguyet.webp",
            altVi: "Phiên bản Sofa vòng cung bán nguyệt",
            altEn: "Curved semi-circle sofa variation",
            sortOrder: 2,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colSanctuary.id }],
      },
    },
  });

  const p8 = await prisma.product.create({
    data: {
      slug: "he-tu-quan-ao-walkin-va-tu-sanh-go-huong-do",
      categoryId: catShelf.id,
      nameVi: "Hệ Tủ Áo Walk-in Closet & Tủ Sảnh Vòm Gỗ Hương Đỏ",
      // Cố ý để trống nameEn ở đây hoặc để kiểm chứng tính năng fallback, nhưng ta để nameEn và để trống priceNoteEn để test fallback
      nameEn: "Bespoke Rosewood Walk-in Closet & Arched Entryway Cabinet",
      price: null,
      isContactPrice: true,
      priceNoteVi: "Liên hệ đo đạc & báo giá theo mét vuông thực tế",
      priceNoteEn: "Contact for on-site measurement & custom quote",
      materialVi: "Gỗ Hương Đỏ & Gỗ Gõ Đỏ tự nhiên 100%, Đèn LED cảm biến âm tủ",
      materialEn: "100% Solid Rosewood & Red Padauk, Integrated Sensor LED Lighting",
      dimensionsVi: "Thiết kế và thi công may đo theo diện tích phòng thực tế",
      dimensionsEn: "Custom-built to your room's exact dimensions",
      descriptionVi:
        "Hệ tủ quần áo chữ L bo cong góc mềm mại kết hợp tủ giày sảnh vòm cao kịch trần. Từng ngăn kéo và vách tủ đều được làm từ gỗ thịt nguyên tấm, tỏa hương gỗ tự nhiên dịu nhẹ.",
      descriptionEn:
        "Full-height L-shaped walk-in wardrobe with curved corner joinery and arched entryway cabinetry, crafted entirely from aromatic solid rosewood.",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: false,
      images: {
        create: [
          {
            url: "/uploads/products/he-tu-ao-walkin-go-huong-1.webp",
            altVi: "Hệ tủ quần áo Walk-in Closet gỗ tự nhiên",
            altEn: "Solid wood walk-in wardrobe with LED lighting",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/tu-sanh-vom-go-huong-do.webp",
            altVi: "Tủ sảnh vòm gỗ hương đỏ",
            altEn: "Arched solid rosewood entryway cabinet",
            sortOrder: 2,
            isCover: false,
          },
          {
            url: "/uploads/products/he-tu-ao-walkin-go-huong-2.webp",
            altVi: "Chi tiết góc uốn cong của hệ tủ",
            altEn: "Curved corner joinery detail",
            sortOrder: 3,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colBespoke.id }],
      },
    },
  });

  const p9 = await prisma.product.create({
    data: {
      slug: "giuong-ngu-go-oc-cho-che-tac-thu-cong",
      categoryId: catBed.id,
      nameVi: "Giường Ngủ Gỗ Tự Nhiên Chế Tác Thủ Công Nguyên Khối",
      nameEn: "", // Mục 15.1 & 15.6 URD: Để trống tiếng Anh để kiểm chứng web tự hiển thị tiếng Việt
      price: 62000000,
      isContactPrice: false,
      priceNoteVi: "Bao gồm 2 táp đầu giường liền khối",
      priceNoteEn: "",
      materialVi: "Gỗ Óc Chó Bắc Mỹ / Gỗ Gõ Đỏ nguyên khối",
      materialEn: "",
      dimensionsVi: "Lọt lòng đệm 180 × 200 cm hoặc 200 × 220 cm",
      dimensionsEn: "",
      descriptionVi:
        "Đầu giường uốn cong nguyên khối liền mạch với hai bàn táp hai bên, hoặc tùy chọn chạm khắc hoa văn cổ điển thủ công tỉ mỉ bởi nghệ nhân lâu năm tại xưởng Wooden Decor.",
      descriptionEn: "",
      stockStatus: "IN_STOCK",
      isVisible: true,
      isFeatured: false,
      images: {
        create: [
          {
            url: "/uploads/products/giuong-ngu-go-oc-cho-duong-cong-1.webp",
            altVi: "Giường ngủ gỗ óc chó đường cong liền táp tại xưởng",
            altEn: "Handcrafted curved walnut bed in workshop",
            sortOrder: 1,
            isCover: true,
          },
          {
            url: "/uploads/products/giuong-ngu-go-cham-khac-hoang-gia-2.webp",
            altVi: "Phiên bản giường gỗ chạm khắc thủ công hoàng gia",
            altEn: "Hand-carved floral solid wood royal bed",
            sortOrder: 2,
            isCover: false,
          },
          {
            url: "/uploads/products/bo-ban-ghe-go-do-dong-duong.webp",
            altVi: "Bộ bàn ghế gỗ gõ đỏ phong cách Đông Dương đồng bộ",
            altEn: "Matching Indochine solid wood suite",
            sortOrder: 3,
            isCover: false,
          },
        ],
      },
      collections: {
        create: [{ collectionId: colBespoke.id }, { collectionId: colSanctuary.id }],
      },
    },
  });

  // 6. Tạo 3 Bài đăng Cảm hứng Decor hằng ngày (Mục 15.4 URD)
  await prisma.post.create({
    data: {
      slug: "hanh-trinh-120-gio-uon-cong-go-oc-cho-nguyen-khoi",
      titleVi: "Hành Trình 120 Giờ Chế Tác Khung Sofa Gỗ Óc Chó Đường Cong Vô Cực",
      titleEn: "Behind the Scenes: 120 Hours Sculpting the Infinity Walnut Sofa Frame",
      excerptVi:
        "Khám phá quy trình chọn phôi gỗ Óc Chó Bắc Mỹ, cắt CNC 3D kết hợp đục tay và chà nhám thủ công tại xưởng Wooden Decor.",
      excerptEn:
        "Step inside the Wooden Decor workshop to see how raw North American walnut planks become fluid organic furniture.",
      contentVi:
        "Để tạo ra một chiếc sofa gỗ có đường cong mềm mại như dải lụa mà vẫn chịu lực bền bỉ hàng chục năm, khâu quan trọng nhất chính là chọn phôi gỗ dày và ghép mộng âm dương chuẩn xác.\n\nTại bàn nguội của xưởng Wooden Decor, mỗi khúc cua ở tay vịn được ghép từ những thớ gỗ đồng vân, sau đó nghệ nhân dùng đục tay và máy chà nhám nhiều cấp độ từ thô đến siêu mịn trước khi phủ dầu lau tự nhiên.",
      contentEn:
        "Creating a solid wood sofa that flows like ribbon while lasting for generations begins with selecting thick, kiln-dried walnut slabs and precision mortise-and-tenon joinery.\n\nAt our workbench, each curved armrest is grain-matched by hand, carved, and progressively sanded to a silk-smooth finish before receiving natural plant oil protection.",
      coverImage: "/uploads/posts/xuong-che-tac-khung-sofa.webp",
      isPublished: true,
      products: {
        create: [{ productId: p2.id }, { productId: p1.id }],
      },
    },
  });

  await prisma.post.create({
    data: {
      slug: "xu-huong-noi-that-go-duong-cong-organic-2026",
      titleVi: "Xu Hướng Nội Thất Gỗ Đường Cong Organic: Khi Phòng Khách Trở Thành Không Gian Nghệ Thuật",
      titleEn: "Organic Curved Wood Interiors: Turning Your Living Room into a Living Gallery",
      excerptVi:
        "Vì sao giới kiến trúc sư và chủ biệt thự ngày càng chuộng đồ gỗ bo tròn mềm mại thay cho những góc cạnh vuông vức truyền thống?",
      excerptEn:
        "Why architects and homeowners are embracing fluid, rounded solid wood silhouettes over sharp geometric edges.",
      contentVi:
        "Những đường cong tự nhiên (Organic Curves) không chỉ mang lại sự an toàn cho gia đình có trẻ nhỏ và người lớn tuổi mà còn giúp luồng khí và ánh sáng trong phòng khách lưu thông nhẹ nhàng hơn.\n\nKhi kết hợp gỗ Mun hoặc gỗ Óc Chó trầm ấm với đệm da kem sáng trên nền tường màu kem nhạt (#F7F3EC), toàn bộ căn phòng toát lên vẻ sang trọng tĩnh tại mà không hề nặng nề.",
      contentEn:
        "Organic curves soften modern architecture, creating a welcoming flow of light and movement in open-plan living rooms.\n\nPairing deep walnut or ebony wood frames with warm cream leather upholstery against soft ivory walls creates effortless, gallery-like serenity.",
      coverImage: "/uploads/banners/hero-phong-khach-dang-song.webp",
      isPublished: true,
      products: {
        create: [{ productId: p1.id }, { productId: p3.id }, { productId: p4.id }],
      },
    },
  });

  await prisma.post.create({
    data: {
      slug: "bi-quyet-bao-duong-do-go-oc-cho-luon-bong-min",
      titleVi: "Bí Quyết Giữ Bề Mặt Nội Thất Gỗ Óc Chó & Da Bò Ý Luôn Bóng Mịn Theo Năm Tháng",
      titleEn: "How to Care for Solid Walnut Furniture and Full-Grain Italian Leather",
      excerptVi:
        "Hướng dẫn đơn giản từ nghệ nhân xưởng mộc giúp đồ gỗ tự nhiên càng dùng lâu càng lên nước bóng đẹp.",
      excerptEn:
        "Simple seasonal care tips from our master woodworkers so your solid timber develops a richer patina every year.",
      contentVi:
        "Gỗ tự nhiên hoàn thiện bằng dầu lau (Hardwax Oil) có khả năng 'thở' cùng độ ẩm không khí. Bạn chỉ cần dùng khăn vải sợi nhỏ ẩm nhẹ để lau bụi hằng tuần và thoa sáp ong tự nhiên định kỳ 6-12 tháng một lần để bề mặt gỗ luôn润 (nhuận) sắc.",
      contentEn:
        "Solid wood finished with natural hardwax oil breathes with its environment. Simply wipe weekly with a barely damp microfiber cloth and nourish every 6–12 months with natural beeswax.",
      coverImage: "/uploads/products/bo-sofa-ban-tra-oval-rung-thong-1.webp",
      isPublished: true,
      products: {
        create: [{ productId: p5.id }, { productId: p6.id }],
      },
    },
  });

  // 7. Tạo 2 Yêu cầu tư vấn mẫu (Inquiry)
  await prisma.inquiry.createMany({
    data: [
      {
        customerName: "Anh Trần Minh Hoàng",
        phone: "0912345678",
        message: "Chào shop, mình muốn hỏi bộ Sofa Gỗ Mun Dáng Sóng Sơn Thủy có nhận làm dài 3m2 cho phòng khách biệt thự tại Quận 2 không?",
        productId: p1.id,
        status: "NEW",
        internalNote: "",
      },
      {
        customerName: "Chị Lê Thảo Vy",
        phone: "0987654321",
        message: "Mình muốn đặt Kệ Sách Bán Nguyệt giao về Đà Nẵng, shop gửi thêm ảnh thực tế qua Zalo giúp mình nhé.",
        productId: p4.id,
        status: "CONTACTED",
        internalNote: "Đã kết bạn Zalo và gửi video quay tại xưởng ngày hôm qua.",
      },
    ],
  });

  console.log("✔ Đã nạp thành công toàn bộ dữ liệu mẫu (9 sản phẩm, 4 danh mục, 3 bộ sưu tập, 3 bài đăng, 2 yêu cầu tư vấn)!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
