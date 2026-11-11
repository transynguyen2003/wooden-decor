"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload, Check, AlertCircle, X } from "lucide-react";

interface PostItem {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  contentVi: string;
  contentEn: string;
  coverImage: string;
  isPublished: boolean;
  publishedAt: string;
  products: Array<{ productId: string; product: { id: string; nameVi: string } }>;
}

interface ProductOption {
  id: string;
  nameVi: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptVi, setExcerptVi] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentVi, setContentVi] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [postRes, prodRes] = await Promise.all([
      fetch("/api/admin/posts"),
      fetch("/api/admin/products"),
    ]);
    const [postData, prodData] = await Promise.all([postRes.json(), prodRes.json()]);
    setPosts(postData.posts || []);
    setProducts(prodData.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setTitleVi("");
    setTitleEn("");
    setExcerptVi("");
    setExcerptEn("");
    setContentVi("");
    setContentEn("");
    setCoverImage("");
    setIsPublished(true);
    setSelectedProductIds([]);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (post: PostItem) => {
    setEditingId(post.id);
    setTitleVi(post.titleVi);
    setTitleEn(post.titleEn);
    setExcerptVi(post.excerptVi);
    setExcerptEn(post.excerptEn);
    setContentVi(post.contentVi);
    setContentEn(post.contentEn);
    setCoverImage(post.coverImage);
    setIsPublished(post.isPublished);
    setSelectedProductIds(post.products.map((p) => p.product.id));
    setError("");
    setFormOpen(true);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("folder", "posts");
      formData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.files?.[0]?.url) {
        setCoverImage(data.files[0].url);
      } else {
        setError(data.error || "Không thể tải ảnh bìa.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const method = editingId ? "PUT" : "POST";
    const res = await fetch("/api/admin/posts", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        titleVi,
        titleEn,
        excerptVi,
        excerptEn,
        contentVi,
        contentEn,
        coverImage,
        isPublished,
        productIds: selectedProductIds,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không thể lưu bài viết.");
      return;
    }

    setSuccessMsg(
      editingId ? "Đã cập nhật bài đăng!" : "Đã đăng bài viết mới thành công!"
    );
    setFormOpen(false);
    fetchAll();
  };

  const handleDelete = async (post: PostItem) => {
    if (!window.confirm(`Xóa bài viết "${post.titleVi}"?`)) return;
    const res = await fetch(`/api/admin/posts?id=${post.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccessMsg("Đã xóa bài viết.");
      fetchAll();
    }
  };

  const toggleProduct = (pid: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            Bài Đăng Cảm Hứng & Nhật Ký Xưởng Hằng Ngày
          </h1>
          <p className="text-sm text-wood-charcoal/75 mt-1">
            Đăng bài viết giới thiệu lô gỗ mới, cảm hứng bài trí phòng khách và gắn kèm sản phẩm liên quan (Mục 15.4 URD).
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Viết bài đăng mới</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-wood-white rounded-2xl border border-wood-light/60 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-wood-charcoal/70">Đang tải bài viết...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-wood-cream/60 border-b border-wood-light/50 text-xs uppercase text-wood-charcoal/70">
                  <th className="py-3.5 px-4">Ảnh bìa</th>
                  <th className="py-3.5 px-4">Tiêu đề bài viết</th>
                  <th className="py-3.5 px-4">SP gắn kèm</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wood-light/30">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-wood-cream/30">
                    <td className="py-3.5 px-4">
                      <img
                        src={post.coverImage || "/uploads/logo/logo.webp"}
                        alt={post.titleVi}
                        className="w-16 h-12 rounded-lg object-cover border border-wood-light/50"
                      />
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <p className="font-semibold text-wood-dark line-clamp-1">
                        {post.titleVi}
                      </p>
                      <p className="text-xs text-wood-charcoal/60 line-clamp-1">
                        {post.titleEn || "(Chưa nhập tiếng Anh - tự lấy tiếng Việt)"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="bg-wood-cream px-2.5 py-1 rounded-full font-semibold text-wood-dark">
                        {post.products.length} sản phẩm
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          post.isPublished
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {post.isPublished ? "Đã đăng" : "Lưu nháp"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(post)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-wood-cream hover:bg-wood-light/50 text-xs font-semibold text-wood-dark"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
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

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-start justify-center">
          <div className="bg-wood-white rounded-3xl max-w-3xl w-full my-8 p-6 sm:p-8 border border-wood-light shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-wood-light/50 pb-4">
              <h2 className="font-serif text-2xl font-bold text-wood-dark">
                {editingId ? "Chỉnh Sửa Bài Đăng" : "Viết Bài Đăng Hằng Ngày"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-2 rounded-full hover:bg-wood-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tiêu đề bài viết (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tiêu đề bài viết (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tóm tắt ngắn (Tiếng Việt)
                  </label>
                  <textarea
                    rows={2}
                    value={excerptVi}
                    onChange={(e) => setExcerptVi(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tóm tắt ngắn (Tiếng Anh)
                  </label>
                  <textarea
                    rows={2}
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Nội dung chi tiết (Tiếng Việt)
                  </label>
                  <textarea
                    rows={5}
                    value={contentVi}
                    onChange={(e) => setContentVi(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Nội dung chi tiết (Tiếng Anh)
                  </label>
                  <textarea
                    rows={5}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 bg-wood-cream/40 p-4 rounded-xl border border-wood-light/50">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-wood-dark text-white px-4 py-2 rounded-xl text-xs font-semibold">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? "Đang tải..." : "Chọn ảnh bìa bài viết"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-16 h-12 rounded-lg object-cover border border-wood-light"
                    />
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-wood-dark"
                  />
                  <span>Đăng công khai ngay (Bỏ tích = Lưu nháp)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-2">
                  Gắn sản phẩm liên quan trong bài viết:
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-wood-cream/40 border border-wood-light/50">
                  {products.map((prod) => {
                    const active = selectedProductIds.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => toggleProduct(prod.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? "bg-wood-dark text-white border-wood-dark"
                            : "bg-wood-white text-wood-charcoal border-wood-light"
                        }`}
                      >
                        {active ? "✓ " : "+ "}
                        {prod.nameVi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-wood-light/50">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-wood-light text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
