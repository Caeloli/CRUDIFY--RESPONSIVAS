import React, { useMemo, useState } from "react";
import { FSPTableView } from "./FSPTableView";
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

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank,
      rowB.columnFiltersMeta && rowB.columnFiltersMeta[columnId]
        ? rowB.columnFiltersMeta[columnId].itemRank
        : undefined
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function FSPTableContainer({
  data,
  columns,
  filter,
  fixedColumns,
  rowSelectionObject,
  filterSelectionObject,
  pRowSelection,
  pSetRowSelection,
  tableStyles,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const rerender = React.useReducer(() => ({}), {})[1];
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection: pRowSelection ?? rowSelection,
      globalFilter,
      columnFilters,
    },
    /**Row Selection */
    enableRowSelection: false,
    enableSubRowSelection: rowSelectionObject
      ? rowSelectionObject.enableSubRowSelection ?? false
      : false,
    enableMultiRowSelection: rowSelectionObject
      ? rowSelectionObject.enableMultiRowSelection ?? false
      : false,
    getRowId: (row) => row.resp_id,
    onRowSelectionChange: pSetRowSelection ?? setRowSelection,

    /**Filter */

    enableColumnFilters: filterSelectionObject
      ? filterSelectionObject.enableColumnFilters ?? false
      : false,

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
    <FSPTableView
      table={table}
      fixedColumns={fixedColumns}
      FilterComponent={filter}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      tableStyles={tableStyles}
    />
  );

  {
    /** 
      <hr />
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      */
  }
}
