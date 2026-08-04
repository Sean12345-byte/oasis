"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  getEmotionCountByDate,
  getHabitCountByDate,
  getTodayKey,
} from "@/lib/db";
import { NO_PRESSURE_MESSAGES, pickRandom } from "@/lib/habits";

interface GrowthLevel {
  threshold: number;
  plant: string;
  description: string;
}

// ── 只增不減的視覺成長層級 ──
const GROWTH_LEVELS: GrowthLevel[] = [
  { threshold: 0,   plant: "🌱", description: "一顆種子，靜靜等待" },
  { threshold: 5,   plant: "🌿", description: "小小的嫩葉探出頭來" },
  { threshold: 15,  plant: "🪴", description: "穩穩地伸展枝葉" },
  { threshold: 30,  plant: "🌺", description: "開了一朵溫柔的花" },
  { threshold: 60,  plant: "🌼", description: "更多的花，靜靜綻放" },
  { threshold: 100, plant: "🌸", description: "這裡已經是一座小花園了" },
  { threshold: 180, plant: "🌳", description: "一棵溫柔的樹，靜靜守護" },
];

// ── 將數字轉換為質性描述，避免精確 KPI 感 ──
function describeTotal(count: number): string {
  if (count === 0) return "才剛開始";
  if (count < 5)  return "剛啟程";
  if (count < 15) return "慢慢累積中";
  if (count < 30) return "走了不少路了";
  if (count < 60) return "已經陪伴自己好一陣子了";
  if (count < 100) return "一段不短的路";
  return "很長很長的陪伴";
}

function describeToday(count: number): string {
  if (count === 0) return "今天靜靜的";
  if (count <= 2)  return "溫柔的幾步";
  if (count <= 5)  return "充實的節奏";
  return "豐富的一天";
}

interface SanctuaryGardenProps {
  noActivityToday?: boolean;
}

export default function SanctuaryGarden({ noActivityToday }: SanctuaryGardenProps) {
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [todayInteractions, setTodayInteractions] = useState(0);
  const [noPressureMessage] = useState(() => pickRandom(NO_PRESSURE_MESSAGES));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emotionCounts, habitCounts] = await Promise.all([
          getEmotionCountByDate(365),
          getHabitCountByDate(365),
        ]);

        let total = 0;
        for (const count of emotionCounts.values()) total += count;
        for (const count of habitCounts.values()) total += count;

        const today = getTodayKey();
        const todayEmotions = emotionCounts.get(today) || 0;
        const todayHabits = habitCounts.get(today) || 0;

        setTotalInteractions(total);
        setTodayInteractions(todayEmotions + todayHabits);
      } catch {
        // IndexedDB 尚未初始化也 OK
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentLevel = [...GROWTH_LEVELS]
    .reverse()
    .find((level) => totalInteractions >= level.threshold) || GROWTH_LEVELS[0];

  const nextLevel = GROWTH_LEVELS[GROWTH_LEVELS.indexOf(currentLevel) + 1] || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-oasis-muted/40 text-sm"
        >
          正在整理你的小花園...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── 中央視覺 ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center py-10"
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <span className="text-7xl select-none" role="img" aria-label={currentLevel.description}>
            {currentLevel.plant}
          </span>

          {todayInteractions > 0 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    opacity: [0, 0.7, 0],
                    scale: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={10} className="text-oasis-glow/40" />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-oasis-text/60 italic"
        >
          {currentLevel.description}
        </motion.p>
      </motion.div>

      {/* ── 統計卡片（質性描述，弱化數字）── */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <div className="text-sm text-oasis-warm/70 font-light">
            {describeTotal(totalInteractions)}
          </div>
          <div className="text-xs text-oasis-muted/40 mt-1">
            你已經陪伴自己
          </div>
          {/* 弱化數字 */}
          <div className="text-[10px] text-oasis-muted/20 mt-0.5 tabular-nums">
            {totalInteractions} 次
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 text-center"
        >
          <div className="text-sm text-oasis-sage/70 font-light">
            {describeToday(todayInteractions)}
          </div>
          <div className="text-xs text-oasis-muted/40 mt-1">
            今天的狀態
          </div>
          <div className="text-[10px] text-oasis-muted/20 mt-0.5 tabular-nums">
            {todayInteractions} 次互動
          </div>
        </motion.div>
      </div>

      {/* ── 下一階段（無壓力提示）── */}
      {nextLevel && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-oasis-muted/50">
              花園正慢慢生長
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-oasis-surface2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  100,
                  (totalInteractions / nextLevel.threshold) * 100
                )}%`,
              }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-oasis-sage/30 to-oasis-sage/50"
            />
          </div>
          <p className="text-xs text-oasis-muted/40 mt-2 italic">
            {nextLevel.plant} {nextLevel.description}
          </p>
        </motion.div>
      )}

      {/* ── 今日無互動 ── */}
      {noActivityToday && todayInteractions === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-4"
        >
          <p className="text-sm text-oasis-text/40 italic leading-relaxed">
            {noPressureMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
