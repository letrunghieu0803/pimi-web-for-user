import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Home, Search, Menu, X, Building2, HelpCircle, Info, LogIn, UserPlus, User, CalendarCheck, LogOut, ChevronDown, Bell, CheckCheck } from 'lucide-react';
import { notificationApi, NotificationItem } from '@/services/notificationApi';

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchUnread = async () => {
    try {
      const [resCount, resList] = await Promise.all([
        notificationApi.getUnreadCount(),
        notificationApi.getNotifications({ pageSize: 5 })
      ]);
      const count = resCount?.data?.count ?? resCount?.count ?? 0;
      setUnreadCount(count);
      const list = resList?.data || resList || [];
      setRecentNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await notificationApi.markAsRead(item.id);
        setRecentNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setRecentNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all text-slate-600 hover:text-indigo-600"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <h4 className="text-sm font-black text-slate-900 font-heading">Thông báo mới</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Không có thông báo nào</p>
            ) : (
              recentNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    handleMarkAsRead(n);
                    setOpen(false);
                    navigate('/notifications');
                  }}
                  className={`p-3 rounded-2xl text-xs transition-all cursor-pointer ${
                    !n.isRead ? 'bg-indigo-50/60 border border-indigo-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0"></span>}
                    <span className={`font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {n.title}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 text-center">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline block"
            >
              Xem tất cả thông báo &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/rooms', label: 'Tìm phòng trọ', icon: Search },
    ...(isAuthenticated ? [{ path: '/appointments', label: 'Lịch hẹn xem phòng', icon: CalendarCheck }] : []),
    { path: '/about', label: 'Về Pimi', icon: Info },
    { path: '/faq', label: 'Hỏi đáp', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                Pimi<span className="gradient-text">Rent</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-sans -mt-1">
                Kênh Tìm Phòng Uy Tín
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Auth Buttons or User Profile Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell Button & Popover */}
                <NotificationBell />

                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                    />
                    <div className="text-left leading-tight">
                      <span className="block text-xs font-bold text-slate-900 max-w-[110px] truncate">
                        {user.fullName}
                      </span>
                      <span className="block text-[10px] text-indigo-600 font-semibold uppercase">
                        Người thuê
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        <span>Thông tin cá nhân</span>
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Bell className="w-4 h-4 text-indigo-500" />
                        <span>Thông báo</span>
                      </Link>

                      <Link
                        to="/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-indigo-500" />
                        <span>Lịch sử thuê nhà</span>
                      </Link>

                      <Link
                        to="/appointments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-indigo-500" />
                        <span>Lịch hẹn xem phòng</span>
                      </Link>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Đăng nhập</span>
                </Link>

                <Link
                  to="/register"
                  className="gradient-bg text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm"
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Thông tin cá nhân ({user.fullName})</span>
                </Link>

                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm"
                >
                  <CalendarCheck className="w-5 h-5 text-indigo-600" />
                  <span>Lịch sử booking xem phòng</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Đăng nhập</span>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl gradient-bg text-white font-bold text-sm shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
