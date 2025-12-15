import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";

type ActionItem = { description: string };
type AuditRow = {
  traceId: string | null;
  dateTime: string | Date; 
  updater: string;
  action: ActionItem[];
};


export default function AuditTable({ data }: { data: AuditRow[] }) {

  const safeData = data || [];

  const columns = useMemo<ColumnDef<AuditRow, any>[]>(
    () => [
      {
        id: "no", 
        header: "No",
        cell: ({ row, table }) => {
          const rows = table.getRowModel().rows;
          const idx = rows.findIndex((r) => r.id === row.id);
          return <div>{idx >= 0 ? idx + 1 : ""}</div>;
        },
        size: 40,
      },
      {
        id: "dateTime",
        accessorKey: "dateTime",
        header: "Tanggal Waktu",
        size: 70,
        cell: (info) => {
          return <div>{info.getValue()}</div>;
        },
      },
      {
        id: "updater",
        accessorKey: "updater",
        header: "Updater",
        cell: (info) => <div>{info.getValue() ?? "-"}</div>,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const actions = row.original.action;
          
          if (!actions?.length) {
            return <div className="text-muted">Tidak ada aksi</div>;
          }

          return (
            <div>
              {actions.map((action, i) => (
                <div key={i} className={`${i < actions.length - 1 ? 'border-bottom pb-2 mb-2' : 'pb-1'}`}>
                  <div className="d-flex align-items-start">
                    <span className="text-dark me-2">{i + 1}.</span>
                    <span className="text-break">{action?.description || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        },
        size: 300,
      },
    ],
    []
  );

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  if (!safeData.length) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">Tidak ada data audit trail tersedia</p>
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ maxHeight: 'inherit', overflowY: 'auto' }}>
      <table className="table table-sm table-light table-bordered table-striped" style={{ borderCollapse: "collapse" }}>
        <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1020 }}>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th 
                  key={h.id} 
                  style={{ 
                    width: h.getSize(),
                    backgroundColor: 'var(--bs-dark)',
                    borderColor: 'var(--bs-dark)'
                  }}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ verticalAlign: "top" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
