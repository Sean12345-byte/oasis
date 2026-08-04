"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Eye, EyeOff, Info, Palette } from "lucide-react";
import EmotionPicker, { type EmotionKey, EMOTIONS } from "@/components/EmotionPicker";
import HugAnimation from "@/components/HugAnimation";
import SafetyIntercept, { MediumRiskBanner } from "@/components/SafetyIntercept";
import { checkSafety } from "@/lib/safety";
import { saveEmotionRecord } from "@/lib/db";
import { getPrefs, setPrefs, type AnimationStyle } from "@/lib/storage";

// 溫柔鼓勵語
const GENTLE_AFFIRMATIONS = [
  "你願意把這些寫下來，本身就需要很大的勇氣。",
  "這些情緒是真實的，它們值得被看見，你也值得。",
  "放下，不是忘記。是讓它們不再壓著你。",
  "謝謝你，今天也好好陪伴自己了。",
  "文字消散了，但你對自己的溫柔，留了下來。",
  "沒有什麼需要「解決」。此刻，能呼吸就好。",
  "霧會散的。不急，慢慢來。",
];

// 動畫風格選項
const ANIMATION_OPTIONS: { key: AnimationStyle; label: string; emoji: string }[] = [
  { key: "hearts",  label: "擁抱", emoji: "💚" },
  { key: "glow",    label: "光暈", emoji: "✨" },
  { key: "ripple",  label: "波紋", emoji: "🌊" },
];

type Phase = "select" | "write" | "safety-check" | "animating" | "done";

export default function CheckInPage() {
  const [emotion, setEmotion] = useState<EmotionKey | null>(null);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("select");
  const [affirmation] = useState(
    () => GENTLE_AFFIRMATIONS[Math.floor(Math.random() * GENTLE_AFFIRMATIONS.length)]
  );
  const [trackingEnabled, setTrackingEnabled] = useState(
    () => getPrefs().trendTracking
  );
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>(
    () => getPrefs().animationStyle
  );
  const [showStylePicker, setShowStylePicker] = useState(false);

  const selectedEmotion = EMOTIONS.find((e) => e.key === emotion);
  const safetyResult = checkSafety(text);

  const handleRelease = useCallback(async () => {
    const sResult = checkSafety(text);
    if (sResult.isHighRisk) {
      setPhase("safety-check");
      return;
    }

    if (trackingEnabled && emotion) {
      try {
        await saveEmotionRecord(selectedEmotion?.label || emotion);
      } catch {}
    }

    setPhase("animating");
  }, [text, emotion, trackingEnabled, selectedEmotion]);

  const handleAnimationComplete = useCallback(() => {
    setPhase("done");
  }, []);

  const handleReset = () => {
    setEmotion(null);
    setText("");
    setPhase("select");
  };

  const handleStyleChange = (style: AnimationStyle) => {
    setAnimationStyle(style);
    setPrefs({ animationStyle: style });
    setShowStylePicker(false);
  };

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto">
      {/* 頁首 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-light text-oasis-warm tracking-wide">
          情緒避風港
        </h1>
        <p className="text-sm text-oasis-muted/60 mt-1.5 leading-relaxed">
          這裡沒有對錯，沒有建議，只有聆聽。
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Phase 1: 選擇情緒 ── */}
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <p className="text-sm text-oasis-text/60">
              今天的心情，像哪一種天氣？
            </p>
            <EmotionPicker selected={emotion} onSelect={setEmotion} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: emotion ? 1 : 0.3 }}
              disabled={!emotion}
              onClick={() => setPhase("write")}
              className="w-full btn-gentle mt-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              繼續
            </motion.button>
          </motion.div>
        )}

        {/* ── Phase 2: 傾倒樹洞 ── */}
        {phase === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            {selectedEmotion && (
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${selectedEmotion.bgColor} border border-oasis-border/20`}
              >
                <span className={selectedEmotion.color}>{selectedEmotion.icon}</span>
                <div>
                  <div className={`text-sm font-medium ${selectedEmotion.color}`}>
                    {selectedEmotion.label}
                  </div>
                  <div className="text-xs text-oasis-muted/50">
                    {selectedEmotion.description}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-oasis-muted/60">
                把想說的，都寫在這裡。這些文字不會被儲存，只會消散。
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今天有什麼壓在心上？寫什麼都可以..."
                rows={6}
                maxLength={2000}
                className="w-full bg-oasis-surface2 border border-oasis-border/30 rounded-2xl p-4 
                           text-oasis-text text-sm placeholder:text-oasis-muted/30
                           resize-none focus:outline-none focus:border-oasis-sage/30 
                           transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-oasis-muted/30">
                  {text.length} / 2000
                </span>
                <div className="flex items-center gap-3">
                  {/* 動畫風格選擇 */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStylePicker(!showStylePicker)}
                      className="flex items-center gap-1 text-xs text-oasis-muted/40 hover:text-oasis-muted/60 transition-colors"
                    >
                      <Palette size={13} />
                    </button>
                    <AnimatePresence>
                      {showStylePicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute bottom-full right-0 mb-2 glass-card p-2 rounded-xl flex gap-1 z-20"
                        >
                          {ANIMATION_OPTIONS.map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => handleStyleChange(opt.key)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all
                                ${animationStyle === opt.key
                                  ? "bg-oasis-sage/15 text-oasis-sage"
                                  : "text-oasis-muted/50 hover:bg-oasis-surface2"}
                              `}
                            >
                              {opt.emoji} {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 趨勢追蹤開關 */}
                  <button
                    onClick={() => {
                      const newVal = !trackingEnabled;
                      setTrackingEnabled(newVal);
                      setPrefs({ trendTracking: newVal });
                    }}
                    className="flex items-center gap-1.5 text-xs text-oasis-muted/40 hover:text-oasis-muted/60 transition-colors"
                  >
                    {trackingEnabled ? (
                      <Eye size={13} />
                    ) : (
                      <EyeOff size={13} />
                    )}
                    匿名趨勢{trackingEnabled ? "開" : "關"}
                  </button>
                </div>
              </div>
            </div>

            {/* 中風險輕提示（不阻擋動畫） */}
            <MediumRiskBanner text={text} />

            <button
              onClick={handleRelease}
              disabled={!text.trim()}
              className="w-full btn-warm flex items-center justify-center gap-2 
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>釋放</span>
            </button>

            <p className="text-center text-[11px] text-oasis-muted/30 flex items-center justify-center gap-1">
              <Info size={11} />
              你的文字不會離開這台裝置
            </p>
          </motion.div>
        )}

        {/* ── Phase 3: 安全攔截 ── */}
        {phase === "safety-check" && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4"
          >
            <SafetyIntercept
              text={text}
              onNeedHelp={() => {}}
              onContinue={async () => {
                if (trackingEnabled && emotion) {
                  try {
                    await saveEmotionRecord(selectedEmotion?.label || emotion);
                  } catch {}
                }
                setPhase("animating");
              }}
              onDismiss={() => setPhase("write")}
            />
          </motion.div>
        )}

        {/* ── Phase 4: 消散動畫 ── */}
        {phase === "animating" && (
          <motion.div
            key="animating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-8"
          >
            <HugAnimation
              text={text}
              phase="dissipating"
              style={animationStyle}
              onComplete={handleAnimationComplete}
            />
          </motion.div>
        )}

        {/* ── Phase 5: 完成 ── */}
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center pt-8 space-y-8"
          >
            <HugAnimation
              text={text}
              phase="complete"
              style={animationStyle}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-oasis-warm/80 italic leading-relaxed max-w-xs text-sm">
                {affirmation}
              </p>

              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-xl text-sm text-oasis-muted 
                           border border-oasis-border/40 hover:border-oasis-border 
                           hover:text-oasis-text transition-all duration-300"
              >
                再寫一些
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
