import { AppSidebar, primaryLinks, secondaryLinks } from '@/components/app-sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { QueueControls } from '@/components/queue-controls';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

const allNavigationLinks = [...primaryLinks, ...secondaryLinks];

function getActiveNavigationItem(pathname: string) {
  return allNavigationLinks
    .filter(({ to }) => pathname === to || pathname.startsWith(`${to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0];
}

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const activeItem = getActiveNavigationItem(location.pathname);
  const ActiveIcon = activeItem?.icon;

  useEffect(() => {
    if (!loading && !user) {
      if (location.pathname.startsWith('/signout')) {
        navigate('/signin');
      } else {
        navigate(`/signin?returnUrl=${encodeURIComponent(location.pathname)}`);
      }
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="opacity-25" />
          {activeItem && ActiveIcon && (
            <>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm font-medium">
                <ActiveIcon className="size-4 text-muted-foreground" />
                <span>{activeItem.label}</span>
              </div>
            </>
          )}
        </header>
        <main className="flex min-h-0 flex-1 flex-col pb-20">
          <Outlet />
          <QueueControls />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
