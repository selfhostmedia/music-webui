import { Button } from './ui/button';
import { DarkModeSwitch } from '../features/dark-mode-switch';
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import { useIsMobile } from '../hooks/use-is-mobile';
import { useState } from 'react';

export function Navbar() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linkClassName = 'rounded-lg inline-block px-2 mx-1 py-2 text-xs uppercase text-primary hover:bg-primary/10';

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative flex min-h-12 w-full items-start gap-1 p-1">
      <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
        <span className="text-xs font-semibold text-background">SHM</span>
      </div>
      {/* Main menu */}
      <nav className="mt-2 flex flex-wrap text-base">
        <Link className={linkClassName} to="/artists">
          Artists
        </Link>

        <Link className={linkClassName} to="/albums">
          Albums
        </Link>

        <Link className={linkClassName} to="/tracks">
          Tracks
        </Link>

        <Link className={linkClassName} to="/queue">
          Playing Queue
        </Link>
      </nav>
      {/* Desktop secondary menu */}
      {!isMobile && (
        <nav className="absolute right-1 top-3 items-center flex">
          <Link className={linkClassName} to="/admin" aria-label="Administration">
            Admin
          </Link>
          <Link className={linkClassName} to="/preferences" aria-label="User preferences">
            Account
          </Link>
          <Link className={linkClassName} to="/signout" aria-label="Sign out">
            Sign out
          </Link>
          <DarkModeSwitch className="ml-2" aria-label="Toggle dark mode" />
        </nav>
      )}
      {/* Mobile menu button and menu */}
      {isMobile && (
        <Button
          role="button"
          variant="secondary"
          className="absolute right-3 top-3 h-8 rounded-lg px-3 py-2 text-xl text-primary hover:bg-primary/10"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-secondary-menu"
          aria-label="Toggle account menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu />
        </Button>
      )}
      {isMobile && mobileMenuOpen && (
        <nav
          id="mobile-secondary-menu"
          className={`absolute right-3 top-12 z-10 flex min-w-32 flex-col rounded-lg 
            border border-primary/20 bg-background p-2 pb-4 shadow-lg`}
        >
          <Link className={linkClassName} to="/admin" onClick={closeMobileMenu} aria-label="Administration">
            Admin
          </Link>
          <Link className={linkClassName} to="/preferences" onClick={closeMobileMenu} aria-label="User preferences">
            Preferences
          </Link>
          <Link className={linkClassName} to="/signout" onClick={closeMobileMenu} aria-label="Sign out">
            Sign out
          </Link>
          <DarkModeSwitch className="ml-2 mt-2" onChange={closeMobileMenu} aria-label="Toggle dark mode" />
        </nav>
      )}
    </header>
  );
}
