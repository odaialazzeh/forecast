import React, { useState, useEffect } from "react";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  setFilter,
  selectedColumn,
  resetToggle, // Reset toggle to trigger input reset
}) => {
  const count = preGlobalFilteredRows.length;
  const [filterValue, setFilterValue] = useState(""); // Track the input value

  // Effect to reset input when resetToggle changes
  useEffect(() => {
    setFilterValue(""); // Clear the input when resetToggle changes
  }, [resetToggle]);

  // Handle filtering logic
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilterValue(value);

    if (selectedColumn) {
      // If a column is selected, apply the filter to that column specifically
      setFilter(selectedColumn, value);
    } else {
      // Apply global filter if no column is selected
      setGlobalFilter(value);
    }
  };

  return (
    <span>
      <input
        value={filterValue} // Use the filterValue state to control the input value
        onChange={handleFilterChange}
        placeholder={`Search`}
        className="border rounded p-2 w-64"
      />
    </span>
  );
};

export default GlobalFilter;
