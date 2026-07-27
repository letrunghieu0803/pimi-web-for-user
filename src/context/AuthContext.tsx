import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  address?: string;
  role: 'TENANT';
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, phoneNumber: string, email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AUTH_USER_KEY = 'pimi_tenant_auth_user';
const AUTH_TOKEN_KEY = 'pimi_tenant_auth_token';

// Demo initial user for smooth testing
const DEMO_TENANT_USER: UserProfile = {
  id: 'tenant-demo-88',
  fullName: 'Nguyễn Văn Thuê',
  phoneNumber: '0988776655',
  email: 'nguyenvanthue@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  address: 'Quận Cầu Giấy, Hà Nội',
  role: 'TENANT',
  createdAt: '2026-07-01T00:00:00Z',
};

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
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  const login = async (phoneNumber: string, pass: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Simulate authentication
    let loginUser: UserProfile = DEMO_TENANT_USER;
    if (user && user.phoneNumber === phoneNumber) {
      loginUser = user;
    } else {
      loginUser = {
        ...DEMO_TENANT_USER,
        phoneNumber,
        fullName: user?.fullName || 'Người Thuê Nhà',
      };
    }

    const mockToken = `mock-token-${Date.now()}`;
    setUser(loginUser);
    setToken(mockToken);

    return {
      success: true,
      message: 'Đăng nhập tài khoản thành công!',
    };
  };

  const register = async (fullName: string, phoneNumber: string, email: string, pass: string) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const newUser: UserProfile = {
      id: `tenant-${Date.now()}`,
      fullName,
      phoneNumber,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'TENANT',
      createdAt: new Date().toISOString(),
    };

    const mockToken = `mock-token-${Date.now()}`;
    setUser(newUser);
    setToken(mockToken);

    return {
      success: true,
      message: 'Đăng ký tài khoản mới thành công! Bạn đã được tự động đăng nhập.',
    };
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
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
