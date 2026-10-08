import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Seo } from '@/components/common/Seo';

// Nút "Xem chi tiết" trong tin ZNS lịch hẹn (xem zalo-zns-sender.service.ts#sendAppointmentMessage
// bên BE) bị Zalo khoá cứng domain về pimi.vn (domain đã xác thực với Zalo, giống hệt cách hoá đơn
// dùng pimi.vn/invoice) — nhưng trang chi tiết lịch hẹn THẬT nằm ở Web-Pimi-for-owner (app khác,
// hiện chỉ deploy trên Vercel, CHƯA có subdomain pimi.vn riêng). Trang này chỉ làm 1 việc: đọc
// `id_appointment` rồi chuyển hướng toàn trang (window.location, khác origin — không phải điều
// hướng React Router) sang đúng bản Web-Pimi-for-owner, không hiển thị nội dung gì cả.
const OWNER_WEB_ORIGIN =
  import.meta.env.VITE_OWNER_WEB_URL || 'https://pimi-web-for-house-owner.vercel.app';
// Chưa có bản deploy test riêng cho Web-Pimi-for-owner tại thời điểm viết — mặc định trùng bản
// production, ghi đè qua env khi có bản test thật (xem .env.example).
const OWNER_WEB_TEST_ORIGIN = import.meta.env.VITE_OWNER_WEB_TEST_URL || OWNER_WEB_ORIGIN;

// `id_appointment` phía ZNS là chuỗi ghép `{appointmentId}.{env}` (dấu `/` đầu do BE tự thêm khi
// nối vào base URL phía Zalo — xem comment trong zalo-zns-sender.service.ts) — nối bằng dấu `.`
// thay vì query string, cùng lý do với `id_invoice` ở InvoiceDetail.tsx.
const parseComposite = (composite: string | undefined) => {
  const parts = (composite || '').split('.');
  if (parts.length !== 2) return null;
  const [appointmentId, env] = parts;
  if (!appointmentId) return null;
  return { appointmentId, env };
};

// Không cần đăng nhập/gọi API ở đây — chỉ chuyển tiếp sang đúng bản Web-Pimi-for-owner, nơi chủ
// nhà/cộng tác viên (đã đăng nhập sẵn trên trình duyệt của họ) xem được chi tiết lịch hẹn qua
// `AppointmentList.tsx` (đọc query param `highlight`, xem AvailabilityCalendarGrid.tsx cùng quy ước).
export const AppointmentRedirect: React.FC = () => {
  const { t } = useTranslation();
  const { composite } = useParams<{ composite: string }>();
  const parsed = parseComposite(composite);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!parsed) {
      setInvalid(true);
      return;
    }
    const targetOrigin = parsed.env === 'test' ? OWNER_WEB_TEST_ORIGIN : OWNER_WEB_ORIGIN;
    window.location.href = `${targetOrigin}/appointments?highlight=${parsed.appointmentId}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composite]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <Seo title={t('appointmentRedirect.redirecting')} path={`/appointment/${composite}`} noindex />
      {invalid ? (
        <>
          <h2 className="text-xl font-bold text-slate-900">{t('appointmentRedirect.invalidLink')}</h2>
          <Link to="/" className="text-indigo-600 font-bold text-sm hover:underline">
            {t('appointmentRedirect.backToHome')}
          </Link>
        </>
      ) : (
        <>
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">{t('appointmentRedirect.redirecting')}</p>
        </>
      )}
    </div>
  );
};
