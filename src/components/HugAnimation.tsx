"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Waves } from "lucide-react";
import type { AnimationStyle } from "@/lib/storage";

interface HugAnimationProps {
  text: string;
  phase: "idle" | "dissipating" | "complete";
  onComplete?: () => void;
  /** 視覺風格：hearts（愛心）| glow（光暈）| ripple（波紋） */
  style?: AnimationStyle;
}

function tokenize(text: string): string[] {
  return Array.from(text);
}

// ── 三種視覺風格的核心圖示 ──
function CoreVisual({
  style,
  phase,
}: {
  style: AnimationStyle;
  phase: string;
}) {
  if (style === "ripple") {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        {[80, 60, 42].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-oasis-sage/20"
            style={{ width: size, height: size }}
            animate={
              phase === "complete"
                ? { scale: 1, opacity: 0.4 }
                : { scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }
            }
            transition={{
              repeat: Infinity,
              duration: 2.5 + i * 0.5,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
        <Waves size={32} className="text-oasis-sage/40" strokeWidth={1} />
      </div>
    );
  }

  if (style === "glow") {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-oasis-glow/10"
          animate={
            phase === "complete"
              ? { scale: 1, opacity: 0.6 }
              : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }
          }
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-oasis-sage/10"
          animate={
            phase === "complete"
              ? { scale: 0.85, opacity: 0.5 }
              : { scale: [0.85, 1.1, 0.85], opacity: [0.3, 0.6, 0.3] }
          }
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
        <Sparkles size={32} className="text-oasis-glow/50" strokeWidth={1} />
      </div>
    );
  }

  // default: hearts
  return (
    <div className="relative w-32 h-32">
      {[
        { size: 80, color: "text-oasis-bloom/40", fill: "rgba(184,169,201,0.15)", delay: 0 },
        { size: 60, color: "text-oasis-sage/50", fill: "rgba(155,175,158,0.2)", delay: 0.3 },
        { size: 42, color: "text-oasis-warm/60", fill: "rgba(212,197,185,0.25)", delay: 0.6 },
      ].map((h, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          animate={
            phase === "complete"
              ? { scale: 1 - i * 0.15 }
              : { scale: [1 - i * 0.15, 1.08 - i * 0.08, 1 - i * 0.15] }
          }
          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.5,
            ease: "easeInOut",
            delay: h.delay,
          }}
        >
          <Heart
            size={h.size}
            className={h.color}
            fill={h.fill}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function HugAnimation({
  text,
  phase,
  onComplete,
  style = "hearts",
}: HugAnimationProps) {
  const chars = tokenize(text);

  if (phase === "idle") return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[320px] overflow-hidden">
      {/* 核心視覺 */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          phase === "complete"
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: [0.6, 1.1, 1] }
        }
        transition={{ duration: phase === "complete" ? 0.6 : 1.2, ease: "easeOut" }}
      >
        <CoreVisual style={style} phase={phase} />
      </motion.div>

      {/* 文字消散粒子 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-md flex flex-wrap justify-center gap-1 px-6">
          {chars.map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className="text-oasis-text/50 text-sm"
              initial={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
              animate={
                phase === "dissipating"
                  ? {
                      opacity: [0.6, 0.3, 0],
                      y: [0, -20 - Math.random() * 40, -60 - Math.random() * 40],
                      x: [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
                      filter: ["blur(0px)", "blur(2px)", "blur(6px)"],
                      scale: [1, 1.02, 0.9],
                    }
                  : {}
              }
              transition={{
                duration: 2.5 + Math.random() * 1,
                delay: i * 0.03,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              onAnimationComplete={
                i === chars.length - 1 ? onComplete : undefined
              }
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 柔和光暈粒子（所有風格共用） */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-oasis-sage/20"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${40 + Math.random() * 20}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            phase === "dissipating"
              ? {
                  opacity: [0, 0.4, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -30 - Math.random() * 50],
                  x: [0, (Math.random() - 0.5) * 60],
                }
              : {}
          }
          transition={{
            duration: 3,
            delay: 0.5 + i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
