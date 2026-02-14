"use client";
import React, { useEffect, useState } from "react";
import CurrentWeatherCard from "@/components/dashboard/CurrentWeatherCard";

const DashboardWeatherCardWrapper = () => {
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(
    null,
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      setTimeout(() => {
        if (!cancelled) {
          setGeoError("Geolocation is not supported by your browser.");
          setGeoLoading(false);
        }
      }, 0);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!cancelled) {
          setCoords({
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString(),
          });
          setGeoLoading(false);
        }
      },
      () => {
        if (!cancelled) {
          setGeoError("Unable to retrieve your location.");
          setGeoLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (geoLoading) {
    return (
      <div className="rounded-2xl p-6 bg-card/80 border border-border flex items-center justify-center min-h-45 text-muted-foreground">
        Detecting your location...
      </div>
    );
  }
  if (geoError) {
    return (
      <div className="rounded-2xl p-6 bg-card/80 border border-border flex items-center justify-center min-h-45 text-red-500">
        {geoError}
      </div>
    );
  }
  if (coords) {
    return (
      <CurrentWeatherCard lat={coords.lat} lon={coords.lon} units="metric" />
    );
  }
  return null;
};

export default DashboardWeatherCardWrapper;
