import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { startSession, endSession, logEvent } from '../services/tracking';

interface User {
  phone: string;
  token?: string;
  deviceId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@pika_auth';
const API_URL = 'https://robot-api.hacknao.edu.vn/robot-user/api/v1/auth/login';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUnauthorized = useCallback(async () => {
    console.log('🔒 Session expired - logging out');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    endSession();
  }, []);

  useEffect(() => {
    loadStoredAuth();
    apiService.setUnauthorizedHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const storedUser: User = JSON.parse(stored);
        setUser(storedUser);
        // App bị đóng/mở lại trong khi vẫn đăng nhập không đi qua login(),
        // nên phải tự mở phiên tracking mới ở đây, không thì mọi event sau đó
        // bị writeEvent() âm thầm bỏ qua (thiếu currentPhone/sessionId).
        if (storedUser.token) apiService.setToken(storedUser.token);
        const robotId = await apiService.getConnectedRobotId(storedUser.deviceId);
        startSession(storedUser.phone, storedUser.deviceId, robotId);
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const deviceId = `pika_${Date.now()}`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password,
          device_id: deviceId,
          device_token: `token_${Date.now()}`,
        }),
      });

      const data = await response.json();
      console.log('Login API response:', JSON.stringify(data, null, 2));

      if (data.status === 200 || response.ok) {
        // Lấy token từ các cấu trúc response khác nhau
        const token = data.data?.token || data.data?.access_token || data.token || data.access_token;

        if (token) {
          const userData: User = {
            phone,
            token,
            deviceId,
          };
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
          setUser(userData);
          apiService.setToken(token);
          const robotId = await apiService.getConnectedRobotId(deviceId);
          startSession(phone, deviceId, robotId);
          logEvent('login', null);
          console.log('Token saved:', token.substring(0, 20) + '...');
          return { success: true };
        } else {
          console.log('No token found in response');
          return { success: false, error: 'Không tìm thấy token trong response' };
        }
      } else {
        return { success: false, error: data.message || data.data?.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Không thể kết nối server' };
    }
  };

  const logout = async () => {
    try {
      logEvent('logout', null);
      endSession();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, logout }}>
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
