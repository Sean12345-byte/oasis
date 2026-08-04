"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MicroHabitCard from "@/components/MicroHabitCard";
import { DEFAULT_HABITS, NO_PRESSURE_MESSAGES, pickRandom } from "@/lib/habits";
import { getHabitCompletionsForDate } from "@/lib/db";
import { Sparkles } from "lucide-react";

export default function HabitsPage() {
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
  const [showMessage, setShowMessage] = useState(false);
  const [noPressureMessage] = useState(() => pickRandom(NO_PRESSURE_MESSAGES));
  const [loading, setLoading] = useState(true);

  // 載入今日完成狀態
  useEffect(() => {
    const load = async () => {
      try {
        const completions = await getHabitCompletionsForDate(new Date());
        setCompletedHabits(new Set(completions.map((c) => c.habitId)));
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleHabitComplete = (habitId: string) => {
    setCompletedHabits((prev) => new Set([...prev, habitId]));
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-oasis-muted/40 text-sm"
        >
          正在準備今天的陪伴...
        </motion.div>
      </div>
    );
  }

  const allDone = DEFAULT_HABITS.every((h) => completedHabits.has(h.id));
  const anyDone = completedHabits.size > 0;
  const noActivity = completedHabits.size === 0;

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto">
      {/* 頁首 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-light text-oasis-warm tracking-wide">
          微習慣
        </h1>
        <p className="text-sm text-oasis-muted/60 mt-1.5 leading-relaxed">
          小到不可能失敗。完成一件事，就是對自己的一份溫柔。
        </p>
      </motion.div>

      {/* ── 今日進度摘要 ── */}
      {anyDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-oasis-sage/60" />
              <span className="text-sm text-oasis-text/70">
                {allDone
                  ? "今天的每一件事都完成了。這樣就很好了。"
                  : `今天完成了 ${completedHabits.size} 件小事`}
              </span>
            </div>
            <span className="text-xs text-oasis-muted/40">
              {completedHabits.size}/{DEFAULT_HABITS.length}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── 習慣清單 ── */}
      <div className="space-y-3">
        <AnimatePresence>
          {DEFAULT_HABITS.map((habit) => (
            <MicroHabitCard
              key={habit.id}
              habit={habit}
              initiallyCompleted={completedHabits.has(habit.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── 今日無活動：反罪惡感訊息 ── */}
      {noActivity && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-10"
        >
          <p className="text-sm text-oasis-text/40 italic leading-relaxed max-w-xs mx-auto">
            {noPressureMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
