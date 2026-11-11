"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@woodendecor.vn");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập không thành công.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-cream px-4 py-12">
      <div className="max-w-md w-full bg-wood-white rounded-3xl p-8 sm:p-10 border border-wood-light/70 shadow-lg space-y-6">
        <div className="text-center space-y-3">
          <img
            src="/uploads/logo/logo.webp"
            alt="Wooden Decor"
            className="w-16 h-16 rounded-full mx-auto object-cover border border-wood-light"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            Quản Trị Wooden Decor
          </h1>
          <p className="text-xs sm:text-sm text-wood-charcoal/70">
            Đăng nhập dành cho chủ cửa hàng để quản lý sản phẩm & yêu cầu khách hàng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wood-charcoal mb-1.5">
              Email quản trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-wood-medium absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@woodendecor.vn"
                className="w-full rounded-xl bg-wood-cream/60 border border-wood-light pl-10 pr-4 py-3 text-sm text-wood-charcoal focus:outline-none focus:border-wood-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wood-charcoal mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-wood-medium absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu (Mặc định: Admin@123)"
                className="w-full rounded-xl bg-wood-cream/60 border border-wood-light pl-10 pr-4 py-3 text-sm text-wood-charcoal focus:outline-none focus:border-wood-dark"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-wood-dark hover:bg-wood-medium disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            <span>{loading ? "Đang kiểm tra..." : "Đăng nhập vào trang quản trị"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-wood-cream/80 rounded-xl p-3.5 border border-wood-light/50 text-xs text-wood-charcoal/80 space-y-1">
          <p className="font-semibold text-wood-dark">Tài khoản mặc định thử nghiệm:</p>
          <p>
            Email: <code className="font-mono font-bold">admin@woodendecor.vn</code>
          </p>
          <p>
            Mật khẩu: <code className="font-mono font-bold">Admin@123</code>
          </p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/vi"
            className="text-xs font-medium text-wood-medium hover:text-wood-dark underline underline-offset-4"
          >
            ← Quay về trang chủ khách hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
