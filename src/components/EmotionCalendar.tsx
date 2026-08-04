"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEmotionCountByDate, getEmotionHistory, type EmotionRecord } from "@/lib/db";

// 情緒對應的柔和色塊（莫蘭迪色系）
const EMOTION_COLORS: Record<string, string> = {
  "微光": "#C9B99A",     // warm glow
  "陰天": "#8A9BAE",     // slate
  "暴雨": "#5D6D7E",     // deep slate
  "微風": "#9BAF9E",     // sage
  "靜謐": "#B8A9C9",     // bloom
  "霧氣朦朧": "#5E6A75", // muted
};

function getColor(emotionLabel: string): string {
  return EMOTION_COLORS[emotionLabel] || "#3A4048";
}

// 為過去 N 天產生日期陣列
function getPastDays(days: number): string[] {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    result.push(key);
  }
  return result;
}

export default function EmotionCalendar() {
  const [dayColors, setDayColors] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const days = getPastDays(30);
        const emotionCounts = await getEmotionCountByDate(30);

        // 取得每個日期的情緒記錄（取第一筆的情緒標籤來決定顏色）
        const history = await getEmotionHistory(30);

        // 建立 dateKey → 情緒標籤的對照
        const dateToEmotion = new Map<string, string>();
        for (const record of history) {
          if (!dateToEmotion.has(record.dateKey)) {
            dateToEmotion.set(record.dateKey, record.emotion);
          }
        }

        const colors = days.map((day) => {
          const emotion = dateToEmotion.get(day);
          return emotion ? getColor(emotion) : null;
        });

        setDayColors(colors);
      } catch {
        // DB 未初始化
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-oasis-muted/30 text-xs"
        >
          整理天氣中...
        </motion.div>
      </div>
    );
  }

  // 若完全無資料，顯示溫和提示
  const hasData = dayColors.some((c) => c !== null);
  if (!hasData) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-oasis-muted/40 italic">
          還沒有任何天氣紀錄。每一次的抒發，都會在這裡留下一抹顏色。
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <h3 className="text-sm text-oasis-text/50 font-light">
        這段時間，你經歷的天氣
      </h3>

      {/* 色塊月曆網格：7 列 x 5 行（35 格，顯示最近 30 天） */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* 前 5 格空白（30 天對齊當週） */}
        {[...Array(new Date().getDay() || 7)].map((_, i) => (
          <div key={`pad-start-${i}`} className="aspect-square" />
        ))}
        {dayColors.map((color, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
            className="aspect-square rounded-md"
            style={{
              backgroundColor: color || "transparent",
              border: color ? "none" : "1px solid rgba(42, 48, 56, 0.3)",
              opacity: color ? 0.75 : 0.15,
            }}
            title={color ? "有紀錄的一天" : "尚未記錄"}
          />
        ))}
      </div>

      {/* 圖例 */}
      <div className="flex flex-wrap gap-2 pt-1">
        {Object.entries(EMOTION_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: color, opacity: 0.75 }}
            />
            <span className="text-[10px] text-oasis-muted/40">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-oasis-muted/25 italic text-center pt-1">
        每個色塊代表一天的情緒。沒有連續天數的計算，只有你走過的路。
      </p>
    </motion.div>
  );
}
