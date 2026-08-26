import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

type AlbumImageProps = {
  albumId: number;
  size: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function AlbumImage({ albumId, size, style, ...props }: AlbumImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Detect whether the image is near the viewport.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '300px',
      },
    );
    observer.observe(element);
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch while visible and unload while not visible.
  useEffect(() => {
    if (!isVisible) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setImageUrl(null);
      return;
    }

    let cancelled = false;

    async function fetchImage() {
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
      if (cancelled) {
        return;
      }
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching album cover image:', error);
        return;
      }
      if (data) {
        const nextUrl = URL.createObjectURL(data);
        objectUrlRef.current = nextUrl;
        setImageUrl(nextUrl);
      }
    }

    fetchImage();

    // eslint-disable-next-line consistent-return
    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setImageUrl(null);
    };
  }, [albumId, isVisible]);

  return (
    <div
      ref={containerRef}
      {...props}
      style={{
        ...style,
        backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
