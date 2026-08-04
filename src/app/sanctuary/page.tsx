"use client";

import { motion } from "framer-motion";
import SanctuaryGarden from "@/components/SanctuaryGarden";

export default function SanctuaryPage() {
  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto">
      {/* 頁首 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-light text-oasis-warm tracking-wide">
          平靜小天地
        </h1>
        <p className="text-sm text-oasis-muted/60 mt-1.5 leading-relaxed">
          每一次溫柔的自我照顧，都在這裡悄悄生長。
        </p>
      </motion.div>

      <SanctuaryGarden />
    </div>
  );
}
