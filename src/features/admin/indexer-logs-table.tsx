import { AdminCard, AdminCardContent, AdminCardSubtitle, AdminCardTitle } from '@/components/admin-card';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeader,
  AdminTableHeaderCell,
  AdminTableRow,
} from '@/components';
import { Button } from '@/components/ui/button';
import { DownloadIcon, LogsIcon, RefreshCcwIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIndexer } from '@/hooks/use-indexer';
import { useIsMobile } from '@/hooks/use-is-mobile';

function formatDate(dateString: string) {
  const date = new Date(Date.parse(dateString));
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) {
    const quantity = Math.floor(diff / 1000);
    return quantity > 1 ? (
      <span title={date.toLocaleString()}>{quantity} seconds ago</span>
    ) : (
      <span>{quantity} second ago</span>
    );
  }
  if (diff < 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60);
    return quantity > 1 ? (
      <span title={date.toLocaleString()}>{quantity} minutes ago</span>
    ) : (
      <span>{quantity} minute ago</span>
    );
  }
  if (diff < 24 * 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60 / 60);
    return quantity > 1 ? (
      <span title={date.toLocaleString()}>{quantity} hours ago</span>
    ) : (
      <span title={date.toLocaleString()}>{quantity} hour ago</span>
    );
  }
  const quantity = Math.floor(diff / 1000 / 60 / 60 / 24);
  return quantity > 1 ? (
    <span title={date.toLocaleString()}>{quantity} days ago</span>
  ) : (
    <span title={date.toLocaleString()}>yesterday</span>
  );
}

export function IndexerLogsTable() {
  const { isLoadingLogs, indexerLogs, listIndexerLogs } = useIndexer();
  const isMobile = useIsMobile();

  const handleRefresh = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await listIndexerLogs();
  };

  const handleViewRaw = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let maximumDateLength = 0;
    let maximumUsernameLength = 0;
    let maximumPathLength = 0;
    indexerLogs.reverse().forEach((item) => {
      const dateLength = item.date.toString().length;
      const usernameLength = (item.username || '-').length;
      const pathLength = (item.rootPath || '-').length;
      if (dateLength > maximumDateLength) {
        maximumDateLength = dateLength;
      }
      if (usernameLength > maximumUsernameLength) {
        maximumUsernameLength = usernameLength;
      }
      if (pathLength > maximumPathLength) {
        maximumPathLength = pathLength;
      }
    });
    const headings = [
      `Date`.padEnd(maximumDateLength, ' '),
      `User`.padEnd(maximumUsernameLength, ' '),
      `Path`.padEnd(maximumPathLength, ' '),
      `Message`,
    ];
    const csv = `${headings.join('    ')}\n${indexerLogs
      .map((item) => {
        const values = [
          item.date.toString().padEnd(maximumDateLength),
          (item.username || '-').padEnd(maximumUsernameLength, ' '),
          (item.rootPath || '-').padEnd(maximumPathLength),
          item.message,
        ];
        return values.join('    ');
      })
      .join('\n')}`;
    const blob = new Blob([csv], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const text = JSON.stringify(indexerLogs, null, 2);
    const blob = new Blob([text], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `music-server-logs-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const headings = [`Date`, `User`, `Path`, `Message`];
    const csv = `${headings.join(',')}\n${indexerLogs
      .map((item) => {
        const values = [item.date.toString(), item.username || '-', item.rootPath || '-', item.message];
        return values.join(',');
      })
      .join('\n')}`;
    const blob = new Blob([csv], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `music-server-logs-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cellFiller = (opacity: number) => <span className={`bg-foreground/${opacity} h-8 w-full block`} />;
  const dummyRows = [
    {
      accountId: -1,
      date: '',
      username: '',
      rootPath: '',
      message: '',
    },
    {
      accountId: -2,
      date: '',
      username: '',
      rootPath: '',
      message: '',
    },
    {
      accountId: -3,
      date: '',
      username: '',
      rootPath: '',
      message: '',
    },
  ];

  return (
    <>
      {isLoadingLogs ? (
        <Button className="mr-2 mb-4" variant="outline" disabled>
          <RefreshCcwIcon className="animate-spin" />
          Loading
        </Button>
      ) : (
        <Button className="mr-2 mb-4" variant="outline" onClick={handleRefresh}>
          <RefreshCcwIcon />
          Refresh
        </Button>
      )}
      <Button role="button" aria-label="View raw logs" className="mr-2 mb-4" variant="outline" onClick={handleViewRaw}>
        <LogsIcon />
        View
      </Button>
      <Button
        role="button"
        aria-label="Download logs as JSON"
        className="mr-2 mb-4"
        variant="outline"
        onClick={handleDownloadJson}
      >
        <DownloadIcon />
        JSON
      </Button>
      <Button
        role="button"
        aria-label="Download logs as CSV"
        className="mb-2"
        variant="outline"
        onClick={handleDownloadCsv}
      >
        <DownloadIcon />
        CSV
      </Button>
      {/* Mobile card view */}
      {isMobile && (
        <>
          {(isLoadingLogs ? dummyRows : indexerLogs).map((log, index) => {
            const opacity = index % 2 === 0 ? 20 : 10;
            return (
              <AdminCard key={`card-${log.accountId}-${index}`}>
                <AdminCardTitle>{log.date ? formatDate(log.date) : cellFiller(opacity)}</AdminCardTitle>
                <AdminCardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <AdminCardSubtitle>Username</AdminCardSubtitle>
                      <p className="text-sm">{log.username || (log.accountId < 0 ? cellFiller(opacity) : '-')}</p>
                    </div>
                    <div>
                      <AdminCardSubtitle>Root path</AdminCardSubtitle>
                      <p className="text-sm">{log.rootPath || (log.accountId < 0 ? cellFiller(opacity) : '-')}</p>
                    </div>
                  </div>
                  <p className="text-sm">{log.message.replace(log.rootPath, '') || cellFiller(opacity)}</p>
                </AdminCardContent>
                <Separator />
              </AdminCard>
            );
          })}
        </>
      )}

      {/* Desktop table view */}
      {!isMobile && (
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHeaderCell className="w-50">Date</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-100">Root path</AdminTableHeaderCell>
            <AdminTableHeaderCell>Message</AdminTableHeaderCell>
          </AdminTableHeader>
          <AdminTableBody>
            {(isLoadingLogs ? dummyRows : indexerLogs).map((log, index) => {
              const opacity = index % 2 === 0 ? 20 : 10;
              return (
                <AdminTableRow key={`row-${log.accountId}-${index}`}>
                  <AdminTableCell className="text-foreground/50 text-xs">
                    {log.date ? formatDate(log.date) : cellFiller(opacity)}
                  </AdminTableCell>
                  <AdminTableCell className="text-foreground/70 text-xs">
                    {log.username || (log.accountId < 0 ? cellFiller(opacity) : '-')}
                  </AdminTableCell>
                  <AdminTableCell className="text-foreground/70 text-xs">
                    {log.rootPath || (log.accountId < 0 ? cellFiller(opacity) : '-')}
                  </AdminTableCell>
                  <AdminTableCell className="text-foreground/70 text-xs">
                    {log.message.replace(log.rootPath, '') || cellFiller(opacity)}
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
