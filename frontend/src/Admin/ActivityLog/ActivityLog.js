import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Alert, CircularProgress } from "@mui/material";
import GlobalFilter from "../tableComponent/GlobalFilter";
import ColumnFilter from "../tableComponent/ColumnFilter";
import TableHeader from "../tableComponent/TableHeader";
import TableBody from "../tableComponent/TableBody";
import Pagination from "../tableComponent/Pagination";
import CustomDropdown from "../tableComponent/CustomDropdown"; // Import CustomDropdown
import { useGetRecordQuery } from "../../slices/recordApiSlice";

const ActivityLog = () => {
  const [selectedColumn, setSelectedColumn] = useState(""); // Track selected column for filtering
  const [resetToggle, setResetToggle] = useState(false);

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Full Name",
        id: "fullName", // Explicit ID
        accessor: (row) => `${row.user.first_name} ${row.user.last_name}`, // Combine first and last name for rendering
        Filter: ColumnFilter,
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const name = `${row.original.user.first_name.toLowerCase()} ${row.original.user.last_name.toLowerCase()}`;
            return name.includes(filterValue.toLowerCase()); // Check if the first or last name includes the filterValue
          });
        },
        Cell: ({ value }) => value, // Display combined full name in the cell
      },
      {
        Header: "Location",
        accessor: "location",
        Filter: ColumnFilter,
        id: "location",
      }, // Add ID if necessary
      { Header: "Type", accessor: "type", Filter: ColumnFilter, id: "type" }, // Add ID if necessary
      {
        Header: "Bedroom",
        accessor: "bedrooms",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
        Filter: ColumnFilter,
        id: "bedrooms", // Add ID if necessary
      },
      { Header: "Area", accessor: "area", Filter: ColumnFilter, id: "area" }, // Add ID if necessary
      { Header: "Price", accessor: "price", Filter: ColumnFilter, id: "price" }, // Add ID if necessary
      {
        Header: "Count",
        accessor: "count",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
        Filter: ColumnFilter,
        id: "count", // Add ID if necessary
      },
      {
        Header: "Date",
        accessor: "updatedAt",
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString();
        },
        Filter: ColumnFilter,
        id: "updatedAt", // Add ID if necessary
      },
    ],
    []
  );

  const { data: getRecord, error, isLoading } = useGetRecordQuery();

  const tableData = React.useMemo(
    () => (getRecord ? getRecord : []),
    [getRecord]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter, // Function for column-specific filtering
  } = useTable(
    { columns, data: tableData },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Function to handle the column selection change
  const handleColumnChange = (columnId) => {
    setSelectedColumn(columnId);
  };

  const resetFilters = () => {
    setGlobalFilter(""); // Reset the global filter to an empty string
    setSelectedColumn(""); // Clear the selected column
    columns.forEach((column) => {
      if (column.id) {
        setFilter(column.id, undefined); // Use column.id, ensure it is defined
      }
    });
    setResetToggle(!resetToggle); // Trigger the reset toggle for the dropdown
  };

  return (
    <>
      <div className="sm:flex grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-2 mx-4">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          setFilter={setFilter} // Pass the setFilter for column-specific filtering
          selectedColumn={selectedColumn} // Pass selected column to GlobalFilter
          resetToggle={resetToggle} // Pass the reset toggle to trigger reset in GlobalFilter
        />
        <div className="flex flex-row items-center justify-start gap-2">
          <div>
            <CustomDropdown
              headerGroups={headerGroups}
              selectedColumn={selectedColumn}
              handleColumnChange={handleColumnChange}
              resetToggle={resetToggle}
            />
          </div>
          <button
            onClick={resetFilters}
            className="border p-2  rounded text-white bg-primary hover:bg-secondary"
          >
            Reset
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[400px]">
          <CircularProgress />
        </div>
      ) : error ? ( // Show error alert if data fetching fails, display message from API if available
        <Alert severity="error" className="m-4">
          {error?.data?.message ||
            "Failed to load data. Please try again later."}
        </Alert>
      ) : tableData.length === 0 ? (
        <Alert severity="warning" className="m-4">
          No data available.
        </Alert>
      ) : (
        <div className="m-4 flex flex-col">
          <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow font-normal text-sm text-start overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table
                  {...getTableProps()}
                  className="min-w-full divide-y divide-gray-200"
                >
                  <TableHeader headerGroups={headerGroups} />
                  <TableBody
                    getTableBodyProps={getTableBodyProps}
                    page={page}
                    prepareRow={prepareRow}
                  />
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Pagination
        pageOptions={pageOptions}
        pageCount={pageCount}
        state={state}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
        setPageSize={setPageSize}
      />
    </>
  );
};

export default ActivityLog;
