import React from 'react';

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full table-fixed border-collapse border border-foreground/10">
      {children}
    </table>
  );
}

// TableHeader.jsx
export function AdminTableHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead>
      <tr className={className || ''}>{children}</tr>
    </thead>
  );
}

// TableHeaderCell.jsx
export function AdminTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-xs uppercase text-foreground/75 bg-background/50 p-2 text-left ${className ?? ''}`}
    >
      {children}
    </th>
  );
}

// TableRow.jsx
export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

// TableCell.jsx
export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-2 text-sm ${className ?? ''}`}>{children}</td>;
}

// TableBody.jsx
export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
