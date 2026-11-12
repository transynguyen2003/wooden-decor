"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  PhoneCall,
  ArrowUpRight,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { Locale } from "@/lib/i18n";
import type { ChatProductCard, ChatContactCard } from "@/app/api/chat/route";
import { ZaloIcon } from "./SocialIcons";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ChatProductCard[];
  contactCard?: ChatContactCard;
  suggestions?: string[];
  inquiryCreated?: boolean;
}

interface AIChatbotProps {
  locale: Locale;
  brandName: string;
  phone: string;
}

const STORAGE_KEY = "wooden_decor_ai_chat_v2";

export default function AIChatbot({
  locale,
  brandName,
  phone,
}: AIChatbotProps) {
  const isEn = locale === "en";

  const getInitialMessage = (): ChatMessage => ({
    id: "welcome",
    role: "assistant",
    content: isEn
      ? `Hello! I am the **${brandName} AI Interior Advisor**.\n\nI can help you explore handcrafted solid wood furniture (Walnut, Ebony, Rosewood), check workshop prices, or connect you directly with our Store Owner. How can I help you today?`
      : `Xin chào anh/chị! Em là **Trợ lý AI của ${brandName}**.\n\nEm có thể tư vấn nhanh các mẫu Sofa, Bàn trà, Giường, Kệ gỗ tự nhiên nguyên khối, báo giá tại xưởng hoặc kết nối trực tiếp với **Chủ tiệm**. Anh/chị cần em hỗ trợ thông tin gì ạ?`,
    suggestions: isEn
      ? [
          "Walnut Sofas & Coffee Tables",
          "Custom sizing at workshop",
          "Connect with Store Owner",
          "Showroom address & Warranty",
        ]
      : [
          "Tư vấn mẫu Sofa gỗ tự nhiên",
          "Các mẫu Bàn trà & Kệ Tivi",
          "Đặt đóng theo kích thước riêng",
          "Tôi muốn liên hệ Chủ tiệm",
        ],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickLead, setShowQuickLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Khôi phục lịch sử trò chuyện trong phiên làm việc
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(`${STORAGE_KEY}_${locale}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [locale]);

  // Lưu lịch sử trò chuyện khi có tin nhắn mới
  useEffect(() => {
    try {
      if (messages.length > 1) {
        window.sessionStorage.setItem(
          `${STORAGE_KEY}_${locale}`,
          JSON.stringify(messages)
        );
      }
    } catch {
      // Ignore storage errors
    }
  }, [messages, locale]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading, showQuickLead]);

  const sendMessage = async (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isLoading) return;

    // Nếu người dùng bấm nút gợi ý mở form để lại SĐT
    if (
      trimmed === "Để lại SĐT để Chủ tiệm gọi lại" ||
      trimmed === "Leave phone number for custom quote"
    ) {
      setShowQuickLead(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          history: updatedHistory.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          products: data.products || [],
          contactCard: data.contactCard || undefined,
          suggestions: data.suggestions || [],
          inquiryCreated: Boolean(data.inquiryCreated),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: isEn
              ? `Sorry, I couldn't process that right now. Please call our hotline directly at **${phone}**.`
              : `Xin lỗi anh/chị, kết nối tạm thời gián đoạn. Anh/chị vui lòng thử lại hoặc gọi trực tiếp Hotline **${phone}** nhé!`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: isEn
            ? `Connection error. Please reach us directly via Hotline/Zalo: **${phone}**.`
            : `Hiện kết nối đang bận, anh/chị có thể liên hệ trực tiếp qua Hotline/Zalo: **${phone}** ạ.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim() || leadSubmitting) return;
    setLeadSubmitting(true);
    const msg = isEn
      ? `My name is ${leadName.trim() || "Customer"}, please advise me via phone number ${leadPhone.trim()}`
      : `Mình là ${leadName.trim() || "Khách hàng"}, nhờ xưởng tư vấn qua SĐT ${leadPhone.trim()}`;
    setShowQuickLead(false);
    setLeadName("");
    setLeadPhone("");
    setLeadSubmitting(false);
    await sendMessage(msg);
  };

  const resetChat = () => {
    const init = [getInitialMessage()];
    setMessages(init);
    setShowQuickLead(false);
    try {
      window.sessionStorage.removeItem(`${STORAGE_KEY}_${locale}`);
    } catch {
      // Ignore
    }
  };

  // Hàm định dạng văn bản nhẹ (in đậm **text**, in nghiêng *text*, xuống dòng)
  const renderFormattedContent = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <p key={lineIdx} className="leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="font-semibold text-wood-dark">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <em key={i} className="italic">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Nút mở Trợ lý AI nổi ở góc phải (nằm ngay phía trên cụm nút Zalo / Gọi ngay) */}
      {!isOpen && (
        <div className="fixed bottom-[122px] right-4 sm:bottom-[134px] sm:right-6 z-40">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 150);
            }}
            aria-label={isEn ? "Open AI Assistant" : "Mở Trợ lý AI tư vấn"}
            className="group relative min-h-[46px] flex items-center gap-2.5 bg-gradient-to-r from-wood-dark to-wood-medium text-white px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all border border-wood-light/40"
          >
            {/* Chấm xanh online */}
            <span className="absolute -top-0.5 -left-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
            </span>

            <Sparkles className="w-4 h-4 text-wood-light shrink-0 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">
              {isEn ? "AI Wood Advisor" : "Trợ lý AI Tư Vấn"}
            </span>
          </button>
        </div>
      )}

      {/* Cửa sổ Chat AI */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={isEn ? "AI Chat Assistant" : "Trợ lý AI Wooden Decor"}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[82vh] sm:max-h-[580px] flex flex-col bg-wood-white border-2 border-wood-light rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        >
          {/* Thanh tiêu đề Chat */}
          <div className="bg-wood-dark text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-wood-medium/40 border border-wood-light/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-wood-cream" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-wood-dark" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold leading-tight text-white flex items-center gap-1.5">
                  <span>{brandName} AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-wood-light" />
                </h3>
                <p className="text-[11px] text-wood-light/90 leading-tight">
                  {isEn
                    ? "Solid Wood & Bespoke Advisor"
                    : "Chuyên viên tư vấn nội thất gỗ 24/7"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title={isEn ? "Reset conversation" : "Làm mới cuộc trò chuyện"}
                className="p-2 rounded-full text-wood-light hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isEn ? "Close chat" : "Thu gọn"}
                className="p-2 rounded-full text-wood-light hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-wood-cream/35 max-h-[380px] sm:max-h-[410px]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] shadow-sm ${
                      isUser
                        ? "bg-wood-dark text-white rounded-br-xs"
                        : "bg-wood-white text-wood-charcoal border border-wood-light/60 rounded-bl-xs"
                    }`}
                  >
                    {isUser ? (
                      <p className="leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderFormattedContent(msg.content)}
                      </div>
                    )}

                    {/* Xác nhận đã tạo yêu cầu tư vấn tự động */}
                    {msg.inquiryCreated && (
                      <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isEn
                            ? "Saved to workshop consultation list!"
                            : "Đã lưu SĐT để Chủ xưởng gọi tư vấn!"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thẻ Liên hệ trực tiếp Chủ tiệm (Hiện ra khi khách muốn gặp Chủ tiệm / hỏi liên hệ) */}
                  {!isUser && msg.contactCard && (
                    <div className="mt-2 w-full max-w-[90%] bg-wood-white border-2 border-wood-medium/50 rounded-xl p-2.5 shadow-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${msg.contactCard.phone.replace(/\s+/g, "")}`}
                          className="flex items-center justify-center gap-1.5 bg-wood-dark hover:bg-wood-medium text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? "Call Owner" : "Gọi Chủ Tiệm"}</span>
                        </a>
                        <a
                          href={`https://zalo.me/${msg.contactCard.zalo.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-medium/60 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                        >
                          <ZaloIcon className="w-4 h-4 shrink-0" />
                          <span>{isEn ? "Chat Zalo" : "Nhắn Zalo"}</span>
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQuickLead(true)}
                        className="w-full text-center text-[11px] font-semibold text-wood-medium hover:text-wood-dark py-1 transition-colors underline underline-offset-2"
                      >
                        {isEn
                          ? "Or leave your phone number for immediate callback"
                          : "Hoặc bấm vào đây để lại SĐT — Chủ tiệm gọi lại ngay"}
                      </button>
                    </div>
                  )}

                  {/* Danh sách thẻ Sản phẩm gợi ý trực tiếp trong khung chat */}
                  {!isUser && msg.products && msg.products.length > 0 && (
                    <div className="mt-2 w-full max-w-[92%] space-y-2">
                      {msg.products.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/${locale}/san-pham/${prod.slug}`}
                          className="flex items-center gap-2.5 bg-wood-white hover:bg-wood-cream/80 border border-wood-light/80 rounded-xl p-2 shadow-xs transition-all group"
                        >
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-wood-light/40"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-wood-dark truncate group-hover:text-wood-medium transition-colors">
                              {prod.name}
                            </p>
                            {prod.material && (
                              <p className="text-[10px] text-wood-charcoal/70 truncate">
                                {prod.material}
                              </p>
                            )}
                            <p className="text-xs font-bold text-wood-medium mt-0.5">
                              {prod.priceText}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-wood-medium shrink-0 mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Các nút gợi ý câu hỏi tiếp theo */}
                  {!isUser &&
                    msg.suggestions &&
                    msg.suggestions.length > 0 &&
                    msg.id === messages[messages.length - 1]?.id &&
                    !isLoading && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendMessage(sug)}
                            className="text-[11px] bg-wood-white hover:bg-wood-dark hover:text-white text-wood-dark border border-wood-light px-2.5 py-1.5 rounded-full transition-colors text-left shadow-2xs"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {/* Hiệu ứng AI đang suy nghĩ */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-wood-white border border-wood-light/60 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-xs">
                  <span
                    className="w-1.5 h-1.5 bg-wood-medium rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-wood-medium rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-wood-medium rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            {/* Biểu mẫu để lại SĐT nhanh trong chat */}
            {showQuickLead && (
              <form
                onSubmit={handleQuickLeadSubmit}
                className="bg-wood-white border-2 border-wood-medium/60 rounded-xl p-3 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-wood-dark">
                    {isEn
                      ? "Request Owner Callback"
                      : "Để lại SĐT — Chủ tiệm gọi lại ngay"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickLead(false)}
                    className="text-wood-charcoal/50 hover:text-wood-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder={isEn ? "Your name" : "Tên của anh/chị"}
                  className="w-full text-xs bg-wood-cream/60 border border-wood-light rounded-lg px-2.5 py-2 focus:outline-none focus:border-wood-medium"
                />
                <input
                  type="tel"
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder={
                    isEn ? "Phone / Zalo number *" : "Số điện thoại / Zalo *"
                  }
                  className="w-full text-xs bg-wood-cream/60 border border-wood-light rounded-lg px-2.5 py-2 focus:outline-none focus:border-wood-medium"
                />
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full bg-wood-dark hover:bg-wood-medium text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  {isEn ? "Send to Store Owner" : "Gửi SĐT cho Chủ tiệm"}
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Thanh công cụ phụ & Ô nhập tin nhắn */}
          <div className="bg-wood-white border-t border-wood-light/60 p-2.5 space-y-2 shrink-0">
            {!showQuickLead && (
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setShowQuickLead(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-wood-medium hover:text-wood-dark transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>
                    {isEn
                      ? "Leave phone number for custom quote"
                      : "Để lại SĐT nhận báo giá tại xưởng"}
                  </span>
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isEn
                    ? "Ask about sofas, prices, or store owner..."
                    : "Nhập câu hỏi (VD: Liên hệ chủ tiệm, Sofa gỗ óc chó...)"
                }
                className="flex-1 bg-wood-cream/70 border border-wood-light rounded-full px-3.5 py-2 text-xs sm:text-sm text-wood-charcoal placeholder:text-wood-charcoal/50 focus:outline-none focus:border-wood-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-wood-dark hover:bg-wood-medium disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
