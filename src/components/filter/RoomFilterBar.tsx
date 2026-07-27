import React from 'react';
import { FilterState } from '@/types';
import { DISTRICTS, AMENITIES_LIST } from '@/data/mockData';
import { Search, MapPin, DollarSign, Home, SlidersHorizontal, RotateCcw, Layers, Check } from 'lucide-react';

interface RoomFilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const RoomFilterBar: React.FC<RoomFilterBarProps> = ({ filters, onChange, onReset }) => {
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

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const newAmts = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: newAmts });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-6">
      
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Tìm theo tên đường, tên tòa nhà, vị trí..."
          value={filters.keyword}
          onChange={handleKeywordChange}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
        />
      </div>

      {/* Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* District Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Khu Vực / Quận Huyện</span>
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
            <span>Loại Phòng</span>
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => handleRoomTypeChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tất cả loại phòng</option>
            <option value="APARTMENT">Căn hộ dịch vụ</option>
            <option value="MINI_APARTMENT">Chung cư mini</option>
            <option value="BOARDING_HOUSE">Phòng trọ giá rẻ</option>
          </select>
        </div>

        {/* Mezzanine Quick Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kiểu Thiết Kế</span>
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
            <span>Có gác xép kiên cố</span>
            {filters.hasMezzanine === true && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Price Range Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mức Giá Thuê (VNĐ / Tháng)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'Tất cả giá' },
            { id: '0-3m', label: 'Dưới 3 triệu' },
            { id: '3m-5m', label: '3 - 5 triệu' },
            { id: '5m-8m', label: '5 - 8 triệu' },
            { id: '8m+', label: 'Trên 8 triệu' },
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
          <span>Tiện Ích Đi Kèm</span>
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
          <span>Đặt lại tất cả bộ lọc</span>
        </button>
      </div>
    </div>
  );
};
