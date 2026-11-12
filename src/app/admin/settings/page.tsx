"use client";

import React, { useEffect, useState } from "react";
import { Save, Upload, Check, AlertCircle, Lock } from "lucide-react";
import VideoManagerCard from "@/components/admin/VideoManagerCard";

interface SettingEntry {
  key: string;
  valueVi: string;
  valueEn: string;
  group?: string;
}

export default function AdminSettingsPage() {
  const [formMap, setFormMap] = useState<Record<string, { vi: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Đổi mật khẩu (Mục 6.1 URD)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    const list: SettingEntry[] = data.settings || [];
    const map: Record<string, { vi: string; en: string }> = {};
    for (const row of list) {
      map[row.key] = { vi: row.valueVi, en: row.valueEn };
    }
    setFormMap(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getVal = (key: string, lang: "vi" | "en" = "vi") => {
    return formMap[key]?.[lang] || "";
  };

  const setVal = (key: string, lang: "vi" | "en", val: string) => {
    setFormMap((prev) => ({
      ...prev,
      [key]: {
        vi: lang === "vi" ? val : prev[key]?.vi || "",
        en: lang === "en" ? val : prev[key]?.en || "",
      },
    }));
  };

  const handleUploadImage = async (
    key: string,
    folder: "logo" | "banners",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok && data.files?.[0]?.url) {
      const url = data.files[0].url;
      setFormMap((prev) => ({
        ...prev,
        [key]: { vi: url, en: url },
      }));
    } else {
      setErrorMsg(data.error || "Không thể tải ảnh lên.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    setErrorMsg("");

    const payload = Object.entries(formMap)
      .filter(([key]) => key !== "showcaseVideos")
      .map(([key, val]) => ({
        key,
        valueVi: val.vi,
        valueEn: val.en,
      }));

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });

    if (res.ok) {
      setSavedMsg("Đã lưu toàn bộ cài đặt website thành công!");
    } else {
      setErrorMsg("Không thể lưu cài đặt.");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdError("");

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setPwdError(data.error || "Không thể đổi mật khẩu.");
    } else {
      setPwdMsg(data.message || "Đã đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  if (loading) {
    return <p className="text-sm text-wood-charcoal/70">Đang tải cài đặt...</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
          Cài Đặt Chung Của Website & Bảo Mật
        </h1>
        <p className="text-sm text-wood-charcoal/75 mt-1">
          Thay đổi Logo, Số điện thoại, Zalo, Địa chỉ, tỷ giá quy đổi USD, Banner trang chủ và Câu chuyện giới thiệu.
        </p>
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* 1. Thông tin Thương hiệu, Logo & Tỷ giá USD */}
        <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            1. Thương hiệu, Logo & Tỷ giá quy đổi USD
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tên cửa hàng
              </label>
              <input
                type="text"
                value={getVal("brandName", "vi")}
                onChange={(e) => {
                  setVal("brandName", "vi", e.target.value);
                  setVal("brandName", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tỷ giá 1 USD = ? VND (Bản Tiếng Anh)
              </label>
              <input
                type="number"
                value={getVal("usdExchangeRate", "vi")}
                onChange={(e) => {
                  setVal("usdExchangeRate", "vi", e.target.value);
                  setVal("usdExchangeRate", "en", e.target.value);
                }}
                placeholder="25000"
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Logo cửa hàng
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={getVal("logoUrl", "vi") || "/uploads/logo/logo-thien-an.webp"}
                  alt="Logo"
                  className="h-12 w-auto max-w-[180px] object-contain"
                />
                <label className="inline-flex items-center gap-1.5 cursor-pointer bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light px-3.5 py-2 rounded-xl text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Đổi Logo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleUploadImage("logoUrl", "logo", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Khẩu hiệu / Slogan (Tiếng Việt)
              </label>
              <input
                type="text"
                value={getVal("slogan", "vi")}
                onChange={(e) => setVal("slogan", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Khẩu hiệu / Slogan (Tiếng Anh)
              </label>
              <input
                type="text"
                value={getVal("slogan", "en")}
                onChange={(e) => setVal("slogan", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 2. Thông tin Liên hệ, Zalo, Địa chỉ, Giờ mở cửa */}
        <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            2. Thông tin Liên hệ, Zalo & Địa chỉ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Số điện thoại Hotline
              </label>
              <input
                type="text"
                value={getVal("phone", "vi")}
                onChange={(e) => {
                  setVal("phone", "vi", e.target.value);
                  setVal("phone", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Số Zalo nhận tin nhắn
              </label>
              <input
                type="text"
                value={getVal("zalo", "vi")}
                onChange={(e) => {
                  setVal("zalo", "vi", e.target.value);
                  setVal("zalo", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                value={getVal("email", "vi")}
                onChange={(e) => {
                  setVal("email", "vi", e.target.value);
                  setVal("email", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Địa chỉ Showroom / Xưởng (Tiếng Việt)
              </label>
              <input
                type="text"
                value={getVal("address", "vi")}
                onChange={(e) => setVal("address", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Địa chỉ Showroom / Xưởng (Tiếng Anh)
              </label>
              <input
                type="text"
                value={getVal("address", "en")}
                onChange={(e) => setVal("address", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Giờ mở cửa (Tiếng Việt)
              </label>
              <input
                type="text"
                value={getVal("openingHours", "vi")}
                onChange={(e) => setVal("openingHours", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Giờ mở cửa (Tiếng Anh)
              </label>
              <input
                type="text"
                value={getVal("openingHours", "en")}
                onChange={(e) => setVal("openingHours", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Link Facebook
              </label>
              <input
                type="text"
                value={getVal("facebookUrl", "vi")}
                onChange={(e) => {
                  setVal("facebookUrl", "vi", e.target.value);
                  setVal("facebookUrl", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Link TikTok
              </label>
              <input
                type="text"
                value={getVal("tiktokUrl", "vi")}
                onChange={(e) => {
                  setVal("tiktokUrl", "vi", e.target.value);
                  setVal("tiktokUrl", "en", e.target.value);
                }}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Nội dung Banner Trang chủ (Mục 5.2 & 6.7 URD) */}
        <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            3. Nội dung Banner Đầu Trang Chủ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tiêu đề lớn trên Banner (Tiếng Việt)
              </label>
              <input
                type="text"
                value={getVal("heroTitle", "vi")}
                onChange={(e) => setVal("heroTitle", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tiêu đề lớn trên Banner (Tiếng Anh)
              </label>
              <input
                type="text"
                value={getVal("heroTitle", "en")}
                onChange={(e) => setVal("heroTitle", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Mô tả dưới tiêu đề (Tiếng Việt)
              </label>
              <textarea
                rows={2}
                value={getVal("heroSubtitle", "vi")}
                onChange={(e) => setVal("heroSubtitle", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Mô tả dưới tiêu đề (Tiếng Anh)
              </label>
              <textarea
                rows={2}
                value={getVal("heroSubtitle", "en")}
                onChange={(e) => setVal("heroSubtitle", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <img
              src={
                getVal("heroBannerImage", "vi") ||
                "/uploads/banners/hero-phong-khach-dang-song.webp"
              }
              alt="Banner"
              className="w-40 h-24 rounded-xl object-cover border border-wood-light"
            />
            <label className="inline-flex items-center gap-2 cursor-pointer bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-light px-4 py-2.5 rounded-xl text-xs font-semibold">
              <Upload className="w-4 h-4" />
              <span>Tải lên ảnh Banner Trang chủ mới</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleUploadImage("heroBannerImage", "banners", e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 4. Nội dung Trang Giới thiệu (Mục 6.7 URD) */}
        <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            4. Nội dung Trang Giới Thiệu Cửa Hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tiêu đề trang Giới thiệu (Tiếng Việt)
              </label>
              <input
                type="text"
                value={getVal("aboutTitle", "vi")}
                onChange={(e) => setVal("aboutTitle", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Tiêu đề trang Giới thiệu (Tiếng Anh)
              </label>
              <input
                type="text"
                value={getVal("aboutTitle", "en")}
                onChange={(e) => setVal("aboutTitle", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Câu chuyện thương hiệu (Tiếng Việt)
              </label>
              <textarea
                rows={4}
                value={getVal("aboutStory", "vi")}
                onChange={(e) => setVal("aboutStory", "vi", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Câu chuyện thương hiệu (Tiếng Anh)
              </label>
              <textarea
                rows={4}
                value={getVal("aboutStory", "en")}
                onChange={(e) => setVal("aboutStory", "en", e.target.value)}
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 5. Cấu hình Trợ lý AI Tư vấn Khách hàng */}
        <div className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-wood-dark">
              5. Cấu hình Trợ lý AI Tư vấn Khách hàng (24/7)
            </h2>
            <p className="text-xs text-wood-charcoal/70 mt-1">
              Mặc định Trợ lý AI đã tự động đọc toàn bộ Sản phẩm, Giá, Chất liệu gỗ và Địa chỉ Showroom trong CSDL để trả lời khách ngay lập tức. Nếu bạn muốn nâng cấp lên mô hình Google Gemini AI, có thể điền API Key bên dưới.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Google Gemini API Key (Tùy chọn - Không bắt buộc)
              </label>
              <input
                type="password"
                value={getVal("geminiApiKey", "vi")}
                onChange={(e) => {
                  setVal("geminiApiKey", "vi", e.target.value);
                  setVal("geminiApiKey", "en", e.target.value);
                }}
                placeholder="AIzaSy... (Để trống vẫn hoạt động với AI nội bộ)"
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                Ghi chú dặn dò thêm cho AI (Chính sách ưu đãi, chiết khấu...)
              </label>
              <input
                type="text"
                value={getVal("aiCustomPrompt", "vi")}
                onChange={(e) => {
                  setVal("aiCustomPrompt", "vi", e.target.value);
                  setVal("aiCustomPrompt", "en", e.target.value);
                }}
                placeholder="VD: Miễn phí vận chuyển nội thành TP.HCM, giảm 5% khi đặt комbo..."
                className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-wood-dark hover:bg-wood-medium text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Đang lưu..." : "Lưu Toàn Bộ Cài Đặt Website"}</span>
          </button>
        </div>
      </form>

      {/* Quản lý Video thực tế */}
      <VideoManagerCard />

      {/* 6. Đổi mật khẩu quản trị viên (Mục 6.1 URD) */}
      <form
        onSubmit={handleChangePassword}
        className="bg-wood-white rounded-2xl p-6 border border-wood-light/60 shadow-sm space-y-4 max-w-xl"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-wood-medium" />
          <h2 className="font-serif text-xl font-bold text-wood-dark">
            Đổi Mật Khẩu Tài Khoản Quản Trị
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
              Mật khẩu mới (tối thiểu 6 ký tự)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl bg-wood-cream/50 border border-wood-light px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        {pwdError && (
          <p className="text-xs font-semibold text-red-700 bg-red-50 p-2.5 rounded-lg">
            {pwdError}
          </p>
        )}
        {pwdMsg && (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg">
            {pwdMsg}
          </p>
        )}

        <button
          type="submit"
          className="bg-wood-medium hover:bg-wood-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
}
