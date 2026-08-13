import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterState } from '@/types';
import { DISTRICTS, AMENITIES_LIST } from '@/data/mockData';
import { Search, MapPin, DollarSign, Home, SlidersHorizontal, RotateCcw, Layers, Check, Sparkles, Zap, Calendar } from 'lucide-react';

interface RoomFilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const RoomFilterBar: React.FC<RoomFilterBarProps> = ({ filters, onChange, onReset }) => {
  const { t } = useTranslation();
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, keyword: e.target.value });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, district: e.target.value });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    onChange({ ...filters, priceRange });
  };

  const handleRoomTypeChange = (roomType: string) => {
    onChange({ ...filters, roomType });
  };

  const handleMezzanineToggle = () => {
    const nextVal = filters.hasMezzanine === true ? null : true;
    onChange({ ...filters, hasMezzanine: nextVal });
  };

  const handleRecommendedToggle = () => {
    const nextVal = filters.isRecommended === true ? null : true;
    onChange({ ...filters, isRecommended: nextVal });
  };

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const newAmts = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: newAmts });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-6">
      
      {/* Rental Term Type Segmented Toggle Tab (Ngắn hạn vs Dài hạn) */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => onChange({ ...filters, rentalTermType: 'SHORT_TERM' })}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            filters.rentalTermType === 'SHORT_TERM'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-950 fill-amber-300" />
          <span>⚡ Thuê Ngắn Hạn (Ngày/Giờ)</span>
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, rentalTermType: 'LONG_TERM' })}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            filters.rentalTermType === 'LONG_TERM'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>📅 Thuê Dài Hạn (Tháng/Năm)</span>
        </button>
      </div>

      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder={t('roomFilterBar.searchPlaceholder')}
          value={filters.keyword}
          onChange={handleKeywordChange}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
        />
      </div>

      {/* Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* District Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('roomFilterBar.districtLabel')}</span>
          </label>
          <select
            value={filters.district}
            onChange={handleDistrictChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            {DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('roomFilterBar.roomTypeLabel')}</span>
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => handleRoomTypeChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">{t('roomFilterBar.roomTypeAll')}</option>
            <option value="APARTMENT">{t('roomFilterBar.roomTypeApartment')}</option>
            <option value="MINI_APARTMENT">{t('roomFilterBar.roomTypeMiniApartment')}</option>
            <option value="BOARDING_HOUSE">{t('roomFilterBar.roomTypeBoarding')}</option>
          </select>
        </div>

        {/* Mezzanine Quick Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('roomFilterBar.designTypeLabel')}</span>
          </label>
          <button
            type="button"
            onClick={handleMezzanineToggle}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
              filters.hasMezzanine === true
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{t('roomFilterBar.mezzanineToggle')}</span>
            {filters.hasMezzanine === true && <Check className="w-4 h-4" />}
          </button>
        </div>

        {/* Recommended Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Đề Cử Admin</span>
          </label>
          <button
            type="button"
            onClick={handleRecommendedToggle}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
              filters.isRecommended === true
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>⭐ Phòng Đề Cử</span>
            {filters.isRecommended === true && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* GPS Location & Radius Section */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!navigator.geolocation) {
                alert('Trình duyệt của bạn không hỗ trợ lấy vị trí GPS.');
                return;
              }
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  onChange({
                    ...filters,
                    userLat: pos.coords.latitude,
                    userLng: pos.coords.longitude,
                    radiusInKm: filters.radiusInKm || 5,
                  });
                },
                (err) => {
                  console.warn('Geolocation error:', err);
                  alert('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập GPS trên trình duyệt.');
                },
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              filters.userLat && filters.userLng
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>
              {filters.userLat && filters.userLng
                ? 'Đã chọn vị trí của tôi 📍'
                : 'Dùng vị trí hiện tại của tôi'}
            </span>
          </button>

          {filters.userLat && filters.userLng && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  userLat: null,
                  userLng: null,
                  radiusInKm: null,
                })
              }
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Xóa vị trí
            </button>
          )}
        </div>

        {/* Radius dropdown */}
        {filters.userLat && filters.userLng && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Bán kính:
            </span>
            <select
              value={filters.radiusInKm || 'ALL'}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  ...filters,
                  radiusInKm: val === 'ALL' ? null : Number(val),
                });
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tất cả bán kính</option>
              <option value="1">Dưới 1 km</option>
              <option value="3">Dưới 3 km</option>
              <option value="5">Dưới 5 km</option>
              <option value="10">Dưới 10 km</option>
              <option value="20">Dưới 20 km</option>
            </select>
          </div>
        )}
      </div>

      {/* Price Range Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t('roomFilterBar.priceRangeLabel')}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: t('roomFilterBar.priceAll') },
            { id: '0-3m', label: t('home.price0to3') },
            { id: '3m-5m', label: t('home.price3to5') },
            { id: '5m-8m', label: t('home.price5to8') },
            { id: '8m+', label: t('roomFilterBar.priceOver8') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handlePriceRangeChange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filters.priceRange === item.id
                  ? 'gradient-bg text-white border-transparent shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Accordion / Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t('roomFilterBar.amenitiesLabel')}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((amt) => {
            const active = filters.amenities.includes(amt);
            return (
              <button
                key={amt}
                onClick={() => handleAmenityToggle(amt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <Check className="w-3 h-3" />}
                <span>{amt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Reset Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('roomList.resetFilters')}</span>
        </button>
      </div>
    </div>
  );
};
