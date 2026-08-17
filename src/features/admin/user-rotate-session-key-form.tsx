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
import { useAccounts } from '@/hooks/use-accounts';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type UserDto = components['schemas']['AdminAccountDto'];
type ErrorCodes = components['schemas']['AdminRegenerateUserSessionKeyNotFoundErrorMessage'];

export function UserRotateSessionKeyForm({ user, className }: { user: UserDto; className?: string }) {
  const [open, setOpen] = useState(false);
  const { regenerateSessionKey } = useAccounts();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await regenerateSessionKey(user.id, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (error) => {
        const message: ErrorCodes = error.message as ErrorCodes;
        switch (message) {
          case 'account-not-found-error':
            toast.error('The specified account does not exist.');
            break;
          default:
            toast.error(error.message);
            break;
        }
      },
    });
  };

  return (
    <>
      <Button
        className={`px-2 py-1 rounded mr-4 text-xs uppercase ${className ?? ''}`}
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Terminate sessions
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Terminate sessions</DialogTitle>
            <DialogDescription>
              Terminating sessions will invalidate all existing sessions for the user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Terminate sessions
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
