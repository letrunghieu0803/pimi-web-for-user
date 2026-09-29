import React from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { CheckCircle2, MapPin, CalendarClock, User, Wallet, BookOpen, X } from 'lucide-react';
import { Appointment } from '@/services/appointmentApi';

interface ViewingConfirmationPanelProps {
  appointment: Appointment;
  onClose: () => void;
}

// BE trả rentRoom.price là Prisma Decimal — serialize JSON thành STRING (vd "5600000"), không
// phải number dù type khai báo là `number` — ép Number() trước khi toLocaleString(), nếu không
// String.prototype.toLocaleString() chỉ trả nguyên chuỗi, mất dấu phân cách hàng nghìn.
const formatPrice = (price?: number | string) => {
  if (price === undefined || price === null) return null;
  const numeric = Number(price);
  if (Number.isNaN(numeric)) return null;
  return `${numeric.toLocaleString('vi-VN')}đ`;
};

// viewingStartTime/viewingEndTime là DateTime "neo UTC" (giờ hiển thị được BE cộng thẳng vào UTC
// midnight, không mang ý nghĩa múi giờ thật — xem AppointmentsService.create() và
// AvailabilityCalendarGrid.tsx bên owner dùng cùng quy ước). PHẢI ép timeZone: 'UTC' khi format,
// nếu không trình duyệt sẽ tự quy đổi theo múi giờ máy khách (vd chọn slot 10:00 nhưng hiện
// 17:00 nếu máy chạy UTC+7).
const formatDateTimeRange = (start?: string, end?: string) => {
  if (!start) return null;
  const startDate = new Date(start);
  const datePart = startDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  const startTime = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  const endTime = end ? new Date(end).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : null;
  return endTime ? `${datePart}, ${startTime} - ${endTime}` : `${datePart}, ${startTime}`;
};

// Bước 3/3 — hiện NGAY sau khi đặt thành công (panel thật, không phải toast, theo đúng yêu cầu
// sản phẩm vì đây là bước khách cần lưu lại/chụp màn hình thông tin xem nhà). Đúng 5 mục: địa
// chỉ, ngày giờ xem, tên người xem, giá phòng, hướng dẫn xem nhà (nếu có). Response tạo lịch hẹn
// đã trả sẵn đủ dữ liệu (rentHouse/rentRoom/guideContent đầy đủ) — không cần gọi thêm request nào.
export const ViewingConfirmationPanel: React.FC<ViewingConfirmationPanelProps> = ({ appointment, onClose }) => {
  const { t } = useTranslation();

  const dateTimeLabel = formatDateTimeRange(appointment.viewingStartTime, appointment.viewingEndTime);
  const priceLabel = formatPrice(appointment.rentRoom?.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 text-center border-b border-slate-100 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">{t('viewingConfirmationPanel.title')}</h2>
          <p className="text-xs text-slate-500 mt-1">{t('viewingConfirmationPanel.subtitle')}</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* 1. Địa chỉ xem */}
          {appointment.rentHouse?.address && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t('viewingConfirmationPanel.addressLabel')}</p>
                <p className="text-sm font-semibold text-slate-800">{appointment.rentHouse.address}</p>
              </div>
            </div>
          )}

          {/* 2. Ngày giờ đặt xem */}
          {dateTimeLabel && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CalendarClock className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t('viewingConfirmationPanel.dateTimeLabel')}</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{dateTimeLabel}</p>
              </div>
            </div>
          )}

          {/* 3. Tên người xem */}
          {appointment.expectedOccupantName && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t('viewingConfirmationPanel.viewerNameLabel')}</p>
                <p className="text-sm font-semibold text-slate-800">
                  {appointment.expectedOccupantName}
                  {appointment.viewerType === 'PROXY' && (
                    <span className="ml-1.5 text-[11px] font-semibold text-amber-600">({t('viewingConfirmationPanel.proxyTag')})</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 4. Giá phòng */}
          {priceLabel && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Wallet className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t('viewingConfirmationPanel.priceLabel')}</p>
                <p className="text-sm font-semibold text-slate-800">{priceLabel} {t('roomDetail.perMonthLong')}</p>
              </div>
            </div>
          )}

          {/* 5. Cách thức xem phòng / lưu ý — chỉ hiện khi chủ nhà đã cấu hình mẫu hướng dẫn mặc
              định (guideContent snapshot ngay lúc tạo lịch hẹn). Sanitize trước khi render — cùng
              cách TenantAppointments.tsx đang làm với field này (HTML do chủ nhà soạn). */}
          {appointment.guideContent && (
            <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl">
              <span className="font-bold flex items-center gap-1.5 mb-1.5 text-xs text-sky-900">
                <BookOpen className="w-3.5 h-3.5" /> {t('viewingConfirmationPanel.guideLabel')}
              </span>
              <div
                className="text-xs text-sky-900 [&_p]:mb-2 [&_img]:rounded-lg [&_img]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(appointment.guideContent) }}
              />
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-3 rounded-2xl gradient-bg text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
          >
            {t('viewingConfirmationPanel.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
