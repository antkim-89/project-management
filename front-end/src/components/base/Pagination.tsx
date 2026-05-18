import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  // If only 1 page, don't show pagination controls
  if (totalPages <= 1) return null;

  // Generate page range
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    // Total pages to show is siblingCount + firstPage + lastPage + currentPage + 2*ellipses
    const totalPageNumbers = siblingCount + 5;

    // If totalPages is less than the numbers we want to show, return all
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "DOTS", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "DOTS", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "DOTS", ...middleRange, "DOTS", totalPages];
    }

    return range(1, totalPages);
  };

  const pageNumbers = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5 select-none", className)}>
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-all cursor-pointer hover:bg-white/10 hover:text-on-surface disabled:opacity-40 disabled:pointer-events-none"
        )}
      >
        <ChevronLeft className="w-4.5 h-4.5" />
      </button>

      {/* Pages */}
      {pageNumbers.map((page, idx) => {
        if (page === "DOTS") {
          return (
            <span
              key={`dots-${idx}`}
              className="px-1 text-on-surface-variant text-label-md font-bold select-none cursor-default"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-label-md font-bold transition-all cursor-pointer",
              isCurrent
                ? "bg-primary-container/20 text-primary border border-primary/30 shadow-sm"
                : "border border-outline-variant/30 text-on-surface-variant hover:bg-white/10 hover:text-on-surface hover:border-outline-variant/50"
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-all cursor-pointer hover:bg-white/10 hover:text-on-surface disabled:opacity-40 disabled:pointer-events-none"
        )}
      >
        <ChevronRight className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};
