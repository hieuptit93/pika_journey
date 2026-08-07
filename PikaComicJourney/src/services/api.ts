import { Platform } from 'react-native';

const API_BASE_URL = 'https://robot-api.hacknao.edu.vn/robot/api/v1';
// Giữ đồng bộ tay với app.json > expo.version, giống APP_VERSION ở tracking.ts.
const APP_VERSION = '1.0.0';

export class UnauthorizedError extends Error {
  constructor(message = 'Phiên đăng nhập hết hạn') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export interface ApiLesson {
  id: string;
  ico: string;
  title: string;
  desc: string;
  time: string;
  tasks: [string, string][];
}

export interface ExperienceMapResponse {
  status: number;
  message: string;
  data: {
    lessons: ApiLesson[];
  };
}

export interface AssignLessonResponse {
  status: number;
  message: string;
  data: {
    requestId: string;
  };
}

export type PlayType = 'STORY_TELLING' | 'SINGING' | 'SPEAK_ENGLISH' | 'CHARACTER_GUESSING';

export interface AssignByPlayTypeResponse {
  status: number;
  message: string;
  data: {
    requestId: string;
  };
}

interface ProfileSettingsResponse {
  status: number;
  message: string;
  data: {
    // Trên môi trường robot-api.hacknao.edu.vn, robot_id nằm phẳng ở data.robot_id
    // (khác robotapp, nơi nó nằm trong 1 section "ROBOT_CARD" của data.sections —
    // giữ cả 2 khả năng vì hai codebase gọi cùng path "/profiles/settings" nhưng
    // có thể trỏ backend/version khác nhau).
    robot_id?: string;
    sections?: { section: string; robot_id?: string }[];
  };
}

class ApiService {
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  setToken(token: string) {
    this.token = token;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private async fetch<T>(
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    }
    console.log('🔗 API Request:', options?.method || 'GET', url.toString());
    console.log('📦 Body:', options?.body);

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    console.log('📥 Response status:', response.status);

    if (response.status === 401) {
      console.log('🔒 401 Unauthorized - triggering logout');
      if (this.onUnauthorized) {
        this.onUnauthorized();
      }
      throw new UnauthorizedError();
    }

    if (!response.ok) {
      let errorMessage = `Lỗi server: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.data?.message || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      console.error('❌ API Error:', response.status, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getExperienceMap(): Promise<ExperienceMapResponse> {
    return this.fetch<ExperienceMapResponse>('/temp-session/experience-map');
  }

  async assignLesson(lessonId: string): Promise<AssignLessonResponse> {
    return this.fetch<AssignLessonResponse>('/temp-session/assign-lesson', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    });
  }

  async assignByPlayType(playType: PlayType): Promise<AssignByPlayTypeResponse> {
    return this.fetch<AssignByPlayTypeResponse>('/temp-session/assign-by-play-type', {
      method: 'POST',
      body: JSON.stringify({ play_type: playType }),
    });
  }

  /**
   * robot_id đang gán cho tài khoản, đọc từ /profiles/settings (cùng API
   * robotapp dùng để đọc robot đang active). Endpoint này đòi hỏi app_v/
   * device_id/platform trên query string, không có thì trả 400 "Thiếu thông
   * tin app_v" — đã verify trực tiếp với backend thật.
   * Trả null nếu chưa pair robot nào hoặc API lỗi — chỉ dùng cho tracking nên
   * không được throw.
   */
  async getConnectedRobotId(deviceId: string): Promise<string | null> {
    try {
      const res = await this.fetch<ProfileSettingsResponse>(
        '/profiles/settings',
        undefined,
        { app_v: APP_VERSION, device_id: deviceId, platform: Platform.OS }
      );
      const robotCard = res.data?.sections?.find((s) => s.section === 'ROBOT_CARD');
      return res.data?.robot_id || robotCard?.robot_id || null;
    } catch (error) {
      console.warn('Failed to fetch connected robot_id:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
