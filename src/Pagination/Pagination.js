import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcncomponents/ui/pagination";

const Paginationdiv = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };
  const paginationItems = () => {
    let pages = [];

    if (totalPages <= 3) {
      // Less than 3 total pages, show all pages
      pages = paginationRange(1, totalPages);
    } else {
      // More than 3 pages, calculate range to display
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pages = [1];

      if (startPage > 2) {
        pages.push("ellipsis-prev");
      }

      pages.push(...paginationRange(startPage, endPage));

      if (endPage < totalPages - 1) {
        pages.push("ellipsis-next");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            style={{ cursor: "pointer" }}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {paginationItems().map((page, index) => {
          if (page === "ellipsis-prev" || page === "ellipsis-next") {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={page}>
              <PaginationLink
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            style={{ cursor: "pointer" }}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginationdiv;
