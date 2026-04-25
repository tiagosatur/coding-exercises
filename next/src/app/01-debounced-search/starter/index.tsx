'use client'
import { ChangeEvent } from "react";
// TODO: import useRef from react
// TODO: import useRouter, useSearchParams from next/navigation

const PLAYERS = [
  { name: "Roger Federer",      country: "Switzerland", titles: 20, surface: "All" },
  { name: "Rafael Nadal",       country: "Spain",        titles: 22, surface: "Clay" },
  { name: "Novak Djokovic",     country: "Serbia",       titles: 24, surface: "Hard" },
  { name: "Pete Sampras",       country: "USA",          titles: 14, surface: "Grass" },
  { name: "Andre Agassi",       country: "USA",          titles: 8,  surface: "Hard" },
  { name: "Serena Williams",    country: "USA",          titles: 23, surface: "Hard" },
  { name: "Steffi Graf",        country: "Germany",      titles: 22, surface: "All" },
  { name: "Martina Navratilova",country: "USA",          titles: 18, surface: "Grass" },
  { name: "Carlos Alcaraz",     country: "Spain",        titles: 3,  surface: "All" },
  { name: "Jannik Sinner",      country: "Italy",        titles: 2,  surface: "Hard" },
  { name: "Björn Borg",         country: "Sweden",       titles: 11, surface: "Clay" },
  { name: "John McEnroe",       country: "USA",          titles: 7,  surface: "Grass" },
];

const findPlayers = (query: string) => {
  return query
    ? PLAYERS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query) ||
        p.surface.toLowerCase().includes(query)
      )
    : PLAYERS;
};

export default function DebouncedSearchPage() {
  // TODO: read current query from URL with useSearchParams
  const query = "";

  // TODO: create a timeoutRef with useRef to store the debounce timer

  const filtered = findPlayers(query);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // TODO: clear the previous timeout
    // TODO: set a new 300ms timeout that calls router.push(`?search=${value}`)
    console.log(value);
  };

  return (
    <div className="min-h-screen bg-bauhaus-canvas font-[family-name:var(--font-outfit)] flex flex-col">

      {/* Top color band */}
      <div className="h-3 bg-bauhaus-blue border-b-4 border-bauhaus-black" />

      <main className="w-full max-w-4xl mx-auto px-6 py-16 flex-1">

        {/* Header */}
        <div className="mb-12 border-b-4 border-bauhaus-black pb-8">
          <div className="flex items-start gap-4 mb-2">
            <div className="mt-2 flex gap-2 shrink-0">
              <div className="w-4 h-4 bg-bauhaus-red border-2 border-bauhaus-black" />
              <div className="w-4 h-4 rounded-full bg-bauhaus-blue border-2 border-bauhaus-black" />
              <div className="w-4 h-4 bg-bauhaus-yellow border-2 border-bauhaus-black rotate-45" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-bauhaus-black">
              Debounced<br />Search
            </h1>
          </div>
          <p className="mt-4 text-base font-medium text-bauhaus-black/60 uppercase tracking-widest">
            Exercise 01 — 300ms debounce · URL sync · no reload
          </p>
        </div>

        {/* Search form */}
        <div className="flex mb-12">
          <input
            onChange={onChange}
            placeholder="TYPE TO SEARCH..."
            className="
              flex-1 px-5 py-4
              bg-white
              border-4 border-r-0 border-bauhaus-black
              shadow-[4px_4px_0px_0px_#121212]
              text-bauhaus-black font-bold uppercase tracking-wider placeholder:text-bauhaus-black/30
              text-lg
              outline-none
              focus:bg-bauhaus-yellow/20
              transition-colors duration-200
            "
          />
          <button
            type="button"
            className="
              px-8 py-4
              bg-bauhaus-red text-white
              border-4 border-bauhaus-black
              shadow-[4px_4px_0px_0px_#121212]
              font-black uppercase tracking-wider text-lg
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              transition-all duration-150 ease-out
              cursor-pointer
            "
          >
            Go
          </button>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-bauhaus-black/40">
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}{query ? ` matching "${query}"` : ""}
        </p>

        {/* Player cards */}
        {filtered.length === 0 ? (
          <div className="flex-1 border-4 border-bauhaus-black p-8 text-center shadow-[4px_4px_0px_0px_#121212]">
            <p className="font-black uppercase tracking-wider text-bauhaus-black/40">No players found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((player, i) => (
              <div
                key={player.name}
                className="
                  bg-white border-4 border-bauhaus-black
                  shadow-[6px_6px_0px_0px_#121212]
                  p-6
                  hover:-translate-y-1 transition-transform duration-200
                  relative
                "
              >
                <div className={`absolute top-3 right-3 w-3 h-3 border-2 border-bauhaus-black ${
                  i % 3 === 0 ? "bg-bauhaus-red" :
                  i % 3 === 1 ? "bg-bauhaus-blue rounded-full" :
                  "bg-bauhaus-yellow rotate-45"
                }`} />
                <p className="text-xs font-bold uppercase tracking-widest text-bauhaus-black/40 mb-1">
                  {player.country}
                </p>
                <h2 className="text-xl font-black uppercase tracking-tight text-bauhaus-black leading-tight mb-4">
                  {player.name}
                </h2>
                <div className="flex gap-3">
                  <span className="px-2 py-1 bg-bauhaus-black text-white text-xs font-bold uppercase tracking-wider">
                    {player.titles} Slams
                  </span>
                  <span className="px-2 py-1 border-2 border-bauhaus-black text-bauhaus-black text-xs font-bold uppercase tracking-wider">
                    {player.surface}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="h-2 bg-bauhaus-yellow border-t-4 border-bauhaus-black" />
    </div>
  );
}
