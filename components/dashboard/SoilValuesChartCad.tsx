"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/types/chart/chart.interface";
import { Bar, XAxis, BarChart } from "recharts";

export const description = "A stacked bar chart with a legend";
const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];
const chartConfig = {
  running: {
    label: "Running",
    color: "var(--primary)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--primary-foreground)",
  },
} satisfies ChartConfig;

const SoilValuesChartCad = (): React.ReactElement => {
  return (
    <div className="col-span-1 flex flex-col h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle>Sensor Readings</CardTitle>
          <CardDescription>
            Latest soil sensor values and trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                }}
              />
              <Bar
                dataKey="running"
                stackId="a"
                fill="var(--color-running)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="swimming"
                stackId="a"
                fill="var(--color-swimming)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="text-muted-foreground flex min-w-32.5 items-center text-xs">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {value}
                          <span className="text-muted-foreground font-normal">
                            kcal
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilValuesChartCad;
