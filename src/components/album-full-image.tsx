import { useEffect, useState } from 'react';
import api from '@/lib/api';

type AlbumImageProps = {
  albumId: number;
  size: number;
  className?: string;
  ariaHidden?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function AlbumFullImage({ albumId, size, className, ariaHidden }: AlbumImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      setImageUrl(null);
      const { data, error } = await api.get('/api/user/album-cover', {
        params: {
          query: {
            id: albumId,
            size,
          },
          header: api.authHeader(),
        },
        parseAs: 'blob',
      });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching album cover image:', error);
        return;
      }
      if (data) {
        const nextUrl = URL.createObjectURL(data);
        setImageUrl(nextUrl);
      }
    }

    fetchImage();
  }, [albumId]);

  if (!imageUrl) {
    return <></>;
  }

  return (
    <img
      className={`absolute z-0 w-120 h-120 object-cover ${className ?? ''}`}
      src={imageUrl}
      alt={`Album cover for album ID ${albumId}`}
      {...(ariaHidden ? { 'aria-hidden': 'true' } : {})}
    />
  );
}
