"use client";

import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
// NOTE: when copying to submissions/NN/, change these to "../../PropertyCard" and "../../types"
import { PropertyCard } from "../PropertyCard";
import { ListingsPage, NormalisedPage, Property } from "../types";

const FIXED_PARAMS = {
  level1: "apartamentos-para-alugar",
  level2: "pr-curitiba",
  server: "0",
  viewport: "desktop",
};

async function fetchListingsPage(page: number, quebra: string): Promise<NormalisedPage> {
  const params = new URLSearchParams({
    ...FIXED_PARAMS,
    pg: String(page),
    ...(page > 1 ? { quebra } : {}),
  });

  const res = await fetch(`/api/listings?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch page ${page}`);

  const data: ListingsPage = await res.json();

  const properties = data.items.filter(
    (item): item is Property => !("pagination" in item) && "id" in item && item.id != null
  );

  const nextParams = new URLSearchParams(data.metadata.links.nextApiParams.replace(/^\?/, ""));
  const nextPg = Number(nextParams.get("pg"));
  const totalPages = data.metadata.totalPages;

  return {
    properties,
    nextPage: nextPg <= totalPages ? nextPg : null,
  };
}

export default function InfiniteScrollExercise() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["listings"],
    queryFn: ({ pageParam }) => fetchListingsPage(pageParam as number, "[3099]"),
    initialPageParam: 1,
    getNextPageParam: (lastPage: NormalisedPage) => lastPage.nextPage ?? undefined,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── TODO: implement Intersection Observer here ──────────────────────────────
  //
  // Hints:
  //   1. Create an IntersectionObserver inside a useEffect
  //   2. Observe sentinelRef.current
  //   3. In the callback: if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
  //   4. Return a cleanup function that calls observer.disconnect()
  //   5. Re-run the effect when hasNextPage or isFetchingNextPage changes
  //
  // ───────────────────────────────────────────────────────────────────────────

  const allProperties =
    data?.pages.flatMap((page, pageIndex) =>
      page.properties.map((p) => ({ ...p, _key: `${pageIndex}-${p.id}` }))
    ) ?? [];

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider text-[#9CA3AF]">
        Carregando...
      </p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider text-[#EF4444]">
        Erro ao carregar imóveis.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-[family-name:var(--font-outfit)]">
      {/* Header — bold blue color block */}
      <header className="bg-[#3B82F6] px-6 py-12 relative overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-32 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-8 right-64 w-20 h-20 bg-white/5 rotate-45" />

        <div className="max-w-7xl mx-auto relative">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-200 mb-3">
            Exercise 03 — Infinite Scroll · Curitiba, PR
          </p>
          <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
            Apartamentos<br />para Alugar
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-100">
              {allProperties.length} imóveis carregados
            </span>
            {isFetchingNextPage && (
              <>
                <span className="text-blue-300">·</span>
                <span className="text-sm font-medium uppercase tracking-wider text-[#F59E0B]">
                  Carregando mais
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map((property) => (
            <PropertyCard key={property._key} property={property} />
          ))}
        </div>

        {/* Sentinel — attach sentinelRef here, the observer will watch it */}
        <div
          ref={sentinelRef}
          className="h-24 flex items-center justify-center mt-6"
        >
          {isFetchingNextPage && (
            <p className="text-sm font-medium uppercase tracking-wider text-[#9CA3AF]">
              Carregando mais imóveis...
            </p>
          )}
          {!hasNextPage && allProperties.length > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-0.5 bg-[#E5E7EB]" />
                <span className="text-xs font-medium uppercase tracking-widest text-[#9CA3AF]">
                  Fim dos resultados
                </span>
                <div className="w-8 h-0.5 bg-[#E5E7EB]" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
