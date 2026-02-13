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
