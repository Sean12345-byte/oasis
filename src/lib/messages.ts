// ── 陪伴語句投稿庫 ──
// 匿名投稿 → 本地待審核 → 通過後加入隨機語句庫
// 無使用者身份、無排名、純集體陪伴

const PREFIX = "oasis_";

export interface SubmittedMessage {
  id: string;
  text: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

// ── 預設已審核通過的語句（種子語句庫）──
export const SEED_MESSAGES: string[] = [
  "你願意把這些寫下來，本身就需要很大的勇氣。",
  "這些情緒是真實的，它們值得被看見，你也值得。",
  "放下，不是忘記。是讓它們不再壓著你。",
  "謝謝你，今天也好好陪伴自己了。",
  "文字消散了，但你對自己的溫柔，留了下來。",
  "沒有什麼需要「解決」。此刻，能呼吸就好。",
  "霧會散的。不急，慢慢來。",
];

// ── 投稿引導文案（多版本）──
export const SUBMISSION_PROMPTS = [
  "曾經有哪句話，在你低潮時溫暖過你？寫下來，或許也能陪伴另一個人。",
  "不一定要多有智慧，只要是你覺得「那時候聽到這句話真好」的，都可以。",
  "匿名分享一句曾經幫助過你的話。沒有名字、沒有評價，只有傳遞。",
];

// ── LocalStorage CRUD ──

export function getSubmittedMessages(): SubmittedMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PREFIX}submitted_messages`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: SubmittedMessage[]): void {
  localStorage.setItem(`${PREFIX}submitted_messages`, JSON.stringify(messages));
}

export function submitMessage(text: string): SubmittedMessage {
  const messages = getSubmittedMessages();
  const msg: SubmittedMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  messages.push(msg);
  saveMessages(messages);
  return msg;
}

/** 取得已審核通過的語句（種子 + 使用者投稿） */
export function getApprovedMessages(): string[] {
  const submitted = getSubmittedMessages()
    .filter((m) => m.status === "approved")
    .map((m) => m.text);
  return [...SEED_MESSAGES, ...submitted];
}

/** 開發者：審核投稿 */
export function reviewMessage(id: string, approved: boolean): void {
  const messages = getSubmittedMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx >= 0) {
    messages[idx].status = approved ? "approved" : "rejected";
    saveMessages(messages);
  }
}

/** 取得待審核投稿 */
export function getPendingMessages(): SubmittedMessage[] {
  return getSubmittedMessages().filter((m) => m.status === "pending");
}

/** 從通過的語句庫中隨機挑選 */
export function pickRandomMessage(): string {
  const pool = getApprovedMessages();
  return pool[Math.floor(Math.random() * pool.length)];
}
