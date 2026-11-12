import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/client/CustomCursor";
import { SITE_URL } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const DEFAULT_TITLE = "Wooden Decor | Đồ Decor Gỗ Thủ Công & Nội Thất Tự Nhiên";
const DEFAULT_DESCRIPTION =
  "Xưởng chế tác đồ decor gỗ thủ công & nội thất gỗ tự nhiên nguyên khối cao cấp: sofa gỗ óc chó, bàn trà điêu khắc, giường ngủ và kệ gỗ nghệ thuật.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Wooden Decor",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "đồ decor gỗ thủ công",
    "nội thất gỗ tự nhiên",
    "Wooden Decor",
    "sofa gỗ óc chó",
    "bàn trà gỗ nguyên khối",
    "điêu khắc gỗ thủ công",
    "nội thất gỗ Thiên An",
  ],
  alternates: {
    canonical: `${SITE_URL}/vi`,
    languages: {
      "vi-VN": `${SITE_URL}/vi`,
      "en-US": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${SITE_URL}/vi`,
    siteName: "Wooden Decor",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/uploads/banners/hero-phong-khach-dang-song.webp`,
        width: 1200,
        height: 630,
        alt: "Wooden Decor - Đồ Decor Gỗ Thủ Công & Nội Thất Gỗ Tự Nhiên",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/uploads/banners/hero-phong-khach-dang-song.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/uploads/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${playfair.variable} ${beVietnam.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('wooden_decor_theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-wood-white text-wood-charcoal selection:bg-wood-light selection:text-wood-charcoal"
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
