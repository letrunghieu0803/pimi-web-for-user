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
  // Thuê ngắn hạn: 2 hình thức độc lập — giá theo NGÀY (đêm) và theo GIỜ (3 trường shortTerm* cũ chỉ là bản đại diện).
  shortTermDayPrice?: number;
  shortTermHourPrice?: number;
  // Phút từ 00:00 (giờ VN): giờ nhận/trả của thuê theo ngày; khung giờ + giới hạn số giờ của thuê theo giờ.
  checkInMinute?: number;
  checkOutMinute?: number;
  hourlyMinHours?: number;
  hourlyMaxHours?: number;
  hourlyOpenMinute?: number | null;
  hourlyCloseMinute?: number | null;
  bufferMinutes?: number;
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

export interface FilterState {
  district: string; // tên quận/huyện lấy từ search-facets; '' = tất cả quận/huyện
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
