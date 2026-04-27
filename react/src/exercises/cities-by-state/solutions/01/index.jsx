import { CitiesByStateView } from "@exercises/cities-by-state/starter/index";

/**
 * Solution — Approach: filter then reduce
 *
 * 1. Filter entries to Brazilian cities only.
 * 2. Reduce into an intermediate { [state]: string[] } map.
 * 3. Convert each city array into a comma-joined string via Object.entries + map.
 * 4. Reconstruct the final object with Object.fromEntries.
 */
export const process = (entries) =>
  Object.fromEntries(
    Object.entries(
      entries
        .filter((entry) => entry.split(', ')[2] === 'Brasil')
        .reduce((acc, entry) => {
          const [city, state] = entry.split(', ');
          return { ...acc, [state]: acc[state] ? [...acc[state], city] : [city] };
        }, {})
    ).map(([state, cities]) => [state, cities.join(', ')])
  );

export function CitiesByStatePage() {
  return <CitiesByStateView processFn={process} />;
}
