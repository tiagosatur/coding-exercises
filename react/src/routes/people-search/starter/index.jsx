import { createFileRoute } from "@tanstack/react-router";
import { PeopleSearchPage } from "@exercises/people-search/starter/index";

export const Route = createFileRoute("/people-search/starter/")({
  component: PeopleSearchPage,
});
