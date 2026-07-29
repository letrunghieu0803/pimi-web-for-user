import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
  Award,
  DollarSign,
  UserCheck,
  Clock,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RentalHistoryItem {
  id: string;
  roomId: string;
  roomName: string;
  houseName: string;
  address: string;
  district: string;
  city: string;
  price: number;
  depositPrice: number;
  startDate: string;
  endDate: string;
  landlordName: string;
  landlordPhone: string;
  hasContract: boolean;
  contractCode?: string;
  paymentDay?: number;
  status: 'ACTIVE' | 'COMPLETED';
}

const INITIAL_RENTAL_HISTORY: RentalHistoryItem[] = [
  {
    id: 'rent-001',
    roomId: 'room-1',
    roomName: 'Phòng Studio Đầy Đủ Nội Thất Cao Cấp Cầu Giấy',
    houseName: 'Pimi Home Cầu Giấy',
    address: 'Số 15 Ngõ 68 Cầu Giấy, Phường Quan Hoa',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    price: 4500000,
    depositPrice: 4500000,
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    landlordName: 'Nguyễn Văn Minh',
    landlordPhone: '0987654321',
    hasContract: true,
    contractCode: 'HD-PIMI-2026-088',
    paymentDay: 5,
    status: 'ACTIVE',
  },
  {
    id: 'rent-002',
    roomId: 'room-2',
    roomName: 'Căn Hộ Mini Có Gác Xép Rộng Trần Duy Hưng',
    houseName: 'Ký Túc Xá & Căn Hộ Pimi Luxury',
    address: 'Ngõ 204 Trần Duy Hưng, Phường Trung Hòa',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    price: 3800000,
    depositPrice: 3800000,
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    landlordName: 'Trần Thị Thu',
    landlordPhone: '0912345678',
    hasContract: false,
    status: 'COMPLETED',
  },
];

export const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'ALL' | 'WITH_CONTRACT' | 'DIRECT_RENTAL'>('ALL');
  const [selectedContract, setSelectedContract] = useState<RentalHistoryItem | null>(null);

  const rentalList = INITIAL_RENTAL_HISTORY;

  const filtered = rentalList.filter((item) => {
    if (filterType === 'WITH_CONTRACT') return item.hasContract;
    if (filterType === 'DIRECT_RENTAL') return !item.hasContract;
    return true;
  });

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
          <Award className="w-4 h-4" />
          <span>Lịch Sử Thuê Nhà Thành Công</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          Danh Sách Căn Hộ & Phòng Trọ Đã Thuê
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi thông tin chi tiết các phòng trọ bạn đã thuê thành công (Bao gồm hợp đồng điện tử chính thức hoặc xác nhận thuê trực tiếp với chủ nhà).
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Tổng số phòng đã thuê</span>
            <span className="text-2xl font-black text-slate-900 font-heading">{rentalList.length} phòng</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Có hợp đồng điện tử</span>
            <span className="text-2xl font-black text-slate-900 font-heading">
              {rentalList.filter((r) => r.hasContract).length} phòng
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Xác nhận trực tiếp</span>
            <span className="text-2xl font-black text-slate-900 font-heading">
              {rentalList.filter((r) => !r.hasContract).length} phòng
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'ALL', label: 'Tất cả thuê thành công' },
          { id: 'WITH_CONTRACT', label: 'Có Hợp đồng điện tử' },
          { id: 'DIRECT_RENTAL', label: 'Xác nhận thuê trực tiếp' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'gradient-bg text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rental List Cards */}
      {filtered.length === 0 ? (
        <div className="py-16 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">Chưa có lịch sử thuê</h3>
          <p className="text-xs text-slate-500">
            Bạn chưa có dữ liệu thuê nhà thành công thuộc danh mục này.
          </p>
          <Link
            to="/rooms"
            className="gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md inline-block"
          >
            Khám phá phòng trọ khả dụng
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/90 shadow-lg space-y-5 hover:border-indigo-200 transition-all"
            >
              {/* Top Row: Title + Contract Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                      {item.houseName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {item.roomName}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.address}, {item.district}, {item.city}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {item.hasContract ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Hợp đồng điện tử chính thức ({item.contractCode})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                      <UserCheck className="w-4 h-4 text-sky-600" />
                      <span>Xác nhận thuê trực tiếp</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Specification Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Giá thuê hàng tháng</span>
                  <strong className="text-slate-900 text-sm font-black text-emerald-600">
                    {formatPrice(item.price)}/tháng
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Tiền cọc</span>
                  <strong className="text-slate-900 text-xs font-bold">
                    {formatPrice(item.depositPrice)}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Thời hạn hợp đồng / Thuê</span>
                  <strong className="text-slate-900 text-xs font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {item.startDate} → {item.endDate}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Chủ nhà liên hệ</span>
                  <strong className="text-slate-900 text-xs font-bold block truncate">
                    {item.landlordName} ({item.landlordPhone})
                  </strong>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <Link
                  to={`/rooms/${item.roomId}`}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Xem chi tiết thông tin phòng trọ</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${item.landlordPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Gọi Chủ Nhà</span>
                  </a>

                  {item.hasContract && (
                    <button
                      onClick={() => setSelectedContract(item)}
                      className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Hợp Đồng</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Chi Tiết Hợp Đồng Thuê Nhà
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">{selectedContract.contractCode}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phòng trọ:</span>
                  <strong className="text-slate-900 font-bold">{selectedContract.roomName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ:</span>
                  <span className="text-slate-900 font-semibold">{selectedContract.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ nhà cho thuê:</span>
                  <strong className="text-slate-900 font-bold">{selectedContract.landlordName} ({selectedContract.landlordPhone})</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">Giá thuê thỏa thuận:</span>
                  <strong className="text-emerald-600 font-black text-sm">
                    {formatPrice(selectedContract.price)}/tháng
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Tiền đặt cọc:</span>
                  <strong className="text-slate-900 font-bold text-xs">
                    {formatPrice(selectedContract.depositPrice)}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Ngày thanh toán hàng tháng:</span>
                  <strong className="text-indigo-600 font-bold text-xs">
                    Ngày {selectedContract.paymentDay || 5} hàng tháng
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Hiệu lực hợp đồng:</span>
                  <strong className="text-slate-900 font-bold text-xs">
                    12 tháng
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hợp đồng được ký kết điện tử và bảo hộ tính pháp lý 100% trên hệ thống Pimi.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md"
              >
                Đóng thông tin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
