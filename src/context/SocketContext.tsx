import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { BEARER_SESSION_CHANGED_EVENT, getBearerSession } from '@/services/bearerSession';

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
    // như trước nữa. Trình duyệt tự gửi kèm cookie (tên tách theo web, `pimi_at_user`) trong
    // request handshake (HTTP upgrade) khi bật `withCredentials`, backend (NotificationsGateway)
    // đọc thẳng từ đó nếu không thấy `auth.token`/header Authorization. `auth.clientApp` báo cho
    // gateway biết đọc đúng cookie `pimi_at_user` — không gửi qua header tuỳ chỉnh vì trình
    // duyệt không cho set header thường trên upgrade request thuần WebSocket.
    const instance = io(`${SOCKET_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket'],
      // Dạng hàm: socket.io gọi lại mỗi lần (re)connect nên luôn lấy access token MỚI NHẤT. Ở
      // bearer mode (trình duyệt chặn cookie cross-site, xem bearerSession.ts) cookie không tới
      // được gateway nên gửi `token` qua handshake; cookie mode thì không có token (như cũ).
      auth: (cb) => {
        const token = getBearerSession()?.accessToken;
        cb({ clientApp: 'user', ...(token ? { token } : {}) });
      },
    });
    socketRef.current = instance;
    setSocket(instance);

    // Token vừa đổi (refresh xong / vừa chuyển sang bearer mode): nếu socket đang rớt (handshake
    // trước đó bị từ chối vì thiếu/hết hạn token, hoặc server chủ động ngắt — trường hợp này
    // socket.io không tự nối lại) thì nối lại ngay bằng token mới. Socket đang kết nối ổn thì giữ.
    const onSessionChanged = () => {
      if (!instance.connected) instance.connect();
    };
    window.addEventListener(BEARER_SESSION_CHANGED_EVENT, onSessionChanged);

    return () => {
      window.removeEventListener(BEARER_SESSION_CHANGED_EVENT, onSessionChanged);
      instance.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
