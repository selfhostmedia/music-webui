import { DarkModeSwitch } from './dark-mode-switch';
import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export function Navbar() {
  const linkClassName =
    'rounded-lg inline-block pt-2 pb-2 pl-3 pr-3 text-xs uppercase text-primary hover:bg-primary/10';

  // dark mode management
  const [isDark, setIsDark] = useState(true);
  const systemPrefersDark = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
    undefined,
    (isSystemDark) => setIsDark(isSystemDark),
  );

  const applyDarkMode = useMemo(
    () => (isDark === undefined ? !!systemPrefersDark : isDark),
    [isDark, systemPrefersDark],
  );

  useEffect(() => {
    if (applyDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [applyDarkMode]);

  return (
    <header className="flex flex-row gap-1 p-1 h-5 w-screen">
      <div className="inline-block w-12 h-12 mr-3 rounded-full bg-primary">
        <span className="w-full h-full text-background text-xs font-semibold flex items-center justify-center">
          SHM
        </span>
      </div>
      <menu className="text-base mt-2">
        <Link className={linkClassName} to="/artists">
          <span className="uppercase p-2">Artists</span>
        </Link>
        <Link className={linkClassName} to="/albums">
          <span className="uppercase p-2">Albums</span>
        </Link>
        <Link className={linkClassName} to="/tracks">
          <span className="uppercase p-2">Tracks</span>
        </Link>
        <Link className={linkClassName} to="/queue">
          <span className="uppercase p-2">Playing Queue</span>
        </Link>
      </menu>
      <menu className="text-base mt-2 right-4 absolute flex flex-row">
        <Link className={linkClassName} to="/admin">
          <span className="uppercase p-2">Administrator</span>
        </Link>
        <Link className={linkClassName} to="/preferences">
          <span className="uppercase p-2">Preferences</span>
        </Link>
        <Link className={linkClassName} to="/signout">
          <span className="uppercase p-2">Sign out</span>
        </Link>
        <DarkModeSwitch className="mt-1.5 ml-2" />
      </menu>
    </header>
  );
}
