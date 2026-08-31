import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Room, FilterState } from '@/types';
import { roomApi } from '@/services/roomApi';
import { RoomCard } from '@/components/common/RoomCard';
import { RoomFilterBar } from '@/components/filter/RoomFilterBar';
import { RequestTourModal } from '@/components/common/RequestTourModal';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Building2, ArrowUpDown, Info, Map, LayoutGrid, WifiOff } from 'lucide-react';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { vietmapService } from '@/services/vietmapService';
import { Seo } from '@/components/common/Seo';
import { JsonLd } from '@/components/common/JsonLd';
import { absoluteUrl } from '@/config/seo';
import { DISTRICTS } from '@/data/mockData';

const PAGE_SIZE = 10;

type SortKey = 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'DISTANCE';

const SORT_TO_BACKEND: Record<SortKey, 'newest' | 'price_asc' | 'price_desc' | 'distance'> = {
  NEWEST: 'newest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DISTANCE: 'distance',
};

const DEFAULT_DISTRICT = DISTRICTS[0];

// Đọc toàn bộ trạng thái tìm kiếm (filter + sort + trang) từ query string — cho phép 1 URL đại
// diện chính xác cho 1 lượt tìm kiếm cụ thể, dùng để: (1) chia sẻ link kèm đúng kết quả đang xem,
// (2) vào thẳng URL đã lưu/bookmark ra đúng kết quả đó, (3) Google index/hiển thị link có ngữ
// cảnh (kèm ?search=... khi phù hợp) thay vì luôn chỉ mỗi "/rooms" trần.
const filtersFromSearchParams = (sp: URLSearchParams): FilterState => ({
  district: sp.get('district') || DEFAULT_DISTRICT,
  priceRange: sp.get('priceRange') || 'ALL',
  roomType: sp.get('roomType') || 'ALL',
  hasMezzanine: sp.get('hasMezzanine') === 'true' ? true : null,
  isRecommended: sp.get('isRecommended') === 'true' ? true : null,
  rentalTermType: (sp.get('rentalTermType') as FilterState['rentalTermType']) || 'SHORT_TERM',
  amenities: sp.get('amenities') ? sp.get('amenities')!.split(',').filter(Boolean) : [],
  // ?search= (không phải ?keyword=) giữ nguyên tên cũ — Google "Sitelinks Search Box"
  // (JSON-LD SearchAction ở Home.tsx) đã trỏ vào đúng tên param này từ trước.
  keyword: sp.get('search') || '',
  userLat: sp.get('lat') ? Number(sp.get('lat')) : null,
  userLng: sp.get('lng') ? Number(sp.get('lng')) : null,
  radiusInKm: sp.get('radius') ? Number(sp.get('radius')) : null,
});

const sortFromSearchParams = (sp: URLSearchParams, fallback: SortKey): SortKey => {
  const raw = sp.get('sort');
  return raw && raw in SORT_TO_BACKEND ? (raw as SortKey) : fallback;
};

const pageFromSearchParams = (sp: URLSearchParams): number => {
  const raw = Number(sp.get('page'));
  return Number.isInteger(raw) && raw > 0 ? raw : 1;
};

// Chiều ngược lại: state hiện tại -> query string. Bỏ qua field đang ở giá trị mặc định để URL
// gọn, dễ đọc (không lộ ?district=Tất+cả...&roomType=ALL&page=1... cho 1 lượt tìm kiếm trống).
const buildSearchParams = (
  filters: FilterState,
  sortBy: SortKey,
  pageNumber: number
): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.district && filters.district !== DEFAULT_DISTRICT) params.district = filters.district;
  if (filters.priceRange !== 'ALL') params.priceRange = filters.priceRange;
  if (filters.roomType !== 'ALL') params.roomType = filters.roomType;
  if (filters.hasMezzanine === true) params.hasMezzanine = 'true';
  if (filters.isRecommended === true) params.isRecommended = 'true';
  if (filters.rentalTermType !== 'SHORT_TERM') params.rentalTermType = filters.rentalTermType;
  if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
  if (filters.keyword.trim()) params.search = filters.keyword.trim();
  if (filters.userLat != null && filters.userLng != null) {
    params.lat = String(filters.userLat);
    params.lng = String(filters.userLng);
    if (filters.radiusInKm != null) params.radius = String(filters.radiusInKm);
  }
  if (sortBy !== 'NEWEST') params.sort = sortBy;
  if (pageNumber > 1) params.page = String(pageNumber);
  return params;
};

interface RoomsMapViewProps {
  rooms: Room[];
  userLat?: number | null;
  userLng?: number | null;
}

const RoomsMapView: React.FC<RoomsMapViewProps> = ({ rooms, userLat, userLng }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const centerLat = userLat || rooms[0]?.latitude || 21.0285;
    const centerLng = userLng || rooms[0]?.longitude || 105.8542;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([centerLat, centerLng], 13);

      L.tileLayer(vietmapService.getTileLayerUrl(), {
        attribution: '&copy; VietMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 13);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add User Location Marker
    if (userLat && userLng) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="
          background: #2563EB;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.3);
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong style="font-size: 12px;">Vị trí của bạn 📍</strong>');
    }

    // Add Room Markers
    rooms.forEach((room) => {
      if (!room.latitude || !room.longitude) return;

      const priceLabel =
        room.price >= 1000000
          ? `${(room.price / 1000000).toFixed(1)} tr`
          : `${room.price.toLocaleString()}đ`;

      const roomIcon = L.divIcon({
        className: 'custom-room-marker',
        html: `<div style="
          background: linear-gradient(135deg, #4F46E5 0%, #10B981 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          border: 2px solid white;
        ">${priceLabel}${room.distanceInKm !== undefined ? ` (${room.distanceInKm}km)` : ''}</div>`,
        iconSize: [75, 26],
        iconAnchor: [37, 13],
      });

      const detailUrl = room.roomGroupId
        ? `/room-groups/${room.roomGroupId}`
        : `/rooms/${room.id}`;

      L.marker([room.latitude, room.longitude], { icon: roomIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; width: 180px; padding: 2px;">
            <img src="${room.images[0]}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <strong style="display: block; font-size: 12px; line-height: 1.3; margin-bottom: 4px; color: #0F172A;">${room.name}</strong>
            <div style="color: #059669; font-weight: 800; font-size: 13px;">${priceLabel}/tháng</div>
            ${room.distanceInKm !== undefined ? `<div style="color: #D97706; font-size: 11px; font-weight: bold; margin-top: 2px;">📍 Cách bạn ${room.distanceInKm} km</div>` : ''}
            <a href="${detailUrl}" style="display: block; margin-top: 8px; padding: 6px; background: #4F46E5; color: white; text-align: center; border-radius: 8px; text-decoration: none; font-size: 11px; font-weight: bold;">Xem chi tiết</a>
          </div>
        `);
    });
  }, [rooms, userLat, userLng]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
      <div ref={mapRef} className="w-full h-full z-0" />
    </div>
  );
};

export const RoomList: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNearbyQuery = searchParams.get('nearby') === 'true';

  // Đây là bộ lọc ĐANG ÁP DỤNG THẬT (đã submit, dùng để gọi API) — khởi tạo từ URL nên vào thẳng
  // 1 link đã chia sẻ ra đúng kết quả đó. RoomFilterBar tự quản lý bản NHÁP riêng, chỉ gọi
  // `handleSearchSubmit` khi người dùng bấm "Tìm kiếm" — filters ở đây chỉ đổi lúc đó (hoặc lúc
  // Đặt lại bộ lọc / tự động lấy vị trí GPS ban đầu bên dưới), không đổi theo từng thao tác gõ/
  // chọn dở dang trong filter bar nữa.
  const [filters, setFilters] = useState<FilterState>(() => filtersFromSearchParams(searchParams));

  const [pageNumber, setPageNumber] = useState(() => pageFromSearchParams(searchParams));
  const [sortBy, setSortBy] = useState<SortKey>(() =>
    sortFromSearchParams(searchParams, isNearbyQuery ? 'DISTANCE' : 'NEWEST')
  );
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedRoomForTour, setSelectedRoomForTour] = useState<Room | null>(null);

  const handleSearchSubmit = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Auto-acquire location if nearby flag is passed in URL
  useEffect(() => {
    if (isNearbyQuery && !filters.userLat && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFilters((prev) => ({
            ...prev,
            userLat: pos.coords.latitude,
            userLng: pos.coords.longitude,
            radiusInKm: prev.radiusInKm || 5,
          }));
          setSortBy('DISTANCE');
        },
        (err) => {
          console.warn('Geolocation failed:', err);
        }
      );
    }
  }, [isNearbyQuery]);

  // Đổi filter/sort (tìm kiếm mới) thì về trang 1 — nhưng KHÔNG chạy ở lần render đầu tiên, nếu
  // không sẽ xoá mất ?page=N của 1 link đã chia sẻ ngay khi vừa vào trang.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPageNumber(1);
  }, [filters, sortBy]);

  // Ghi lại toàn bộ trạng thái tìm kiếm hiện tại vào URL — one-way (state -> URL), chạy sau MỌI
  // thay đổi filters/sortBy/pageNumber (kể cả lần đầu, để chuẩn hoá URL ban đầu, ví dụ trim bớt
  // khoảng trắng thừa trong từ khoá). `replace: true` để tránh mỗi lần đổi trang/sort/tìm kiếm lại
  // đẩy thêm 1 mục vào lịch sử trình duyệt (nút Back sẽ rất khó dùng nếu không).
  useEffect(() => {
    setSearchParams(buildSearchParams(filters, sortBy, pageNumber), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, pageNumber]);

  // roomApi.getRoomsPaginated() không throw khi API lỗi (mất mạng, lỗi server...) — nó trả về
  // { rooms: [], hadError: true } để không làm vỡ các nơi gọi khác (Home.tsx, RoomDetail.tsx)
  // vốn không có .catch() riêng. Ở đây, nơi cần phân biệt rõ "lỗi tải" với "không có kết quả",
  // ta tự throw lại dựa vào hadError để react-query bắt được qua isError/error/refetch.
  const {
    data: feedResult,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['rooms-paginated', filters, sortBy, pageNumber],
    queryFn: async () => {
      const result = await roomApi.getRoomsPaginated({
        ...filters,
        pageNumber,
        pageSize: PAGE_SIZE,
        sortBy: SORT_TO_BACKEND[sortBy],
      });
      if (result.hadError) {
        throw new Error('Không tải được danh sách phòng từ máy chủ.');
      }
      return result;
    },
    retry: 1,
  });

  const rooms = feedResult?.rooms ?? [];
  const totalItems = feedResult?.totalItems ?? 0;
  const totalPages = feedResult?.totalPages ?? 0;

  const handleResetFilters = () => {
    setFilters({
      district: DEFAULT_DISTRICT,
      priceRange: 'ALL',
      roomType: 'ALL',
      hasMezzanine: null,
      rentalTermType: 'SHORT_TERM',
      amenities: [],
      keyword: '',
      userLat: null,
      userLng: null,
      radiusInKm: null,
    });
    setSortBy('NEWEST');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* canonical luôn trỏ về /rooms không kèm query-string — tránh các tổ hợp filter/sort
          (district, priceRange, sort...) bị Google index như những trang trùng nội dung. */}
      <Seo title={t('roomList.title')} description={t('seo.roomListDescription')} path="/rooms" />
      {rooms.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: rooms.map((room, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: absoluteUrl(room.roomGroupId ? `/room-groups/${room.roomGroupId}` : `/rooms/${room.id}`),
              name: room.name,
            })),
          }}
        />
      )}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4" />
            <span>{t('roomList.badge')}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-heading">
            {t('roomList.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('roomList.foundPrefix')}{' '}
            <strong className="text-indigo-600 font-bold">{totalItems}</strong>{' '}
            {t('roomList.foundSuffix')}
          </p>
        </div>

        {/* View Mode Switcher (Grid vs Map) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Danh sách</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Bản đồ</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <RoomFilterBar
        appliedFilters={filters}
        onSubmit={handleSearchSubmit}
        onReset={handleResetFilters}
      />

      {/* Control Bar: Sort & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="text-sm text-slate-600 font-medium">
          {t('roomList.showing')} <strong>{rooms.length}</strong> /{' '}
          <strong>{totalItems}</strong> {t('roomList.roomsAvailableSuffix')}
          {filters.userLat && filters.userLng && (
            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              📍 Định vị GPS đang bật
            </span>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 uppercase">
            {t('roomList.sortBy')}
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="NEWEST">{t('roomList.sortNewest')}</option>
            {filters.userLat && filters.userLng && (
              <option value="DISTANCE">📍 Gần bạn nhất</option>
            )}
            <option value="PRICE_ASC">{t('roomList.sortPriceAsc')}</option>
            <option value="PRICE_DESC">{t('roomList.sortPriceDesc')}</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Grid or Map */}
      {loading ? (
        <CardGridSkeleton count={PAGE_SIZE} />
      ) : isError ? (
        // Lỗi tải (mất mạng/lỗi server) — cố tình khác EmptyState "không có kết quả" bên dưới:
        // icon wifi-off, tone đỏ (rose) và nút Thử lại gọi refetch() thay vì đặt lại bộ lọc.
        <EmptyState
          icon={WifiOff}
          tone="rose"
          title={t('roomList.errorTitle')}
          description={t('roomList.errorDesc')}
          actionLabel={t('roomList.retryButton')}
          onAction={() => refetch()}
          className="max-w-lg mx-auto"
        />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={Info}
          tone="amber"
          title={t('roomList.emptyTitle')}
          description={t('roomList.emptyDesc')}
          actionLabel={t('roomList.resetFilters')}
          onAction={handleResetFilters}
          className="max-w-lg mx-auto"
        />
      ) : viewMode === 'map' ? (
        <RoomsMapView
          rooms={rooms}
          userLat={filters.userLat}
          userLng={filters.userLng}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onRequestTour={(r) => setSelectedRoomForTour(r)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && viewMode === 'grid' && (
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      )}

      {/* Viewing Tour Modal */}
      {selectedRoomForTour && (
        <RequestTourModal
          room={selectedRoomForTour}
          onClose={() => setSelectedRoomForTour(null)}
        />
      )}
    </div>
  );
};
