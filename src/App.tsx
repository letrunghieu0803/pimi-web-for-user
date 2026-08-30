import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SocketProvider } from '@/context/SocketContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { RouteTracker } from '@/components/common/RouteTracker';
import { PageLoadingFallback } from '@/components/common/PageLoadingFallback';

// Pages — lazy-loaded per route (React.lazy + Suspense) thay vì import tĩnh: trước đây toàn bộ
// ~20 trang (kể cả booking/profile/admin-ish tooling ít người dùng) đóng gói chung 1 bundle
// 935KB/268KB-gzip, khách vãng lai ghé "/" phải tải hết trước khi thấy được gì. Giờ mỗi route là
// 1 chunk riêng, chỉ tải khi thật sự điều hướng tới.
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const RoomList = lazy(() => import('@/pages/RoomList').then((m) => ({ default: m.RoomList })));
const RoomDetail = lazy(() => import('@/pages/RoomDetail').then((m) => ({ default: m.RoomDetail })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const FAQ = lazy(() => import('@/pages/FAQ').then((m) => ({ default: m.FAQ })));
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const NewsList = lazy(() => import('@/pages/NewsList').then((m) => ({ default: m.NewsList })));
const NewsDetail = lazy(() => import('@/pages/NewsDetail').then((m) => ({ default: m.NewsDetail })));

// Auth & Tenant Profile Pages
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() =>
  import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })),
);
const VerifyEmail = lazy(() =>
  import('@/pages/VerifyEmail').then((m) => ({ default: m.VerifyEmail })),
);
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })));
const BookingHistory = lazy(() =>
  import('@/pages/BookingHistory').then((m) => ({ default: m.BookingHistory })),
);
const BookingPayment = lazy(() =>
  import('@/pages/BookingPayment').then((m) => ({ default: m.BookingPayment })),
);
const TenantAppointments = lazy(() =>
  import('@/pages/TenantAppointments').then((m) => ({ default: m.TenantAppointments })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/Notifications').then((m) => ({ default: m.NotificationsPage })),
);
const FavoriteRooms = lazy(() =>
  import('@/pages/FavoriteRooms').then((m) => ({ default: m.FavoriteRooms })),
);
const RecentlyViewed = lazy(() =>
  import('@/pages/RecentlyViewed').then((m) => ({ default: m.RecentlyViewed })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <SocketProvider>
              <Router>
                <RouteTracker />
                <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
                  <Navbar />
                  <main className="flex-1">
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/rooms/:id" element={<RoomDetail />} />
                        <Route path="/room-groups/:groupId" element={<RoomDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/news" element={<NewsList />} />
                        <Route path="/news/:id" element={<NewsDetail />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/bookings" element={<BookingHistory />} />
                        <Route path="/payment/:bookingId" element={<BookingPayment />} />
                        <Route path="/appointments" element={<TenantAppointments />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/favorites" element={<FavoriteRooms />} />
                        <Route path="/recently-viewed" element={<RecentlyViewed />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </Router>
            </SocketProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
