import React, { useMemo } from "react";
import { flexRender } from "@tanstack/react-table";
import { Button, ButtonGroup, Col, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import {
  FaArrowDownShortWide,
  FaArrowUpWideShort,
  FaArrowsUpDown,
} from "react-icons/fa6";
import { DebouncedInput } from "../../../common/Tables/Filters/Inputs/DebouncedInput";
export function ServersTableView({
  table,
  globalFilter,
  setGlobalFilter,
  FilterComponent,
}) {

  const renderSortSymbol = (column) => {
    return column.getCanSort()
      ? {
          asc: <FaArrowUpWideShort fontSize={"1rem"} />,
          desc: <FaArrowDownShortWide fontSize={"1rem"} />,
        }[column.getIsSorted()] ?? <FaArrowsUpDown fontSize={"1rem"} />
      : "";
  };

  return (
    <>
      <Table
        striped
        bordered
        hover
        responsive
        className="custom-table-crud-responsives"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {/* You can place console.log or comments inside the map function */}
                {/* This will generate a row for each header group */}
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {/* Conditional rendering based on header properties */}
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none fixed-width"
                              : ""
                          }
                          style={
                            header.column.getCanSort()
                              ? { cursor: "pointer", minWidth: "100%" }
                              : {}
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <Row className="d-flex align-items-center justify-content-center">
                            <Col sm={8}>
                              {/* Rendering header content */}
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Col>
                            <Col sm={2}>{renderSortSymbol(header.column)}</Col>
                          </Row>
                        </div>
                      )}
                      {/* Optionally render filter input */}
                      {header.column.getCanFilter() ? (
                        <div>
                          {FilterComponent ? (
                            <>
                              <FilterComponent
                                column={header.column}
                                table={table}
                              />
                            </>
                          ) : (
                            <Filter column={header.column} table={table} />
                          )}
                        </div>
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody>
          {table.getRowModel().rows.length !== 0 ? (
            table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={"100%"} className="text-center">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Row className="mt-3">
        <Col className="d-flex justify-content-start">
          <InputGroup.Text>Página</InputGroup.Text>
          <FormControl
            type="number"
            min={0}
            max={table.getPageCount()}
            placeholder="Núm. Página"
            aria-label=""
            aria-describedby=""
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />

          <InputGroup.Text>
            <strong>
              {" "}
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </strong>
          </InputGroup.Text>
        </Col>
        <Col className="d-flex justify-content-end ">
          <ButtonGroup>
            <Button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  );
}

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
