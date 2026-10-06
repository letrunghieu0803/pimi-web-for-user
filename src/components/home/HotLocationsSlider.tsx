import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { deriveTopDistricts, useSearchFacets } from '@/hooks/useSearchFacets';
import { Flame, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react';

const HOT_LOCATIONS_LIMIT = 8;

// Màu nền luân phiên cho thẻ khu vực — dữ liệu thật từ backend không kèm ảnh khu vực (trước đây là ảnh
// stock + số liệu/tag bịa trong mockData), nên dùng gradient thay vì ảnh giả.
const CARD_GRADIENTS = [
  'from-indigo-600 to-violet-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-sky-600 to-indigo-700',
  'from-rose-500 to-pink-700',
  'from-fuchsia-600 to-purple-700',
  'from-cyan-600 to-blue-700',
  'from-lime-600 to-emerald-700',
];

// Khu vực hot = các quận/huyện có nhiều phòng nhất theo search-facets thật (ngắn hạn là mặc định của
// trang tìm phòng) — giống cách app di động suy ra danh sách này. Chưa có/không có dữ liệu thì ẩn hẳn
// cả mục (không hiện tiêu đề trơ trọi).
export const HotLocationsSlider: React.FC = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { facets, isLoading } = useSearchFacets('SHORT_TERM');

  const locations = deriveTopDistricts(facets, HOT_LOCATIONS_LIMIT);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isLoading && locations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{t('home.hotLocationsTag')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t('home.hotLocationsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('home.hotLocationsSubtitle')}
          </p>
        </div>

        {/* Scroll Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label={t('home.scrollLeft')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label={t('home.scrollRight')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-none w-72 sm:w-80 h-64 bg-slate-100 rounded-3xl animate-pulse" />
            ))
          : locations.map((loc, idx) => (
              <Link
                key={`${loc.province}-${loc.name}`}
                to={`/rooms?district=${encodeURIComponent(loc.name)}`}
                className={`group relative flex-none w-72 sm:w-80 h-64 rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${CARD_GRADIENTS[idx % CARD_GRADIENTS.length]}`}
              >
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                <MapPin className="absolute -right-4 -top-4 w-36 h-36 text-white/10 group-hover:scale-110 transition-transform duration-700" />

                {/* Top Province Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-[11px] font-extrabold shadow-sm truncate max-w-full">
                    {loc.province}
                  </span>
                </div>

                {/* Bottom Info Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <h3 className="text-2xl font-black font-heading text-white">
                    {loc.name}
                  </h3>

                  <div className="pt-2 border-t border-white/20 flex items-center gap-1.5 text-xs font-semibold text-slate-100">
                    <Building className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t('home.hotLocationsRoomCount', { count: loc.roomCount })}</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};
