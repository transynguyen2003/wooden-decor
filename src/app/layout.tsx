import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/client/CustomCursor";

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

export const metadata: Metadata = {
  title: {
    default: "Wooden Decor | Nội Thất Gỗ Tự Nhiên Điêu Khắc Thủ Công",
    template: "%s | Wooden Decor",
  },
  description:
    "Showroom & Xưởng chế tác nội thất gỗ tự nhiên cao cấp: Sofa gỗ óc chó, bàn trà điêu khắc, giường gỗ nguyên khối, kệ trang trí nghệ thuật.",
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
