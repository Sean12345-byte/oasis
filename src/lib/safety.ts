// ── 安全關鍵字偵測模組 ──
// 100% 本地端執行，不上傳任何資料到伺服器
// 可獨立維護、更新關鍵字清單

// ── 高風險關鍵詞（自傷、自殺意念相關）──
// 命中後觸發完整攔截：暫停動畫，顯示關懷對話框
export const HIGH_RISK_KEYWORDS: string[] = [
  // 中文 — 直接表達
  "想死",
  "不想活",
  "結束生命",
  "自殺",
  "自殘",
  "自傷",
  "傷害自己",
  "了結自己",
  "離開這個世界",
  "不想醒來",
  "永遠睡著",
  "活不下去",
  "沒有我比較好",
  "消失比較好",
  "解脫",
  "一了百了",
  "割腕",
  "跳樓",
  "上吊",
  "燒炭",
  "安眠藥自殺",
  // 中文 — 暗示性
  "不想存在",
  "活著好累",
  "不值得活",
  "撐不下去",
  "撐不住了",
  "走不下去",
  // 英文
  "kill myself",
  "end my life",
  "want to die",
  "suicide",
  "self harm",
  "self-harm",
  "cut myself",
  "no reason to live",
  "better off dead",
];

// ── 中度風險關鍵詞（自我否定、強烈疲憊、日常抒發性用語）──
// 命中後不暫停動畫，僅顯示溫和的一行關懷提示
// 設計原則：避免誤傷日常口語表達（如「累到想死」），僅在明確的絕望/自我否定脈絡才提示
export const MEDIUM_RISK_KEYWORDS: string[] = [
  "我恨自己",
  "我討厭自己",
  "我是廢物",
  "一無是處",
  "完全沒有希望",
  "徹底絕望",
  "沒有人在乎我",
  "我消失也沒人發現",
];

// ── 安全語境詞（含這些詞時，即使命中高風險關鍵字也不攔截）──
// 用於避免誤判日常抱怨（如「我快死了，這報告」→ 因「報告」在此清單而不攔截）
const SAFE_CONTEXT_WORDS: string[] = [
  "報告", "作業", "考試", "加班", "專案", "deadline",
  "工作", "老闆", "客戶", "會議", "簡報", "論文",
  "期中考", "期末考", "模擬考", "面試",
];

export interface SafetyCheckResult {
  isHighRisk: boolean;
  matchedKeywords: string[];
  riskLevel: "none" | "medium" | "high";
}

/**
 * 對輸入文字進行本地安全檢查（含安全語境詞過濾）
 */
export function checkSafety(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase().trim();
  if (!normalized) {
    return { isHighRisk: false, matchedKeywords: [], riskLevel: "none" };
  }

  // 檢查安全語境詞
  const hasSafeContext = SAFE_CONTEXT_WORDS.some((w) =>
    normalized.includes(w.toLowerCase())
  );

  // 高風險檢查（若在安全語境中則跳過攔截）
  if (!hasSafeContext) {
    const highMatches: string[] = [];
    for (const kw of HIGH_RISK_KEYWORDS) {
      if (normalized.includes(kw.toLowerCase())) {
        highMatches.push(kw);
      }
    }
    if (highMatches.length > 0) {
      return {
        isHighRisk: true,
        matchedKeywords: highMatches,
        riskLevel: "high",
      };
    }
  }

  // 中度風險檢查
  const mediumMatches: string[] = [];
  for (const kw of MEDIUM_RISK_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) {
      mediumMatches.push(kw);
    }
  }

  return {
    isHighRisk: false,
    matchedKeywords: mediumMatches,
    riskLevel: mediumMatches.length > 0 ? "medium" : "none",
  };
}

// ── 求助資源 ──
export const HELP_RESOURCES = {
  title: "如果你需要找人說說話",
  message:
    "我們注意到你可能正在經歷不容易的時刻。這些感受是真實的，你不需要獨自面對。",
  hotlines: [
    { name: "安心專線", number: "1925", description: "24 小時免付費心理諮詢（衛福部）", type: "phone" as const },
    { name: "生命線", number: "1995", description: "24 小時協談專線", type: "phone" as const },
    { name: "張老師", number: "1980", description: "週一至六 9:00-21:00", type: "phone" as const },
  ],
  textResources: [
    {
      name: "文字聊聊（較低門檻）",
      description: "如果不方便打電話，也可以傳訊息給信任的朋友，或在備忘錄寫下來。有人在乎你。",
      action: "message" as const,
    },
  ],
  disclaimer: "Oasis 無法取代專業心理諮商。以上資源皆為台灣地區專線。",
};
