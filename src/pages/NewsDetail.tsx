import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { newsApi, NewsItem } from '@/services/newsApi';
import { ArrowLeft, Calendar, Clock, Share2, Newspaper, Sparkles, BookOpen, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { Seo } from '@/components/common/Seo';
import { JsonLd } from '@/components/common/JsonLd';
import { absoluteUrl } from '@/config/seo';

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    newsApi.getNewsById(id).then((data) => {
      setArticle(data);
      setLoading(false);
    });

    newsApi.getPublicNews({ pageNumber: 1, pageSize: 4 }).then((res) => {
      setRelatedNews(res.items.filter((item) => item.id !== id).slice(0, 3));
    });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Đã sao chép liên kết bài viết!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 bg-slate-200 rounded-xl w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-3xl w-full animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Newspaper className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">Không tìm thấy bài viết</h2>
        <p className="text-xs text-slate-500">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 gradient-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang tin tức</span>
        </Link>
      </div>
    );
  }

  const newsPath = `/news/${article.id}`;

  return (
    <article className="pb-20 space-y-12">
      <Seo title={article.title} description={article.excerpt} path={newsPath} image={article.image} type="article" />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          image: article.image ? [article.image] : undefined,
          datePublished: article.createdAt,
          author: { '@type': 'Organization', name: 'Pimi' },
          publisher: { '@type': 'Organization', name: 'Pimi', logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.svg') } },
          mainEntityOfPage: absoluteUrl(newsPath),
        }}
      />

      {/* Unified Width Container (Same width for header, feature image, and content) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Navigation */}
        <div className="pt-8">
          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách tin tức & cẩm nang</span>
          </button>
        </div>

        {/* Main Article Header */}
        <header className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide border border-indigo-200">
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight font-heading">
            {article.title}
          </h1>

          {/* Share Button Bar */}
          <div className="flex items-center justify-between border-y border-slate-100 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Phát hành bởi <strong>Ban Biên Tập Pimi</strong></span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Đã chép link' : 'Chia sẻ bài viết'}</span>
            </button>
          </div>

          {/* Hero Feature Image */}
          <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Article Body Content */}
        <section className="w-full overflow-hidden">
          <div
            className="prose prose-indigo prose-lg max-w-none text-slate-700 leading-relaxed font-sans space-y-6 break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-lg [&_iframe]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:font-heading [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
          />
        </section>

      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Bài Viết Liên Quan</span>
            </h3>
            <Link
              to="/news"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Xem tất cả bài viết &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer space-y-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 font-heading">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
