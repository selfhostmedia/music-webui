import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import api, { ApiError, type ErrorResponse, type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListEndpoint = paths['/api/admin/list-indexer-logs']['get'];
type SetStatusEndpoint = paths['/api/admin/set-indexer-status']['patch'];

export type LogEntryDto = ListEndpoint['responses']['200']['content']['application/json']['logs'][number];
export type ListQueryDto = ListEndpoint['parameters']['query'];
export type ListErrorCodes =
  | ListEndpoint['responses']['400']['content']['application/json']['message'][number]
  | ListEndpoint['responses']['404']['content']['application/json']['message'][number];
export type SetStatusBodyDto = SetStatusEndpoint['requestBody']['content']['application/json'];

interface IndexerContextType {
  indexerLogs: LogEntryDto[];
  isEnabled: boolean;
  isLoadingLogs: boolean;
  isLoadingStatus: boolean;
  isUpdatingStatus: boolean;
  listIndexerLogs: (vars?: { query?: ListQueryDto }) => Promise<void>;
  toggleStatus: (vars: { body: SetStatusBodyDto }) => Promise<void>;
}

const IndexerContext = createContext<IndexerContextType>({
  indexerLogs: [],
  isEnabled: true,
  isLoadingLogs: true,
  isLoadingStatus: true,
  isUpdatingStatus: true,
  listIndexerLogs: async () => {},
  toggleStatus: async () => {},
});

export function IndexerProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setEnabled] = useState(true);
  const [isLoadingStatus, setLoadingStatus] = useState(true);
  const [isLoadingLogs, setLoadingLogs] = useState(true);
  const [isUpdatingStatus, setUpdatingStatus] = useState(true);
  const [indexerLogs, setIndexerLogs] = useState<LogEntryDto[]>([]);

  useEffect(() => {
    const fetchIndexerStatus = async () => {
      try {
        const { data, error } = await api.get('/api/admin/indexer-configuration', {
          params: {
            header: api.authHeader(),
          },
        });
        if (error) {
          throw new Error(getErrorMessage(error));
        }
        if (!data) {
          throw new Error('Failed to fetch indexer configuration');
        }
        if (!data.success) {
          const errorPayload = data as unknown as ErrorResponse<GenericErrorCodes>;
          throw new ApiError<GenericErrorCodes>(errorPayload);
        }
        if (!data.configuration) {
          throw new Error(getErrorMessage(data, 'No accounts data received'));
        }
        setEnabled(data.configuration.isEnabled);
        setLoadingStatus(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch indexer configuration:', error);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchIndexerStatus();
  }, []);

  const toggleStatus = async ({ body }: { body: SetStatusBodyDto }) => {
    try {
      const newStatus = body.enabled;
      setEnabled(newStatus);
      setUpdatingStatus(true);
      const { data, error } = await api.patch('/api/admin/set-indexer-status', {
        params: {
          header: api.authHeader(),
        },
        body,
      });
      if (error) {
        throw new Error(getErrorMessage(error));
      }
      if (!data) {
        throw new Error('Failed to set indexer status');
      }
      if (!data.success) {
        const errorPayload = data as unknown as ErrorResponse<GenericErrorCodes>;
        throw new ApiError<GenericErrorCodes>(errorPayload);
      }
      setEnabled(newStatus);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to toggle indexer configuration:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const listIndexerLogs = async ({ query }: { query?: ListQueryDto } = {}) => {
    try {
      setLoadingLogs(true);
      const { data, error } = await api.get('/api/admin/list-indexer-logs', {
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
        isEnabled,
        isLoadingStatus,
        isLoadingLogs,
        isUpdatingStatus,
        listIndexerLogs,
        toggleStatus,
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
