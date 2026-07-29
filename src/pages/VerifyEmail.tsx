import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { axiosClient } from '@/services/axiosClient';
import { MailCheck, KeyRound, RefreshCw, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, markEmailVerified } = useAuth();

  const emailParam = searchParams.get('email') || user?.email || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Cooldown countdown timer for resend OTP button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      toast.warning('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }

    if (!otp.trim() || otp.length < 6) {
      toast.warning('Vui lòng nhập mã OTP xác thực gồm 6 chữ số!');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/v1/auth/verify-email', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      markEmailVerified();
      toast.success('Xác thực Email thành công! Bạn đã có thể sử dụng đầy đủ các tính năng của Pimi.');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.warn('Verify email error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Mã OTP xác thực không đúng hoặc đã hết hạn!';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.warning('Vui lòng nhập địa chỉ email!');
      return;
    }
    if (cooldown > 0) return;

    setResending(true);
    try {
      await axiosClient.post('/v1/auth/send-verify-email-otp', {
        email: email.trim().toLowerCase(),
      });
      toast.success('Mã OTP xác thực mới đã được gửi tới email của bạn!');
      setCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể gửi lại mã OTP!';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
            <MailCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Xác Thực Địa Chỉ Email
          </h1>
          <p className="text-xs text-slate-500">
            Vui lòng nhập mã OTP 6 chữ số được gửi tới email <br />
            <strong className="text-indigo-600 font-semibold">{email || 'của bạn'}</strong>
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          
          {/* Email field if empty */}
          {!emailParam && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Địa chỉ Email *
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          )}

          {/* OTP Code Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mã OTP xác thực (6 chữ số) *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-base font-mono tracking-widest text-slate-900 focus:outline-none focus:border-indigo-500"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Đang xác thực...' : 'Xác Thực Email'}</span>
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3 text-center">
          <p className="text-xs text-slate-500">
            Mã OTP chưa tới hoặc đã hết hạn?
          </p>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || cooldown > 0}
            className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {cooldown > 0
                ? `Gửi lại mã xác thực (${cooldown}s)`
                : resending
                ? 'Đang gửi...'
                : 'Gửi Lại Mã Xác Thực'}
            </span>
          </button>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
