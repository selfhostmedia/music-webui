import { Navbar } from '@/components';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      navigate(`/signin?from=${location.pathname}`);
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <></>;
  }
  if (!user) {
    return null;
  }
  return (
    <section className="w-screen min-h-screen flex flex-col">
      <section className="flex p-4 h-20 w-screen authenticated">
        <Navbar />
      </section>
      <section className="p-4 w-screen flex flex-col grow">
        <Outlet />
      </section>
    </section>
  );
}
