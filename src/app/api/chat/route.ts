import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/settings";
import { formatProductPrice, Locale, tField } from "@/lib/i18n";

export interface ChatProductCard {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  material: string;
  dimensions: string;
  priceText: string;
  imageUrl: string;
  stockStatus: string;
}

export interface ChatContactCard {
  phone: string;
  zalo: string;
  email: string;
  address: string;
  openingHours: string;
}

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

/**
 * Chuẩn hóa chuỗi bỏ dấu tiếng Việt (chỉ dùng cho các cụm từ không gây nhập nhằng)
 */
function stripAccents(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Chuẩn hóa chuỗi giữ nguyên dấu tiếng Việt (giúp phân biệt chính xác "bàn" vs "bán"/"bạn", "kệ" vs "kể", "hệ" vs "liên hệ")
 */
function normalizeKeepAccents(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,!?;:()"'“”‘’[\]{}\\/|<>~`@#$%^&*_+=]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPhrase(text: string, phrases: string[]): boolean {
  const padded = ` ${text} `;
  return phrases.some((p) => padded.includes(` ${p} `));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message || "").trim();
    const locale: Locale = body.locale === "en" ? "en" : "vi";
    const history: ChatHistoryItem[] = Array.isArray(body.history)
      ? body.history.slice(-8)
      : [];

    if (!message) {
      return NextResponse.json(
        { error: locale === "en" ? "Empty message" : "Tin nhắn trống" },
        { status: 400 }
      );
    }

    // 1. Lấy dữ liệu thực tế từ CSDL
    const [siteConfig, rawProducts, categories, aiSettings] = await Promise.all([
      getSiteConfig(locale),
      prisma.product.findMany({
        where: { isVisible: true },
        include: {
          category: true,
          images: {
            orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }],
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.siteSetting.findMany({
        where: {
          key: { in: ["geminiApiKey", "aiCustomPrompt"] },
        },
      }),
    ]);

    const settingMap = new Map(aiSettings.map((s) => [s.key, s.valueVi]));
    const geminiApiKey = (
      settingMap.get("geminiApiKey") ||
      process.env.GEMINI_API_KEY ||
      ""
    ).trim();
    const aiCustomPrompt = (settingMap.get("aiCustomPrompt") || "").trim();

    const catalog: EnrichedProduct[] = rawProducts.map((p) => {
      const priceObj = formatProductPrice({
        price: p.price,
        isContactPrice: p.isContactPrice,
        priceNoteVi: p.priceNoteVi,
        priceNoteEn: p.priceNoteEn,
        locale,
        usdExchangeRate: siteConfig.usdExchangeRate,
      });

      const name = tField(p.nameVi, p.nameEn, locale);
      const categoryName = tField(
        p.category?.nameVi,
        p.category?.nameEn,
        locale
      );
      const material = tField(p.materialVi, p.materialEn, locale);
      const dimensions = tField(p.dimensionsVi, p.dimensionsEn, locale);
      const description = tField(p.descriptionVi, p.descriptionEn, locale);
      const imageUrl =
        p.images[0]?.url || "/uploads/banners/hero-phong-khach-dang-song.webp";

      return {
        id: p.id,
        slug: p.slug,
        name,
        nameVi: p.nameVi,
        nameEn: p.nameEn,
        categoryName,
        categorySlug: p.category?.slug || "",
        material,
        materialVi: p.materialVi,
        dimensions,
        description,
        price: p.price,
        isContactPrice: p.isContactPrice,
        priceText: priceObj.primary,
        imageUrl,
        stockStatus: p.stockStatus,
        isFeatured: p.isFeatured,
        accentedBlob: normalizeKeepAccents(
          `${p.nameVi} ${p.nameEn} ${p.category?.nameVi || ""} ${p.materialVi}`
        ),
        unaccentedBlob: stripAccents(
          `${p.nameVi} ${p.nameEn} ${p.category?.nameVi || ""} ${
            p.category?.nameEn || ""
          } ${p.materialVi} ${p.materialEn}`
        ),
      };
    });

    const contactCardData: ChatContactCard = {
      phone: siteConfig.phone,
      zalo: siteConfig.zalo,
      email: siteConfig.email,
      address: siteConfig.address,
      openingHours: siteConfig.openingHours,
    };

    // 2. Phát hiện nếu khách hàng để lại Số điện thoại trong tin nhắn -> Tự động tạo Inquiry
    let inquiryCreated = false;
    const phoneMatch = message.match(/(?:\+84|0)(?:3|5|7|8|9)\d{8}\b/);
    if (phoneMatch) {
      const detectedPhone = phoneMatch[0];
      const cleanedName = message
        .replace(detectedPhone, "")
        .replace(
          /(sdt|số điện thoại|so dien thoai|nhờ xưởng tư vấn qua|gọi|goi|zalo|tên|ten|mình là|minh la|tôi là|toi la|anh|chị|em|:|-|,)/gi,
          " "
        )
        .replace(/\s+/g, " ")
        .trim();
      const customerName =
        cleanedName.length >= 2 && cleanedName.length <= 40
          ? cleanedName
          : locale === "en"
            ? "AI Chat Customer"
            : "Khách tư vấn qua AI Chat";

      try {
        await prisma.inquiry.create({
          data: {
            customerName,
            phone: detectedPhone,
            message: `[AI Chat] ${message}`,
            status: "NEW",
          },
        });
        inquiryCreated = true;
      } catch {
        // Ignore DB error if any
      }
    }

    // 3. Nếu có cấu hình GEMINI_API_KEY, gọi Google Gemini
    if (geminiApiKey) {
      try {
        const geminiResult = await callGeminiAssistant({
          apiKey: geminiApiKey,
          customPrompt: aiCustomPrompt,
          locale,
          message,
          history,
          siteConfig,
          catalog,
          inquiryCreated,
        });

        if (geminiResult) {
          return NextResponse.json({
            reply: geminiResult.reply,
            products: geminiResult.recommendedProducts
              .slice(0, 3)
              .map(toProductCard),
            contactCard: geminiResult.showContactCard
              ? contactCardData
              : undefined,
            suggestions: getFollowUpSuggestions(message, locale),
            inquiryCreated,
          });
        }
      } catch {
        // Fallback xuống bộ xử lý NLU nội bộ bên dưới
      }
    }

    // 4. Bộ xử lý ngôn ngữ tự nhiên (NLU) thông minh cho Showroom Nội thất Gỗ
    const result = generateSmartShowroomResponse({
      message,
      history,
      locale,
      siteConfig,
      catalog,
      categories: categories.map((c) => tField(c.nameVi, c.nameEn, locale)),
      inquiryCreated,
    });

    return NextResponse.json({
      reply: result.reply,
      products: result.recommended.slice(0, 3).map(toProductCard),
      contactCard: result.showContactCard ? contactCardData : undefined,
      suggestions: result.suggestions,
      inquiryCreated,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Không thể xử lý tin nhắn lúc này.",
      },
      { status: 500 }
    );
  }
}

type EnrichedProduct = {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  nameEn: string;
  categoryName: string;
  categorySlug: string;
  material: string;
  materialVi: string;
  dimensions: string;
  description: string;
  price: number | null;
  isContactPrice: boolean;
  priceText: string;
  imageUrl: string;
  stockStatus: string;
  isFeatured: boolean;
  accentedBlob: string;
  unaccentedBlob: string;
};

function toProductCard(p: EnrichedProduct): ChatProductCard {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryName: p.categoryName,
    material: p.material,
    dimensions: p.dimensions,
    priceText: p.priceText,
    imageUrl: p.imageUrl,
    stockStatus: p.stockStatus,
  };
}

/**
 * Tìm sản phẩm theo đúng danh mục / tên / chất liệu gỗ cụ thể.
 * Tuyệt đối không khớp từ đơn 2 ký tự không dấu gây nhầm lẫn (như "he" trong "liên hệ" hay "ban" trong "bạn").
 */
function findMatchingProducts(
  rawQuery: string,
  catalog: EnrichedProduct[]
): EnrichedProduct[] {
  const accentedQ = normalizeKeepAccents(rawQuery);
  const unaccentedQ = stripAccents(rawQuery);
  if (!unaccentedQ) return [];

  // Kiểm tra điều kiện lọc theo giá nếu có
  let maxPrice: number | null = null;
  let minPrice: number | null = null;

  const underMatch = unaccentedQ.match(
    /(?:duoi|nho hon|thap hon|tam|khoang|tiet kiem)\s+(\d+)\s*(?:tr|trieu)/
  );
  if (underMatch) {
    maxPrice = parseInt(underMatch[1], 10) * 1_000_000;
  }
  const overMatch = unaccentedQ.match(
    /(?:tren|hon|tu)\s+(\d+)\s*(?:tr|trieu)/
  );
  if (overMatch) {
    minPrice = parseInt(overMatch[1], 10) * 1_000_000;
  }

  // Các nhóm thực thể sản phẩm rõ ràng (phân biệt chính xác dấu tiếng Việt)
  const productMatchers: Array<{
    queryHit: boolean;
    itemCheck: (p: EnrichedProduct) => boolean;
    weight: number;
  }> = [
    // 1. Sofa / Ghế phòng khách
    {
      queryHit:
        hasPhrase(unaccentedQ, [
          "sofa",
          "so pha",
          "salon",
          "ghe sofa",
          "ghe vang",
          "sofa goc",
          "sofa chu l",
          "ghe dai",
          "armchair",
          "ghe don",
        ]) || hasPhrase(accentedQ, ["ghế", "phòng khách"]),
      itemCheck: (p) =>
        p.categorySlug.includes("sofa") ||
        p.unaccentedBlob.includes("sofa") ||
        p.accentedBlob.includes("ghế"),
      weight: 10,
    },
    // 2. Bàn trà / Bàn sofa (Có dấu "bàn" hoặc cụm "ban tra", "ban nuoc", "ban go", "ban oval", "ban vo cuc")
    {
      queryHit:
        hasPhrase(accentedQ, ["bàn", "bàn trà", "bàn khách", "bàn gỗ"]) ||
        hasPhrase(unaccentedQ, [
          "ban tra",
          "ban sofa",
          "ban nuoc",
          "ban khach",
          "ban go",
          "ban oval",
          "ban vo cuc",
          "coffee table",
        ]),
      itemCheck: (p) =>
        p.categorySlug.includes("ban-tra") ||
        p.accentedBlob.includes("bàn trà") ||
        p.unaccentedBlob.includes("ban tra"),
      weight: 10,
    },
    // 3. Giường ngủ / Phòng ngủ
    {
      queryHit:
        hasPhrase(accentedQ, ["giường", "giường ngủ", "phòng ngủ"]) ||
        hasPhrase(unaccentedQ, ["giuong", "giuong ngu", "phong ngu", "bed"]),
      itemCheck: (p) =>
        p.categorySlug.includes("giuong") ||
        p.unaccentedBlob.includes("giuong"),
      weight: 10,
    },
    // 4. Kệ sách / Kệ trang trí / Tủ áo / Tủ sảnh / Vách Tivi
    {
      queryHit:
        hasPhrase(accentedQ, [
          "kệ",
          "kệ sách",
          "kệ tivi",
          "vách tivi",
          "tủ",
          "tủ áo",
          "tủ quần áo",
          "tủ sảnh",
          "hệ tủ",
        ]) ||
        hasPhrase(unaccentedQ, [
          "ke sach",
          "ke trung bay",
          "ke go",
          "ke ban nguyet",
          "ke tivi",
          "vach tivi",
          "tu ao",
          "tu quan ao",
          "tu sanh",
          "tu go",
          "walk in",
          "walkin",
          "closet",
          "wardrobe",
          "bookshelf",
          "cabinet",
        ]),
      itemCheck: (p) =>
        p.categorySlug.includes("ke") ||
        p.categorySlug.includes("tu") ||
        p.accentedBlob.includes("kệ") ||
        p.accentedBlob.includes("tủ"),
      weight: 10,
    },
    // 5. Chất liệu Gỗ Óc Chó (Walnut)
    {
      queryHit: hasPhrase(unaccentedQ, ["oc cho", "walnut"]),
      itemCheck: (p) => p.unaccentedBlob.includes("oc cho"),
      weight: 6,
    },
    // 6. Chất liệu Gỗ Mun (Ebony)
    {
      queryHit: hasPhrase(unaccentedQ, ["go mun", "ebony"]) || hasPhrase(accentedQ, ["gỗ mun", "mun"]),
      itemCheck: (p) => p.unaccentedBlob.includes("go mun"),
      weight: 7,
    },
    // 7. Chất liệu Gỗ Gõ Đỏ (Rosewood)
    {
      queryHit:
        hasPhrase(accentedQ, ["gõ đỏ", "gỗ gõ"]) ||
        hasPhrase(unaccentedQ, ["go do", "rosewood"]),
      itemCheck: (p) => p.unaccentedBlob.includes("go do"),
      weight: 7,
    },
    // 8. Chất liệu Gỗ Hương (Padauk)
    {
      queryHit:
        hasPhrase(accentedQ, ["gỗ hương", "hương đỏ"]) ||
        hasPhrase(unaccentedQ, ["go huong", "huong do", "padauk"]),
      itemCheck: (p) => p.unaccentedBlob.includes("huong"),
      weight: 7,
    },
    // 9. Kiểu dáng đặc trưng (Dáng sóng, Vô cực, Bán nguyệt, Hoàng gia, Góc L, Cognac, Espresso)
    {
      queryHit: hasPhrase(unaccentedQ, [
        "dang song",
        "son thuy",
        "vo cuc",
        "ban nguyet",
        "hoang gia",
        "goc l",
        "cognac",
        "espresso",
        "oval",
      ]),
      itemCheck: (p) => {
        const styles = [
          "dang song",
          "son thuy",
          "vo cuc",
          "ban nguyet",
          "hoang gia",
          "goc l",
          "cognac",
          "espresso",
          "oval",
        ];
        return styles.some(
          (st) => unaccentedQ.includes(st) && p.unaccentedBlob.includes(st)
        );
      },
      weight: 8,
    },
  ];

  const anyExplicitMatcherTriggered = productMatchers.some((m) => m.queryHit);
  const hasPriceFilter = maxPrice !== null || minPrice !== null;

  if (!anyExplicitMatcherTriggered && !hasPriceFilter) {
    return [];
  }

  const scored = catalog
    .map((item) => {
      let score = 0;

      for (const matcher of productMatchers) {
        if (matcher.queryHit && matcher.itemCheck(item)) {
          score += matcher.weight;
        }
      }

      if (maxPrice !== null) {
        if (item.price && item.price <= maxPrice) score += 8;
        else score -= 10;
      }
      if (minPrice !== null) {
        if (item.price && item.price >= minPrice) score += 8;
        else score -= 10;
      }

      if (score > 0 && item.isFeatured) {
        score += 0.5;
      }

      return { item, score };
    })
    .filter((entry) => entry.score >= 6)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}

function generateSmartShowroomResponse(params: {
  message: string;
  history: ChatHistoryItem[];
  locale: Locale;
  siteConfig: Awaited<ReturnType<typeof getSiteConfig>>;
  catalog: EnrichedProduct[];
  categories: string[];
  inquiryCreated: boolean;
}): {
  reply: string;
  recommended: EnrichedProduct[];
  showContactCard?: boolean;
  suggestions: string[];
} {
  const {
    message,
    history,
    locale,
    siteConfig,
    catalog,
    categories,
    inquiryCreated,
  } = params;
  const accentedQ = normalizeKeepAccents(message);
  const unaccentedQ = stripAccents(message);
  const isEn = locale === "en";

  // =========================================================================
  // 1. KHÁCH ĐỂ LẠI SỐ ĐIỆN THOẠI -> XÁC NHẬN ĐÃ LƯU YÊU CẦU TƯ VẤN
  // =========================================================================
  if (inquiryCreated) {
    return {
      reply: isEn
        ? `Thank you! I have saved your phone number and sent a priority notification directly to the owner of **${siteConfig.brandName}**. We will contact you via phone/Zalo within a few minutes (Hotline: **${siteConfig.phone}**).`
        : `Dạ em cảm ơn anh/chị! Em đã lưu lại số điện thoại của mình và chuyển trực tiếp cho **Chủ xưởng ${siteConfig.brandName}**. Chủ xưởng sẽ gọi điện hoặc nhắn Zalo tư vấn cho anh/chị ngay trong ít phút tới ạ (Hotline trực tiếp: **${siteConfig.phone}**).`,
      recommended: [],
      showContactCard: true,
      suggestions: isEn
        ? [
            "Showroom location & hours",
            "Walnut Sofas",
            "Custom sizing process",
          ]
        : [
            "Xem địa chỉ Showroom",
            "Xem các mẫu Sofa gỗ óc chó",
            "Quy trình đặt đóng theo yêu cầu",
          ],
    };
  }

  // =========================================================================
  // 2. MUỐN LIÊN HỆ CHỦ TIỆM / GẶP NGƯỜI THẬT / XIN SĐT / ZALO / HOTLINE
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "lien he",
      "chu tiem",
      "chu shop",
      "chu xuong",
      "chu cua hang",
      "gap chu",
      "gap quan ly",
      "nhan vien",
      "nguoi that",
      "tu van vien",
      "so dien thoai",
      "sdt",
      "hotline",
      "zalo",
      "goi dien",
      "goi cho toi",
      "ket noi",
      "owner",
      "manager",
      "human",
      "contact",
      "phone number",
      "call me",
    ])
  ) {
    return {
      reply: isEn
        ? `You can connect directly with the **Store & Workshop Owner of ${siteConfig.brandName}** through the following channels:\n\n• **Direct Owner Hotline**: **${siteConfig.phone}**\n• **Zalo Consultation**: **${siteConfig.zalo}**\n• **Email**: ${siteConfig.email}\n• **Showroom & Workshop**: ${siteConfig.address}\n\nOr simply **type your phone number right here in the chat**, and our owner will call you back immediately!`
        : `Dạ anh/chị có thể liên hệ trực tiếp với **Chủ tiệm / Chủ xưởng ${siteConfig.brandName}** qua các kênh sau ạ:\n\n• **Hotline Chủ xưởng (24/7)**: **${siteConfig.phone}**\n• **Zalo trao đổi trực tiếp**: **${siteConfig.zalo}**\n• **Địa chỉ Showroom & Xưởng**: ${siteConfig.address}\n\nAnh/chị có thể bấm nút **Gọi điện / Chat Zalo** bên dưới, hoặc **nhắn Số điện thoại của anh/chị ngay tại khung chat này** để Chủ tiệm gọi lại tư vấn trực tiếp trong 5 phút nhé!`,
      recommended: [],
      showContactCard: true,
      suggestions: isEn
        ? [
            "Showroom location & opening hours",
            "Custom sizing at workshop",
            "Explore featured products",
          ]
        : [
            "Để lại SĐT để Chủ tiệm gọi lại",
            "Đặt đóng theo kích thước riêng",
            "Xem các mẫu sản phẩm nổi bật",
          ],
    };
  }

  // =========================================================================
  // 3. HỎI ĐỊA CHỈ SHOWROOM / XƯỞNG Ở ĐÂU / GIỜ MỞ CỬA / XEM HÀNG TRỰC TIẾP
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "dia chi",
      "o dau",
      "showroom",
      "ban do",
      "map",
      "ghe xem",
      "den xem",
      "toi xem",
      "xem truc tiep",
      "gio mo cua",
      "may gio",
      "chi nhanh",
      "cua hang o dau",
      "xuong o dau",
      "address",
      "location",
      "where are you",
      "opening hours",
    ])
  ) {
    return {
      reply: isEn
        ? `Our Showroom & Woodworking Studio is located at:\n\n• **Address**: **${siteConfig.address}**\n• **Hotline / Zalo**: **${siteConfig.phone}**\n\nAll featured sofas, coffee tables, and raw timber slabs are on display at our showroom. We warmly welcome you to visit and test them in person!`
        : `Dạ Showroom trưng bày & Xưởng chế tác của **${siteConfig.brandName}** nằm tại:\n\n• **Địa chỉ**: **${siteConfig.address}**\n• **Hotline đón khách**: **${siteConfig.phone}**\n\nTại Showroom luôn có sẵn các mẫu Sofa dáng sóng, bàn trà nguyên khối và phôi gỗ tự nhiên để anh/chị tận tay sờ chất gỗ và ngồi thử. Mời anh/chị ghé tham quan ạ!`,
      recommended: [],
      showContactCard: true,
      suggestions: isEn
        ? [
            "Connect with store owner",
            "Show me Walnut Sofas",
            "Warranty & delivery policy",
          ]
        : [
            "Liên hệ Chủ tiệm đón tại Showroom",
            "Tư vấn mẫu Sofa gỗ tự nhiên",
            "Chính sách bảo hành & vận chuyển",
          ],
    };
  }

  // =========================================================================
  // 4. HỎI VỀ THANH TOÁN / ĐẶT CỌC / TRẢ GÓP / GIẢM GIÁ / KHUYẾN MÃI
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "thanh toan",
      "dat coc",
      "tra gop",
      "chuyen khoan",
      "quet the",
      "giam gia",
      "khuyen mai",
      "uu dai",
      "chiet khau",
      "bot khong",
      "mac qua",
      "dat qua",
      "payment",
      "deposit",
      "discount",
      "promotion",
    ])
  ) {
    return {
      reply: isEn
        ? `Here is our transparent workshop pricing & payment policy at **${siteConfig.brandName}**:\n\n1. **Direct Workshop Price**: All prices are direct from our woodworking studio with no middleman markup.\n2. **Special Offers**: We offer a **5% – 8% combo discount** when furnishing multiple pieces (e.g., Sofa + Coffee Table + TV Console) and free inner-city delivery & installation.\n3. **Payment Steps**:\n   - **30% deposit** upon confirming dimensions/drawing.\n   - Inspect raw timber (nghiệm thu mộc) at the workshop.\n   - **70% balance** paid upon safe delivery and installation at your home (Cash, Bank Transfer, or Card).`
        : `Dạ em xin thông tin về **Chính sách ưu đãi & Thanh toán** tại xưởng **${siteConfig.brandName}** ạ:\n\n1. **Giá gốc trực tiếp tại xưởng**: Toàn bộ sản phẩm đều do xưởng tự xẻ sấy và chế tác, không qua trung gian thương mại.\n2. **Ưu đãi hiện hành**:\n   - Chiết khấu **5% – 8%** khi đặt combo phòng khách / phòng ngủ.\n   - Miễn phí vận chuyển & lắp đặt nội thành TP.HCM, hỗ trợ 50% cước phí đi tỉnh.\n3. **Phương thức thanh toán an toàn**:\n   - **Đặt cọc 30%** khi chốt mẫu & kích thước.\n   - Khách kiểm tra, ký tên lên phần mộc thô tại xưởng.\n   - **Thanh toán 70% còn lại** sau khi xưởng giao lắp hoàn thiện tại nhà (Tiền mặt, Chuyển khoản hoặc Quẹt thẻ).`,
      recommended: [],
      suggestions: isEn
        ? [
            "Contact owner for combo discount",
            "Explore Sofas & Coffee Tables",
            "Warranty & maintenance",
          ]
        : [
            "Liên hệ Chủ tiệm nhận giá ưu đãi",
            "Xem các mẫu Sofa & Bàn trà",
            "Chính sách bảo hành 5 năm",
          ],
    };
  }

  // =========================================================================
  // 5. HỎI VỀ BẢO HÀNH / VẬN CHUYỂN / GIAO HÀNG / ĐỘ BỀN / MỐI MỌT
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "bao hanh",
      "bao tri",
      "van chuyen",
      "giao hang",
      "lap dat",
      "ship",
      "cong venh",
      "moi mot",
      "nut ne",
      "co ben khong",
      "warranty",
      "shipping",
      "delivery",
      "maintenance",
    ])
  ) {
    return {
      reply: isEn
        ? `At **${siteConfig.brandName}**, we stand behind every solid wood piece we craft:\n\n• **5-Year Structural Warranty**: Full protection against warping, cracking, and termite damage on all solid timber frames.\n• **Lifetime Maintenance**: Periodic wood oil/wax nourishment and leather care guidance.\n• **Safe Nationwide Delivery**: Delivered and installed directly in your living space by our workshop technicians.`
        : `Tại **${siteConfig.brandName}**, mọi sản phẩm gỗ tự nhiên đều đi kèm cam kết bảo hành rõ ràng bằng văn bản:\n\n• **Bảo hành 5 năm kết cấu gỗ**: Bảo hành toàn diện các lỗi cong vênh, co ngót, nứt nẻ, mối mọt (phôi gỗ đều được tẩm sấy đạt độ ẩm chuẩn 10–12% trước khi chế tác).\n• **Bảo trì trọn đời**: Hỗ trợ đánh bóng, lau dầu dưỡng gỗ định kỳ tại nhà.\n• **Giao hàng & Lắp đặt toàn quốc**: Đội ngũ thợ của xưởng trực tiếp vận chuyển, kê đặt tận phòng cho gia đình mình ạ.`,
      recommended: [],
      suggestions: isEn
        ? [
            "Custom sizing at workshop",
            "Compare Walnut vs Rosewood",
            "Contact store owner",
          ]
        : [
            "Đặt đóng theo kích thước riêng",
            "Phân biệt Gỗ Óc Chó, Mun & Gõ Đỏ",
            "Liên hệ Chủ tiệm tư vấn",
          ],
    };
  }

  // =========================================================================
  // 6. HỎI VỀ ĐẶT ĐÓNG THEO YÊU CẦU / KÍCH THƯỚC RIÊNG / MAY ĐO
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "dat dong",
      "theo yeu cau",
      "kich thuoc rieng",
      "may do",
      "thiet ke rieng",
      "lam theo mau",
      "custom",
      "bespoke",
      "thoi gian san xuat",
      "nghiem thu moc",
    ])
  ) {
    return {
      reply: isEn
        ? `Yes! Because **${siteConfig.brandName}** owns a direct woodworking studio, we specialize in **bespoke custom orders**:\n\n1. **Tailored Dimensions**: Adjust length, depth, L-corner direction, or cabinet height to fit your exact room.\n2. **Choice of Hardwood & Leather**: North American Walnut, Ebony, Rosewood, or Padauk paired with Italian cowhide or fabric.\n3. **Lead Time**: **15 – 25 days**, including an invitation to inspect the raw wood assembly at our workshop before finishing.\n\nLeave your phone number or connect with our owner so our craftsman can advise on measurements!`
        : `Dạ có ạ! Vì **${siteConfig.brandName}** là xưởng chế tác trực tiếp nên nhận **đặt đóng & may đo theo kích thước riêng** của từng gia đình:\n\n1. **Tùy chỉnh kích thước & công năng**: Điều chỉnh chiều dài, chiều sâu, hướng góc L, chiều cao kịch trần cho tủ áo/kệ.\n2. **Tùy chọn loại gỗ & màu da**: Gỗ Óc Chó Bắc Mỹ, Gỗ Mun, Gỗ Gõ Đỏ, Gỗ Hương kết hợp da bò Ý hoặc nỉ cao cấp.\n3. **Thời gian hoàn thiện**: Từ **15 – 25 ngày**; anh/chị được mời **nghiệm thu phần mộc thô** tại xưởng trước khi sơn phủ.\n\nAnh/chị có thể nhắn kích thước dự kiến hoặc để lại **Số điện thoại** để kỹ thuật trưởng của xưởng lên phương án báo giá ngay nhé!`,
      recommended: [],
      showContactCard: true,
      suggestions: isEn
        ? [
            "Explore Sofa designs",
            "Explore Beds & Wardrobes",
            "Contact store owner",
          ]
        : [
            "Xem các mẫu Sofa điêu khắc",
            "Xem mẫu Giường & Hệ tủ gỗ",
            "Liên hệ Chủ xưởng báo giá",
          ],
    };
  }

  // =========================================================================
  // 7. SO SÁNH / TƯ VẤN CHẤT LIỆU GỖ (ÓC CHÓ, MUN, GÕ ĐỎ, HƯƠNG)
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "phan biet",
      "so sanh",
      "loai go nao",
      "chon go nao",
      "chat lieu go",
      "go oc cho la gi",
      "go mun la gi",
      "go do la gi",
      "compare",
      "wood types",
    ])
  ) {
    return {
      reply: isEn
        ? `Here is a quick guide to the 4 premier solid woods crafted at **${siteConfig.brandName}**:\n\n• **North American Walnut (Gỗ Óc Chó Bắc Mỹ)**: Chocolate-brown tone with wavy & swirling grain. Best for modern luxury living rooms.\n• **Ebony (Gỗ Mun)**: Rare dark wood with artistic contrasting streaks, extremely dense and high-status.\n• **Rosewood (Gỗ Gõ Đỏ)**: Warm reddish-gold tone, heavy and impervious to termites, ideal for Indochine & classic spaces.\n• **Red Padauk (Gỗ Hương Đỏ)**: Fine texture, pleasant natural scent, and timeless durability.\n\nWhich wood tone matches your home's flooring and wall color?`
        : `Dạ em xin tóm tắt đặc trưng 4 dòng gỗ tự nhiên quý đang được chế tác tại xưởng **${siteConfig.brandName}** để anh/chị dễ lựa chọn:\n\n• **Gỗ Óc Chó Bắc Mỹ (Walnut)**: Sắc nâu trầm socola ấm áp, hệ vân sóng & vân cuộn xoáy tự nhiên cực kỳ sang trọng, hợp nhà phố hiện đại, biệt thự, chung cư cao cấp.\n• **Gỗ Mun (Ebony)**: Sắc đen huyền bí pha vân sọc nghệ thuật, thớ gỗ cực đanh và nặng, mang tính sưu tầm cao.\n• **Gỗ Gõ Đỏ (Rosewood)**: Sắc nâu đỏ tươi ấm, vân gỗ lớn sắc nét, chịu lực và chống mối mọt tuyệt đối, hợp không gian Á Đông / Indochine.\n• **Gỗ Hương Đỏ**: Thớ gỗ mịn, tỏa hương thơm tự nhiên nhẹ nhàng, càng dùng lâu gỗ càng lên nước bóng đẹp.\n\nKhông gian nhà mình đang sơn tông màu sáng hay trầm để em gợi ý dòng gỗ hợp nhất ạ?`,
      recommended: [],
      suggestions: isEn
        ? [
            "Show me Walnut furniture",
            "Show me Ebony & Rosewood pieces",
            "Custom sizing at workshop",
          ]
        : [
            "Xem mẫu nội thất Gỗ Óc Chó",
            "Xem mẫu Gỗ Mun & Gỗ Gõ Đỏ",
            "Tư vấn mẫu Sofa gỗ tự nhiên",
          ],
    };
  }

  // =========================================================================
  // 8. HỎI CÁC MẶT HÀNG XƯỞNG CHƯA TRƯNG BÀY SẴN (BÀN ĂN, TỦ BẾP, BÀN LÀM VIỆC...)
  // =========================================================================
  if (
    hasPhrase(accentedQ, [
      "bàn ăn",
      "ghế ăn",
      "phòng ăn",
      "tủ bếp",
      "bàn làm việc",
      "bàn trang điểm",
      "bàn thờ",
      "cầu thang",
      "cửa gỗ",
      "sàn gỗ",
    ]) ||
    hasPhrase(unaccentedQ, [
      "ban an",
      "ghe an",
      "phong an",
      "tu bep",
      "ban lam viec",
      "ban trang diem",
      "ban tho",
      "cau thang",
      "cua go",
      "san go",
    ])
  ) {
    return {
      reply: isEn
        ? `Currently on our website catalog, **${siteConfig.brandName}** showcases ready-made collections of **Sofas, Coffee Tables, Solid Wood Beds, Bookcases, and Walk-in Wardrobes**.\n\nHowever, for custom items such as **dining tables, kitchen cabinets, or work desks** in solid Walnut/Rosewood, our workshop accepts **made-to-order requests** based on your space measurements. Would you like to connect directly with our workshop owner for a custom quote?`
        : `Dạ hiện tại trên danh mục có sẵn của website, **${siteConfig.brandName}** đang trưng bày chính các dòng: **Sofa điêu khắc, Bàn trà nguyên khối, Giường ngủ, Kệ sách và Hệ tủ áo Walk-in**.\n\nRiêng với hạng mục anh/chị vừa hỏi (như *bàn ghế ăn, tủ bếp, bàn làm việc...* bằng gỗ tự nhiên đồng bộ), xưởng vẫn **nhận đặt đóng riêng theo kích thước thực tế**. Anh/chị có muốn liên hệ trực tiếp Chủ xưởng để nhận mẫu phác thảo và báo giá riêng không ạ?`,
      recommended: [],
      showContactCard: true,
      suggestions: isEn
        ? [
            "Connect with Workshop Owner",
            "Explore Living Room Sofas",
            "Explore Bedroom Furniture",
          ]
        : [
            "Liên hệ Chủ xưởng tư vấn đặt đóng",
            "Xem các mẫu Sofa phòng khách",
            "Xem mẫu Giường & Hệ tủ gỗ",
          ],
    };
  }

  // =========================================================================
  // 9. TÌM KIẾM SẢN PHẨM CỤ THỂ (SOFA, BÀN TRÀ, GIƯỜNG, KỆ, TỦ, CHẤT LIỆU, TẦM GIÁ)
  // =========================================================================
  let matchedProducts = findMatchingProducts(message, catalog);

  // Hỗ trợ câu hỏi nối tiếp theo ngữ cảnh (VD: khách vừa hỏi Sofa xong hỏi tiếp "giá bao nhiêu", "kích thước thế nào")
  if (
    matchedProducts.length === 0 &&
    history.length >= 2 &&
    hasPhrase(unaccentedQ, [
      "cai nay",
      "mau nay",
      "bo nay",
      "san pham nay",
      "gia sao",
      "gia the nao",
      "kich thuoc",
      "con hang khong",
      "chat lieu gi",
    ])
  ) {
    const prevUserMessages = history
      .filter((h) => h.role === "user")
      .map((h) => h.content)
      .reverse();
    for (const prevMsg of prevUserMessages) {
      const prevMatches = findMatchingProducts(prevMsg, catalog);
      if (prevMatches.length > 0) {
        matchedProducts = prevMatches;
        break;
      }
    }
  }

  if (matchedProducts.length > 0) {
    const topItems = matchedProducts.slice(0, 3);
    const bulletLines = topItems
      .map(
        (p) =>
          `• **${p.name}**\n  - ${isEn ? "Material" : "Chất liệu"}: ${p.material}\n  - ${
            isEn ? "Dimensions" : "Kích thước"
          }: ${p.dimensions || (isEn ? "Custom" : "Theo tiêu chuẩn / Tùy chỉnh")}\n  - ${
            isEn ? "Price" : "Giá tại xưởng"
          }: **${p.priceText}**`
      )
      .join("\n\n");

    return {
      reply: isEn
        ? `Here are the **${topItems.length}** most suitable handcrafted piece(s) at **${siteConfig.brandName}** for your request:\n\n${bulletLines}\n\nClick any product card below to view detailed photos, or let me know if you want to customize the dimensions!`
        : `Dạ em xin gợi ý **${topItems.length} mẫu tác phẩm** phù hợp nhất với yêu cầu của anh/chị tại **${siteConfig.brandName}**:\n\n${bulletLines}\n\nAnh/chị có thể bấm vào thẻ sản phẩm bên dưới để xem ảnh chụp chi tiết, hoặc nhắn em nếu cần điều chỉnh kích thước theo phòng nhé!`,
      recommended: topItems,
      suggestions: getFollowUpSuggestions(message, locale),
    };
  }

  // =========================================================================
  // 10. HỎI CHUNG VỀ GIÁ / BẢNG GIÁ / TẦM GIÁ CỦA CỬA HÀNG
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "gia",
      "bao gia",
      "bao nhieu tien",
      "bang gia",
      "tam gia",
      "chi phi",
      "price",
      "cost",
      "how much",
    ])
  ) {
    return {
      reply: isEn
        ? `At **${siteConfig.brandName}**, our direct workshop pricing by category is:\n\n• **Artisanal Bookcases & Shelves**: from **26.500.000 ₫**\n• **Sculpted Solid Walnut & Ebony Sofas**: from **54.000.000 ₫ – 76.000.000 ₫**\n• **Solid Wood Handcrafted Beds**: from **62.000.000 ₫**\n• **Full Living Room Sets (6-Piece Sofa & Infinity Table)**: **92.000.000 ₫ – 128.000.000 ₫**\n• **Walk-in Closet & Arched Cabinets**: Custom quoted per m²\n\nWhich product line would you like me to send detailed photos and prices for?`
        : `Dạ em gửi anh/chị **khung giá niêm yết tại xưởng ${siteConfig.brandName}** theo từng dòng sản phẩm để mình dễ tham khảo ạ:\n\n• **Kệ sách & Kệ trưng bày gỗ Óc Chó**: từ **26.500.000 ₫**\n• **Sofa văng & Sofa góc L gỗ Óc Chó / Gỗ Mun**: từ **54.000.000 ₫ – 76.000.000 ₫**\n• **Giường ngủ gỗ tự nhiên nguyên khối**: từ **62.000.000 ₫**\n• **Trọn bộ Sofa kèm Bàn trà điêu khắc (5–6 món)**: từ **92.000.000 ₫ – 128.000.000 ₫**\n• **Hệ tủ áo Walk-in & Tủ sảnh vòm**: Báo giá may đo theo kích thước thực tế.\n\nAnh/chị đang quan tâm tới hạng mục nào để em gửi hình ảnh và thông số chi tiết ạ?`,
      recommended: catalog.filter((p) => p.isFeatured).slice(0, 3),
      suggestions: isEn
        ? [
            "Show me Sofas (54M - 76M)",
            "Show me Bookcases & Cabinets",
            "Show me Solid Wood Beds",
          ]
        : [
            "Xem các mẫu Sofa (54tr - 76tr)",
            "Xem mẫu Giường ngủ nguyên khối",
            "Xem Kệ sách & Hệ tủ áo",
          ],
    };
  }

  // =========================================================================
  // 11. CHÀO HỎI / CẢM ƠN / HỎI SHOP BÁN GÌ / CÂU HỎI XÃ GIAO
  // =========================================================================
  if (
    hasPhrase(unaccentedQ, [
      "cam on",
      "thank",
      "thanks",
      "ok",
      "oke",
      "duoc roi",
      "tuyet voi",
      "tot qua",
    ])
  ) {
    return {
      reply: isEn
        ? `You're very welcome! If you need any further information about solid wood furniture, custom dimensions, or want to visit our showroom, feel free to ask anytime. Have a wonderful day!`
        : `Dạ không có gì ạ! Khi nào anh/chị cần xem thêm mẫu nội thất gỗ, tư vấn kích thước phong thủy hay đặt lịch ghé Showroom thì cứ nhắn em bất cứ lúc nào nhé. Chúc anh/chị một ngày tốt lành ạ!`,
      recommended: [],
      suggestions: isEn
        ? [
            "Explore featured products",
            "Showroom location",
            "Contact store owner",
          ]
        : [
            "Xem các tác phẩm nổi bật",
            "Địa chỉ Showroom & Giờ mở cửa",
            "Liên hệ Chủ tiệm",
          ],
    };
  }

  if (
    hasPhrase(unaccentedQ, [
      "ban la ai",
      "em la ai",
      "ai dang chat",
      "who are you",
      "bot ha",
    ])
  ) {
    return {
      reply: isEn
        ? `I am the virtual interior consultant of **${siteConfig.brandName}**. I can help you look up product specifications, workshop prices, wood characteristics, or connect you directly with our workshop owner!`
        : `Dạ em là **Trợ lý AI của xưởng nội thất gỗ ${siteConfig.brandName}**. Em hỗ trợ tra cứu nhanh thông số, chất liệu gỗ, giá bán tại xưởng và kết nối trực tiếp anh/chị với **Chủ xưởng** khi cần tư vấn chuyên sâu ạ!`,
      recommended: [],
      suggestions: isEn
        ? [
            "Connect with Store Owner",
            "Show me Walnut Sofas",
            "Showroom address",
          ]
        : [
            "Liên hệ trực tiếp Chủ tiệm",
            "Tư vấn mẫu Sofa gỗ tự nhiên",
            "Địa chỉ Showroom & Xưởng",
          ],
    };
  }

  // Mặc định: Giới thiệu ngắn gọn, lịch sự và hỏi nhu cầu cụ thể (không tự ý đổ 8 sản phẩm gây rối)
  const catList = categories.join(", ");
  return {
    reply: isEn
      ? `Hello! Welcome to **${siteConfig.brandName}** (*${siteConfig.slogan}*).\n\nOur workshop crafts solid wood pieces across: **${catList}**.\n\nHow can I assist you today?\n• Ask about a product (*Sofas, Coffee Tables, Beds, Bookcases, Wardrobes*)\n• Ask about *prices, custom sizing, or 5-year warranty*\n• Or ask to *connect directly with our Store Owner*!`
      : `Dạ xin chào anh/chị! Chào mừng anh/chị đến với **${siteConfig.brandName}** (*${siteConfig.slogan}*).\n\nHiện tại xưởng chuyên chế tác các dòng sản phẩm: **${catList}**.\n\nAnh/chị cần em hỗ trợ thông tin nào dưới đây ạ?\n• Xem mẫu & báo giá (*Sofa, Bàn trà, Giường ngủ, Kệ sách, Tủ áo*)\n• Tư vấn *đặt đóng theo kích thước riêng & Bảo hành*\n• Hoặc *kết nối trực tiếp với Chủ tiệm / Chủ xưởng*!`,
    recommended: [],
    suggestions: isEn
      ? [
          "Walnut Sofas & Coffee Tables",
          "Beds & Walk-in Wardrobes",
          "Custom sizing at workshop",
          "Connect with Store Owner",
        ]
      : [
          "Tư vấn mẫu Sofa & Bàn trà",
          "Mẫu Giường ngủ & Kệ tủ gỗ",
          "Đặt đóng theo kích thước riêng",
          "Liên hệ trực tiếp Chủ tiệm",
        ],
  };
}

function getFollowUpSuggestions(message: string, locale: Locale): string[] {
  const q = stripAccents(message);
  if (locale === "en") {
    if (q.includes("sofa")) {
      return [
        "Coffee tables to match",
        "Custom sofa dimensions",
        "Connect with Store Owner",
      ];
    }
    return [
      "Walnut Sofas & Coffee Tables",
      "Beds & Bedroom furniture",
      "Custom sizing at workshop",
      "Connect with Store Owner",
    ];
  }

  if (q.includes("sofa")) {
    return [
      "Mẫu bàn trà ghép bộ phù hợp",
      "Đặt đóng Sofa theo kích thước riêng",
      "Liên hệ trực tiếp Chủ tiệm",
    ];
  }
  if (q.includes("ban") || q.includes("ke") || q.includes("giuong")) {
    return [
      "Xem các mẫu Sofa gỗ óc chó",
      "Đặt đóng theo kích thước riêng",
      "Liên hệ trực tiếp Chủ tiệm",
    ];
  }
  return [
    "Tư vấn mẫu Sofa gỗ tự nhiên",
    "Các mẫu Bàn trà & Kệ Tivi",
    "Giường ngủ & Tủ áo gỗ nguyên khối",
    "Liên hệ trực tiếp Chủ tiệm",
  ];
}

async function callGeminiAssistant(params: {
  apiKey: string;
  customPrompt: string;
  locale: Locale;
  message: string;
  history: ChatHistoryItem[];
  siteConfig: Awaited<ReturnType<typeof getSiteConfig>>;
  catalog: EnrichedProduct[];
  inquiryCreated: boolean;
}): Promise<{
  reply: string;
  recommendedProducts: EnrichedProduct[];
  showContactCard: boolean;
} | null> {
  const {
    apiKey,
    customPrompt,
    locale,
    message,
    history,
    siteConfig,
    catalog,
    inquiryCreated,
  } = params;

  const catalogContext = catalog
    .map(
      (p) =>
        `- [SLUG:${p.slug}] Tên: "${p.name}" | Danh mục: ${p.categoryName} | Chất liệu: ${p.material} | Kích thước: ${p.dimensions} | Giá: ${p.priceText}`
    )
    .join("\n");

  const systemInstruction = `Bạn là Chuyên viên Tư vấn AI của thương hiệu nội thất gỗ tự nhiên "${siteConfig.brandName}" (${siteConfig.slogan}).
Thông tin Chủ tiệm & Showroom:
- Hotline Chủ tiệm / Chủ xưởng: ${siteConfig.phone}
- Zalo Chủ tiệm: ${siteConfig.zalo}
- Email: ${siteConfig.email}
- Địa chỉ Showroom & Xưởng: ${siteConfig.address}
- Giờ mở cửa: ${siteConfig.openingHours}
- Chính sách: Bảo hành 5 năm kết cấu gỗ tự nhiên (chống cong vênh, mối mọt), bảo trì trọn đời, nhận đặt đóng may đo theo kích thước riêng tại xưởng (15-25 ngày, nghiệm thu mộc trước khi sơn), giao hàng lắp đặt toàn quốc.
${customPrompt ? `\nHướng dẫn bổ sung từ chủ cửa hàng:\n${customPrompt}\n` : ""}
Danh sách sản phẩm thực tế tại Showroom:
${catalogContext}

Quy tắc quan trọng:
1. Trả lời đúng trọng tâm câu hỏi của khách hàng bằng ${locale === "en" ? "Tiếng Anh" : "Tiếng Việt"}, lịch sự, tự nhiên, ngắn gọn (dưới 140 từ).
2. Nếu khách muốn liên hệ chủ tiệm / hỏi số điện thoại / Zalo / địa chỉ: Hãy cung cấp rõ Hotline ${siteConfig.phone}, Zalo ${siteConfig.zalo}, địa chỉ Showroom và kèm thẻ [SHOW_CONTACT] ở cuối câu. Tuyệt đối KHÔNG tự ý liệt kê danh sách sản phẩm khi khách chỉ hỏi thông tin liên hệ.
3. Chỉ khi khách hỏi tìm sản phẩm, giá cả hoặc cần gợi ý mẫu nội thất thì mới giới thiệu 1-3 sản phẩm phù hợp nhất và gắn mã [SLUG:slug-san-pham] ở cuối câu.
4. ${inquiryCreated ? "Khách vừa gửi kèm số điện thoại, hãy xác nhận đã lưu SĐT để Chủ xưởng gọi lại ngay." : ""}`;

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const candidateModels = [
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  let rawReply: string | undefined;

  for (const modelName of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9500);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
            thinkingConfig: {
              thinkingLevel: "MINIMAL",
            },
          },
        }),
      });
      clearTimeout(timer);

      if (!res.ok) continue;
      const data = await res.json();
      const parts: Array<{ text?: string; thought?: boolean }> =
        data?.candidates?.[0]?.content?.parts || [];
      const answerPart =
        parts.find((p) => !p.thought && typeof p.text === "string" && p.text.trim()) ||
        parts[parts.length - 1];
      if (answerPart?.text) {
        rawReply = answerPart.text;
        break;
      }
    } catch {
      clearTimeout(timer);
      continue;
    }
  }

  if (!rawReply) return null;

  const slugMatches = Array.from(rawReply.matchAll(/\[SLUG:([a-z0-9-]+)\]/gi));
  const mentionedSlugs = slugMatches.map((m) => m[1].toLowerCase());
  const recommendedProducts = catalog.filter((p) =>
    mentionedSlugs.includes(p.slug.toLowerCase())
  );
  const showContactCard = /\[SHOW_CONTACT\]/i.test(rawReply);

  const cleanReply = rawReply
    .replace(/\[SLUG:[a-z0-9-]+\]/gi, "")
    .replace(/\[SHOW_CONTACT\]/gi, "")
    .trim();

  return {
    reply: cleanReply,
    recommendedProducts,
    showContactCard,
  };
}
