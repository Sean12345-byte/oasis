"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ChevronRight, MessageCircle } from "lucide-react";
import { checkSafety, HELP_RESOURCES } from "@/lib/safety";

interface SafetyInterceptProps {
  text: string;
  onNeedHelp: () => void;
  onContinue: () => void;
  onDismiss?: () => void;
}

export default function SafetyIntercept({
  text,
  onNeedHelp,
  onContinue,
  onDismiss,
}: SafetyInterceptProps) {
  const [showResources, setShowResources] = useState(false);
  const result = checkSafety(text);

  // 僅在高風險時顯示完整攔截
  if (!result.isHighRisk && result.riskLevel !== "high") {
    return null;
  }

  // ── 求助資源展開畫面 ──
  if (showResources) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 space-y-5 text-center"
      >
        <h3 className="text-lg font-medium text-oasis-warm">
          {HELP_RESOURCES.title}
        </h3>
        <p className="text-sm text-oasis-text/70 leading-relaxed">
          {HELP_RESOURCES.message}
        </p>

        {/* 電話專線 */}
        <div className="space-y-3">
          {HELP_RESOURCES.hotlines.map((hotline) => (
            <a
              key={hotline.number}
              href={`tel:${hotline.number}`}
              className="flex items-center justify-between p-3 rounded-xl bg-oasis-surface2 border border-oasis-border/30 hover:border-oasis-sage/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-oasis-sage" />
                <div className="text-left">
                  <div className="text-sm font-medium text-oasis-text">
                    {hotline.name}
                  </div>
                  <div className="text-xs text-oasis-muted">
                    {hotline.description}
                  </div>
                </div>
              </div>
              <span className="text-lg font-medium text-oasis-warm tabular-nums">
                {hotline.number}
              </span>
            </a>
          ))}
        </div>

        {/* 文字管道提示 */}
        {HELP_RESOURCES.textResources.map((res, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-oasis-sage/5 border border-oasis-sage/10 text-left"
          >
            <MessageCircle size={18} className="text-oasis-sage/60 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-oasis-text">
                {res.name}
              </div>
              <p className="text-xs text-oasis-muted/60 mt-1 leading-relaxed">
                {res.description}
              </p>
            </div>
          </div>
        ))}

        <p className="text-xs text-oasis-muted/40 leading-relaxed">
          {HELP_RESOURCES.disclaimer}
        </p>

        <button
          onClick={() => setShowResources(false)}
          className="text-sm text-oasis-muted hover:text-oasis-text transition-colors"
        >
          返回
        </button>
      </motion.div>
    );
  }

  // ── 高風險攔截主畫面 ──
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="glass-card p-6 space-y-5 text-center border-oasis-warm/20 relative"
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 text-oasis-muted/50 hover:text-oasis-text transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="text-4xl">🫂</div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-oasis-warm">
            有些感受被看見了
          </h3>
          <p className="text-sm text-oasis-text/70 leading-relaxed max-w-xs mx-auto">
            你寫下的文字中，似乎承載著不容易的感受。這些都是真實的，
            你不需要獨自承擔。如果有需要，這裡有一些願意聆聽的人。
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              onNeedHelp();
              setShowResources(true);
            }}
            className="btn-warm flex items-center justify-center gap-2"
          >
            <Phone size={16} />
            <span>看看可以找誰聊聊</span>
            <ChevronRight size={14} />
          </button>

          {/* 語氣修正：非質疑、非評判，純粹尊重選擇 */}
          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-xl text-sm text-oasis-muted/60 hover:text-oasis-text/70
                       border border-oasis-border/20 hover:border-oasis-border/40
                       transition-all duration-300"
          >
            謝謝你的關心，我現在只想抒發
          </button>
        </div>

        {/* 極小字說明 */}
        <p className="text-[10px] text-oasis-muted/25 leading-relaxed">
          你的選擇不會被記錄或標記。可以隨時回來。
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// ── 中度風險輕提示（不阻擋動畫，僅一行溫和文字）──
export function MediumRiskBanner({ text }: { text: string }) {
  const result = checkSafety(text);

  if (result.riskLevel !== "medium") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-2"
    >
      <p className="text-xs text-oasis-warm/50 italic leading-relaxed">
        有些感受說出來不容易。謝謝你願意寫下這些。
      </p>
    </motion.div>
  );
}
