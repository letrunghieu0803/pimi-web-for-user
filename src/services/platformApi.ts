import { axiosClient } from './axiosClient';

export interface PublicPlatformSettings {
  publicListingEnabled: boolean;
  tenantBookingEnabled: boolean;
  ownerInviteRequired: boolean;
}

// Mặc định "đang mở" — khi chưa tải xong hoặc gọi lỗi thì KHÔNG hiện thông báo đóng nhầm cho người dùng.
export const DEFAULT_PLATFORM_SETTINGS: PublicPlatformSettings = {
  publicListingEnabled: true,
  tenantBookingEnabled: true,
  ownerInviteRequired: false,
};

export const platformApi = {
  // Công tắc mở/đóng hệ thống do admin điều khiển (endpoint công khai, chỉ trả cờ).
  getPublicSettings: async (): Promise<PublicPlatformSettings> => {
    try {
      const res: any = await axiosClient.get('/v1/platform-settings/public');
      return { ...DEFAULT_PLATFORM_SETTINGS, ...(res?.data || {}) };
    } catch {
      return DEFAULT_PLATFORM_SETTINGS;
    }
  },
};
