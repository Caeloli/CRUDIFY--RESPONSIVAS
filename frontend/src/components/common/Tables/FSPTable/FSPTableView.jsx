import { flexRender } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormControl,
  FormSelect,
  FormText,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaArrowDownShortWide,
  FaArrowUpWideShort,
  FaArrowsUpDown,
} from "react-icons/fa6";
import "../Tables.scss";
/*
  position: sticky;
  left: 0;
  background-color: #f8f9fa; 
  z-index: 1;
*/

export function FSPTableView({
  table,
  fixedColumns,
  globalFilter,
  setGlobalFilter,
  FilterComponent,
  tableStyles,
}) {
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const renderSortSymbol = (column) => {
    return column.getCanSort()
      ? {
          asc: <FaArrowUpWideShort fontSize={"1rem"} />,
          desc: <FaArrowDownShortWide fontSize={"1rem"} />,
        }[column.getIsSorted()] ?? <FaArrowsUpDown fontSize={"1rem"} />
      : "";
  };
  return (
    <Container>
      <Row className="gap-3 justify-content-between">
        <Col sm={12} md={4}>
          <InputGroup>
            <InputGroup.Text>Mostrando</InputGroup.Text>
            <FormSelect
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(e.target.value);
              }}
            >
              {[10, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </FormSelect>
            <InputGroup.Text>Registros</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col sm={12} md={4}>
          <InputGroup>
            <InputGroup.Text>Búsqueda</InputGroup.Text>
            <FormControl
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              placeholder="Buscar..."
            ></FormControl>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={12}>
          <Table
            striped
            bordered
            hover
            responsive
            className="custom-table-crud-responsives"
            style={tableStyles}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const position = fixedColumns
                      .map((fixedColumn) =>
                        fixedColumn.name.includes(header.id)
                          ? fixedColumn.position
                          : undefined
                      )
                      .filter((value) => value != undefined)[0];
                    return (
                      <th
                        key={header.id}
                        className={`${position}` }
                        colSpan={header.colSpan}
                        
                      >
                        {header.isPlaceholder ? null : (
                          <div
                             {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none fixed-width"
                                : "",
                              style: header.column.getCanSort()
                                ? { cursor: "pointer", minWidth: "100%" }
                                : {},
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <Row className="d-flex align-items-center justify-content-center">
                              <Col sm={8}>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </Col>
                              <Col sm={2}>
                                {renderSortSymbol(header.column)}
                              </Col>
                            </Row>
                            {/*header.column.getCanFilter() ? (
                            <div>
                                <Filter column={header.column} table={table} />
                            </div>
                            ) : null*/}
                          </div>
                        )}
                        
                        
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
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length !== 0 ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} >
                      {row.getVisibleCells().map((cell) => {
                        const position = fixedColumns
                          .map((fixedColumn) =>
                            cell.id.includes(fixedColumn.name)
                              ? fixedColumn.position
                              : undefined
                          )
                          .filter((value) => value != undefined)[0];
                        return (
                          <td key={cell.id} className={`${position} ${row.getIsSelected() ? "bg-primary text-light" : ""}`}>
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
        </Col>
      </Row>
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
      {/*<div>{table.getRowModel().rows.length} Rows</div>*/}
      {/*<pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>*/}
    </Container>
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

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return React.createElement("input", {
    ...props,
    value: value,
    onChange: (e) => setValue(e.target.value),
  });
}
