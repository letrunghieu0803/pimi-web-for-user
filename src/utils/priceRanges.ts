export type PriceTerm = 'SHORT_TERM' | 'LONG_TERM';

export interface PriceBucket {
  id: string;
  min?: number;
  max?: number;
  /** Khoá i18n của nhãn (đã có sẵn trong common.json). */
  labelKey: string;
}

// Khoảng giá theo ĐÚNG loại hình đang tìm — backend lọc/sắp xếp theo giá ngắn hạn của phòng (đồng/ngày
// hoặc đồng/giờ) khi tìm ngắn hạn và theo giá thuê tháng khi tìm dài hạn, nên 2 bộ khoảng giá khác nhau.
// Id dài hạn giữ nguyên như trước để link/URL cũ (`?priceRange=3m-5m`) vẫn chạy.
export const PRICE_BUCKETS: Record<PriceTerm, PriceBucket[]> = {
  SHORT_TERM: [
    { id: 's0-300k', max: 300000, labelKey: 'home.shortPriceUnder300' },
    { id: 's300k-500k', min: 300000, max: 500000, labelKey: 'home.shortPrice300to500' },
    { id: 's500k-1m', min: 500000, max: 1000000, labelKey: 'home.shortPrice500to1m' },
    { id: 's1m+', min: 1000000, labelKey: 'home.shortPriceOver1m' },
  ],
  LONG_TERM: [
    { id: '0-3m', max: 3000000, labelKey: 'home.price0to3' },
    { id: '3m-5m', min: 3000000, max: 5000000, labelKey: 'home.price3to5' },
    { id: '5m-8m', min: 5000000, max: 8000000, labelKey: 'home.price5to8' },
    { id: '8m+', min: 8000000, labelKey: 'roomFilterBar.priceOver8' },
  ],
};

/** Id không thuộc loại hình đang tìm (vd khoảng giá tháng khi đang xem ngắn hạn) = không lọc giá. */
export const priceBucketToMinMax = (
  priceRange: string | undefined,
  term: PriceTerm = 'SHORT_TERM',
): { minPrice?: number; maxPrice?: number } => {
  const bucket = PRICE_BUCKETS[term].find((b) => b.id === priceRange);
  return bucket ? { minPrice: bucket.min, maxPrice: bucket.max } : {};
};
