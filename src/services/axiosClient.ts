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

// `isAuthenticated` ở AuthContext.tsx chỉ dựa vào hồ sơ cache trong localStorage, không xác thực
// lại với server — nên navbar có thể vẫn hiện "đã đăng nhập" dù cookie phiên thật đã mất (hết
// hạn cả access lẫn refresh, hoặc bị xoá), khiến lỗi "thiếu token" chỉ lộ ra giữa chừng 1 thao
// tác (vd sau khi điền hết form đặt lịch) thay vì được báo trước rõ ràng. Sự kiện này bắn ra
// đúng lúc phát hiện được điều đó (refresh ngầm bên dưới cũng thất bại — xác nhận phiên đã mất
// thật, không phải chỉ access token hết hạn tạm thời) để AuthContext tự dọn state + báo cho
// người dùng biết, thay vì im lặng để lỗi trồi lên ở đúng chỗ request đang thất bại.
export const SESSION_EXPIRED_EVENT = 'pimi:session-expired';
let sessionExpiredNotified = false;

export const setCsrfToken = (token: string | null | undefined) => {
  csrfTokenMemory = token || null;
  // Có token mới (đăng nhập/refresh vừa thành công) — phiên đang sống lại bình thường, cho phép
  // bắn lại sự kiện hết phiên nếu sau này lại xảy ra lần nữa.
  if (token) sessionExpiredNotified = false;
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

// Access token (cookie httpOnly) chỉ sống 1 ngày, refresh token/cookie CSRF sống 7 ngày — phiên
// đăng nhập mở lâu (browser tab để qua đêm, hoặc quay lại app sau vài giờ) sẽ có lúc access token
// hết hạn giữa chừng trong khi cookie CSRF vẫn còn. Trước đây gặp đúng lúc này sẽ hiện nhầm lỗi
// "Missing or invalid CSRF token" (thay vì lỗi đúng bản chất là hết phiên) — vì CsrfGuard (chạy
// TRƯỚC AuthGuard, đăng ký global) không phân biệt được "cookie CSRF hợp lệ nhưng access token đã
// hết hạn" với "thiếu cookie CSRF thật sự". Tự làm mới access token NGẦM ngay khi gặp 401 (hoặc
// đúng lỗi CSRF 403 kể trên — cùng 1 nguyên nhân gốc) rồi thử lại request gốc — người dùng không
// thấy lỗi, không bị "đăng xuất" âm thầm mỗi ngày.
const AUTH_ERROR_CODES = ['000127', '000128']; // thiếu / sai access token
const CSRF_ERROR_CODE = '000174';

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  try {
    // Cần CSRF token hợp lệ để chính request refresh-token này qua được CsrfGuard — dùng lại
    // ensureCsrfToken() (nay endpoint GET /auth/csrf-token đã public, không còn phụ thuộc access
    // token còn hạn hay không, xem AuthController#getCsrfToken bên BE).
    const csrfToken = await ensureCsrfToken();
    const res = await axios.post(
      `${API_BASE_URL}/v1/auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          'X-Client-App': CLIENT_APP,
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {})
        }
      }
    );
    setCsrfToken(res.data?.data?.csrfToken);
    return true;
  } catch {
    return false;
  }
}

// Response interceptor to unwrap data and normalize errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;
    const original = error.config;
    const isSessionExpired = status === 401 && AUTH_ERROR_CODES.includes(code);
    const isCsrfMismatchFromExpiry = status === 403 && code === CSRF_ERROR_CODE;

    if (
      (isSessionExpired || isCsrfMismatchFromExpiry) &&
      original &&
      !original._retriedAfterRefresh &&
      !original.url?.includes('/auth/refresh-token') &&
      !original.url?.includes('/auth/login')
    ) {
      original._retriedAfterRefresh = true;
      if (!refreshInFlight) {
        refreshInFlight = refreshSession().finally(() => {
          refreshInFlight = null;
        });
      }
      const refreshed = await refreshInFlight;
      if (refreshed) {
        return axiosClient(original);
      }

      // Refresh ngầm cũng thất bại — không chỉ access token hết hạn tạm thời, mà cả phiên (kể cả
      // refresh token) đã mất thật. Báo 1 lần duy nhất cho tới lúc có phiên mới (xem
      // sessionExpiredNotified/setCsrfToken ở trên).
      if (!sessionExpiredNotified) {
        sessionExpiredNotified = true;
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
    }

    return Promise.reject(error.response?.data?.error || error);
  }
);
