"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/check-in");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-oasis-bg">
      <p className="text-oasis-muted/40 text-sm animate-pulse-soft">載入中...</p>
    </div>
  );
}
