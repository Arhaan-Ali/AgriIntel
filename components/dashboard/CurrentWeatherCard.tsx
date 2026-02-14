import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getWeatherData } from "./getWeatherData.server";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { Thermometer, Droplets, Wind, Cloud } from "lucide-react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

interface CurrentWeatherCardProps {
  lat: string;
  lon: string;
  units?: "metric" | "imperial" | "standard";
}

// ...existing code...

function WeatherCardContent({
  lat,
  lon,
  units = "metric",
}: CurrentWeatherCardProps) {
  const [weather, setWeather] = React.useState<
    | import("@/types/weather/openweather-current.interface").OpenWeatherCurrentResponse
    | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchWeather = React.useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setWeather(null);
    getWeatherData(lat, lon, units)
      .then(({ weather, error }) => {
        if (!cancelled) {
          setWeather(weather);
          setError(error);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to fetch weather data.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lon, units]);

  React.useEffect(() => {
    const cleanup = fetchWeather();
    return cleanup;
  }, [fetchWeather]);

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto transition-colors duration-300">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Current Weather</CardTitle>
            <Button
              variant="ghost"
              onClick={fetchWeather}
              disabled={loading}
              title="Refresh weather"
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          {loading && !error && <CardDescription>Loading...</CardDescription>}
        </CardHeader>
        {weather && !loading && (
          <CardContent className="flex flex-col gap-4 items-center">
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
                    {units === "imperial"
                      ? "F"
                      : units === "metric"
                        ? "C"
                        : "K"}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2 cursor-pointer">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <span className="text-base font-semibold">
                      {Math.round(weather.main.feels_like)}°
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Feels Like</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2 cursor-pointer">
                    <Droplets className="h-5 w-5 text-primary" />
                    <span className="text-base font-semibold">
                      {weather.main.humidity}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Humidity</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2 cursor-pointer">
                    <Wind className="h-5 w-5 text-primary" />
                    <span className="text-base font-semibold">
                      {weather.wind.speed} m/s
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Wind</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center bg-accent/40 rounded-lg p-2 cursor-pointer">
                    <Cloud className="h-5 w-5 text-primary" />
                    <span className="text-base font-semibold">
                      {weather.clouds.all}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Clouds</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
}

const CurrentWeatherCard = (props: CurrentWeatherCardProps) => (
  <WeatherCardContent {...props} />
);

export default CurrentWeatherCard;
