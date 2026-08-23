import React from 'react';

export function DataTable({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-foreground/10" {...rest}>
        {children}
      </table>
    </div>
  );
}

export function DataTableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead>
      <tr className={className || ''}>{children}</tr>
    </thead>
  );
}

export function DataTableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-xs uppercase text-foreground/75 bg-background/50 p-2 text-left ${className ?? ''}`}>
      {children}
    </th>
  );
}

export function DataTableRow({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest}>{children}</tr>;
}

export function DataTableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-2 text-sm ${className ?? ''}`}>{children}</td>;
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
