import React, { useEffect, useMemo } from "react";
import { UsersSearchTableView } from "./UsersSearchTableView";
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
import { useState } from "react";
import { DebouncedInput } from "../../../common/Tables/Filters/Inputs/DebouncedInput";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export function UsersSearchTableContainer({
  data,
  columns,
  pRowSelection,
  pSetRowSelection,
  visibleData,
}) {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const rerender = React.useReducer(() => ({}), {})[1];

  const columnsUser = useMemo(
    () => [
      {
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
      },
      {
        accessorFn: (row) => row.user_server_username,
        id: "user_server_username",
        cell: (info) => info.getValue(),
        header: () => <span>Usuario</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: columnsUser,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      rowSelection: pRowSelection ?? rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => row.user_server_id,
    onRowSelectionChange: pSetRowSelection ?? setRowSelection,
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

  useEffect(() => {
    if (visibleData) {
      const getVisibleRawData = (rows = []) => {
        if (!rows) {
          return []; // Handle case where rows is undefined
        }
        return rows.map((row) => row.original);
      };

      if (columnFilters.length === 0) {
          if (table.getSelectedRowModel().rows.length === 0) {
            visibleData.current = getVisibleRawData(
              table.getPreFilteredRowModel().flatRows
            );
          } else {
            visibleData.current = getVisibleRawData(
              table.getSelectedRowModel().flatRows
            );
          }
        } 
      } else {
        if (table.getSelectedRowModel().rows.length === 0) {
          visibleData.current = getVisibleRawData(
            table.getFilteredRowModel().flatRows
          );
        } else {
          visibleData.current = getVisibleRawData(
            table.getFilteredSelectedRowModel().flatRows
          );
        }
      }
    }, [columnFilters, pRowSelection, rowSelection]);

  return (
    <UsersSearchTableView
      table={table}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      FilterComponent={UsersTableServersFilter}
    />
  );
}

function UsersTableServersFilter({ column, table }) {
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
        className="mt-2 w-100 border rounded"
        style={{ height: "2.5rem" }}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
