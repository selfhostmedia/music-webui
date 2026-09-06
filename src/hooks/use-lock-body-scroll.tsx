import { useEffect, useRef } from 'react';

export default function useLockBodyScroll(locked: boolean) {
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (locked) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }, 0);
    } else {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('width');
      setTimeout(() => {
        window.scrollTo(0, scrollPosition.current);
      }, 0);
    }
  }, [locked]);
}
