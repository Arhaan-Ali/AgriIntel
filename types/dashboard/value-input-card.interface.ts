export type FieldType = {
  name: string;
  label: string;
  type: string;
  options?: string[];
};

export type ValueInputCardProps = {
  fields?: FieldType[];
  initialValues?: Record<string, string | number>;
  onChange?: (values: Record<string, string | number>) => void;
  title?: string;
  className?: string;
};
