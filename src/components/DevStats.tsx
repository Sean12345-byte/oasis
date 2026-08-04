"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Shield, Activity } from "lucide-react";
import { getDevStats, type DevStats } from "@/lib/devstats";
import { getPendingMessages } from "@/lib/messages";
import { MessageReviewPanel } from "@/components/MessageLibrary";

export default function DevStatsPage() {
  const [stats, setStats] = useState<DevStats | null>(null);

  useEffect(() => {
    setStats(getDevStats());
  }, []);

  if (!stats) return null;

  const highRate =
    stats.totalChecks > 0
      ? ((stats.highRiskTriggers / stats.totalChecks) * 100).toFixed(1)
      : "0";
  const mediumRate =
    stats.totalChecks > 0
      ? ((stats.mediumRiskTriggers / stats.totalChecks) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen pb-24 px-5 pt-6 max-w-lg mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-oasis-muted/40" />
          <h1 className="text-lg font-light text-oasis-muted">開發者工具</h1>
        </div>
        <p className="text-xs text-oasis-muted/40">
          本頁僅在開發模式下可見。所有統計為本地端匿名累計，不記錄任何使用者內容或身份。
        </p>
      </motion.div>

      {/* 安全檢查統計 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-oasis-sage/50" />
          <h3 className="text-sm font-medium text-oasis-text/60">關鍵字觸發統計</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="總檢查次數" value={stats.totalChecks} />
          <StatCard label="高風險觸發" value={stats.highRiskTriggers} sub={`${highRate}%`} color="text-oasis-warm" />
          <StatCard label="中風險觸發" value={stats.mediumRiskTriggers} sub={`${mediumRate}%`} color="text-oasis-sage" />
          <StatCard label="安全語境過濾" value={stats.safeContextFilters} />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <StatCard label="使用者繼續抒發" value={stats.userContinuedAfterHighRisk} />
          <StatCard label="使用者查看資源" value={stats.userViewedResources} />
        </div>

        {/* 繼續率 */}
        {stats.highRiskTriggers > 0 && (
          <div className="pt-2 border-t border-oasis-border/20">
            <p className="text-xs text-oasis-muted/50">
              高風險攔截後繼續率：
              <span className="text-oasis-text/60 ml-1">
                {((stats.userContinuedAfterHighRisk / stats.highRiskTriggers) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* 投稿審核 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-oasis-sage/50" />
          <h3 className="text-sm font-medium text-oasis-text/60">語句投稿審核</h3>
        </div>
        <MessageReviewPanel />
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color = "text-oasis-text",
}: {
  label: string;
  value: number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-oasis-surface2/50 border border-oasis-border/20">
      <div className={`text-lg font-light tabular-nums ${color}`}>
        {value}
      </div>
      <div className="text-[10px] text-oasis-muted/40 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-oasis-muted/25">{sub}</div>}
    </div>
  );
}
