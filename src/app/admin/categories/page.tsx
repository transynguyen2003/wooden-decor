"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, AlertCircle, Check } from "lucide-react";

interface CategoryItem {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  imageUrl: string;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionVi, setDescriptionVi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Hộp thoại xóa danh mục còn sản phẩm (Mục 6.5 URD)
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [transferCategoryId, setTransferCategoryId] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNameVi("");
    setNameEn("");
    setDescriptionVi("");
    setDescriptionEn("");
    setImageUrl("");
    setSortOrder(categories.length + 1);
    setError("");
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setNameVi(cat.nameVi);
    setNameEn(cat.nameEn);
    setDescriptionVi(cat.descriptionVi);
    setDescriptionEn(cat.descriptionEn);
    setImageUrl(cat.imageUrl);
    setSortOrder(cat.sortOrder);
    setError("");
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("folder", "categories");
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
    const res = await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        nameVi,
        nameEn,
        descriptionVi,
        descriptionEn,
        imageUrl,
        sortOrder,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không thể lưu danh mục.");
      return;
    }

    setSuccessMsg(editingId ? "Đã cập nhật danh mục!" : "Đã thêm danh mục mới!");
    resetForm();
    fetchCategories();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setError("");

    const params = new URLSearchParams({ id: deleteTarget.id });
    if (deleteTarget._count.products > 0 && transferCategoryId) {
      params.set("transferTo", transferCategoryId);
    }

    const res = await fetch(`/api/admin/categories?${params.toString()}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không thể xóa danh mục.");
      return;
    }

    setDeleteTarget(null);
    setTransferCategoryId("");
    setSuccessMsg("Đã xóa danh mục thành công.");
    fetchCategories();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
          Quản Lý Danh Mục Sản Phẩm
        </h1>
        <p className="text-sm text-wood-charcoal/75 mt-1">
          Phân loại sản phẩm theo công năng (Sofa, Bàn trà, Kệ gỗ, Giường ngủ...). Mỗi sản phẩm thuộc một danh mục.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form thêm / sửa danh mục */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-4"
        >
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Tên danh mục (Tiếng Việt) *
            </label>
            <input
              type="text"
              required
              value={nameVi}
              onChange={(e) => setNameVi(e.target.value)}
              placeholder="VD: Sofa & Ghế Điêu Khắc"
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Tên danh mục (Tiếng Anh - có thể để trống)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="VD: Sculpted Sofas & Armchairs"
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Mô tả ngắn (Tiếng Việt)
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
              Mô tả ngắn (Tiếng Anh)
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
                Thứ tự hiển thị
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
                <span>{uploading ? "Đang nén WebP..." : "Chọn ảnh"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {imageUrl && (
            <div className="flex items-center gap-3 bg-wood-cream/60 p-2.5 rounded-xl border border-wood-light/50">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover"
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
              <span>{editingId ? "Lưu thay đổi" : "Thêm danh mục"}</span>
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

        {/* Bảng danh sách danh mục */}
        <div className="lg:col-span-7 bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm">
          {loading ? (
            <p className="text-sm text-wood-charcoal/70">Đang tải danh mục...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-wood-light/50 text-xs uppercase text-wood-charcoal/60">
                    <th className="py-3 pr-3">Thứ tự</th>
                    <th className="py-3 px-3">Ảnh</th>
                    <th className="py-3 px-3">Tên danh mục (VI / EN)</th>
                    <th className="py-3 px-3">Số SP</th>
                    <th className="py-3 pl-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wood-light/30">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-wood-cream/30">
                      <td className="py-3.5 pr-3 font-semibold text-wood-medium">
                        #{cat.sortOrder}
                      </td>
                      <td className="py-3.5 px-3">
                        <img
                          src={cat.imageUrl || "/uploads/logo/logo.webp"}
                          alt={cat.nameVi}
                          className="w-12 h-12 rounded-lg object-cover border border-wood-light/50"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-wood-dark">{cat.nameVi}</p>
                        <p className="text-xs text-wood-charcoal/65">
                          {cat.nameEn || "(Chưa nhập tiếng Anh - tự lấy tiếng Việt)"}
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block bg-wood-cream px-2.5 py-1 rounded-full text-xs font-semibold text-wood-dark">
                          {cat._count.products} SP
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-wood-cream hover:bg-wood-light/50 text-xs font-semibold text-wood-dark"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(cat);
                            const other = categories.find((c) => c.id !== cat.id);
                            setTransferCategoryId(other?.id || "");
                          }}
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

      {/* Hộp thoại xác nhận xóa & chuyển sản phẩm nếu danh mục còn sản phẩm (Mục 6.5 URD) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-wood-white rounded-2xl max-w-md w-full p-6 border border-wood-light shadow-xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-wood-dark">
              Xác nhận xóa danh mục &ldquo;{deleteTarget.nameVi}&rdquo;
            </h3>

            {deleteTarget._count.products > 0 ? (
              <div className="space-y-3 text-sm text-wood-charcoal/85">
                <p className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs font-medium">
                  Danh mục này đang chứa <strong>{deleteTarget._count.products} sản phẩm</strong>.
                  Để tránh mất sản phẩm, vui lòng chọn danh mục khác để chuyển các sản phẩm này sang trước khi xóa:
                </p>
                <select
                  value={transferCategoryId}
                  onChange={(e) => setTransferCategoryId(e.target.value)}
                  className="w-full rounded-xl bg-wood-cream border border-wood-light px-3.5 py-2.5 text-sm font-medium"
                >
                  {categories
                    .filter((c) => c.id !== deleteTarget.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Chuyển sang: {c.nameVi}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <p className="text-sm text-wood-charcoal/80">
                Danh mục này hiện chưa có sản phẩm nào. Bạn có chắc chắn muốn xóa không?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-wood-light text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
              >
                {deleteTarget._count.products > 0
                  ? "Chuyển sản phẩm & Xóa danh mục"
                  : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
