import { Link, createFileRoute } from "@tanstack/react-router";
import { exercises } from "@exercises/config";

export const Route = createFileRoute("/")({
  component: ExercisesPage,
});

function ExercisesPage() {
  return (
    <div className="pt-16 pb-32">
      {/* Overline */}
      <div className="flex items-center gap-4 mb-14">
        <span className="block h-px w-12 bg-[#1A1A1A]/30" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
          React / Vol. 01
        </span>
      </div>

      {/* Hero heading */}
      <h1
        className="font-normal leading-[0.9] tracking-tight text-[#1A1A1A] mb-20 text-7xl md:text-8xl"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Exercises<span className="italic" style={{ color: "#D4AF37" }}>.</span>
      </h1>

      {/* Exercise list */}
      <div>
        {exercises.map((ex) => (
          <div key={ex.slug} className="border-t border-[#1A1A1A] py-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4">
              Exercise
            </p>
            <h2
              className="text-3xl font-normal text-[#1A1A1A] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {ex.title}
            </h2>
            <p className="text-sm text-[#6C6863] leading-relaxed mb-8 max-w-sm">
              {ex.description}
            </p>
            <div className="flex gap-3 flex-wrap">
              {ex.links.map((s) => (
                <Link key={s.label} to={s.to} className="group/btn relative inline-flex h-10 overflow-hidden bg-[#1A1A1A] cursor-pointer">
                  <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center px-8 text-[10px] uppercase tracking-[0.2em] font-medium text-white">
                    {s.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
