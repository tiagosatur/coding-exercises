'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export type ExerciseTab = {
  label: string;
  href: string;
};

export function ExerciseTabs({ tabs }: { tabs: ExerciseTab[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center bg-[#0a0a0f] border-b border-[#2a2a3a] px-4 shrink-0 font-[family-name:var(--font-jetbrains-mono)] relative">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />
      <Link
        href="/"
        className="relative mr-4 pr-4 border-r border-[#2a2a3a] py-3 text-xs uppercase tracking-[0.2em] text-[#6b7280] hover:text-[#00ff88] transition-colors duration-150"
      >
        Home
      </Link>
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 -mb-px transition-colors duration-150 ${
              isActive
                ? "border-[#00ff88] text-[#00ff88] [text-shadow:0_0_8px_rgba(0,255,136,0.6)]"
                : "border-transparent text-[#6b7280] hover:text-[#e0e0e0] hover:border-[#2a2a3a]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
