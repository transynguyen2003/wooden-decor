import React from "react";
import VideoManagerCard from "@/components/admin/VideoManagerCard";

export default function AdminVideosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
          Quản Lý Video Xưởng & Thực Tế
        </h1>
        <p className="text-sm text-wood-charcoal/75 mt-1">
          Thêm video mới từ máy tính / điện thoại, chỉnh sửa tiêu đề, tạm ẩn hoặc xóa các video hiển thị trên website.
        </p>
      </div>

      <VideoManagerCard />
    </div>
  );
}
