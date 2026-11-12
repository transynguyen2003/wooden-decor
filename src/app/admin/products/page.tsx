"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Upload,
  Star,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Search,
  Percent,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

interface ProductImageForm {
  url: string;
  altVi: string;
  altEn: string;
  sortOrder: number;
  isCover: boolean;
}

interface CategoryOption {
  id: string;
  nameVi: string;
}

interface CollectionOption {
  id: string;
  nameVi: string;
}

interface AdminProductItem {
  id: string;
  slug: string;
  categoryId: string;
  category: { id: string; nameVi: string };
  nameVi: string;
  nameEn: string;
  price: number | null;
  isContactPrice: boolean;
  priceNoteVi: string;
  priceNoteEn: string;
  materialVi: string;
  materialEn: string;
  dimensionsVi: string;
  dimensionsEn: string;
  descriptionVi: string;
  descriptionEn: string;
  stockStatus: string;
  isVisible: boolean;
  isFeatured: boolean;
  images: ProductImageForm[];
  collections: Array<{ collectionId: string; collection: { id: string; nameVi: string } }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Tìm kiếm & lọc trên bảng danh sách
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCatId, setFilterCatId] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all");

  // Sửa giá nhanh ngay trên danh sách (Mục 15.3 & 15.6 URD)
  const [quickPrices, setQuickPrices] = useState<Record<string, string>>({});
  const [savingQuickId, setSavingQuickId] = useState<string | null>(null);

  // Điều chỉnh giá hàng loạt theo % (Mục 15.3 URD)
  const [bulkPercent, setBulkPercent] = useState("5");
  const [bulkCategoryId, setBulkCategoryId] = useState("");

  // Hộp thoại xác nhận xóa sản phẩm (Mục 6.3 URD)
  const [deleteTarget, setDeleteTarget] = useState<AdminProductItem | null>(null);

  // Form thêm / sửa sản phẩm
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [isContactPrice, setIsContactPrice] = useState(false);
  const [priceNoteVi, setPriceNoteVi] = useState("");
  const [priceNoteEn, setPriceNoteEn] = useState("");
  const [materialVi, setMaterialVi] = useState("");
  const [materialEn, setMaterialEn] = useState("");
  const [dimensionsVi, setDimensionsVi] = useState("");
  const [dimensionsEn, setDimensionsEn] = useState("");
  const [descriptionVi, setDescriptionVi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [stockStatus, setStockStatus] = useState("IN_STOCK");
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<ProductImageForm[]>([]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, colRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/collections", { cache: "no-store" }),
      ]);
      const [prodData, catData, colData] = await Promise.all([
        prodRes.json().catch(() => ({})),
        catRes.json().catch(() => ({})),
        colRes.json().catch(() => ({})),
      ]);

      const prods: AdminProductItem[] = prodData.products || [];
      setProducts(prods);
      setCategories(catData.categories || []);
      setCollections(colData.collections || []);

      const priceMap: Record<string, string> = {};
      for (const p of prods) {
        priceMap[p.id] = p.isContactPrice || !p.price ? "" : String(p.price);
      }
      setQuickPrices(priceMap);

      if (!categoryId && catData.categories?.[0]?.id) {
        setCategoryId(catData.categories[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch admin products data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openNewForm = () => {
    setEditingId(null);
    setNameVi("");
    setNameEn("");
    setCategoryId(categories[0]?.id || "");
    setSelectedCollectionIds([]);
    setPrice("");
    setIsContactPrice(false);
    setPriceNoteVi("");
    setPriceNoteEn("");
    setMaterialVi("");
    setMaterialEn("");
    setDimensionsVi("");
    setDimensionsEn("");
    setDescriptionVi("");
    setDescriptionEn("");
    setStockStatus("IN_STOCK");
    setIsVisible(true);
    setIsFeatured(false);
    setImages([]);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (p: AdminProductItem) => {
    setEditingId(p.id);
    setNameVi(p.nameVi);
    setNameEn(p.nameEn);
    setCategoryId(p.categoryId);
    setSelectedCollectionIds(p.collections.map((c) => c.collectionId));
    setPrice(p.price ? String(p.price) : "");
    setIsContactPrice(p.isContactPrice);
    setPriceNoteVi(p.priceNoteVi || "");
    setPriceNoteEn(p.priceNoteEn || "");
    setMaterialVi(p.materialVi || "");
    setMaterialEn(p.materialEn || "");
    setDimensionsVi(p.dimensionsVi || "");
    setDimensionsEn(p.dimensionsEn || "");
    setDescriptionVi(p.descriptionVi || "");
    setDescriptionEn(p.descriptionEn || "");
    setStockStatus(p.stockStatus);
    setIsVisible(p.isVisible);
    setIsFeatured(p.isFeatured);
    setImages(
      p.images.map((img, i) => ({
        url: img.url,
        altVi: img.altVi || "",
        altEn: img.altEn || "",
        sortOrder: i + 1,
        isCover: img.isCover,
      }))
    );
    setError("");
    setFormOpen(true);
  };

  // Tải nhiều ảnh cùng lúc (Kéo thả hoặc chọn file - Mục 6.4 URD)
  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("folder", "products");
      Array.from(fileList).forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể tải ảnh lên.");
      } else if (Array.isArray(data.files)) {
        const newImgs: ProductImageForm[] = data.files.map(
          (f: { url: string }, idx: number) => ({
            url: f.url,
            altVi: nameVi || "Ảnh sản phẩm Wooden Decor",
            altEn: nameEn || "",
            sortOrder: images.length + idx + 1,
            isCover: images.length === 0 && idx === 0,
          })
        );
        setImages((prev) => [...prev, ...newImgs]);
      }
    } catch {
      setError("Lỗi khi tải ảnh lên.");
    } finally {
      setUploading(false);
    }
  };

  const setCoverImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isCover: idx === index,
      }))
    );
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setImages(next.map((img, i) => ({ ...img, sortOrder: i + 1 })));
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((i) => i.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const method = editingId ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        nameVi,
        nameEn,
        categoryId,
        collectionIds: selectedCollectionIds,
        price: isContactPrice ? null : Number(price),
        isContactPrice,
        priceNoteVi,
        priceNoteEn,
        materialVi,
        materialEn,
        dimensionsVi,
        dimensionsEn,
        descriptionVi,
        descriptionEn,
        stockStatus,
        isVisible,
        isFeatured,
        images,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không thể lưu sản phẩm.");
      return;
    }

    setSuccessMsg(
      editingId
        ? "Đã cập nhật sản phẩm thành công!"
        : "Đã thêm sản phẩm mới thành công!"
    );
    setFormOpen(false);
    fetchAll();
  };

  // Sửa giá nhanh ngay trên danh sách (Mục 15.3 & 15.6 URD)
  const handleQuickPriceSave = async (product: AdminProductItem) => {
    setSavingQuickId(product.id);
    setSuccessMsg("");
    const rawVal = (quickPrices[product.id] || "").replace(/\D/g, "");
    const numericVal = rawVal ? Number(rawVal) : 0;

    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        action: "quick_update",
        price: numericVal,
        isContactPrice: numericVal <= 0,
      }),
    });

    if (res.ok) {
      setSuccessMsg(`Đã cập nhật nhanh giá cho "${product.nameVi}"!`);
      await fetchAll();
    }
    setSavingQuickId(null);
  };

  // Bật / Tắt hiển thị nhanh trên danh sách
  const handleToggleVisibility = async (product: AdminProductItem) => {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        action: "quick_update",
        isVisible: !product.isVisible,
      }),
    });
    fetchAll();
  };

  // Nhân bản sản phẩm (Mục 6.3 & 15.4 URD)
  const handleDuplicate = async (product: AdminProductItem) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "duplicate",
        productId: product.id,
      }),
    });
    if (res.ok) {
      setSuccessMsg(
        `Đã nhân bản "${product.nameVi}" (ở trạng thái Ẩn/Nháp để bạn chỉnh sửa trước khi hiện).`
      );
      fetchAll();
    }
  };

  // Điều chỉnh giá hàng loạt theo % (Mục 15.3 URD)
  const handleBulkPriceAdjust = async () => {
    const pct = Number(bulkPercent);
    if (isNaN(pct) || pct === 0) return;
    if (
      !window.confirm(
        `Bạn có chắc muốn điều chỉnh giá ${pct > 0 ? `+${pct}%` : `${pct}%`} cho ${
          bulkCategoryId ? "danh mục đã chọn" : "tất cả sản phẩm có giá niêm yết"
        } không?`
      )
    ) {
      return;
    }

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bulk_price",
        percent: pct,
        categoryId: bulkCategoryId,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccessMsg(`Đã cập nhật giá hàng loạt cho ${data.updatedCount} sản phẩm!`);
      fetchAll();
    }
  };

  // Xóa sản phẩm sau khi xác nhận hộp thoại (Mục 6.3 URD)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccessMsg(`Đã xóa sản phẩm "${deleteTarget.nameVi}".`);
      setDeleteTarget(null);
      fetchAll();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterCatId && p.categoryId !== filterCatId) return false;
    if (filterVisibility === "visible" && !p.isVisible) return false;
    if (filterVisibility === "hidden" && p.isVisible) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.nameVi.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleCollectionCheckbox = (cid: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút Thêm sản phẩm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            Quản Lý Sản Phẩm & Hình Ảnh
          </h1>
          <p className="text-sm text-wood-charcoal/75 mt-1">
            Sửa giá nhanh ngay trên bảng, nhân bản sản phẩm chỉ với 1 bấm, và kéo-thả nhiều ảnh tự động nén WebP.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm sản phẩm mới</span>
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Thanh công cụ Tìm kiếm, Lọc & Điều chỉnh giá hàng loạt theo % */}
      <div className="bg-wood-white rounded-2xl p-5 border border-wood-light/60 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-wood-medium absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light pl-10 pr-4 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={filterCatId}
              onChange={(e) => setFilterCatId(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameVi}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="visible">Đang hiển thị trên web</option>
              <option value="hidden">Đang tạm ẩn / Lưu nháp</option>
            </select>
          </div>
        </div>

        {/* Hàng điều chỉnh giá hàng loạt (Mục 15.3 URD) */}
        <div className="pt-3 border-t border-wood-light/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-wood-dark inline-flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-wood-medium" />
              Sửa giá hàng loạt theo %:
            </span>
            <select
              value={bulkCategoryId}
              onChange={(e) => setBulkCategoryId(e.target.value)}
              className="rounded-lg bg-wood-cream border border-wood-light px-2.5 py-1.5"
            >
              <option value="">Toàn bộ danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  Chỉ danh mục: {c.nameVi}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={bulkPercent}
                onChange={(e) => setBulkPercent(e.target.value)}
                className="w-16 rounded-lg bg-wood-cream border border-wood-light px-2 py-1.5 text-center font-semibold"
              />
              <span>% (VD: 5 hoặc -5)</span>
            </div>
            <button
              type="button"
              onClick={handleBulkPriceAdjust}
              className="bg-wood-medium hover:bg-wood-dark text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Áp dụng hàng loạt
            </button>
          </div>

          <span className="text-wood-charcoal/65">
            Đang hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
          </span>
        </div>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="bg-wood-white rounded-2xl border border-wood-light/60 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-wood-charcoal/70">Đang tải danh sách sản phẩm...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-wood-cream/60 border-b border-wood-light/50 text-xs uppercase text-wood-charcoal/70">
                  <th className="py-3.5 px-4">Ảnh bìa</th>
                  <th className="py-3.5 px-4">Tên sản phẩm & Danh mục</th>
                  <th className="py-3.5 px-4">Sửa giá nhanh (VND)</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wood-light/30">
                {filteredProducts.map((p) => {
                  const cover =
                    p.images.find((i) => i.isCover)?.url ||
                    p.images[0]?.url ||
                    "/uploads/logo/logo.webp";

                  return (
                    <tr key={p.id} className="hover:bg-wood-cream/30">
                      <td className="py-3.5 px-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-wood-light/50 bg-wood-cream">
                          <img
                            src={cover}
                            alt={p.nameVi}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[10px] px-1 rounded">
                            {p.images.length} ảnh
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-wood-dark line-clamp-1">
                          {p.nameVi}
                        </p>
                        <p className="text-xs text-wood-charcoal/60 line-clamp-1">
                          {p.nameEn || "(Chưa nhập tiếng Anh - tự lấy tiếng Việt)"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[11px] bg-wood-cream text-wood-medium font-medium px-2 py-0.5 rounded">
                            {p.category?.nameVi}
                          </span>
                          {p.isFeatured && (
                            <span className="text-[11px] bg-amber-100 text-amber-900 font-medium px-2 py-0.5 rounded">
                              ★ Nổi bật trang chủ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Ô sửa giá nhanh ngay trên danh sách (Mục 15.3 & 15.6 URD) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={quickPrices[p.id] ?? ""}
                            onChange={(e) =>
                              setQuickPrices((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            placeholder="Để trống = Liên hệ"
                            className="w-32 rounded-lg bg-wood-cream/70 border border-wood-light px-2.5 py-1.5 text-xs font-semibold text-wood-dark focus:outline-none focus:border-wood-dark"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickPriceSave(p)}
                            disabled={savingQuickId === p.id}
                            className="px-2.5 py-1.5 rounded-lg bg-wood-dark hover:bg-wood-medium text-white text-xs font-semibold"
                          >
                            {savingQuickId === p.id ? "..." : "Lưu"}
                          </button>
                        </div>
                        <span className="text-[11px] text-wood-charcoal/60 block mt-1">
                          Hiện tại:{" "}
                          {p.isContactPrice || !p.price
                            ? "Liên hệ báo giá"
                            : `${p.price.toLocaleString("vi-VN")} ₫`}
                        </span>
                      </td>

                      {/* Trạng thái Hiển thị / Ẩn & Kho hàng */}
                      <td className="py-3.5 px-4 space-y-1">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(p)}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            p.isVisible
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {p.isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" /> Đang hiện
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> Đang ẩn
                            </>
                          )}
                        </button>
                        <span className="block text-[11px] text-wood-charcoal/70">
                          {p.stockStatus === "IN_STOCK" ? "Còn hàng" : "Tạm hết hàng"}
                        </span>
                      </td>

                      {/* Nút Sửa, Nhân bản, Xóa */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditForm(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-wood-cream hover:bg-wood-light/50 text-xs font-semibold text-wood-dark"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Sửa & Ảnh</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          title="Nhân bản sản phẩm này"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Nhân bản</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hộp thoại Thêm / Sửa Sản phẩm & Quản lý Hình ảnh (Modal) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-start justify-center">
          <div className="bg-wood-white rounded-3xl max-w-4xl w-full my-8 p-6 sm:p-8 border border-wood-light shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-wood-light/50 pb-4">
              <h2 className="font-serif text-2xl font-bold text-wood-dark">
                {editingId ? "Chỉnh Sửa Sản Phẩm & Hình Ảnh" : "Thêm Sản Phẩm Mới"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-2 rounded-full hover:bg-wood-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* 1. Tên sản phẩm 2 ngôn ngữ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tên sản phẩm (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    placeholder="VD: Sofa Gỗ Óc Chó Đường Cong Vô Cực"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tên sản phẩm (Tiếng Anh - có thể để trống)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="VD: Infinity Curve Walnut Sofa"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* 2. Danh mục & Giá bán */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Danh mục chính *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameVi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Giá bán niêm yết (VND)
                  </label>
                  <input
                    type="number"
                    disabled={isContactPrice}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="VD: 54000000"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm disabled:opacity-50"
                  />
                </div>

                <label className="flex items-center gap-2.5 pb-2.5 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isContactPrice}
                    onChange={(e) => setIsContactPrice(e.target.checked)}
                    className="w-4 h-4 accent-wood-dark"
                  />
                  <span>Đặt theo yêu cầu (&ldquo;Liên hệ&rdquo;)</span>
                </label>
              </div>

              {/* 3. Chọn nhiều Bộ sưu tập (Mục 15.2 URD) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-2">
                  Thuộc các Bộ sưu tập (có thể chọn nhiều):
                </label>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => {
                    const checked = selectedCollectionIds.includes(col.id);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => toggleCollectionCheckbox(col.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          checked
                            ? "bg-wood-dark text-white border-wood-dark"
                            : "bg-wood-cream text-wood-charcoal border-wood-light"
                        }`}
                      >
                        {checked ? "✓ " : "+ "}
                        {col.nameVi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Chất liệu & Kích thước (2 ngôn ngữ) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Chất liệu (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={materialVi}
                    onChange={(e) => setMaterialVi(e.target.value)}
                    placeholder="VD: Gỗ Óc Chó Bắc Mỹ, Da bò Ý"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Chất liệu (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={materialEn}
                    onChange={(e) => setMaterialEn(e.target.value)}
                    placeholder="VD: North American Walnut, Italian Leather"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Kích thước (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={dimensionsVi}
                    onChange={(e) => setDimensionsVi(e.target.value)}
                    placeholder="VD: Dài 240 cm × Sâu 95 cm × Cao 82 cm"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Kích thước (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={dimensionsEn}
                    onChange={(e) => setDimensionsEn(e.target.value)}
                    placeholder="VD: L 240 cm × D 95 cm × H 82 cm"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Ghi chú giá / Bảo hành (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={priceNoteVi}
                    onChange={(e) => setPriceNoteVi(e.target.value)}
                    placeholder="VD: Đã bao gồm đệm da bò Ý"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Ghi chú giá / Bảo hành (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={priceNoteEn}
                    onChange={(e) => setPriceNoteEn(e.target.value)}
                    placeholder="VD: Includes Italian leather cushions"
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              {/* 5. Mô tả chi tiết (2 ngôn ngữ) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Mô tả chi tiết (Tiếng Việt)
                  </label>
                  <textarea
                    rows={4}
                    value={descriptionVi}
                    onChange={(e) => setDescriptionVi(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Mô tả chi tiết (Tiếng Anh)
                  </label>
                  <textarea
                    rows={4}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              {/* 6. Trạng thái Kho, Hiển thị & Nổi bật */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-wood-cream/50 p-4 rounded-2xl border border-wood-light/50">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Tình trạng hàng
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full rounded-xl bg-wood-white border border-wood-light px-3 py-2 text-sm font-medium"
                  >
                    <option value="IN_STOCK">Còn hàng / Nhận đặt chế tác</option>
                    <option value="OUT_OF_STOCK">Tạm hết hàng</option>
                  </select>
                </div>

                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 accent-wood-dark"
                  />
                  <span>Hiển thị trên website khách</span>
                </label>

                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-wood-dark"
                  />
                  <span>Đánh dấu Sản phẩm nổi bật</span>
                </label>
              </div>

              {/* 7. QUẢN LÝ HÌNH ẢNH SẢN PHẨM (Mục 6.4 URD: Kéo thả nhiều ảnh, Chọn ảnh bìa, Sắp xếp thứ tự, Chú thích) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-wood-dark">
                      Hình ảnh sản phẩm ({images.length} ảnh)
                    </h3>
                    <p className="text-xs text-wood-charcoal/70">
                      Hỗ trợ JPG, PNG, WebP (tối đa 5MB/ảnh). Ảnh bìa hiện đầu tiên, ảnh thứ 2 sẽ hiện khi khách rê chuột.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer bg-wood-dark hover:bg-wood-medium text-white px-4 py-2.5 rounded-xl text-xs font-semibold">
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploading ? "Đang nén WebP..." : "+ Tải lên nhiều ảnh cùng lúc"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleUploadFiles(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Vùng kéo thả ảnh */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleUploadFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-wood-light rounded-2xl p-5 bg-wood-cream/40 text-center text-xs text-wood-charcoal/70"
                >
                  Kéo và thả nhiều ảnh từ máy tính vào khung này để tải lên nhanh
                </div>

                {images.length > 0 && (
                  <div className="space-y-2.5">
                    {images.map((img, idx) => (
                      <div
                        key={`${img.url}-${idx}`}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border ${
                          img.isCover
                            ? "bg-wood-cream border-wood-dark"
                            : "bg-wood-white border-wood-light/60"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.altVi}
                          className="w-20 h-16 rounded-lg object-cover border border-wood-light shrink-0"
                        />

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={img.altVi}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImages((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, altVi: val } : item
                                )
                              );
                            }}
                            placeholder="Chú thích ảnh (Tiếng Việt)"
                            className="rounded-lg bg-wood-cream/50 border border-wood-light px-3 py-1.5 text-xs"
                          />
                          <input
                            type="text"
                            value={img.altEn}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImages((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, altEn: val } : item
                                )
                              );
                            }}
                            placeholder="Chú thích ảnh (Tiếng Anh)"
                            className="rounded-lg bg-wood-cream/50 border border-wood-light px-3 py-1.5 text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setCoverImage(idx)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                              img.isCover
                                ? "bg-wood-dark text-white"
                                : "bg-wood-cream text-wood-charcoal hover:bg-wood-light/50"
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>{img.isCover ? "Ảnh bìa" : "Đặt làm bìa"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => moveImage(idx, -1)}
                            disabled={idx === 0}
                            title="Đưa lên trước"
                            className="p-1.5 rounded-lg bg-wood-cream disabled:opacity-40"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 1)}
                            disabled={idx === images.length - 1}
                            title="Đưa xuống sau"
                            className="p-1.5 rounded-lg bg-wood-cream disabled:opacity-40"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            title="Xóa ảnh này"
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-wood-light/50">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-3 rounded-xl border border-wood-light text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-wood-dark hover:bg-wood-medium text-white text-sm font-semibold shadow-sm"
                >
                  {editingId ? "Lưu cập nhật sản phẩm" : "Tạo sản phẩm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hộp thoại xác nhận xóa sản phẩm để tránh bấm nhầm (Mục 6.3 URD) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-wood-white rounded-2xl max-w-md w-full p-6 border border-wood-light shadow-xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-wood-dark">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="text-sm text-wood-charcoal/80">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>&ldquo;{deleteTarget.nameVi}&rdquo;</strong> không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-wood-light text-xs font-semibold"
              >
                Không, giữ lại
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
