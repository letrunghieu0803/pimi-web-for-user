import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosClient, setCsrfToken } from '@/services/axiosClient';
import { getApiErrorMessage } from '@/utils/apiError';

// ERR_MSG_NEED_VERIFY_EMAIL in bff-for-pimi's error constants.
const ERR_CODE_NEED_VERIFY_EMAIL = '000006';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  address?: string;
  role: 'RENT_USER';
  isVerified?: boolean;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  needsVerification?: boolean;
  email?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (usernameOrPhone: string, pass: string) => Promise<AuthResult>;
  register: (fullName: string, phoneNumber: string, email: string, pass: string) => Promise<AuthResult>;
  completeEmailVerification: (response: any, fallbackFullName?: string) => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AUTH_USER_KEY = 'pimi_tenant_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  // accessToken/refreshToken không còn lưu ở localStorage nữa — nằm trong cookie httpOnly do
  // backend set (JS không đọc/ghi được, xem `axiosClient.ts`). `user` (không nhạy cảm) vẫn lưu
  // như trước để hiển thị UI ngay không cần chờ network; sự tồn tại của nó cũng là gợi ý "đã
  // đăng nhập" lạc quan cho `isAuthenticated`.
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // Dùng chung cho login() VÀ completeEmailVerification() — cả 2 endpoint backend
  // (/auth/login, /auth/verify-email) giờ trả cùng 1 hình dạng response {accessToken,
  // refreshToken, role, csrfToken} (không có object "user"), tự set cookie httpOnly + phải tự
  // gọi /users/me lấy hồ sơ thật (trước đây code cũ âm thầm dùng 1 object rỗng, khiến id/email
  // luôn rỗng/giả).
  const applyAuthenticatedProfile = async (
    response: any,
    fallback?: { fullName?: string; phoneNumber?: string },
  ): Promise<void> => {
    // Token giờ do backend tự set qua cookie httpOnly (kèm theo response nhờ
    // `withCredentials: true` ở axiosClient) — không tự đọc/lưu accessToken vào localStorage
    // nữa như trước.
    setCsrfToken(response?.csrfToken);

    let rawUser: any = {};
    try {
      const profileRes: any = await axiosClient.get('/v1/users/me');
      rawUser = profileRes?.data || profileRes || {};
    } catch (profileErr) {
      console.warn('Failed to fetch full profile:', profileErr);
    }

    const fullName =
      [rawUser.lastName, rawUser.firstName].filter(Boolean).join(' ') ||
      rawUser.username ||
      fallback?.fullName ||
      rawUser.email ||
      '';

    const profile: UserProfile = {
      id: rawUser.id || `tenant-${Date.now()}`,
      fullName,
      phoneNumber: rawUser.phoneNumber || fallback?.phoneNumber || '',
      email: rawUser.email,
      avatar: rawUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'RENT_USER',
      isVerified: true,
      createdAt: rawUser.createdAt || new Date().toISOString(),
    };

    setUser(profile);
  };

  const login = async (usernameOrPhone: string, pass: string): Promise<AuthResult> => {
    try {
      // loginAs='RENT_USER' — web này luôn đăng nhập với vai trò người thuê, kể cả cho tài
      // khoản mà role thật trong DB là HOUSE_OWNER (1 người có thể vừa là chủ nhà vừa là người
      // thuê; xem AuthService.login() ở backend). Không gửi field này thì 1 tài khoản chủ nhà
      // đăng nhập ở đây sẽ nhận JWT role=HOUSE_OWNER, khiến các API dành riêng cho người thuê
      // (đặt lịch xem phòng, đặt phòng...) bị chặn 403 sai.
      const response: any = await axiosClient.post('/v1/auth/login', {
        username: usernameOrPhone.trim().toLowerCase(),
        password: pass,
        loginAs: 'RENT_USER',
      });

      await applyAuthenticatedProfile(response, { fullName: usernameOrPhone, phoneNumber: usernameOrPhone });

      return {
        success: true,
        message: t('authContext.loginSuccess'),
      };
    } catch (err: any) {
      // Chỉ log code/message, không log nguyên `err` — khi request thất bại do lỗi mạng (không
      // có response từ server), interceptor ở axiosClient.ts trả thẳng lỗi axios gốc, mà
      // `err.config.data` chính là body request gốc (chứa mật khẩu dạng plaintext vừa nhập).
      console.warn('Backend login error:', { code: err?.code, message: err?.message });

      // Check if backend returned the "unverified email" business error
      if (err?.code === ERR_CODE_NEED_VERIFY_EMAIL) {
        const unverifiedEmail = usernameOrPhone.includes('@') ? usernameOrPhone.trim().toLowerCase() : '';
        return {
          success: true,
          needsVerification: true,
          email: unverifiedEmail,
          message: t('authContext.needVerifyEmail'),
        };
      }

      const wrapped = new Error(getApiErrorMessage(err));
      (wrapped as any).code = err?.code;
      throw wrapped;
    }
  };

  const register = async (fullName: string, phoneNumber: string, email: string, pass: string): Promise<AuthResult> => {
    try {
      const nameParts = fullName.trim().split(' ');
      const lastName = nameParts[0] || '';
      const firstName = nameParts.slice(1).join(' ') || lastName;

      await axiosClient.post('/v1/auth/register', {
        username: phoneNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        password: pass,
        firstName,
        lastName,
        userRole: 'RENT_USER',
      });

      // `POST /auth/register` chỉ trả 1 chuỗi thông báo, KHÔNG cấp token/cookie nào (tài khoản
      // còn NEW_REGISTER, chưa xác thực email) — trước đây ở đây tự đặt `setUser(profile)` LẠC
      // QUAN dựa thẳng vào dữ liệu form vừa gõ, khiến `isAuthenticated` thành `true` dù chưa hề
      // có phiên đăng nhập thật nào (không cookie, không token) — mọi API cần xác thực sau đó
      // (kể cả bấm linh tinh trước khi verify OTP) âm thầm 401. Không set user ở đây nữa — chỉ
      // thật sự "đăng nhập" sau khi `completeEmailVerification()` xác thực OTP thành công (xem
      // VerifyEmail.tsx), đúng lúc backend mới cấp token thật.

      return {
        success: true,
        needsVerification: true,
        email: email.trim().toLowerCase(),
        message: t('authContext.registerSuccess'),
      };
    } catch (err: any) {
      // Cùng lý do như nhánh login ở trên — không log nguyên `err` (có thể chứa mật khẩu vừa
      // nhập trong `err.config.data` khi request thất bại do lỗi mạng).
      console.warn('Backend registration failed:', { code: err?.code, message: err?.message });
      const wrapped = new Error(getApiErrorMessage(err));
      (wrapped as any).code = err?.code;
      throw wrapped;
    }
  };

  // Gọi sau khi POST /v1/auth/verify-email thành công (VerifyEmail.tsx) — backend giờ cấp token
  // thật + set cookie ngay lúc xác thực OTP đúng, đây là lần đầu tiên user thật sự có phiên đăng
  // nhập kể từ lúc bắt đầu đăng ký.
  const completeEmailVerification = async (response: any, fallbackFullName?: string): Promise<void> => {
    await applyAuthenticatedProfile(response, { fullName: fallbackFullName });
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
    }
  };

  const logout = () => {
    // Token nằm trong cookie httpOnly — JS không tự xoá được, phải gọi backend để nó
    // `clearCookie`. Không chặn UI chờ response (best-effort) — vẫn dọn state/local ngay.
    axiosClient.post('/v1/auth/logout').catch(() => {
      // ignore
    });
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        completeEmailVerification,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
