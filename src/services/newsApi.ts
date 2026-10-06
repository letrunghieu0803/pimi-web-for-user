import { axiosClient } from './axiosClient';

// Backend (NewsArticle) chỉ có title/content/coverImageLink/createdAt — không có chuyên mục, thời gian
// đọc hay tóm tắt riêng, nên các trường hiển thị còn lại (excerpt, readMinutes) được suy ra từ nội dung.
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  // null khi bài không có ảnh bìa — UI tự hiện khung thay thế thay vì ảnh stock giả như trước.
  image: string | null;
  createdAt?: string;
  readMinutes: number;
}

const WORDS_PER_MINUTE = 200;
const EXCERPT_MAX_LENGTH = 150;

const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const mapBackendNewsToNewsItem = (item: any): NewsItem => {
  const rawContent: string = item.content || '';
  const plainText = stripHtml(rawContent);
  const excerpt = plainText.length > EXCERPT_MAX_LENGTH ? `${plainText.substring(0, EXCERPT_MAX_LENGTH)}...` : plainText;
  const wordCount = plainText ? plainText.split(' ').length : 0;

  return {
    id: item.id,
    title: item.title || '',
    excerpt,
    content: rawContent,
    image: item.coverImageLink || null,
    createdAt: item.createdAt,
    readMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  };
};

// Ngày đăng theo ngôn ngữ đang chọn — format tại chỗ hiển thị (không "đóng băng" trong mapper) để đổi
// ngôn ngữ là đổi theo ngay.
export const formatNewsDate = (createdAt: string | undefined, lang: string): string => {
  if (!createdAt) return '';
  return new Date(createdAt).toLocaleDateString(lang?.startsWith('en') ? 'en-GB' : 'vi-VN');
};

export const newsApi = {
  // Danh sách tin công khai. Lỗi mạng/server được ném lên cho nơi gọi hiện trạng thái lỗi thật (trước
  // đây âm thầm trả về bài viết mẫu), danh sách rỗng nghĩa là thật sự chưa có bài nào.
  getPublicNews: async (params?: {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{ items: NewsItem[]; totalItems: number; totalPages: number }> => {
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
    const list: any[] = Array.isArray(rawItems) ? rawItems : [];

    return {
      items: list.map(mapBackendNewsToNewsItem),
      totalItems: metadata.totalItems ?? list.length,
      totalPages: metadata.totalPages ?? (list.length > 0 ? 1 : 0),
    };
  },

  // Chi tiết 1 bài viết. Trả null nếu backend không có bài (response không có id); lỗi khác được ném lên.
  getNewsById: async (id: string): Promise<NewsItem | null> => {
    const response: any = await axiosClient.get(`/v1/news/public/${id}`, {
      params: { audience: 'RENT_USER' },
    });
    const raw = response?.data || response;
    return raw && raw.id ? mapBackendNewsToNewsItem(raw) : null;
  },
};
