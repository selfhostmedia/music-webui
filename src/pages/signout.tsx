import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    const signOut = async () => {
      try {
        await logout();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error signing out:',
          error instanceof Error ? error.message : error,
        );
      }
      navigate('/signin');
    };
    signOut();
  }, []);
  return <></>;
}
