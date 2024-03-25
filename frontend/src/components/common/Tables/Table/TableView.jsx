import React, { useReducer, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  FaArrowDownShortWide,
  FaArrowUpWideShort,
  FaArrowsUpDown,
} from "react-icons/fa6";
import { Col, Row, Table } from "react-bootstrap";

export function TableView({ table }) {
  const renderSortSymbol = (column) => {
    return (
      { asc: <FaArrowUpWideShort />, desc: <FaArrowDownShortWide /> }[
        column.getIsSorted()
      ] ?? <FaArrowsUpDown />
    );
  };

  return (
    <Row className="mt-3">
      <Col sm={12}>
        <Table striped bordered hover responsive>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-success link-light"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          style: header.column.getCanSort()
                            ? { cursor: "pointer" }
                            : {},
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {renderSortSymbol(header.column)}
                        {/*{{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? "a"}
                      */}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length !== 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={"100%"} className="text-center">No Data</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </Table>
      </Col>
    </Row>
  );
}
