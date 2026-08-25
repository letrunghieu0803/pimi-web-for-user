import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

// Khối "trống dữ liệu" dùng chung — trước đây mỗi trang (Phòng yêu thích, Đã xem gần đây, Danh
// sách phòng...) tự viết lại y hệt cấu trúc này với vài chi tiết lệch nhau (khung vuông bo góc
// vs khung tròn, đệm/màu khác nhau) — gom về đây để đổi 1 chỗ là đồng bộ khắp nơi.
type EmptyStateTone = 'rose' | 'indigo' | 'amber' | 'emerald';

const TONE_STYLES: Record<EmptyStateTone, { bg: string; text: string }> = {
  rose: { bg: 'bg-rose-50', text: 'text-rose-300' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-300' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-400' },
};

interface EmptyStateProps {
  icon: LucideIcon;
  tone?: EmptyStateTone;
  title: string;
  description: string;
  actionLabel?: string;
  // Chỉ truyền 1 trong 2: actionTo để điều hướng (Link), onAction cho hành động tại chỗ (vd reset bộ lọc).
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  tone = 'indigo',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) => {
  const toneStyle = TONE_STYLES[tone];
  const actionClassName =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gradient-bg text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform';

  return (
    <div className={`glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 ${className}`}>
      <div className={`w-16 h-16 rounded-full ${toneStyle.bg} flex items-center justify-center mx-auto`}>
        <Icon className={`w-8 h-8 ${toneStyle.text}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className={actionClassName}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button onClick={onAction} className={actionClassName}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
