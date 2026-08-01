import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Room, FilterState } from '@/types';
import { roomApi } from '@/services/roomApi';
import { RoomCard } from '@/components/common/RoomCard';
import { RoomFilterBar } from '@/components/filter/RoomFilterBar';
import { RequestTourModal } from '@/components/common/RequestTourModal';
import { Pagination } from '@/components/common/Pagination';
import { Building2, ArrowUpDown, Loader2, Info } from 'lucide-react';

const PAGE_SIZE = 10;

const SORT_TO_BACKEND: Record<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC', 'newest' | 'price_asc' | 'price_desc'> = {
  NEWEST: 'newest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
};

export const RoomList: React.FC = () => {
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
          <span>Danh Sách Phòng Trọ Sẵn Có</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          Khám Phá & Đặt Lịch Xem Phòng
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tìm thấy <strong className="text-indigo-600 font-bold">{totalItems}</strong> phòng trọ phù hợp với tiêu chí tìm kiếm của bạn.
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
          Hiển thị <strong>{rooms.length}</strong> / <strong>{totalItems}</strong> phòng khả dụng
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 uppercase">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="NEWEST">Mới nhất</option>
            <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
            <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Room Grid / Empty State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Đang tải danh sách phòng trọ...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="py-16 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">Không tìm thấy phòng phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Thử thay đổi khu vực, khoảng giá hoặc đặt lại tất cả bộ lọc để tìm được nhiều kết quả hơn.
          </p>
          <button
            onClick={handleResetFilters}
            className="gradient-bg text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            Đặt lại bộ lọc
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
