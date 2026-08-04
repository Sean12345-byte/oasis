// ── 資料層：IndexedDB（透過 idb 封裝） ──
// 負責：情緒紀錄、微習慣完成歷史等結構化、可能隨時間增長的資料

import { openDB, DBSchema, IDBPDatabase } from "idb";

// ── Schema 定義 ──
export interface EmotionRecord {
  id?: number;            // auto-increment
  /** 情緒標籤（如 "微光"、"陰天"、"暴雨"、"微風"、"靜謐"、"霧氣朦朧"） */
  emotion: string;
  /** 時間戳 (ISO 8601) */
  timestamp: string;
  /** 當日日期 key (YYYY-MM-DD)，用於儀表板查詢 */
  dateKey: string;
}

export interface HabitCompletion {
  id?: number;
  /** 對應 DEFAULT_HABITS 中的 id */
  habitId: string;
  /** 完成時間戳 */
  timestamp: string;
  /** 當日日期 key */
  dateKey: string;
}

// ── DB Schema ──
interface OasisDB extends DBSchema {
  emotions: {
    key: number;
    value: EmotionRecord;
    indexes: {
      "by-date": string;
      "by-emotion": string;
    };
  };
  habits: {
    key: number;
    value: HabitCompletion;
    indexes: {
      "by-date": string;
      "by-habit": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<OasisDB>> | null = null;

function getDB(): Promise<IDBPDatabase<OasisDB>> {
  if (!dbPromise) {
    dbPromise = openDB<OasisDB>("oasis-db", 1, {
      upgrade(db) {
        // emotions store
        const emotionStore = db.createObjectStore("emotions", {
          keyPath: "id",
          autoIncrement: true,
        });
        emotionStore.createIndex("by-date", "dateKey");
        emotionStore.createIndex("by-emotion", "emotion");

        // habits store
        const habitStore = db.createObjectStore("habits", {
          keyPath: "id",
          autoIncrement: true,
        });
        habitStore.createIndex("by-date", "dateKey");
        habitStore.createIndex("by-habit", "habitId");
      },
    });
  }
  return dbPromise;
}

// ── Emotion CRUD ──

export async function saveEmotionRecord(emotion: string): Promise<number> {
  const db = await getDB();
  const now = new Date();
  const record: EmotionRecord = {
    emotion,
    timestamp: now.toISOString(),
    dateKey: toDateKey(now),
  };
  return db.add("emotions", record);
}

export async function getEmotionHistory(
  days: number = 30
): Promise<EmotionRecord[]> {
  const db = await getDB();
  const all = await db.getAll("emotions");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = toDateKey(cutoff);
  return all
    .filter((r) => r.dateKey >= cutoffKey)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function getEmotionCountByDate(
  days: number = 180
): Promise<Map<string, number>> {
  const db = await getDB();
  const all = await db.getAll("emotions");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = toDateKey(cutoff);
  const map = new Map<string, number>();
  for (const r of all) {
    if (r.dateKey >= cutoffKey) {
      map.set(r.dateKey, (map.get(r.dateKey) || 0) + 1);
    }
  }
  return map;
}

// ── Habit CRUD ──

export async function saveHabitCompletion(habitId: string): Promise<number> {
  const db = await getDB();
  const now = new Date();
  const record: HabitCompletion = {
    habitId,
    timestamp: now.toISOString(),
    dateKey: toDateKey(now),
  };
  return db.add("habits", record);
}

export async function getHabitCompletionsForDate(
  date: Date
): Promise<HabitCompletion[]> {
  const db = await getDB();
  const dateKey = toDateKey(date);
  return db.getAllFromIndex("habits", "by-date", dateKey);
}

export async function getHabitCompletionsByDateRange(
  days: number = 180
): Promise<Map<string, HabitCompletion[]>> {
  const db = await getDB();
  const all = await db.getAll("habits");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = toDateKey(cutoff);
  const map = new Map<string, HabitCompletion[]>();
  for (const h of all) {
    if (h.dateKey >= cutoffKey) {
      const existing = map.get(h.dateKey) || [];
      existing.push(h);
      map.set(h.dateKey, existing);
    }
  }
  return map;
}

// ── 儀表板用：取得某日的完成習慣數 ──
export async function getHabitCountByDate(
  days: number = 180
): Promise<Map<string, number>> {
  const byDate = await getHabitCompletionsByDateRange(days);
  const map = new Map<string, number>();
  for (const [dateKey, completions] of byDate) {
    // 去重：同一習慣 ID 當天只算一次
    const uniqueHabits = new Set(completions.map((c) => c.habitId));
    map.set(dateKey, uniqueHabits.size);
  }
  return map;
}

// ── 工具 ──
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayKey(): string {
  return toDateKey(new Date());
}
