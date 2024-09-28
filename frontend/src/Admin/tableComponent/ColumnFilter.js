// ColumnFilter.js
import React from "react";

const ColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter
      placeholder={`Search ${count} records...`}
      className="border p-1 rounded"
    />
  );
};

export default ColumnFilter;
