// ── 每日推播提醒模組 ──
// 純陪伴語句，不做評價、不提醒完成任務
// 預設關閉，使用者主動開啟

const PREFIX = "oasis_";

export interface NotificationPrefs {
  enabled: boolean;
  /** 推播時間，格式 HH:MM (24hr)，預設 21:00 */
  time: string;
  /** 上次推播日期 (YYYY-MM-DD)，防止重複 */
  lastSentDate: string | null;
}

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  enabled: false,
  time: "21:00",
  lastSentDate: null,
};

export function getNotificationPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_NOTIF_PREFS;
  try {
    const raw = localStorage.getItem(`${PREFIX}notif_prefs`);
    return raw ? { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(raw) } : DEFAULT_NOTIF_PREFS;
  } catch {
    return DEFAULT_NOTIF_PREFS;
  }
}

export function setNotificationPrefs(prefs: Partial<NotificationPrefs>): void {
  const current = getNotificationPrefs();
  localStorage.setItem(
    `${PREFIX}notif_prefs`,
    JSON.stringify({ ...current, ...prefs })
  );
}

/** 請求瀏覽器推播權限 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// ── 推播文案（純陪伴，不做評價、不提醒任務）──
export const NOTIFICATION_MESSAGES = [
  "今天的你，辛苦了。不管晴天雨天，這裡都在。",
  "沒有特別的事也沒關係。你的存在，本身就很完整。",
  "夜深了。記得，你不是一個人。",
  "窗外有風在吹。停下來呼吸一口，這樣就夠了。",
  "打開 Oasis 不是為了完成什麼。只是，這裡永遠有一個位置留給你。",
  "今天發生的一切，你都撐過來了。光是這樣，就已經很了不起。",
  "沒有需要回覆的事。只是想跟你說：有人在這裡。",
  "一朵雲飄過去了。你也像雲一樣，可以只是存在。",
];

export function pickNotificationMessage(): string {
  return NOTIFICATION_MESSAGES[
    Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)
  ];
}

/** 發送推播 */
export function sendNotification(): void {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const message = pickNotificationMessage();
  new Notification("Oasis (棲所)", {
    body: message,
    icon: "/icons/icon-192.png",
    tag: "oasis-daily",
    silent: true, // 不發出聲音，避免驚擾
  });
}

/** 檢查是否該發推播了（排程邏輯） */
export function checkAndSendNotification(): void {
  const prefs = getNotificationPrefs();
  if (!prefs.enabled) return;

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // 今天已發過
  if (prefs.lastSentDate === todayKey) return;

  // 檢查時間
  const [h, m] = prefs.time.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = h * 60 + m;

  // 允許前後 5 分鐘的誤差窗口（因為 setInterval 不是精確的）
  if (Math.abs(nowMinutes - targetMinutes) <= 5) {
    sendNotification();
    setNotificationPrefs({ lastSentDate: todayKey });
  }
}
