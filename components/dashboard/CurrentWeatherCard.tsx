"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { OpenWeatherCurrentResponse } from "@/types/weather/openweather-current.interface";

interface CurrentWeatherCardProps {
  lat: string;
  lon: string;
  units?: "metric" | "imperial" | "standard";
}

export default function CurrentWeatherCard({
  lat,
  lon,
  units = "metric",
}: CurrentWeatherCardProps) {
  const [weather, setWeather] = useState<OpenWeatherCurrentResponse | null>(
    null,
  );
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, units]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`,
      );
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setWeather(json.data);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "message" in err) {
        setError(
          (err as { message?: string }).message || "Failed to fetch weather",
        );
      } else {
        setError("Failed to fetch weather");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, units]);

  return (
    <div
      className={cn(
        // Card container
        "rounded-2xl p-4 sm:p-6 shadow-lg border border-border bg-card/80 dark:bg-card/60 flex flex-col gap-4 w-full max-w-md mx-auto",
        "transition-colors duration-300",
        loading && "opacity-60 animate-pulse",
      )}
    >
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
        Current Weather
      </h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!weather && !error && (
        <div className="text-muted-foreground text-sm">Loading...</div>
      )}
      {weather && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={64}
              height={64}
              className="w-16 h-16 drop-shadow-md"
              priority
            />
            <div className="flex flex-col items-center sm:items-start">
              <div className="text-3xl sm:text-4xl font-semibold text-primary">
                {Math.round(weather.main.temp)}°
                <span className="text-base font-normal text-muted-foreground align-top ml-1">
                  {units === "imperial" ? "F" : units === "metric" ? "C" : "K"}
                </span>
              </div>
              <div className="capitalize text-base sm:text-lg text-foreground">
                {weather.weather[0].description}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {weather.name}, {weather.sys.country}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2">
              <span className="font-medium text-xs text-foreground">
                Feels Like
              </span>
              <span className="text-base font-semibold">
                {Math.round(weather.main.feels_like)}°
              </span>
            </div>
            <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2">
              <span className="font-medium text-xs text-foreground">
                Humidity
              </span>
              <span className="text-base font-semibold">
                {weather.main.humidity}%
              </span>
            </div>
            <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2">
              <span className="font-medium text-xs text-foreground">Wind</span>
              <span className="text-base font-semibold">
                {weather.wind.speed} m/s
              </span>
            </div>
            <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2">
              <span className="font-medium text-xs text-foreground">
                Clouds
              </span>
              <span className="text-base font-semibold">
                {weather.clouds.all}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
