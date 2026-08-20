import {
  AdminCard,
  AdminCardContent,
  AdminCardFooter,
  AdminCardSubtitle,
  AdminCardTitle,
} from '@/components/admin-card';
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
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useRootPaths } from '@/hooks/use-root-paths';

export function RootPathTable() {
  const { rootPaths, isLoading } = useRootPaths();
  const isMobile = useIsMobile();

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

  const cellFiller = (opacity: number) => <span className={`bg-foreground/${opacity} h-8 w-full block`} />;
  const dummyRows = [
    {
      id: -1,
      accountId: -1,
      rootPath: '',
      fileCount: -1,
      totalSize: -1,
      createdAt: '',
      username: '',
    },
    {
      id: -2,
      accountId: -2,
      rootPath: '',
      fileCount: -2,
      totalSize: -2,
      createdAt: '',
      username: '',
    },
    {
      id: -3,
      accountId: -3,
      rootPath: '',
      fileCount: -3,
      totalSize: -3,
      createdAt: '',
      username: '',
    },
  ];

  return (
    <>
      {/* Mobile card view */}
      {isMobile && (
        <>
          {(isLoading ? dummyRows : rootPaths).map((rootPath) => {
            return (
              <AdminCard key={`card-${rootPath.id}`}>
                <AdminCardTitle>{rootPath.username}</AdminCardTitle>
                <AdminCardContent>
                  <div>
                    <AdminCardSubtitle>Path</AdminCardSubtitle>
                    <p className="break-all text-sm">{rootPath.rootPath}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <AdminCardSubtitle>Files</AdminCardSubtitle>
                      <p className="text-sm">{formatNumber(rootPath.fileCount)}</p>
                    </div>
                    <div>
                      <AdminCardSubtitle>Size</AdminCardSubtitle>
                      <p className="text-sm">{formatSize(rootPath.totalSize)}</p>
                    </div>
                  </div>
                </AdminCardContent>
                <Separator />
                <AdminCardFooter>
                  <RootPathUpdateForm rootPath={rootPath} />
                  <RootPathDeleteForm rootPath={rootPath} />
                </AdminCardFooter>
              </AdminCard>
            );
          })}
        </>
      )}
      {/* Desktop table view */}
      {!isMobile && (
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-100">Path</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-25">Files</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-25">Size</AdminTableHeaderCell>
            <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
          </AdminTableHeader>
          <AdminTableBody>
            {(isLoading ? dummyRows : rootPaths).map((rootPath, index) => {
              const opacity = index % 2 === 0 ? 20 : 10;
              return (
                <AdminTableRow key={`row-${rootPath.id}`}>
                  <AdminTableCell>{rootPath.username || cellFiller(opacity)}</AdminTableCell>
                  <AdminTableCell>{rootPath.rootPath || cellFiller(opacity)}</AdminTableCell>
                  <AdminTableCell>
                    {rootPath.fileCount > -1 ? formatNumber(rootPath.fileCount) : cellFiller(opacity)}
                  </AdminTableCell>
                  <AdminTableCell>
                    {rootPath.totalSize > 1 ? formatSize(rootPath.totalSize) : cellFiller(opacity)}
                  </AdminTableCell>
                  <AdminTableCell>
                    {rootPath.id > 0 ? (
                      <div className="flex gap-2 whitespace-nowrap">
                        <RootPathUpdateForm rootPath={rootPath} />
                        <RootPathDeleteForm rootPath={rootPath} />
                      </div>
                    ) : (
                      cellFiller(opacity)
                    )}
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTableBody>
        </AdminTable>
      )}
    </>
  );
}
