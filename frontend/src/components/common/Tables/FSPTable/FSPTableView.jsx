import { flexRender } from "@tanstack/react-table";
import React, { useEffect } from "react";
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
      <Row style={{ maxHeight: "70vh", overflow: "scroll" }} className="mt-3">
        <Col sm={12} className="text-bg-success">
          <Table
            striped
            bordered
            hover
            responsive
            className="custom-table-crud-responsives"
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
                    console.log(position);
                    return (
                      <th
                        key={header.id}
                        className={position}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none fixed-width"
                                : "",
                              style: header.column.getCanSort()
                                ? { cursor: "pointer", minWidth: "100%"}
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
                        {header.column.getCanFilter()
                          ? /*<div>
                            <FormControl type="text"></FormControl>
                          </div>
                          */ null
                          : null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const position = fixedColumns
                        .map((fixedColumn) =>
                          cell.id.includes(fixedColumn.name)
                            ? fixedColumn.position
                            : undefined
                        )
                        .filter((value) => value != undefined)[0];
                      return (
                        <td key={cell.id} className={position}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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
              {table.getState().pagination.pageIndex + 1} de
              {" "}
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
