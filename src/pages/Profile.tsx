import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { roomApi } from '@/services/roomApi';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { User, Phone, Mail, MapPin, Save, ShieldCheck, CalendarCheck, CheckCircle2, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const { state: notifState, enableNotifications, isSupported: notifSupported } = useNotificationPermission();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">{t('profile.notLoggedIn')}</h2>
        <Link to="/login" className="gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md inline-block">
          {t('profile.loginAccount')}
        </Link>
      </div>
    );
  }

  const userBookings = roomApi.getUserViewingRequests(user.phoneNumber);
  const pendingCount = userBookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = userBookings.filter((b) => b.status === 'CONFIRMED').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        address: address.trim(),
      });
      setSaving(false);
      toast.success(t('profile.toastUpdateSuccess'));
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Profile Badge */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={user.fullName}
          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-md shrink-0"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-heading">{user.fullName}</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t('profile.verifiedTenant')}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user.phoneNumber} • {user.email || t('profile.noEmail')}</p>
        </div>

        <Link
          to="/bookings"
          className="px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-all flex items-center gap-2"
        >
          <CalendarCheck className="w-4 h-4 text-indigo-600" />
          <span>{t('profile.viewBookingHistory', { count: userBookings.length })}</span>
        </Link>
      </div>

      {/* Booking Statistics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-heading">{userBookings.length}</span>
            <span className="block text-xs text-slate-500 font-semibold">{t('profile.totalAppointments')}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-heading">{pendingCount}</span>
            <span className="block text-xs text-slate-500 font-semibold">{t('profile.pendingApproval')}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-heading">{confirmedCount}</span>
            <span className="block text-xs text-slate-500 font-semibold">{t('profile.confirmedViewing')}</span>
          </div>
        </div>
      </div>

      {/* Push Notification Toggle */}
      {notifSupported && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t('profile.pushNotificationTitle')}</p>
              <p className="text-xs text-slate-500">
                {notifState === 'granted'
                  ? t('profile.pushEnabled')
                  : notifState === 'denied'
                    ? t('profile.pushDenied')
                    : t('profile.pushPrompt')}
              </p>
            </div>
          </div>
          {notifState !== 'granted' && (
            <button
              onClick={enableNotifications}
              disabled={notifState === 'requesting' || notifState === 'denied'}
              className="px-4 py-2.5 rounded-2xl gradient-bg text-white font-bold text-xs shadow-md disabled:opacity-50 shrink-0"
            >
              {notifState === 'requesting' ? t('profile.pushEnabling') : t('profile.pushEnableButton')}
            </button>
          )}
        </div>
      )}

      {/* Edit Form */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>{t('profile.editTitle')}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('profile.fullNameLabel')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('profile.phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('profile.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('profile.addressLabel')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('profile.addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="gradient-bg text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t('profile.saving') : t('profile.saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
