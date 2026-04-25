import { existsSync } from "fs";
import { join } from "path";
import { ExerciseTabs } from "@/components/ExerciseTabs";

const BASE = "/01-debounced-search";

export default function DebouncedSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasCourse = existsSync(
    join(process.cwd(), "src/app/01-debounced-search/COURSE.md")
  );

  const tabs = [
    { label: "Exercise", href: BASE },
    ...(hasCourse ? [{ label: "Course Notes", href: `${BASE}/course` }] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <ExerciseTabs tabs={tabs} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
