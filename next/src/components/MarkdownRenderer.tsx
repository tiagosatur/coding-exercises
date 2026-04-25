// unified: the pipeline runner. It chains plugins together, each transforming
// an internal syntax tree (AST), and produces a final output. Think of it as
// a conveyor belt — raw string goes in, processed HTML comes out.
import { unified } from "unified";

// remark-parse: first step. Reads the markdown string and turns it into a
// Markdown AST (mdast). Every heading, paragraph, code block etc. becomes a
// node in the tree. Nothing is rendered yet — it's just a structured object.
import remarkParse from "remark-parse";

// remark-gfm: extends the markdown parser to support GitHub Flavored Markdown —
// tables, strikethrough, task lists, and autolinks that CommonMark doesn't cover.
import remarkGfm from "remark-gfm";

// remark-rehype: converts the Markdown AST (mdast) into an HTML AST (hast).
// This is the bridge between the "remark" world (markdown) and the "rehype"
// world (HTML). After this step, plugins operate on HTML nodes instead.
import remarkRehype from "remark-rehype";

// rehype-pretty-code: walks the HTML AST looking for <code> nodes, sends each
// one to shiki for syntax highlighting, and replaces the plain text with
// token-coloured spans. Shiki uses the same TextMate grammars and themes as
// VSCode, so the output looks identical to your editor.
import rehypePrettyCode from "rehype-pretty-code";

// rehype-stringify: last step. Serialises the HTML AST back into an HTML string
// that the browser can render. This is what dangerouslySetInnerHTML receives.
import rehypeStringify from "rehype-stringify";

export async function MarkdownRenderer({ content }: { content: string }) {
  // The pipeline runs top-to-bottom:
  // markdown string → mdast → mdast+GFM → hast → hast+highlighting → HTML string
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: "dark-plus" })
    .use(rehypeStringify)
    .process(content);

  // `prose prose-gray` comes from @tailwindcss/typography — it styles all the
  // raw HTML tags (h1, p, ul, code...) that we don't control directly.
  // `max-w-none` removes the plugin's default max-width so the parent controls layout.
  // `dangerouslySetInnerHTML` is safe here because the content is our own .md files,
  // not user input.
  return (
    <div
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: String(file) }}
    />
  );
}
