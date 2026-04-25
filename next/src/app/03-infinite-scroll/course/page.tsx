import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function CoursePage() {
  const content = readFileSync(
    join(process.cwd(), "src/app/03-infinite-scroll/COURSE.md"),
    "utf-8"
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <MarkdownRenderer content={content} />
    </div>
  );
}
