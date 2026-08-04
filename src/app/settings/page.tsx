"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell, Clock, Coffee, Shield, Palette, MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { getPrefs, setPrefs, type AnimationStyle } from "@/lib/storage";
import {
  getNotificationPrefs,
  setNotificationPrefs,
  requestNotificationPermission,
} from "@/lib/notifications";
import MessageLibrary from "@/components/MessageLibrary";

// 動畫風格選項
const ANIMATION_OPTIONS: { key: AnimationStyle; label: string; emoji: string }[] = [
  { key: "hearts",  label: "擁抱", emoji: "💚" },
  { key: "glow",    label: "光暈", emoji: "✨" },
  { key: "ripple",  label: "波紋", emoji: "🌊" },
];

export default function SettingsPage() {
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState("21:00");
  const [animStyle, setAnimStyle] = useState<AnimationStyle>("hearts");
  const [notifSupported, setNotifSupported] = useState(false);

  useEffect(() => {
    setNotifSupported("Notification" in window);
    const np = getNotificationPrefs();
    setNotifEnabled(np.enabled);
    setNotifTime(np.time);
    setAnimStyle(getPrefs().animationStyle);
  }, []);

  const handleNotifToggle = async (enabled: boolean) => {
    if (enabled && Notification.permission !== "granted") {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    setNotifEnabled(enabled);
    setNotificationPrefs({ enabled });
  };

  const handleTimeChange = (time: string) => {
    setNotifTime(time);
    setNotificationPrefs({ time });
  };

  const handleAnimChange = (style: AnimationStyle) => {
    setAnimStyle(style);
    setPrefs({ animationStyle: style });
  };

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-light text-oasis-warm tracking-wide">設定</h1>
        <p className="text-sm text-oasis-muted/50 mt-1">讓 Oasis 更貼近你的節奏</p>
      </motion.div>

      {/* ── 每日推播 ── */}
      {notifSupported && (
        <Section title="每日溫柔提醒" icon={Bell}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-oasis-text/70">開啟每日推播</p>
              <p className="text-xs text-oasis-muted/40 mt-0.5">
                純陪伴語句，不提醒任務、不做評價
              </p>
            </div>
            <button
              onClick={() => handleNotifToggle(!notifEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notifEnabled ? "bg-oasis-sage/50" : "bg-oasis-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  notifEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {notifEnabled && (
            <div className="mt-3 flex items-center gap-2">
              <Clock size={14} className="text-oasis-muted/40" />
              <input
                type="time"
                value={notifTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="bg-oasis-surface2 border border-oasis-border/30 rounded-lg px-2 py-1
                           text-sm text-oasis-text focus:outline-none focus:border-oasis-sage/30"
              />
              <span className="text-xs text-oasis-muted/40">每天此時推送</span>
            </div>
          )}
          {/* 推播文案預覽 */}
          {notifEnabled && (
            <div className="mt-3 p-3 rounded-lg bg-oasis-surface2/50 border border-oasis-border/20">
              <p className="text-[11px] text-oasis-muted/50 italic leading-relaxed">
                「今天的你，辛苦了。不管晴天雨天，這裡都在。」
              </p>
              <p className="text-[10px] text-oasis-muted/25 mt-1">
                以上為預覽範例，實際推送隨機從語句庫挑選
              </p>
            </div>
          )}
        </Section>
      )}

      {/* ── 動畫風格 ── */}
      <Section title="釋放動畫風格" icon={Palette}>
        <p className="text-xs text-oasis-muted/40 mb-2">
          選擇讓你感到最舒服的視覺效果
        </p>
        <div className="flex gap-2">
          {ANIMATION_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleAnimChange(opt.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs transition-all ${
                animStyle === opt.key
                  ? "bg-oasis-sage/15 text-oasis-sage border border-oasis-sage/20"
                  : "bg-oasis-surface2 text-oasis-muted/50 border border-oasis-border/20"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── 陪伴語句投稿庫 ── */}
      <Section title="匿名分享" icon={MessageSquare}>
        <MessageLibrary />
      </Section>

      {/* ── 支持 Oasis ── */}
      <Section title="支持 Oasis" icon={Coffee}>
        <p className="text-sm text-oasis-text/60 leading-relaxed mb-4">
          如果這個空間對你有幫助，歡迎請我喝杯咖啡，讓 Oasis 能繼續營運下去。
          這是一次性的支持，所有功能永遠維持一致，沒有任何隱藏權限或升級制度。
        </p>

        <div className="grid grid-cols-3 gap-2">
          {[
            { amount: 60, label: "一杯咖啡", link: "https://buy.stripe.com/YOUR_LINK_60" },
            { amount: 150, label: "一頓簡餐", link: "https://buy.stripe.com/YOUR_LINK_150" },
            { amount: 300, label: "一個下午", link: "https://buy.stripe.com/YOUR_LINK_300" },
          ].map((tier) => (
            <a
              key={tier.amount}
              href={tier.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 rounded-xl bg-oasis-surface2 border border-oasis-border/20
                         hover:border-oasis-glow/30 hover:bg-oasis-glow/5 transition-all group"
            >
              <div className="text-lg font-light text-oasis-glow/80 group-hover:text-oasis-glow">
                NT${tier.amount}
              </div>
              <div className="text-[10px] text-oasis-muted/40 mt-1">{tier.label}</div>
            </a>
          ))}
        </div>

        <p className="text-[10px] text-oasis-muted/25 mt-3 leading-relaxed">
          付款透過 Stripe 安全處理。一次性付款，不會自動續訂。
          所有功能在贊助前後完全一致，沒有差別。
        </p>
      </Section>

      {/* ── 隱私重申 ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 text-center"
      >
        <Shield size={16} className="text-oasis-sage/30 mx-auto mb-2" />
        <p className="text-[11px] text-oasis-muted/30 leading-relaxed">
          你的文字不會離開這台裝置。Oasis 永遠不會有伺服器端資料庫。
        </p>
      </motion.div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-oasis-sage/50" />
        <h3 className="text-sm font-medium text-oasis-text/60">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
