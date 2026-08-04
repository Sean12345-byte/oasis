"use client";

import { motion } from "framer-motion";
import { Cloud, CloudDrizzle, CloudSun, Sun, Wind, CloudFog } from "lucide-react";

export type EmotionKey =
  | "glimmer"     // 微光
  | "cloudy"      // 陰天
  | "storm"       // 暴雨
  | "breeze"      // 微風
  | "stillness"   // 靜謐
  | "fog";        // 霧氣朦朧

export interface EmotionOption {
  key: EmotionKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string; // tailwind 文字色 class
  bgColor: string; // tailwind 背景色 class
}

export const EMOTIONS: EmotionOption[] = [
  {
    key: "glimmer",
    label: "微光",
    description: "心裡有小小的光亮",
    icon: <Sun size={28} strokeWidth={1.5} />,
    color: "text-oasis-glow",
    bgColor: "bg-oasis-glow/10",
  },
  {
    key: "cloudy",
    label: "陰天",
    description: "灰灰的，但還好",
    icon: <CloudSun size={28} strokeWidth={1.5} />,
    color: "text-oasis-slate",
    bgColor: "bg-oasis-slate/10",
  },
  {
    key: "storm",
    label: "暴雨",
    description: "情緒很滿，需要出口",
    icon: <CloudDrizzle size={28} strokeWidth={1.5} />,
    color: "text-oasis-slateDim",
    bgColor: "bg-oasis-slateDim/10",
  },
  {
    key: "breeze",
    label: "微風",
    description: "輕輕的，飄飄的",
    icon: <Wind size={28} strokeWidth={1.5} />,
    color: "text-oasis-sage",
    bgColor: "bg-oasis-sage/10",
  },
  {
    key: "stillness",
    label: "靜謐",
    description: "想安靜的待著",
    icon: <Cloud size={28} strokeWidth={1.5} />,
    color: "text-oasis-bloom",
    bgColor: "bg-oasis-bloom/10",
  },
  {
    key: "fog",
    label: "霧氣朦朧",
    description: "說不清楚也沒關係",
    icon: <CloudFog size={28} strokeWidth={1.5} />,
    color: "text-oasis-muted",
    bgColor: "bg-oasis-muted/10",
  },
];

interface EmotionPickerProps {
  selected: EmotionKey | null;
  onSelect: (key: EmotionKey) => void;
}

export default function EmotionPicker({ selected, onSelect }: EmotionPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {EMOTIONS.map((emotion, i) => (
        <motion.button
          key={emotion.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          onClick={() => onSelect(emotion.key)}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300
            ${
              selected === emotion.key
                ? `${emotion.bgColor} border-current ${emotion.color}`
                : "border-oasis-border/40 text-oasis-muted hover:border-oasis-border hover:text-oasis-text/70"
            }
          `}
        >
          <div className={selected === emotion.key ? emotion.color : "text-oasis-muted"}>
            {emotion.icon}
          </div>
          <span className="text-sm font-medium">{emotion.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
