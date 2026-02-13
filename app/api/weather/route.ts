import { NextResponse } from "next/server";

const GOOGLE_WEATHER_ENDPOINT =
  "https://weather.googleapis.com/v1/currentConditions:lookup";

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_WEATHER_API_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const units = searchParams.get("unitsSystem") ?? "METRIC";

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Provide lat and lng query params" },
      { status: 400 }
    );
  }

  const url = new URL(GOOGLE_WEATHER_ENDPOINT);
  url.searchParams.set("location.latitude", lat);
  url.searchParams.set("location.longitude", lng);
  url.searchParams.set("unitsSystem", units);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: "Google Weather API request failed",
        status: response.status,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ ok: true, data });
}
