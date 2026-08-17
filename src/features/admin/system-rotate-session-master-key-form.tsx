import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import api from '@/lib/api';

export function SystemRotateSessionMasterKeyForm({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await api.post('/api/admin/regenerate-master-session-key', {
      params: {
        header: {
          ...api.authHeader(),
        },
      },
    });
    if (error) {
      console.error('Error regenerating session master key', error);
      toast.error('An error occurred generating a new master session key');
      return;
    }
    if (!data.success) {
      console.error('Failed to generate new session key', data);
      toast.error('An error occurred generating a new master session key');
      return;
    }
    setOpen(false);
    try {
      await logout();
    } catch {
      // expect an error here because the session is now invalid
    } finally {
      navigate('/signin');
    }
  };

  return (
    <>
      <Button
        className={`px-2 py-1 rounded mr-4 text-xs uppercase ${className ?? ''}`}
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Terminate all sessions
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Terminate all sessions</DialogTitle>
            <DialogDescription>
              This will immediately end all sessions for all users and devices. Each user and device will need to sign
              in again. You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Terminate all sessions
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
