"use client";

import { motion } from "framer-motion";
import SanctuaryGarden from "@/components/SanctuaryGarden";
import EmotionCalendar from "@/components/EmotionCalendar";

export default function SanctuaryPage() {
  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-light text-oasis-warm tracking-wide">
          平靜小天地
        </h1>
        <p className="text-sm text-oasis-muted/60 mt-1.5 leading-relaxed">
          每一次溫柔的自我照顧，都在這裡悄悄生長。
        </p>
      </motion.div>

      <SanctuaryGarden />

      {/* 情緒天氣月曆 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <EmotionCalendar />
      </motion.div>
    </div>
  );
}
