"use server";
import type { OpenWeatherCurrentResponse } from "@/types/weather/openweather-current.interface";

export async function getWeatherData(lat: string, lon: string, units: string = "metric") {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`,
      { next: { revalidate: 120 } }
    );
    const json = await res.json();
    if (!json.ok) throw new Error(json.error);
    return { weather: json.data as OpenWeatherCurrentResponse, error: null };
  } catch (err: unknown) {
    if (typeof err === "object" && err && "message" in err) {
      return { weather: null, error: (err as { message?: string }).message || "Failed to fetch weather" };
    } else {
      return { weather: null, error: "Failed to fetch weather" };
    }
  }
}