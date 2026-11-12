"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, SkipForward, Music } from "lucide-react";
import { Locale } from "@/lib/i18n";

export interface TrackItem {
  id: string;
  titleVi: string;
  titleEn: string;
  artist: string;
  src: string;
}

export const INSTRUMENTAL_PLAYLIST: TrackItem[] = [
  {
    id: "jingle-bells",
    titleVi: "Jingle Bells (Chuông Ngân Giáng Sinh)",
    titleEn: "Jingle Bells (Christmas Classic)",
    artist: "Kevin MacLeod",
    src: "/audio/xmas-1-jingle-bells.mp3",
  },
  {
    id: "silent-night",
    titleVi: "Silent Night (Đêm Thánh Vô Cùng)",
    titleEn: "Silent Night (Peaceful Christmas)",
    artist: "Kevin MacLeod",
    src: "/audio/xmas-2-silent-night.mp3",
  },
  {
    id: "deck-the-halls",
    titleVi: "Deck the Halls (Không Khí Lễ Hội Giáng Sinh)",
    titleEn: "Deck the Halls (Festive Holiday)",
    artist: "Kevin MacLeod",
    src: "/audio/xmas-3-deck-the-halls.mp3",
  },
  {
    id: "oh-holy-night",
    titleVi: "Oh Holy Night (Đêm Giáng Sinh An Lành)",
    titleEn: "Oh Holy Night (Warm Christmas Melody)",
    artist: "Kevin MacLeod",
    src: "/audio/xmas-4-oh-holy-night.mp3",
  },
  {
    id: "sugar-plum-fairy",
    titleVi: "Dance of the Sugar Plum Fairy (Vũ Khúc Giáng Sinh)",
    titleEn: "Dance of the Sugar Plum Fairy (Nutcracker)",
    artist: "Kevin MacLeod",
    src: "/audio/xmas-5-sugar-plum-fairy.mp3",
  },
];

interface BackgroundMusicProps {
  locale: Locale;
}

declare global {
  interface Window {
    __woodenDecorActiveAudio?: HTMLAudioElement | null;
  }
}

const LAST_TRACK_STORAGE_KEY = "wooden_decor_last_track_index";

/**
 * Dừng triệt để mọi luồng âm thanh cũ (nếu có do HMR / Fast Refresh hoặc chuyển trang)
 * để đảm bảo tại mọi thời điểm chỉ có duy nhất 1 bài nhạc được phép phát.
 */
function stopOtherAudioInstances(currentAudio: HTMLAudioElement | null) {
  if (typeof window === "undefined") return;

  if (
    window.__woodenDecorActiveAudio &&
    window.__woodenDecorActiveAudio !== currentAudio
  ) {
    try {
      window.__woodenDecorActiveAudio.pause();
      window.__woodenDecorActiveAudio.src = "";
      window.__woodenDecorActiveAudio.load();
    } catch {
      // Ignore
    }
  }

  document.querySelectorAll("audio").forEach((el) => {
    if (el !== currentAudio) {
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // Ignore
      }
    }
  });

  if (currentAudio) {
    window.__woodenDecorActiveAudio = currentAudio;
  }
}

export default function BackgroundMusic({ locale }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userMuted, setUserMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Chọn 1 bài ngẫu nhiên khi mới vào web (khác với bài của lần vào trước)
  useEffect(() => {
    let nextIdx = Math.floor(Math.random() * INSTRUMENTAL_PLAYLIST.length);
    try {
      const savedLast = window.localStorage.getItem(LAST_TRACK_STORAGE_KEY);
      if (savedLast !== null && INSTRUMENTAL_PLAYLIST.length > 1) {
        const lastIdx = parseInt(savedLast, 10);
        if (!Number.isNaN(lastIdx) && nextIdx === lastIdx) {
          const offset =
            1 + Math.floor(Math.random() * (INSTRUMENTAL_PLAYLIST.length - 1));
          nextIdx = (lastIdx + offset) % INSTRUMENTAL_PLAYLIST.length;
        }
      }
      window.localStorage.setItem(LAST_TRACK_STORAGE_KEY, String(nextIdx));
    } catch {
      // Ignore storage access issues
    }
    setTrackIndex(nextIdx);
  }, []);

  // Chuyển sang bài ngẫu nhiên tiếp theo (chỉ gọi khi bài hiện tại kết thúc hoặc khách bấm Next)
  const playRandomNextTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTrackIndex((prev) => {
      const current = prev ?? 0;
      const offset =
        1 + Math.floor(Math.random() * (INSTRUMENTAL_PLAYLIST.length - 1));
      const next = (current + offset) % INSTRUMENTAL_PLAYLIST.length;
      try {
        window.localStorage.setItem(LAST_TRACK_STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
    setUserMuted(false);
  }, []);

  // Quản lý phát nhạc: Dừng hẳn bài cũ trước khi nạp và phát bài mới
  useEffect(() => {
    if (trackIndex === null) return;
    const audio = audioRef.current;
    if (!audio) return;

    stopOtherAudioInstances(audio);

    const targetSrc = INSTRUMENTAL_PLAYLIST[trackIndex].src;

    // Dừng bài trước đó và nạp bài mới
    audio.pause();
    audio.currentTime = 0;
    audio.src = targetSrc;
    audio.volume = 0.35; // Nhẹ nhàng, êm dịu (35% volume)
    audio.load();

    if (userMuted) {
      setIsPlaying(false);
      return;
    }

    let isCancelled = false;
    let unlockAttached = false;

    const cleanupListeners = () => {
      if (!unlockAttached) return;
      unlockAttached = false;
      window.removeEventListener("click", handleUserUnlock);
      window.removeEventListener("touchstart", handleUserUnlock);
      window.removeEventListener("keydown", handleUserUnlock);
      window.removeEventListener("scroll", handleUserUnlock);
    };

    const handleUserUnlock = () => {
      if (isCancelled || !audioRef.current || userMuted) return;
      // Nếu nhạc đang phát rồi thì không gọi play() lần nữa
      if (!audioRef.current.paused) {
        cleanupListeners();
        return;
      }
      stopOtherAudioInstances(audioRef.current);
      audioRef.current
        .play()
        .then(() => {
          if (!isCancelled) {
            setIsPlaying(true);
            cleanupListeners();
          }
        })
        .catch(() => {
          // Chờ tương tác tiếp theo nếu trình duyệt vẫn chặn
        });
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!isCancelled) {
            setIsPlaying(true);
          }
        })
        .catch(() => {
          if (isCancelled) return;
          // Trình duyệt chặn Autoplay cho tới khi người dùng chạm/cuộn/click lần đầu
          setIsPlaying(false);
          unlockAttached = true;
          window.addEventListener("click", handleUserUnlock, { passive: true });
          window.addEventListener("touchstart", handleUserUnlock, {
            passive: true,
          });
          window.addEventListener("keydown", handleUserUnlock, {
            passive: true,
          });
          window.addEventListener("scroll", handleUserUnlock, {
            passive: true,
          });
        });
    }

    return () => {
      isCancelled = true;
      cleanupListeners();
      // Bắt buộc dừng thẻ audio khi đổi bài hoặc khi component unmount để không bao giờ phát chồng 2 bài
      audio.pause();
    };
  }, [trackIndex, userMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      setUserMuted(true);
    } else {
      stopOtherAudioInstances(audio);
      setUserMuted(false);
      audio.volume = 0.35;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  if (trackIndex === null) return null;

  const currentTrack = INSTRUMENTAL_PLAYLIST[trackIndex];
  const trackTitle =
    locale === "en" ? currentTrack.titleEn : currentTrack.titleVi;

  return (
    <div
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playRandomNextTrack}
      />

      <div className="flex items-center gap-1.5 bg-wood-white/95 backdrop-blur-sm border-2 border-wood-light text-wood-dark p-1.5 rounded-full shadow-lg hover:border-wood-medium transition-all duration-300">
        {/* Nút Bật / Tắt nhạc */}
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={
            isPlaying
              ? locale === "en"
                ? "Pause background music"
                : "Tắt nhạc nền"
              : locale === "en"
                ? "Play background music"
                : "Bật nhạc nền"
          }
          title={
            isPlaying
              ? locale === "en"
                ? "Pause music"
                : "Tạm dừng nhạc"
              : locale === "en"
                ? "Play music"
                : "Phát nhạc"
          }
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors ${
            isPlaying
              ? "bg-wood-dark text-white hover:bg-wood-medium"
              : "bg-wood-cream text-wood-dark hover:bg-wood-light/50"
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-75" />
          )}
        </button>

        {/* Thông tin bài hát & hiệu ứng sóng nhạc */}
        <div
          onClick={togglePlayPause}
          className="hidden sm:flex cursor-pointer select-none px-1.5 items-center gap-2"
        >
          <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
            <span
              className={`w-0.5 bg-wood-medium rounded-full transition-all duration-300 ${
                isPlaying ? "h-3.5 animate-bounce" : "h-1.5 opacity-40"
              }`}
              style={{ animationDelay: "0ms" }}
            />
            <span
              className={`w-0.5 bg-wood-medium rounded-full transition-all duration-300 ${
                isPlaying ? "h-2.5 animate-bounce" : "h-1.5 opacity-40"
              }`}
              style={{ animationDelay: "150ms" }}
            />
            <span
              className={`w-0.5 bg-wood-medium rounded-full transition-all duration-300 ${
                isPlaying ? "h-3 animate-bounce" : "h-1.5 opacity-40"
              }`}
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <div className="flex flex-col max-w-[160px] lg:max-w-[200px] overflow-hidden">
            <span className="text-[11px] font-semibold leading-tight text-wood-charcoal truncate">
              {trackTitle}
            </span>
            <span className="text-[10px] text-wood-medium leading-tight truncate flex items-center gap-1">
              <Music className="w-2.5 h-2.5 shrink-0" />
              {isPlaying
                ? locale === "en"
                  ? "Playing..."
                  : "Đang phát..."
                : locale === "en"
                  ? "Tap to play"
                  : "Chạm để phát"}
            </span>
          </div>
        </div>

        {/* Nút Đổi bài ngẫu nhiên khác */}
        <button
          type="button"
          onClick={playRandomNextTrack}
          aria-label={
            locale === "en" ? "Next random track" : "Đổi bài nhạc ngẫu nhiên"
          }
          title={
            locale === "en" ? "Switch random track" : "Đổi bài ngẫu nhiên khác"
          }
          className={`min-w-[34px] min-h-[34px] flex items-center justify-center rounded-full text-wood-dark hover:bg-wood-cream hover:text-wood-medium transition-all ${
            isExpanded ? "opacity-100" : "opacity-80"
          }`}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
