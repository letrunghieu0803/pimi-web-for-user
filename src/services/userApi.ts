import i18n from '@/i18n';
import { axiosClient } from './axiosClient';

// Trạng thái xác thực hồ sơ phía backend (enum VerifyStatus) — từ VERIFIED_EMAIL trở đi nghĩa là
// email đã được xác thực OTP (các mức sau đó là xác thực thêm CCCD/Pimi). Chỉ NEW_REGISTER mới là
// chưa xác thực email.
export type UserVerifyStatus =
  | 'NEW_REGISTER'
  | 'VERIFIED_EMAIL'
  | 'FULL_BASIC_INFO'
  | 'VERIFIED_ID'
  | 'VERIFIED_BY_PIMI';

export interface UserMe {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  birthday?: string | null;
  gender?: string | null;
  username?: string;
  role?: string;
  verifyStatus?: UserVerifyStatus;
  // true khi tài khoản đã qua KYC (CCCD) — dữ liệu thật từ DB, dùng cho huy hiệu "đã xác thực".
  isVerified?: boolean;
  createdAt?: string;
}

// Ngôn ngữ email OTP backend gửi đi — theo ngôn ngữ đang chọn trên web.
const currentLang = (): 'VI' | 'EN' => (i18n.language?.startsWith('en') ? 'EN' : 'VI');

// Body trả về của backend có thể bọc trong `{ data }` hoặc trả trực tiếp (xem AuthContext).
const unwrap = <T>(res: any): T => (res?.data ?? res) as T;

export const userApi = {
  getMe: async (): Promise<UserMe> => unwrap<UserMe>(await axiosClient.get('/v1/users/me')),

  // Chỉ gửi các field thật sự có trong UpdateUserInfoDto (lastName/firstName/phoneNumber/birthday...)
  // — backend không có `address`/`avatar` nên không gửi, tránh bị ValidationPipe từ chối.
  updateMe: async (payload: {
    lastName?: string;
    firstName?: string;
    phoneNumber?: string;
    birthday?: string;
  }): Promise<UserMe> => unwrap<UserMe>(await axiosClient.put('/v1/users/me', payload)),

  // Gửi lại OTP xác thực email cho tài khoản chưa verify (cùng endpoint trang /verify-email dùng).
  sendVerifyEmailOtp: (email: string) =>
    axiosClient.post('/v1/auth/send-verify-email-otp', { email: email.trim().toLowerCase() }),

  // Đổi mật khẩu khi ĐÃ đăng nhập — khác "quên mật khẩu" (change-password-with-code, không cần
  // mật khẩu cũ). Backend dùng @IsStrongPassword() cho newPassword.
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    axiosClient.put('/v1/auth/change-password', payload),

  // Đổi email 2 bước: yêu cầu (kèm mật khẩu hiện tại, OTP gửi về email MỚI) -> xác nhận bằng OTP.
  requestChangeEmail: (payload: { currentPassword: string; newEmail: string; lang?: 'VI' | 'EN' }) =>
    axiosClient.post('/v1/auth/request-change-email', {
      currentPassword: payload.currentPassword,
      newEmail: payload.newEmail.trim().toLowerCase(),
      lang: payload.lang ?? currentLang(),
    }),
  verifyNewEmail: (payload: { newEmail: string; otp: string }) =>
    axiosClient.post('/v1/auth/verify-new-email', {
      newEmail: payload.newEmail.trim().toLowerCase(),
      otp: payload.otp.trim(),
    }),

  // Vô hiệu hoá tài khoản: gửi OTP về email hiện tại -> xác nhận OTP (otp nằm trên path).
  requestDeactivateAccount: (lang: 'VI' | 'EN' = currentLang()) =>
    axiosClient.post('/v1/users/me/request-deactivate-account', null, { params: { lang } }),
  verifyDeactivateAccount: (otp: string, lang: 'VI' | 'EN' = currentLang()) =>
    axiosClient.post(`/v1/users/me/verify-deactivate-account/${encodeURIComponent(otp.trim())}`, null, {
      params: { lang },
    }),

  // Kích hoạt lại tài khoản đã vô hiệu hoá — endpoint công khai (chưa đăng nhập được).
  requestReactivateAccount: (email: string, lang: 'VI' | 'EN' = currentLang()) =>
    axiosClient.post('/v1/users/request-reactivate-account', { email: email.trim().toLowerCase(), lang }),
  verifyReactivateAccount: (payload: { email: string; otp: string; lang?: 'VI' | 'EN' }) =>
    axiosClient.post('/v1/users/verify-reactivate-account', {
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
      lang: payload.lang ?? currentLang(),
    }),
};
