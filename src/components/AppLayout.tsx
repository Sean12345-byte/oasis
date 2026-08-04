"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Shield } from "lucide-react";
import { getPrefs, setPrivacyNoticeSeen } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const prefs = getPrefs();
    if (!prefs.hasSeenPrivacyNotice) {
      setShowPrivacy(true);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    setPrivacyNoticeSeen();
    setShowPrivacy(false);
  };

  return (
    <>
      {/* ── 隱私提示 (首次啟動) ── */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-oasis-bg flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-sm w-full space-y-8 text-center"
            >
              {/* 圖標 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center justify-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <Heart
                    size={64}
                    className="text-oasis-sage/40"
                    fill="rgba(155,175,158,0.1)"
                    strokeWidth={1}
                  />
                  <Shield
                    size={28}
                    className="absolute text-oasis-sage/60"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>

              {/* 標題 */}
              <div className="space-y-2">
                <h1 className="text-2xl font-light text-oasis-warm tracking-wider">
                  Oasis
                </h1>
                <p className="text-sm text-oasis-text/50">棲所</p>
              </div>

              {/* 隱私承諾 */}
              <div className="glass-card p-5 space-y-3">
                <Shield size={20} className="text-oasis-sage/50 mx-auto" />
                <p className="text-sm text-oasis-text/70 leading-relaxed">
                  你的文字不會離開這台裝置。
                </p>
                <p className="text-xs text-oasis-muted/50 leading-relaxed">
                  Oasis 的所有資料（情緒紀錄、習慣完成狀態）100% 儲存在你的裝置上。
                  我們不收集、不上傳、不分享任何個人資料。
                  這裡沒有伺服器，沒有後端，只有你和你的棲所。
                </p>
              </div>

              {/* 進入 */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={handleAcceptPrivacy}
                className="btn-gentle w-full"
              >
                進入棲所
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 主內容 ── */}
      <main>{children}</main>

      {/* ── 底部導航 ── */}
      <BottomNav />
    </>
  );
}
