"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/types/chart/chart.interface";

export type YieldPredictionData = {
  date: string;
  yield: number;
};

interface YieldPredictionChartCardProps {
  data?: YieldPredictionData[];
  title?: string;
  subtitle?: string;
}

const chartConfig = {
  yield: {
    label: "Yield (Q/acre)",
    color: "hsl(142, 76%, 36%)", // Bright lime green color matching the image
  },
} satisfies ChartConfig;

const YieldPredictionChartCard: React.FC<YieldPredictionChartCardProps> = ({
  data = [],
  title = "Yield Prediction",
  subtitle = "Predicted crop yield over the next 30 days",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No yield prediction data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <Card className="py-4 sm:py-0 rounded-2xl border border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="px-2 sm:px-6 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-64 w-full"
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                opacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="rounded-lg border bg-card shadow-lg"
                    nameKey="yield"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => [
                      `${Number(value).toFixed(2)} Q/acre`,
                      "Yield",
                    ]}
                  />
                }
              />
              <Line
                dataKey="yield"
                type="monotone"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldPredictionChartCard;

