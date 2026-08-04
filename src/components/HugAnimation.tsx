"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HugAnimationProps {
  /** 使用者的文字（用於消散動畫） */
  text: string;
  /** 動畫階段 */
  phase: "idle" | "dissipating" | "complete";
  /** 完成後的回呼 */
  onComplete?: () => void;
}

// 將文字轉為逐字的 particles
function tokenize(text: string): string[] {
  // 保留中文字、英文字、標點——每個字符獨立
  return Array.from(text);
}

export default function HugAnimation({
  text,
  phase,
  onComplete,
}: HugAnimationProps) {
  const chars = tokenize(text);

  if (phase === "idle") return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[320px] overflow-hidden">
      {/* ── 擁抱核心 ── */}
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
        {/* 雙重愛心 — 代表擁抱 */}
        <div className="relative w-32 h-32">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={
              phase === "complete"
                ? { scale: 1 }
                : { scale: [1, 1.08, 1] }
            }
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Heart
              size={80}
              className="text-oasis-bloom/40"
              fill="rgba(184,169,201,0.15)"
              strokeWidth={1.5}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={
              phase === "complete"
                ? { scale: 0.85 }
                : { scale: [0.85, 0.92, 0.85] }
            }
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          >
            <Heart
              size={60}
              className="text-oasis-sage/50"
              fill="rgba(155,175,158,0.2)"
              strokeWidth={1.5}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={
              phase === "complete"
                ? { scale: 0.65 }
                : { scale: [0.65, 0.7, 0.65] }
            }
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.6 }}
          >
            <Heart
              size={42}
              className="text-oasis-warm/60"
              fill="rgba(212,197,185,0.25)"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── 文字消散粒子 ── */}
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
                      filter: [
                        "blur(0px)",
                        "blur(2px)",
                        "blur(6px)",
                      ],
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

      {/* ── 柔和光暈粒子 ── */}
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
