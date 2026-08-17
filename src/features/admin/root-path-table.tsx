import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeader,
  AdminTableHeaderCell,
  AdminTableRow,
} from '../../components/admin-table';
import { RootPathDeleteForm } from './root-path-delete-form';
import { RootPathUpdateForm } from './root-path-update-form';
import { useRootPaths } from '@/hooks/use-root-paths';

export function RootPathTable() {
  const { rootPaths, isLoading } = useRootPaths();
  if (isLoading) {
    const dummyData = {
      id: 0,
      rootPath: '',
      accountId: 0,
      fileCount: 0,
      totalSize: 0,
      createdAt: new Date().toString(),
      username: '',
    };
    const dummyRows = [dummyData, dummyData, dummyData];
    return (
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-100">Path</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-25">Files</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-25">Size</AdminTableHeaderCell>
          <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
        </AdminTableHeader>
        <AdminTableBody>
          {dummyRows.map((row, index) => {
            const opacity = index % 2 ? 20 : 10;
            return (
              <AdminTableRow key={index}>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    );
  }
  if (!rootPaths) {
    return <p>No root paths found.</p>;
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  function formatSize(size: number): string {
    if (size >= 1e9) {
      return `${(size / 1e9).toFixed(2)} GB`;
    }
    if (size >= 1e6) {
      return `${(size / 1e6).toFixed(2)} MB`;
    }
    if (size >= 1e3) {
      return `${(size / 1e3).toFixed(2)} KB`;
    }
    return `${size} B`;
  }

  return (
    <>
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-100">Path</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-25">Files</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-25">Size</AdminTableHeaderCell>
          <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
        </AdminTableHeader>
        <AdminTableBody>
          {rootPaths.map((rootPath) => (
            <AdminTableRow key={rootPath.id}>
              <AdminTableCell>{rootPath.username}</AdminTableCell>
              <AdminTableCell>{rootPath.rootPath}</AdminTableCell>
              <AdminTableCell>
                {formatNumber(rootPath.fileCount)}
              </AdminTableCell>
              <AdminTableCell>{formatSize(rootPath.totalSize)}</AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 whitespace-nowrap">
                  <RootPathUpdateForm rootPath={rootPath} />
                  <RootPathDeleteForm rootPath={rootPath} />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </>
  );
}
