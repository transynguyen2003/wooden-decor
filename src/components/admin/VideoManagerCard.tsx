"use client";

import React, { useEffect, useState } from "react";
import {
  Film,
  Upload,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import {
  ShowcaseVideoItem,
  DEFAULT_SHOWCASE_VIDEOS,
} from "@/lib/settings";

export default function VideoManagerCard() {
  const [videos, setVideos] = useState<ShowcaseVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        const rows: Array<{ key: string; valueVi: string }> =
          data.settings || [];
        const row = rows.find((r) => r.key === "showcaseVideos");
        if (row && row.valueVi.trim().startsWith("[")) {
          const parsed = JSON.parse(row.valueVi);
          if (Array.isArray(parsed)) {
            setVideos(parsed);
            setLoading(false);
            return;
          }
        }
        setVideos(DEFAULT_SHOWCASE_VIDEOS);
      } catch {
        setVideos(DEFAULT_SHOWCASE_VIDEOS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const persistVideos = async (
    nextList: ShowcaseVideoItem[],
    successText = "Đã lưu danh sách video hiển thị trên website!"
  ) => {
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const json = JSON.stringify(nextList);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            {
              key: "showcaseVideos",
              valueVi: json,
              valueEn: json,
              group: "videos",
            },
          ],
        }),
      });
      if (res.ok) {
        setMsg(successText);
      } else {
        setError("Không thể lưu danh sách video.");
      }
    } catch {
      setError("Lỗi kết nối khi lưu video.");
    } finally {
      setSaving(false);
    }
  };

  // Tải lên 1 hoặc nhiều video mới từ máy tính / điện thoại
  const handleUploadNewVideo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setMsg("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("folder", "videos");
      Array.from(fileList).forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !Array.isArray(data.files)) {
        setError(data.error || "Không thể tải video lên.");
      } else {
        const added: ShowcaseVideoItem[] = data.files.map(
          (f: { url: string; name: string }, i: number) => ({
            id: `video-${Date.now()}-${i}`,
            url: f.url,
            titleVi: "Thước Phim Thực Tế Tại Xưởng & Showroom Thiên An",
            titleEn: "Inside Our Solid Wood Workshop & Showroom",
            descVi:
              "Cận cảnh từng đường vân gỗ tự nhiên nguyên khối và quá trình hoàn thiện thủ công tỉ mỉ.",
            descEn:
              "Up-close view of natural solid wood grain and meticulous hand-finishing.",
            active: true,
          })
        );
        const nextList = [...videos, ...added];
        setVideos(nextList);
        await persistVideos(
          nextList,
          `Đã tải lên và hiển thị ${added.length} video mới thành công!`
        );
      }
    } catch {
      setError("Lỗi khi tải tệp video lên.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Đổi file video của 1 mục có sẵn
  const handleReplaceVideoFile = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("folder", "videos");
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.files?.[0]?.url) {
        const nextList = videos.map((v, idx) =>
          idx === index ? { ...v, url: data.files[0].url } : v
        );
        setVideos(nextList);
        await persistVideos(nextList, "Đã thay đổi tệp video thành công!");
      } else {
        setError(data.error || "Không thể thay thế tệp video.");
      }
    } catch {
      setError("Lỗi khi tải tệp video thay thế.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleUpdateField = (
    index: number,
    field: keyof ShowcaseVideoItem,
    value: string | boolean
  ) => {
    setVideos((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleToggleActive = async (index: number) => {
    const nextList = videos.map((item, idx) =>
      idx === index ? { ...item, active: !item.active } : item
    );
    setVideos(nextList);
    await persistVideos(nextList, "Đã cập nhật trạng thái hiển thị video!");
  };

  const handleDeleteVideo = async (index: number) => {
    const nextList = videos.filter((_, idx) => idx !== index);
    setVideos(nextList);
    await persistVideos(
      nextList,
      nextList.length === 0
        ? "Đã xóa video. Phần video trên website đã tự động ẩn đi."
        : "Đã xóa video khỏi danh sách!"
    );
  };

  const handleAddEmptySlot = () => {
    setVideos((prev) => [
      ...prev,
      {
        id: `video-${Date.now()}`,
        url: "",
        titleVi: "Thước Phim Thực Tế Tại Xưởng & Showroom Thiên An",
        titleEn: "Inside Our Solid Wood Workshop & Showroom",
        descVi: "",
        descEn: "",
        active: true,
      },
    ]);
  };

  if (loading) {
    return (
      <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 text-sm text-wood-charcoal/70">
        Đang tải danh sách video...
      </div>
    );
  }

  return (
    <div className="bg-wood-white rounded-2xl p-5 sm:p-6 border border-wood-light/60 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wood-light/50 pb-4">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-bold text-wood-dark flex items-center gap-2">
            <Film className="w-5 h-5 text-wood-medium" />
            <span>Quản Lý Video Thực Tế (Hiển thị trên Trang chủ & Giới thiệu)</span>
          </h2>
          <p className="text-xs sm:text-sm text-wood-charcoal/75">
            Tải video từ máy tính / điện thoại (.mp4, .webm, .mov), chỉnh sửa tiêu đề hoặc xóa video bất kỳ lúc nào.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-wood-dark hover:bg-wood-medium text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-xs">
            <Upload className="w-4 h-4" />
            <span>
              {uploading ? "Đang tải video lên..." : "Tải Video Mới Lên (.mp4)"}
            </span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              disabled={uploading}
              onChange={handleUploadNewVideo}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleAddEmptySlot}
            className="inline-flex items-center gap-1.5 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bằng Link</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-wood-cream/50 border border-dashed border-wood-light space-y-3">
          <Film className="w-10 h-10 text-wood-medium mx-auto opacity-75" />
          <p className="text-sm font-semibold text-wood-dark">
            Hiện chưa có video nào (Khu vực video trên website đang tự động ẩn)
          </p>
          <p className="text-xs text-wood-charcoal/70 max-w-md mx-auto">
            Bấm nút &ldquo;Tải Video Mới Lên (.mp4)&rdquo; ở góc trên để thêm video giới thiệu xưởng hoặc sản phẩm thực tế.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {videos.map((vid, idx) => (
            <div
              key={vid.id || idx}
              className="rounded-2xl bg-wood-cream/40 border border-wood-light/70 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
            >
              {/* Cột xem trước Video */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-wood-light">
                  {vid.url ? (
                    <video
                      key={vid.url}
                      src={vid.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/70 px-4 text-center">
                      Chưa có file video. Hãy tải file lên hoặc dán đường dẫn.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer bg-wood-white hover:bg-wood-cream text-wood-dark border border-wood-light px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Đổi file video khác</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      disabled={uploading}
                      onChange={(e) => handleReplaceVideoFile(idx, e)}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        vid.active
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}
                    >
                      {vid.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Đang hiện</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Đang ẩn</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(idx)}
                      className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa video</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cột chỉnh sửa Tiêu đề & Mô tả */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                    Đường dẫn file Video (URL)
                  </label>
                  <input
                    type="text"
                    value={vid.url}
                    onChange={(e) =>
                      handleUpdateField(idx, "url", e.target.value)
                    }
                    placeholder="/uploads/videos/showroom-video-1.mp4"
                    className="w-full rounded-xl bg-wood-white border border-wood-light px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Tiêu đề Video (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={vid.titleVi}
                      onChange={(e) =>
                        handleUpdateField(idx, "titleVi", e.target.value)
                      }
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3.5 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Tiêu đề Video (Tiếng Anh)
                    </label>
                    <input
                      type="text"
                      value={vid.titleEn}
                      onChange={(e) =>
                        handleUpdateField(idx, "titleEn", e.target.value)
                      }
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3.5 py-2 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Mô tả ngắn (Tiếng Việt)
                    </label>
                    <textarea
                      rows={2}
                      value={vid.descVi}
                      onChange={(e) =>
                        handleUpdateField(idx, "descVi", e.target.value)
                      }
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3.5 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Mô tả ngắn (Tiếng Anh)
                    </label>
                    <textarea
                      rows={2}
                      value={vid.descEn}
                      onChange={(e) =>
                        handleUpdateField(idx, "descEn", e.target.value)
                      }
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3.5 py-2 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => persistVideos(videos)}
              className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving ? "Đang lưu..." : "Lưu nội dung tiêu đề & mô tả Video"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
