import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Bọc quanh toàn bộ nội dung route trong App.tsx (ngoài Suspense) — trước đây KHÔNG có
// ErrorBoundary/componentDidCatch nào trong app, nên 1 lỗi runtime bất kỳ (throw trong render,
// lifecycle...) làm React unmount toàn cây và người dùng thấy màn trắng, không có cách nào tự
// khôi phục ngoài việc tự bấm reload trình duyệt. Class component vì Error Boundary bắt buộc phải
// dùng getDerivedStateFromError/componentDidCatch — React chưa có hook tương đương.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // Không dùng useNavigate/Link — class component đứng trong Router nhưng Error Boundary bắt lỗi
  // của chính cây con đang crash, cây đó có thể đang ở trạng thái hỏng; điều hướng cứng bằng
  // window.location đảm bảo trang thật sự tải lại sạch thay vì chỉ đổi route trên 1 cây React đã lỗi.
  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="glass-card rounded-3xl p-10 sm:p-12 text-center space-y-5 border border-slate-200/80 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-bold text-slate-900 font-heading">
                Đã có lỗi xảy ra
              </h1>
              <p className="text-sm text-slate-500">
                Ứng dụng gặp sự cố ngoài dự kiến. Bạn có thể thử tải lại trang hoặc quay về trang chủ.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl gradient-bg text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform min-h-11"
              >
                <RotateCcw className="w-4 h-4" />
                Thử lại
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors min-h-11"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
