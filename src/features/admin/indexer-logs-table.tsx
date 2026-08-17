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
import { useIndexer } from '@/hooks/use-indexer';

function formatDate(dateString: string) {
  const date = new Date(Date.parse(dateString));
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) {
    const quantity = Math.floor(diff / 1000);
    return quantity > 1 ? `${quantity} seconds ago` : `${quantity} second ago`;
  }
  if (diff < 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60);
    return quantity > 1 ? `${quantity} minutes ago` : `${quantity} minute ago`;
  }
  if (diff < 24 * 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60 / 24);
    return quantity > 1 ? `${quantity} hours ago` : `${quantity} hour ago`;
  }
  const quantity = Math.floor(diff / 1000 / 60);
  return quantity > 1 ? `${quantity} days ago` : 'yesterday';
}

export function IndexerLogsTable() {
  const { isLoadingLogs, indexerLogs, listIndexerLogs } = useIndexer();
  if (isLoadingLogs && !indexerLogs.length) {
    const dummyData = {
      username: '',
      rootPath: '',
      message: '',
    };
    const dummyRows = [dummyData, dummyData, dummyData];
    return (
      <>
        <Button variant="outline" className="mb-4">
          <RefreshCcwIcon />
          Refresh
        </Button>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHeaderCell className="w-20">Date</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-50">
              Username
            </AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-100">
              Root path
            </AdminTableHeaderCell>
            <AdminTableHeaderCell>Message</AdminTableHeaderCell>
          </AdminTableHeader>
          <AdminTableBody>
            {dummyRows.map((_, index) => {
              const opacity = index % 2 ? 20 : 10;
              return (
                <AdminTableRow key={`dummy-log-${index}`}>
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
      </>
    );
  }
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
    // const win = window.open('about:blank', '_blank');
    // if (win) {
    //   win.document.documentElement.innerHTML = `<html>
    //     <head>
    //       <title>Indexer logs ${new Date()}</title>
    //       <style>
    //         :root {
    //           color-scheme: light dark;
    //         }
    //         body {
    //             background-color: light-dark(white, black);
    //             color: light-dark(black, white);
    //         }
    //         pre { font-family: mono; font-size: 0.875rem; line-height: 1.25rem }
    //       </style>
    //     </head>
    //       <body>
    //         <pre>${csv}</pre>
    //       </body>
    //   </html>`;
    //   win.focus();
    // }
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
    const csv = `${headings.join('\t')}\n${indexerLogs
      .map((item) => {
        const values = [
          item.date.toString(),
          item.username || '-',
          item.rootPath || '-',
          item.message,
        ];
        return values.join('\t');
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

  return (
    <>
      {isLoadingLogs ? (
        <Button variant="outline" className="mb-4" disabled>
          <RefreshCcwIcon className="animate-spin" />
          Loading
        </Button>
      ) : (
        <Button variant="outline" className="mb-4" onClick={handleRefresh}>
          <RefreshCcwIcon />
          Refresh
        </Button>
      )}
      <Button variant="outline" onClick={handleViewRaw}>
        <LogsIcon />
        View full
      </Button>
      <Button variant="outline" onClick={handleDownloadJson}>
        <DownloadIcon />
        Download JSON
      </Button>
      <Button variant="outline" onClick={handleDownloadCsv}>
        <DownloadIcon />
        Download CSV
      </Button>
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell className="w-50">Date</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-100">
            Root path
          </AdminTableHeaderCell>
          <AdminTableHeaderCell>Message</AdminTableHeaderCell>
        </AdminTableHeader>
        <AdminTableBody>
          {indexerLogs.slice(0, 100).map((log, index) => {
            return (
              <AdminTableRow key={`real-log-${index}`}>
                <AdminTableCell className="text-foreground/50 text-xs">
                  {formatDate(log.date)}
                </AdminTableCell>
                <AdminTableCell className="text-foreground/70 text-xs">
                  {log.username || '-'}
                </AdminTableCell>
                <AdminTableCell className="text-foreground/70 text-xs">
                  {log.rootPath || '-'}
                </AdminTableCell>
                <AdminTableCell className="text-foreground/70 text-xs">
                  {log.message.replace(log.rootPath, '')}
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    </>
  );
}
