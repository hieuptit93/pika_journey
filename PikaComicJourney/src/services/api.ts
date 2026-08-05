const API_BASE_URL = 'https://robot-api.hacknao.edu.vn/robot/api/v1';

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

class ApiService {
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  setToken(token: string) {
    this.token = token;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔗 API Request:', options?.method || 'GET', url);
    console.log('📦 Body:', options?.body);

    const response = await fetch(url, {
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
}

export const apiService = new ApiService();
