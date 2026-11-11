import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu chuẩn theo Mục 4 URD (Tông trắng & nâu gỗ ấm)
        wood: {
          white: "#FFFFFF",       // Nền chính
          cream: "#F7F3EC",       // Nền phụ (kem nhạt)
          light: "#D9C2A3",       // Nâu gỗ nhạt (đường viền, nền khối)
          medium: "#A9784B",      // Nâu gỗ vừa (điểm nhấn, liên kết)
          dark: "#5B3A29",        // Nâu gỗ đậm (nút chính, tiêu đề)
          charcoal: "#2B2118",    // Chữ chính
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        DEFAULT: "300ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
