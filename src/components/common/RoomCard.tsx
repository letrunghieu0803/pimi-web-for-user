import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '@/types';
import { MapPin, Maximize2, Users, CalendarCheck, ShieldCheck, Layers } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onRequestTour?: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onRequestTour }) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;
    }
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/80 hover:border-indigo-200">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={room.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="badge-tag bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Phòng trống</span>
          </span>

          {room.hasMezzanine && (
            <span className="badge-tag bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>Có gác xép</span>
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl shadow-lg flex items-baseline gap-1">
          <span className="text-lg font-black text-emerald-400 font-heading">
            {formatPrice(room.price)}
          </span>
          <span className="text-[11px] text-slate-300">/tháng</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* House Name & District */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1.5">
            <span className="truncate max-w-[180px] text-indigo-600 font-bold">{room.houseName}</span>
            <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700 font-medium">
              {room.district}
            </span>
          </div>

          {/* Title */}
          <Link to={`/rooms/${room.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug font-heading">
              {room.name}
            </h3>
          </Link>

          {/* Address */}
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{room.address}</span>
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{room.area} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tối đa {room.maxPeople} người</span>
            </div>
          </div>

          {/* Amenities Badges (First 3) */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {room.amenities.slice(0, 3).map((amt, idx) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                {amt}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{room.amenities.length - 3} khác
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/rooms/${room.id}`}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors text-center"
          >
            Xem chi tiết
          </Link>
          
          <Link
            to={`/rooms/${room.id}`}
            className="flex-1 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 text-center"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Hẹn xem phòng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
