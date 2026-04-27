import { createFileRoute } from "@tanstack/react-router";
import { CitiesByStatePage } from "@exercises/cities-by-state/submissions/02/index";

export const Route = createFileRoute("/cities-by-state/submissions/02/")({
  component: CitiesByStatePage,
});
