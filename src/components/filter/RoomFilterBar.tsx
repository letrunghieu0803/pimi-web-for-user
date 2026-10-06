import { PRICE_BUCKETS } from '@/utils/priceRanges';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FilterState } from '@/types';
import { useSearchFacets } from '@/hooks/useSearchFacets';
import { useToast } from '@/context/ToastContext';
import { formatRoomTypeLabel } from '@/utils/roomType';
import { Search, MapPin, DollarSign, Home, SlidersHorizontal, RotateCcw, Layers, Check, Sparkles, Zap, Calendar, X } from 'lucide-react';

interface RoomFilterBarProps {
  /** Bộ lọc ĐANG ÁP DỤNG thật sự (đã submit, đang dùng để gọi API) — dùng để khởi tạo/đồng bộ
   * lại bản nháp bên dưới khi có thay đổi từ bên ngoài (bấm "Đặt lại bộ lọc", back/forward trình
   * duyệt...). KHÔNG dùng trực tiếp để hiển thị input — xem `draft`. */
  appliedFilters: FilterState;
  /** Gọi khi người dùng bấm "Tìm kiếm" (hoặc Enter trong ô từ khoá) — nhận toàn bộ bản nháp hiện
   * tại, nơi gọi (RoomList) chịu trách nhiệm áp dụng + cập nhật URL + gọi API. */
  onSubmit: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const RoomFilterBar: React.FC<RoomFilterBarProps> = ({ appliedFilters, onSubmit, onReset }) => {
  const { t } = useTranslation();
  const toast = useToast();

  // Trước đây MỌI thay đổi (gõ ô tìm kiếm, đổi quận/huyện, bấm tiện ích...) đều gọi thẳng
  // onChange -> RoomList refetch API NGAY LẬP TỨC — tự động tìm kiếm liên tục, không lưu lại
  // được trạng thái tìm kiếm vào URL để chia sẻ/SEO. Giờ mọi control chỉ cập nhật `draft` (state
  // nháp cục bộ) — chỉ khi bấm nút "Tìm kiếm" (hoặc Enter trong ô từ khoá) mới gọi `onSubmit`,
  // lúc đó RoomList mới thật sự áp dụng + ghi vào URL + gọi API.
  const [draft, setDraft] = useState<FilterState>(appliedFilters);

  // Đồng bộ lại nháp khi bộ lọc ĐANG ÁP DỤNG đổi từ bên ngoài (Đặt lại bộ lọc, hoặc URL đổi do
  // back/forward trình duyệt) — không phải do chính component này gọi onSubmit (lúc đó
  // appliedFilters đổi thành ĐÚNG NHỮNG GÌ vừa submit, resync về là vô hại/idempotent).
  useEffect(() => {
    setDraft(appliedFilters);
  }, [appliedFilters]);

  // Khu vực / loại phòng / tiện ích lấy từ backend theo loại hình đang chọn trong bản nháp (đổi
  // Ngắn hạn <-> Dài hạn thì danh sách đổi theo) — xem GET /rent-rooms/public/search-facets.
  const { facets, isLoading: facetsLoading, isError: facetsError } = useSearchFacets(draft.rentalTermType);

  // Giữ lại lựa chọn đang áp dụng dù nó không còn trong facets (vd link cũ/đổi loại hình thuê) để ô
  // chọn không hiện sai giá trị rỗng.
  const knownDistricts = new Set(facets?.locations.flatMap((loc) => loc.districts.map((d) => d.name)) ?? []);
  const knownRoomTypes = new Set(facets?.roomTypes.map((rt) => rt.type) ?? []);
  const amenityOptions = Array.from(new Set([...(facets?.amenities ?? []), ...draft.amenities]));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit(draft);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, keyword: e.target.value }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDraft((prev) => ({ ...prev, district: e.target.value }));
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setDraft((prev) => ({ ...prev, priceRange }));
  };

  const handleRoomTypeChange = (roomType: string) => {
    setDraft((prev) => ({ ...prev, roomType }));
  };

  const handleMezzanineToggle = () => {
    setDraft((prev) => ({ ...prev, hasMezzanine: prev.hasMezzanine === true ? null : true }));
  };

  const handleRecommendedToggle = () => {
    setDraft((prev) => ({ ...prev, isRecommended: prev.isRecommended === true ? null : true }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setDraft((prev) => {
      const exists = prev.amenities.includes(amenity);
      const amenities = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  // Trên mobile (< lg), khối lọc nâng cao (4 mục lọc, GPS, dải giá, tiện ích, reset) đẩy
  // danh sách phòng xuống rất xa nếu luôn hiển thị — nên gói lại thành 1 nút "Bộ lọc" mở
  // modal full-screen chứa CHÍNH các phần tử JSX gốc bên dưới (chỉ đổi chỗ hiển thị, không
  // đổi hành vi). Từ lg trở lên vẫn hiện đầy đủ inline như cũ.
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  // Badge số lượng filter — phản ánh bộ lọc ĐANG ÁP DỤNG THẬT (đã submit), không phải bản nháp
  // đang gõ dở, để khớp đúng với kết quả đang hiển thị trên trang.
  const activeFilterCount =
    (appliedFilters.district ? 1 : 0) +
    (appliedFilters.roomType !== 'ALL' ? 1 : 0) +
    (appliedFilters.hasMezzanine === true ? 1 : 0) +
    (appliedFilters.isRecommended === true ? 1 : 0) +
    (appliedFilters.priceRange !== 'ALL' ? 1 : 0) +
    appliedFilters.amenities.length +
    (appliedFilters.userLat && appliedFilters.userLng ? 1 : 0);

  // Nút submit dùng lại NGUYÊN VẸN cả inline (>= lg) lẫn trong modal mobile (< lg) — modal mobile
  // render qua createPortal ra document.body nên KHÔNG nằm trong cây DOM thật của <form>, phải
  // gọi handleSubmit() bằng tay thay vì dựa vào type="submit" (chỉ hoạt động tự nhiên ở bản inline
  // desktop, nơi advancedFilters vẫn là con thật sự của <form>).
  const SearchSubmitButton = ({ className }: { className?: string }) => (
    <button type="submit" className={className}>
      <Search className="w-4 h-4" />
      <span>{t('roomFilterBar.searchButton')}</span>
    </button>
  );

  // Khối lọc nâng cao — dùng lại NGUYÊN VẸN cả inline (>= lg) lẫn trong modal mobile (< lg).
  const advancedFilters = (
    <>
      {/* Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* District Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('roomFilterBar.districtLabel')}</span>
          </label>
          <select
            value={draft.district}
            onChange={handleDistrictChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">{t('roomFilterBar.districtAll')}</option>
            {draft.district && !knownDistricts.has(draft.district) && (
              <option value={draft.district}>{draft.district}</option>
            )}
            {facets?.locations.map((loc) => (
              <optgroup key={loc.province} label={`${loc.province} (${loc.roomCount})`}>
                {loc.districts.map((d) => (
                  <option key={`${loc.province}-${d.name}`} value={d.name}>
                    {d.name} ({d.roomCount})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {facetsLoading && <p className="text-[11px] text-slate-400 mt-1">{t('roomFilterBar.facetsLoading')}</p>}
          {facetsError && <p className="text-[11px] text-rose-500 mt-1">{t('roomFilterBar.facetsError')}</p>}
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('roomFilterBar.roomTypeLabel')}</span>
          </label>
          <select
            value={draft.roomType}
            onChange={(e) => handleRoomTypeChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">{t('roomFilterBar.roomTypeAll')}</option>
            {draft.roomType !== 'ALL' && !knownRoomTypes.has(draft.roomType) && (
              <option value={draft.roomType}>{formatRoomTypeLabel(draft.roomType, t)}</option>
            )}
            {facets?.roomTypes.map((rt) => (
              <option key={rt.type} value={rt.type}>
                {formatRoomTypeLabel(rt.type, t)} ({rt.roomCount})
              </option>
            ))}
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
            // Backend báo không có phòng gác xép nào đang công khai thì không cho bật (ra 0 kết quả).
            disabled={!!facets && facets.mezzanineCount === 0 && draft.hasMezzanine !== true}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed ${
              draft.hasMezzanine === true
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>
              {t('roomFilterBar.mezzanineToggle')}
              {facets && facets.mezzanineCount > 0 ? ` (${facets.mezzanineCount})` : ''}
            </span>
            {draft.hasMezzanine === true && <Check className="w-4 h-4" />}
          </button>
        </div>

        {/* Recommended Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('roomFilterBar.recommendedLabel')}</span>
          </label>
          <button
            type="button"
            onClick={handleRecommendedToggle}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
              draft.isRecommended === true
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{t('roomFilterBar.recommendedToggle')}</span>
            {draft.isRecommended === true && <Check className="w-4 h-4" />}
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
                toast.error(t('roomFilterBar.gpsUnsupported'));
                return;
              }
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setDraft((prev) => ({
                    ...prev,
                    userLat: pos.coords.latitude,
                    userLng: pos.coords.longitude,
                    radiusInKm: prev.radiusInKm || 5,
                  }));
                },
                (err) => {
                  console.warn('Geolocation error:', err);
                  toast.error(t('roomFilterBar.gpsDenied'));
                },
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              draft.userLat && draft.userLng
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>
              {draft.userLat && draft.userLng
                ? t('roomFilterBar.gpsSelected')
                : t('roomFilterBar.gpsUseCurrent')}
            </span>
          </button>

          {draft.userLat && draft.userLng && (
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  userLat: null,
                  userLng: null,
                  radiusInKm: null,
                }))
              }
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              {t('roomFilterBar.gpsClear')}
            </button>
          )}
        </div>

        {/* Radius dropdown */}
        {draft.userLat && draft.userLng && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {t('roomFilterBar.radiusLabel')}
            </span>
            <select
              value={draft.radiusInKm || 'ALL'}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => ({
                  ...prev,
                  radiusInKm: val === 'ALL' ? null : Number(val),
                }));
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">{t('roomFilterBar.radiusAll')}</option>
              {[1, 3, 5, 10, 20].map((km) => (
                <option key={km} value={km}>
                  {t('roomFilterBar.radiusUnder', { km })}
                </option>
              ))}
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
            ...PRICE_BUCKETS[draft.rentalTermType === 'LONG_TERM' ? 'LONG_TERM' : 'SHORT_TERM'].map((b) => ({
              id: b.id,
              label: t(b.labelKey),
            })),
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePriceRangeChange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                draft.priceRange === item.id
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
          {amenityOptions.length === 0 && (
            <p className="text-xs text-slate-400">
              {facetsLoading ? t('roomFilterBar.facetsLoading') : t('roomFilterBar.amenitiesEmpty')}
            </p>
          )}
          {amenityOptions.map((amt) => {
            const active = draft.amenities.includes(amt);
            return (
              <button
                key={amt}
                type="button"
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

      {/* Reset áp dụng ngay (không qua nháp) — nút "Tìm kiếm" đặt ở NGOÀI khối này (xem bên dưới
          return), vì advancedFilters được dùng lại cả trong modal mobile (portal ra document.body,
          không còn là con thật của <form> nên type="submit" đặt ở đây sẽ không hoạt động ở đó). */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('roomList.resetFilters')}</span>
        </button>
      </div>
    </>
  );

  return (
    // onSubmit bắt cả nút "Tìm kiếm" LẪN phím Enter khi đang gõ trong ô từ khoá (hành vi submit
    // form chuẩn của trình duyệt) — đây là nơi DUY NHẤT thật sự gọi search, mọi thay đổi filter ở
    // trên chỉ cập nhật `draft`.
    <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-6">

      {/* Rental Term Type Segmented Toggle Tab (Ngắn hạn vs Dài hạn) */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setDraft((prev) => ({ ...prev, rentalTermType: 'SHORT_TERM', priceRange: 'ALL' }))}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            draft.rentalTermType === 'SHORT_TERM'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-950 fill-amber-300" />
          <span>{t('roomFilterBar.shortTermTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setDraft((prev) => ({ ...prev, rentalTermType: 'LONG_TERM', priceRange: 'ALL' }))}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            draft.rentalTermType === 'LONG_TERM'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('roomFilterBar.longTermTab')}</span>
        </button>
      </div>

      {/* Top Search Input + nút Tìm kiếm — gõ xong bấm nút này hoặc Enter để submit, KHÔNG còn
          tự động tìm kiếm sau khi ngừng gõ như trước. */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={t('roomFilterBar.searchPlaceholder')}
            value={draft.keyword}
            onChange={handleKeywordChange}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
          />
        </div>
        <SearchSubmitButton className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity" />
      </div>

      {/* >= lg: hiện đầy đủ khối lọc nâng cao inline như cũ, không đổi gì. */}
      <div className="hidden lg:block space-y-6">{advancedFilters}</div>

      {/* < lg: chỉ hiện nút "Bộ lọc" mở modal full-screen chứa khối lọc nâng cao ở trên. */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilterModal(true)}
          className="relative w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>{t('roomFilterBar.moreFiltersButton')}</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showMobileFilterModal && createPortal(
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 shrink-0">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              {t('roomFilterBar.moreFiltersButton')}
            </h2>
            <button
              type="button"
              onClick={() => setShowMobileFilterModal(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: chính khối JSX lọc nâng cao gốc, chỉ đổi chỗ hiển thị */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">{advancedFilters}</div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 px-4 py-4 border-t border-slate-200 shrink-0 bg-white">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('roomList.resetFilters')}</span>
            </button>
            {/* Portal ra document.body -> KHÔNG phải con thật của <form>, type="submit" sẽ
                không làm gì cả (native browser bỏ qua submit button không có form cha thật sự)
                -> gọi handleSubmit() bằng tay rồi mới đóng modal. */}
            <button
              type="button"
              onClick={() => {
                handleSubmit();
                setShowMobileFilterModal(false);
              }}
              className="flex-1 py-3 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{t('roomFilterBar.searchButton')}</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </form>
  );
};
