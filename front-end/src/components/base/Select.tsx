import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefixIcon?: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택해 주세요",
  prefixIcon,
  className,
  dropdownClassName,
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
    openDirection: "up" | "down";
  } | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (target.closest(".select-portal-dropdown")) {
          return;
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const triggerCenterY = rect.top + rect.height / 2;
      const viewportHalfY = window.innerHeight / 2;
      const openDirection = triggerCenterY > viewportHalfY ? "up" : "down";
      setDropdownRect({
        top: openDirection === "up" ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openDirection,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();

      const handleScrollOrResize = () => {
        updateDropdownPosition();
      };
      // capture scroll to trace modal scroll
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full select-none", disabled && "opacity-50 pointer-events-none")}
    >
      {/* Trigger Button */}
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-between gap-2 bg-surface-container border border-outline-variant/40 text-on-surface rounded-[10px] px-4 py-2.5 transition-all duration-200 cursor-pointer hover:bg-surface-container-high focus-within:ring-2 focus-within:ring-primary/40",
          isOpen && "border-primary/80 ring-2 ring-primary/20 bg-surface-container-high shadow-md",
          error && "border-error/80 ring-2 ring-error/20",
          className
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {prefixIcon && <span className="text-on-surface-variant shrink-0">{prefixIcon}</span>}
          <span className={cn("truncate text-body-md", !selectedOption && "text-on-surface-variant")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-on-surface-variant transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </div>

      {/* Dropdown Menu via Portal */}
      {isOpen && dropdownRect && createPortal(
        <div
          className={cn(
            "select-portal-dropdown fixed z-[200] rounded-[10px] border border-glass-border bg-glass-bg/95 backdrop-blur-xl shadow-2xl max-h-60 overflow-y-auto animate-fade-in p-1",
            dropdownClassName
          )}
          style={{
            top: `${dropdownRect.top}px`,
            left: `${dropdownRect.left}px`,
            width: `${dropdownRect.width}px`,
            transform: dropdownRect.openDirection === "up" ? "translateY(-100%)" : undefined,
            marginTop: dropdownRect.openDirection === "up" ? "-8px" : "8px",
          }}
        >
          {options.length === 0 ? (
            <div className="text-on-surface-variant text-body-md py-3 px-4 text-center">
              옵션이 없습니다.
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value, option.disabled)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer text-body-md",
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface hover:bg-white/10 active:bg-white/15",
                    option.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                </div>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
