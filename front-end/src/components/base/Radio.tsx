import React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer select-none text-label-md transition-opacity",
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:opacity-90"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        className="sr-only"
        disabled={disabled}
      />
      {/* Custom Circle */}
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 border-outline-variant/60 flex items-center justify-center transition-all duration-200",
          checked
            ? "border-primary bg-primary/5 shadow-[0_0_8px_rgba(var(--color-primary),0.3)]"
            : "bg-surface-container-high"
        )}
      >
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full bg-primary transform scale-0 transition-transform duration-200 ease-out-back",
            checked && "scale-100"
          )}
        />
      </div>
      <span className={cn("text-on-surface text-body-md font-medium", checked && "text-primary font-bold")}>
        {label}
      </span>
    </label>
  );
};

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: "circle" | "segmented";
  className?: string;
  optionClassName?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  variant = "circle",
  className,
  optionClassName,
  disabled = false,
}) => {
  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center bg-surface-container-low border border-outline-variant/30 rounded-full p-1 gap-1 select-none",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || option.disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "px-4 py-1.5 text-label-caps font-bold rounded-full transition-all tracking-wider text-xs cursor-pointer select-none whitespace-nowrap",
                isSelected
                  ? "bg-primary-container/20 text-primary border border-primary/20 shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 border border-transparent",
                option.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                optionClassName
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          label={option.label}
          disabled={disabled || option.disabled}
        />
      ))}
    </div>
  );
};
