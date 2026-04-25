import { createFileRoute } from "@tanstack/react-router";
import { PeopleSearchPage } from "@exercises/people-search/submissions/01/index";

export const Route = createFileRoute("/people-search/submissions/01/")({
  component: PeopleSearchPage,
});
