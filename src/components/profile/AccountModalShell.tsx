import React from 'react';
import { X } from 'lucide-react';

interface AccountModalShellProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}

// Khung modal dùng chung cho các luồng bảo mật tài khoản (đổi mật khẩu, đổi email, vô hiệu hoá,
// kích hoạt lại) — cùng 1 kiểu overlay + tiêu đề, mỗi modal chỉ tự lo phần nội dung/bước.
export const AccountModalShell: React.FC<AccountModalShellProps> = ({ title, subtitle, icon, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);
