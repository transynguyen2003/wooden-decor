"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Check, Trash2, ExternalLink } from "lucide-react";

interface InquiryItem {
  id: string;
  customerName: string;
  phone: string;
  message: string;
  status: string;
  internalNote: string;
  createdAt: string;
  product?: {
    id: string;
    nameVi: string;
    slug: string;
  } | null;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState("");

  const fetchInquiries = async (filter = statusFilter) => {
    setLoading(true);
    const res = await fetch(`/api/inquiries?status=${filter}`);
    const data = await res.json();
    const list: InquiryItem[] = data.inquiries || [];
    setInquiries(list);

    const noteMap: Record<string, string> = {};
    const statusMap: Record<string, string> = {};
    for (const item of list) {
      noteMap[item.id] = item.internalNote || "";
      statusMap[item.id] = item.status;
    }
    setNotes(noteMap);
    setStatuses(statusMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries(statusFilter);
  }, [statusFilter]);

  const handleSave = async (item: InquiryItem) => {
    setSavingId(item.id);
    setSavedMsg("");
    const res = await fetch("/api/inquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        status: statuses[item.id] || item.status,
        internalNote: notes[item.id] ?? item.internalNote,
      }),
    });
    if (res.ok) {
      setSavedMsg(`Đã lưu cập nhật cho khách hàng "${item.customerName}"!`);
      fetchInquiries(statusFilter);
    }
    setSavingId(null);
  };

  const handleDelete = async (item: InquiryItem) => {
    if (!window.confirm(`Xóa yêu cầu tư vấn của "${item.customerName}"?`)) return;
    const res = await fetch(`/api/inquiries?id=${item.id}`, { method: "DELETE" });
    if (res.ok) {
      fetchInquiries(statusFilter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wood-dark">
            Quản Lý Yêu Cầu Tư Vấn Của Khách
          </h1>
          <p className="text-sm text-wood-charcoal/75 mt-1">
            Xem danh sách khách để lại số điện thoại, gọi hoặc nhắn Zalo tư vấn và ghi chú tiến độ chăm sóc.
          </p>
        </div>

        {/* Bộ lọc theo trạng thái (Mục 6.6 URD) */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "NEW", label: "Mới gửi" },
            { id: "CONTACTED", label: "Đã liên hệ" },
            { id: "COMPLETED", label: "Hoàn tất" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? "bg-wood-dark text-white"
                  : "bg-wood-white border border-wood-light text-wood-charcoal hover:bg-wood-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-wood-charcoal/70">Đang tải danh sách yêu cầu...</p>
      ) : inquiries.length === 0 ? (
        <div className="bg-wood-white rounded-2xl p-12 text-center border border-wood-light/60 text-sm text-wood-charcoal/70">
          Chưa có yêu cầu tư vấn nào ở trạng thái này.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const cleanPhone = inq.phone.replace(/\D/g, "");
            return (
              <div
                key={inq.id}
                className="bg-wood-white rounded-2xl p-5 sm:p-6 border border-wood-light/60 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                {/* Thông tin khách & lời nhắn */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-lg font-bold text-wood-dark">
                      {inq.customerName}
                    </h3>
                    <span className="text-xs text-wood-charcoal/60">
                      {new Date(inq.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1.5 bg-wood-dark text-white text-xs font-semibold px-3.5 py-1.5 rounded-full"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi: {inq.phone}</span>
                    </a>
                    <a
                      href={`https://zalo.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-wood-cream border border-wood-medium text-wood-dark text-xs font-semibold px-3.5 py-1.5 rounded-full"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-wood-medium" />
                      <span>Mở Zalo khách</span>
                    </a>
                    {inq.product && (
                      <Link
                        href={`/vi/san-pham/${inq.product.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-wood-medium hover:text-wood-dark underline underline-offset-4"
                      >
                        <span>SP: {inq.product.nameVi}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  <div className="bg-wood-cream/60 rounded-xl p-3.5 border border-wood-light/50 text-sm text-wood-charcoal">
                    <span className="text-xs font-semibold uppercase text-wood-medium block mb-1">
                      Lời nhắn của khách:
                    </span>
                    {inq.message || "(Khách không để lại lời nhắn kèm theo)"}
                  </div>
                </div>

                {/* Cột cập nhật trạng thái & Ghi chú nội bộ của chủ shop */}
                <div className="lg:col-span-5 space-y-3 bg-wood-cream/40 p-4 rounded-xl border border-wood-light/50">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Trạng thái xử lý
                    </label>
                    <select
                      value={statuses[inq.id] || inq.status}
                      onChange={(e) =>
                        setStatuses((prev) => ({
                          ...prev,
                          [inq.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3 py-2 text-xs font-semibold text-wood-dark"
                    >
                      <option value="NEW">🟠 Mới (Chưa liên hệ)</option>
                      <option value="CONTACTED">🔵 Đã liên hệ tư vấn</option>
                      <option value="COMPLETED">🟢 Hoàn tất</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-wood-charcoal mb-1">
                      Ghi chú nội bộ (Chỉ chủ shop thấy)
                    </label>
                    <textarea
                      rows={2}
                      value={notes[inq.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [inq.id]: e.target.value,
                        }))
                      }
                      placeholder="VD: Khách hẹn thứ Bảy ghé xưởng xem gỗ..."
                      className="w-full rounded-xl bg-wood-white border border-wood-light px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(inq)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSave(inq)}
                      disabled={savingId === inq.id}
                      className="inline-flex items-center gap-1.5 bg-wood-dark hover:bg-wood-medium text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {savingId === inq.id ? "Đang lưu..." : "Lưu trạng thái & ghi chú"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
