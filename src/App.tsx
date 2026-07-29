import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

// Pages
import { Home } from '@/pages/Home';
import { RoomList } from '@/pages/RoomList';
import { RoomDetail } from '@/pages/RoomDetail';
import { About } from '@/pages/About';
import { FAQ } from '@/pages/FAQ';
import { Privacy } from '@/pages/Privacy';
import { Contact } from '@/pages/Contact';

// Auth & Tenant Profile Pages
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { VerifyEmail } from '@/pages/VerifyEmail';
import { Profile } from '@/pages/Profile';
import { BookingHistory } from '@/pages/BookingHistory';
import { TenantAppointments } from '@/pages/TenantAppointments';
import { NotificationsPage } from '@/pages/Notifications';

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
          <Router>
            <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/rooms" element={<RoomList />} />
                  <Route path="/rooms/:id" element={<RoomDetail />} />
                  <Route path="/about" element={<About />} />
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
                  <Route path="/appointments" element={<TenantAppointments />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
