import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/use-accounts';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type UserDto = components['schemas']['AdminAccountDto'];
type ErrorCodes =
  | components['schemas']['AdminResetUserPasswordBadRequestErrorMessageEnum']
  | components['schemas']['AdminResetUserPasswordNotFoundErrorMessageEnum'];

export function UserUpdatePasswordForm({ user, className }: { user: UserDto; className?: string }) {
  const [open, setOpen] = useState(false);
  const { resetPassword } = useAccounts();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await resetPassword(
      {
        accountId: user.id,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Password reset successfully. The user will need to log in again with the new password.');
        },
        onError: (error) => {
          const message: ErrorCodes = error.message as ErrorCodes;
          switch (message) {
            case 'account-not-found-error':
              toast.error('The specified account does not exist.');
              break;
            case 'invalid-password-error':
              toast.error('The specified password is invalid.');
              break;
            case 'invalid-password-length-error':
              toast.error('The new password length is invalid.');
              break;
            default:
              toast.error(error.message);
              break;
          }
        },
      },
    );
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Button
        className={`px-2 py-1 rounded mr-4 text-xs uppercase ${className ?? ''}`}
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Reset password
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Reset user password</DialogTitle>
            <DialogDescription>
              After resetting the password, the user will be required to log in again with the new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Set new password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
