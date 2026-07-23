"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemType?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemType = "items",
}: PaginationProps) => {
  // Compute X and Y for "Showing X–Y of Z"
  const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toItem = Math.min(totalItems, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const showLeftEllipsis = currentPage > 3;
      const showRightEllipsis = currentPage < totalPages - 2;

      if (!showLeftEllipsis && showRightEllipsis) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (showLeftEllipsis && !showRightEllipsis) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl border border-border/50 bg-secondary/20 backdrop-blur-xs w-full shadow-xs transition-all">
      {/* Showing X-Y of Z */}
      <div className="text-xs text-muted-foreground font-semibold">
        Showing <span className="text-foreground font-extrabold">{fromItem}</span>–
        <span className="text-foreground font-extrabold">{toItem}</span> of{" "}
        <span className="text-foreground font-extrabold">{totalItems}</span> {itemType}
      </div>

      {/* Pages Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-border bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-card disabled:cursor-not-allowed cursor-pointer transition-all shrink-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((pageVal, index) => {
          if (pageVal === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-xs font-bold text-muted-foreground select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = pageVal === currentPage;

          return (
            <button
              key={`page-${pageVal}`}
              onClick={() => onPageChange(pageVal as number)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer border
                ${
                  isCurrent
                    ? "bg-brand text-black border-brand shadow-lg shadow-brand/10 hover:opacity-90"
                    : "bg-card border-border hover:bg-secondary/40 text-foreground"
                }`}
            >
              {pageVal}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-xl border border-border bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-card disabled:cursor-not-allowed cursor-pointer transition-all shrink-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">
            Show:
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand/50 cursor-pointer transition-all"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">
            per page
          </span>
        </div>
      )}
    </div>
  );
};
