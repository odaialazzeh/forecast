import React from "react";

const TableBody = ({ getTableBodyProps, page, prepareRow }) => (
  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
    {page.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
              {cell.render("Cell")}
            </td>
          ))}
        </tr>
      );
    })}
  </tbody>
);

export default TableBody;
