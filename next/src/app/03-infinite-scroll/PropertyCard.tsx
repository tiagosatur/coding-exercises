import Image from "next/image";
import { Property, getImageUrl } from "./types";

export function PropertyCard({ property }: { property: Property }) {
  const imageUrl = getImageUrl(property.pictures?.featured ?? null);
  const neighborhood = property.location?.neighborhood?.name;
  const city = property.location?.city.name;

  return (
    <div className="bg-white flex flex-col group cursor-pointer transition-all duration-200 hover:scale-[1.02] rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <p className="font-[family-name:var(--font-outfit)] font-bold text-2xl text-[#111827] tracking-tight">
          {property.prices?.main ?? ""}
        </p>
        <p className="text-sm text-[#6B7280] font-[family-name:var(--font-outfit)] leading-relaxed line-clamp-2">
          {property.title}
        </p>
        {(neighborhood || city) && (
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-[family-name:var(--font-outfit)] font-medium">
            {[neighborhood, city].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {property.bedrooms && (
            <span className="bg-[#F3F4F6] text-[#374151] text-xs font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider px-3 py-1 rounded-md">
              {property.bedrooms.count} qtos
            </span>
          )}
          {property.bathrooms && (
            <span className="bg-[#F3F4F6] text-[#374151] text-xs font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider px-3 py-1 rounded-md">
              {property.bathrooms.count} banh
            </span>
          )}
          {property.garages && (
            <span className="bg-[#F3F4F6] text-[#374151] text-xs font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider px-3 py-1 rounded-md">
              {property.garages.count} vagas
            </span>
          )}
          {property.area && (
            <span className="bg-[#EFF6FF] text-[#3B82F6] text-xs font-[family-name:var(--font-outfit)] font-medium uppercase tracking-wider px-3 py-1 rounded-md">
              {property.area.useful}m²
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
