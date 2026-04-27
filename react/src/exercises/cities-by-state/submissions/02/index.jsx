import { CitiesByStateView } from "@exercises/cities-by-state/starter/index";

/**
 * Implement `process` so that, given `input` (a list of strings in the format
 * "City, State, Country"), it returns an object grouped by Brazilian state (UF).
 *
 * Rules
 * - No imperative loops: for, while, do/while, for...in, for...of, forEach
 * - Use only Array and Object methods
 *
 * Expected output shape:
 * {
 *   SP: "São Paulo, Marília, Santos",
 *   PR: "Curitiba, Londrina, Maringá",
 *   RJ: "Rio de Janeiro, Petrópolis",
 *   BA: "Salvador",
 * }
 */

export const process = (input) => {
  const brazilianEntries = input.filter(
    (entry) => entry.toLowerCase().includes('brasil')
  );
  const grouped = Object.groupBy(
    brazilianEntries,
    (entry) => entry.split(', ')[1] // group by state
  );

  return Object.fromEntries(
    Object.entries(grouped)
      .map(([state, stateEntries]) => [
        state,
        stateEntries
          .map((entry) => entry.split(', ')[0]).join(', '),
      ])
  );
};

export function CitiesByStatePage() {
  return <CitiesByStateView processFn={process} />;
}
