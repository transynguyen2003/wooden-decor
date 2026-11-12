import React from "react";

interface IconProps {
  className?: string;
}

/**
 * Logo Zalo nhận diện thương hiệu (nền xanh Zalo, chữ trắng rõ nét trên cả nền Sáng & Nâu trầm).
 */
export function ZaloIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="14" fill="#0068FF" />
      <path
        d="M15.2 17.5H27.8L15.4 30.8H28.2"
        stroke="#FFFFFF"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33.5" cy="29.2" r="2.6" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Logo Facebook chuẩn nhận diện (nền xanh #1877F2, chữ f trắng).
 */
export function FacebookIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#1877F2" />
      <path
        d="M26.5 39V25.5H31L31.7 20.2H26.5V16.8C26.5 15.3 26.9 14.2 29.1 14.2H31.9V9.5C31.4 9.4 29.8 9.3 27.9 9.3C23.9 9.3 21.2 11.7 21.2 16.2V20.2H16.6V25.5H21.2V39H26.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Logo TikTok chuẩn nhận diện (nốt nhạc TikTok nổi bật trên nền tối).
 */
export function TikTokIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#111111" />
      <path
        d="M32.8 18.8C30.3 18.8 28.3 16.8 28.3 14.3V12.5H24.6V28.4C24.6 30.3 23.1 31.8 21.2 31.8C19.3 31.8 17.8 30.3 17.8 28.4C17.8 26.5 19.3 25 21.2 25C21.6 25 22 25.1 22.3 25.2V21.4C21.9 21.3 21.6 21.3 21.2 21.3C17.2 21.3 14 24.5 14 28.4C14 32.3 17.2 35.5 21.2 35.5C25.1 35.5 28.3 32.3 28.3 28.4V20.1C29.7 21.1 31.4 21.7 33.3 21.7V18.8H32.8Z"
        fill="#25F4EE"
        transform="translate(-0.7, -0.7)"
      />
      <path
        d="M32.8 18.8C30.3 18.8 28.3 16.8 28.3 14.3V12.5H24.6V28.4C24.6 30.3 23.1 31.8 21.2 31.8C19.3 31.8 17.8 30.3 17.8 28.4C17.8 26.5 19.3 25 21.2 25C21.6 25 22 25.1 22.3 25.2V21.4C21.9 21.3 21.6 21.3 21.2 21.3C17.2 21.3 14 24.5 14 28.4C14 32.3 17.2 35.5 21.2 35.5C25.1 35.5 28.3 32.3 28.3 28.4V20.1C29.7 21.1 31.4 21.7 33.3 21.7V18.8H32.8Z"
        fill="#FE2C55"
        transform="translate(0.7, 0.7)"
      />
      <path
        d="M32.8 18.8C30.3 18.8 28.3 16.8 28.3 14.3V12.5H24.6V28.4C24.6 30.3 23.1 31.8 21.2 31.8C19.3 31.8 17.8 30.3 17.8 28.4C17.8 26.5 19.3 25 21.2 25C21.6 25 22 25.1 22.3 25.2V21.4C21.9 21.3 21.6 21.3 21.2 21.3C17.2 21.3 14 24.5 14 28.4C14 32.3 17.2 35.5 21.2 35.5C25.1 35.5 28.3 32.3 28.3 28.4V20.1C29.7 21.1 31.4 21.7 33.3 21.7V18.8H32.8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
