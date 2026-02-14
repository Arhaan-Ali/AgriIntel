import { NextResponse } from "next/server";
import { fetchOpenWeatherCurrent } from "@/actions/weather/fetch-openweather-current.action";
import type {
  WeatherCurrentApiQuery,
  WeatherCurrentApiResponse
} from "@/types/weather/weather-current-api.types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query: WeatherCurrentApiQuery = {
    lat: searchParams.get("lat") || "",
    lon: searchParams.get("lon") || "",
    units: (searchParams.get("units") as WeatherCurrentApiQuery["units"]) || "metric",
  };

  if (!query.lat || !query.lon) {
    const errorRes: WeatherCurrentApiResponse = {
      ok: false,
      error: "Provide lat and lon query params",
    };
    return NextResponse.json(errorRes, { status: 400 });
  }

  try {
    const data = await fetchOpenWeatherCurrent(query);
    const successRes: WeatherCurrentApiResponse = { ok: true, data };
    return NextResponse.json(successRes);
  } catch (error: unknown) {
    const errorRes: WeatherCurrentApiResponse = {
      ok: false,
      error: (typeof error === "object" && error && "message" in error)
        ? (error as { message?: string }).message || "OpenWeather fetch failed"
        : "OpenWeather fetch failed",
    };
    return NextResponse.json(errorRes, { status: 500 });
  }
}
