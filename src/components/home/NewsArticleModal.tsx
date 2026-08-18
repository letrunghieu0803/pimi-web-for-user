import React from 'react';
import { NewsArticle } from '@/data/mockData';
import { X, Calendar, Clock, Tag, Share2, BookOpen } from 'lucide-react';

interface NewsArticleModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export const NewsArticleModal: React.FC<NewsArticleModalProps> = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>{article.category}</span>
            </span>

            <h2 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              {article.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{article.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">
          {/* Excerpt Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 font-semibold text-indigo-900 italic">
            "{article.excerpt}"
          </div>

          {/* Full Article Content */}
          <div className="space-y-4 whitespace-pre-line text-slate-800 font-medium">
            {article.content}
          </div>

          {/* Article Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Cẩm nang kinh nghiệm Pimi</span>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết bài viết!');
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ bài viết</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
