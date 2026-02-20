import type { OpenWeatherCurrentResponse } from "@/types/weather/openweather-current.interface";

const OPENWEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchOpenWeatherCurrent({ lat, lon, units = "metric" }: {
  lat: string;
  lon: string;
  units?: "standard" | "metric" | "imperial";
}) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // For local dev (or when no OpenWeather key is set), fall back to Open-Meteo (no API key).
  if (!apiKey) {
    const openMeteoUrl = new URL("https://api.open-meteo.com/v1/forecast");
    openMeteoUrl.searchParams.set("latitude", lat);
    openMeteoUrl.searchParams.set("longitude", lon);
    openMeteoUrl.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,weather_code",
    );
    openMeteoUrl.searchParams.set("timezone", "auto");

    const res = await fetch(openMeteoUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Open-Meteo API error:", errorText);
      throw new Error("Failed to fetch weather data");
    }

    const json = await res.json();
    const current = json?.current ?? {};
    const weatherCode = Number(current?.weather_code ?? 0);

    const mapWeather = (code: number): { description: string; icon: string; main: string; id: number } => {
      if (code === 0) return { id: 800, main: "Clear", description: "Clear sky", icon: "01d" };
      if (code === 1 || code === 2) return { id: 801, main: "Clouds", description: "Partly cloudy", icon: "02d" };
      if (code === 3) return { id: 804, main: "Clouds", description: "Overcast", icon: "04d" };
      if (code === 45 || code === 48) return { id: 741, main: "Mist", description: "Fog", icon: "50d" };
      if (code >= 51 && code <= 57) return { id: 300, main: "Drizzle", description: "Drizzle", icon: "09d" };
      if (code >= 61 && code <= 67) return { id: 500, main: "Rain", description: "Rain", icon: "10d" };
      if (code >= 71 && code <= 77) return { id: 600, main: "Snow", description: "Snow", icon: "13d" };
      if (code === 80 || code === 81 || code === 82) return { id: 521, main: "Rain", description: "Rain showers", icon: "09d" };
      if (code === 95 || code === 96 || code === 99) return { id: 200, main: "Thunderstorm", description: "Thunderstorm", icon: "11d" };
      return { id: 802, main: "Clouds", description: "Weather", icon: "03d" };
    };

    const mapped = mapWeather(weatherCode);
    const tempC = Number(current?.temperature_2m ?? 0);
    const humidity = Number(current?.relative_humidity_2m ?? 0);
    const wind = Number(current?.wind_speed_10m ?? 0);
    const clouds = Number(current?.cloud_cover ?? 0);

    // Units: Open-Meteo is metric by default. For local dev we keep metric even if units differs.
    const now = Math.floor(Date.now() / 1000);

    const adapted: OpenWeatherCurrentResponse = {
      coord: { lon: Number(lon), lat: Number(lat) },
      weather: [mapped],
      base: "open-meteo",
      main: {
        temp: tempC,
        feels_like: tempC,
        temp_min: tempC,
        temp_max: tempC,
        pressure: 1013,
        humidity,
      },
      visibility: 10000,
      wind: { speed: wind, deg: 0 },
      clouds: { all: clouds },
      dt: now,
      sys: { country: "", sunrise: 0, sunset: 0 },
      timezone: 0,
      id: 0,
      name: "Local",
      cod: 200,
    };

    return adapted;
  }

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
