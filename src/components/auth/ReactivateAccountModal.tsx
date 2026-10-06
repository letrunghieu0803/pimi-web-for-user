import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, KeyRound, UserCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/services/userApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { AccountModalShell } from '@/components/profile/AccountModalShell';

interface ReactivateAccountModalProps {
  /** Email điền sẵn nếu người dùng đã đăng nhập bằng email; để trống nếu đăng nhập bằng SĐT/username. */
  initialEmail?: string;
  onClose: () => void;
  /** Gọi sau khi backend đã kích hoạt lại tài khoản — nơi gọi báo người dùng đăng nhập lại. */
  onReactivated: () => void;
}

// Kích hoạt lại tài khoản đã vô hiệu hoá: (1) nhập email -> POST /users/request-reactivate-account
// (OTP gửi về email), (2) nhập OTP -> POST /users/verify-reactivate-account. Cả 2 endpoint đều
// công khai (chưa đăng nhập được khi tài khoản đang bị vô hiệu hoá).
export const ReactivateAccountModal: React.FC<ReactivateAccountModalProps> = ({ initialEmail, onClose, onReactivated }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail || '');
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
      await userApi.requestReactivateAccount(email);
      toast.success(t('reactivateAccount.toastOtpSent'));
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
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.warning(t('forgotPassword.toastInvalidEmail'));
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
      await userApi.verifyReactivateAccount({ email, otp });
      toast.success(t('reactivateAccount.toastReactivated'));
      onReactivated();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountModalShell
      title={t('reactivateAccount.title')}
      subtitle={step === 1 ? t('reactivateAccount.subtitle') : t('reactivateAccount.otpSubtitle', { email: email.trim() })}
      icon={<UserCheck className="w-5 h-5" />}
      onClose={onClose}
    >
      {step === 1 ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('forgotPassword.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
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
              {loading ? t('verifyEmail.verifying') : t('reactivateAccount.confirmButton')}
            </button>
          </div>
        </form>
      )}
    </AccountModalShell>
  );
};
