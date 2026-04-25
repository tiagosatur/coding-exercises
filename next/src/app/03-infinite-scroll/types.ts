export interface Property {
  id: number;
  title: string;
  url: string;
  prices: {
    main: string;
    rawPrice: number;
    condominiumFee?: string;
    iptuValue?: string;
  };
  area: {
    total: string;
    useful: string;
  } | null;
  bedrooms: { count: number } | null;
  bathrooms: { count: number } | null;
  garages: { count: number } | null;
  pictures: {
    count: number;
    featured: string | null; // e.g. "5942/36607118/pr-curitiba-...jpg"
    list: string[];
  } | null;
  location: {
    neighborhood: { name: string } | null;
    city: { name: string };
    state: { acronym: string };
    street: { name: string; addressNumber: string } | null;
    publicAddress: boolean;
  } | null;
}

export interface ListingsPage {
  items: (Property | { pagination: true })[]; // API mixes real items with pagination markers
  metadata: {
    totalPages: number;
    links: {
      nextApiParams: string; // e.g. "?level1=...&pg=2&quebra=[3099]"
    };
  };
}

// Normalised page — pagination markers filtered out
export interface NormalisedPage {
  properties: Property[];
  nextPage: number | null; // null means last page
}

const IMAGE_BASE = "https://www.chavesnamao.com.br/imn/0400X0262/N/60/imoveis/";

export function getImageUrl(featured: string | null): string | null {
  if (!featured) return null;
  return `${IMAGE_BASE}${featured}`;
}
