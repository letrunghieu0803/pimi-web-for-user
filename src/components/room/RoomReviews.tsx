import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquareText, EyeOff, Loader2 } from 'lucide-react';
import { reviewApi, RoomReview } from '@/services/reviewApi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getApiErrorMessage } from '@/utils/apiError';

const PAGE_SIZE = 10;

const StarRow: React.FC<{ score: number; size?: number }> = ({ score, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        style={{ width: size, height: size }}
        className={n <= score ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
      />
    ))}
  </div>
);

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const authorInitial = (author: RoomReview['author']) => {
  const name = [author?.firstName, author?.lastName].filter(Boolean).join(' ');
  return name ? name.charAt(0).toUpperCase() : '?';
};

const authorName = (author: RoomReview['author'], t: (k: string) => string) => {
  const name = [author?.lastName, author?.firstName].filter(Boolean).join(' ');
  return name || t('roomReviews.anonymousTenant');
};

export const RoomReviews: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [summary, setSummary] = useState({ avgScore: null as number | null, scoredReviewCount: 0, totalReviews: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [canReview, setCanReview] = useState(false);
  const [myReview, setMyReview] = useState<RoomReview | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formScore, setFormScore] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = (pageNumber: number) => {
    setLoading(true);
    reviewApi
      .getRoomReviews(roomId, { pageNumber, pageSize: PAGE_SIZE })
      .then((res) => {
        setReviews((prev) => (pageNumber === 1 ? res.reviews : [...prev, ...res.reviews]));
        setSummary(res.summary);
        setTotalPages(res.totalPages);
        setPage(pageNumber);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!roomId) return;
    fetchReviews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !isAuthenticated) {
      setCanReview(false);
      setMyReview(null);
      return;
    }
    reviewApi.getEligibility(roomId).then((res) => {
      setCanReview(res.canReview);
      setMyReview(res.myReview);
      if (res.myReview) {
        setFormScore(res.myReview.score ?? 0);
        setFormComment(res.myReview.comment ?? '');
      }
    });
  }, [roomId, isAuthenticated]);

  const openForm = () => {
    if (!isAuthenticated) {
      toast.warning(t('roomDetail.toastNeedLogin'));
      navigate(`/login?redirect=/rooms/${roomId}`);
      return;
    }
    setShowForm(true);
  };

  const handleSubmitReview = async () => {
    if (formScore < 1) {
      toast.warning(t('roomReviews.scoreRequired'));
      return;
    }
    setSubmitting(true);
    try {
      const saved = await reviewApi.upsertMyReview(roomId, {
        score: formScore,
        comment: formComment.trim() || undefined,
      });
      setMyReview(saved);
      setShowForm(false);
      toast.success(t('roomReviews.submitSuccess'));
      fetchReviews(1);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-indigo-600" />
            {t('roomReviews.title')}
          </h2>
          {summary.scoredReviewCount > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 font-heading">
                {summary.avgScore?.toFixed(1)}
              </span>
              <StarRow score={Math.round(summary.avgScore || 0)} />
              <span className="text-xs text-slate-500">
                {t('roomReviews.reviewCount', { count: summary.totalReviews })}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-1">{t('roomReviews.noReviewsYet')}</p>
          )}
        </div>

        {canReview && !showForm && (
          <button
            onClick={openForm}
            className="px-4 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-transform shrink-0"
          >
            {myReview ? t('roomReviews.editButton') : t('roomReviews.writeButton')}
          </button>
        )}
        {!canReview && !myReview && isAuthenticated && (
          <span className="text-[11px] text-slate-400 max-w-[220px] text-right">
            {t('roomReviews.notEligibleHint')}
          </span>
        )}
      </div>

      {showForm && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <StarPicker value={formScore} onChange={setFormScore} />
          <textarea
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder={t('roomReviews.commentPlaceholder')}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs disabled:opacity-60"
            >
              {submitting ? t('roomReviews.submitting') : t('roomReviews.submitButton')}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
            >
              {t('roomReviews.cancelButton')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5 divide-y divide-slate-100">
        {reviews.map((r) => (
          <div key={r.id} className="pt-5 first:pt-0">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                {authorInitial(r.author)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-800">{authorName(r.author, t)}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="mt-1">
                  {r.isHiddenScore || r.score === null ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 italic">
                      <EyeOff className="w-3 h-3" />
                      {t('roomReviews.scoreHidden')}
                    </span>
                  ) : (
                    <StarRow score={r.score} />
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1.5">
                  {r.isHiddenComment || r.comment === null ? (
                    <span className="inline-flex items-center gap-1 text-slate-400 italic text-xs">
                      <EyeOff className="w-3 h-3" />
                      {t('roomReviews.commentHidden')}
                    </span>
                  ) : (
                    r.comment
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}

        {!loading && reviews.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">{t('roomReviews.emptyList')}</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-3">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        </div>
      )}

      {!loading && page < totalPages && (
        <button
          onClick={() => fetchReviews(page + 1)}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
        >
          {t('roomReviews.loadMore')}
        </button>
      )}
    </div>
  );
};
