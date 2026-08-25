import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosClient } from '@/services/axiosClient';
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
  markEmailVerified: () => void;
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

      // Token giờ do backend tự set qua cookie httpOnly (kèm theo response nhờ
      // `withCredentials: true` ở axiosClient) — không tự đọc/lưu accessToken vào localStorage
      // nữa như trước.

      // Response của /v1/auth/login KHÔNG có object "user" (chỉ {accessToken, refreshToken,
      // role}) — phải tự gọi /v1/users/me để lấy hồ sơ thật (trước đây code này âm thầm dùng
      // 1 object rỗng, khiến id/email luôn rỗng/giả).
      let rawUser: any = {};
      try {
        const profileRes: any = await axiosClient.get('/v1/users/me');
        rawUser = profileRes?.data || profileRes || {};
      } catch (profileErr) {
        console.warn('Failed to fetch full profile after login:', profileErr);
      }

      const fullName = [rawUser.lastName, rawUser.firstName].filter(Boolean).join(' ') || rawUser.username || usernameOrPhone;

      // When backend /v1/auth/login succeeds, the user's email is verified
      const profile: UserProfile = {
        id: rawUser.id || `tenant-${Date.now()}`,
        fullName,
        phoneNumber: rawUser.phoneNumber || usernameOrPhone,
        email: rawUser.email,
        avatar: rawUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'RENT_USER',
        isVerified: true,
        createdAt: rawUser.createdAt || new Date().toISOString(),
      };

      setUser(profile);

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

      const response: any = await axiosClient.post('/v1/auth/register', {
        username: phoneNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        password: pass,
        firstName,
        lastName,
        userRole: 'RENT_USER',
      });

      const data = response?.data || response;
      const rawUser = data?.user || {};
      // Token (nếu backend có trả) giờ do backend tự set qua cookie httpOnly — không tự
      // đọc/lưu vào localStorage nữa.

      const profile: UserProfile = {
        id: rawUser.id || `tenant-${Date.now()}`,
        fullName,
        phoneNumber,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'RENT_USER',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      setUser(profile);

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

  const markEmailVerified = () => {
    if (user) {
      setUser({ ...user, isVerified: true });
    }
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
        markEmailVerified,
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
