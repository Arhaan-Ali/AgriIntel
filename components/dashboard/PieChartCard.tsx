"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// Example data: can be replaced via props
const defaultData = [
  { name: "Chrome", value: 275 },
  { name: "Safari", value: 200 },
  { name: "Firefox", value: 187 },
  { name: "Edge", value: 173 },
  { name: "Other", value: 90 },
];

// Use CSS variable --primary (green) and its shades
const COLORS = [
  "var(--primary)",
  "color-mix(in oklab, var(--primary) 80%, white 20%)",
  "color-mix(in oklab, var(--primary) 60%, white 40%)",
  "color-mix(in oklab, var(--primary) 80%, black 20%)",
  "color-mix(in oklab, var(--primary) 60%, black 40%)",
];

export interface PieChartCardProps {
  title?: string;
  subtitle?: string;
  data?: { name: string; value: number }[];
  showLabels?: boolean;
  valueSuffix?: string;
  trendText?: string;
  trendValue?: string;
  trendPositive?: boolean;
  description?: string;
  className?: string;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title = "Pie Chart - Label List",
  subtitle = "January - June 2024",
  data = defaultData,
  showLabels = true,
  className = "",
  ...rest
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm w-full max-w-md mx-auto",
        className,
      )}
      {...rest}
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={showLabels ? ({ name }) => name : undefined}
              isAnimationActive={false}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCard;
