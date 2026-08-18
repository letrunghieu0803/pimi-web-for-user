import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bannerApi, BannerItem } from '@/services/bannerApi';

const AUTO_ADVANCE_MS = 5000;

/**
 * Slide banner quảng cáo/khuyến mãi do admin quản lý, hiển thị ở đầu trang chủ. Chỉ tiêu đề
 * (title) được render đè lên ảnh — description không hiển thị ở đây (chỉ dùng nội bộ cho admin/
 * SEO meta, xem RoomDetail.tsx-style Seo component ở các trang khác). Theo yêu cầu, title chỉ
 * HIỆN KHI DI CHUỘT VÀO (hover) — mặc định ẩn để ảnh banner sạch, không bị chữ che.
 *
 * Lưu ý SEO: title vẫn luôn nằm trong DOM (chỉ ẩn bằng opacity, không phải display:none) nên
 * Google vẫn đọc được nội dung dù người dùng chưa hover — không mất giá trị SEO ban đầu.
 */
export const BannerSlider: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    bannerApi.getPublicBanners().then(setBanners);
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (banners.length === 0) return null;

  // Chuẩn hoá lại activeIndex về phạm vi hợp lệ — phòng trường hợp danh sách banner thay đổi
  // (ví dụ admin xoá bớt banner) khiến index cũ vượt quá số lượng hiện có, banner sẽ không còn
  // slide nào hiển thị (mọi slide đều opacity-0) nếu không chuẩn hoá lại theo cách này.
  const safeActiveIndex = activeIndex % banners.length;

  const goTo = (index: number) => setActiveIndex((index + banners.length) % banners.length);

  const renderSlideContent = (banner: BannerItem) => (
    <>
      <img
        src={banner.imageLink}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-white font-heading drop-shadow-sm">
          {banner.title}
        </h2>
      </div>
    </>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="relative h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden shadow-xl border border-slate-200/60"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {banners.map((banner, index) => {
          const isExternal = !!banner.linkUrl && /^https?:\/\//.test(banner.linkUrl);
          const isInternal = !!banner.linkUrl && !isExternal;
          const slideClassName = `group absolute inset-0 transition-opacity duration-700 ${
            index === safeActiveIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
          }`;

          if (isExternal) {
            return (
              <a
                key={banner.id}
                href={banner.linkUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className={slideClassName}
              >
                {renderSlideContent(banner)}
              </a>
            );
          }
          if (isInternal) {
            return (
              <Link key={banner.id} to={banner.linkUrl!} className={slideClassName}>
                {renderSlideContent(banner)}
              </Link>
            );
          }
          return (
            <div key={banner.id} className={slideClassName}>
              {renderSlideContent(banner)}
            </div>
          );
        })}

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeActiveIndex - 1)}
              aria-label="Slide trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(safeActiveIndex + 1)}
              aria-label="Slide sau"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Xem slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === safeActiveIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
