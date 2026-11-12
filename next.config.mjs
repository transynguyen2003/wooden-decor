/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Giữ cache trang đã tải ở trình duyệt để chuyển qua lại giữa các trang tức thì (0ms delay)
    staleTimes: {
      dynamic: 120,
      static: 300,
    },
    // Tối ưu tốc độ biên dịch thư viện icon khi chuyển trang
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
