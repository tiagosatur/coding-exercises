'use client'
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type City = "Madrid" | "Barcelona" | "Seville" | "Valencia" | "Bilbao";
type BedroomOption = "Studio" | "1 bed" | "2 bed" | "3+ bed";
type PropertyType = "Apartment" | "House" | "Penthouse";

type Property = {
  id: number;
  title: string;
  city: City;
  bedrooms: BedroomOption;
  type: PropertyType;
  price: number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
  { id: 1,  title: "Gran Vía Gem",        city: "Madrid",    bedrooms: "2 bed",  type: "Apartment", price: 1400 },
  { id: 2,  title: "Gothic Quarter Flat", city: "Barcelona", bedrooms: "1 bed",  type: "Apartment", price: 1100 },
  { id: 3,  title: "Triana Studio",       city: "Seville",   bedrooms: "Studio", type: "Apartment", price:  750 },
  { id: 4,  title: "Eixample House",      city: "Barcelona", bedrooms: "3+ bed", type: "House",     price: 3200 },
  { id: 5,  title: "Retiro Penthouse",    city: "Madrid",    bedrooms: "3+ bed", type: "Penthouse", price: 4500 },
  { id: 6,  title: "Ruzafa Studio",       city: "Valencia",  bedrooms: "Studio", type: "Apartment", price:  680 },
  { id: 7,  title: "Old Town Flat",       city: "Bilbao",    bedrooms: "2 bed",  type: "Apartment", price: 1050 },
  { id: 8,  title: "Guindalera House",    city: "Madrid",    bedrooms: "3+ bed", type: "House",     price: 2800 },
  { id: 9,  title: "Gràcia Penthouse",    city: "Barcelona", bedrooms: "2 bed",  type: "Penthouse", price: 2200 },
  { id: 10, title: "El Carmen Flat",      city: "Valencia",  bedrooms: "1 bed",  type: "Apartment", price:  900 },
  { id: 11, title: "Casco Viejo Studio",  city: "Bilbao",    bedrooms: "Studio", type: "Apartment", price:  720 },
  { id: 12, title: "Nervión House",       city: "Bilbao",    bedrooms: "3+ bed", type: "House",     price: 2600 },
];

const CITIES          = ["Madrid", "Barcelona", "Seville", "Valencia", "Bilbao"] as const;
const BEDROOM_OPTIONS = ["Studio", "1 bed", "2 bed", "3+ bed"]                  as const;
const PROPERTY_TYPES  = ["Apartment", "House", "Penthouse"]                      as const;

// ─── MultiSelectFilter ────────────────────────────────────────────────────────
//
// TODO: Make this component generic.
//   1. Add a type parameter <T extends string> to both the Props type and the function.
//   2. Replace every `string` annotation inside with T.
//   Hint: function MultiSelectFilter<T extends string>({ ... }: MultiSelectFilterProps<T>)

type MultiSelectFilterProps = {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
  // TODO: implement toggle logic.
  //   - If `option` is already in `selected`, call onChange with it removed.
  //   - Otherwise, call onChange with it appended.
  const toggle = (option: string) => {
    console.log("toggle", option);
  };

  return (
    <div>
      <p className="font-[family-name:var(--font-kalam)] font-bold text-[#2d2d2d] text-lg mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              className={`
                px-3 py-1.5 border-[3px] border-[#2d2d2d] cursor-pointer
                font-[family-name:var(--font-patrick-hand)] text-sm
                transition-all duration-100
                ${active
                  ? "bg-[#ff4d4d] text-white shadow-[2px_2px_0px_0px_#2d2d2d] translate-x-[2px] translate-y-[2px]"
                  : "bg-white text-[#2d2d2d] shadow-[4px_4px_0px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white hover:shadow-[2px_2px_0px_0px_#2d2d2d] hover:translate-x-[2px] hover:translate-y-[2px]"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FilterComponentPage() {
  // TODO: once MultiSelectFilter is generic, tighten these back to City[], BedroomOption[], PropertyType[]
  const [cities,   setCities]   = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [types,    setTypes]    = useState<string[]>([]);

  // TODO: filter PROPERTIES using the three state arrays above.
  //   A property should appear only if:
  //   - its city is in `cities`   (or `cities` is empty → show all)
  //   - its bedrooms is in `bedrooms` (or `bedrooms` is empty → show all)
  //   - its type is in `types`    (or `types` is empty → show all)
  const filtered = PROPERTIES;

  const hasFilters = cities.length > 0 || bedrooms.length > 0 || types.length > 0;

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-patrick-hand)]"
      style={{
        backgroundColor: "#fdfbf7",
        backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1
            className="font-[family-name:var(--font-kalam)] font-bold text-5xl sm:text-6xl text-[#2d2d2d] mb-2"
            style={{ lineHeight: 1.1 }}
          >
            Property{" "}
            <span className="text-[#ff4d4d] inline-block -rotate-1">Filter</span>{" "}
            ✏️
          </h1>
          <p className="text-[#2d2d2d]/60 text-lg">
            Exercise 02 — Generic{" "}
            <code className="font-[family-name:var(--font-kalam)] text-[#2d5da1]">
              MultiSelectFilter&lt;T&gt;
            </code>{" "}
            with TypeScript generics
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Filter panel */}
          <aside
            className="w-full lg:w-72 shrink-0 bg-white border-[3px] border-[#2d2d2d] p-6"
            style={{
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              boxShadow: "6px 6px 0px 0px #2d2d2d",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-kalam)] font-bold text-2xl text-[#2d2d2d]">
                Filters
              </h2>
              {hasFilters && (
                <button
                  onClick={() => { setCities([]); setBedrooms([]); setTypes([]); }}
                  className="text-sm text-[#ff4d4d] underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-6">
              <MultiSelectFilter
                label="City"
                options={CITIES}
                selected={cities}
                onChange={setCities}
              />
              <div className="border-t-2 border-dashed border-[#e5e0d8]" />
              <MultiSelectFilter
                label="Bedrooms"
                options={BEDROOM_OPTIONS}
                selected={bedrooms}
                onChange={setBedrooms}
              />
              <div className="border-t-2 border-dashed border-[#e5e0d8]" />
              <MultiSelectFilter
                label="Type"
                options={PROPERTY_TYPES}
                selected={types}
                onChange={setTypes}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <p className="font-[family-name:var(--font-kalam)] text-[#2d2d2d]/50 text-sm mb-4 uppercase tracking-wide">
              {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"}
              {hasFilters ? " matching filters" : ""}
            </p>

            {filtered.length === 0 ? (
              <div
                className="bg-white border-[3px] border-dashed border-[#2d2d2d] p-12 text-center -rotate-1"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <p className="font-[family-name:var(--font-kalam)] text-2xl text-[#2d2d2d]/40">
                  Nothing here... 🤷
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((property, i) => (
                  <div
                    key={property.id}
                    className={`bg-white border-[3px] border-[#2d2d2d] p-5 transition-transform duration-100 hover:-translate-y-1 ${
                      i % 3 === 1 ? "rotate-[0.4deg]" : i % 3 === 2 ? "-rotate-[0.4deg]" : ""
                    }`}
                    style={{
                      borderRadius: "15px 255px 15px 225px / 225px 15px 255px 15px",
                      boxShadow: "4px 4px 0px 0px #2d2d2d",
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className="text-xs px-2 py-0.5 bg-[#fff9c4] border-2 border-[#2d2d2d] text-[#2d2d2d]"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        {property.type}
                      </span>
                      <span className="text-[#2d5da1] font-[family-name:var(--font-kalam)] font-bold text-lg">
                        €{property.price}/mo
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-kalam)] font-bold text-xl text-[#2d2d2d] mb-1">
                      {property.title}
                    </h3>
                    <p className="text-[#2d2d2d]/60 text-sm">
                      📍 {property.city} · {property.bedrooms}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
