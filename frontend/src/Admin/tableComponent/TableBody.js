import React from "react";

const TableBody = ({ getTableBodyProps, page, prepareRow }) => (
  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
    {page.map((row) => {
      prepareRow(row);
      const { key: rowKey, ...rowProps } = row.getRowProps(); // Extract row key

      return (
        <tr key={rowKey} {...rowProps}>
          {row.cells.map((cell) => {
            const { key: cellKey, ...cellProps } = cell.getCellProps(); // Extract cell key
            return (
              <td key={cellKey} {...cellProps} className="px-6 py-4 whitespace-nowrap">
                {cell.render("Cell")}
              </td>
            );
          })}
        </tr>
      );
    })}
  </tbody>
);

export default TableBody;
