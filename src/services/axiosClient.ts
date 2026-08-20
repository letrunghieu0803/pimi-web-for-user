import axios from 'axios';
import { getCookie } from '@/utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3333/api';

const MUTATING_METHODS = ['post', 'put', 'patch', 'delete'];

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Bắt buộc để trình duyệt gửi kèm + nhận về cookie httpOnly (`pimi_at`/`pimi_rt`) — API ở
  // domain khác domain FE (cross-site theo định nghĩa trình duyệt) nên mặc định (false) sẽ
  // không gửi/lưu cookie nào cả.
  withCredentials: true,
});

// Request interceptor — token không còn tự gắn header nữa, trình duyệt tự gửi kèm cookie
// httpOnly (`pimi_at`). Double-submit CSRF: mọi request có thể đổi dữ liệu phải echo lại cookie
// `pimi_csrf` (không httpOnly, JS đọc được) qua header `X-CSRF-Token` — backend đối chiếu 2 giá
// trị phải khớp nhau (xem CsrfGuard ở bff-for-pimi).
axiosClient.interceptors.request.use(
  (config) => {
    if (config.method && MUTATING_METHODS.includes(config.method.toLowerCase())) {
      const csrfToken = getCookie('pimi_csrf');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data and normalize errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data?.error || error)
);
