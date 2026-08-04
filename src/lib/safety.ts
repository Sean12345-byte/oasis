// ── 安全關鍵字偵測模組 ──
// 100% 本地端執行，不上傳任何資料到伺服器
// 可獨立維護、更新關鍵字清單

// 高風險關鍵詞（自傷、自殺意念相關）
// 注意：這是敏感清單，僅用於在本地觸發關懷提示
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
  "沒有意義",
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

// 中度風險關鍵詞（自我否定、強烈絕望——僅記錄，不阻擋）
export const MEDIUM_RISK_KEYWORDS: string[] = [
  "我恨自己",
  "我討厭自己",
  "我是廢物",
  "一無是處",
  "沒有希望",
  "絕望",
  "我不想努力了",
];

export interface SafetyCheckResult {
  isHighRisk: boolean;
  matchedKeywords: string[];
  riskLevel: "none" | "medium" | "high";
}

/**
 * 對輸入文字進行本地安全檢查
 * @param text 使用者輸入的文字
 * @returns SafetyCheckResult
 */
export function checkSafety(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase().trim();
  if (!normalized) {
    return { isHighRisk: false, matchedKeywords: [], riskLevel: "none" };
  }

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

// 求助資源
export const HELP_RESOURCES = {
  title: "如果你需要找人說說話",
  message:
    "我們注意到你可能正在經歷不容易的時刻。這些感受是真實的，你不需要獨自面對。",
  hotlines: [
    { name: "安心專線", number: "1925", description: "24 小時免付費心理諮詢（衛福部）" },
    { name: "生命線", number: "1995", description: "24 小時協談專線" },
    { name: "張老師", number: "1980", description: "週一至六 9:00-21:00" },
  ],
  disclaimer: "Oasis 無法取代專業心理諮商。以上資源皆為台灣地區專線。",
};
