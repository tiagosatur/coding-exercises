import { createFileRoute } from "@tanstack/react-router";
import { CitiesByStatePage } from "@exercises/cities-by-state/solutions/01/index";

export const Route = createFileRoute("/cities-by-state/solutions/01/")({
  component: CitiesByStatePage,
});
