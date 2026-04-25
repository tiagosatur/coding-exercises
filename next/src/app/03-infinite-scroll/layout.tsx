import { existsSync } from "fs";
import { join } from "path";
import { ExerciseTabs } from "@/components/ExerciseTabs";

const BASE = "/03-infinite-scroll";

export default function InfiniteScrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasCourse = existsSync(
    join(process.cwd(), "src/app/03-infinite-scroll/COURSE.md")
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
