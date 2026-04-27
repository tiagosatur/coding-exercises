import { createFileRoute } from "@tanstack/react-router";
import { CitiesByStatePage } from "@exercises/cities-by-state/submissions/01/index";

export const Route = createFileRoute("/cities-by-state/submissions/01/")({
  component: CitiesByStatePage,
});
