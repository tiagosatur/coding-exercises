import { useQuery } from "@tanstack/react-query";
import { fetchPeople } from "../api/jikan";

export function usePeopleQuery({ query }) {
  return useQuery({
    queryKey: ["people", query],
    queryFn: () => fetchPeople({ query }),
    retry: 0,
  });
}
