import { useQuery } from '@tanstack/react-query';
import { roomApi, SearchFacets } from '@/services/roomApi';

export interface TopDistrict {
  name: string;
  province: string;
  roomCount: number;
}

// Khu vực hot = các quận/huyện nhiều phòng nhất theo dữ liệu thật của search-facets (giống cách app
// di động suy ra `deriveTopDistricts`) — không bao giờ gợi ý 1 quận không có phòng nào.
export const deriveTopDistricts = (facets: SearchFacets | undefined, limit: number): TopDistrict[] => {
  if (!facets) return [];
  return facets.locations
    .flatMap((loc) => loc.districts.map((d) => ({ name: d.name, province: loc.province, roomCount: d.roomCount })))
    .sort((a, b) => b.roomCount - a.roomCount)
    .slice(0, limit);
};

// Lựa chọn bộ lọc tìm phòng từ backend, theo loại hình thuê. Cache 10 phút (dữ liệu đổi rất ít, backend
// cũng cache) và dùng chung giữa RoomFilterBar + trang chủ nhờ cùng queryKey.
export const useSearchFacets = (rentalTermType: 'SHORT_TERM' | 'LONG_TERM' = 'SHORT_TERM') => {
  const query = useQuery({
    queryKey: ['searchFacets', rentalTermType],
    queryFn: () => roomApi.getSearchFacets(rentalTermType),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    facets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
