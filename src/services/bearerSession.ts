// Chế độ phiên "Bearer fallback" — dự phòng khi trình duyệt KHÔNG cho lưu cookie của API.
//
// VÌ SAO CÓ: mặc định phiên nằm trong cookie httpOnly do API set (SameSite=None; Secure). Web
// và API khác site nên đó là cookie bên thứ ba (cross-site). iOS Safari / mọi trình duyệt WebKit
// trên iOS / webview trong app (Zalo, Facebook...) chặn cookie bên thứ ba (ITP) — đăng nhập xong
// cookie không được lưu, request kế tiếp 401 "missing token" (000127), refresh cũng hỏng và UI
// đá người dùng ra ngay sau khi đăng nhập. Ở chế độ này ta giữ accessToken/refreshToken do API
// trả trong body và gửi lại qua header `Authorization: Bearer ...` (backend nhận Bearer trước
// cookie; request có header Authorization thì CsrfGuard bỏ qua nên không cần X-CSRF-Token).
//
// ĐÁNH ĐỔI BẢO MẬT: token lưu ở localStorage thì JS (kể cả script độc hại nếu bị XSS) đọc được,
// khác cookie httpOnly. Vì vậy CHỈ bật khi cookie thực sự không dùng được: sau mỗi lần đăng
// nhập ta chỉ giữ token ở BỘ NHỚ làm "ứng viên"; chỉ khi request kế tiếp bị 401 000127 (cookie
// không được gửi lên) mới ghi ứng viên đó xuống localStorage. Trình duyệt cookie chạy bình
// thường thì không bao giờ có token trong localStorage — hành vi giữ nguyên như cũ.

const STORAGE_KEY = 'pimi_bearer_session_user';

// Bắn ra mỗi khi token trong localStorage đổi (chuyển sang bearer mode / refresh xong) — để
// SocketContext nối lại với token mới (xem comment ở đó).
export const BEARER_SESSION_CHANGED_EVENT = 'pimi:bearer-session-changed';

export interface BearerTokens {
  accessToken: string;
  refreshToken: string;
}

// Token của lần đăng nhập/verify-email GẦN NHẤT — chỉ ở bộ nhớ, KHÔNG ghi xuống storage.
let loginCandidates: BearerTokens | null = null;

const isValidTokens = (v: unknown): v is BearerTokens =>
  !!v &&
  typeof (v as BearerTokens).accessToken === 'string' &&
  !!(v as BearerTokens).accessToken &&
  typeof (v as BearerTokens).refreshToken === 'string' &&
  !!(v as BearerTokens).refreshToken;

// Lấy {accessToken, refreshToken} từ response login/verify-email/refresh. Interceptor của
// axiosClient đã bóc 1 lớp axios (response.data) nhưng body backend vẫn bọc thêm {data:{...}},
// nên thử `.data` trước rồi tới chính object đó.
export const extractTokens = (response: any): BearerTokens | null => {
  const body = response?.data ?? response;
  const tokens = { accessToken: body?.accessToken, refreshToken: body?.refreshToken };
  return isValidTokens(tokens) ? tokens : null;
};

export const getBearerSession = (): BearerTokens | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidTokens(parsed)
      ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken }
      : null;
  } catch {
    // Storage có thể ném lỗi (private mode, bị chặn) hoặc JSON hỏng — coi như không có phiên.
    return null;
  }
};

export const isBearerMode = (): boolean => getBearerSession() !== null;

const notifyChanged = () => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(BEARER_SESSION_CHANGED_EVENT));
    }
  } catch {
    // ignore
  }
};

export const setBearerSession = (tokens: BearerTokens): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
    );
  } catch {
    // Không ghi được (private mode / đầy quota) — chế độ bearer sẽ không bật, đành chịu.
  }
  notifyChanged();
};

export const clearBearerSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

// Ghi nhớ token của lần đăng nhập vừa xong làm "ứng viên" (chỉ bộ nhớ). Truyền null/thiếu token
// thì xoá ứng viên cũ — tránh dùng nhầm token của lần đăng nhập trước.
export const rememberLoginTokens = (tokens: BearerTokens | null | undefined): void => {
  loginCandidates = isValidTokens(tokens) ? { ...tokens } : null;
};

// Lấy ứng viên ra và xoá luôn (dùng đúng 1 lần).
export const consumeLoginTokens = (): BearerTokens | null => {
  const t = loginCandidates;
  loginCandidates = null;
  return t;
};

export const hasLoginCandidates = (): boolean => loginCandidates !== null;

// Cookie xác nhận hoạt động bình thường (request cần xác thực thành công) — không cần ứng viên nữa.
export const dropLoginCandidates = (): void => {
  loginCandidates = null;
};

// Điểm chuyển chế độ: gọi khi gặp 401 000127 ngay sau đăng nhập. Nếu chưa ở bearer mode và còn
// ứng viên thì ghi ứng viên xuống storage và trả true (caller thử lại request gốc 1 lần).
export const trySwitchToBearer = (): boolean => {
  if (isBearerMode()) return false;
  const candidates = consumeLoginTokens();
  if (!candidates) return false;
  setBearerSession(candidates);
  return isBearerMode(); // false nếu storage không ghi được
};
