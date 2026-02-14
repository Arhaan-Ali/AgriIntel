// Types for /api/weather/current route
import type { OpenWeatherCurrentResponse } from "./openweather-current.interface";

export interface WeatherCurrentApiQuery {
  lat: string;
  lon: string;
  units?: "metric" | "imperial" | "standard";
}

export interface WeatherCurrentApiSuccess {
  ok: true;
  data: OpenWeatherCurrentResponse;
}

export interface WeatherCurrentApiError {
  ok: false;
  error: string;
}

export type WeatherCurrentApiResponse = WeatherCurrentApiSuccess | WeatherCurrentApiError;
