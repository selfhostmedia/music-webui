import { DarkModeSwitch } from '../features/dark-mode-switch';
import { NavLink } from 'react-router-dom';
import { usePreferences } from '@/hooks/use-preferences';
import type { PreferenceNavigationLink } from '@/hooks/use-preferences';

const linkClassName = 'mx-1 inline-block rounded-lg px-2 py-2 text-xs uppercase text-primary hover:bg-primary/10';
const activeLinkClassName = 'bg-primary/20 font-semibold';

type Link = {
  to: string;
  label: PreferenceNavigationLink;
};

const primaryLinks: Link[] = [
  { to: '/albums', label: 'Albums' },
  { to: '/album-artists', label: 'Album Artists' },
  { to: '/track-artists', label: 'Artists' },
  { to: '/track-composers', label: 'Composers' },
  { to: '/track-genres', label: 'Genres' },
  { to: '/folders', label: 'Folders' },
  { to: '/tracks', label: 'Tracks' },
];

const secondaryLinks = [
  { to: '/admin', label: 'Admin' },
  { to: '/account', label: 'Account' },
  { to: '/signout', label: 'Sign out' },
];

type SecondaryLinksProps = {
  onNavigate?: () => void;
};

function getLinkClassName(isActive: boolean) {
  return [linkClassName, isActive ? activeLinkClassName : ''].join(' ');
}

function SecondaryLinks({ onNavigate }: SecondaryLinksProps) {
  return (
    <>
      {secondaryLinks.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => getLinkClassName(isActive)}
          onClick={onNavigate}
          aria-label={label}
        >
          {label}
        </NavLink>
      ))}
    </>
  );
}

export function Navbar() {
  const { preferences } = usePreferences();

  const showLink = (text: PreferenceNavigationLink) => {
    return preferences.navigation[text];
  };
  return (
    <header className="relative flex min-h-12 w-full items-start gap-1 p-1">
      <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
        <span className="text-xs font-semibold text-background">SHM</span>
      </div>
      <nav className="mt-2 flex flex-wrap text-base" aria-label="Primary navigation">
        {primaryLinks
          .filter(({ label }) => showLink(label))
          .map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => getLinkClassName(isActive)}>
              {label}
            </NavLink>
          ))}
      </nav>
      {/* Desktop secondary navigation */}
      <nav className="absolute right-1 top-3 hidden items-center sm:flex" aria-label="Account navigation">
        <SecondaryLinks />
        <DarkModeSwitch className="ml-2" aria-label="Toggle dark mode" />
      </nav>
    </header>
  );
}
