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
    // Giảm số trang build song song để không làm cạn kết nối Database
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 3,
    // Giữ cache trang đã tải ở trình duyệt để chuyển qua lại giữa các trang tức thì (0ms delay)
    staleTimes: {
      dynamic: 120,
      static: 300,
    },
    // Tối ưu tốc độ biên dịch thư viện icon khi chuyển trang
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [
      {
        source: "/huong-dan-mua-hang",
        destination: "/vi/huong-dan-mua-hang",
      },
      {
        source: "/san-pham",
        destination: "/vi/san-pham",
      },
      {
        source: "/bo-suu-tap",
        destination: "/vi/bo-suu-tap",
      },
      {
        source: "/cam-hung",
        destination: "/vi/cam-hung",
      },
      {
        source: "/gioi-thieu",
        destination: "/vi/gioi-thieu",
      },
      {
        source: "/lien-he",
        destination: "/vi/lien-he",
      },
    ];
  },
};

export default nextConfig;
