import React from "react";
import Link from "next/link";
import {
  Package,
  EyeOff,
  MessageSquareText,
  PlusCircle,
  ArrowRight,
  FolderTree,
  FileText,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Mục 6.2 URD: Trang Tổng quan (Dashboard)
 * - Tổng số sản phẩm, số sản phẩm đang ẩn, số yêu cầu mới của khách
 * - Lối tắt: thêm sản phẩm mới, xem yêu cầu mới
 */
export default async function AdminDashboardPage() {
  const [
    totalProducts,
    hiddenProducts,
    newInquiriesCount,
    totalCategories,
    totalPosts,
    recentInquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isVisible: false } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.category.count(),
    prisma.post.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Tiêu đề & Lối tắt nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-wood-white p-6 rounded-2xl border border-wood-light/60 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            Xin chào Chủ cửa hàng!
          </h1>
          <p className="text-sm text-wood-charcoal/75 mt-1">
            Bảng điều khiển quản lý sản phẩm, hình ảnh và yêu cầu tư vấn của khách hàng.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Thêm sản phẩm mới</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-2 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <MessageSquareText className="w-4 h-4 text-wood-medium" />
            <span>Xem yêu cầu mới ({newInquiriesCount})</span>
          </Link>
        </div>
      </div>

      {/* Các thẻ thống kê chính (Mục 6.2 URD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-wood-white p-5 rounded-2xl border border-wood-light/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-wood-medium">
            <span className="text-xs font-semibold uppercase">Tổng sản phẩm</span>
            <Package className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-wood-dark">{totalProducts}</p>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs font-medium text-wood-medium hover:text-wood-dark"
          >
            <span>Quản lý sản phẩm</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-wood-white p-5 rounded-2xl border border-wood-light/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase">Đang tạm ẩn</span>
            <EyeOff className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-wood-charcoal">{hiddenProducts}</p>
          <Link
            href="/admin/products?visibility=hidden"
            className="inline-flex items-center gap-1 text-xs font-medium text-wood-medium hover:text-wood-dark"
          >
            <span>Xem sản phẩm ẩn</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-amber-50/90 p-5 rounded-2xl border border-amber-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold uppercase">Yêu cầu tư vấn mới</span>
            <MessageSquareText className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-amber-900">{newInquiriesCount}</p>
          <Link
            href="/admin/inquiries?status=NEW"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline"
          >
            <span>Xử lý ngay</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-wood-white p-5 rounded-2xl border border-wood-light/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-wood-medium">
            <span className="text-xs font-semibold uppercase">Danh mục</span>
            <FolderTree className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-wood-dark">{totalCategories}</p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1 text-xs font-medium text-wood-medium hover:text-wood-dark"
          >
            <span>Quản lý danh mục</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-wood-white p-5 rounded-2xl border border-wood-light/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-wood-medium">
            <span className="text-xs font-semibold uppercase">Bài đăng Cảm hứng</span>
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-wood-dark">{totalPosts}</p>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1 text-xs font-medium text-wood-medium hover:text-wood-dark"
          >
            <span>Đăng bài mới</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Danh sách yêu cầu tư vấn gần nhất */}
      <div className="bg-wood-white rounded-2xl border border-wood-light/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            Yêu cầu tư vấn mới nhất từ khách hàng
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-wood-medium hover:text-wood-dark"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-wood-light/50 text-xs uppercase text-wood-charcoal/60">
                <th className="py-3 pr-4">Khách hàng</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Sản phẩm quan tâm</th>
                <th className="py-3 px-4">Lời nhắn</th>
                <th className="py-3 pl-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wood-light/30">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-wood-cream/40">
                  <td className="py-3.5 pr-4 font-semibold text-wood-dark">
                    {inq.customerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 font-medium text-wood-medium hover:text-wood-dark"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {inq.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {inq.product ? inq.product.nameVi : "Tư vấn chung"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-wood-charcoal/80 max-w-xs truncate">
                    {inq.message}
                  </td>
                  <td className="py-3.5 pl-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                        inq.status === "NEW"
                          ? "bg-amber-100 text-amber-900"
                          : inq.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {inq.status === "NEW"
                        ? "Mới"
                        : inq.status === "CONTACTED"
                        ? "Đã liên hệ"
                        : "Hoàn tất"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
