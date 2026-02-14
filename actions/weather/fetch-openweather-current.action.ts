import type { OpenWeatherCurrentResponse } from "@/types/weather/openweather-current.interface";

const OPENWEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchOpenWeatherCurrent({ lat, lon, units = "metric" }: {
  lat: string;
  lon: string;
  units?: "standard" | "metric" | "imperial";
}) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) throw new Error("Missing OPENWEATHERMAP_API_KEY in .env.local");

  const url = new URL(OPENWEATHER_ENDPOINT);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", units);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenWeather API error:", errorText);
    throw new Error("Failed to fetch OpenWeather current weather data");
  }

  return response.json() as Promise<OpenWeatherCurrentResponse>;
}
