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

export function DataTableHeader({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <thead>
      <tr className={className || ''} style={style}>
        {children}
      </tr>
    </thead>
  );
}

export function DataTableHeaderCell({
  children,
  className,
  colSpan,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  style?: React.CSSProperties;
}) {
  return (
    <th
      colSpan={colSpan || 1}
      className={`text-xs uppercase text-foreground/75 bg-background/50 p-2 text-left ${className ?? ''}`}
      style={style}
    >
      {children}
    </th>
  );
}

export function DataTableRow({
  children,
  ref,
  ...rest
}: { children: React.ReactNode; ref?: React.Ref<HTMLTableRowElement> } & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr ref={ref} {...rest}>
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <td className={`p-2 text-sm ${className ?? ''}`} style={style}>
      {children}
    </td>
  );
}

export function DataTableBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <tbody style={style}>{children}</tbody>;
}
