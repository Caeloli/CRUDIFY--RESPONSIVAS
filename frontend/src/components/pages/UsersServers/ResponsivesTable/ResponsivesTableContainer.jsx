import React, { useEffect, useMemo, useState } from "react";
import { ResponsivesTableView } from "./ResponsivesTableView";
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
import { DebouncedSelect } from "../../../common/Tables/Filters/Inputs/DebouncedSelect";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export function ResponsivesTableContainer({
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
  const columnsResponsive = useMemo(() => [
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
      accessorFn: (row) => row.remedy,
      id: "remedy",
      cell: (info) => info.getValue(),
      header: () => <span>Remedy</span>,
    },
    {
      accessorFn: (row) => row.state_id_fk,
      id: "state_id_fk",
      sortable: false,
      cell: (info) => {
        const state_id = info.getValue();
        return state_id === 1
          ? "Active"
          : state_id === 2
          ? "Notificar"
          : state_id === 3
          ? "Expirado"
          : state_id === 4
          ? "Notificado"
          : state_id === 5
          ? "Cancelado"
          : state_id === 6
          ? "Renovada"
          : "Se desconoce";
      },
      header: "Estado",
    },
    {
      accessorFn: (row) => row.start_date,
      id: "start_date",
      cell: (info) => info.getValue().split("T")[0],
      header: () => <span>Fecha Inicio</span>,
    },
    {
      accessorFn: (row) => row.end_date,
      id: "end_date",
      cell: (info) => info.getValue().split("T")[0],
      header: () => <span>Fecha Final</span>,
    },
    {
      accessorFn: (row) => row.file_format,
      id: "file_format",
      cell: (info) => info.getValue(),
      enableSorting: false,
      header: () => <span>Formato</span>,
    },
  ]);

  const table = useReactTable({
    data,
    columns: columnsResponsive,
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
    onRowSelectionChange: pSetRowSelection ?? setRowSelection,
    getRowId: (row) => row.resp_id,
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
    table.setPageSize(5);
  }, [table]);

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
    <ResponsivesTableView
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      table={table}
      FilterComponent={ResponsiveTableFilter}
    />
  );
}

function ResponsiveTableFilter({ column, table }) {
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

  if (column.id === "start_date" || column.id === "end_date") {
    const columnFilterValue = column.getFilterValue();
    // Extract years from date strings
    const years = sortedUniqueValues.map((sortedValue) => {
      const date = new Date(sortedValue); // Assuming start_date is the property containing the date
      return date.getFullYear();
    });

    // Remove duplicate years
    const uniqueYears = [...new Set(years)];

    // Format years as options for React-Select
    const options = uniqueYears.map((year) => ({ value: year, label: year }));

    return (
      <>
        <DebouncedSelect
          options={options}
          isClearable
          className={"mt-2"}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          onChange={(value) => {
            console.log("El valor que retorna es: ", value);
            column.setFilterValue(value);
          }}
          menuPosition="fixed"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",
              borderRadius: "0.3rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,

              fontWeight: "normal",
            }),
          }}
        />
      </>
    );
  } else if (column.id === "resp_id") {
    return (
      <DebouncedInput
        type="text"
        value={columnFilterValue?.[0] ?? ""}
        onChange={(value) => column.setFilterValue([value, value])}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="mt-2 w-100 border  rounded"
        list={column.id + "list"}
        style={{ height: "2.5rem", borderRadius: "0.3rem" }}
      />
    );
  } else if (column.id === "state_id_fk") {
    const options = [
      { value: 1, label: "Activa" },
      { value: 2, label: "Notificar" },
      { value: 3, label: "Expirada" },
      { value: 4, label: "Notificada" },
      { value: 5, label: "Cancelado" },
      { value: 6, label: "Renovado" },
    ];

    return (
      <>
        <DebouncedSelect
          options={options}
          isClearable
          className={"mt-2"}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          onChange={(value) => {
            column.setFilterValue([value, value]);
          }}
          menuPosition="fixed"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",

              borderRadius: "0.3rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,

              fontWeight: "normal",
            }),
          }}
        />
      </>
    );
  } else if (column.id === "file_format") {
    return (
      <>
        <datalist id={column.id + "list"}>
          <option value={3} />
          <option value={4} />
        </datalist>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) => column.setFilterValue([value, value])}
          placeholder={`F... ${
            column.getFacetedMinMaxValues()
              ? `(${column.getFacetedMinMaxValues()})`
              : ""
          }`}
          list={column.id + "list"}
          className="mt-2 w-100 border  rounded"
          style={{ height: "2.5rem", borderRadius: "0.3rem" }}
        />
      </>
    );
  } else if (column.id === "actions") {
    return null;
  } else {
    return (
      <>
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value, index) => (
            <option value={value} key={index} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={columnFilterValue ?? ""}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="mt-2 w-100 border  rounded"
          list={column.id + "list"}
          style={{ height: "2.5rem", borderRadius: "0.3rem" }}
        />
      </>
    );
  }
}
