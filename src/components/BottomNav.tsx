"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Feather, ListChecks, Flower2 } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/check-in",
    label: "傾訴",
    icon: Feather,
  },
  {
    href: "/habits",
    label: "微習慣",
    icon: ListChecks,
  },
  {
    href: "/sanctuary",
    label: "小天地",
    icon: Flower2,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-oasis-bg/90 backdrop-blur-xl border-t border-oasis-border/30">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl
                  transition-all duration-300 min-w-[72px]
                  ${
                    isActive
                      ? "text-oasis-sage"
                      : "text-oasis-muted/50 hover:text-oasis-muted"
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[11px] font-medium">{item.label}</span>

                {/* active indicator */}
                {isActive && (
                  <div className="absolute -bottom-0.5 w-6 h-0.5 rounded-full bg-oasis-sage/40" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
