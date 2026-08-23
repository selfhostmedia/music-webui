import { Button } from './ui/button';
import { DarkModeSwitch } from '../features/dark-mode-switch';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const linkClassName = 'mx-1 inline-block rounded-lg px-2 py-2 text-xs uppercase text-primary hover:bg-primary/10';

const primaryLinks = [
  { to: '/artists', label: 'Artists' },
  { to: '/albums', label: 'Albums' },
  { to: '/tracks', label: 'Tracks' },
  { to: '/queue', label: 'Playing Queue' },
];

const secondaryLinks = [
  { to: '/admin', label: 'Admin' },
  { to: '/account', label: 'Account' },
  { to: '/signout', label: 'Sign out' },
];

type SecondaryLinksProps = {
  onNavigate?: () => void;
};

function SecondaryLinks({ onNavigate }: SecondaryLinksProps) {
  return (
    <>
      {secondaryLinks.map(({ to, label }) => (
        <Link key={to} className={linkClassName} to={to} onClick={onNavigate} aria-label={label}>
          {label}
        </Link>
      ))}
    </>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  return (
    <header className="relative flex min-h-12 w-full items-start gap-1 p-1">
      <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
        <span className="text-xs font-semibold text-background">SHM</span>
      </div>
      <nav className="mt-2 flex flex-wrap text-base" aria-label="Primary navigation">
        {primaryLinks.map(({ to, label }) => (
          <Link key={to} className={linkClassName} to={to}>
            {label}
          </Link>
        ))}
      </nav>
      {/* Desktop secondary navigation */}
      <nav className="absolute right-1 top-3 hidden items-center sm:flex" aria-label="Account navigation">
        <SecondaryLinks />
        <DarkModeSwitch className="ml-2" aria-label="Toggle dark mode" />
      </nav>
      {/* Mobile secondary navigation */}
      <div className="sm:hidden">
        <Button
          variant="secondary"
          className="absolute right-3 top-3 h-8 rounded-lg px-3 py-2 text-xl text-primary hover:bg-primary/10"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-secondary-menu"
          aria-haspopup="true"
          aria-label={mobileMenuOpen ? 'Close account menu' : 'Open account menu'}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
        <nav
          id="mobile-secondary-menu"
          aria-label="Account navigation"
          className={[
            'absolute right-3 top-12 z-10 min-w-32 flex-col rounded-lg',
            'border border-primary/20 bg-background p-2 pb-4 shadow-lg',
            mobileMenuOpen ? 'flex' : 'hidden',
          ].join(' ')}
        >
          <SecondaryLinks onNavigate={closeMobileMenu} />
          <DarkModeSwitch className="ml-2 mt-2" aria-label="Toggle dark mode" onChange={closeMobileMenu} />
        </nav>
      </div>
    </header>
  );
}
