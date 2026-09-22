export type RoomStatus = 'EMPTY' | 'OCCUPIED' | 'MAINTENANCE';

export type RoomType = 'APARTMENT' | 'MINI_APARTMENT' | 'BOARDING_HOUSE' | 'WHOLE_HOUSE';

export type RentalTermType = 'SHORT_TERM' | 'LONG_TERM' | 'BOTH';
export type ShortTermPriceUnit = 'PER_DAY' | 'PER_HOUR';
export type LongTermPriceUnit = 'PER_MONTH' | 'PER_YEAR';

export interface Room {
  id: string;
  name: string;
  houseName: string;
  houseId?: string;
  price: number; // VND per month
  depositPrice: number; // VND deposit
  area: number; // m²
  roomFloor: number;
  maxPeople: number;
  status: RoomStatus;
  roomType: RoomType;
  address: string;
  district: string;
  city: string;
  images: string[];
  // Bản resize nhỏ song song với `images` (cùng thứ tự) — dùng cho card lưới/danh sách thay vì
  // tải ảnh gốc chỉ để hiển thị thumbnail. Rơi về ảnh gốc khi ảnh đó chưa có thumbnail (upload
  // trước khi backend có tính năng resize tự động, xem mapBackendRoomToRoom trong roomApi.ts).
  imageThumbnails: string[];
  amenities: string[];
  description: string;
  latitude?: number;
  longitude?: number;
  hasMezzanine: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
  services?: RoomService[];
  roomGroupId?: string | null;
  availableCount?: number;
  distanceInKm?: number;
  isRecommended?: boolean;
  acceptForeignTenants?: boolean;
  rentalTermType?: RentalTermType;
  shortTermPrice?: number;
  shortTermPriceUnit?: ShortTermPriceUnit;
  shortTermDurationValue?: number;
  longTermPriceUnit?: LongTermPriceUnit;
  longTermDurationValue?: number;
  minContractTermMonths?: number;
}

export interface RoomService {
  id: string;
  name: string;
  price?: number;
  note?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ViewingRequest {
  id?: string;
  roomId: string;
  roomName?: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status?: BookingStatus;
  createdAt?: string;
}

export interface FilterState {
  district: string;
  priceRange: string; // 'ALL' | '0-3m' | '3m-5m' | '5m-8m' | '8m+'
  roomType: string; // 'ALL' | RoomType
  hasMezzanine: boolean | null;
  isRecommended?: boolean | null;
  rentalTermType: 'SHORT_TERM' | 'LONG_TERM';
  amenities: string[];
  keyword: string;
  userLat?: number | null;
  userLng?: number | null;
  radiusInKm?: number | null;
}
