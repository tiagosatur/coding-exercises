import { existsSync } from "fs";
import { join } from "path";
import { ExerciseTabs } from "@/components/ExerciseTabs";

const BASE = "/02-filter-component";

export default function FilterComponentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasCourse = existsSync(
    join(process.cwd(), "src/app/02-filter-component/COURSE.md")
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
