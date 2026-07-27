import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Room } from '@/types';
import { roomApi } from '@/services/roomApi';
import { RequestTourModal } from '@/components/common/RequestTourModal';
import { RoomCard } from '@/components/common/RoomCard';
import { MapPin, Maximize2, Users, Layers, ShieldCheck, PhoneCall, CalendarCheck, CheckCircle2, Building2, ChevronLeft, Share2, Heart, Info, ArrowRight } from 'lucide-react';
import { VietMapViewer } from '@/components/common/VietMapViewer';
import { useToast } from '@/context/ToastContext';

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [room, setRoom] = useState<Room | null>(null);
  const [similarRooms, setSimilarRooms] = useState<Room[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTourModal, setShowTourModal] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      roomApi.getRoomById(id).then((data) => {
        setRoom(data);
        setActiveImageIndex(0);
      });

      roomApi.getRooms().then((all) => {
        setSimilarRooms(all.filter((r) => r.id !== id).slice(0, 3));
      });
    }
  }, [id]);

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Đang tải thông tin phòng...</h2>
        <Link to="/rooms" className="text-indigo-600 font-bold text-sm hover:underline">
          Quay lại danh sách phòng
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Đã sao chép liên kết trang phòng vào bộ nhớ tạm!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back link & actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại danh sách phòng trọ</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>
          <button
            onClick={() => {
              setSaved(!saved);
              toast.success(saved ? 'Đã bỏ lưu phòng' : 'Đã lưu phòng vào danh sách yêu thích!');
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              saved ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Đã lưu' : 'Lưu phòng'}</span>
          </button>
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
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Phòng trống khả dụng</span>
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
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{room.address}, {room.district}, {room.city}</span>
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">Giá Thuê</span>
              <span className="text-lg font-black text-emerald-600 font-heading">
                {formatPrice(room.price)}/tháng
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">Tiền Cọc</span>
              <span className="text-sm font-bold text-slate-800">
                {formatPrice(room.depositPrice)}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">Diện Tích</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-indigo-500" />
                {room.area} m²
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold block">Số Người Ở</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-500" />
                Tối đa {room.maxPeople} người
              </span>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Tiện Ích & Trang Thiết Bị
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

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Mô Tả Chi Tiết Phòng
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
              {room.description}
            </div>
          </div>

          {/* VietMap Map Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <VietMapViewer
              lat={21.0285}
              lng={105.8542}
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
              <span className="text-xs text-slate-400 font-semibold">Giá thuê niêm yết</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400 font-heading">
                  {formatPrice(room.price)}
                </span>
                <span className="text-xs text-slate-300">/ tháng</span>
              </div>
              <p className="text-[11px] text-slate-400">Đã bao gồm tiền phí quản lý tòa nhà</p>
            </div>

            {/* Landlord Profile */}
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={room.landlordAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={room.landlordName}
                className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-indigo-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-500 font-semibold block">Đăng bởi Chủ nhà</span>
                <h4 className="text-sm font-bold text-slate-900 truncate">{room.landlordName}</h4>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Đã xác minh danh tính
                </span>
              </div>
            </div>

            {/* Direct Primary Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowTourModal(true)}
                className="w-full py-4 rounded-2xl gradient-bg text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Yêu Cầu Xem Phòng Trực Tiếp</span>
              </button>

              <a
                href={`tel:${room.landlordPhone}`}
                className="w-full py-3.5 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm border border-indigo-200 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                <span>Gọi Chủ Nhà: {room.landlordPhone}</span>
              </a>
            </div>

            {/* Trust Assurance Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Đặt hẹn nhanh chóng, chủ nhà hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Miễn phí 100% dịch vụ xem phòng cho người thuê</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Similar Rooms Recommendation */}
      {similarRooms.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Phòng Trọ Tương Tự
            </h2>
            <Link
              to="/rooms"
              className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Khám phá thêm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarRooms.map((r) => (
              <RoomCard key={r.id} room={r} onRequestTour={(rm) => {
                setRoom(rm);
                setShowTourModal(true);
              }} />
            ))}
          </div>
        </section>
      )}

      {/* Viewing Tour Modal */}
      {showTourModal && (
        <RequestTourModal
          room={room}
          onClose={() => setShowTourModal(false)}
        />
      )}
    </div>
  );
};
