import { Room, ViewingRequest } from '@/types';
import { axiosClient } from './axiosClient';


const VIEWING_REQUESTS_KEY = 'pimi_tenant_viewing_requests';

// Initial Mock Bookings so new users immediately see realistic booking history
const INITIAL_MOCK_BOOKINGS: ViewingRequest[] = [
  {
    id: 'req-101',
    roomId: 'room-1',
    roomName: 'Phòng Studio Đầy Đủ Nội Thất Cao Cấp Cầu Giấy',
    tenantName: 'Nguyễn Văn Thuê',
    tenantPhone: '0988776655',
    tenantEmail: 'nguyenvanthue@gmail.com',
    preferredDate: '2026-07-28',
    preferredTime: '10:00',
    notes: 'Tôi muốn hẹn xem phòng vào buổi sáng, gọi trước 15 phút.',
    status: 'CONFIRMED',
    createdAt: '2026-07-25T09:30:00Z',
  },
  {
    id: 'req-102',
    roomId: 'room-2',
    roomName: 'Căn Hộ Mini Có Gác Xép Rộng Trần Duy Hưng',
    tenantName: 'Nguyễn Văn Thuê',
    tenantPhone: '0988776655',
    tenantEmail: 'nguyenvanthue@gmail.com',
    preferredDate: '2026-07-30',
    preferredTime: '14:30',
    notes: 'Xem phòng ngoài giờ hành chính.',
    status: 'PENDING',
    createdAt: '2026-07-26T08:15:00Z',
  },
];

// Helper to map backend RentRoom model to user app Room interface
const mapBackendRoomToRoom = (item: any): Room => {
  const house = item.rentHouse || {};
  const owner = house.houseOwner || {};
  
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || 'Chủ nhà';
  
  const images = (item.images || [])
    .map((img: any) => img.image?.link || img.link)
    .filter(Boolean);

  const amenities = (item.roomFurniture || [])
    .map((f: any) => f.name || f.furniture?.name)
    .filter(Boolean);

  const services = (item.usedServices || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    price: s.price !== undefined && s.price !== null ? Number(s.price) : undefined,
    note: s.note || undefined,
  }));

  const priceNum = Number(item.price || house.defaultPrice || 0);
  const areaNum = Number(item.roomArea || 0);

  return {
    id: item.id,
    name: item.name || house.name || 'Phòng trọ',
    houseName: house.name || 'Nhà trọ',
    houseId: item.rentHouseId || house.id,
    price: priceNum,
    depositPrice: priceNum, // Default deposit to 1 month price if unspecified
    area: areaNum,
    roomFloor: item.roomFloor || 1,
    maxPeople: house.maxPeoplePerRoom || 2,
    status: item.status || 'EMPTY',
    roomType: item.type || 'APARTMENT',
    address: house.address || 'Hà Nội',
    district: house.district || 'Cầu Giấy',
    city: house.city || 'Hà Nội',
    images: images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: amenities.length > 0 ? amenities : ['Điều hòa', 'Wifi', 'Nóng lạnh', 'Giờ giấc tự do'],
    description: `Phòng thuộc ${house.name || 'nhà trọ'}, địa chỉ ${house.address || 'Hà Nội'}. Diện tích ${areaNum}m², vị trí thoáng mát, an ninh tốt.`,
    landlordName: ownerName,
    landlordPhone: owner.phoneNumber || '0988776655',
    landlordAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    latitude: house.lat !== undefined && house.lat !== null ? Number(house.lat) : undefined,
    longitude: house.long !== undefined && house.long !== null ? Number(house.long) : undefined,
    hasMezzanine: !!item.hasMezzanine,
    isFeatured: true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt,
    services,
    roomGroupId: item.roomGroupId || null,
    availableCount: item.availableCount,
  };
};

interface PublicFeedParams {
  district?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: string;
  hasMezzanine?: boolean | null;
  amenities?: string[];
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}

interface PublicFeedResult {
  rooms: Room[];
  totalItems: number;
  totalPages: number;
}

const priceRangeToMinMax = (priceRange?: string): { minPrice?: number; maxPrice?: number } => {
  switch (priceRange) {
    case '0-3m':
      return { maxPrice: 3000000 };
    case '3m-5m':
      return { minPrice: 3000000, maxPrice: 5000000 };
    case '5m-8m':
      return { minPrice: 5000000, maxPrice: 8000000 };
    case '8m+':
      return { minPrice: 8000000 };
    default:
      return {};
  }
};

// In-flight deduplication promise maps
const inFlightFeedPromises = new Map<string, Promise<PublicFeedResult>>();
const inFlightDetailPromises = new Map<string, Promise<Room | null>>();
const inFlightGroupDetailPromises = new Map<string, Promise<Room | null>>();

const fetchPublicFeed = (params: PublicFeedParams): Promise<PublicFeedResult> => {
  const cacheKey = JSON.stringify(params);
  if (inFlightFeedPromises.has(cacheKey)) {
    return inFlightFeedPromises.get(cacheKey)!;
  }

  const promise = axiosClient
    .get('/v1/rent-rooms/public/feed', {
      params: {
        district: params.district && params.district !== 'Tất cả quận/huyện' ? params.district : undefined,
        search: params.search || undefined,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        roomType: params.roomType && params.roomType !== 'ALL' ? params.roomType : undefined,
        hasMezzanine:
          params.hasMezzanine !== null && params.hasMezzanine !== undefined
            ? params.hasMezzanine
            : undefined,
        amenities: params.amenities && params.amenities.length > 0 ? params.amenities.join(',') : undefined,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
      },
    })
    .then((response: any) => {
      const items = response?.data || [];
      const metadata = response?.metadata || {};
      return {
        rooms: Array.isArray(items) ? items.map(mapBackendRoomToRoom) : [],
        totalItems: metadata.totalItems ?? 0,
        totalPages: metadata.totalPages ?? 0,
      };
    })
    .catch((error) => {
      console.warn('Failed to fetch rooms from backend API:', error);
      return { rooms: [], totalItems: 0, totalPages: 0 };
    })
    .finally(() => {
      setTimeout(() => {
        inFlightFeedPromises.delete(cacheKey);
      }, 500);
    });

  inFlightFeedPromises.set(cacheKey, promise);
  return promise;
};

const fetchRoomDetail = (id: string): Promise<Room | null> => {
  if (inFlightDetailPromises.has(id)) {
    return inFlightDetailPromises.get(id)!;
  }

  const promise = axiosClient
    .get(`/v1/rent-rooms/public/detail/${id}`)
    .then((response: any) => {
      const raw = response?.data || response;
      if (raw && raw.id) {
        return mapBackendRoomToRoom(raw);
      }
      return null;
    })
    .catch((error) => {
      console.warn(`Failed to fetch room detail from backend for id ${id}:`, error);
      return null;
    })
    .finally(() => {
      setTimeout(() => {
        inFlightDetailPromises.delete(id);
      }, 500);
    });

  inFlightDetailPromises.set(id, promise);
  return promise;
};

const fetchRoomGroupDetail = (groupId: string): Promise<Room | null> => {
  if (inFlightGroupDetailPromises.has(groupId)) {
    return inFlightGroupDetailPromises.get(groupId)!;
  }

  const promise = axiosClient
    .get(`/v1/rent-rooms/public/group-detail/${groupId}`)
    .then((response: any) => {
      const raw = response?.data || response;
      if (raw && raw.id) {
        return mapBackendRoomToRoom(raw);
      }
      return null;
    })
    .catch((error) => {
      console.warn(`Failed to fetch room group detail for id ${groupId}:`, error);
      return null;
    })
    .finally(() => {
      setTimeout(() => {
        inFlightGroupDetailPromises.delete(groupId);
      }, 500);
    });

  inFlightGroupDetailPromises.set(groupId, promise);
  return promise;
};

export const roomApi = {
  // Fetch a page of rooms from backend public feed (no authentication required).
  // All filters (price/type/mezzanine/amenities/search/district) and sorting are
  // applied server-side, and the result comes back already paginated.
  getRoomsPaginated: async (params?: {
    district?: string;
    priceRange?: string;
    roomType?: string;
    keyword?: string;
    amenities?: string[];
    hasMezzanine?: boolean | null;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: 'newest' | 'price_asc' | 'price_desc';
  }): Promise<PublicFeedResult> => {
    const { minPrice, maxPrice } = priceRangeToMinMax(params?.priceRange);
    return fetchPublicFeed({
      district: params?.district,
      search: params?.keyword,
      minPrice,
      maxPrice,
      roomType: params?.roomType,
      hasMezzanine: params?.hasMezzanine,
      amenities: params?.amenities,
      pageNumber: params?.pageNumber,
      pageSize: params?.pageSize,
      sortBy: params?.sortBy,
    });
  },

  // Back-compat helper for callers that just want a flat list (Home.tsx preview,
  // the getRoomById fallback below) — fetches a single reasonably-sized page.
  getRooms: async (params?: {
    district?: string;
    priceRange?: string;
    roomType?: string;
    keyword?: string;
    amenities?: string[];
    hasMezzanine?: boolean | null;
  }): Promise<Room[]> => {
    const result = await roomApi.getRoomsPaginated({ ...params, pageNumber: 1, pageSize: 100 });
    return result.rooms;
  },

  // Get Room detail by ID
  getRoomById: async (id: string): Promise<Room | null> => {
    const detail = await fetchRoomDetail(id);
    if (detail) return detail;

    const allRooms = await roomApi.getRooms();
    const room = allRooms.find((r) => r.id === id);
    if (room) return room;

    return null;
  },

  // Get an aggregated Room-group detail by group ID (shows shared info +
  // availableCount + a representative room's photos/amenities)
  getRoomGroupById: async (groupId: string): Promise<Room | null> => {
    return fetchRoomGroupDetail(groupId);
  },

  // Submit viewing request
  submitViewingRequest: async (request: ViewingRequest): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let existing: ViewingRequest[] = [];
    const saved = localStorage.getItem(VIEWING_REQUESTS_KEY);
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch (e) {
        existing = [];
      }
    } else {
      existing = [...INITIAL_MOCK_BOOKINGS];
    }

    const newRequest: ViewingRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newRequest);
    localStorage.setItem(VIEWING_REQUESTS_KEY, JSON.stringify(existing));

    return {
      success: true,
      message: 'Gửi yêu cầu xem phòng thành công! Chủ nhà sẽ liên hệ với bạn trong thời gian sớm nhất.',
    };
  },

  // Get user booking history
  getUserViewingRequests: (tenantPhone?: string): ViewingRequest[] => {
    const saved = localStorage.getItem(VIEWING_REQUESTS_KEY);
    let list: ViewingRequest[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [...INITIAL_MOCK_BOOKINGS];
      }
    } else {
      list = [...INITIAL_MOCK_BOOKINGS];
      localStorage.setItem(VIEWING_REQUESTS_KEY, JSON.stringify(list));
    }

    if (tenantPhone) {
      return list.filter((r) => r.tenantPhone === tenantPhone || !r.tenantPhone);
    }
    return list;
  },

  // Cancel booking request
  cancelViewingRequest: async (requestId: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const saved = localStorage.getItem(VIEWING_REQUESTS_KEY);
    let list: ViewingRequest[] = saved ? JSON.parse(saved) : [...INITIAL_MOCK_BOOKINGS];

    list = list.map((item) => {
      if (item.id === requestId) {
        return { ...item, status: 'CANCELLED' as const };
      }
      return item;
    });

    localStorage.setItem(VIEWING_REQUESTS_KEY, JSON.stringify(list));

    return {
      success: true,
      message: 'Đã hủy lịch hẹn xem phòng thành công.',
    };
  },
};

export { axiosClient } from './axiosClient';
