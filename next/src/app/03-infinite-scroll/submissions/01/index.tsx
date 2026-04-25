"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PropertyCard } from "../../PropertyCard";
import { ListingsPage, NormalisedPage, Property } from "../../types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // Frozen on mount — back navigation remounts the component with the URL's pg value,
  // which we use only as a scroll target, not as the query start page.
  const [initialPage] = useState(() => Number(searchParams.get("pg")) || 1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // How many pages were already in the TanStack Query cache when this instance mounted.
  // We don't push URL entries for those — they represent a previous session's scroll.
  const mountTimePagesCountRef = useRef(0);
  // Ensures we only do the initial scroll-to-page once per mount.
  const hasRestoredScrollRef = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    // Key has no initialPage — all mounts share the same cache entry.
    queryKey: ["listings"],
    queryFn: ({ pageParam }) => fetchListingsPage(pageParam as number, "[3099]"),
    // Always start from page 1 so the full page sequence is in one cache entry.
    initialPageParam: 1,
    getNextPageParam: (lastPage: NormalisedPage) => lastPage.nextPage ?? undefined,
    // Keep cache fresh long enough that back-navigation remounts get data instantly.
    staleTime: 5 * 60 * 1000,
  });

  const loadedPagesCount = data?.pages.length ?? 0;

  // Capture cache size at mount time (runs once, before the effects below).
  useEffect(() => {
    mountTimePagesCountRef.current = loadedPagesCount;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the cache doesn't yet include initialPage (e.g. user shared a deep link
  // and the cache is cold), keep fetching until we reach it.
  useEffect(() => {
    if (!data || !hasNextPage) return;
    const lastLoaded = data.pageParams[data.pages.length - 1] as number;
    if (lastLoaded < initialPage) fetchNextPage();
  }, [data, initialPage, hasNextPage, fetchNextPage]);

  // Scroll restoration: once the target page is in the DOM, jump to it.
  useEffect(() => {
    if (hasRestoredScrollRef.current) return;
    if (!loadedPagesCount) return;
    if (initialPage <= 1) {
      hasRestoredScrollRef.current = true;
      return;
    }
    const lastLoaded = data!.pageParams[loadedPagesCount - 1] as number;
    if (lastLoaded < initialPage) return; // still catching up

    const targetIndex = data!.pageParams.findIndex(p => (p as number) >= initialPage);
    if (targetIndex < 0) return;

    hasRestoredScrollRef.current = true;
    requestAnimationFrame(() => {
      pageRefs.current[targetIndex]?.scrollIntoView({ behavior: "instant" });
    });
  }, [data, initialPage, loadedPagesCount]);

  // URL sync: push a history entry only for pages the user actually scrolled to,
  // not for pages restored from cache (those already have history entries).
  useEffect(() => {
    if (!loadedPagesCount) return;
    if (loadedPagesCount <= mountTimePagesCountRef.current) return;
    const lastPageNum = data?.pageParams[loadedPagesCount - 1] as number;
    if (!lastPageNum) return;
    const currentPg = Number(new URLSearchParams(window.location.search).get("pg")) || 1;
    if (lastPageNum === currentPg) return;
    router.push(`${pathname}?pg=${lastPageNum}`, { scroll: false });
  }, [loadedPagesCount, data, pathname, router]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { rootMargin: "200px" });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
        <div className="flex flex-col">
          {data?.pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              ref={el => { pageRefs.current[pageIndex] = el; }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 [&:not(:first-child)]:mt-6"
            >
              {page.properties.map((property) => (
                <PropertyCard key={`${pageIndex}-${property.id}`} property={property} />
              ))}
            </div>
          ))}
        </div>

        {/* Sentinel */}
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
