import { useMediaQuery } from 'react-responsive';

export function useIsMobile() {
  return useMediaQuery({ maxWidth: 767 });
}
