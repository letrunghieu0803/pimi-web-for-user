import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Building2, Phone, Lock, LogIn, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState('0988776655');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.warning('Vui lòng nhập số điện thoại!');
      return;
    }
    if (!password) {
      toast.warning('Vui lòng nhập mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const res = await login(phoneNumber.trim(), password);
      if (res.success) {
        toast.success(res.message);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Đăng nhập không thành công!');
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
            Đăng Nhập Tài Khoản
          </h1>
          <p className="text-xs text-slate-500">
            Quản lý lịch hẹn xem phòng và thông tin cá nhân của bạn.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Số điện thoại *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="Ví dụ: 0988776655"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mật khẩu *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="Mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Thử nghiệm nhanh với SĐT mẫu</span>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('0988776655');
                setPassword('123456');
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Điền tài khoản mẫu
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}</span>
          </button>
        </form>

        {/* Register CTA Footer */}
        <div className="pt-4 border-t border-slate-200/80 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Bạn chưa có tài khoản Pimi?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Đăng ký tài khoản mới ngay
            </Link>
          </p>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Thông tin người thuê được bảo mật 100%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
