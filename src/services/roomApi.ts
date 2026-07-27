import { Room, ViewingRequest } from '@/types';
import { MOCK_ROOMS } from '@/data/mockData';

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

export const roomApi = {
  // Fetch list of rooms with optional filters
  getRooms: async (params?: {
    district?: string;
    priceRange?: string;
    roomType?: string;
    keyword?: string;
    amenities?: string[];
    hasMezzanine?: boolean | null;
  }): Promise<Room[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let results = [...MOCK_ROOMS];

    if (!params) return results;

    if (params.district && params.district !== 'Tất cả quận/huyện') {
      results = results.filter((r) => r.district === params.district);
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

    return results;
  },

  // Get Room detail by ID
  getRoomById: async (id: string): Promise<Room | null> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const room = MOCK_ROOMS.find((r) => r.id === id);
    return room || null;
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
