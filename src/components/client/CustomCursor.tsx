"use client";

import React, { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  "input",
  "textarea",
  "select",
  "label",
  "summary",
  "video",
  "article",
  ".group",
  "img",
  "[data-cursor-hover]",
].join(", ");

/**
 * Custom Cursor phong cách tối giản Bắc Âu (Scandinavian) cho Wooden Decor
 * Bảng màu:
 * - Nâu gỗ đậm: #5C3A21
 * - Nâu caramel ấm: #A67B5B
 * - Trắng kem: #FAF6F0
 * - Xanh rêu trầm: #3E5641
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const pointerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Tọa độ chuột thực tế & tọa độ nội suy (lerp) của vòng tròn bám theo
  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Tự động ẩn hoàn toàn trên thiết bị cảm ứng (mobile / tablet)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const checkDevice = () => {
      const isFinePointer = mq.matches;
      setEnabled(isFinePointer);
      if (isFinePointer) {
        document.documentElement.classList.add("custom-cursor-active");
      } else {
        document.documentElement.classList.remove("custom-cursor-active");
      }
    };

    checkDevice();
    mq.addEventListener("change", checkDevice);

    return () => {
      mq.removeEventListener("change", checkDevice);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let firstMove = true;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      targetPos.current.x = clientX;
      targetPos.current.y = clientY;

      if (firstMove) {
        ringPos.current.x = clientX;
        ringPos.current.y = clientY;
        firstMove = false;
        setIsVisible(true);
      }

      // Cập nhật tức thì vị trí mũi tên chiếc lá mộc qua translate3d (0 độ trễ)
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // Kiểm tra phần tử tương tác dưới trỏ chuột
      const targetEl = e.target as Element | null;
      const interactive = Boolean(
        targetEl && typeof targetEl.closest === "function" && targetEl.closest(INTERACTIVE_SELECTOR)
      );
      setIsHovered((prev) => (prev !== interactive ? interactive : prev));
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Vòng lặp requestAnimationFrame 60fps+ cho hiệu ứng bám theo mượt mà (smooth lerp)
    const renderLoop = () => {
      const lerpFactor = 0.18;
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x.toFixed(2)}px, ${ringPos.current.y.toFixed(2)}px, 0)`;
      }

      rafId.current = window.requestAnimationFrame(renderLoop);
    };

    rafId.current = window.requestAnimationFrame(renderLoop);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* 1. Vòng tròn ngoài chuyển động bám theo mượt mà (Smooth Lerp Ring) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className="relative flex items-center justify-center rounded-full transition-all duration-300 ease-out"
          style={{
            width: isHovered ? 56 : 34,
            height: isHovered ? 56 : 34,
            marginLeft: isHovered ? -28 : -17,
            marginTop: isHovered ? -28 : -17,
            borderWidth: isHovered ? "1.75px" : "1.25px",
            borderStyle: "solid",
            borderColor: isHovered ? "#3E5641" : "#A67B5B",
            backgroundColor: isHovered
              ? "rgba(62, 86, 65, 0.10)"
              : "rgba(166, 123, 91, 0.04)",
            boxShadow: isHovered
              ? "0 0 0 1px rgba(250, 246, 240, 0.35), 0 4px 16px rgba(62, 86, 65, 0.18)"
              : "0 0 0 1px rgba(250, 246, 240, 0.2)",
            transform: isPressed
              ? "scale(0.86)"
              : isHovered
                ? "scale(1.06)"
                : "scale(1)",
          }}
        >
          {/* Họa tiết vòng tròn vân gỗ đồng tâm mờ khi Hover vào phần tử tương tác */}
          <svg
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transition-all duration-300"
            style={{
              opacity: isHovered ? 0.55 : 0,
              transform: isHovered ? "scale(1) rotate(0deg)" : "scale(0.65) rotate(-25deg)",
            }}
          >
            {/* Vòng vân gỗ ngoài */}
            <ellipse
              cx="28"
              cy="28"
              rx="20"
              ry="18.5"
              stroke="#3E5641"
              strokeWidth="1"
              strokeDasharray="5 3"
            />
            {/* Vòng vân gỗ giữa */}
            <ellipse
              cx="28"
              cy="28"
              rx="13.5"
              ry="12"
              stroke="#A67B5B"
              strokeWidth="1"
              strokeDasharray="4 2.5"
            />
            {/* Vòng tâm gỗ */}
            <circle
              cx="28"
              cy="28"
              r="6.5"
              stroke="#3E5641"
              strokeWidth="1"
              strokeOpacity="0.85"
            />
          </svg>
        </div>
      </div>

      {/* 2. Biểu tượng mũi tên cách điệu chiếc lá mộc Bắc Âu (#5C3A21 viền #FAF6F0) */}
      <div
        ref={pointerRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            marginLeft: -2,
            marginTop: -2,
            transform: isPressed
              ? "scale(0.84)"
              : isHovered
                ? "scale(0.92)"
                : "scale(1)",
          }}
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(28, 17, 10, 0.28))",
            }}
          >
            {/* Thân mũi tên cách điệu chiếc lá mộc Bắc Âu */}
            <path
              d="M2.2 2.2C2.2 2.2 13.8 3.6 18.2 8.0C21.6 11.4 20.6 16.8 17.2 18.6C14.6 20.0 11.2 19.2 8.0 16.0C4.2 12.2 2.2 2.2 2.2 2.2Z"
              fill={isHovered ? "#3E5641" : "#5C3A21"}
              stroke="#FAF6F0"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Đường gân lá / vân gỗ tinh tế ở tâm */}
            <path
              d="M4.2 4.2L15.4 15.4"
              stroke="#FAF6F0"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            <path
              d="M9.5 9.5L14.2 8.6M11.8 11.8L10.8 15.8"
              stroke="#A67B5B"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
