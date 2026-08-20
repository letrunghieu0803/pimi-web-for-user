import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3333';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    // accessToken giờ nằm trong cookie httpOnly — JS không đọc được để gắn vào `auth.token`
    // như trước nữa. Trình duyệt tự gửi kèm cookie `pimi_at` trong request handshake (HTTP
    // upgrade) khi bật `withCredentials`, backend (NotificationsGateway) đọc thẳng từ đó nếu
    // không thấy `auth.token`/header Authorization.
    const instance = io(`${SOCKET_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketRef.current = instance;
    setSocket(instance);

    return () => {
      instance.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
