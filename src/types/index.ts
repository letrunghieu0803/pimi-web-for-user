export type RoomStatus = 'EMPTY' | 'OCCUPIED' | 'MAINTENANCE';

export type RoomType = 'APARTMENT' | 'MINI_APARTMENT' | 'BOARDING_HOUSE' | 'WHOLE_HOUSE';

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
  amenities: string[];
  description: string;
  landlordName: string;
  landlordPhone: string;
  landlordAvatar?: string;
  latitude?: number;
  longitude?: number;
  hasMezzanine: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
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
  amenities: string[];
  keyword: string;
}
