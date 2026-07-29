import { Room, ViewingRequest } from '@/types';
import { MOCK_ROOMS } from '@/data/mockData';
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
  };
};

// In-flight deduplication promise maps
const inFlightFeedPromises = new Map<string, Promise<Room[]>>();
const inFlightDetailPromises = new Map<string, Promise<Room | null>>();

const fetchPublicFeed = (district?: string, search?: string): Promise<Room[]> => {
  const cacheKey = `${district || ''}:${search || ''}`;
  if (inFlightFeedPromises.has(cacheKey)) {
    return inFlightFeedPromises.get(cacheKey)!;
  }

  const promise = axiosClient
    .get('/v1/rent-rooms/public/feed', {
      params: {
        district: district !== 'Tất cả quận/huyện' ? district : undefined,
        search: search || undefined,
      },
    })
    .then((response: any) => {
      const items = response?.data || (Array.isArray(response) ? response : []);
      if (Array.isArray(items) && items.length > 0) {
        return items.map(mapBackendRoomToRoom);
      }
      return [];
    })
    .catch((error) => {
      console.warn('Failed to fetch rooms from backend API, falling back to mock data:', error);
      return [];
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
      console.warn(`Failed to fetch room detail from backend for id ${id}, attempting fallback:`, error);
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

export const roomApi = {
  // Fetch list of rooms with real backend integration, in-flight request deduplication & mock fallback
  getRooms: async (params?: {
    district?: string;
    priceRange?: string;
    roomType?: string;
    keyword?: string;
    amenities?: string[];
    hasMezzanine?: boolean | null;
  }): Promise<Room[]> => {
    let rawList = await fetchPublicFeed(
      params?.district !== 'Tất cả quận/huyện' ? params?.district : undefined,
      params?.keyword
    );

    // Fallback to initial mock rooms if backend returns empty list (e.g., initial DB seed state)
    if (rawList.length === 0) {
      rawList = [...MOCK_ROOMS];
    }

    let results = rawList;

    if (params) {
      if (params.district && params.district !== 'Tất cả quận/huyện') {
        results = results.filter((r) => r.district.toLowerCase().includes(params.district!.toLowerCase()));
      }

      if (params.keyword && params.keyword.trim() !== '') {
        const kw = params.keyword.toLowerCase().trim();
        results = results.filter(
          (r) =>
            r.name.toLowerCase().includes(kw) ||
            r.address.toLowerCase().includes(kw) ||
            r.houseName.toLowerCase().includes(kw) ||
            r.district.toLowerCase().includes(kw)
        );
      }

      if (params.priceRange && params.priceRange !== 'ALL') {
        if (params.priceRange === '0-3m') {
          results = results.filter((r) => r.price <= 3000000);
        } else if (params.priceRange === '3m-5m') {
          results = results.filter((r) => r.price > 3000000 && r.price <= 5000000);
        } else if (params.priceRange === '5m-8m') {
          results = results.filter((r) => r.price > 5000000 && r.price <= 8000000);
        } else if (params.priceRange === '8m+') {
          results = results.filter((r) => r.price > 8000000);
        }
      }

      if (params.roomType && params.roomType !== 'ALL') {
        results = results.filter((r) => r.roomType === params.roomType);
      }

      if (params.hasMezzanine !== null && params.hasMezzanine !== undefined) {
        results = results.filter((r) => r.hasMezzanine === params.hasMezzanine);
      }

      if (params.amenities && params.amenities.length > 0) {
        results = results.filter((r) =>
          params.amenities!.every((amt) => r.amenities.includes(amt))
        );
      }
    }

    return results;
  },

  // Get Room detail by ID
  getRoomById: async (id: string): Promise<Room | null> => {
    const detail = await fetchRoomDetail(id);
    if (detail) return detail;

    const allRooms = await roomApi.getRooms();
    const room = allRooms.find((r) => r.id === id);
    if (room) return room;

    return MOCK_ROOMS.find((r) => r.id === id) || null;
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
