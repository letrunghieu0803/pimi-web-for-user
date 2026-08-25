import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3333/api';

const MUTATING_METHODS = ['post', 'put', 'patch', 'delete'];

// 3 web (người thuê/chủ nhà/admin) đều gọi chung 1 domain API bằng cookie httpOnly — nghĩa là cả
// 3 vốn dùng chung đúng 1 ngăn cookie của trình duyệt cho domain đó. Header này báo cho backend
// biết đọc/ghi đúng cookie của web nào (`pimi_at_user` thay vì `pimi_at` chung) — không mang ý
// nghĩa bảo mật, chỉ để tách cookie giữa 3 web, xem auth-cookies.util.ts bên bff-for-pimi.
const CLIENT_APP = 'user';

// Double-submit CSRF: trước đây đọc lại cookie `pimi_csrf_user` qua document.cookie — SAI, vì
// web này deploy khác domain hoàn toàn với API (vd *.vercel.app vs piminest.com). Cookie dù
// không httpOnly vẫn thuộc "ngăn" cookie của domain BE — JS chạy trên domain FE không đọc được
// qua document.cookie (giới hạn same-origin của trình duyệt), dù trình duyệt vẫn tự gửi kèm
// cookie đó lên mọi request tới BE. Backend giờ trả token qua JSON body (login) — lưu vào biến
// nhớ ở đây; nếu mất (reload trang) thì tự gọi lại GET /auth/csrf-token 1 lần để nạp lại (cookie
// phiên vẫn còn nên server đọc lại được, chỉ JS phía FE là không đọc trực tiếp được).
let csrfTokenMemory: string | null = null;
let csrfTokenFetchPromise: Promise<string | null> | null = null;

export const setCsrfToken = (token: string | null | undefined) => {
  csrfTokenMemory = token || null;
};

const ensureCsrfToken = async (): Promise<string | null> => {
  if (csrfTokenMemory) return csrfTokenMemory;
  if (!csrfTokenFetchPromise) {
    csrfTokenFetchPromise = axios
      .get(`${API_BASE_URL}/v1/auth/csrf-token`, {
        withCredentials: true,
        headers: { 'X-Client-App': CLIENT_APP }
      })
      .then(res => {
        csrfTokenMemory = res.data?.data?.csrfToken || null;
        return csrfTokenMemory;
      })
      .catch(() => null)
      .finally(() => {
        csrfTokenFetchPromise = null;
      });
  }
  return csrfTokenFetchPromise;
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-App': CLIENT_APP,
  },
  // Bắt buộc để trình duyệt gửi kèm + nhận về cookie httpOnly (`pimi_at_user`/`pimi_rt_user`) —
  // API ở domain khác domain FE (cross-site theo định nghĩa trình duyệt) nên mặc định (false)
  // sẽ không gửi/lưu cookie nào cả.
  withCredentials: true,
});

// Request interceptor — token không còn tự gắn header nữa, trình duyệt tự gửi kèm cookie
// httpOnly (`pimi_at_user`). Double-submit CSRF: mọi request có thể đổi dữ liệu phải echo lại
// cookie `pimi_csrf_user` (không httpOnly, JS đọc được) qua header `X-CSRF-Token` — backend đối
// chiếu 2 giá trị phải khớp nhau (xem CsrfGuard ở bff-for-pimi).
axiosClient.interceptors.request.use(
  async (config) => {
    if (config.method && MUTATING_METHODS.includes(config.method.toLowerCase())) {
      const csrfToken = await ensureCsrfToken();
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
