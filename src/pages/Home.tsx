import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Room } from '@/types';
import { roomApi } from '@/services/roomApi';
import { RoomCard } from '@/components/common/RoomCard';
import { RequestTourModal } from '@/components/common/RequestTourModal';
import { Search, ShieldCheck, Zap, PhoneCall, Sparkles, Building2, ChevronRight, HeartHandshake, CheckCircle } from 'lucide-react';
import { DISTRICTS } from '@/data/mockData';
import { CardGridSkeleton } from '@/components/ui/Skeleton';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [selectedRoomForTour, setSelectedRoomForTour] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchDistrict, setSearchDistrict] = useState('Tất cả quận/huyện');
  const [searchPrice, setSearchPrice] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    roomApi
      .getRooms()
      .then((rooms) => {
        setFeaturedRooms(rooms.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        
        {/* Background Gradients & Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide border border-indigo-200 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t('home.heroBadge')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none font-heading">
              {t('home.heroTitleLine1')} <br className="hidden sm:inline" />
              <span className="gradient-text">{t('home.heroTitleHighlight')}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            {/* Quick Hero Search Bar */}
            <div className="glass-panel p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/90 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
              
              <div className="w-full sm:w-1/2 relative">
                <select
                  value={searchDistrict}
                  onChange={(e) => setSearchDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/2 relative">
                <select
                  value={searchPrice}
                  onChange={(e) => setSearchPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">{t('home.priceAll')}</option>
                  <option value="0-3m">{t('home.price0to3')}</option>
                  <option value="3m-5m">{t('home.price3to5')}</option>
                  <option value="5m-8m">{t('home.price5to8')}</option>
                </select>
              </div>

              <Link
                to={`/rooms?district=${encodeURIComponent(searchDistrict)}&priceRange=${searchPrice}`}
                className="w-full sm:w-auto gradient-bg text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{t('home.searchNow')}</span>
              </Link>
            </div>

            {/* Key Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-slate-200/60 text-center">
              <div>
                <span className="text-2xl font-black text-slate-900 font-heading">1.200+</span>
                <span className="block text-xs text-slate-500 font-semibold">{t('home.statsRoomsAvailable')}</span>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-600 font-heading">100%</span>
                <span className="block text-xs text-slate-500 font-semibold">{t('home.statsVerifiedOwners')}</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 font-heading">0đ</span>
                <span className="block text-xs text-slate-500 font-semibold">{t('home.statsFreeViewing')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              <Building2 className="w-4 h-4" />
              <span>{t('home.featuredTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {t('home.featuredTitle')}
            </h2>
          </div>
          <Link
            to="/rooms"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>{t('home.viewAllRooms')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onRequestTour={(r) => setSelectedRoomForTour(r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Pimi Feature Grid */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              {t('home.whyChooseTag')}
            </span>
            <h2 className="text-3xl font-black font-heading">
              {t('home.whyChooseTitle')}
            </h2>
            <p className="text-sm text-slate-400">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 space-y-4 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">{t('home.feature1Title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('home.feature1Desc')}
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">{t('home.feature2Title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('home.feature2Desc')}
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 space-y-4 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">{t('home.feature3Title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('home.feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-bg rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl z-10">
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              {t('home.ctaDesc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10">
            <a
              href="tel:0987654321"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              <span>{t('home.ctaCallHotline')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Viewing Tour Request Modal */}
      {selectedRoomForTour && (
        <RequestTourModal
          room={selectedRoomForTour}
          onClose={() => setSelectedRoomForTour(null)}
        />
      )}
    </div>
  );
};
