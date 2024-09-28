import React from "react";
import {
  SortIcon,
  SortUpIcon,
  SortDownIcon,
} from "../tableComponent/shared/Icons";

const TableHeader = ({ headerGroups }) => (
  <thead className="bg-secondary">
    {headerGroups.map((headerGroup, headerGroupIndex) => {
      const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
      return (
        <tr key={key || headerGroupIndex} {...restHeaderGroupProps}>
          {headerGroup.headers.map((column, columnIndex) => {
            const { key, ...restColumnProps } = column.getHeaderProps(
              column.getSortByToggleProps()
            );
            return (
              <th
                key={key || columnIndex} // Apply key directly to the <th> element
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                {...restColumnProps} // Spread remaining props without the key
              >
                <div className="flex items-center justify-between">
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <SortDownIcon className="w-4 h-4 text-white" />
                      ) : (
                        <SortUpIcon className="w-4 h-4 text-white" />
                      )
                    ) : (
                      <SortIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                    )}
                  </span>
                </div>
              </th>
            );
          })}
        </tr>
      );
    })}
  </thead>
);

export default TableHeader;
