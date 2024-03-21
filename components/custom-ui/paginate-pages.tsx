import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
const PaginatePages: React.FC<Props> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}): JSX.Element => {
  const handlePrevious = (): void => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
  };

  const handleNext = (): void => {
    setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage);
  };

  // Helper function to render page numbers
  const renderPageNumbers = (): React.JSX.Element[] => {
    const pageNumbers = [];

    // Display the first page number if it's not the current page
    if (currentPage > 2) {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => {
              setCurrentPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Display the ellipsis if the current page is greater than 3
    if (currentPage > 3) {
      pageNumbers.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Display the current page and two adjacent pages
    const startPage = Math.max(currentPage - 1, 1);
    const endPage = Math.min(currentPage + 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => {
              setCurrentPage(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Display the ellipsis if there are more pages after the current page
    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Display the last page number if it's not the current page
    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => {
              setCurrentPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          onClick={handlePrevious}
          isActive={currentPage !== 1}
          iconOnly={true}
        />
        {renderPageNumbers()}
        <PaginationNext
          onClick={handleNext}
          isActive={currentPage !== totalPages}
          iconOnly={true}
        />
      </PaginationContent>
    </Pagination>
  );
};

export default PaginatePages;
