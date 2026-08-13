import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HOT_LOCATIONS, HotLocation } from '@/data/mockData';
import { Flame, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react';

export const HotLocationsSlider: React.FC = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>Khu Vực Tìm Kiếm Hot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Địa Điểm Thuê Trọ Phổ Biến Nhất
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Khám phá phòng trọ chính chủ tại các quận trung tâm có lượt tìm kiếm cao nhất
          </p>
        </div>

        {/* Scroll Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label="Scroll right"
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
        {HOT_LOCATIONS.map((loc: HotLocation) => (
          <Link
            key={loc.id}
            to={`/rooms?district=${encodeURIComponent(loc.district)}`}
            className="group relative flex-none w-72 sm:w-80 h-96 rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Background Image */}
            <img
              src={loc.image}
              alt={loc.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

            {/* Top Tag Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                {loc.tag}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-900 text-[11px] font-extrabold shadow-sm">
                {loc.city}
              </span>
            </div>

            {/* Bottom Info Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{loc.district}</span>
              </div>

              <h3 className="text-2xl font-black font-heading text-white group-hover:text-indigo-200 transition-colors">
                {loc.name}
              </h3>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{loc.roomCount}</span>
                </div>
                <span className="text-emerald-400 font-bold">{loc.avgPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
