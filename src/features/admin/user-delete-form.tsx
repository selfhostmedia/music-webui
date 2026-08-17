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
type ErrorCodes =
  | components['schemas']['AdminDeleteAccountBadRequestErrorMessage']
  | components['schemas']['AdminDeleteAccountNotFoundErrorMessage'];

export function UserDeleteForm({
  user,
  className,
}: {
  user: UserDto;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { deleteAccount } = useAccounts();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteAccount(user.id, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (error) => {
        const message: ErrorCodes = error.message as ErrorCodes;
        switch (message) {
          case 'account-not-found-error':
            toast.error('The specified account does not exist.');
            break;
          case 'invalid-account-id-error':
            toast.error('The specified account ID is invalid.');
            break;
          case 'account-only-admin-error':
            toast.error(
              'You must create a new admin account before deleting this one.',
            );
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
        variant="destructive"
      >
        Delete user
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Deleting a user will erase the account and all associated data
              from the database. This will not delete any files from your disk.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Delete account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
