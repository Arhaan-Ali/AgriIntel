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

export const description = "Soil readings";

type SoilValues = {
  N: number;
  P: number;
  K: number;
  ph: number;
};
const chartConfig = {
  N: { label: "N", color: "var(--primary)" },
  P: {
    label: "P",
    color: "color-mix(in oklab, var(--primary) 80%, white 20%)",
  },
  K: {
    label: "K",
    color: "color-mix(in oklab, var(--primary) 60%, white 40%)",
  },
  ph: {
    label: "pH",
    color: "color-mix(in oklab, var(--primary) 60%, black 40%)",
  },
} satisfies ChartConfig;

const SoilValuesChartCard = ({
  values,
}: {
  values?: Partial<SoilValues>;
}): React.ReactElement => {
  const chartData = [
    {
      label: "Input",
      N: values?.N ?? 0,
      P: values?.P ?? 0,
      K: values?.K ?? 0,
      ph: values?.ph ?? 0,
    },
  ];

  return (
    <div className="col-span-1 flex flex-col h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle>Soil Values</CardTitle>
          <CardDescription>
            N, P, K and pH from your latest submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Bar
                dataKey="N"
                fill="var(--color-N)"
                radius={[4, 4, 4, 4]}
              />
              <Bar
                dataKey="P"
                fill="var(--color-P)"
                radius={[4, 4, 4, 4]}
              />
              <Bar
                dataKey="K"
                fill="var(--color-K)"
                radius={[4, 4, 4, 4]}
              />
              <Bar
                dataKey="ph"
                fill="var(--color-ph)"
                radius={[4, 4, 4, 4]}
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

export default SoilValuesChartCard;
