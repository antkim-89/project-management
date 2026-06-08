import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  value?: string; // YYYY-MM-DD (single mode)
  onChange?: (date: string) => void; // (single mode)
  mode?: "single" | "range";
  rangeValue?: { startDate: string; endDate: string };
  onRangeChange?: (range: { startDate: string; endDate: string }) => void;
  error?: string;
}

export function CalendarPicker({
  value,
  onChange,
  mode = "single",
  rangeValue,
  onRangeChange,
  error,
}: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial selected date or default to today
  const selectedDate = mode === "single" && value ? new Date(value) : null;

  // Track currently viewed month/year in picker
  const [currentDate, setCurrentDate] = useState(() => {
    if (mode === "single" && selectedDate) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    } else if (mode === "range" && rangeValue?.startDate) {
      const start = new Date(rangeValue.startDate);
      return new Date(start.getFullYear(), start.getMonth(), 1);
    }
    return new Date();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    openDirection: "up" | "down";
  } | null>(null);

  // Close calendar popover on click outside
  useClickOutside(containerRef, () => setIsOpen(false), triggerRef);

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const triggerCenterY = rect.top + rect.height / 2;
      const viewportHalfY = window.innerHeight / 2;
      const openDirection = triggerCenterY > viewportHalfY ? "up" : "down";
      setDropdownRect({
        top: openDirection === "up" ? rect.top : rect.bottom,
        left: rect.left,
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
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to generate days in month
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Helper to get first day index of the month (0 = Sunday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Previous month days to fill empty spots before 1st
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getCellDateString = (day: number, type: "current" | "prev" | "next") => {
    let y = year;
    let m = month;
    if (type === "prev") {
      m = month - 1;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
    } else if (type === "next") {
      m = month + 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
    }
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const handleDateSelect = (
    day: number,
    isCurrentMonth: "current" | "prev" | "next",
  ) => {
    const formattedDate = getCellDateString(day, isCurrentMonth);

    if (mode === "single") {
      if (onChange) {
        onChange(formattedDate);
      }
      setIsOpen(false);
    } else if (mode === "range" && onRangeChange) {
      const currentStart = rangeValue?.startDate;
      const currentEnd = rangeValue?.endDate;

      if (!currentStart || (currentStart && currentEnd)) {
        onRangeChange({ startDate: formattedDate, endDate: "" });
      } else {
        const start = new Date(currentStart);
        const selected = new Date(formattedDate);

        if (selected < start) {
          onRangeChange({ startDate: formattedDate, endDate: "" });
        } else {
          onRangeChange({ startDate: currentStart, endDate: formattedDate });
          setIsOpen(false);
        }
      }
    }
  };

  // Generate calendar grid array
  const calendarCells = [];

  // Fill in empty cells with previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      type: "prev" as const,
    });
  }

  // Fill in active month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      type: "current" as const,
    });
  }

  // Fill remaining cells with next month's starting days to complete the 6-row layout (42 cells)
  const totalCells = 42;
  const nextMonthFill = totalCells - calendarCells.length;
  for (let i = 1; i <= nextMonthFill; i++) {
    calendarCells.push({
      day: i,
      type: "next" as const,
    });
  }

  // Days of the week header
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const isSelected = (day: number, type: "current" | "prev" | "next") => {
    const cellDateStr = getCellDateString(day, type);
    if (mode === "single") {
      return value === cellDateStr;
    } else {
      return (
        rangeValue?.startDate === cellDateStr ||
        rangeValue?.endDate === cellDateStr
      );
    }
  };

  const isRangeStart = (day: number, type: "current" | "prev" | "next") => {
    if (mode !== "range" || !rangeValue?.startDate) return false;
    return rangeValue.startDate === getCellDateString(day, type);
  };

  const isRangeEnd = (day: number, type: "current" | "prev" | "next") => {
    if (mode !== "range" || !rangeValue?.endDate) return false;
    return rangeValue.endDate === getCellDateString(day, type);
  };

  const isInRange = (day: number, type: "current" | "prev" | "next") => {
    if (mode !== "range" || !rangeValue?.startDate || !rangeValue?.endDate) return false;
    const cellDate = new Date(getCellDateString(day, type));
    const start = new Date(rangeValue.startDate);
    const end = new Date(rangeValue.endDate);
    return cellDate > start && cellDate < end;
  };

  const isToday = (day: number, type: "current" | "prev" | "next") => {
    if (type !== "current") return false;
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  return (
    <div className="relative w-full">
      {/* Date Input Field Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center font-mono cursor-pointer w-full bg-surface-container-low border text-on-surface rounded-[10px] pl-11 pr-4 py-3 outline-none transition-all text-body-md select-none",
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-outline-variant/30",
          error ? "border-error" : "",
        )}
      >
        <CalendarIcon className="absolute left-4 w-4 h-4 text-on-surface-variant pointer-events-none" />
        <span>
          {mode === "single"
            ? value || "날짜 선택"
            : rangeValue?.startDate
              ? rangeValue.endDate
                ? `${rangeValue.startDate} ~ ${rangeValue.endDate}`
                : `${rangeValue.startDate} ~ 기간 선택`
              : "기간 선택"}
        </span>
      </div>

      {/* Calendar Popover via Portal */}
      {isOpen && dropdownRect && createPortal(
        <div
          ref={containerRef}
          style={{
            position: "fixed",
            top: `${dropdownRect.top}px`,
            left: `${dropdownRect.left}px`,
            transform: dropdownRect.openDirection === "up" ? "translateY(-100%)" : undefined,
            marginTop: dropdownRect.openDirection === "up" ? "-8px" : "8px",
          }}
          className="z-[200] w-80 bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/35 rounded-[20px] p-4 shadow-2xl animate-fade-in flex flex-col gap-4 select-none"
        >
          {/* Header: Month & Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-interaction-hover text-on-surface transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-title-sm text-on-surface">
              {year}년 {month + 1}월
            </h4>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-interaction-hover text-on-surface transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-on-surface-variant mb-1">
            {weekDays.map((wd, index) => (
              <span
                key={wd}
                className={cn(
                  index === 0 ? "text-error" : "",
                  index === 6 ? "text-secondary" : "",
                )}
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-0 text-center font-mono text-body-sm">
            {calendarCells.map((cell, index) => {
              const dayOfWeek = index % 7;
              const active = isSelected(cell.day, cell.type);
              const activeStart = isRangeStart(cell.day, cell.type);
              const activeEnd = isRangeEnd(cell.day, cell.type);
              const inRange = isInRange(cell.day, cell.type);
              const today = isToday(cell.day, cell.type);
              const isOtherMonth = cell.type !== "current";

              // Determine classes for styling ranges
              let cellClass = "";
              if (mode === "single") {
                cellClass = cn(
                  "rounded-full",
                  active
                    ? "bg-primary text-on-primary hover:bg-primary/95 shadow-md shadow-primary/20 scale-105"
                    : "",
                );
              } else {
                if (activeStart && activeEnd) {
                  cellClass = "bg-primary text-on-primary rounded-full shadow-md shadow-primary/20 scale-105 z-10";
                } else if (activeStart) {
                  cellClass = "bg-primary text-on-primary rounded-l-full rounded-r-none shadow-md shadow-primary/20 scale-105 z-10";
                } else if (activeEnd) {
                  cellClass = "bg-primary text-on-primary rounded-r-full rounded-l-none shadow-md shadow-primary/20 scale-105 z-10";
                } else if (inRange) {
                  cellClass = "bg-primary/15 text-primary rounded-none hover:bg-primary/25";
                }
              }

              return (
                <button
                  key={`${cell.type}-${cell.day}-${index}`}
                  type="button"
                  onClick={() => handleDateSelect(cell.day, cell.type)}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center text-xs font-bold transition-all relative active:scale-90 hover:scale-105 cursor-pointer",
                    cellClass,
                    !active && !activeStart && !activeEnd && !inRange && (
                      isOtherMonth
                        ? "text-on-surface-variant/20 hover:bg-interaction-hover/40 rounded-full"
                        : "text-on-surface hover:bg-interaction-hover rounded-full"
                    ),
                    dayOfWeek === 0 && !isOtherMonth && !active && !activeStart && !activeEnd && !inRange
                      ? "text-error"
                      : "",
                    dayOfWeek === 6 && !isOtherMonth && !active && !activeStart && !activeEnd && !inRange
                      ? "text-secondary"
                      : "",
                    today && !active && !activeStart && !activeEnd
                      ? "border border-primary text-primary rounded-full"
                      : "",
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
