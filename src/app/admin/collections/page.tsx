"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, AlertCircle, Check } from "lucide-react";

interface CollectionItem {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  imageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionVi, setDescriptionVi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCollections = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/collections");
    const data = await res.json();
    setCollections(data.collections || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNameVi("");
    setNameEn("");
    setDescriptionVi("");
    setDescriptionEn("");
    setImageUrl("");
    setIsFeatured(true);
    setSortOrder(collections.length + 1);
    setError("");
  };

  const handleEdit = (col: CollectionItem) => {
    setEditingId(col.id);
    setNameVi(col.nameVi);
    setNameEn(col.nameEn);
    setDescriptionVi(col.descriptionVi);
    setDescriptionEn(col.descriptionEn);
    setImageUrl(col.imageUrl);
    setIsFeatured(col.isFeatured);
    setSortOrder(col.sortOrder);
    setError("");
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("folder", "collections");
      formData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lỗi tải ảnh.");
      } else if (data.files?.[0]?.url) {
        setImageUrl(data.files[0].url);
      }
    } catch {
      setError("Không thể tải ảnh lên.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const method = editingId ? "PUT" : "POST";
    const res = await fetch("/api/admin/collections", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        nameVi,
        nameEn,
        descriptionVi,
        descriptionEn,
        imageUrl,
        isFeatured,
        sortOrder,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không thể lưu bộ sưu tập.");
      return;
    }

    setSuccessMsg(editingId ? "Đã cập nhật bộ sưu tập!" : "Đã thêm bộ sưu tập mới!");
    resetForm();
    fetchCollections();
  };

  const handleDelete = async (col: CollectionItem) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bộ sưu tập "${col.nameVi}" không?`)) {
      return;
    }
    const res = await fetch(`/api/admin/collections?id=${col.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccessMsg("Đã xóa bộ sưu tập.");
      fetchCollections();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
          Quản Lý Bộ Sưu Tập Không Gian
        </h1>
        <p className="text-sm text-wood-charcoal/75 mt-1">
          Nhóm sản phẩm theo phong cách hoặc không gian (VD: Phòng khách tối giản). Một sản phẩm có thể thuộc nhiều bộ sưu tập.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-4"
        >
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            {editingId ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập mới"}
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Tên bộ sưu tập (Tiếng Việt) *
            </label>
            <input
              type="text"
              required
              value={nameVi}
              onChange={(e) => setNameVi(e.target.value)}
              placeholder="VD: Phòng Khách Đường Cong Đương Đại"
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Tên bộ sưu tập (Tiếng Anh)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="VD: Sculptural Curves Living"
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Mô tả (Tiếng Việt)
            </label>
            <textarea
              rows={2}
              value={descriptionVi}
              onChange={(e) => setDescriptionVi(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Mô tả (Tiếng Anh)
            </label>
            <textarea
              rows={2}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Thứ tự
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Ảnh đại diện
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "Đang nén..." : "Chọn ảnh"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium text-wood-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-wood-dark"
            />
            <span>Hiển thị nổi bật trên Trang chủ</span>
          </label>

          {imageUrl && (
            <div className="flex items-center gap-3 bg-wood-cream/60 p-2.5 rounded-xl border border-wood-light/50">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-16 h-12 rounded-lg object-cover"
              />
              <span className="text-xs text-wood-charcoal/70 truncate flex-1">
                {imageUrl}
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? "Lưu thay đổi" : "Thêm bộ sưu tập"}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 rounded-xl border border-wood-light text-xs font-semibold text-wood-charcoal hover:bg-wood-cream"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-7 bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm">
          {loading ? (
            <p className="text-sm text-wood-charcoal/70">Đang tải bộ sưu tập...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-wood-light/50 text-xs uppercase text-wood-charcoal/60">
                    <th className="py-3 pr-3">Thứ tự</th>
                    <th className="py-3 px-3">Ảnh</th>
                    <th className="py-3 px-3">Tên bộ sưu tập</th>
                    <th className="py-3 px-3">Số SP</th>
                    <th className="py-3 pl-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wood-light/30">
                  {collections.map((col) => (
                    <tr key={col.id} className="hover:bg-wood-cream/30">
                      <td className="py-3.5 pr-3 font-semibold text-wood-medium">
                        #{col.sortOrder}
                      </td>
                      <td className="py-3.5 px-3">
                        <img
                          src={col.imageUrl || "/uploads/logo/logo.webp"}
                          alt={col.nameVi}
                          className="w-14 h-10 rounded-lg object-cover border border-wood-light/50"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-wood-dark">{col.nameVi}</p>
                        <p className="text-xs text-wood-charcoal/65">{col.nameEn}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block bg-wood-cream px-2.5 py-1 rounded-full text-xs font-semibold text-wood-dark">
                          {col._count.products} SP
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(col)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-wood-cream hover:bg-wood-light/50 text-xs font-semibold text-wood-dark"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(col)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
