import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, NewsItem } from '@/services/newsApi';
import { Newspaper, ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';

export const NewsArticlesSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi
      .getPublicNews({ pageNumber: 1, pageSize: 10 })
      .then((res) => {
        setArticles(res.items.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <Newspaper className="w-4 h-4 text-indigo-600" />
            <span>Tin Tức & Cẩm Nang Thuê Nhà</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Kinh Nghiệm Bỏ Túi Cho Người Đi Thuê
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật luật thuê nhà, mẹo chọn phòng và quy trình ký hợp đồng an toàn nhất
          </p>
        </div>

        {/* Scroll & View More Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <span>Xem thêm 10+ bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-1.5">
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
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-none w-80 sm:w-96 h-80 bg-slate-100 rounded-3xl animate-pulse"
            />
          ))
        ) : (
          articles.map((article: NewsItem) => (
            <div
              key={article.id}
              onClick={() => navigate(`/news/${article.id}`)}
              className="group flex-none w-80 sm:w-96 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
            >
              {/* Article Image Container */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Category Badge */}
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold shadow-md backdrop-blur-md">
                  {article.category}
                </span>
              </div>

              {/* Content Container */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Date & Read time */}
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{article.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 font-heading leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                {/* Footer Read Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Đọc bài viết chi tiết</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Mobile View More Button */}
      <div className="mt-4 text-center sm:hidden">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md"
        >
          <span>Xem thêm tất cả bài viết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
