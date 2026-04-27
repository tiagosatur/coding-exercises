function Code({ children }) {
  return (
    <code className="bg-[#1A1A1A]/[0.06] text-[#1A1A1A] px-1.5 py-0.5 rounded text-[0.8em] font-mono">
      {children}
    </code>
  );
}

function Badge({ children, color = "gold" }) {
  const colors = {
    gold: "bg-[#D4AF37]/15 text-[#8B6F00]",
    green: "bg-green-100 text-green-700",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-700",
    gray: "bg-[#1A1A1A]/[0.06] text-[#6C6863]",
  };
  return (
    <span className={`inline-block text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded-sm ${colors[color]}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-3">{children}</p>
  );
}

function Divider() {
  return <div className="border-t border-[#1A1A1A]/10 my-12" />;
}

function CodeBlock({ code, comment }) {
  return (
    <div className="border border-[#1A1A1A]/10 overflow-hidden">
      {comment && (
        <div className="bg-[#1A1A1A]/[0.03] border-b border-[#1A1A1A]/10 px-5 py-3">
          <p className="text-[11px] text-[#6C6863] leading-relaxed font-mono">{comment}</p>
        </div>
      )}
      <pre className="bg-[#1A1A1A]/[0.015] p-5 overflow-x-auto text-xs leading-relaxed font-mono text-[#1A1A1A] whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function ProConList({ pros, cons }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="border border-green-200 bg-green-50/50 p-4">
        <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-green-700 mb-3">Pros</p>
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="text-xs text-[#1A1A1A] leading-relaxed flex gap-2">
              <span className="text-green-600 shrink-0 mt-px">+</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-red-100 bg-red-50/30 p-4">
        <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-red-500 mb-3">Cons</p>
        <ul className="space-y-1.5">
          {cons.map((c, i) => (
            <li key={i} className="text-xs text-[#1A1A1A] leading-relaxed flex gap-2">
              <span className="text-red-400 shrink-0 mt-px">−</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WalkthroughStep({ step, title, why, code, output }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-px bg-[#1A1A1A]/10">
      <div className="bg-white p-5 min-w-0">
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="text-2xl font-normal text-[#1A1A1A]/15 leading-none select-none shrink-0"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {step}
          </span>
          <p className="font-mono text-xs font-semibold text-[#1A1A1A]">{title}</p>
        </div>
        <p className="text-xs text-[#6C6863] leading-relaxed mb-4">{why}</p>
        <pre className="bg-[#1A1A1A]/[0.04] px-3 py-2.5 text-[11px] font-mono text-[#1A1A1A] overflow-x-auto whitespace-pre leading-relaxed">
          {code}
        </pre>
      </div>
      <div className="bg-[#1A1A1A]/[0.015] p-5 flex flex-col justify-center min-w-0">
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#6C6863] mb-2">Output</p>
        <div className="overflow-x-auto">
          <pre className="text-[11px] font-mono text-[#6C6863] whitespace-pre leading-relaxed">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ApproachCard({ number, title, badge, badgeColor, description, code, pros, cons, annotation, walkthrough }) {
  return (
    <div className="border-t border-[#1A1A1A] pt-10 pb-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-baseline gap-3">
          <span
            className="text-5xl font-normal text-[#1A1A1A]/10 leading-none select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {String(number).padStart(2, '0')}
          </span>
          <h3
            className="text-xl font-normal text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h3>
        </div>
        <Badge color={badgeColor}>{badge}</Badge>
      </div>
      <p className="text-sm text-[#6C6863] leading-relaxed mb-6 max-w-2xl">{description}</p>
      <CodeBlock code={code} />
      {annotation && (
        <p className="text-xs text-[#6C6863] leading-relaxed mt-3 italic max-w-2xl">{annotation}</p>
      )}
      {walkthrough && (
        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4">Step-by-step walkthrough</p>
          <div className="space-y-px border border-[#1A1A1A]/10">
            {walkthrough.map((s) => (
              <WalkthroughStep key={s.step} {...s} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-6">
        <ProConList pros={pros} cons={cons} />
      </div>
    </div>
  );
}

const APPROACHES = [
  {
    number: 1,
    title: "Single-pass reduce",
    badge: "Most common",
    badgeColor: "gold",
    description:
      "Handle filtering and grouping together in a single reduce pass. The accumulator builds up a { [state]: string[] } map; skipped entries just return the unchanged accumulator.",
    code: `const process = (entries) =>
  Object.fromEntries(
    Object.entries(
      entries.reduce((acc, entry) => {
        const [city, state, country] = entry.split(', ');
        if (country !== 'Brasil') return acc;           // skip non-Brasil
        return {
          ...acc,
          [state]: acc[state] ? [...acc[state], city] : [city],
        };
      }, {})
    ).map(([state, cities]) => [state, cities.join(', ')])
  );`,
    annotation:
      "The spread inside reduce (...acc, ...acc[state]) creates a shallow copy on every iteration. This is idiomatic but has O(n²) memory cost for very large inputs — each step copies all previous keys.",
    pros: [
      "Single pass over the array — O(n) iterations",
      "Pure: accumulator is never mutated, no side-effects",
      "Idiomatically functional — easy to spot the pattern",
    ],
    cons: [
      "Spread operator ({...acc}) copies the whole object each step → O(n²) allocations",
      "Filtering and grouping mixed together — harder to test each step in isolation",
      "Nested Object.entries + map can feel dense",
    ],
  },
  {
    number: 2,
    title: "filter then reduce",
    badge: "Most readable",
    badgeColor: "blue",
    description:
      "Separate concerns: first eliminate non-Brazilian entries, then group the remainder. Each chained step has exactly one job, making the pipeline easy to read from top to bottom.",
    code: `const process = (entries) =>
  Object.fromEntries(
    Object.entries(
      entries
        .filter((entry) => entry.split(', ')[2] === 'Brasil')  // step 1: keep Brasil
        .reduce((acc, entry) => {                               // step 2: group by state
          const [city, state] = entry.split(', ');
          return { ...acc, [state]: acc[state] ? [...acc[state], city] : [city] };
        }, {})
    ).map(([state, cities]) => [state, cities.join(', ')])     // step 3: join cities
  );`,
    annotation:
      "This is the approach used in the reference solution. The slight overhead of two passes is negligible for realistic inputs (< 10 000 entries) and the readability gain is worth it.",
    pros: [
      "Separation of concerns — filter, group, format are independent steps",
      "Each step can be extracted and unit-tested on its own",
      "Reading order matches mental order: filter → group → format",
    ],
    cons: [
      "Two passes over the array (O(2n) vs O(n)) — irrelevant in practice",
      "split(', ') called twice per entry (once in filter, once in reduce)",
      "Still has the O(n²) spread cost inside reduce",
    ],
  },
  {
    number: 3,
    title: "reduce with accumulator mutation",
    badge: "Best performance",
    badgeColor: "green",
    description:
      "Avoid the O(n²) spread cost by directly assigning to the accumulator. This breaks strict immutability but the accumulator is a fresh object created inside reduce — no external state is touched.",
    code: `const process = (entries) =>
  Object.fromEntries(
    Object.entries(
      entries.reduce((acc, entry) => {
        const [city, state, country] = entry.split(', ');
        if (country !== 'Brasil') return acc;
        acc[state] = acc[state] ? [...acc[state], city] : [city];   // mutate acc
        return acc;
      }, {})
    ).map(([state, cities]) => [state, cities.join(', ')])
  );`,
    annotation:
      "Mutating the accumulator is a common optimisation in functional JS codebases (Immer, Redux toolkit, even Lodash's _.groupBy do it internally). The key rule: only mutate what you own and created yourself.",
    pros: [
      "O(n) time and O(n) memory — no redundant copies",
      "Scales well for large datasets",
      "Still uses only Array/Object methods, no imperative loops",
    ],
    cons: [
      "Technically impure: mutates the accumulator object",
      "Harder to debug with time-travel tools (Redux DevTools) that rely on immutability",
      "Can confuse developers who expect reduce to be pure",
    ],
  },
  {
    number: 4,
    title: "Object.groupBy (modern API)",
    badge: "Future-ready",
    badgeColor: "gray",
    description:
      "ES2024 introduced Object.groupBy, a built-in that eliminates the manual grouping reduce entirely. The intent is explicit and there is no accumulator to reason about. But it still needs three supporting steps — read the walkthrough below to understand why each one is necessary.",
    code: `const process = (entries) => {
  const brazilianEntries = entries.filter(        // step 1 — remove noise
    (entry) => entry.split(', ')[2] === 'Brasil'
  );

  const grouped = Object.groupBy(                 // step 2 — bucket by state
    brazilianEntries,
    (entry) => entry.split(', ')[1]
  );

  return Object.fromEntries(                      // step 5 — close back to object
    Object.entries(grouped)                       // step 3 — open for iteration
      .map(([state, stateEntries]) => [           // step 4 — extract & join names
        state,
        stateEntries.map((e) => e.split(', ')[0]).join(', '),
      ])
  );
};`,
    walkthrough: [
      {
        step: "01",
        title: "filter — remove non-Brazilian entries",
        why: "Object.groupBy has no built-in way to skip entries. Without this step, 'New York', 'Paris', and 'Bogota' would each become their own group in the output. Filter first so groupBy only sees data it should care about.",
        code: `entries.filter((entry) => entry.split(', ')[2] === 'Brasil')`,
        output: `// → [
//   "São Paulo, SP, Brasil",
//   "Curitiba, PR, Brasil",
//   "Londrina, PR, Brasil",
//   "Marília, SP, Brasil",
//   "Santos, SP, Brasil",
//   "Maringá, PR, Brasil",
//   "Rio de Janeiro, RJ, Brasil",
//   "Salvador, BA, Brasil",
//   "Petrópolis, RJ, Brasil",
// ]`,
      },
      {
        step: "02",
        title: "Object.groupBy — bucket entries by state code",
        why: "The callback returns the grouping key for each entry (index 1 = state code). Object.groupBy builds an object where each key maps to an array of all entries that returned that key. Important: the values are the original full strings — not just city names. Step 4 will fix that.",
        code: `Object.groupBy(brazilianEntries, (entry) => entry.split(', ')[1])`,
        output: `// → {
//   SP: [
//     "São Paulo, SP, Brasil",
//     "Marília, SP, Brasil",
//     "Santos, SP, Brasil",
//   ],
//   PR: [
//     "Curitiba, PR, Brasil",
//     "Londrina, PR, Brasil",
//     "Maringá, PR, Brasil",
//   ],
//   RJ: ["Rio de Janeiro, RJ, Brasil", "Petrópolis, RJ, Brasil"],
//   BA: ["Salvador, BA, Brasil"],
// }`,
      },
      {
        step: "03",
        title: "Object.entries — open the object for iteration",
        why: "Objects are not iterable — you cannot call .map() directly on them. Object.entries converts the grouped object into an array of [key, value] pairs, making the grouped data compatible with array methods.",
        code: `Object.entries(grouped)`,
        output: `// → [
//   ["SP", ["São Paulo, SP, Brasil", "Marília, SP, Brasil", ...]],
//   ["PR", ["Curitiba, PR, Brasil", "Londrina, PR, Brasil", ...]],
//   ["RJ", ["Rio de Janeiro, RJ, Brasil", "Petrópolis, RJ, Brasil"]],
//   ["BA", ["Salvador, BA, Brasil"]],
// ]`,
      },
      {
        step: "04",
        title: "map — extract city names and join into a string",
        why: "Each value is still an array of full strings ('Curitiba, PR, Brasil'). We only want the city name — index 0 after split. Map transforms each [state, entries] pair: the state key stays, and the entries array is converted to a comma-separated string of city names.",
        code: `.map(([state, stateEntries]) => [
  state,
  stateEntries.map((entry) => entry.split(', ')[0]).join(', '),
])`,
        output: `// → [
//   ["SP", "São Paulo, Marília, Santos"],
//   ["PR", "Curitiba, Londrina, Maringá"],
//   ["RJ", "Rio de Janeiro, Petrópolis"],
//   ["BA", "Salvador"],
// ]`,
      },
      {
        step: "05",
        title: "Object.fromEntries — close back into an object",
        why: "Steps 3 and 4 converted the object into an array to transform it. fromEntries is the inverse of entries: it reconstructs an object from [key, value] pairs. This is always the final step of the entries → map → fromEntries pattern.",
        code: `Object.fromEntries(pairs)`,
        output: `// → {
//   SP: "São Paulo, Marília, Santos",
//   PR: "Curitiba, Londrina, Maringá",
//   RJ: "Rio de Janeiro, Petrópolis",
//   BA: "Salvador",
// }`,
      },
    ],
    pros: [
      "Semantic and self-documenting — 'groupBy' says exactly what it does",
      "No manual accumulator logic to write or debug",
      "Built-in implementations will improve over time",
    ],
    cons: [
      "Requires Node 21+ / modern browsers (2024) — may need a polyfill",
      "split(', ') is called across multiple steps — minor redundancy",
      "Less familiar to developers used to pre-2024 codebases",
    ],
  },
];

const KEY_CONCEPTS = [
  {
    term: "Array.reduce",
    summary: "Fold an array into a single value by applying a callback to each element and an accumulator.",
    example: `[1, 2, 3].reduce((acc, n) => acc + n, 0) // → 6`,
  },
  {
    term: "Object.entries",
    summary: "Convert an object into an array of [key, value] pairs. Pairs with Object.fromEntries.",
    example: `Object.entries({ a: 1, b: 2 }) // → [["a", 1], ["b", 2]]`,
  },
  {
    term: "Object.fromEntries",
    summary: "Reconstruct an object from an array of [key, value] pairs. The inverse of Object.entries.",
    example: `Object.fromEntries([["a", 1], ["b", 2]]) // → { a: 1, b: 2 }`,
  },
  {
    term: "String.split",
    summary: "Split a string into an array of substrings at each occurrence of a separator.",
    example: `"São Paulo, SP, Brasil".split(', ') // → ["São Paulo", "SP", "Brasil"]`,
  },
  {
    term: "Array.join",
    summary: "Concatenate all array elements into a single string, separated by a given glue.",
    example: `["São Paulo", "Marília"].join(', ') // → "São Paulo, Marília"`,
  },
];

function ConceptCard({ term, summary, example }) {
  return (
    <div className="border border-[#1A1A1A]/10 p-5">
      <p className="font-mono text-sm font-semibold text-[#1A1A1A] mb-1">{term}</p>
      <p className="text-xs text-[#6C6863] leading-relaxed mb-3">{summary}</p>
      <pre className="bg-[#1A1A1A]/[0.04] px-3 py-2 text-[11px] font-mono text-[#1A1A1A] overflow-x-auto whitespace-pre">
        {example}
      </pre>
    </div>
  );
}

export function CitiesByStateCourse() {
  return (
    <div className="my-14 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-14">
        <span className="block h-px w-12 bg-[#1A1A1A]/30" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">Course · Cities by State</span>
      </div>

      <h1
        className="font-normal leading-[0.9] tracking-tight text-[#1A1A1A] mb-6 text-6xl md:text-7xl"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Functional<br />
        <span className="italic" style={{ color: "#D4AF37" }}>grouping</span>
        <span>.</span>
      </h1>
      <p className="text-sm text-[#6C6863] leading-relaxed max-w-xl mb-16">
        This exercise is a small but surprisingly rich problem: transform a flat list of
        strings into a grouped object — without a single loop. Along the way you will practise
        the three building blocks of functional pipelines:{' '}
        <strong className="text-[#1A1A1A] font-medium">filter</strong>,{' '}
        <strong className="text-[#1A1A1A] font-medium">reduce</strong>, and{' '}
        <strong className="text-[#1A1A1A] font-medium">transform</strong>.
      </p>

      {/* Problem breakdown */}
      <section className="mb-12">
        <SectionLabel>The problem</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Break it into three jobs
        </h2>
        <p className="text-sm text-[#6C6863] leading-relaxed mb-6 max-w-2xl">
          Before writing any code, decompose the transformation into independent steps.
          Each step is a pure function that you can reason about — and test — in isolation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#1A1A1A]/10">
          {[
            {
              step: "01",
              label: "Filter",
              desc: 'Keep only entries where country === "Brasil". Everything else is noise.',
              method: "Array.filter",
            },
            {
              step: "02",
              label: "Group",
              desc: "Accumulate cities into arrays keyed by their state code (SP, PR, …).",
              method: "Array.reduce",
            },
            {
              step: "03",
              label: "Format",
              desc: 'Convert each city array into a comma-joined string: ["A","B"] → "A, B".',
              method: "Array.map + join",
            },
          ].map(({ step, label, desc, method }) => (
            <div key={step} className="bg-white p-6">
              <span
                className="text-4xl font-normal text-[#1A1A1A]/10 leading-none select-none block mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {step}
              </span>
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">{label}</p>
              <p className="text-xs text-[#6C6863] leading-relaxed mb-3">{desc}</p>
              <Code>{method}</Code>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Key concepts */}
      <section className="mb-12">
        <SectionLabel>Key concepts</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The methods you need
        </h2>
        <p className="text-sm text-[#6C6863] leading-relaxed mb-6 max-w-2xl">
          All four approaches below use the same small vocabulary. Make sure these feel natural
          before comparing the approaches.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KEY_CONCEPTS.map((c) => (
            <ConceptCard key={c.term} {...c} />
          ))}
        </div>
      </section>

      <Divider />

      {/* The entries + Object pipeline pattern */}
      <section className="mb-12">
        <SectionLabel>Core pattern</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Object.entries → map → Object.fromEntries
        </h2>
        <p className="text-sm text-[#6C6863] leading-relaxed mb-6 max-w-2xl">
          JavaScript objects are not directly iterable, so you cannot call{' '}
          <Code>.map()</Code> on them. The standard trick is to convert to pairs, map,
          then convert back. Think of it as the object equivalent of <Code>Array.map</Code>.
        </p>
        <CodeBlock
          comment="Pattern: transform object values while keeping keys"
          code={`// Given: { SP: ["São Paulo", "Marília"], PR: ["Curitiba"] }
// Want:  { SP: "São Paulo, Marília",     PR: "Curitiba"   }

Object.fromEntries(
  Object.entries(grouped)
    .map(([state, cities]) => [state, cities.join(', ')])
)
//   ↑ fromEntries reconstructs  ↑ entries deconstructs  ↑ map transforms`}
        />
        <p className="text-xs text-[#6C6863] leading-relaxed mt-4 italic max-w-2xl">
          This three-step pattern (<Code>entries → map → fromEntries</Code>) is the
          functional equivalent of "iterate over an object's values and change them".
          Memorise it — you will use it constantly.
        </p>
      </section>

      <Divider />

      {/* Approaches */}
      <section>
        <SectionLabel>Approaches</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Four ways to solve it
        </h2>
        <p className="text-sm text-[#6C6863] leading-relaxed mb-8 max-w-2xl">
          All four produce the same output. They differ in readability, performance, and
          the trade-offs each one makes. Understanding the differences is more important
          than picking the "right" one.
        </p>

        <div className="space-y-0">
          {APPROACHES.map((a) => (
            <ApproachCard key={a.number} {...a} />
          ))}
        </div>
      </section>

      <Divider />

      {/* Comparison table */}
      <section className="mb-12">
        <SectionLabel>Summary</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          At a glance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[#1A1A1A]">
                {["Approach", "Passes", "Memory", "Readability", "Browser support"].map((h) => (
                  <th key={h} className="text-left py-3 pr-6 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Single-pass reduce", "1", "O(n²)*", "Medium", "All"],
                ["filter + reduce", "2", "O(n²)*", "High", "All"],
                ["reduce + mutation", "1", "O(n)", "Medium", "All"],
                ["Object.groupBy", "2", "O(n)", "Very high", "2024+"],
              ].map(([name, passes, mem, read, support]) => (
                <tr key={name} className="border-b border-[#1A1A1A]/10">
                  <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{name}</td>
                  <td className="py-3 pr-6 text-[#6C6863]">{passes}</td>
                  <td className="py-3 pr-6 font-mono text-[#6C6863]">{mem}</td>
                  <td className="py-3 pr-6 text-[#6C6863]">{read}</td>
                  <td className="py-3 pr-6 text-[#6C6863]">{support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[#6C6863] mt-3">
          * O(n²) refers to the spread-operator copy inside reduce — not a practical concern
          for lists under ~10 000 entries.
        </p>
      </section>

      {/* Recommendation */}
      <section className="border-t-2 border-[#1A1A1A] pt-10">
        <SectionLabel>Recommendation</SectionLabel>
        <h2
          className="text-2xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Which one should you use?
        </h2>
        <div className="space-y-4 max-w-2xl">
          <p className="text-sm text-[#6C6863] leading-relaxed">
            <strong className="text-[#1A1A1A] font-medium">For this exercise and most real code:</strong>{' '}
            use <strong className="text-[#1A1A1A] font-medium">Approach 2 (filter + reduce)</strong>. The
            slight two-pass cost is imperceptible for any list a human would curate, and the
            separation of concerns pays dividends when you need to change just the filter
            or just the grouping logic.
          </p>
          <p className="text-sm text-[#6C6863] leading-relaxed">
            <strong className="text-[#1A1A1A] font-medium">If performance matters</strong> (streaming
            10 000+ entries, running in a tight loop):{' '}
            reach for <strong className="text-[#1A1A1A] font-medium">Approach 3</strong> and
            document <em>why</em> you are mutating the accumulator so the next reader
            understands it is intentional.
          </p>
          <p className="text-sm text-[#6C6863] leading-relaxed">
            <strong className="text-[#1A1A1A] font-medium">If you control the environment</strong> (Node 21+,
            modern browser, or you ship a polyfill):{' '}
            <strong className="text-[#1A1A1A] font-medium">Approach 4 (Object.groupBy)</strong> is
            the most expressive. The semantics are explicit — there is no way to
            misread what <Code>Object.groupBy(entries, getKey)</Code> does.
          </p>
        </div>
      </section>
    </div>
  );
}
