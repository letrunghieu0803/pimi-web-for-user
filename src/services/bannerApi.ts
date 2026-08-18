import { axiosClient } from './axiosClient';

export interface BannerItem {
  id: string;
  imageLink: string;
  linkUrl?: string | null;
  title: string;
  description?: string | null;
}

export const bannerApi = {
  getPublicBanners: async (): Promise<BannerItem[]> => {
    try {
      const response: any = await axiosClient.get('/v1/banners/public/feed');
      return Array.isArray(response?.data) ? response.data : [];
    } catch {
      // Banner slide is a decorative/promotional section — a fetch failure should never
      // break the Home page, just render nothing.
      return [];
    }
  },
};
