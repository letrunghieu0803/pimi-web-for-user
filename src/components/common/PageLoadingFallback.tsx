import React from 'react';
import { Loader2 } from 'lucide-react';

// Fallback hiển thị trong lúc chunk của 1 route (React.lazy) đang tải — xem App.tsx. Style mirror
// đúng spinner full-page đã dùng ở BookingHistory.tsx/VerifyEmail.tsx.
export const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);
