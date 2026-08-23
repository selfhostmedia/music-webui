import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import api, { ApiError, type ErrorResponse, getErrorMessage } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListEndpoint = paths['/api/user/list-indexer-logs']['get'];

export type LogEntryDto = ListEndpoint['responses']['200']['content']['application/json']['logs'][number];
export type ListQueryDto = ListEndpoint['parameters']['query'];
export type ListErrorCodes =
  | ListEndpoint['responses']['400']['content']['application/json']['message'][number]
  | ListEndpoint['responses']['404']['content']['application/json']['message'][number];

interface IndexerContextType {
  indexerLogs: LogEntryDto[];
  isLoadingLogs: boolean;
  listIndexerLogs: (vars?: { query?: ListQueryDto }) => Promise<void>;
}

const IndexerContext = createContext<IndexerContextType>({
  indexerLogs: [],
  isLoadingLogs: true,
  listIndexerLogs: async () => {},
});

export function IndexerProvider({ children }: { children: ReactNode }) {
  const [isLoadingLogs, setLoadingLogs] = useState(true);
  const [indexerLogs, setIndexerLogs] = useState<LogEntryDto[]>([]);

  const listIndexerLogs = async ({ query }: { query?: ListQueryDto } = {}) => {
    try {
      setLoadingLogs(true);
      const { data, error } = await api.get('/api/user/list-indexer-logs', {
        params: {
          header: api.authHeader(),
          query,
        },
      });

      if (error) {
        throw new Error(getErrorMessage(error));
      }
      if (!data) {
        throw new Error('No log data received');
      }
      if (!data.success) {
        const errorPayload = data as unknown as ErrorResponse<ListErrorCodes>;
        throw new ApiError<ListErrorCodes>(errorPayload);
      }
      if (!data.logs) {
        throw new Error(getErrorMessage(data, 'No logs data received'));
      }
      setIndexerLogs(data.logs);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to retrieve indexer logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    listIndexerLogs();
  }, []);

  return (
    <IndexerContext.Provider
      value={{
        indexerLogs,
        isLoadingLogs,
        listIndexerLogs,
      }}
    >
      {children}
    </IndexerContext.Provider>
  );
}

export function useIndexer() {
  const context = useContext(IndexerContext);
  if (!context) {
    throw new Error('useIndexer must be used within IndexerProvider');
  }
  return context;
}
