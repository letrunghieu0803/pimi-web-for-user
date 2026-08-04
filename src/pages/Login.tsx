import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getApiErrorMessage } from '@/utils/apiError';
import { Building2, Phone, Lock, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if redirect query param or location state exists
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrPhone.trim()) {
      toast.warning(t('login.toastNeedPhoneOrEmail'));
      return;
    }
    if (!password) {
      toast.warning(t('login.toastNeedPassword'));
      return;
    }

    setLoading(true);
    try {
      const res = await login(usernameOrPhone.trim(), password);
      if (res.success) {
        if (res.needsVerification) {
          toast.info(res.message);
          const targetEmail = res.email || usernameOrPhone.trim();
          navigate(`/verify-email?email=${encodeURIComponent(targetEmail)}`, { replace: true });
        } else {
          toast.success(res.message);
          navigate(redirectUrl, { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            {t('login.title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('login.usernameLabel')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('login.usernamePlaceholder')}
                value={usernameOrPhone}
                onChange={(e) => setUsernameOrPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('login.passwordLabel')}
              </label>
              <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-semibold">
                {t('login.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">{t('login.quickFillLabel')}</span>
            <button
              type="button"
              onClick={() => {
                setUsernameOrPhone('0988776655');
                setPassword('123456');
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              {t('login.quickFillButton')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? t('login.submitLoading') : t('login.submitButton')}</span>
          </button>
        </form>

        {/* Register CTA Footer */}
        <div className="pt-4 border-t border-slate-200/80 text-center space-y-3">
          <p className="text-xs text-slate-600">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              {t('login.registerNow')}
            </Link>
          </p>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('login.secureNotice')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
