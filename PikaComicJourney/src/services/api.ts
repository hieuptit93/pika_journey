import { Platform } from 'react-native';
import i18n from '../i18n';

// Host duy nhất của backend — đổi môi trường chỉ cần sửa dòng này.
export const API_BASE_URL = 'https://robot-api.stepup.edu.vn';
export const ROBOT_API_URL = `${API_BASE_URL}/robot/api/v1`;
// Giữ đồng bộ tay với app.json > expo.version, giống APP_VERSION ở tracking.ts.
const APP_VERSION = '1.0.0';

export class UnauthorizedError extends Error {
  constructor(message = i18n.t('errors.sessionExpired')) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Lỗi HTTP từ server. reason = data.reason của ErrorResponse (mã máy đọc được,
// vd "redirect_not_allowed" của GAME_ZIP_URL_REJECTED) — message server trả về
// theo ngôn ngữ lưu trên server, không theo ngôn ngữ app, nên app dịch theo reason.
export class ApiError extends Error {
  constructor(message: string, public status: number, public reason?: string) {
    super(message);
    this.name = 'ApiError';
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

export type GameSyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'TO_DELETE';

export interface TempGameItem {
  game_id: string;
  display_name: string;
  version: string;
  size_bytes: number | null;
  min_firmware_version: string | null;
  distribution: 'TARGETED' | 'FLEET';
  firmware_ok: boolean;
  allowed: boolean;
  sync_status: GameSyncStatus | null;
  playable: boolean;
}

export interface GamePushResult {
  requested: boolean;
  queued: boolean;
  sync_status: GameSyncStatus | null;
  error_code: string | null;
}

export interface GameDeployResult {
  game_id: string;
  version: string;
  display_name: string;
  min_firmware_version: string;
  size_bytes: number;
  file_count: number;
  warnings: string[];
  push: GamePushResult;
}

interface DataResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Giới hạn của server cho zip (cả upload lẫn link).
export const GAME_ZIP_MAX_BYTES = 41_943_040;
// /zip và /zip-by-url phải đóng gói + đẩy lên S3 (+ tải link) nên server cần
// tới 120 s; chờ dư một chút.
const GAME_UPLOAD_TIMEOUT_MS = 130_000;

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

    const url = new URL(`${ROBOT_API_URL}${endpoint}`);
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
      const errorText = await response.text();
      throw this.toApiError(response.status, errorText);
    }

    return response.json();
  }

  private toApiError(status: number, body: string): ApiError {
    let errorMessage = i18n.t('errors.server', { status });
    let reason: string | undefined;
    try {
      const errorData = JSON.parse(body);
      errorMessage = errorData.message || errorData.data?.message || errorMessage;
      reason = errorData.data?.reason;
    } catch {
      if (body) errorMessage = body;
    }
    console.error('❌ API Error:', status, errorMessage, reason ?? '');
    return new ApiError(errorMessage, status, reason);
  }

  // fetch không có timeout và không báo tiến độ upload, nên các lệnh tải game
  // dài dùng XMLHttpRequest.
  private request<T>(
    endpoint: string,
    body: FormData | string,
    onUploadProgress?: (fraction: number) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${ROBOT_API_URL}${endpoint}`);
      xhr.timeout = GAME_UPLOAD_TIMEOUT_MS;
      // FormData: không tự đặt Content-Type, để XHR thêm boundary của multipart.
      if (typeof body === 'string') xhr.setRequestHeader('Content-Type', 'application/json');
      if (this.token) xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      if (onUploadProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) onUploadProgress(e.loaded / e.total);
        };
      }
      xhr.onload = () => {
        console.log('📥 Response status:', xhr.status, endpoint);
        if (xhr.status === 401) {
          this.onUnauthorized?.();
          reject(new UnauthorizedError());
        } else if (xhr.status < 200 || xhr.status >= 300) {
          reject(this.toApiError(xhr.status, xhr.responseText));
        } else {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new ApiError(i18n.t('errors.server', { status: xhr.status }), xhr.status));
          }
        }
      };
      xhr.onerror = () => reject(new ApiError(i18n.t('errors.cannotConnect'), 0));
      xhr.ontimeout = () => reject(new ApiError(i18n.t('errors.cannotConnect'), 0, 'timeout'));
      console.log('🔗 API Request: POST', `${ROBOT_API_URL}${endpoint}`);
      xhr.send(body);
    });
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

  // --- Robot Game zip (game-zip-api.md). Robot lấy từ JWT, không gửi robot_id. ---

  async getGames(): Promise<TempGameItem[]> {
    const res = await this.fetch<DataResponse<TempGameItem[]>>('/temp-session/games');
    return res.data ?? [];
  }

  /** Tải zip lên; có gameId thì thêm phiên bản mới cho game đó thay vì tạo game mới. */
  async uploadGameZip(
    file: { uri: string; name: string },
    gameId?: string,
    onUploadProgress?: (fraction: number) => void
  ): Promise<GameDeployResult> {
    const form = new FormData();
    // React Native nhận object { uri, name, type } làm file part.
    form.append('file', { uri: file.uri, name: file.name, type: 'application/zip' } as unknown as Blob);
    form.append('push', 'true');
    if (gameId) form.append('game_id', gameId);
    const res = await this.request<DataResponse<GameDeployResult>>('/temp-session/games/zip', form, onUploadProgress);
    return res.data;
  }

  async uploadGameZipByUrl(url: string, gameId?: string): Promise<GameDeployResult> {
    const body = JSON.stringify({ url, push: true, ...(gameId ? { game_id: gameId } : {}) });
    const res = await this.request<DataResponse<GameDeployResult>>('/temp-session/games/zip-by-url', body);
    return res.data;
  }

  async pushGame(gameId: string): Promise<GamePushResult> {
    const res = await this.fetch<DataResponse<GamePushResult>>(
      `/temp-session/games/${encodeURIComponent(gameId)}/push`,
      { method: 'POST' }
    );
    return res.data;
  }

  async assignGame(gameId: string): Promise<{ game_id: string; request_id: string }> {
    const res = await this.fetch<DataResponse<{ game_id: string; request_id: string }>>(
      `/temp-session/games/${encodeURIComponent(gameId)}/assign`,
      { method: 'POST' }
    );
    return res.data;
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
