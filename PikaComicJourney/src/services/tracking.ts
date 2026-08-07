import { getApp } from '@react-native-firebase/app';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from '@react-native-firebase/firestore';

export type UsageEventType =
  | 'session_start'
  | 'session_end'
  | 'screen_view'
  | 'login'
  | 'logout'
  | 'select_play_card'
  | 'assign_by_play_type'
  | 'select_lesson'
  | 'assign_lesson';

const COLLECTION = 'usage_events';
// Giữ đồng bộ tay với app.json > expo.version — không có expo-constants trong deps.
const APP_VERSION = '1.0.0';

let sessionId: string | null = null;
let currentPhone: string | null = null;
let currentDeviceId: string | null = null;
let currentRobotId: string | null = null;
let anonAuthReady: Promise<void> | null = null;

function ensureAnonymousAuth(): Promise<void> {
  if (!anonAuthReady) {
    anonAuthReady = signInAnonymously(getAuth(getApp()))
      .then(() => undefined)
      .catch((error) => {
        console.warn('[tracking] anonymous sign-in failed', error);
        anonAuthReady = null;
      });
  }
  return anonAuthReady;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-().]/g, '');
}

function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function writeEvent(
  eventType: UsageEventType,
  screen: string | null,
  payload: Record<string, unknown> = {}
) {
  // Chụp nhanh state ngay đầu hàm, TRƯỚC await đầu tiên: writeEvent chạy qua
  // await ensureAnonymousAuth() rồi mới đọc các biến currentPhone/sessionId/...,
  // mà startSession()/endSession() có thể đã đổi các biến module-level đó
  // trong lúc await đang treo (ví dụ app background ngay sau khi mở phiên).
  // Đọc thẳng biến module-level ở thời điểm đó sẽ dính giá trị đã bị ghi đè
  // (từng thấy session_end ghi session_id: null vì endSession() set null
  // ngay sau khi gọi writeEvent, trước khi addDoc thực sự chạy).
  const phone = currentPhone;
  const session = sessionId;
  const deviceId = currentDeviceId;
  const robotId = currentRobotId;
  if (!phone || !session) return;

  try {
    await ensureAnonymousAuth();
    const db = getFirestore(getApp());
    await addDoc(collection(db, COLLECTION), {
      phone,
      session_id: session,
      event_type: eventType,
      screen,
      payload,
      device_id: deviceId,
      robot_id: robotId,
      app_version: APP_VERSION,
      client_ts: Date.now(),
      created_at: serverTimestamp(),
    });
  } catch (error) {
    // Tracking không bao giờ được làm crash hoặc chặn trải nghiệm điều khiển robot.
    console.warn(`[tracking] failed to log "${eventType}"`, error);
  }
}

export function startSession(phone: string, deviceId: string, robotId: string | null = null) {
  currentPhone = normalizePhone(phone);
  currentDeviceId = deviceId;
  currentRobotId = robotId;
  sessionId = generateSessionId();
  void writeEvent('session_start', null);
}

export function endSession() {
  if (!sessionId) return;
  void writeEvent('session_end', null);
  sessionId = null;
}

export function logEvent(
  eventType: UsageEventType,
  screen: string | null,
  payload?: Record<string, unknown>
) {
  void writeEvent(eventType, screen, payload);
}
