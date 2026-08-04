// ── 資料層：LocalStorage ──
// 負責：使用者偏好設定、UI 狀態等輕量 key-value 資料

const PREFIX = "oasis_";

/** 擁抱動畫的視覺風格 */
export type AnimationStyle = "hearts" | "glow" | "ripple";

export interface UserPreferences {
  /** 是否啟用「匿名化情緒趨勢記錄」（預設關閉） */
  trendTracking: boolean;
  /** 是否已看過隱私提示 */
  hasSeenPrivacyNotice: boolean;
  /** 使用者暱稱（可選） */
  nickname: string;
  /** 主題偏好（保留擴充） */
  theme: "dark";
  /** 語言 */
  language: "zh-TW";
  /** 釋放動畫的視覺風格偏好 */
  animationStyle: AnimationStyle;
}

const DEFAULT_PREFS: UserPreferences = {
  trendTracking: false,
  hasSeenPrivacyNotice: false,
  nickname: "",
  theme: "dark",
  language: "zh-TW",
  animationStyle: "hearts",
};

export function getPrefs(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(`${PREFIX}prefs`);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setPrefs(partial: Partial<UserPreferences>): UserPreferences {
  const current = getPrefs();
  const updated = { ...current, ...partial };
  localStorage.setItem(`${PREFIX}prefs`, JSON.stringify(updated));
  return updated;
}

export function setPrivacyNoticeSeen(): void {
  setPrefs({ hasSeenPrivacyNotice: true });
}

// ── 簡易 key-value helper ──
export function localGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function localSet<T>(key: string, value: T): void {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}
