import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Room, FilterState } from '@/types';
import { roomApi } from '@/services/roomApi';
import { RoomCard } from '@/components/common/RoomCard';
import { RoomFilterBar } from '@/components/filter/RoomFilterBar';
import { RequestTourModal } from '@/components/common/RequestTourModal';
import { Pagination } from '@/components/common/Pagination';
import { Building2, ArrowUpDown, Info } from 'lucide-react';
import { CardGridSkeleton } from '@/components/ui/Skeleton';

const PAGE_SIZE = 10;

const SORT_TO_BACKEND: Record<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC', 'newest' | 'price_asc' | 'price_desc'> = {
  NEWEST: 'newest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
};

export const RoomList: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    district: searchParams.get('district') || 'Tất cả quận/huyện',
    priceRange: searchParams.get('priceRange') || 'ALL',
    roomType: 'ALL',
    hasMezzanine: null,
    amenities: [],
    keyword: '',
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST');
  const [selectedRoomForTour, setSelectedRoomForTour] = useState<Room | null>(null);

  useEffect(() => {
    setPageNumber(1);
  }, [filters, sortBy]);

  useEffect(() => {
    setLoading(true);
    roomApi
      .getRoomsPaginated({
        ...filters,
        pageNumber,
        pageSize: PAGE_SIZE,
        sortBy: SORT_TO_BACKEND[sortBy],
      })
      .then((result) => {
        setRooms(result.rooms);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
        setLoading(false);
      });
  }, [filters, sortBy, pageNumber]);

  const handleResetFilters = () => {
    setFilters({
      district: 'Tất cả quận/huyện',
      priceRange: 'ALL',
      roomType: 'ALL',
      hasMezzanine: null,
      amenities: [],
      keyword: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
          <Building2 className="w-4 h-4" />
          <span>{t('roomList.badge')}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          {t('roomList.title')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('roomList.foundPrefix')} <strong className="text-indigo-600 font-bold">{totalItems}</strong> {t('roomList.foundSuffix')}
        </p>
      </div>

      {/* Filter Bar */}
      <RoomFilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Control Bar: Sort & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="text-sm text-slate-600 font-medium">
          {t('roomList.showing')} <strong>{rooms.length}</strong> / <strong>{totalItems}</strong> {t('roomList.roomsAvailableSuffix')}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 uppercase">{t('roomList.sortBy')}</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="NEWEST">{t('roomList.sortNewest')}</option>
            <option value="PRICE_ASC">{t('roomList.sortPriceAsc')}</option>
            <option value="PRICE_DESC">{t('roomList.sortPriceDesc')}</option>
          </select>
        </div>
      </div>

      {/* Room Grid / Empty State */}
      {loading ? (
        <CardGridSkeleton count={PAGE_SIZE} />
      ) : rooms.length === 0 ? (
        <div className="py-16 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">{t('roomList.emptyTitle')}</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {t('roomList.emptyDesc')}
          </p>
          <button
            onClick={handleResetFilters}
            className="gradient-bg text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            {t('roomList.resetFilters')}
          </button>
        </div>
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

      {totalPages > 1 && (
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
