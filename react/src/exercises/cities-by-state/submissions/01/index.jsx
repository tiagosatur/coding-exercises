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
  const result = input.filter((entry) => entry.toLowerCase().includes('brasil'))
    .reduce((acc, entry) => {
      const parts = entry.split(", ")
      const city = parts[0];
      const state = parts[1];

      if (!city || !state) {
        return acc;
      }

      acc[state] = acc[state] ? `${acc[state]}, ${city}` : `${city}`;

      return acc;
    }, {});

  return result;
};

export function CitiesByStatePage() {
  return <CitiesByStateView processFn={process} />;
}
