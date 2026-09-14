import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Room } from '@/types';
import { roomApi } from '@/services/roomApi';
import { appointmentApi, Appointment } from '@/services/appointmentApi';
import { bookingApi } from '@/services/bookingApi';
import { collaboratorApi, HouseCollaborator } from '@/services/collaboratorApi';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { recentlyViewedApi } from '@/utils/recentlyViewed';
import { RoomReviews } from '@/components/room/RoomReviews';
import { ReportRoomButton } from '@/components/room/ReportRoomButton';
import { RoomCard } from '@/components/common/RoomCard';
import { ContactCollaboratorModal } from '@/components/common/ContactCollaboratorModal';
import { MapPin, Maximize2, Users, ShieldCheck, CalendarCheck, CheckCircle2, Building2, ChevronLeft, Share2, Heart, ArrowRight, Clock, AlertCircle, Receipt, Wallet, Users2 } from 'lucide-react';
import { VietMapViewer } from '@/components/common/VietMapViewer';
import { useToast } from '@/context/ToastContext';
import { RoomDetailSkeleton } from '@/components/ui/Skeleton';
import { getApiErrorMessage } from '@/utils/apiError';
import { Seo } from '@/components/common/Seo';
import { JsonLd } from '@/components/common/JsonLd';
import { absoluteUrl } from '@/config/seo';

export const RoomDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id, groupId } = useParams<{ id?: string; groupId?: string }>();
  const isGroupView = !!groupId;
  const targetId = groupId || id;
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  const [room, setRoom] = useState<Room | null>(null);
  const [similarRooms, setSimilarRooms] = useState<Room[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [collaborators, setCollaborators] = useState<HouseCollaborator[]>([]);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const fetchActiveAppointment = async (currentRoom: Room | null) => {
    if (!isAuthenticated || !targetId || !currentRoom) return;
    try {
      const res: any = await appointmentApi.getTenantAppointments();
      const list: Appointment[] = res.data?.data || res.data || (Array.isArray(res) ? res : []);
      const found = list.find((app) => {
        const matchesRoom = currentRoom.roomGroupId
          ? app.rentRoom?.roomGroupId === currentRoom.roomGroupId
          : app.rentRoomId === targetId;
        return matchesRoom && ['PENDING_OWNER', 'OWNER_OFFERED_TIMES', 'USER_ACCEPTED'].includes(app.status);
      });
      setActiveAppointment(found || null);
    } catch (err) {
      console.warn('Failed to fetch tenant appointment:', err);
    }
  };

  useEffect(() => {
    if (targetId) {
      window.scrollTo(0, 0);
      setLoading(true);
      const fetchDetail = isGroupView ? roomApi.getRoomGroupById(targetId) : roomApi.getRoomById(targetId);
      fetchDetail
        .then((data) => {
          setRoom(data);
          setActiveImageIndex(0);
          fetchActiveAppointment(data);
          if (data) {
            recentlyViewedApi.add(data);
          }
          if (data?.houseId) {
            collaboratorApi
              .getHouseCollaborators(data.houseId)
              .then((res: any) => setCollaborators(res?.data || res || []))
              .catch(() => setCollaborators([]));
          }
        })
        .finally(() => setLoading(false));

      roomApi.getRooms().then((all) => {
        // Grouped listings are keyed by roomGroupId (the representative room's
        // own id != the group's id), so exclude by group id when applicable —
        // otherwise the current group could show up in its own recommendations.
        setSimilarRooms(
          all.filter((r) => (r.roomGroupId ? r.roomGroupId !== targetId : r.id !== targetId)).slice(0, 3)
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, isGroupView, isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoomDetailSkeleton />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">{t('roomDetail.notFoundTitle')}</h2>
        <p className="text-sm text-slate-500">{t('roomDetail.notFoundDesc')}</p>
        <Link to="/rooms" className="text-indigo-600 font-bold text-sm hover:underline">
          {t('roomDetail.backToList')}
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} ${t('roomCard.million')}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info(t('roomDetail.toastLinkCopied'));
  };

  const handleRequestViewing = async () => {
    if (!isAuthenticated) {
      toast.warning(t('roomDetail.toastNeedLogin'));
      navigate(`/login?redirect=${isGroupView ? `/room-groups/${room.roomGroupId}` : `/rooms/${room.id}`}`);
      return;
    }

    if (activeAppointment) {
      if (activeAppointment.status === 'OWNER_OFFERED_TIMES' || activeAppointment.status === 'USER_ACCEPTED') {
        navigate('/appointments');
      }
      return;
    }

    setSubmitting(true);
    try {
      const fullNote = t('roomDetail.viewingNote', { name: user?.fullName || '', phone: user?.phoneNumber || '' });
      await appointmentApi.createAppointment(
        room.roomGroupId
          ? { roomGroupId: room.roomGroupId, note: fullNote }
          : { rentRoomId: room.id, note: fullNote }
      );

      toast.success(t('roomDetail.toastRequestSuccess'));
      fetchActiveAppointment(room);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Ngắn hạn = thanh toán QR trong app ngay; dài hạn = đặt lịch xem phòng như cũ.
  // Cả 2 loại đều có thể "Liên hệ cộng tác viên" (ẩn nếu chưa có ai được gán cho toà nhà).
  const canBookShortTerm =
    (room.rentalTermType === 'SHORT_TERM' || room.rentalTermType === 'BOTH') && !!room.shortTermPrice;
  const hasCollaborators = collaborators.length > 0;

  const handleBookAndPay = async () => {
    if (!isAuthenticated) {
      toast.warning(t('roomDetail.toastNeedLogin'));
      navigate(`/login?redirect=/rooms/${room.id}`);
      return;
    }

    if (bookingSubmitting) return;
    setBookingSubmitting(true);
    try {
      const res: any = await bookingApi.createBooking(room.id);
      const booking = res?.data || res;
      navigate(`/payment/${booking.id}`);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setBookingSubmitting(false);
    }
  };

  const detailPath = isGroupView ? `/room-groups/${targetId}` : `/rooms/${targetId}`;
  const effectivePrice = room.price || room.shortTermPrice || 0;
  const roomSeoDescription = (room.description || '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    t('seo.roomDetailFallbackDescription', { name: room.name, address: room.address });

  // Nút hành động chính (giống hệt logic trong sidebar gốc) — dùng lại nguyên khối này ở cả
  // sidebar (>= lg) lẫn thanh CTA sticky mobile (< lg) để KHÔNG tạo ra 2 nguồn sự thật cho
  // cùng 1 hành vi (đặt & thanh toán / đặt lịch xem phòng / trạng thái lịch hẹn hiện tại).
  const primaryActionButton = canBookShortTerm ? (
    <button
      onClick={handleBookAndPay}
      disabled={bookingSubmitting}
      className="w-full py-4 rounded-2xl gradient-bg text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
    >
      <Wallet className="w-5 h-5" />
      <span>{bookingSubmitting ? t('roomDetail.creatingBooking') : t('roomDetail.bookAndPayButton')}</span>
    </button>
  ) : activeAppointment ? (
    activeAppointment.status === 'PENDING_OWNER' ? (
      <div className="w-full py-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed text-center px-3">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t('roomDetail.statusPending')}</span>
      </div>
    ) : activeAppointment.status === 'OWNER_OFFERED_TIMES' ? (
      <button
        onClick={() => navigate('/appointments')}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-center px-3"
      >
        <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
        <span>{t('roomDetail.statusOffered')}</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/appointments')}
        className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-center px-3"
      >
        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
        <span>{t('roomDetail.statusConfirmed')}</span>
      </button>
    )
  ) : (
    <button
      onClick={handleRequestViewing}
      disabled={submitting}
      className="w-full py-4 rounded-2xl gradient-bg text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
    >
      <CalendarCheck className="w-5 h-5" />
      <span>{submitting ? t('roomDetail.sending') : t('roomDetail.requestViewingButton')}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-8 space-y-10">
      <Seo
        title={`${room.name} - ${room.address}`}
        description={roomSeoDescription}
        path={detailPath}
        image={room.images?.[0]}
        type="article"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: room.name,
          description: roomSeoDescription,
          image: room.images?.length ? room.images : undefined,
          brand: { '@type': 'Organization', name: room.houseName },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: effectivePrice || undefined,
            availability: room.status === 'EMPTY' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: absoluteUrl(detailPath),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('navbar.home'), item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: t('roomList.title'), item: absoluteUrl('/rooms') },
            { '@type': 'ListItem', position: 3, name: room.name, item: absoluteUrl(detailPath) },
          ],
        }}
      />

      {/* Back link & actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('roomDetail.backLink')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('roomDetail.share')}</span>
          </button>
          <button
            onClick={async () => {
              if (!isAuthenticated) {
                toast.warning(t('roomDetail.toastNeedLogin'));
                navigate(`/login?redirect=${detailPath}`);
                return;
              }
              try {
                const nowFavorited = await toggleFavorite(room.id);
                toast.success(nowFavorited ? t('roomDetail.toastSaved') : t('roomDetail.toastUnsaved'));
              } catch (err) {
                toast.error(getApiErrorMessage(err));
              }
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isFavorited(room.id) ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited(room.id) ? 'fill-rose-600' : ''}`} />
            <span className="hidden sm:inline">{isFavorited(room.id) ? t('roomDetail.savedLabel') : t('roomDetail.saveRoom')}</span>
          </button>
          {/* Tố cáo phòng — ngang hàng cùng Chia sẻ / Lưu phòng. Bất kỳ khách đã đăng nhập nào
              cũng gửi được, không cần từng thuê phòng (khác RoomReviews bên dưới). */}
          <ReportRoomButton
            roomId={room.id}
            roomName={room.name}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          />
        </div>
      </div>

      {/* Main Grid: Left Gallery + Right Landlord Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
              <img
                src={room.images[activeImageIndex] || room.images[0]}
                alt={room.name}
                // Ảnh chính là nội dung LCP của trang chi tiết phòng — tải ngay + ưu tiên cao,
                // KHÔNG lazy (khác các ảnh thumbnail bên dưới).
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {isGroupView && room.availableCount !== undefined
                    ? t('roomDetail.availableCount', { count: room.availableCount })
                    : t('roomDetail.roomAvailable')}
                </span>
              </div>
            </div>

            {/* Thumbnail Selector */}
            {room.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-indigo-600 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & House Info */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              <span>{room.houseName} • {room.district}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {room.name}
            </h1>
            {isGroupView && (
              <p className="text-xs text-slate-500">
                {t('roomDetail.groupDescription', { count: room.availableCount ?? t('roomDetail.several'), houseName: room.houseName })}
              </p>
            )}
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{room.address}, {room.district}, {room.city}</span>
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">{t('roomDetail.rentPrice')}</span>
              <span className="text-lg font-black text-emerald-600 font-heading">
                {formatPrice(room.price)} / {room.longTermDurationValue && room.longTermDurationValue > 1 ? `${room.longTermDurationValue} ` : ''}{room.longTermPriceUnit === 'PER_YEAR' ? 'năm' : 'tháng'}
              </span>
            </div>

            {room.shortTermPrice ? (
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Giá ngắn hạn</span>
                <span className="text-base font-bold text-amber-600 font-heading">
                  {formatPrice(room.shortTermPrice)} / {room.shortTermDurationValue && room.shortTermDurationValue > 1 ? `${room.shortTermDurationValue} ` : ''}{room.shortTermPriceUnit === 'PER_HOUR' ? 'giờ' : 'ngày'}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">{t('roomDetail.deposit')}</span>
                <span className="text-sm font-bold text-slate-800">
                  {formatPrice(room.depositPrice)}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">{t('roomDetail.area')}</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-indigo-500" />
                {room.area} m²
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">Thời hạn HĐ tối thiểu</span>
              <span className="text-sm font-bold text-indigo-600">
                {room.minContractTermMonths ? `${room.minContractTermMonths} tháng` : 'Linh hoạt'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">{t('roomDetail.occupancy')}</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-500" />
                {t('roomCard.maxPeople', { count: room.maxPeople })}
              </span>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {t('roomDetail.amenitiesTitle')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {room.amenities.map((amt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{amt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          {room.services && room.services.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {t('roomDetail.servicesTitle')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60"
                  >
                    <Receipt className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{svc.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold">
                        {svc.price !== undefined ? `${svc.price.toLocaleString('vi-VN')} ${t('roomDetail.currency')}` : t('roomDetail.contactOwner')}
                      </p>
                      {svc.note && <p className="text-[11px] text-slate-400 mt-0.5">{svc.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {t('roomDetail.descriptionTitle')}
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
              {room.description}
            </div>
          </div>

          {/* VietMap Map Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <VietMapViewer
              lat={room.latitude}
              lng={room.longitude}
              roomName={room.name}
              address={`${room.address}, ${room.district}, ${room.city}`}
              height="320px"
            />
          </div>

        </div>

        {/* Right Sticky Sidebar: Landlord Card & Action Buttons */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200/90 sticky top-28 space-y-6">
            
            {/* Price Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-semibold">{t('roomDetail.listedPrice')}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400 font-heading">
                  {formatPrice(room.price)}
                </span>
                <span className="text-xs text-slate-300">{t('roomDetail.perMonthLong')}</span>
              </div>
              <p className="text-[11px] text-slate-400">{t('roomDetail.priceIncludesFee')}</p>
            </div>

            {/* Direct Primary Actions */}
            <div className="space-y-3">
              {primaryActionButton}

              {hasCollaborators && (
                <button
                  onClick={() => setShowCollaboratorModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-sm border border-amber-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Users2 className="w-4 h-4 text-amber-600" />
                  <span>{t('roomDetail.contactCollaboratorButton')}</span>
                </button>
              )}
            </div>

            {/* Trust Assurance Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('roomDetail.trustNote1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('roomDetail.trustNote2')}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Đánh giá sau khi ở — công khai, chỉ RENT_USER từng thuê phòng này mới viết được */}
      <RoomReviews roomId={room.id} />

      {/* Similar Rooms Recommendation */}
      {similarRooms.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              {t('roomDetail.similarRoomsTitle')}
            </h2>
            <Link
              to="/rooms"
              className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>{t('roomDetail.exploreMore')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarRooms.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </section>
      )}

      {showCollaboratorModal && (
        <ContactCollaboratorModal
          collaborators={collaborators}
          onClose={() => setShowCollaboratorModal(false)}
        />
      )}

      {/* Sticky mobile CTA — dưới lg, sidebar gốc (giá + nút hành động) nằm sau toàn bộ
          gallery/thông số/tiện ích/mô tả/bản đồ trong DOM khi xếp chồng 1 cột, nên người
          dùng phải cuộn rất xa mới thấy nút hành động chính. Thanh này luôn hiện trên mobile
          bất kể vị trí cuộn (chấp nhận trùng với sidebar gốc khi đã cuộn tới đó) để tránh
          logic ẩn/hiện theo scroll phức tạp không cần thiết. Từ lg trở lên ẩn hẳn — sidebar
          sticky gốc đã đủ tốt. */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-200/80 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.15)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="shrink-0 leading-tight">
            <span className="block text-[10px] text-slate-500 font-semibold">{t('roomDetail.listedPrice')}</span>
            <span className="block text-base font-black text-emerald-600 font-heading whitespace-nowrap">
              {formatPrice(room.price)}
            </span>
          </div>
          <div className="flex-1 min-w-0">{primaryActionButton}</div>
        </div>
      </div>
    </div>
  );
};
