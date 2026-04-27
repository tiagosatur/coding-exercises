import { createFileRoute } from "@tanstack/react-router";
import { CitiesByStatePage } from "@exercises/cities-by-state/starter/index";

export const Route = createFileRoute("/cities-by-state/starter/")({
  component: CitiesByStatePage,
});
