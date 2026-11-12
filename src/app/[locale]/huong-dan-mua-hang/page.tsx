import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Ruler,
  Layers,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  Phone,
  HelpCircle,
  Sparkles,
  ArrowRight,
  PackageCheck,
  MapPin,
  Clock,
  RefreshCw,
} from "lucide-react";
import { isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { ZaloIcon } from "@/components/client/SocialIcons";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const title =
    locale === "en"
      ? "Buying Guide for Handcrafted Wood Decor | Wooden Decor"
      : "Hướng Dẫn Mua Đồ Decor Gỗ Thủ Công | Wooden Decor";

  const description =
    locale === "en"
      ? "Step-by-step buying guide for handcrafted wooden decor at Wooden Decor: filter by space, pick timber size, pay COD/transfer, and track orders."
      : "Quy trình 5 bước đặt mua đồ decor gỗ thủ công tại Wooden Decor: tìm mẫu, chọn chất liệu, nhập mã ưu đãi, thanh toán COD và theo dõi giao hàng.";

  return buildPageMetadata({
    locale,
    path: "/huong-dan-mua-hang",
    title,
    description,
    image: "/uploads/banners/hero-phong-khach-dang-song.webp",
  });
}

export default async function BuyingGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const isEn = locale === "en";
  const siteConfig = await getSiteConfig(locale);

  const steps = [
    {
      number: "01",
      id: "buoc-1",
      badge: isEn ? "Step 1 • Discovery" : "Bước 1 • Tìm kiếm & Chọn lọc",
      title: isEn
        ? "Search & Filter Wooden Decor by Category or Living Space"
        : "Tìm kiếm & Lọc sản phẩm decor gỗ theo danh mục/không gian",
      summary: isEn
        ? "Quickly find the exact solid wood furniture or handcrafted wooden decor piece that fits your room layout and budget in less than 10 seconds."
        : "Dễ dàng tìm đúng món đồ decor gỗ thủ công hoặc nội thất nguyên khối phù hợp với diện tích phòng và ngân sách chỉ trong vài giây.",
      bullets: isEn
        ? [
            "Type keywords directly into the top search bar (e.g., 'Walnut Sofa', 'Coffee Table', 'Bookcase').",
            "Click space & category pills (Living Room, Bedroom, Tea Corner, Arched Cabinets) for instant 0ms filtering without page reload.",
            "Combine with Price Range and Sort filters to narrow down pieces matching your target budget.",
          ]
        : [
            "Nhập từ khóa trực tiếp vào thanh tìm kiếm trên Header hoặc đầu trang Sản phẩm (VD: 'Sofa óc chó', 'Bàn trà', 'Kệ sách').",
            "Bấm chọn thẻ Danh mục hoặc Không gian bài trí (Phòng khách, Phòng ngủ, Góc trà đạo, Tủ vòm) để lọc tức thì không cần tải lại trang.",
            "Kết hợp bộ lọc Khoảng giá và Sắp xếp để xem nhanh các mẫu đúng ngân sách dự kiến.",
          ],
      tip: isEn
        ? "Tip: Need advice for a specific room size? Open the AI Assistant at the bottom-right corner anytime!"
        : "Mẹo nhỏ: Nếu chưa rõ mẫu nào hợp diện tích phòng, bạn có thể bấm nút Trợ lý AI ở góc dưới bên phải để được gợi ý tự động!",
    },
    {
      number: "02",
      id: "buoc-2",
      badge: isEn ? "Step 2 • Specifications" : "Bước 2 • Thông số & Chất liệu",
      title: isEn
        ? "Inspect Dimensions, Timber Material & Select Quantity"
        : "Xem chi tiết kích thước, chất liệu gỗ và chọn số lượng",
      summary: isEn
        ? "Every piece at Wooden Decor displays transparent timber origin, 3D organic dimensions, multi-angle studio photos, and custom-order options."
        : "Mỗi tác phẩm tại Wooden Decor đều công khai rõ chủng loại gỗ tự nhiên, kích thước phủ bì chuẩn phong thủy, ảnh chụp thật đa góc độ và tùy chọn số lượng.",
      bullets: isEn
        ? [
            "Click on any product card to view high-resolution wood grain photos and workshop videos.",
            "Check the 'Material' (North American Walnut, Ebony, Red Padauk) and 'Standard Dimensions' specifications.",
            "Select your desired timber finish, adjust the quantity (+ / -), or choose custom sizing for your room.",
          ]
        : [
            "Bấm vào ảnh hoặc tên sản phẩm để xem album ảnh cận cảnh vân gỗ tự nhiên và video quay thực tế tại xưởng.",
            "Kiểm tra kỹ thông số 'Chất liệu gỗ' (Gỗ Óc Chó Bắc Mỹ, Gỗ Mun, Gỗ Gõ Đỏ) và 'Kích thước tiêu chuẩn'.",
            "Chọn phiên bản kích thước phù hợp, điều chỉnh số lượng cần đặt (+ / -) rồi bấm nút Đặt mua / Yêu cầu báo giá.",
          ],
      tip: isEn
        ? "Tip: Our workshop can customize length, width, and leather cushion color to match your exact floor plan."
        : "Mẹo nhỏ: Xưởng nhận tinh chỉnh kích thước dài - rộng - cao theo thước Lỗ Ban và đổi màu da/nệm theo yêu cầu riêng.",
    },
    {
      number: "03",
      id: "buoc-3",
      badge: isEn ? "Step 3 • Cart & Voucher" : "Bước 3 • Giỏ hàng & Ưu đãi",
      title: isEn
        ? "Review Your Order Selection & Apply Promo Code (If Any)"
        : "Kiểm tra giỏ hàng và áp dụng mã ưu đãi (nếu có)",
      summary: isEn
        ? "Double-check your selected wooden pieces, customized notes, and apply seasonal workshop vouchers before confirming."
        : "Rà soát lại danh sách các món đồ decor gỗ đã chọn, ghi chú kích thước riêng và nhập mã giảm giá từ xưởng (nếu có) để tối ưu chi phí.",
      bullets: isEn
        ? [
            "Verify product names, timber finishes, quantities, and unit prices in your order summary.",
            "Enter your promo/voucher code (e.g., WOODEN10 or Combo Living Room discount) and click 'Apply'.",
            "Review the automatically calculated discount and estimated delivery schedule before proceeding.",
          ]
        : [
            "Kiểm tra lại tên sản phẩm, chất liệu gỗ, số lượng và đơn giá niêm yết tại xưởng trong bảng tóm tắt đơn hàng.",
            "Nhập mã ưu đãi / voucher tri ân khách hàng (ví dụ: WOODEN10 hoặc ưu đãi trọn bộ phòng khách) và bấm 'Áp dụng'.",
            "Hệ thống tự động khấu trừ ưu đãi và hiển thị tổng thanh toán minh bạch, không phát sinh phụ phí ẩn.",
          ],
      tip: isEn
        ? "Tip: Ordering a full room combo (Sofa + Coffee Table + TV Cabinet) unlocks an extra 5%–10% workshop discount."
        : "Mẹo nhỏ: Đặt trọn bộ không gian (Sofa + Bàn trà + Kệ Tivi) luôn có mức chiết khấu ưu đãi đặc biệt trực tiếp từ Chủ xưởng.",
    },
    {
      number: "04",
      id: "buoc-4",
      badge: isEn ? "Step 4 • Delivery & Payment" : "Bước 4 • Giao nhận & Thanh toán",
      title: isEn
        ? "Fill in Shipping Details & Choose Payment Method (COD / Bank Transfer)"
        : "Điền thông tin nhận hàng và chọn phương thức thanh toán (COD / Chuyển khoản)",
      summary: isEn
        ? "Enter your recipient information and select a flexible, safe payment method tailored for high-value solid wood furniture."
        : "Cung cấp thông tin người nhận để đội ngũ kỹ thuật giao lắp tận nơi và lựa chọn phương thức thanh toán linh hoạt, an toàn tuyệt đối.",
      bullets: isEn
        ? [
            "Fill in Full Name, Phone Number (Zalo), Delivery Address, and any specific installation notes (apartment floor, delivery time).",
            "Option 1 — Cash on Delivery (COD): Inspect wood grain and surface finish at your home before paying.",
            "Option 2 — Bank Transfer (VietQR 24/7): Fast QR transfer with instant receipt confirmation from our accounting team.",
          ]
        : [
            "Điền đầy đủ Họ tên, Số điện thoại (Zalo), Địa chỉ nhận hàng và ghi chú thời gian giao lắp thuận tiện nhất.",
            "Lựa chọn 1 — Thanh toán khi nhận hàng (COD): Đồng kiểm chất lượng gỗ, đường vân và nước sơn tại nhà rồi mới thanh toán.",
            "Lựa chọn 2 — Chuyển khoản Ngân hàng (VietQR): Quét mã QR nhanh chóng, minh bạch với xác nhận tự động từ cửa hàng.",
          ],
      tip: isEn
        ? "Tip: For custom-made solid wood orders, you can inspect the raw unpainted timber at our workshop before final finishing."
        : "Mẹo nhỏ: Với đơn hàng đặt đóng nguyên khối, quý khách được mời ký duyệt phôi gỗ mộc tại xưởng trước khi hoàn thiện sơn.",
    },
    {
      number: "05",
      id: "buoc-5",
      badge: isEn ? "Step 5 • Confirmation & Tracking" : "Bước 5 • Xác nhận & Theo dõi",
      title: isEn
        ? "Confirm Your Order & Track Real-Time Delivery Status"
        : "Xác nhận đơn hàng và theo dõi trạng thái giao hàng",
      summary: isEn
        ? "Once submitted, our workshop specialist contacts you within 15 minutes to confirm the schedule and sends live progress updates until installation."
        : "Ngay sau khi bấm xác nhận, chuyên viên xưởng sẽ liên hệ trong 15 phút để chốt lịch giao lắp và cập nhật tiến độ đơn hàng theo thời gian thực.",
      bullets: isEn
        ? [
            "Receive your unique Order ID (e.g., #WD-202689) along with an instant confirmation call/Zalo message within 15 minutes.",
            "Track every stage: Order Confirmed → Timber QC & 3-Layer Shockproof Packaging → In Transit → White-Glove Installation.",
            "Activate your electronic 5-Year Structural Wood Warranty and lifetime maintenance support upon delivery.",
          ]
        : [
            "Nhận Mã đơn hàng riêng (VD: #WD-202689); Chủ xưởng hoặc chuyên viên sẽ gọi/nhắn Zalo xác nhận trong vòng 15 phút.",
            "Theo dõi 4 chặng minh bạch: Đã xác nhận → Kiểm định vân gỗ & Đóng gói 3 lớp → Đang vận chuyển → Giao lắp hoàn tất.",
            "Kích hoạt chế độ Bảo hành 5 năm kết cấu gỗ tự nhiên và bảo trì làm mới bề mặt trọn đời ngay khi bàn giao.",
          ],
      tip: isEn
        ? "Tip: Keep your phone number handy — our delivery team will send real photos of your packed item before dispatch!"
        : "Mẹo nhỏ: Xưởng luôn chụp ảnh và quay video sản phẩm thực tế trước khi bọc chống sốc gửi qua Zalo để bạn nghiệm thu từ xa.",
    },
  ];

  const faqs = isEn
    ? [
        {
          question: "1. What is Wooden Decor's return and exchange policy?",
          answer:
            "Customers can inspect the product upon delivery before making payment. If the wooden decor or furniture item has any shipping damage, wrong dimensions, or wood species mismatch compared to the order, Wooden Decor supports a 100% free 1-for-1 exchange or full refund within 7 days.",
        },
        {
          question: "2. How are solid wood furniture and wooden decor items shipped and installed?",
          answer:
            "Small wooden decor items are packed with 3-layer shockproof foam and shipped nationwide within 2–4 days. Large solid wood furniture (sofas, tables, beds, wardrobes) is delivered and installed directly by our workshop technicians using specialized trucks.",
        },
        {
          question: "3. Can I inspect the product before paying (COD)?",
          answer:
            "Yes! With Cash on Delivery (COD), you are encouraged to unbox and verify the natural wood grain, joinery, dimensions, and finish before completing payment to our delivery staff.",
        },
        {
          question: "4. Does the workshop accept custom dimensions and bespoke designs?",
          answer:
            "Absolutely. Because we operate our own manufacturing workshop, you can customize dimensions (length, width, height), wood types (Walnut, Ebony, Rosewood), and leather/fabric colors. Production takes 15–25 days with raw-timber inspection prior to finishing.",
        },
        {
          question: "5. What does the 5-year warranty cover?",
          answer:
            "All solid wood creations at Wooden Decor include a 5-year structural warranty covering natural wood warping, shrinkage, joinery looseness, and termite resistance, alongside lifetime surface polishing and maintenance support.",
        },
        {
          question: "6. How do I get the fastest support if I have trouble ordering on the website?",
          answer:
            "You can click the Hotline/Zalo button on the screen, use the 24/7 AI Consultant chat box at the bottom-right corner, or leave your phone number in the quick consultation form — our owner will call you back within 15 minutes.",
        },
      ]
    : [
        {
          question: "1. Chính sách đổi trả hàng tại Wooden Decor như thế nào?",
          answer:
            "Khách hàng được quyền đồng kiểm sản phẩm ngay khi nhận hàng. Nếu sản phẩm đồ decor gỗ hoặc nội thất bị trầy xước do vận chuyển, sai lệch kích thước, hoặc không đúng chủng loại gỗ đã cam kết, Wooden Decor hỗ trợ đổi mới 1-1 hoàn toàn miễn phí hoặc hoàn tiền 100% trong vòng 7 ngày kể từ ngày nhận hàng.",
        },
        {
          question: "2. Phí vận chuyển và thời gian giao hàng trên toàn quốc ra sao?",
          answer:
            "Với các món đồ decor gỗ nhỏ gọn, xưởng đóng gói chống sốc 3 lớp và giao toàn quốc từ 2–4 ngày làm việc. Với nội thất gỗ nguyên khối kích thước lớn (Sofa, Bàn trà, Giường, Tủ áo), đội ngũ kỹ thuật của xưởng trực tiếp vận chuyển bằng xe chuyên dụng và lắp đặt tận phòng; miễn phí giao lắp nội thành và hỗ trợ tối đa chi phí vận chuyển liên tỉnh.",
        },
        {
          question: "3. Tôi có được kiểm tra hàng trước khi thanh toán (COD) không?",
          answer:
            "Hoàn toàn được! Khi chọn phương thức Thanh toán khi nhận hàng (COD), quý khách được mở kiện kiểm tra trực tiếp chất lượng gỗ tự nhiên, đường vân, độ mịn bề mặt và kích thước thực tế đúng như tư vấn rồi mới thanh toán.",
        },
        {
          question: "4. Xưởng có nhận đặt đóng theo kích thước riêng của gia đình không?",
          answer:
            "Có. Lợi thế lớn nhất của Wooden Decor là xưởng sản xuất trực tiếp. Quý khách có thể yêu cầu điều chỉnh kích thước theo thước Lỗ Ban, chọn loại gỗ (Óc Chó Bắc Mỹ, Gỗ Mun, Gõ Đỏ, Hương Đá) và màu da nệm. Thời gian chế tác riêng từ 15–25 ngày, có mời khách nghiệm thu mộc trước khi sơn PU.",
        },
        {
          question: "5. Chính sách bảo hành 5 năm và bảo trì trọn đời bao gồm những gì?",
          answer:
            "Tất cả tác phẩm gỗ tự nhiên tại Wooden Decor đều được bảo hành 5 năm cho kết cấu gỗ (chống cong vênh, nứt xé tự nhiên, mối mọt và mộng ghép) cùng chế độ bảo trì, đánh bóng làm mới bề mặt gỗ trọn đời sử dụng.",
        },
        {
          question: "6. Nếu tôi không rành thao tác trên web thì đặt hàng nhanh bằng cách nào?",
          answer:
            "Anh/chị chỉ cần bấm nút Gọi Hotline, nhắn Zalo trực tiếp cho Chủ xưởng, hoặc gõ Số điện thoại vào khung Chat AI ở góc dưới bên phải màn hình. Hệ thống sẽ tự động ghi nhận và chuyên viên sẽ gọi lại tư vấn tận tình trong vòng 15 phút.",
        },
      ];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isEn
      ? "How to Order Handcrafted Wooden Decor & Furniture on Wooden Decor Website"
      : "Hướng dẫn mua hàng & Sử dụng Website Đồ Decor Gỗ Thủ Công Wooden Decor",
    description: isEn
      ? "5-step visual guide to searching, selecting timber dimensions, applying promo codes, choosing COD/Bank transfer, and tracking your order at Wooden Decor."
      : "Quy trình 5 bước trực quan giúp khách hàng tìm kiếm, chọn kích thước chất liệu gỗ, áp dụng mã ưu đãi, thanh toán COD/Chuyển khoản và theo dõi đơn hàng tại Wooden Decor.",
    totalTime: "PT3M",
    supply: [
      {
        "@type": "HowToSupply",
        name: isEn
          ? "Room dimensions or preferred living space style"
          : "Kích thước không gian phòng hoặc mẫu đồ decor gỗ yêu thích",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: isEn
          ? "Smartphone or Computer web browser"
          : "Điện thoại thông minh hoặc Máy tính có kết nối Internet",
      },
    ],
    step: steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: `${s.summary} ${s.bullets.join(" ")}`,
      url: `${SITE_URL}/${locale}/huong-dan-mua-hang#${s.id}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Trang chủ",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEn
          ? "Buying Guide & Website Instructions"
          : "Hướng dẫn mua hàng & Sử dụng Website",
        item: `${SITE_URL}/${locale}/huong-dan-mua-hang`,
      },
    ],
  };

  return (
    <article
      style={{ backgroundColor: "#FAF6F0", color: "#5C3A21" }}
      className="min-h-screen pb-20 selection:bg-[#A67B5B]/25"
    >
      {/* Schema JSON-LD: HowTo + FAQPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* PHẦN HERO & H1 DUY NHẤT */}
      <header className="relative overflow-hidden border-b border-[#A67B5B]/25 bg-gradient-to-b from-[#FAF6F0] via-[#F5EDE1] to-[#FAF6F0] pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb ngữ nghĩa */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5C3A21]/75 mb-6"
          >
            <Link
              href={`/${locale}`}
              className="hover:text-[#5C3A21] underline-offset-4 hover:underline transition-colors"
            >
              {isEn ? "Home" : "Trang chủ"}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#5C3A21]">
              {isEn
                ? "Buying Guide & How to Use Website"
                : "Hướng dẫn mua hàng & Sử dụng Website"}
            </span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold tracking-wide uppercase mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FAF6F0]" />
              <span>
                {isEn
                  ? "5-Step Visual Shopping Guide • Wooden Decor"
                  : "Cẩm Nang Mua Sắm Trực Quan 5 Bước • Wooden Decor"}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#5C3A21] leading-tight">
              {isEn
                ? "Buying Guide & How to Use the Handcrafted Wooden Decor Website"
                : "Hướng Dẫn Mua Hàng & Sử Dụng Website Đồ Decor Gỗ Thủ Công"}
            </h1>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#5C3A21]/85 leading-relaxed max-w-3xl">
              {isEn
                ? "Welcome to Wooden Decor. Follow our visual 5-step walkthrough below—complete with interactive interface mockups and callout arrows—to effortlessly search, customize, and order authentic solid wood creations."
                : "Chào mừng quý khách đến với Wooden Decor. Chỉ với 5 bước thao tác đơn giản kèm hình minh họa giao diện trực quan bên dưới, bạn có thể dễ dàng tìm kiếm, tùy chọn kích thước gỗ tự nhiên và đặt mua an toàn ngay tại nhà."}
            </p>
          </div>

          {/* Thanh nhảy nhanh tới 5 bước + FAQ */}
          <nav
            aria-label={isEn ? "Quick step navigation" : "Điều hướng nhanh các bước"}
            className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
          >
            {steps.map((s, index) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF6F0] border border-[#A67B5B]/35 hover:border-[#3E5641] hover:bg-white transition-all shadow-xs"
              >
                <span className="w-7 h-7 rounded-lg bg-[#5C3A21] group-hover:bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-[#5C3A21] line-clamp-2 leading-snug">
                  {isEn
                    ? [
                        "Search & Filter",
                        "Size & Timber",
                        "Cart & Promo",
                        "COD / Payment",
                        "Order Tracking",
                      ][index]
                    : [
                        "Tìm & Lọc mẫu",
                        "Kích thước & Gỗ",
                        "Giỏ hàng & Mã",
                        "Thanh toán COD",
                        "Theo dõi đơn",
                      ][index]}
                </span>
              </a>
            ))}
            <a
              href="#cau-hoi-thuong-gap"
              className="group flex items-center gap-2.5 p-3 rounded-xl bg-[#3E5641] text-[#FAF6F0] hover:bg-[#5C3A21] transition-all shadow-xs"
            >
              <HelpCircle className="w-5 h-5 text-[#FAF6F0] shrink-0" />
              <span className="text-xs font-semibold leading-snug">
                {isEn ? "Shipping & Return FAQ" : "Câu hỏi thường gặp (FAQ)"}
              </span>
            </a>
          </nav>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH: QUY TRÌNH 5 BƯỚC LƯỚI 2 CỘT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16 sm:space-y-24">
        {/* =============================================================== */}
        {/* BƯỚC 1: TÌM KIẾM & LỌC SẢN PHẨM DECOR GỖ THEO DANH MỤC / KHÔNG GIAN */}
        {/* =============================================================== */}
        <section
          id={steps[0].id}
          aria-labelledby="heading-buoc-1"
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Cột hướng dẫn (Trái) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#5C3A21] text-[#FAF6F0] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                01
              </span>
              <span className="px-3 py-1 rounded-full bg-[#A67B5B]/20 text-[#5C3A21] text-xs font-semibold tracking-wide uppercase">
                {steps[0].badge}
              </span>
            </div>

            <h2
              id="heading-buoc-1"
              className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#5C3A21] leading-snug"
            >
              {steps[0].title}
            </h2>

            <p className="text-sm sm:text-base text-[#5C3A21]/85 leading-relaxed">
              {steps[0].summary}
            </p>

            <ul className="space-y-3 text-sm sm:text-[15px] text-[#5C3A21]">
              {steps[0].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-2xl bg-[#3E5641]/10 border-l-4 border-[#3E5641] text-xs sm:text-sm text-[#5C3A21] leading-relaxed">
              <strong className="text-[#3E5641] font-semibold">
                {isEn ? "Pro Tip: " : "Gợi ý nhanh: "}
              </strong>
              {steps[0].tip}
            </div>
          </div>

          {/* Cột UI Mockup Card Bước 1 (Phải) */}
          <div className="lg:col-span-7">
            <div
              role="img"
              aria-label="Minh họa giao diện Bước 1: Thanh tìm kiếm từ khóa và nút bấm lọc sản phẩm decor gỗ theo danh mục phòng khách, phòng ngủ"
              className="relative rounded-3xl bg-white border-2 border-[#A67B5B]/40 shadow-xl overflow-hidden p-4 sm:p-6"
            >
              {/* Thanh trình duyệt giả lập */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#A67B5B]/25">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E5641]" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/30 text-[11px] text-[#5C3A21]/80 font-mono truncate text-center">
                  thienan-woodendecor.vercel.app/vi/san-pham
                </div>
                <span className="text-[11px] font-semibold text-[#3E5641] bg-[#3E5641]/10 px-2.5 py-0.5 rounded-full">
                  UI Step 1
                </span>
              </div>

              {/* Ô tìm kiếm mô phỏng */}
              <div className="relative bg-[#FAF6F0] border-2 border-[#5C3A21] rounded-2xl p-3 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="w-4 h-4 text-[#5C3A21] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#5C3A21] truncate">
                    {isEn ? "Walnut coffee table, wooden tray..." : "Bàn trà gỗ óc chó, khay gỗ decor..."}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#5C3A21] text-[#FAF6F0] text-xs font-semibold shrink-0">
                  {isEn ? "Search" : "Tìm kiếm"}
                </span>
              </div>

              {/* Hàng nút lọc Danh mục / Không gian + Mũi tên SVG chỉ dẫn */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C3A21]/80 mb-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#A67B5B]" />
                  <span>
                    {isEn ? "Filter by Space & Category:" : "Chọn Danh mục / Không gian sống:"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/40 text-xs text-[#5C3A21]">
                    {isEn ? "All (24)" : "Tất cả (24)"}
                  </span>
                  <span className="relative px-3.5 py-1.5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold shadow-sm ring-2 ring-[#3E5641]/30">
                    ✓ {isEn ? "Living Room & Tea Table" : "Phòng khách & Bàn trà"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/40 text-xs text-[#5C3A21]">
                    {isEn ? "Wooden Shelves & Decor" : "Kệ sách & Đồ Decor"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/40 text-xs text-[#5C3A21]">
                    {isEn ? "Under 30M ₫" : "Dưới 30 triệu"}
                  </span>
                </div>
              </div>

              {/* Chú thích mũi tên SVG trực quan Bước 1 */}
              <div className="my-3 flex items-center justify-center sm:justify-end">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold shadow-md">
                  <svg
                    width="28"
                    height="22"
                    viewBox="0 0 28 22"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M26 18C17 18 11 14 7 4M7 4L3 10M7 4L13 7"
                      stroke="#FAF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {isEn
                      ? "① Click category pill or type keyword here"
                      : "① Bấm chọn Danh mục hoặc gõ từ khóa tại đây"}
                  </span>
                </div>
              </div>

              {/* 2 Thẻ sản phẩm kết quả lọc mô phỏng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#A67B5B]/20">
                <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#A67B5B]/35 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#A67B5B] to-[#5C3A21] text-[#FAF6F0] flex flex-col items-center justify-center text-[10px] font-serif font-bold shrink-0">
                    <span>WALNUT</span>
                    <span>TABLE</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#5C3A21] truncate">
                      {isEn ? "Sculpted Walnut Coffee Table" : "Bàn Trà Gỗ Óc Chó Điêu Khắc"}
                    </p>
                    <p className="text-[11px] text-[#5C3A21]/75">
                      100% Gỗ Óc Chó Bắc Mỹ
                    </p>
                    <p className="text-xs font-bold text-[#3E5641] mt-0.5">
                      28.500.000 ₫
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#A67B5B]/35 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5C3A21] to-[#3E5641] text-[#FAF6F0] flex flex-col items-center justify-center text-[10px] font-serif font-bold shrink-0">
                    <span>ORGANIC</span>
                    <span>SHELF</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#5C3A21] truncate">
                      {isEn ? "Organic Curve Wooden Shelf" : "Kệ Gỗ Decor Đường Cong Organic"}
                    </p>
                    <p className="text-[11px] text-[#5C3A21]/75">
                      Gỗ Tự Nhiên Ghép Mộng
                    </p>
                    <p className="text-xs font-bold text-[#3E5641] mt-0.5">
                      26.500.000 ₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BƯỚC 2: XEM CHI TIẾT KÍCH THƯỚC, CHẤT LIỆU GỖ VÀ CHỌN SỐ LƯỢNG */}
        {/* =============================================================== */}
        <section
          id={steps[1].id}
          aria-labelledby="heading-buoc-2"
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Cột UI Mockup Card Bước 2 (Trái trên Desktop, Dưới trên Mobile) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              role="img"
              aria-label="Minh họa giao diện Bước 2: Xem kích thước, chọn chất liệu gỗ Óc Chó hoặc Gõ Đỏ, chỉnh số lượng và bấm nút thêm vào giỏ"
              className="relative rounded-3xl bg-white border-2 border-[#A67B5B]/40 shadow-xl overflow-hidden p-4 sm:p-6"
            >
              {/* Thanh trình duyệt giả lập */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#A67B5B]/25">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E5641]" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/30 text-[11px] text-[#5C3A21]/80 font-mono truncate text-center">
                  .../san-pham/ban-tra-go-oc-cho
                </div>
                <span className="text-[11px] font-semibold text-[#3E5641] bg-[#3E5641]/10 px-2.5 py-0.5 rounded-full">
                  UI Step 2
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A67B5B]">
                      {isEn ? "Handcrafted Living Room Piece" : "Tác phẩm phòng khách thủ công"}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#5C3A21]">
                      {isEn
                        ? "Sculpted Solid Walnut Coffee Table"
                        : "Bàn Trà Gỗ Óc Chó Điêu Khắc Nguyên Khối"}
                    </h3>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-[#3E5641] bg-[#FAF6F0] px-3 py-1 rounded-xl border border-[#A67B5B]/30">
                    28.500.000 ₫
                  </span>
                </div>

                {/* Chọn chất liệu gỗ */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#A67B5B]/35 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5C3A21]">
                    <Layers className="w-4 h-4 text-[#A67B5B]" />
                    <span>{isEn ? "1. Select Timber Material:" : "1. Chọn chất liệu gỗ tự nhiên:"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-[#5C3A21] text-[#FAF6F0] text-xs font-semibold shadow-xs">
                      ✓ {isEn ? "North American Walnut" : "Gỗ Óc Chó Bắc Mỹ (Đã sấy)"}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-[#A67B5B]/40 text-xs text-[#5C3A21]">
                      {isEn ? "Solid Red Padauk" : "Gỗ Gõ Đỏ Nguyên Khối"}
                    </span>
                  </div>

                  {/* Chọn kích thước */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#5C3A21]">
                    <Ruler className="w-4 h-4 text-[#A67B5B]" />
                    <span>{isEn ? "2. Select Dimensions (L x W x H):" : "2. Kích thước tiêu chuẩn / Đặt riêng:"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold">
                      ✓ 140 × 75 × 42 cm
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-[#A67B5B]/40 text-xs text-[#5C3A21]">
                      160 × 80 × 42 cm
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-dashed border-[#5C3A21] text-xs font-medium text-[#5C3A21]">
                      {isEn ? "+ Custom Size" : "+ Đặt kích thước riêng"}
                    </span>
                  </div>
                </div>

                {/* Chọn số lượng & Nút bấm Đặt hàng */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#5C3A21]">
                      {isEn ? "Quantity:" : "Số lượng:"}
                    </span>
                    <div className="inline-flex items-center rounded-xl border-2 border-[#A67B5B] bg-[#FAF6F0] px-2 py-1 gap-3">
                      <Minus className="w-3.5 h-3.5 text-[#5C3A21]" />
                      <span className="text-xs font-bold text-[#5C3A21]">01</span>
                      <Plus className="w-3.5 h-3.5 text-[#5C3A21]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-[#5C3A21] text-[#FAF6F0] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md ring-2 ring-[#A67B5B]">
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isEn ? "Add to Order / Request Quote" : "Thêm vào đơn / Đặt mua ngay"}
                    </span>
                  </div>
                </div>

                {/* Chú thích mũi tên SVG Bước 2 */}
                <div className="flex items-center justify-end">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#A67B5B] text-[#FAF6F0] text-xs font-semibold shadow-md">
                    <svg
                      width="26"
                      height="20"
                      viewBox="0 0 26 20"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path
                        d="M4 16C12 16 17 12 20 3M20 3L14 6M20 3L23 9"
                        stroke="#FAF6F0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      {isEn
                        ? "② Pick wood & size, adjust quantity, then click Order"
                        : "② Chọn loại gỗ, kích thước, số lượng rồi bấm Đặt mua"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột hướng dẫn (Phải trên Desktop, Trên trên Mobile) */}
          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#5C3A21] text-[#FAF6F0] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                02
              </span>
              <span className="px-3 py-1 rounded-full bg-[#A67B5B]/20 text-[#5C3A21] text-xs font-semibold tracking-wide uppercase">
                {steps[1].badge}
              </span>
            </div>

            <h2
              id="heading-buoc-2"
              className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#5C3A21] leading-snug"
            >
              {steps[1].title}
            </h2>

            <p className="text-sm sm:text-base text-[#5C3A21]/85 leading-relaxed">
              {steps[1].summary}
            </p>

            <ul className="space-y-3 text-sm sm:text-[15px] text-[#5C3A21]">
              {steps[1].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-2xl bg-[#A67B5B]/15 border-l-4 border-[#A67B5B] text-xs sm:text-sm text-[#5C3A21] leading-relaxed">
              <strong className="text-[#5C3A21] font-semibold">
                {isEn ? "Custom Sizing: " : "May đo theo phòng: "}
              </strong>
              {steps[1].tip}
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BƯỚC 3: KIỂM TRA GIỎ HÀNG VÀ ÁP DỤNG MÃ ƯU ĐÃI (NẾU CÓ)         */}
        {/* =============================================================== */}
        <section
          id={steps[2].id}
          aria-labelledby="heading-buoc-3"
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Cột hướng dẫn (Trái) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#5C3A21] text-[#FAF6F0] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                03
              </span>
              <span className="px-3 py-1 rounded-full bg-[#A67B5B]/20 text-[#5C3A21] text-xs font-semibold tracking-wide uppercase">
                {steps[2].badge}
              </span>
            </div>

            <h2
              id="heading-buoc-3"
              className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#5C3A21] leading-snug"
            >
              {steps[2].title}
            </h2>

            <p className="text-sm sm:text-base text-[#5C3A21]/85 leading-relaxed">
              {steps[2].summary}
            </p>

            <ul className="space-y-3 text-sm sm:text-[15px] text-[#5C3A21]">
              {steps[2].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-2xl bg-[#3E5641]/10 border-l-4 border-[#3E5641] text-xs sm:text-sm text-[#5C3A21] leading-relaxed">
              <strong className="text-[#3E5641] font-semibold">
                {isEn ? "Combo Privilege: " : "Ưu đãi tại xưởng: "}
              </strong>
              {steps[2].tip}
            </div>
          </div>

          {/* Cột UI Mockup Card Bước 3 (Phải) */}
          <div className="lg:col-span-7">
            <div
              role="img"
              aria-label="Minh họa giao diện Bước 3: Kiểm tra giỏ hàng, nhập mã ưu đãi WOODEN10 và bấm nút áp dụng"
              className="relative rounded-3xl bg-white border-2 border-[#A67B5B]/40 shadow-xl overflow-hidden p-4 sm:p-6"
            >
              {/* Thanh trình duyệt giả lập */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#A67B5B]/25">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E5641]" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/30 text-[11px] text-[#5C3A21]/80 font-mono truncate text-center">
                  Wooden Decor • {isEn ? "Order Summary & Voucher" : "Giỏ Hàng & Mã Ưu Đãi"}
                </div>
                <span className="text-[11px] font-semibold text-[#3E5641] bg-[#3E5641]/10 px-2.5 py-0.5 rounded-full">
                  UI Step 3
                </span>
              </div>

              {/* Sản phẩm trong giỏ */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#A67B5B]/35 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#5C3A21] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-xs shrink-0">
                    01×
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#5C3A21] truncate">
                      {isEn
                        ? "Sculpted Walnut Coffee Table (140×75cm)"
                        : "Bàn Trà Gỗ Óc Chó Điêu Khắc (140×75cm)"}
                    </p>
                    <p className="text-[11px] text-[#5C3A21]/75">
                      {isEn ? "Material: North American Walnut" : "Chất liệu: Gỗ Óc Chó Bắc Mỹ • SL: 01"}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#5C3A21] shrink-0">
                  28.500.000 ₫
                </span>
              </div>

              {/* Ô nhập mã ưu đãi */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#A67B5B] space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5C3A21]">
                  <Tag className="w-3.5 h-3.5 text-[#3E5641]" />
                  <span>
                    {isEn ? "Promo / Workshop Voucher Code:" : "Nhập mã ưu đãi / Voucher xưởng (nếu có):"}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-[#5C3A21]/40 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono font-bold text-[#3E5641] tracking-wider flex items-center justify-between">
                    <span>WOODEN10</span>
                    <span className="text-[10px] font-sans font-medium text-[#3E5641] bg-[#3E5641]/10 px-2 py-0.5 rounded-md">
                      -10%
                    </span>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold shadow-sm shrink-0">
                    {isEn ? "Apply" : "Áp dụng"}
                  </span>
                </div>
              </div>

              {/* Chú thích mũi tên SVG Bước 3 */}
              <div className="my-3 flex items-center justify-end">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#3E5641] text-[#FAF6F0] text-xs font-semibold shadow-md">
                  <svg
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M4 15C11 15 16 11 20 3M20 3L14 6M20 3L23 9"
                      stroke="#FAF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {isEn
                      ? "③ Enter voucher code & click 'Apply' before checkout"
                      : "③ Nhập mã ưu đãi rồi bấm 'Áp dụng' để được trừ giá"}
                  </span>
                </div>
              </div>

              {/* Tổng cộng & Nút sang Bước 4 */}
              <div className="pt-3 border-t border-[#A67B5B]/25 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#5C3A21]/85 space-y-0.5">
                  <p>
                    {isEn ? "Voucher Discount:" : "Ưu đãi Voucher (WOODEN10):"}{" "}
                    <strong className="text-[#3E5641]">-2.850.000 ₫</strong>
                  </p>
                  <p className="text-sm font-bold text-[#5C3A21]">
                    {isEn ? "Total Payable:" : "Tổng thanh toán:"}{" "}
                    <span className="text-base text-[#3E5641]">25.650.000 ₫</span>
                  </p>
                </div>
                <span className="px-4 py-2.5 rounded-xl bg-[#5C3A21] text-[#FAF6F0] text-xs font-semibold inline-flex items-center gap-1.5">
                  <span>{isEn ? "Proceed to Delivery" : "Tiếp tục điền thông tin"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BƯỚC 4: ĐIỀN THÔNG TIN NHẬN HÀNG & CHỌN PHƯƠNG THỨC THANH TOÁN  */}
        {/* =============================================================== */}
        <section
          id={steps[3].id}
          aria-labelledby="heading-buoc-4"
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Cột UI Mockup Card Bước 4 (Trái trên Desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              role="img"
              aria-label="Minh họa giao diện Bước 4: Điền họ tên, số điện thoại, địa chỉ nhận hàng và chọn thanh toán khi nhận hàng COD hoặc chuyển khoản"
              className="relative rounded-3xl bg-white border-2 border-[#A67B5B]/40 shadow-xl overflow-hidden p-4 sm:p-6"
            >
              {/* Thanh trình duyệt giả lập */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#A67B5B]/25">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E5641]" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/30 text-[11px] text-[#5C3A21]/80 font-mono truncate text-center">
                  Wooden Decor • {isEn ? "Shipping & Payment" : "Thông Tin Nhận Hàng & Thanh Toán"}
                </div>
                <span className="text-[11px] font-semibold text-[#3E5641] bg-[#3E5641]/10 px-2.5 py-0.5 rounded-full">
                  UI Step 4
                </span>
              </div>

              {/* Form điền thông tin mô phỏng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#A67B5B]/40">
                  <span className="block text-[10px] font-semibold uppercase text-[#A67B5B]">
                    {isEn ? "Full Name *" : "Họ và tên người nhận *"}
                  </span>
                  <span className="font-semibold text-[#5C3A21]">Nguyễn Minh Quân</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#A67B5B]/40">
                  <span className="block text-[10px] font-semibold uppercase text-[#A67B5B]">
                    {isEn ? "Phone / Zalo *" : "Số điện thoại (Zalo) *"}
                  </span>
                  <span className="font-semibold text-[#5C3A21]">0909 123 456</span>
                </div>
                <div className="sm:col-span-2 p-2.5 rounded-xl bg-[#FAF6F0] border border-[#A67B5B]/40 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A67B5B] shrink-0" />
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-[#A67B5B]">
                      {isEn ? "Delivery & Installation Address *" : "Địa chỉ giao & lắp đặt tận nơi *"}
                    </span>
                    <span className="font-semibold text-[#5C3A21]">
                      {isEn
                        ? "B12 Vinhomes Riverside, Long Bien, Hanoi (Deliver Saturday morning)"
                        : "Biệt thự B12 Vinhomes, Q. Long Biên, Hà Nội (Giao sáng Thứ 7)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chọn phương thức thanh toán: COD / Chuyển khoản */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-[#5C3A21]">
                  {isEn ? "Select Payment Method:" : "Chọn phương thức thanh toán:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#3E5641]/10 border-2 border-[#3E5641] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3E5641] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[#5C3A21]">
                        {isEn ? "Cash on Delivery (COD)" : "Thanh toán khi nhận hàng (COD)"}
                      </p>
                      <p className="text-[11px] text-[#5C3A21]/75 mt-0.5">
                        {isEn
                          ? "Inspect wood quality at home before paying"
                          : "Kiểm tra vân gỗ & nước sơn tại nhà trước khi thanh toán"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#A67B5B]/40 flex items-start gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#A67B5B] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[#5C3A21]">
                        {isEn ? "Bank Transfer (VietQR)" : "Chuyển khoản Ngân hàng (VietQR)"}
                      </p>
                      <p className="text-[11px] text-[#5C3A21]/75 mt-0.5">
                        {isEn
                          ? "24/7 QR code with instant confirmation"
                          : "Quét mã QR 24/7 xác nhận tự động trong 1 phút"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chú thích mũi tên SVG Bước 4 */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#A67B5B] text-[#FAF6F0] text-xs font-semibold shadow-md">
                  <svg
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M22 16C14 16 10 12 6 3M6 3L3 9M6 3L12 6"
                      stroke="#FAF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {isEn
                      ? "④ Choose COD or Bank Transfer, then click Confirm"
                      : "④ Chọn COD hoặc Chuyển khoản rồi bấm Xác nhận đặt hàng"}
                  </span>
                </div>

                <span className="px-4 py-2 rounded-xl bg-[#5C3A21] text-[#FAF6F0] text-xs font-semibold shadow-sm">
                  {isEn ? "Confirm Order" : "Hoàn tất đặt hàng"}
                </span>
              </div>
            </div>
          </div>

          {/* Cột hướng dẫn (Phải trên Desktop) */}
          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#5C3A21] text-[#FAF6F0] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                04
              </span>
              <span className="px-3 py-1 rounded-full bg-[#A67B5B]/20 text-[#5C3A21] text-xs font-semibold tracking-wide uppercase">
                {steps[3].badge}
              </span>
            </div>

            <h2
              id="heading-buoc-4"
              className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#5C3A21] leading-snug"
            >
              {steps[3].title}
            </h2>

            <p className="text-sm sm:text-base text-[#5C3A21]/85 leading-relaxed">
              {steps[3].summary}
            </p>

            <ul className="space-y-3 text-sm sm:text-[15px] text-[#5C3A21]">
              {steps[3].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-2xl bg-[#A67B5B]/15 border-l-4 border-[#A67B5B] text-xs sm:text-sm text-[#5C3A21] leading-relaxed">
              <strong className="text-[#5C3A21] font-semibold">
                {isEn ? "Workshop Inspection: " : "An tâm tuyệt đối: "}
              </strong>
              {steps[3].tip}
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BƯỚC 5: XÁC NHẬN ĐƠN HÀNG VÀ THEO DÕI TRẠNG THÁI GIAO HÀNG       */}
        {/* =============================================================== */}
        <section
          id={steps[4].id}
          aria-labelledby="heading-buoc-5"
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Cột hướng dẫn (Trái) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#3E5641] text-[#FAF6F0] font-serif font-bold text-base flex items-center justify-center shadow-sm">
                05
              </span>
              <span className="px-3 py-1 rounded-full bg-[#3E5641]/15 text-[#3E5641] text-xs font-semibold tracking-wide uppercase">
                {steps[4].badge}
              </span>
            </div>

            <h2
              id="heading-buoc-5"
              className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#5C3A21] leading-snug"
            >
              {steps[4].title}
            </h2>

            <p className="text-sm sm:text-base text-[#5C3A21]/85 leading-relaxed">
              {steps[4].summary}
            </p>

            <ul className="space-y-3 text-sm sm:text-[15px] text-[#5C3A21]">
              {steps[4].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E5641] text-[#FAF6F0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-2xl bg-[#3E5641]/10 border-l-4 border-[#3E5641] text-xs sm:text-sm text-[#5C3A21] leading-relaxed">
              <strong className="text-[#3E5641] font-semibold">
                {isEn ? "Photo Verification: " : "Nghiệm thu qua Zalo: "}
              </strong>
              {steps[4].tip}
            </div>
          </div>

          {/* Cột UI Mockup Card Bước 5 (Phải) */}
          <div className="lg:col-span-7">
            <div
              role="img"
              aria-label="Minh họa giao diện Bước 5: Xác nhận mã đơn hàng #WD-202689 và thanh tiến trình theo dõi trạng thái giao hàng 4 bước"
              className="relative rounded-3xl bg-white border-2 border-[#A67B5B]/40 shadow-xl overflow-hidden p-4 sm:p-6"
            >
              {/* Thanh trình duyệt giả lập */}
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#A67B5B]/25">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67B5B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E5641]" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/30 text-[11px] text-[#5C3A21]/80 font-mono truncate text-center">
                  Order Tracking • #WD-202689
                </div>
                <span className="text-[11px] font-semibold text-[#3E5641] bg-[#3E5641]/10 px-2.5 py-0.5 rounded-full">
                  UI Step 5
                </span>
              </div>

              {/* Banner xác nhận đơn thành công */}
              <div className="p-3.5 rounded-2xl bg-[#3E5641] text-[#FAF6F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <PackageCheck className="w-6 h-6 text-[#FAF6F0] shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold">
                      {isEn
                        ? "Order #WD-202689 Confirmed Successfully!"
                        : "Đặt hàng thành công • Mã đơn: #WD-202689"}
                    </p>
                    <p className="text-[11px] text-[#FAF6F0]/85">
                      {isEn
                        ? "5-Year Solid Wood Structural Warranty Activated"
                        : "Đã kích hoạt Bảo hành điện tử 5 năm kết cấu gỗ tự nhiên"}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-[#3E5641] text-[11px] font-bold">
                  {isEn ? "In Progress" : "Đang xử lý"}
                </span>
              </div>

              {/* Tiến trình 4 bước giao hàng */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    step: "1",
                    label: isEn ? "Order Confirmed" : "Đã xác nhận đơn",
                    sub: "10:15 AM",
                    done: true,
                  },
                  {
                    step: "2",
                    label: isEn ? "Wood QC & 3-Layer Pack" : "Kiểm định & Bọc 3 lớp",
                    sub: isEn ? "Completed" : "Đã gửi ảnh Zalo",
                    done: true,
                  },
                  {
                    step: "3",
                    label: isEn ? "In Transit" : "Xe xưởng đang giao",
                    sub: isEn ? "Active now" : "Đang trên đường",
                    done: true,
                  },
                  {
                    step: "4",
                    label: isEn ? "Installed & 5Y Warranty" : "Lắp đặt & Bảo hành",
                    sub: isEn ? "Upcoming" : "Đồng kiểm COD",
                    done: false,
                  },
                ].map((st) => (
                  <div
                    key={st.step}
                    className={`p-3 rounded-2xl border text-xs ${
                      st.done
                        ? "bg-[#FAF6F0] border-[#3E5641] text-[#5C3A21]"
                        : "bg-[#FAF6F0]/50 border-[#A67B5B]/35 text-[#5C3A21]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          st.done
                            ? "bg-[#3E5641] text-[#FAF6F0]"
                            : "bg-[#A67B5B]/30 text-[#5C3A21]"
                        }`}
                      >
                        {st.done ? "✓" : st.step}
                      </span>
                      <Truck className="w-3.5 h-3.5 text-[#A67B5B]" />
                    </div>
                    <p className="font-bold leading-snug">{st.label}</p>
                    <p className="text-[11px] text-[#3E5641] font-medium mt-0.5">
                      {st.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chú thích mũi tên SVG Bước 5 */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#A67B5B]/20">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#5C3A21] text-[#FAF6F0] text-xs font-semibold shadow-md">
                  <svg
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M22 15C14 15 10 11 6 3M6 3L3 9M6 3L12 6"
                      stroke="#FAF6F0"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {isEn
                      ? "⑤ Track live status or chat Zalo for dispatch photos"
                      : "⑤ Theo dõi tiến độ giao lắp & nhận video đóng gói qua Zalo"}
                  </span>
                </div>

                <span className="text-xs font-semibold text-[#3E5641] inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? "5-Year Warranty" : "Bảo hành 5 năm"}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* DẢI CAM KẾT DỊCH VỤ CỦA XƯỞNG WOODEN DECOR                      */}
        {/* =============================================================== */}
        <aside
          aria-label={isEn ? "Workshop Guarantees" : "Cam kết dịch vụ tại xưởng"}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-[#5C3A21] text-[#FAF6F0] shadow-lg"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#A67B5B] text-[#FAF6F0] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#FAF6F0]">
                {isEn ? "100% Natural Solid Timber" : "100% Gỗ Tự Nhiên Tuyển Chọn"}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1 leading-relaxed">
                {isEn
                  ? "Inspect raw unpainted timber at our workshop or check upon delivery before payment."
                  : "Cam kết đúng chủng loại gỗ Óc Chó, Gỗ Mun, Gõ Đỏ. Đồng kiểm tại nhà trước khi thanh toán."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#3E5641] text-[#FAF6F0] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#FAF6F0]">
                {isEn ? "Free 7-Day 1-for-1 Return" : "Đổi Trả 1-1 Trong 7 Ngày"}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1 leading-relaxed">
                {isEn
                  ? "100% free replacement if damaged in transit or not matching agreed specifications."
                  : "Đổi mới hoàn toàn miễn phí nếu sản phẩm trầy xước do vận chuyển hoặc sai thông số đặt hàng."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#A67B5B] text-[#FAF6F0] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#FAF6F0]">
                {isEn ? "5-Year Structural Warranty" : "Bảo Hành 5 Năm & Bảo Trì Trọn Đời"}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6F0]/80 mt-1 leading-relaxed">
                {isEn
                  ? "On-site warranty against warping or joinery issues, plus lifetime wood polishing."
                  : "Bảo hành kết cấu gỗ tự nhiên 5 năm tận nơi, hỗ trợ đánh bóng làm mới bề mặt trọn đời."}
              </p>
            </div>
          </div>
        </aside>

        {/* =============================================================== */}
        {/* MỤC CÂU HỎI THƯỜNG GẶP (FAQ) VỀ ĐỔI TRẢ & VẬN CHUYỂN             */}
        {/* =============================================================== */}
        <section
          id="cau-hoi-thuong-gap"
          aria-labelledby="heading-faq"
          className="scroll-mt-24 pt-4"
        >
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3E5641]/15 text-[#3E5641] text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isEn ? "Frequently Asked Questions" : "Giải Đáp Thắc Mắc Khách Hàng"}</span>
            </span>
            <h2
              id="heading-faq"
              className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#5C3A21]"
            >
              {isEn
                ? "Frequently Asked Questions (FAQ) on Shipping, Warranty & Returns"
                : "Câu Hỏi Thường Gặp (FAQ) Về Đổi Trả, Vận Chuyển & Bảo Hành"}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#5C3A21]/80">
              {isEn
                ? "Everything you need to know about ordering handcrafted wooden decor and solid wood furniture from our workshop."
                : "Tổng hợp các câu hỏi phổ biến nhất giúp quý khách hoàn toàn yên tâm khi đặt mua đồ decor gỗ và nội thất từ xưởng."}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3.5">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                open={idx === 0}
                className="group rounded-2xl bg-white border border-[#A67B5B]/35 open:border-[#5C3A21] shadow-xs transition-all overflow-hidden"
              >
                <summary className="cursor-pointer list-none px-5 sm:px-6 py-4 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-[#5C3A21] hover:bg-[#FAF6F0]/60 transition-colors">
                  <h3>{item.question}</h3>
                  <span className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-[#A67B5B]/40 text-[#5C3A21] group-open:bg-[#3E5641] group-open:text-[#FAF6F0] group-open:rotate-45 flex items-center justify-center text-base font-bold shrink-0 transition-all">
                    +
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-[15px] text-[#5C3A21]/85 leading-relaxed border-t border-[#A67B5B]/20">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* =============================================================== */}
        {/* CTA CUỐI TRANG: BẮT ĐẦU KHÁM PHÁ SẢN PHẨM HOẶC GỌI CHỦ XƯỞNG    */}
        {/* =============================================================== */}
        <section
          aria-labelledby="heading-cta-guide"
          className="rounded-3xl bg-gradient-to-r from-[#5C3A21] via-[#5C3A21] to-[#3E5641] text-[#FAF6F0] p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#A67B5B] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider">
              {siteConfig.brandName}
            </span>
            <h2
              id="heading-cta-guide"
              className="font-serif text-xl sm:text-3xl font-bold text-[#FAF6F0]"
            >
              {isEn
                ? "Ready to choose a handcrafted wood piece for your home?"
                : "Bạn đã sẵn sàng chọn tác phẩm gỗ ưng ý cho tổ ấm?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF6F0]/85 leading-relaxed">
              {isEn
                ? "Explore our catalog right now or connect directly with our workshop owner via Hotline/Zalo for personalized sizing and live showroom videos."
                : "Khám phá ngay bộ sưu tập đồ decor gỗ thủ công hoặc kết nối trực tiếp với Chủ xưởng qua Zalo/Hotline để nhận video quay thật và báo giá tại xưởng."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <Link
              href={`/${locale}/san-pham`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF6F0] text-[#5C3A21] hover:bg-[#A67B5B] hover:text-[#FAF6F0] text-sm font-bold transition-colors shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isEn ? "Explore Products Now" : "Khám phá Sản phẩm ngay"}
              </span>
            </Link>

            <a
              href={`https://zalo.me/${siteConfig.zalo.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#3E5641] border border-[#FAF6F0]/30 text-[#FAF6F0] hover:bg-[#A67B5B] text-sm font-semibold transition-colors"
            >
              <ZaloIcon className="w-4 h-4" />
              <span>Zalo: {siteConfig.zalo}</span>
            </a>

            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-[#FAF6F0]/40 text-[#FAF6F0] hover:bg-white/10 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{siteConfig.phone}</span>
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
