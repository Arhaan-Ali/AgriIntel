export type DivGridProps = {
  className?: string;
  rows?: number;
  cols?: number;
  cellSize?: number;
  borderColor?: string;
  fillColor?: string;
};

export type CellStyle = React.CSSProperties & {
  isActive?: boolean;
  [key: `--${string}`]: string | number | undefined;
};
