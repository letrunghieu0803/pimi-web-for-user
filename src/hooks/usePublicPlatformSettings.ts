import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PLATFORM_SETTINGS, platformApi, type PublicPlatformSettings } from '@/services/platformApi';

// Cờ mở/đóng hệ thống (tin công khai, đặt phòng). Cache ngắn vì admin có thể bật/tắt bất kỳ lúc nào.
export const usePublicPlatformSettings = (): PublicPlatformSettings => {
  const { data } = useQuery({
    queryKey: ['platform-public-settings'],
    queryFn: platformApi.getPublicSettings,
    staleTime: 60_000,
  });
  return data ?? DEFAULT_PLATFORM_SETTINGS;
};
