import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { appointmentApi } from '@/services/appointmentApi';
import { userApi, UserMe } from '@/services/userApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import {
  User,
  Phone,
  Mail,
  Save,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Bell,
  Cake,
  MailCheck,
  MailWarning,
  KeyRound,
  UserX,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { ChangeEmailModal } from '@/components/profile/ChangeEmailModal';
import { DeactivateAccountModal } from '@/components/profile/DeactivateAccountModal';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Đếm lịch hẹn xem phòng THẬT của người thuê (GET /appointments/tenant, chỉ cần metadata.total nên
// kéo pageSize=1) thay vì danh sách giả trong localStorage như trước. "Chờ duyệt" gộp cả luồng mới
// (PENDING_APPROVAL) lẫn luồng cũ (PENDING_OWNER), "đã xác nhận" là CONFIRMED.
const fetchAppointmentCounts = async () => {
  const countBy = async (status?: string): Promise<number> => {
    try {
      const res: any = await appointmentApi.getTenantAppointments({ status, pageNumber: 1, pageSize: 1 });
      return res?.data?.metadata?.total ?? res?.metadata?.total ?? 0;
    } catch {
      return 0;
    }
  };
  const [total, pendingApproval, pendingOwner, confirmed] = await Promise.all([
    countBy(),
    countBy('PENDING_APPROVAL'),
    countBy('PENDING_OWNER'),
    countBy('CONFIRMED'),
  ]);
  return { total, pending: pendingApproval + pendingOwner, confirmed };
};

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: notifState, enableNotifications, isSupported: notifSupported } = useNotificationPermission();

  // Key kèm id người dùng để đổi tài khoản trên cùng trình duyệt không hiện nhầm hồ sơ cache của người trước.
  const meQueryKey = ['users-me', user?.id];

  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: meQueryKey,
    queryFn: userApi.getMe,
    enabled: !!user,
  });

  const { data: counts } = useQuery({
    queryKey: ['profile-appointment-counts', user?.id],
    queryFn: fetchAppointmentCounts,
    enabled: !!user,
  });

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [saving, setSaving] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [modal, setModal] = useState<'password' | 'email' | 'deactivate' | null>(null);

  // Điền form từ hồ sơ thật mỗi khi tải/tải lại xong (sau lưu, đổi email...).
  useEffect(() => {
    if (!me) return;
    setLastName(me.lastName || '');
    setFirstName(me.firstName || '');
    setPhoneNumber(me.phoneNumber || '');
    setBirthday(me.birthday && ISO_DATE_REGEX.test(me.birthday) ? me.birthday : '');
  }, [me]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Seo title={t('profile.title')} path="/profile" noindex />
        <h2 className="text-xl font-bold text-slate-900 font-heading">{t('profile.notLoggedIn')}</h2>
        <Link to="/login" className="gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md inline-block">
          {t('profile.loginAccount')}
        </Link>
      </div>
    );
  }

  // Email đã xác thực OTP khi verifyStatus khác NEW_REGISTER (các mức sau đều ngầm hiểu đã xác thực email).
  const emailVerified = !!me?.verifyStatus && me.verifyStatus !== 'NEW_REGISTER';
  const displayName =
    [me?.lastName, me?.firstName].filter(Boolean).join(' ') || user.fullName || me?.email || user.email || '';
  const displayEmail = me?.email || user.email;
  const displayPhone = me?.phoneNumber || user.phoneNumber;
  const initial = (displayName.trim().charAt(0) || '?').toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName.trim() || !firstName.trim()) {
      toast.warning(t('profile.toastNeedName'));
      return;
    }
    if (!phoneNumber.trim() || !/^\d{9,11}$/.test(phoneNumber.trim())) {
      toast.warning(t('profile.toastInvalidPhone'));
      return;
    }

    // Chỉ gửi field đã đổi — backend từ chối body rỗng, và không cần ghi đè field người dùng
    // không đụng tới (vd birthday ở định dạng cũ không đọc được vào ô ngày).
    const payload: { lastName?: string; firstName?: string; phoneNumber?: string; birthday?: string } = {};
    if (lastName.trim() !== (me?.lastName || '')) payload.lastName = lastName.trim();
    if (firstName.trim() !== (me?.firstName || '')) payload.firstName = firstName.trim();
    if (phoneNumber.trim() !== (me?.phoneNumber || '')) payload.phoneNumber = phoneNumber.trim();
    const originalBirthday = me?.birthday && ISO_DATE_REGEX.test(me.birthday) ? me.birthday : '';
    if (birthday && birthday !== originalBirthday) payload.birthday = birthday;

    if (Object.keys(payload).length === 0) {
      toast.info(t('profile.toastNoChanges'));
      return;
    }

    setSaving(true);
    try {
      const updated = await userApi.updateMe(payload);
      const merged: UserMe = { ...(me as UserMe), ...updated };
      queryClient.setQueryData(meQueryKey, merged);
      // Đồng bộ lại hồ sơ cache (navbar/đặt lịch dùng tên + SĐT từ AuthContext).
      updateProfile({
        fullName: [merged.lastName, merged.firstName].filter(Boolean).join(' '),
        phoneNumber: merged.phoneNumber || '',
      });
      toast.success(t('profile.toastUpdateSuccess'));
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Gửi OTP xác thực email rồi chuyển sang trang nhập mã — cùng luồng với lúc đăng ký/đăng nhập
  // khi email chưa xác thực (VerifyEmail.tsx tự cấp lại phiên + tải lại hồ sơ khi OTP đúng).
  const handleVerifyEmail = async () => {
    if (!displayEmail) return;
    setSendingVerify(true);
    try {
      await userApi.sendVerifyEmailOtp(displayEmail);
      toast.success(t('verifyEmail.toastResendSuccess'));
      navigate(`/verify-email?email=${encodeURIComponent(displayEmail)}`);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSendingVerify(false);
    }
  };

  const handleEmailChanged = (newEmail: string) => {
    updateProfile({ email: newEmail });
    // Email mới đã qua OTP nên coi là đã xác thực — tải lại từ backend cho chắc chắn đúng trạng thái.
    queryClient.invalidateQueries({ queryKey: meQueryKey });
  };

  const handleDeactivated = () => {
    setModal(null);
    logout();
    navigate('/', { replace: true });
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500';
  const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Seo title={t('profile.title', { defaultValue: 'Hồ sơ cá nhân' })} path="/profile" noindex />

      {/* Header Profile Badge */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full gradient-bg text-white flex items-center justify-center text-3xl font-black border-4 border-indigo-100 shadow-md shrink-0">
          {initial}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-heading">{displayName}</h1>
            {/* Huy hiệu KYC chỉ hiện khi backend xác nhận tài khoản đã xác thực (isVerified). */}
            {me?.isVerified && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                {t('profile.verifiedTenant')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {displayPhone || t('profile.noPhone')} • {displayEmail || t('profile.noEmail')}
          </p>
          {displayEmail && !meLoading && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <MailCheck className="w-3.5 h-3.5" />
                  {t('profile.emailVerified')}
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <MailWarning className="w-3.5 h-3.5" />
                    {t('profile.emailNotVerified')}
                  </span>
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={sendingVerify}
                    className="text-[11px] font-bold text-indigo-600 hover:underline disabled:opacity-50"
                  >
                    {sendingVerify ? t('forgotPassword.sending') : t('profile.verifyEmailAction')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <Link
          to="/bookings"
          className="px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-all flex items-center gap-2"
        >
          <CalendarCheck className="w-4 h-4 text-indigo-600" />
          <span>{t('profile.viewBookingHistory')}</span>
        </Link>
      </div>

      {/* Booking Statistics Summary Cards — số liệu thật từ GET /appointments/tenant, ẩn cho tới
          khi tải xong để không nhấp nháy số 0 giả. */}
      {counts && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/appointments" className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-heading">{counts.total}</span>
              <span className="block text-xs text-slate-500 font-semibold">{t('profile.totalAppointments')}</span>
            </div>
          </Link>

          <Link to="/appointments" className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-heading">{counts.pending}</span>
              <span className="block text-xs text-slate-500 font-semibold">{t('profile.pendingApproval')}</span>
            </div>
          </Link>

          <Link to="/appointments" className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-heading">{counts.confirmed}</span>
              <span className="block text-xs text-slate-500 font-semibold">{t('profile.confirmedViewing')}</span>
            </div>
          </Link>
        </div>
      )}

      {/* Push Notification Toggle */}
      {notifSupported && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t('profile.pushNotificationTitle')}</p>
              <p className="text-xs text-slate-500">
                {notifState === 'granted'
                  ? t('profile.pushEnabled')
                  : notifState === 'denied'
                    ? t('profile.pushDenied')
                    : t('profile.pushPrompt')}
              </p>
            </div>
          </div>
          {notifState !== 'granted' && (
            <button
              onClick={enableNotifications}
              disabled={notifState === 'requesting' || notifState === 'denied'}
              className="px-4 py-2.5 rounded-2xl gradient-bg text-white font-bold text-xs shadow-md disabled:opacity-50 shrink-0"
            >
              {notifState === 'requesting' ? t('profile.pushEnabling') : t('profile.pushEnableButton')}
            </button>
          )}
        </div>
      )}

      {/* Edit Form */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>{t('profile.editTitle')}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('profile.lastNameLabel')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('profile.firstNameLabel')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('profile.phoneLabel')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('profile.birthdayLabel')}</label>
              <div className="relative">
                <Cake className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  value={birthday}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setBirthday(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Email chỉ đọc ở đây — đổi email phải qua luồng OTP riêng (nút bên dưới). */}
          <div>
            <label className={labelClass}>{t('profile.emailLabel')}</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={displayEmail || ''}
                  readOnly
                  className={`${inputClass} text-slate-500 cursor-not-allowed`}
                />
              </div>
              <button
                type="button"
                onClick={() => setModal('email')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shrink-0"
              >
                {t('profile.security.changeEmailButton')}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || meLoading}
              className="gradient-bg text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t('profile.saving') : t('profile.saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Security */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
        <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>{t('profile.security.title')}</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t('profile.security.changePasswordTitle')}</p>
              <p className="text-xs text-slate-500">{t('profile.security.changePasswordSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModal('password')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs shrink-0"
          >
            {t('profile.security.changePasswordButton')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-700">{t('profile.security.deactivateTitle')}</p>
              <p className="text-xs text-rose-600/80">{t('profile.security.deactivateHint')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModal('deactivate')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0"
          >
            {t('profile.security.deactivateButton')}
          </button>
        </div>
      </div>

      {modal === 'password' && <ChangePasswordModal onClose={() => setModal(null)} />}
      {modal === 'email' && (
        <ChangeEmailModal currentEmail={displayEmail} onClose={() => setModal(null)} onChanged={handleEmailChanged} />
      )}
      {modal === 'deactivate' && (
        <DeactivateAccountModal email={displayEmail} onClose={() => setModal(null)} onDeactivated={handleDeactivated} />
      )}
    </div>
  );
};
