"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Check } from "lucide-react";
import {
  submitMessage,
  getPendingMessages,
  reviewMessage,
} from "@/lib/messages";

const SUBMISSION_PROMPTS = [
  "曾經有哪句話，在你低潮時溫暖過你？寫下來，或許也能陪伴另一個人。",
  "不一定要多有智慧，只要是你覺得「那時候聽到這句話真好」的，都可以。",
  "匿名分享一句曾經幫助過你的話。沒有名字、沒有評價，只有傳遞。",
];

export default function MessageLibrary() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [prompt] = useState(
    () => SUBMISSION_PROMPTS[Math.floor(Math.random() * SUBMISSION_PROMPTS.length)]
  );

  const handleSubmit = () => {
    if (!input.trim()) return;
    submitMessage(input.trim());
    setInput("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* 標題區 */}
      <div className="flex items-start gap-2">
        <MessageSquare size={18} className="text-oasis-sage/50 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-oasis-text/70">
            陪伴語句庫
          </h3>
          <p className="text-xs text-oasis-muted/50 mt-1 leading-relaxed">
            {prompt}
          </p>
        </div>
      </div>

      {/* 投稿區 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="寫下那句話..."
          maxLength={120}
          className="flex-1 bg-oasis-surface2 border border-oasis-border/30 rounded-xl px-3 py-2.5
                     text-sm text-oasis-text placeholder:text-oasis-muted/30
                     focus:outline-none focus:border-oasis-sage/30 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="px-3 py-2.5 rounded-xl bg-oasis-sage/10 text-oasis-sage/60
                     border border-oasis-sage/20 hover:bg-oasis-sage/20
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Send size={16} />
        </button>
      </div>

      {/* 投稿確認 */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-oasis-sage/60"
          >
            <Check size={12} />
            <span>收到了。謝謝你願意分享這份溫暖。</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 審核後狀態提示 */}
      <p className="text-[10px] text-oasis-muted/25 leading-relaxed">
        投稿後會先標記為待審核，由開發者確認後才會出現在其他人的鼓勵語句中。
        你的身份完全匿名，不會被顯示。
      </p>
    </div>
  );
}

// ── 開發者審核面板 ──
export function MessageReviewPanel() {
  const pending = getPendingMessages();

  if (pending.length === 0) {
    return (
      <p className="text-xs text-oasis-muted/40 italic py-2">
        目前沒有待審核的投稿
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-oasis-muted/50">
        待審核投稿 ({pending.length})
      </h4>
      {pending.map((msg) => (
        <div
          key={msg.id}
          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-oasis-surface2 border border-oasis-border/20"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-oasis-text/60 truncate">{msg.text}</p>
            <p className="text-[10px] text-oasis-muted/30 mt-0.5">
              {new Date(msg.submittedAt).toLocaleDateString("zh-TW")}
            </p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => reviewMessage(msg.id, true)}
              className="px-2 py-1 rounded text-[10px] bg-oasis-sage/15 text-oasis-sage hover:bg-oasis-sage/25 transition-colors"
            >
              通過
            </button>
            <button
              onClick={() => reviewMessage(msg.id, false)}
              className="px-2 py-1 rounded text-[10px] bg-oasis-surface2 text-oasis-muted/50 hover:text-oasis-muted transition-colors"
            >
              拒絕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
