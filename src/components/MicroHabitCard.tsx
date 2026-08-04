"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { MicroHabit } from "@/lib/habits";
import { pickRandom } from "@/lib/habits";
import { saveHabitCompletion, getHabitCompletionsForDate } from "@/lib/db";

// 動態 Icon 對照表
import {
  Heart,
  Droplets,
  Armchair,
  BookOpen,
  Wind,
  Sun,
  PenLine,
  EyeOff,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Armchair,
  BookOpen,
  Heart,
  Wind,
  Sun,
  PenLine,
  EyeOff,
};

interface MicroHabitCardProps {
  habit: MicroHabit;
  /** 當日是否已完成 */
  initiallyCompleted?: boolean;
}

export default function MicroHabitCard({
  habit,
  initiallyCompleted = false,
}: MicroHabitCardProps) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [showMessage, setShowMessage] = useState(false);
  const [message] = useState(() => pickRandom(habit.completionMessages));

  // 取得對應的 Lucide 圖標
  const IconComponent = ICON_MAP[habit.icon] || Heart;

  // 檢查當日是否已完成（component mount 後驗證）
  useEffect(() => {
    const checkToday = async () => {
      const completions = await getHabitCompletionsForDate(new Date());
      const alreadyDone = completions.some((c) => c.habitId === habit.id);
      setCompleted(alreadyDone);
    };
    if (!initiallyCompleted) checkToday();
  }, [habit.id, initiallyCompleted]);

  const handleComplete = async () => {
    if (completed) return;
    await saveHabitCompletion(habit.id);
    setCompleted(true);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={completed ? {} : { scale: 0.97 }}
      onClick={handleComplete}
      disabled={completed}
      className={`
        w-full text-left p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden
        ${
          completed
            ? "border-oasis-sage/20 bg-oasis-sage/5 cursor-default"
            : "border-oasis-border/30 bg-oasis-surface/60 hover:border-oasis-sage/20 hover:bg-oasis-surface active:bg-oasis-surface2"
        }
      `}
    >
      {/* completed 微光暈 */}
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-oasis-sage/5 via-transparent to-oasis-sage/5"
        />
      )}

      <div className="relative z-10 flex items-start gap-3">
        {/* 圖標 */}
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500
            ${completed ? "bg-oasis-sage/15" : "bg-oasis-surface2"}
          `}
        >
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={18} className="text-oasis-sage" strokeWidth={2} />
            </motion.div>
          ) : (
            <IconComponent size={18} className="text-oasis-muted" strokeWidth={1.5} />
          )}
        </div>

        {/* 文字 */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium transition-colors duration-500 ${
              completed ? "text-oasis-sage/70" : "text-oasis-text"
            }`}
          >
            {habit.title}
          </h4>
          <p className="text-xs text-oasis-muted/60 mt-1 leading-relaxed">
            {habit.description}
          </p>
        </div>
      </div>

      {/* 完成訊息 */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative z-10 mt-3 pt-3 border-t border-oasis-sage/10 flex items-start gap-2">
              <Sparkles size={14} className="text-oasis-sage/60 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-oasis-sage/70 leading-relaxed italic">
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
