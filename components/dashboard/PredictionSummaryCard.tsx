"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PredictionSummary = {
  soilType: string;
  soilConfidencePct?: number;
  recommendedCrop: string;
  temperatureC?: number;
  humidityPct?: number;
  rainfallLast30dMm?: number;
  fertilizerRecommendation?: {
    fertilizer?: Record<string, string>;
    micronutrients?: string[];
    dosage?: Array<Record<string, string>>;
  };
  yieldPredictions?: Array<{ date: string; yield: number }>;
};

const PredictionSummaryCard = ({
  prediction,
}: {
  prediction: PredictionSummary;
}) => {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>Predictions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2">
          <span className="text-muted-foreground">Soil type</span>
          <span className="font-medium text-foreground">
            {prediction.soilType}
            {typeof prediction.soilConfidencePct === "number"
              ? ` (${prediction.soilConfidencePct.toFixed(1)}%)`
              : ""}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2">
          <span className="text-muted-foreground">Recommended crop</span>
          <span className="font-medium text-foreground">
            {prediction.recommendedCrop}
          </span>
        </div>
        {(prediction.temperatureC != null ||
          prediction.humidityPct != null ||
          prediction.rainfallLast30dMm != null) && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
              <div className="text-muted-foreground">Temp</div>
              <div className="font-medium text-foreground">
                {prediction.temperatureC != null
                  ? `${Math.round(prediction.temperatureC)}°C`
                  : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
              <div className="text-muted-foreground">Humidity</div>
              <div className="font-medium text-foreground">
                {prediction.humidityPct != null
                  ? `${Math.round(prediction.humidityPct)}%`
                  : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
              <div className="text-muted-foreground">Rain (30d)</div>
              <div className="font-medium text-foreground">
                {prediction.rainfallLast30dMm != null
                  ? `${prediction.rainfallLast30dMm.toFixed(1)} mm`
                  : "—"}
              </div>
            </div>
          </div>
        )}
        {prediction.fertilizerRecommendation && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="text-sm font-semibold text-foreground">
              Fertilizer Recommendation
            </div>
            {prediction.fertilizerRecommendation.fertilizer &&
              Object.keys(prediction.fertilizerRecommendation.fertilizer).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(
                    prediction.fertilizerRecommendation.fertilizer,
                  ).map(([name, confidence]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                    >
                      <span className="text-muted-foreground capitalize">
                        {name.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium text-foreground">
                        {confidence}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            {prediction.fertilizerRecommendation.dosage &&
              prediction.fertilizerRecommendation.dosage.length > 0 && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Dosage:
                  </div>
                  {prediction.fertilizerRecommendation.dosage.map((dose, idx) =>
                    Object.entries(dose).map(([name, value]) => (
                      <div
                        key={`${name}-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-xs"
                      >
                        <span className="text-muted-foreground capitalize">
                          {name.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium text-foreground">
                          {value}
                        </span>
                      </div>
                    )),
                  )}
                </div>
              )}
            {(!prediction.fertilizerRecommendation.fertilizer ||
              Object.keys(prediction.fertilizerRecommendation.fertilizer)
                .length === 0) &&
              (!prediction.fertilizerRecommendation.dosage ||
                prediction.fertilizerRecommendation.dosage.length === 0) && (
                <div className="text-xs text-muted-foreground">
                  No fertilizer recommendation available.
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionSummaryCard;


