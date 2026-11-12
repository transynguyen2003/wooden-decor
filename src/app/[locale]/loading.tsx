import React from "react";

export default function LocaleLoading() {
  return (
    <div className="min-h-[70vh] w-full">
      {/* Thanh tiến trình chuyển trang mượt ở sát mép trên */}
      <div className="fixed top-0 inset-x-0 z-50 h-1 bg-wood-light/30 overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-wood-medium via-wood-dark to-wood-medium animate-pulse rounded-full" />
      </div>

      {/* Khung Skeleton nhẹ đồng bộ tông màu gỗ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-pulse">
        <div className="h-44 sm:h-56 rounded-3xl bg-wood-cream/80 border border-wood-light/40 p-8 flex flex-col justify-end space-y-3">
          <div className="h-3 w-32 bg-wood-light/60 rounded-full" />
          <div className="h-8 sm:h-10 w-2/3 max-w-md bg-wood-light/70 rounded-xl" />
          <div className="h-4 w-full max-w-lg bg-wood-light/50 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-wood-white border border-wood-light/40 overflow-hidden space-y-4 pb-5"
            >
              <div className="aspect-[4/3] bg-wood-cream/90" />
              <div className="px-5 space-y-2.5">
                <div className="h-3 w-24 bg-wood-light/50 rounded-full" />
                <div className="h-5 w-4/5 bg-wood-light/70 rounded-lg" />
                <div className="h-4 w-1/3 bg-wood-light/60 rounded-lg pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
