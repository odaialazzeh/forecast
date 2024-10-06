import React, { useState, useEffect } from "react";

const GlobalFilter = ({
  setGlobalFilter,
  setFilter,
  selectedColumn,
  resetToggle, // Reset toggle to trigger input reset
}) => {
  const [filterValue, setFilterValue] = useState(""); // Track the input value

  // Effect to reset input when resetToggle changes
  useEffect(() => {
    setFilterValue(""); // Clear the input when resetToggle changes
  }, [resetToggle]);

  // Handle filtering logic
  const handleFilterChange = (e) => {
    let value = e.target.value;

    if (selectedColumn === "count") {
      // Convert value to number for numeric columns
      value = value !== "" ? parseFloat(value) : undefined;
    } else {
      // Otherwise use text as filter
      value = value || undefined;
    }

    setFilterValue(e.target.value); // Update input display

    if (selectedColumn) {
      // Apply filter to the selected column
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
        type={selectedColumn === "count" ? "number" : "text"} // Use a number input for numeric columns
      />
    </span>
  );
};

export default GlobalFilter;
