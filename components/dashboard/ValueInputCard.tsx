"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type {
  FieldType,
  ValueInputCardProps,
} from "@/types/dashboard/value-input-card.interface";

const defaultFields: FieldType[] = [
  { name: "nitrogen", label: "Nitrogen (%)", type: "number" },
  { name: "phosphorus", label: "Phosphorus (%)", type: "number" },
  { name: "potassium", label: "Potassium (%)", type: "number" },
  { name: "moisture", label: "Moisture (%)", type: "number" },
  { name: "soilType", label: "Soil Type", type: "text" },
  { name: "farmSize", label: "Farm Size (acres)", type: "number" },
  { name: "location", label: "Location", type: "text" },
];

const ValueInputCard: React.FC<ValueInputCardProps> = ({
  fields = defaultFields,
  initialValues = {},
  onChange,
  title = "Input Values",
  className = "",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Record<string, string | number>>({
    defaultValues: fields.reduce(
      (acc, f) => {
        acc[f.name] = initialValues[f.name] ?? "";
        return acc;
      },
      {} as Record<string, string | number>,
    ),
    mode: "onBlur",
  });

  // Watch values and call onChange if provided
  const watchedValues = watch();
  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  const onSubmit = (data: Record<string, string | number>) => {
    // You can handle submit here or pass up
    // For now, just log
    console.log("Form submitted", data);
  };

  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-6 shadow-sm lg:col-span-2 ${className}`}
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <form
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {fields.map((field) => {
          // Validation rules
          const rules: Record<string, unknown> = {};
          if (field.type === "number") {
            rules.required = `${field.label} is required`;
            rules.min = { value: 0, message: "Must be >= 0" };
            rules.max = { value: 100, message: "Must be <= 100" };
          } else if (field.type === "text") {
            rules.required = `${field.label} is required`;
            rules.minLength = { value: 2, message: "Too short" };
          } else if (field.type === "select") {
            rules.required = `${field.label} is required`;
          }
          return (
            <div key={field.name} className="flex flex-col">
              {field.type === "select" && field.options ? (
                <select
                  id={field.name}
                  {...register(field.name, rules)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-10 px-4 placeholder:pl-4"
                >
                  <option value="">{field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  {...register(field.name, rules)}
                  placeholder={field.label}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-10 px-4 placeholder:pl-0 placeholder:text-neutral-300"
                  autoComplete="off"
                />
              )}
              {errors[field.name] && (
                <span className="text-xs text-red-500 mt-1">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="rounded-lg bg-primary text-white py-2 px-4 font-semibold shadow-sm hover:bg-primary/80 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ValueInputCard;
