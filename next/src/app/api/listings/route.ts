import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://www.chavesnamao.com.br/api/realestate/listing/items/";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Forward whatever params the client sends (pg, level1, level2, etc.)
  const upstream = new URL(UPSTREAM);
  searchParams.forEach((value, key) => upstream.searchParams.set(key, value));

  const res = await fetch(upstream.toString(), {
    headers: {
      // Identify ourselves politely; real User-Agent avoids bot blocks
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      Accept: "application/json",
    },
    next: { revalidate: 60 }, // cache 60s so rapid dev reloads don't hammer them
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream error ${res.body}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
