import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { appointmentApi, Appointment } from '@/services/appointmentApi';
import { ViewingConfirmationPanel } from '@/components/appointment/ViewingConfirmationPanel';
import { getApiErrorMessage } from '@/utils/apiError';
import { Seo } from '@/components/common/Seo';

// Nút "Xem chi tiết" trong tin ZNS xác nhận đặt lịch gửi cho NGƯỜI XEM (xem
// zalo-zns-sender.service.ts#sendViewerAppointmentMessage bên BE) bị Zalo khoá cứng domain về
// pimi.vn — cùng cơ chế redirect-theo-môi-trường với hoá đơn (InvoiceDetail.tsx): bản deploy
// production chỉ gọi được api.pimi.vn, lịch hẹn thuộc môi trường test phải tự chuyển sang bản
// deploy test mới thấy được.
const TEST_SITE_ORIGIN = import.meta.env.VITE_TEST_SITE_URL || 'https://pimi-web-for-user.vercel.app';

// `id_appointment_view` phía ZNS luôn đủ 3 phần `{appointmentId}.{viewToken}.{env}` (viewToken
// RỖNG nếu là "tự đi xem" — SELF, xem comment trong BE) — nối bằng dấu `.` cùng lý do với
// `id_invoice`/`id_appointment` (tránh Zalo percent-encode làm hỏng query string nếu dùng `?`/`&`).
const parseComposite = (composite: string | undefined) => {
  const parts = (composite || '').split('.');
  if (parts.length !== 3) return null;
  const [appointmentId, token, env] = parts;
  if (!appointmentId) return null;
  return { appointmentId, token, env };
};

// SELF (tự đi xem) không có viewToken — người đặt lịch có tài khoản, xem lại qua trang danh sách
// đã đăng nhập của chính mình (TenantAppointments.tsx đã sẵn hỗ trợ ?highlight=, dùng chung với
// luồng mở từ thông báo trong app). PROXY (xem hộ) mới cần trang public này thật sự.
export const AppointmentPublicView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { composite } = useParams<{ composite: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const parsed = parseComposite(composite);

  useEffect(() => {
    if (!parsed) {
      setError(t('appointmentPublicView.invalidLink'));
      setLoading(false);
      return;
    }

    const isOnProductionDomain = window.location.hostname.endsWith('pimi.vn');
    if (parsed.env === 'test' && isOnProductionDomain) {
      window.location.href = `${TEST_SITE_ORIGIN}/appointment-view/${composite}`;
      return;
    }

    if (!parsed.token) {
      navigate(`/appointments?highlight=${parsed.appointmentId}`, { replace: true });
      return;
    }

    appointmentApi
      .getPublic(parsed.appointmentId, parsed.token)
      .then((res: any) => {
        setAppointment(res?.data || res);
        setError('');
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composite]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Seo title={t('appointmentPublicView.title')} path={`/appointment-view/${composite}`} noindex />
        <h2 className="text-xl font-bold text-slate-900">{error || t('appointmentPublicView.notFound')}</h2>
        <Link to="/" className="text-indigo-600 font-bold text-sm hover:underline">
          {t('appointmentPublicView.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo title={t('appointmentPublicView.title')} path={`/appointment-view/${composite}`} noindex />
      <ViewingConfirmationPanel appointment={appointment} onClose={() => navigate('/')} />
    </>
  );
};
