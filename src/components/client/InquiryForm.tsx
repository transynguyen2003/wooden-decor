"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";

interface InquiryFormProps {
  productId?: string;
  productName?: string;
  dict: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    productLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
  };
}

/**
 * Mục 5.5 URD: Form yêu cầu tư vấn (Họ tên, SĐT bắt buộc, Lời nhắn, Sản phẩm quan tâm, Chống spam honeypot)
 */
export default function InquiryForm({
  productId,
  productName,
  dict,
}: InquiryFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    productName ? `Tôi muốn tư vấn chi tiết về mẫu: ${productName}` : ""
  );
  // Trường ẩn chống bot spam (Honeypot)
  const [websiteHoney, setWebsiteHoney] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2 || trimmedPhone.length < 8) {
      setError(dict.errorMessage);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: trimmedName,
          phone: trimmedPhone,
          message: message.trim(),
          productId: productId || null,
          honeypot: websiteHoney,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || dict.errorMessage);
      } else {
        setSuccess(true);
        setCustomerName("");
        setPhone("");
      }
    } catch {
      setError(dict.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-wood-cream border border-wood-medium/50 p-6 sm:p-8 text-center space-y-3 animate-fade-up">
        <CheckCircle2 className="w-12 h-12 text-wood-medium mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-wood-dark">
          {dict.successTitle}
        </h3>
        <p className="text-sm text-wood-charcoal/80 max-w-md mx-auto">
          {dict.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-wood-cream/90 border border-wood-light/70 p-5 sm:p-8 space-y-5"
    >
      <div>
        <h3 className="font-serif text-2xl font-bold text-wood-dark">
          {dict.title}
        </h3>
        <p className="text-xs sm:text-sm text-wood-charcoal/75 mt-1">
          {dict.subtitle}
        </p>
      </div>

      {/* Trường ẩn chống spam (người thật không nhìn thấy) */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHoney}
            onChange={(e) => setWebsiteHoney(e.target.value)}
          />
        </label>
      </div>

      {productName && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-wood-medium mb-1.5">
            {dict.productLabel}
          </label>
          <input
            type="text"
            value={productName}
            readOnly
            className="w-full rounded-xl bg-wood-light/25 border border-wood-light px-4 py-2.5 text-sm font-medium text-wood-dark"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-wood-charcoal mb-1.5">
            {dict.nameLabel}
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={dict.namePlaceholder}
            className="w-full rounded-xl bg-wood-white border border-wood-light px-4 py-3 text-sm text-wood-charcoal focus:outline-none focus:border-wood-dark"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-wood-charcoal mb-1.5">
            {dict.phoneLabel}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={dict.phonePlaceholder}
            className="w-full rounded-xl bg-wood-white border border-wood-light px-4 py-3 text-sm text-wood-charcoal focus:outline-none focus:border-wood-dark"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-wood-charcoal mb-1.5">
          {dict.messageLabel}
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.messagePlaceholder}
          className="w-full rounded-xl bg-wood-white border border-wood-light px-4 py-3 text-sm text-wood-charcoal focus:outline-none focus:border-wood-dark"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-wood-dark hover:bg-wood-medium disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm shadow-sm"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? dict.submitting : dict.submitBtn}</span>
      </button>
    </form>
  );
}
