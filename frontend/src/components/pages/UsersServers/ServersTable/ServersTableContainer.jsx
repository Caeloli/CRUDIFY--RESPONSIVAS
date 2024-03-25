import React, { useMemo, useState } from "react";
import { ServersTableView } from "./ServersTableView";
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData } from "../../../../func/func";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { DebouncedInput } from "../../../common/Tables/Filters/Inputs/DebouncedInput";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export function ServersTableContainer({
  data,
  columns,
  pRowSelection,
  pSetRowSelection,
  isThird,
}) {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const rerender = React.useReducer(() => ({}), {})[1];
  const columnsServers = useMemo(() =>
    isThird
      ? [
          /*{
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },*/
          {
            accessorFn: (row) => row.hostname,
            id: "hostname",
            cell: (info) => info.getValue(),
            header: () => <span>Server</span>,
          },
          {
            accessorFn: (row) => row.domain_server,
            id: "domain_server",
            cell: (info) => info.getValue(),
            header: () => <span>Dominio</span>,
          },
          {
            accessorFn: (row) => row.ip_address,
            id: "ip_address",
            cell: (info) => info.getValue(),
            header: () => <span>Dirección IP</span>,
          },
        ]
      : [
          {
            accessorFn: (row) => row.model,
            id: "model",
            cell: (info) => info.getValue(),
            header: () => <span>Modelo</span>,
          },
          {
            accessorFn: (row) => row.brand,
            id: "brand",
            cell: (info) => info.getValue(),
            header: () => <span>Marca</span>,
          },
          {
            accessorFn: (row) => row.serial_number,
            id: "serial_number",
            cell: (info) => info.getValue(),
            header: () => <span>Número Serial</span>,
          },
          {
            accessorFn: (row) => row.location,
            id: "location",
            cell: (info) => info.getValue(),
            header: () => <span>Ubicación</span>,
          },
        ]
  );
  const table = useReactTable({
    data,
    columns: columnsServers,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      rowSelection: pRowSelection ?? rowSelection,
      globalFilter,
    },
    enableRowSelection: false,
    enableMultiRowSelection: true,
    onRowSelectionChange: pSetRowSelection ?? setRowSelection,
    getRowId: (row) => row.user_server_id,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <ServersTableView
      table={table}
      setGlobalFilter={setGlobalFilter}
      globalFilter={globalFilter}
      FilterComponent={ServersTableFilter}
    />
  );
}

function ServersTableFilter({ column, table }) {
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
    <></>
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
        className="mt-2 w-100 border rounded "
        style={{ height: "2.5rem" }}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
