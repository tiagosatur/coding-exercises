/**
 * Programming exercise — implement `process`
 *
 * Goal
 * Implement the `process` function below so that, given `input` (a list of strings
 * in the format "City, State, Country"), it returns an object in the format of
 * `expectedOutput`.
 *
 * Rules (mandatory)
 * - Do not use AI tools (ChatGPT, Copilot, etc.) during the exercise.
 * - Do not use imperative loops: `for`, `while`, `do/while`, `for...in`, `for...of`,
 *   or Array.forEach().
 * - Use only Array and Object methods, for example:
 *   `map`, `filter`, `reduce`, `flatMap`, `sort`, `join`, `Object.entries`,
 *   `Object.fromEntries`, `Object.keys`, `Object.values`, etc.
 *
 * Reference (MDN)
 * - Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * - Object: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
 *
 * Hint
 * `expectedOutput` groups Brazilian cities by state (UF); the value of each key is a
 * string with city names separated by comma and space (`, `), in the order they
 * appear in `input`.
 */

export const input = [
  'São Paulo, SP, Brasil',
  'Nova Iorque, NY, Estados Unidos',
  'Curitiba, PR, Brasil',
  'Londrina, PR, Brasil',
  'Bogota, CO, Colômbia',
  'Marília, SP, Brasil',
  'Santos, SP, Brasil',
  'Maringá, PR, Brasil',
  'Rio de Janeiro, RJ, Brasil',
  'Paris, IDF, França',
  'Salvador, BA, Brasil',
  'Petrópolis, RJ, Brasil',
];

export const expectedOutput = {
  SP: 'São Paulo, Marília, Santos',
  PR: 'Curitiba, Londrina, Maringá',
  RJ: 'Rio de Janeiro, Petrópolis',
  BA: 'Salvador',
};

export const process = (_input) => {
  // TODO: implement
};

function ResultRow({ stateKey, value, expected }) {
  const isCorrect = value === expected;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#1A1A1A]/10 last:border-0">
      <span className="font-mono text-xs font-bold text-[#1A1A1A] w-8 shrink-0">{stateKey}</span>
      <span className="font-mono text-xs text-[#6C6863] flex-1 break-all">
        {value ?? <em className="text-[#D4AF37]">undefined</em>}
      </span>
      <span className={`text-xs shrink-0 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
        {isCorrect ? '✓' : '✗'}
      </span>
    </div>
  );
}

export function CitiesByStateView({ processFn }) {
  const result = processFn(input);
  const allKeys = Array.from(new Set([...Object.keys(expectedOutput), ...Object.keys(result ?? {})]));
  const passed = JSON.stringify(result) === JSON.stringify(expectedOutput);

  return (
    <div className="my-14 max-w-xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4">Exercise</p>
      <h1
        className="text-4xl font-normal text-[#1A1A1A] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Cities by State
      </h1>
      <p className="text-sm text-[#6C6863] leading-relaxed mb-10">
        Implement{' '}
        <code className="bg-[#1A1A1A]/5 px-1 rounded text-xs">process(input)</code> to group
        Brazilian cities by state using only Array and Object methods — no imperative loops.
      </p>

      <section className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-3">Input</p>
        <ul className="bg-[#1A1A1A]/[0.03] border border-[#1A1A1A]/10 p-4 space-y-1">
          {input.map((entry) => (
            <li key={entry} className="font-mono text-xs text-[#1A1A1A]">
              {entry}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">Output</p>
          <span
            className={`text-[10px] uppercase tracking-[0.2em] font-medium px-2 py-1 ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
            }`}
          >
            {passed ? 'All passing' : 'Not passing'}
          </span>
        </div>
        <div className="bg-[#1A1A1A]/[0.03] border border-[#1A1A1A]/10 p-4">
          {allKeys.map((key) => (
            <ResultRow key={key} stateKey={key} value={result?.[key]} expected={expectedOutput[key]} />
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-3">Expected Output</p>
        <div className="bg-[#1A1A1A]/[0.03] border border-[#1A1A1A]/10 p-4 space-y-2">
          {Object.entries(expectedOutput).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-[#1A1A1A] w-8 shrink-0">{key}</span>
              <span className="font-mono text-xs text-[#6C6863]">{val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CitiesByStatePage() {
  return <CitiesByStateView processFn={process} />;
}
