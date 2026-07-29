import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { axiosClient } from '@/services/axiosClient';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  address?: string;
  role: 'TENANT';
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
  token: string | null;
  isAuthenticated: boolean;
  login: (usernameOrPhone: string, pass: string) => Promise<AuthResult>;
  register: (fullName: string, phoneNumber: string, email: string, pass: string) => Promise<AuthResult>;
  markEmailVerified: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AUTH_USER_KEY = 'pimi_tenant_auth_user';
const AUTH_TOKEN_KEY = 'pimi_tenant_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem('pimi_access_token', token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('pimi_access_token');
    }
  }, [token]);

  const login = async (usernameOrPhone: string, pass: string): Promise<AuthResult> => {
    try {
      const response: any = await axiosClient.post('/v1/auth/login', {
        username: usernameOrPhone.trim().toLowerCase(),
        password: pass,
      });

      const data = response?.data || response;
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;
      const rawUser = data?.user || {};

      if (accessToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem('pimi_access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('pimi_refresh_token', refreshToken);
      }

      const fullName = [rawUser.lastName, rawUser.firstName].filter(Boolean).join(' ') || rawUser.username || usernameOrPhone;

      // When backend /v1/auth/login succeeds, the user's email is verified
      const profile: UserProfile = {
        id: rawUser.id || `tenant-${Date.now()}`,
        fullName,
        phoneNumber: rawUser.phoneNumber || usernameOrPhone,
        email: rawUser.email,
        avatar: rawUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'TENANT',
        isVerified: true,
        createdAt: rawUser.createdAt || new Date().toISOString(),
      };

      setUser(profile);
      setToken(accessToken || `token-${Date.now()}`);

      return {
        success: true,
        message: 'Đăng nhập tài khoản thành công!',
      };
    } catch (err: any) {
      console.warn('Backend login error:', err);

      const rawErr = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại!';
      const errStr = Array.isArray(rawErr) ? rawErr.join(', ') : String(rawErr);

      // Check if backend returned unverified email error (400_006)
      if (errStr.includes('verify your email') || errStr.includes('400_006')) {
        const unverifiedEmail = usernameOrPhone.includes('@') ? usernameOrPhone.trim().toLowerCase() : '';
        return {
          success: true,
          needsVerification: true,
          email: unverifiedEmail,
          message: 'Tài khoản của bạn chưa được xác thực email. Vui lòng nhập mã OTP để xác thực!',
        };
      }

      throw new Error(errStr);
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
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;
      const rawUser = data?.user || {};

      if (accessToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem('pimi_access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('pimi_refresh_token', refreshToken);
      }

      const profile: UserProfile = {
        id: rawUser.id || `tenant-${Date.now()}`,
        fullName,
        phoneNumber,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'TENANT',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      setUser(profile);
      setToken(accessToken || `token-${Date.now()}`);

      return {
        success: true,
        needsVerification: true,
        email: email.trim().toLowerCase(),
        message: 'Đăng ký tài khoản thành công! Vui lòng nhập mã OTP xác thực email.',
      };
    } catch (err: any) {
      console.warn('Backend registration failed:', err);
      const rawErr = err?.response?.data?.message || err?.message || 'Đăng ký thất bại!';
      throw new Error(Array.isArray(rawErr) ? rawErr.join(', ') : rawErr);
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
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('pimi_access_token');
    localStorage.removeItem('pimi_refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
