"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flower2, Sparkles, Circle } from "lucide-react";
import {
  getEmotionCountByDate,
  getHabitCountByDate,
  getTodayKey,
} from "@/lib/db";
import { NO_PRESSURE_MESSAGES, pickRandom } from "@/lib/habits";

interface GrowthLevel {
  threshold: number;
  plant: string;       // emoji
  description: string;
}

// ── 只增不減的視覺成長層級 ──
const GROWTH_LEVELS: GrowthLevel[] = [
  { threshold: 0,  plant: "🌱", description: "一顆種子，靜靜等待" },
  { threshold: 5,  plant: "🌿", description: "小小的嫩葉探出頭來" },
  { threshold: 15, plant: "🪴", description: "穩穩地伸展枝葉" },
  { threshold: 30, plant: "🌺", description: "開了一朵溫柔的花" },
  { threshold: 60, plant: "🌼", description: "更多的花，靜靜綻放" },
  { threshold: 100,plant: "🌸", description: "這裡已經是一座小花園了" },
  { threshold: 180,plant: "🌳", description: "一棵溫柔的樹，靜靜守護" },
];

interface SanctuaryGardenProps {
  /** 如果今天沒有任何互動，傳入 true */
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

        // 計算總互動次數（情緒釋放 + 習慣完成）
        let total = 0;
        for (const count of emotionCounts.values()) total += count;
        for (const count of habitCounts.values()) total += count;

        // 今日互動
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

  // 找到當前成長層級
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
        {/* 植物 */}
        <motion.div
          className="relative"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <span className="text-7xl select-none" role="img" aria-label={currentLevel.description}>
            {currentLevel.plant}
          </span>

          {/* 微光粒子（當今天有互動時） */}
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

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-oasis-text/60 italic"
        >
          {currentLevel.description}
        </motion.p>
      </motion.div>

      {/* ── 統計卡片 ── */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <div className="text-2xl font-light text-oasis-warm tabular-nums">
            {totalInteractions}
          </div>
          <div className="text-xs text-oasis-muted/60 mt-1">
            累積的溫柔時刻
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 text-center"
        >
          <div className="text-2xl font-light text-oasis-sage tabular-nums">
            {todayInteractions}
          </div>
          <div className="text-xs text-oasis-muted/60 mt-1">
            今天的互動
          </div>
        </motion.div>
      </div>

      {/* ── 進度線（只顯示正向） ── */}
      {nextLevel && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-oasis-muted/60">
              距離下一階段
            </span>
            <span className="text-xs text-oasis-sage/60">
              {totalInteractions} / {nextLevel.threshold}
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
              className="h-full rounded-full bg-gradient-to-r from-oasis-sage/40 to-oasis-sage/60"
            />
          </div>
          <p className="text-xs text-oasis-muted/50 mt-2 italic">
            {nextLevel.plant} {nextLevel.description}
          </p>
        </motion.div>
      )}

      {/* ── 今日無互動：溫柔訊息 ── */}
      {noActivityToday && todayInteractions === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-4"
        >
          <p className="text-sm text-oasis-text/50 italic leading-relaxed">
            {noPressureMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
