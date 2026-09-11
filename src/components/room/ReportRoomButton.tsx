import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ReportRoomModal } from './ReportRoomModal';

interface ReportRoomButtonProps {
  roomId: string;
  roomName?: string;
  // 'link' — dùng trong danh sách (BookingHistory), gọn hơn nút đầy màu.
  // 'button' (mặc định) — dùng ở trang chi tiết phòng, nổi bật hơn.
  variant?: 'button' | 'link';
  className?: string;
}

// Bắt buộc đăng nhập mới tố cáo được — cùng pattern isAuthenticated -> toast.warning ->
// navigate('/login?redirect=...') đã dùng ở nút yêu thích/đặt lịch/viết đánh giá.
export const ReportRoomButton: React.FC<ReportRoomButtonProps> = ({
  roomId,
  roomName,
  variant = 'button',
  className,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.warning(t('roomDetail.toastNeedLogin'));
      navigate(`/login?redirect=/rooms/${roomId}`);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      {variant === 'link' ? (
        <button
          onClick={handleClick}
          className={className || 'inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700'}
        >
          <Flag className="w-3.5 h-3.5" />
          {t('reportRoomModal.triggerButton')}
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={
            className ||
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors'
          }
        >
          <Flag className="w-4 h-4" />
          {/* Ẩn nhãn trên màn nhỏ để đồng bộ với nút Chia sẻ / Lưu phòng cùng hàng ở trang chi tiết. */}
          <span className="hidden sm:inline">{t('reportRoomModal.triggerButton')}</span>
        </button>
      )}

      {showModal && (
        <ReportRoomModal roomId={roomId} roomName={roomName} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
