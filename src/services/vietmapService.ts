import axios from 'axios';

const FALLBACK_VIETMAP_KEY = 'd827104fe8bb745b7489612893cd5d21dd724313df312841';
const FALLBACK_DEFAULT_SEARCH_KEY = '781179e028609b955effddfa1551cd1ec8f881dcec341a4b';

export const getVietMapApiKey = (): string => {
  return import.meta.env.VITE_VIETMAP_API_KEY || FALLBACK_VIETMAP_KEY;
};

export const getVietMapDefaultKey = (): string => {
  return import.meta.env.VITE_DEFAULT_VIETMAP_API_KEY || FALLBACK_DEFAULT_SEARCH_KEY;
};

export interface VietMapAutocompleteItem {
  ref_id: string;
  name: string;
  address: string;
  display: string;
  distance?: number;
}

export interface VietMapPlaceDetail {
  display: string;
  name: string;
  hs_num?: string;
  street?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  lat: number;
  lng: number;
}

export interface VietMapReverseResult {
  lat: number;
  lng: number;
  ref_id: string;
  display: string;
  name: string;
  address: string;
  street?: string;
  district?: string;
  city?: string;
  county?: string;
}

export const vietmapService = {
  // Tile URL for Map Display -> Uses VITE_VIETMAP_API_KEY
  getTileLayerUrl: (): string => {
    const apiKey = getVietMapApiKey();
    return `https://maps.vietmap.vn/maps/tiles/st/{z}/{x}/{y}.png?apikey=${apiKey}`;
  },

  // Autocomplete v4 for Address Search -> Uses VITE_DEFAULT_VIETMAP_API_KEY
  autocomplete: async (text: string, focusLat?: number, focusLng?: number): Promise<VietMapAutocompleteItem[]> => {
    if (!text || text.trim().length < 2) return [];

    const apiKey = getVietMapDefaultKey();
    const params: Record<string, any> = {
      apikey: apiKey,
      text: text.trim(),
      display_type: 6,
    };

    if (focusLat !== undefined && focusLng !== undefined) {
      params.focus = `${focusLat},${focusLng}`;
    }

    try {
      const response = await axios.get('https://maps.vietmap.vn/api/autocomplete/v4', { params });
      if (Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          ref_id: item.ref_id,
          name: item.name || item.display,
          address: item.address || '',
          display: item.display || `${item.name} ${item.address}`.trim(),
          distance: item.distance,
        }));
      }
      return [];
    } catch (error) {
      console.error('VietMap Autocomplete v4 error:', error);
      return [];
    }
  },

  // Place v4 for Address Detail -> Uses VITE_DEFAULT_VIETMAP_API_KEY
  getPlaceDetail: async (refId: string): Promise<VietMapPlaceDetail | null> => {
    if (!refId) return null;

    const apiKey = getVietMapDefaultKey();
    try {
      const response = await axios.get('https://maps.vietmap.vn/api/place/v4', {
        params: {
          apikey: apiKey,
          refid: refId,
        },
      });

      if (response.data && typeof response.data.lat === 'number' && typeof response.data.lng === 'number') {
        return {
          display: response.data.display || '',
          name: response.data.name || response.data.display || '',
          hs_num: response.data.hs_num,
          street: response.data.street || response.data.name || '',
          address: response.data.address || '',
          city: response.data.district || '',
          district: response.data.ward || '',
          ward: response.data.ward || '',
          lat: response.data.lat,
          lng: response.data.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('VietMap Place v4 error:', error);
      return null;
    }
  },

  // Reverse Geocoding v4 for Address Lookup -> Uses VITE_DEFAULT_VIETMAP_API_KEY
  reverseGeocode: async (lat: number, lng: number): Promise<VietMapReverseResult | null> => {
    const apiKey = getVietMapDefaultKey();
    try {
      const response = await axios.get('https://maps.vietmap.vn/api/reverse/v4', {
        params: {
          apikey: apiKey,
          lat,
          lng,
          display_type: 6,
        },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        const item = response.data[0];
        let city = '';
        let district = '';
        let county = '';

        if (Array.isArray(item.boundaries)) {
          item.boundaries.forEach((b: any) => {
            if (b.type === 0) county = b.full_name || b.name || '';
            else if (b.type === 1) city = b.full_name || b.name || '';
            else if (b.type === 2) district = b.full_name || b.name || '';
          });
        }

        return {
          lat: item.lat || lat,
          lng: item.lng || lng,
          ref_id: item.ref_id,
          display: item.display || item.address || `Tọa độ: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          name: item.name || '',
          address: item.address || item.display || '',
          street: item.name || item.street || '',
          district: district,
          city: city,
          county: county,
        };
      }
      return null;
    } catch (error) {
      console.error('VietMap Reverse v4 error:', error);
      return null;
    }
  },
};
