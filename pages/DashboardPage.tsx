"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, MapPin, Plus, X } from "lucide-react";
import DashboardWeatherCardWrapper from "@/components/dashboard/DashboardWeatherCardWrapper";
import WeatherHistoryChartCard from "@/components/dashboard/WeatherHistoryChartCard";
import ValueInputCard from "@/components/dashboard/ValueInputCard";
import PieChartCard from "@/components/dashboard/PieChartCard";
import SoilValuesChartCard from "@/components/dashboard/SoilValuesChartCard";
import PredictionSummaryCard, {
  type PredictionSummary,
} from "@/components/dashboard/PredictionSummaryCard";
import YieldPredictionChartCard from "@/components/dashboard/YieldPredictionChartCard";

const DashboardPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nValue, setNValue] = useState<string>("");
  const [pValue, setPValue] = useState<string>("");
  const [kValue, setKValue] = useState<string>("");
  const [phValue, setPhValue] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [weatherSummary, setWeatherSummary] = useState<{
    temperature_c: number;
    humidity_pct: number;
    rainfall_last_30d_mm: number;
    rainfall_daily_avg_mm: number;
  } | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FASTAPI_URL =
    process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

  // Test backend connection on mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        const res = await fetch(`${FASTAPI_URL}/health`);
        if (!res.ok) {
          console.warn(`Backend health check failed: ${res.status}`);
        }
      } catch (err) {
        console.error(
          `Cannot connect to backend at ${FASTAPI_URL}. Make sure the server is running.`,
          err,
        );
      }
    };
    testConnection();
  }, [FASTAPI_URL]);

  const parseLatLon = (value: string) => {
    const parts = value.split(",").map((p) => p.trim());
    if (parts.length !== 2) return null;
    const lat = Number(parts[0]);
    const lon = Number(parts[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
  };

  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherError(null);
    setWeatherSummary(null);
    try {
      const res = await fetch(`${FASTAPI_URL}/weather?lat=${lat}&lon=${lon}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Weather fetch failed";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson?.detail || errorJson?.error || errorMessage;
        } catch {
          errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const json = await res.json();
      if (!json?.ok) {
        throw new Error(json?.detail || json?.error || "Weather fetch failed");
      }
      setWeatherSummary(json.data);
    } catch (e: unknown) {
      const errorMessage =
        typeof e === "object" && e && "message" in e
          ? (e as { message?: string }).message || "Weather fetch failed"
          : "Weather fetch failed";
      
      // Check if it's a network error
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        setWeatherError(
          `Cannot connect to backend at ${FASTAPI_URL}. Make sure the backend server is running.`,
        );
      } else {
        setWeatherError(errorMessage);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFetchLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding - you can integrate with a geocoding API here
          const lat = Number(latitude.toFixed(6));
          const lon = Number(longitude.toFixed(6));
          setCoords({ lat, lon });
          setLocation(`${lat}, ${lon}`);
          setIsFetchingLocation(false);
          setShowManualLocation(false);
          await fetchWeather(lat, lon);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsFetchingLocation(false);
          setShowManualLocation(true);
        }
      );
    } else {
      setIsFetchingLocation(false);
      setShowManualLocation(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const parsed = coords ?? parseLatLon(location);
    if (!parsed) {
      alert("Please provide location as 'lat, lon' or use Fetch Location.");
      return;
    }

    const N = Number(nValue);
    const P = Number(pValue);
    const K = Number(kValue);
    const ph = Number(phValue);
    if (![N, P, K, ph].every((v) => Number.isFinite(v))) {
      alert("Please enter valid N, P, K and pH values.");
      return;
    }

    const fd = new FormData();
    fd.append("file", image);
    fd.append("N", String(N));
    fd.append("P", String(P));
    fd.append("K", String(K));
    fd.append("ph", String(ph));
    fd.append("lat", String(parsed.lat));
    fd.append("lon", String(parsed.lon));

    try {
      const res = await fetch(`${FASTAPI_URL}/predict`, {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Prediction failed";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson?.detail || errorJson?.error || errorMessage;
        } catch {
          errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const json = await res.json();
      if (!json?.ok) {
        throw new Error(json?.detail || json?.error || "Prediction failed");
      }

      const w = json.weather;
      setPrediction({
        soilType: json.predictions.soil_type,
        soilConfidencePct: json.predictions.soil_confidence_pct,
        recommendedCrop: json.predictions.recommended_crop,
        temperatureC: w?.temperature_c,
        humidityPct: w?.humidity_pct,
        rainfallLast30dMm: w?.rainfall_last_30d_mm,
        fertilizerRecommendation: json.predictions.fertilizer_recommendation,
        yieldPredictions: json.predictions.yield_predictions || [],
      });

      // Keep weather summary in sync too
      if (w) {
        setWeatherSummary({
          temperature_c: w.temperature_c,
          humidity_pct: w.humidity_pct,
          rainfall_last_30d_mm: w.rainfall_last_30d_mm,
          rainfall_daily_avg_mm: w.rainfall_daily_avg_mm,
        });
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "object" && err && "message" in err
          ? (err as { message?: string }).message || "Prediction failed"
          : "Prediction failed";
      
      // Check if it's a network error
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ERR_")
      ) {
        alert(
          `Cannot connect to backend at ${FASTAPI_URL}.\n\n` +
            `Please make sure:\n` +
            `1. Backend server is running: python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000\n` +
            `2. Backend is accessible at ${FASTAPI_URL}\n` +
            `3. No firewall is blocking the connection`,
        );
      } else {
        alert(errorMessage);
      }
    }
  };

  // Show dashboard content after submission
  if (isSubmitted) {
    return (
      <main className="w-full space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Comprehensive analysis of your soil, crop recommendations, and yield predictions.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <SoilValuesChartCard
            values={{
              N: Number(nValue || 0),
              P: Number(pValue || 0),
              K: Number(kValue || 0),
              ph: Number(phValue || 0),
            }}
          />
          <DashboardWeatherCardWrapper />
          {prediction ? (
            <PredictionSummaryCard prediction={prediction} />
          ) : (
            <div className="rounded-2xl p-6 bg-card/80 border border-border flex items-center justify-center min-h-45 text-muted-foreground">
              No prediction yet.
            </div>
          )}
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Quick Stats
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Soil Type</span>
                <span className="font-medium text-foreground">
                  {prediction?.soilType || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recommended Crop</span>
                <span className="font-medium text-foreground capitalize">
                  {prediction?.recommendedCrop || "—"}
                </span>
              </div>
              {prediction?.temperatureC != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium text-foreground">
                    {Math.round(prediction.temperatureC)}°C
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Yield Prediction Chart - Full Width */}
        {prediction?.yieldPredictions && prediction.yieldPredictions.length > 0 && (
          <section className="w-full">
            <YieldPredictionChartCard
              data={prediction.yieldPredictions}
              title="Crop Yield Prediction"
              subtitle="Predicted yield over the next 30 days based on current conditions"
            />
          </section>
        )}

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ValueInputCard />
          <PieChartCard
            title="NPK + pH Distribution"
            subtitle="Your submitted values"
            data={[
              { name: "N", value: Number(nValue || 0) },
              { name: "P", value: Number(pValue || 0) },
              { name: "K", value: Number(kValue || 0) },
              { name: "pH", value: Number(phValue || 0) },
            ]}
          />
          <WeatherHistoryChartCard />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Insights & Recommendations
            </h2>
            <div className="space-y-3 text-sm">
              {prediction?.fertilizerRecommendation?.fertilizer &&
                Object.keys(prediction.fertilizerRecommendation.fertilizer)
                  .length > 0 && (
                  <div className="rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                    <div className="font-medium text-foreground mb-1">
                      Top Fertilizer
                    </div>
                    <div className="text-muted-foreground">
                      {Object.entries(
                        prediction.fertilizerRecommendation.fertilizer,
                      )[0][0]
                        .replace(/_/g, " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}{" "}
                      (
                      {
                        Object.entries(
                          prediction.fertilizerRecommendation.fertilizer,
                        )[0][1]
                      }
                      )
                    </div>
                  </div>
                )}
              {prediction?.yieldPredictions &&
                prediction.yieldPredictions.length > 0 && (
                  <div className="rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                    <div className="font-medium text-foreground mb-1">
                      Average Predicted Yield
                    </div>
                    <div className="text-muted-foreground">
                      {(
                        prediction.yieldPredictions.reduce(
                          (sum, p) => sum + p.yield,
                          0,
                        ) / prediction.yieldPredictions.length
                      ).toFixed(2)}{" "}
                      Q/acre
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Next Steps
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                <span className="text-primary font-semibold">1.</span>
                <div>
                  <div className="font-medium text-foreground">
                    Apply Recommended Fertilizer
                  </div>
                  <div className="text-xs mt-1">
                    Follow the dosage recommendations for optimal results
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                <span className="text-primary font-semibold">2.</span>
                <div>
                  <div className="font-medium text-foreground">
                    Monitor Yield Trends
                  </div>
                  <div className="text-xs mt-1">
                    Track your yield predictions over the next 30 days
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                <span className="text-primary font-semibold">3.</span>
                <div>
                  <div className="font-medium text-foreground">
                    Regular Soil Testing
                  </div>
                  <div className="text-xs mt-1">
                    Update NPK values monthly for accurate predictions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Show form before submission
  return (
    <main className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Upload your data and get insights.
        </p>
      </header>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Information</CardTitle>
          <CardDescription>
            Upload an image and provide N, P, K values along with location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Upload Image
              </label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg border border-border/60 object-cover max-h-64"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-white hover:bg-destructive/90 transition"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/60 rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 transition"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* N, P, K Values Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="n-value"
                  className="text-sm font-medium text-foreground"
                >
                  Nitrogen (N)
                </label>
                <input
                  id="n-value"
                  type="number"
                  value={nValue}
                  onChange={(e) => setNValue(e.target.value)}
                  placeholder="Enter N value"
                  className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="p-value"
                  className="text-sm font-medium text-foreground"
                >
                  Phosphorus (P)
                </label>
                <input
                  id="p-value"
                  type="number"
                  value={pValue}
                  onChange={(e) => setPValue(e.target.value)}
                  placeholder="Enter P value"
                  className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="k-value"
                  className="text-sm font-medium text-foreground"
                >
                  Potassium (K)
                </label>
                <input
                  id="k-value"
                  type="number"
                  value={kValue}
                  onChange={(e) => setKValue(e.target.value)}
                  placeholder="Enter K value"
                  className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            {/* pH */}
            <div className="space-y-2">
              <label
                htmlFor="ph-value"
                className="text-sm font-medium text-foreground"
              >
                pH
              </label>
              <input
                id="ph-value"
                type="number"
                step="0.1"
                value={phValue}
                onChange={(e) => setPhValue(e.target.value)}
                placeholder="Enter pH value"
                className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            {/* Location Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={isFetchingLocation}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {isFetchingLocation ? "Fetching..." : "Fetch Location"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowManualLocation(!showManualLocation);
                    if (!showManualLocation) {
                      setLocation("");
                    }
                  }}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manually
                </Button>
              </div>
              {showManualLocation && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter as: lat, lon (example: 28.6139, 77.2090)"
                    className="w-full rounded-md border border-border/60 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const parsed = parseLatLon(location);
                      if (!parsed) {
                        alert("Enter location as: lat, lon");
                        return;
                      }
                      setCoords(parsed);
                      fetchWeather(parsed.lat, parsed.lon);
                    }}
                  >
                    Fetch Weather for this location
                  </Button>
                </div>
              )}
              {location && !showManualLocation && (
                <div className="mt-2 p-3 rounded-md bg-muted/50 border border-border/60">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Location:</span> {location}
                  </p>
                </div>
              )}
            </div>

            {/* Weather + Rainfall */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Weather (from location)
              </label>
              {weatherError && (
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-red-500">
                  {weatherError}
                </div>
              )}
              {weatherSummary ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                    <div className="text-muted-foreground text-xs">Temp</div>
                    <div className="text-foreground font-medium">
                      {Math.round(weatherSummary.temperature_c)}°C
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                    <div className="text-muted-foreground text-xs">Humidity</div>
                    <div className="text-foreground font-medium">
                      {Math.round(weatherSummary.humidity_pct)}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                    <div className="text-muted-foreground text-xs">
                      Rain (30d)
                    </div>
                    <div className="text-foreground font-medium">
                      {weatherSummary.rainfall_last_30d_mm.toFixed(1)} mm
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                    <div className="text-muted-foreground text-xs">
                      Avg / day
                    </div>
                    <div className="text-foreground font-medium">
                      {weatherSummary.rainfall_daily_avg_mm.toFixed(2)} mm
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                  Fetch location to load weather and rainfall.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default DashboardPage;
