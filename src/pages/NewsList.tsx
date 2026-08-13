import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, NewsItem } from '@/services/newsApi';
import { Newspaper, Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/common/Pagination';

const PAGE_SIZE = 9;

export const NewsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    newsApi
      .getPublicNews({
        search,
        pageNumber,
        pageSize: PAGE_SIZE,
      })
      .then((res) => {
        setArticles(res.items);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
        setLoading(false);
      });
  }, [search, pageNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPageNumber(1);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-r from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide border border-indigo-200 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Cẩm Nang & Tin Tức Bất Động Sản Pimi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Tin Tức & <span className="gradient-text">Kinh Nghiệm Thuê Nhà</span>
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tổng hợp cẩm nang kiểm tra phòng trọ, quy trình ký hợp đồng an toàn và các thông tin thị trường cho thuê mới nhất.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2 glass-panel p-2 rounded-2xl shadow-xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, từ khóa cẩm nang..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="gradient-bg text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Main News List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Hiển thị <strong>{articles.length}</strong> / <strong>{totalItems}</strong> bài viết</span>
          </div>
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : articles.length === 0 ? (
          <div className="py-16 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Không tìm thấy bài viết</h3>
            <p className="text-xs text-slate-500">Vui lòng thử lại với từ khóa tìm kiếm khác.</p>
            <button
              onClick={() => {
                setSearch('');
                setSearchInput('');
              }}
              className="gradient-bg text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/news/${article.id}`)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Header */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold shadow-md backdrop-blur-md">
                    {article.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
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

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 font-heading leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Đọc chi tiết</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        )}
      </section>
    </div>
  );
};
