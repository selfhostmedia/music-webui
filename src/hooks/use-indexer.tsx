import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '@/lib/api';
import type { components } from '@/types/api-schema';

type LogEntryDto = components['schemas']['AdminLogEntryDto'];

interface IndexerContextType {
  indexerLogs: LogEntryDto[];
  isEnabled: boolean;
  isLoadingLogs: boolean;
  isLoadingStatus: boolean;
  isUpdatingStatus: boolean;
  listIndexerLogs: (
    accountId?: number,
    rootPathId?: number,
    search?: string,
  ) => Promise<void>;
  toggleStatus: () => Promise<void>;
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
        const response = await api.get('/api/admin/indexer-configuration', {
          params: {
            header: api.authHeader(),
          },
        });
        if (!response.data || !response.data.configuration) {
          throw new Error('No configuration data received');
        }
        setEnabled(response.data.configuration.isEnabled);
        setLoadingStatus(false);
      } catch (error) {
        console.error('Failed to fetch indexer configuration:', error);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchIndexerStatus();
  }, []);

  const toggleStatus = async () => {
    try {
      const newStatus = !isEnabled;
      setEnabled(newStatus);
      setUpdatingStatus(true);
      const response = await api.patch('/api/admin/set-indexer-status', {
        params: {
          header: api.authHeader(),
        },
        body: {
          enabled: !isEnabled,
        },
      });
      if (!response.data || !response.data.success) {
        throw new Error('No configuration data received');
      }
      setEnabled(newStatus);
    } catch (error) {
      console.error('Failed to toggle indexer configuration:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const listIndexerLogs = async (
    accountId?: number,
    rootPathId?: number,
    search?: string,
  ) => {
    try {
      setLoadingLogs(true);
      const response = await api.get('/api/admin/list-indexer-logs', {
        params: {
          header: api.authHeader(),
          query: {
            accountId,
            rootPathId,
            search,
          },
        },
      });
      if (!response.data || !response.data.success) {
        throw new Error('No log data received');
      }
      setIndexerLogs(response.data.logs);
    } catch (error) {
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
