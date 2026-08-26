import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import api, { type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from 'src/types/api-schema';

type ListIndexerLogsEndpoint = paths['/api/user/list-indexer-logs']['get'];
type ListIndexerLogsQueryDto = ListIndexerLogsEndpoint['parameters']['query'];
type ListIndexerLogsResponseDto = ListIndexerLogsEndpoint['responses']['200']['content']['application/json'];

export type IndexerLogDto = ListIndexerLogsResponseDto['logs'][number];
export type ListIndexerLogsErrorCodes =
  GenericErrorCodes | ListIndexerLogsEndpoint['responses']['400']['content']['application/json']['message'][number];

const INDEXER_QUERY_KEY = ['user-indexer-logs'] as const;

function indexerQueryKey(query?: ListIndexerLogsQueryDto) {
  return [...INDEXER_QUERY_KEY, query] as const;
}

async function fetchIndexerLogs(query?: ListIndexerLogsQueryDto): Promise<IndexerLogDto[]> {
  const { data, error } = await api.get('/api/user/list-indexer-logs', {
    params: {
      query,
      header: api.authHeader(),
    },
  });

  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.logs) {
    throw new Error('No data received');
  }
  return data.logs;
}

function fetchIndexerLogsWithClient(queryClient: QueryClient, query?: ListIndexerLogsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: indexerQueryKey(query),
    queryFn: () => fetchIndexerLogs(query),
  });
}

export function useIndexer() {
  const queryClient = useQueryClient();
  const [indexerLogs, setIndexerLogs] = useState<IndexerLogDto[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [logsLoadingError, setLogsLoadingError] = useState<Error | null>(null);

  const listIndexerLogs = useCallback(
    async (query?: ListIndexerLogsQueryDto) => {
      setIsLogsLoading(true);
      setLogsLoadingError(null);
      try {
        const result = await fetchIndexerLogsWithClient(queryClient, query);
        setIndexerLogs(result);
      } catch (error) {
        setLogsLoadingError(error instanceof Error ? error : new Error('Failed to fetch indexer logs'));
      } finally {
        setIsLogsLoading(false);
      }
    },
    [queryClient],
  );

  return {
    listIndexerLogs,
    indexerLogs,
    indexerLogsLoading: isLogsLoading,
    indexerLogsError: logsLoadingError,
  };
}
