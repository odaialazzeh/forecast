import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { PageButton } from "../tableComponent/shared/Button";

const Pagination = ({
  pageOptions,
  pageCount,
  state,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  setPageSize,
}) => (
  <div className="py-1 mx-4 flex items-center justify-between">
    {/* Mobile version: simple "Previous" and "Next" buttons */}
    <div className="flex-1 flex justify-between sm:hidden">
      <PageButton onClick={previousPage} disabled={!canPreviousPage}>
        Previous
      </PageButton>
      <PageButton onClick={nextPage} disabled={!canNextPage}>
        Next
      </PageButton>
    </div>

    {/* Desktop version: full pagination controls */}
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div className="flex gap-x-2 items-baseline">
        <span className="text-sm text-gray-700 ml-3">
          <span className="mr-1">Page</span>
          <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
          <span className="font-medium">{pageOptions.length}</span>
        </span>

        {/* Select to change items per page */}
        <label>
          <span className="sr-only">Items Per Page</span>
          <select
            className="mt-1 p-2 block w-full cursor-pointer rounded-md border-gray-300 shadow-1 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={state.pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Pagination buttons */}
      <div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-1 -space-x-px"
          aria-label="Pagination"
        >
          <PageButton
            className="rounded-l-md"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            aria-label="Go to first page"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" />
          </PageButton>

          <PageButton
            onClick={previousPage}
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
          </PageButton>

          <PageButton
            onClick={nextPage}
            disabled={!canNextPage}
            aria-label="Go to next page"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </PageButton>

          <PageButton
            className="rounded-r-md"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            aria-label="Go to last page"
          >
            <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" />
          </PageButton>
        </nav>
      </div>
    </div>
  </div>
);

export default Pagination;
