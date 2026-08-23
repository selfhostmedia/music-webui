import { type AccountDto, type RegenerateSessionKeyErrorCodes, useAccounts } from '@/hooks/admin/use-accounts';
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
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export function UserRotateSessionKeyForm({ user, className }: { user: AccountDto; className?: string }) {
  const [open, setOpen] = useState(false);
  const { regenerateSessionKey } = useAccounts();
  const { handleSubmit } = useForm();

  const onSubmit = handleSubmit(async () => {
    await regenerateSessionKey(
      { query: { id: user.id } },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('All sessions terminated. The user will need to log in from any devices.');
        },
        onError: (error) => {
          const message = error.message as RegenerateSessionKeyErrorCodes;
          switch (message) {
            case 'account-not-found-error':
              toast.error('The specified account does not exist.');
              break;
            default:
              // eslint-disable-next-line no-console
              console.error('Unexpected error occurred while terminating sessions:', error);
              toast.error('An internal server error occurred. Please try again later.');
          }
        },
      },
    );
  });

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
              Terminating sessions will invalidate all existing sessions for the user by generating a new secret session
              key. The user will need to log in again from any devices.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                End sessions
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
