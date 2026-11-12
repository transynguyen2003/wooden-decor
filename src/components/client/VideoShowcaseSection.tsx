"use client";

import React, { useEffect, useRef, useState } from "react";
import { Film, Volume2, VolumeX, Play } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { ShowcaseVideoItem } from "@/lib/settings";

interface VideoShowcaseSectionProps {
  videos: ShowcaseVideoItem[];
  locale: Locale;
}

export default function VideoShowcaseSection({
  videos,
  locale,
}: VideoShowcaseSectionProps) {
  const activeVideos = (videos || []).filter((v) => v && v.active && v.url);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const safeIndex =
    selectedIndex < activeVideos.length ? selectedIndex : 0;
  const currentVideo = activeVideos[safeIndex];

  // Tự động phát (không tiếng) khi người dùng cuộn tới khung video và tạm dừng khi cuộn đi xa
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !currentVideo) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          vid.play().catch(() => {
            // Trình duyệt có thể chặn autoplay nếu chưa tương tác
          });
        } else {
          vid.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(vid);
    return () => observer.disconnect();
  }, [currentVideo?.url]);

  if (activeVideos.length === 0 || !currentVideo) {
    return null;
  }

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);

    // Nếu người dùng bật tiếng video, tạm dừng nhạc nền Giáng Sinh để không bị đè 2 âm thanh
    if (!nextMuted && typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((a) => {
        try {
          a.pause();
        } catch {
          // Ignore
        }
      });
    }
  };

  const title =
    locale === "en"
      ? currentVideo.titleEn || currentVideo.titleVi
      : currentVideo.titleVi;
  const desc =
    locale === "en"
      ? currentVideo.descEn || currentVideo.descVi
      : currentVideo.descVi;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-wood-cream rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-wood-light/60 space-y-6 sm:space-y-8">
        {/* Tiêu đề khu vực Video */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-wood-medium">
              <Film className="w-4 h-4" />
              <span>
                {locale === "en"
                  ? "Actual Workshop & Showroom Footage"
                  : "Thước Phim Thực Tế Tại Xưởng & Showroom"}
              </span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-wood-dark leading-tight">
              {title ||
                (locale === "en"
                  ? "Craftsmanship in Every Grain"
                  : "Cận Cảnh Đường Vân & Chế Tác Thủ Công")}
            </h2>
            {desc && (
              <p className="text-sm sm:text-base text-wood-charcoal/80 leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        </div>

        {/* Khung trình chiếu Video (1 video lớn hoặc Kèm danh sách chọn nếu có nhiều video) */}
        <div
          className={`grid grid-cols-1 ${
            activeVideos.length > 1 ? "lg:grid-cols-12 gap-6" : ""
          }`}
        >
          <div
            className={`${
              activeVideos.length > 1
                ? "lg:col-span-8"
                : "max-w-5xl mx-auto w-full"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-wood-light/70 shadow-lg aspect-video group">
              <video
                key={currentVideo.url}
                ref={videoRef}
                src={currentVideo.url}
                muted={isMuted}
                loop
                playsInline
                controls
                preload="metadata"
                className="w-full h-full object-contain bg-black"
              />

              {/* Nút Bật / Tắt tiếng nhanh góc trên phải */}
              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 inline-flex items-center gap-1.5 bg-black/65 hover:bg-black/85 text-white backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-medium border border-white/25 transition-all"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {locale === "en" ? "Unmute Audio" : "Bật tiếng video"}
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {locale === "en" ? "Sound On" : "Đang bật tiếng"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Danh sách chuyển đổi nếu Admin thêm từ 2 video trở lên */}
          {activeVideos.length > 1 && (
            <div className="lg:col-span-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-wood-medium">
                {locale === "en"
                  ? `Video Playlist (${activeVideos.length})`
                  : `Danh sách video (${activeVideos.length})`}
              </p>
              {activeVideos.map((vid, idx) => {
                const isSelected = idx === safeIndex;
                const itemTitle =
                  (locale === "en" ? vid.titleEn || vid.titleVi : vid.titleVi) ||
                  `Video #${idx + 1}`;
                const itemDesc =
                  locale === "en" ? vid.descEn || vid.descVi : vid.descVi;

                return (
                  <button
                    key={vid.id || idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-wood-dark text-white border-wood-dark shadow-sm"
                        : "bg-wood-white hover:bg-wood-light/30 text-wood-charcoal border-wood-light/70"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-wood-medium text-white"
                          : "bg-wood-cream text-wood-dark"
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold line-clamp-1 ${
                          isSelected ? "text-white" : "text-wood-dark"
                        }`}
                      >
                        {itemTitle}
                      </p>
                      {itemDesc && (
                        <p
                          className={`text-xs mt-0.5 line-clamp-2 ${
                            isSelected
                              ? "text-wood-cream/85"
                              : "text-wood-charcoal/70"
                          }`}
                        >
                          {itemDesc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
