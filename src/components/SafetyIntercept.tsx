"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ChevronRight } from "lucide-react";
import { checkSafety, HELP_RESOURCES } from "@/lib/safety";

interface SafetyInterceptProps {
  text: string;
  /** 使用者選擇「我需要協助」 */
  onNeedHelp: () => void;
  /** 使用者選擇「我只是想抒發，繼續」 */
  onContinue: () => void;
  /** 關閉整個提示 */
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

  if (!result.isHighRisk && result.riskLevel !== "high") {
    return null;
  }

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

        <p className="text-xs text-oasis-muted/60 leading-relaxed">
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="glass-card p-6 space-y-5 text-center border-oasis-warm/20"
      >
        {/* 關閉按鈕 */}
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
            我們注意到了一些訊息
          </h3>
          <p className="text-sm text-oasis-text/70 leading-relaxed max-w-xs mx-auto">
            你寫下的文字中，似乎承載著不容易的感受。這些都是真實的，你不需要獨自承擔。
            如果有需要，這裡有一些願意聆聽的人。
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
            <span>我需要協助</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-xl text-sm text-oasis-muted hover:text-oasis-text 
                       border border-oasis-border/30 hover:border-oasis-border/60 
                       transition-all duration-300"
          >
            我只是想抒發，請繼續
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
