import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, KeyRound, UserX } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/services/userApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { AccountModalShell } from './AccountModalShell';

interface DeactivateAccountModalProps {
  email?: string | null;
  onClose: () => void;
  /** Gọi sau khi backend đã vô hiệu hoá tài khoản (OTP đúng) — nơi gọi đăng xuất + điều hướng. */
  onDeactivated: () => void;
}

// Vô hiệu hoá tài khoản như app: (1) xác nhận có chủ đích -> POST /users/me/request-deactivate-account
// (OTP gửi về email hiện tại), (2) nhập OTP -> POST /users/me/verify-deactivate-account/{otp}.
// Có thể kích hoạt lại sau bằng OTP qua email ở màn đăng nhập (xem ReactivateAccountModal).
export const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({ email, onClose, onDeactivated }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2>(1);
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
      await userApi.requestDeactivateAccount();
      toast.success(t('profile.security.toastDeactivateOtpSent'));
      setCooldown(60);
      setStep(2);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 6) {
      toast.warning(t('verifyEmail.toastInvalidOtp'));
      return;
    }
    setLoading(true);
    try {
      await userApi.verifyDeactivateAccount(otp);
      toast.success(t('profile.security.toastDeactivated'));
      onDeactivated();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountModalShell
      title={t('profile.security.deactivateTitle')}
      subtitle={step === 2 ? t('profile.security.deactivateOtpSubtitle', { email: email || '' }) : undefined}
      icon={<UserX className="w-5 h-5" />}
      onClose={onClose}
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{t('profile.security.deactivateWarning')}</span>
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
              type="button"
              onClick={requestOtp}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {loading ? t('forgotPassword.sending') : t('profile.security.deactivateSendOtp')}
            </button>
          </div>
        </div>
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
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {loading ? t('verifyEmail.verifying') : t('profile.security.deactivateConfirm')}
            </button>
          </div>
        </form>
      )}
    </AccountModalShell>
  );
};
