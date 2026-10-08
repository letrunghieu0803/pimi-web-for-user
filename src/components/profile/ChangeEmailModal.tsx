import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/services/userApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { AccountModalShell } from './AccountModalShell';

interface ChangeEmailModalProps {
  currentEmail?: string | null;
  onClose: () => void;
  /** Gọi sau khi backend đã xác nhận email mới (OTP đúng) — nơi gọi tải lại hồ sơ. */
  onChanged: (newEmail: string) => void;
}

// Đổi email 2 bước như app: (1) nhập mật khẩu hiện tại + email mới -> POST /auth/request-change-email
// (OTP gửi về email MỚI), (2) nhập OTP -> POST /auth/verify-new-email.
export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ currentEmail, onClose, onChanged }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async () => {
    setLoading(true);
    try {
      await userApi.requestChangeEmail({ currentPassword, newEmail });
      toast.success(t('profile.security.toastEmailOtpSent', { email: newEmail.trim() }));
      setCooldown(60);
      setStep(2);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.warning(t('profile.security.toastNeedCurrentPassword'));
      return;
    }
    if (!newEmail.trim() || !/^\S+@\S+\.\S+$/.test(newEmail.trim())) {
      toast.warning(t('forgotPassword.toastInvalidEmail'));
      return;
    }
    if (currentEmail && newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      toast.warning(t('profile.security.toastSameEmail'));
      return;
    }
    requestOtp();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 6) {
      toast.warning(t('verifyEmail.toastInvalidOtp'));
      return;
    }
    setLoading(true);
    try {
      await userApi.verifyNewEmail({ newEmail, otp });
      toast.success(t('profile.security.toastEmailChanged'));
      onChanged(newEmail.trim().toLowerCase());
      onClose();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500';

  return (
    <AccountModalShell
      title={t('profile.security.changeEmailTitle')}
      subtitle={step === 1 ? t('profile.security.changeEmailSubtitle') : t('profile.security.changeEmailOtpSubtitle', { email: newEmail.trim() })}
      icon={<Mail className="w-5 h-5" />}
      onClose={onClose}
    >
      {step === 1 ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('profile.security.currentPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('profile.security.newEmailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="example@gmail.com"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
            >
              {t('profile.security.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {loading ? t('forgotPassword.sending') : t('profile.security.sendOtpButton')}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('verifyEmail.otpLabel')}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-base font-mono tracking-widest text-slate-900 focus:outline-none focus:border-indigo-500"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="button"
            onClick={requestOtp}
            disabled={loading || cooldown > 0}
            className="text-xs font-bold text-indigo-600 hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? t('verifyEmail.resendCooldown', { seconds: cooldown }) : t('verifyEmail.resendButton')}
          </button>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
            >
              {t('profile.security.back')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {loading ? t('verifyEmail.verifying') : t('verifyEmail.verifyButton')}
            </button>
          </div>
        </form>
      )}
    </AccountModalShell>
  );
};
