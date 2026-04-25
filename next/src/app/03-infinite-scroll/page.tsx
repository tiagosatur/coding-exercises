"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ← change this import to switch between submissions (or "./starter" to reset)
import Solution from "./submissions/01";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Solution />
    </QueryClientProvider>
  );
}
