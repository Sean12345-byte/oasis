// ── 開發者統計模組 ──
// 僅在本地端記錄，用於優化關鍵字清單

const PREFIX = "oasis_dev_";

export interface DevStats {
  /** 高風險觸發次數 */
  highRiskTriggers: number;
  /** 中風險觸發次數 */
  mediumRiskTriggers: number;
  /** 安全語境過濾次數（命中關鍵字但因安全語境詞而跳過） */
  safeContextFilters: number;
  /** 使用者選擇「繼續抒發」的次數 */
  userContinuedAfterHighRisk: number;
  /** 使用者選擇「查看資源」的次數 */
  userViewedResources: number;
  /** 總檢查次數 */
  totalChecks: number;
}

const DEFAULT_STATS: DevStats = {
  highRiskTriggers: 0,
  mediumRiskTriggers: 0,
  safeContextFilters: 0,
  userContinuedAfterHighRisk: 0,
  userViewedResources: 0,
  totalChecks: 0,
};

export function getDevStats(): DevStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(`${PREFIX}stats`);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(stats: DevStats): void {
  localStorage.setItem(`${PREFIX}stats`, JSON.stringify(stats));
}

export function trackSafetyCheck(riskLevel: "none" | "medium" | "high"): void {
  const stats = getDevStats();
  stats.totalChecks++;
  if (riskLevel === "high") stats.highRiskTriggers++;
  if (riskLevel === "medium") stats.mediumRiskTriggers++;
  saveStats(stats);
}

export function trackSafeContextFilter(): void {
  const stats = getDevStats();
  stats.safeContextFilters++;
  saveStats(stats);
}

export function trackUserContinued(): void {
  const stats = getDevStats();
  stats.userContinuedAfterHighRisk++;
  saveStats(stats);
}

export function trackUserViewedResources(): void {
  const stats = getDevStats();
  stats.userViewedResources++;
  saveStats(stats);
}

/** 開發者模式：透過 URL hash #dev 或 localStorage flag 進入 */
export function isDevMode(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.hash === "#dev") return true;
  try {
    return localStorage.getItem(`${PREFIX}dev_mode`) === "true";
  } catch {
    return false;
  }
}

export function toggleDevMode(): void {
  const current = isDevMode();
  localStorage.setItem(`${PREFIX}dev_mode`, String(!current));
}
