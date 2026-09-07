import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Award,
  UserCheck,
  Wallet,
  Eye,
  X,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { contractApi, Contract } from '@/services/contractApi';
import { bookingApi, Booking } from '@/services/bookingApi';
import { collaboratorApi, HouseCollaborator } from '@/services/collaboratorApi';
import { ContactCollaboratorModal } from '@/components/common/ContactCollaboratorModal';
import { ReportRoomButton } from '@/components/room/ReportRoomButton';

// Lịch sử thuê hợp nhất từ 2 nguồn dữ liệu thật, khác hẳn nhau về bản chất — không còn khái
// niệm "xác nhận trực tiếp với chủ nhà" (mock cũ tự bịa, hệ thống thật không có luồng này):
// - CONTRACT: hợp đồng dài hạn (bảng Contract) — không có ngày kết thúc lưu sẵn, "đã kết thúc"
//   suy ra từ isDeleted (deleteOne() ở backend soft-delete khi chấm dứt hợp đồng thật).
// - BOOKING: đặt phòng ngắn hạn đã thanh toán qua app (bảng Booking) — chỉ tính các trạng thái
//   đã thực sự xảy ra (PAID/CHECKED_IN/PAYOUT_COMPLETED), bỏ qua PENDING_PAYMENT/EXPIRED vì đó
//   là các lượt đặt chưa từng thành công.
interface HistoryItem {
  id: string;
  kind: 'CONTRACT' | 'BOOKING';
  roomId: string;
  houseId: string;
  houseName: string;
  roomName: string;
  price: number;
  date: string;
  isEnded: boolean;
  contract?: Contract;
  booking?: Booking;
}

const SUCCESSFUL_BOOKING_STATUSES = ['PAID', 'CHECKED_IN', 'PAYOUT_COMPLETED'];

const toNumber = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const BookingHistory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'ALL' | 'CONTRACT' | 'BOOKING'>('ALL');
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contactHouseId, setContactHouseId] = useState<string | null>(null);
  const [contactCollaborators, setContactCollaborators] = useState<HouseCollaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const [contractsRes, bookingsRes]: [any, any] = await Promise.all([
          contractApi.getMyContracts({ pageSize: 100 }),
          bookingApi.getTenantBookings({ pageSize: 100 })
        ]);

        const contracts: Contract[] = contractsRes?.data || [];
        const bookings: Booking[] = bookingsRes?.data || [];

        const contractItems: HistoryItem[] = contracts.map((c) => ({
          id: `contract-${c.id}`,
          kind: 'CONTRACT',
          roomId: c.rentRoomId,
          houseId: c.rentHouseId,
          houseName: c.rentHouse?.name || '',
          roomName: c.roomName,
          price: toNumber(c.roomPrice),
          date: c.createdAt,
          isEnded: c.isDeleted,
          contract: c
        }));

        const bookingItems: HistoryItem[] = bookings
          .filter((b) => SUCCESSFUL_BOOKING_STATUSES.includes(b.status))
          .map((b) => ({
            id: `booking-${b.id}`,
            kind: 'BOOKING',
            roomId: b.rentRoomId,
            houseId: b.rentHouseId,
            houseName: (b as any).rentHouse?.name || '',
            roomName: b.roomName,
            price: toNumber(b.amount),
            date: (b.paidAt as string) || (b as any).createdAt,
            isEnded: b.status === 'PAYOUT_COMPLETED',
            booking: b
          }));

        const merged = [...contractItems, ...bookingItems].sort(
          (a, bItem) => new Date(bItem.date).getTime() - new Date(a.date).getTime()
        );

        setItems(merged);
      } catch (err) {
        setError(t('bookingHistory.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [t]);

  const filtered = items.filter((item) => {
    if (filterType === 'CONTRACT') return item.kind === 'CONTRACT';
    if (filterType === 'BOOKING') return item.kind === 'BOOKING';
    return true;
  });

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} ${t('roomCard.million')}`;
  };

  const openContactModal = async (houseId: string) => {
    setContactHouseId(houseId);
    setLoadingCollaborators(true);
    try {
      const res: any = await collaboratorApi.getHouseCollaborators(houseId);
      setContactCollaborators(res?.data || res || []);
    } catch {
      setContactCollaborators([]);
    } finally {
      setLoadingCollaborators(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Seo title={t('bookingHistory.title')} path="/bookings" noindex />

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
          <Award className="w-4 h-4" />
          <span>{t('bookingHistory.badge')}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          {t('bookingHistory.title')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('bookingHistory.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="py-16 bg-rose-50 rounded-3xl border border-rose-200 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">{t('bookingHistory.totalRented')}</span>
                <span className="text-2xl font-black text-slate-900 font-heading">{t('bookingHistory.roomCount', { count: items.length })}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">{t('bookingHistory.withContract')}</span>
                <span className="text-2xl font-black text-slate-900 font-heading">
                  {t('bookingHistory.roomCount', { count: items.filter((i) => i.kind === 'CONTRACT').length })}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">{t('bookingHistory.shortTermBookings')}</span>
                <span className="text-2xl font-black text-slate-900 font-heading">
                  {t('bookingHistory.roomCount', { count: items.filter((i) => i.kind === 'BOOKING').length })}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {[
              { id: 'ALL', label: t('bookingHistory.filterAll') },
              { id: 'CONTRACT', label: t('bookingHistory.filterContract') },
              { id: 'BOOKING', label: t('bookingHistory.filterBooking') }
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
              <h3 className="text-lg font-bold text-slate-900 font-heading">{t('bookingHistory.emptyTitle')}</h3>
              <p className="text-xs text-slate-500">
                {t('bookingHistory.emptyDesc')}
              </p>
              <Link
                to="/rooms"
                className="gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md inline-block"
              >
                {t('bookingHistory.exploreRooms')}
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-200/90 shadow-lg space-y-5 hover:border-indigo-200 transition-all"
                >
                  {/* Top Row: Title + Kind Badge */}
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
                    </div>

                    <div className="flex items-center gap-2">
                      {item.kind === 'CONTRACT' ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs border ${
                            item.isEnded
                              ? 'bg-slate-100 text-slate-500 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{item.isEnded ? t('bookingHistory.contractEnded') : t('bookingHistory.contractActive')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                          <UserCheck className="w-4 h-4 text-sky-600" />
                          <span>{t(`bookingHistory.bookingStatus.${item.booking?.status}`)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specification Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                        {item.kind === 'CONTRACT' ? t('bookingHistory.monthlyRent') : t('bookingHistory.totalPaid')}
                      </span>
                      <strong className="text-slate-900 text-sm font-black text-emerald-600">
                        {formatPrice(item.price)}{item.kind === 'CONTRACT' ? t('roomCard.perMonth') : ''}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                        {item.kind === 'CONTRACT' ? t('bookingHistory.contractDuration') : t('bookingHistory.bookingDate')}
                      </span>
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {item.kind === 'CONTRACT'
                          ? t('bookingHistory.monthsValue', { count: item.contract?.monthDurationToPay })
                          : new Date(item.date).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">{t('bookingHistory.startDate')}</span>
                      <strong className="text-slate-900 text-xs font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {new Date(item.date).toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/rooms/${item.roomId}`}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <span>{t('bookingHistory.viewRoomDetails')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      {/* Tố cáo phòng đang/đã thuê — cùng modal dùng ở trang chi tiết phòng. */}
                      <ReportRoomButton
                        roomId={item.roomId}
                        roomName={item.roomName}
                        variant="link"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openContactModal(item.houseId)}
                        className="px-3.5 py-2 rounded-xl bg-[#0068ff]/10 text-[#0068ff] hover:bg-[#0068ff]/20 font-bold text-xs border border-[#0068ff]/20 transition-colors flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{t('bookingHistory.zaloButton')}</span>
                      </button>

                      {item.kind === 'CONTRACT' ? (
                        <button
                          onClick={() => setSelectedContract(item.contract || null)}
                          className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('bookingHistory.viewContract')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/payment/${item.booking?.id}`)}
                          className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('bookingHistory.viewBooking')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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
                    {t('bookingHistory.contractModalTitle')}
                  </h3>
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
                  <span className="text-slate-500">{t('bookingHistory.modalRoom')}</span>
                  <strong className="text-slate-900 font-bold">{selectedContract.roomName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('bookingHistory.modalHouse')}</span>
                  <span className="text-slate-900 font-semibold">{selectedContract.rentHouse?.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('bookingHistory.modalAgreedPrice')}</span>
                  <strong className="text-emerald-600 font-black text-sm">
                    {formatPrice(toNumber(selectedContract.roomPrice))}{t('roomCard.perMonth')}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">{t('bookingHistory.modalPaymentDay')}</span>
                  <strong className="text-indigo-600 font-bold text-xs">
                    {t('bookingHistory.modalPaymentDayValue', { day: selectedContract.rentDueDate || 5 })}
                  </strong>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">{t('bookingHistory.modalValidity')}</span>
                  <strong className="text-slate-900 font-bold text-xs">
                    {t('bookingHistory.monthsValue', { count: selectedContract.monthDurationToPay })}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('bookingHistory.modalLegalNote')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md"
              >
                {t('bookingHistory.modalClose')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Collaborator Modal */}
      {contactHouseId && !loadingCollaborators && (
        <ContactCollaboratorModal
          collaborators={contactCollaborators}
          onClose={() => setContactHouseId(null)}
        />
      )}
    </div>
  );
};
