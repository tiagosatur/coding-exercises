import { createFileRoute } from "@tanstack/react-router";
import { CitiesByStateCourse } from "@exercises/cities-by-state/course/index";

export const Route = createFileRoute("/cities-by-state/course/")({
  component: CitiesByStateCourse,
});
