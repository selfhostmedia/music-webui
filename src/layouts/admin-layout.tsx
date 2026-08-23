import { IndexerProvider } from '@/hooks/admin/use-indexer';
import { Navbar } from '@/components';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      if (!location.pathname.startsWith('/signout')) {
        navigate(`/signin?returnUrl=${encodeURIComponent(location.pathname)}`);
      } else {
        navigate(`/signin`);
      }
      return;
    }
    if (!loading && user?.roles.indexOf('admin') === -1) {
      toast.error('You must be signed in as an admin to access this page.');
      navigate(`/`);
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <></>;
  }
  if (!user) {
    return null;
  }
  return (
    <IndexerProvider>
      <section className="w-screen min-h-screen flex flex-col">
        <section className="flex p-4 h-20 w-screen authenticated">
          <Navbar />
        </section>
        <section className="p-4 w-screen flex flex-col grow">
          <Outlet />
        </section>
      </section>
    </IndexerProvider>
  );
}
