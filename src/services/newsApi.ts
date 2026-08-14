import { axiosClient } from './axiosClient';
import { NEWS_ARTICLES, NewsArticle } from '@/data/mockData';

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  coverImageLink?: string;
  createdAt?: string;
}

const mapBackendNewsToNewsItem = (item: any): NewsItem => {
  const coverImage =
    item.coverImageLink ||
    item.image ||
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80';

  const rawContent = item.content || '';
  // Strip HTML tags for clean text excerpt if needed
  const strippedText = rawContent.replace(/<[^>]+>/g, '');
  const excerpt = item.excerpt || (strippedText.length > 150 ? `${strippedText.substring(0, 150)}...` : strippedText) || 'Cẩm nang kinh nghiệm thuê nhà trọ hữu ích từ Pimi.';

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('vi-VN')
    : 'Mới cập nhật';

  return {
    id: item.id,
    title: item.title || 'Tin tức mới từ Pimi',
    category: item.category || 'Tin Tức',
    date: formattedDate,
    readTime: item.readTime || '4 phút đọc',
    image: coverImage,
    excerpt,
    content: rawContent || item.excerpt || '',
    coverImageLink: item.coverImageLink,
    createdAt: item.createdAt,
  };
};

export const newsApi = {
  // Get public feed of news articles with fallback to mock data
  getPublicNews: async (params?: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{ items: NewsItem[]; totalItems: number; totalPages: number }> => {
    try {
      const response: any = await axiosClient.get('/v1/news/public/feed', {
        params: {
          audience: 'RENT_USER',
          search: params?.search || undefined,
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 10,
        },
      });

      const rawItems = response?.data || [];
      const metadata = response?.metadata || {};

      if (Array.isArray(rawItems) && rawItems.length > 0) {
        return {
          items: rawItems.map(mapBackendNewsToNewsItem),
          totalItems: metadata.totalItems ?? rawItems.length,
          totalPages: metadata.totalPages ?? 1,
        };
      }
    } catch (error) {
      console.warn('Failed to fetch public news from API, using fallback data:', error);
    }

    // Fallback mock data if API is empty or offline
    let filteredMock: NewsArticle[] = [...NEWS_ARTICLES];
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      filteredMock = filteredMock.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    const page = params?.pageNumber || 1;
    const size = params?.pageSize || 10;
    const paged = filteredMock.slice((page - 1) * size, page * size);

    return {
      items: paged.map(mapBackendNewsToNewsItem),
      totalItems: filteredMock.length,
      totalPages: Math.ceil(filteredMock.length / size) || 1,
    };
  },

  // Get detail of a specific news article
  getNewsById: async (id: string): Promise<NewsItem | null> => {
    // 1. Check if mock article first
    const mock = NEWS_ARTICLES.find((a) => a.id === id);
    if (mock) {
      return mapBackendNewsToNewsItem(mock);
    }

    // 2. Fetch from backend API
    try {
      const response: any = await axiosClient.get(`/v1/news/public/${id}`, {
        params: { audience: 'RENT_USER' },
      });
      const raw = response?.data || response;
      if (raw && raw.id) {
        return mapBackendNewsToNewsItem(raw);
      }
    } catch (error) {
      console.warn(`Failed to fetch news detail for id ${id}:`, error);
    }

    return null;
  },
};
