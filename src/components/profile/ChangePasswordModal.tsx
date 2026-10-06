import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/services/userApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { getPasswordErrorKey } from '@/utils/password';
import { AccountModalShell } from './AccountModalShell';

interface ChangePasswordModalProps {
  onClose: () => void;
}

// Đổi mật khẩu khi đang đăng nhập (PUT /auth/change-password) — cần mật khẩu hiện tại; mật khẩu
// mới theo cùng bộ quy tắc với trang Quên mật khẩu (xem utils/password.ts).
export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.warning(t('profile.security.toastNeedCurrentPassword'));
      return;
    }
    const passwordErrorKey = getPasswordErrorKey(newPassword);
    if (passwordErrorKey) {
      toast.warning(t(passwordErrorKey));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning(t('forgotPassword.toastPasswordMismatch'));
      return;
    }
    if (newPassword === currentPassword) {
      toast.warning(t('profile.security.toastSamePassword'));
      return;
    }

    setLoading(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success(t('profile.security.toastPasswordChanged'));
      onClose();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500';

  return (
    <AccountModalShell
      title={t('profile.security.changePasswordTitle')}
      subtitle={t('profile.security.changePasswordSubtitle')}
      icon={<KeyRound className="w-5 h-5" />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: t('profile.security.currentPasswordLabel'), value: currentPassword, set: setCurrentPassword, auto: 'current-password' },
          { label: t('profile.security.newPasswordLabel'), value: newPassword, set: setNewPassword, auto: 'new-password' },
          { label: t('profile.security.confirmPasswordLabel'), value: confirmPassword, set: setConfirmPassword, auto: 'new-password' },
        ].map((field, idx) => (
          <div key={field.label}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{field.label}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                autoComplete={field.auto}
                className={inputClass}
                required
              />
              {idx === 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                  title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        <p className="text-[11px] text-slate-500">{t('profile.security.passwordRuleHint')}</p>

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
            {loading ? t('profile.saving') : t('profile.security.changePasswordSubmit')}
          </button>
        </div>
      </form>
    </AccountModalShell>
  );
};
