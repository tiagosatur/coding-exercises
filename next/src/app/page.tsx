import Link from "next/link";

const exercises = [
  {
    slug: "01-debounced-search",
    num: "01",
    title: "Debounced Search",
    description: "URL-synced search input with 300ms debounce using useSearchParams + useRouter.",
    color: "#00ff88",
  },
  {
    slug: "02-filter-component",
    num: "02",
    title: "Generic Filter Component",
    description: "Reusable MultiSelectFilter<T> with TypeScript generics.",
    color: "#ff00ff",
  },
  {
    slug: "03-infinite-scroll",
    num: "03",
    title: "Infinite Scroll",
    description: "useInfiniteQuery + Intersection Observer for paginated property listings.",
    color: "#00d4ff",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] font-[family-name:var(--font-jetbrains-mono)] overflow-hidden">

      {/* Circuit grid background */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] [background-size:50px_50px]" />

      {/* Radial glow in top-left corner */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none [background:radial-gradient(circle,rgba(0,255,136,0.07)_0%,transparent_70%)]" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.25)_2px,rgba(0,0,0,0.25)_4px)]" />

      <main className="relative z-20 w-full max-w-3xl mx-auto px-6 py-16 flex flex-col min-h-screen">

        {/* Header */}
        <header className="mb-16 border-b border-[#2a2a3a] pb-12">
          <p className="text-[#00ff88] text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="inline-block animate-[blink_1s_step-end_infinite]">█</span>
            SYSTEM INITIALIZED — LOADING MODULES
          </p>

          <h1
            className="font-[family-name:var(--font-orbitron)] text-5xl sm:text-7xl font-black uppercase tracking-widest text-[#e0e0e0] leading-tight mb-6"
            style={{ textShadow: "-2px 0 #ff00ff, 2px 0 #00d4ff" }}
          >
            NEXT.JS<br />
            <span
              className="text-[#00ff88]"
              style={{ textShadow: "0 0 10px #00ff88, 0 0 30px rgba(0,255,136,0.4)" }}
            >
              EXERCISES
            </span>
          </h1>

          <p className="text-[#6b7280] text-sm uppercase tracking-[0.2em]">
            &gt; 3 modules loaded &nbsp;&gt;&nbsp; select target &nbsp;&gt;&nbsp;
            <span className="text-[#00ff88] animate-[blink_1s_step-end_infinite]">_</span>
          </p>
        </header>

        {/* Exercise list */}
        <ul className="flex-1 space-y-5">
          {exercises.map((ex) => (
            <li key={ex.slug}>
              <Link href={`/${ex.slug}`} className="group block">
                <div
                  className="relative bg-[#12121a] border border-[#2a2a3a] p-6 transition-all duration-150 group-hover:border-[#00ff88] group-hover:shadow-[0_0_10px_rgba(0,255,136,0.2),inset_0_0_20px_rgba(0,255,136,0.03)]"
                  style={{
                    clipPath:
                      "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  <div className="flex items-start gap-6">
                    {/* Number */}
                    <span
                      className="font-[family-name:var(--font-orbitron)] text-4xl font-black shrink-0 leading-none tabular-nums"
                      style={{
                        color: ex.color,
                        textShadow: `0 0 12px ${ex.color}60`,
                      }}
                    >
                      {ex.num}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-[family-name:var(--font-orbitron)] text-base font-bold uppercase tracking-wide text-[#e0e0e0] mb-2 group-hover:text-[#00ff88] transition-colors duration-150">
                        {ex.title}
                      </h2>
                      <p className="text-xs text-[#6b7280] tracking-wide leading-relaxed">
                        &gt; {ex.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span className="self-center text-[#2a2a3a] group-hover:text-[#00ff88] font-mono text-lg transition-all duration-150 group-hover:translate-x-1 shrink-0">
                      //→
                    </span>
                  </div>

                  {/* Bottom neon sweep on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: `linear-gradient(90deg, ${ex.color}, transparent)` }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#2a2a3a] flex justify-between items-center text-[#6b7280] text-xs uppercase tracking-[0.2em]">
          <span>&gt; You are being watched</span>
          <span className="text-[#00ff88]">
            SYS_OK<span className="animate-[blink_1s_step-end_infinite]">_</span>
          </span>
        </footer>
      </main>
    </div>
  );
}
