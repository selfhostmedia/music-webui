import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserRoleEnum } from '@/types/api-schema';
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/use-accounts';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type UserDto = components['schemas']['AdminAccountDto'];
type ErrorCodes =
  | components['schemas']['AdminUpdateUserRolesBadRequestErrorMessageEnum']
  | components['schemas']['AdminUpdateUserRolesNotFoundErrorMessageEnum'];

export function UserUpdateRolesForm({ user, className }: { user: UserDto; className?: string }) {
  const [open, setOpen] = useState(false);
  const { updateRoles } = useAccounts();
  const [formData, setFormData] = useState({ roles: user.roles });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateRoles(
      {
        accountId: user.id,
        roles: formData.roles,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          const message: ErrorCodes = error.message as ErrorCodes;
          switch (message) {
            case 'account-only-admin-error':
              toast.error('You must create another administrator before removing this permission.');
              break;
            case 'account-not-found-error':
              toast.error('The specified account does not exist.');
              break;
            case 'invalid-user-role-error':
              toast.error('An invalid role was specified');
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

  const toggleStatus = (role: UserRoleEnum) => {
    setFormData((prev) => {
      const newRoles = prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role];
      return { ...prev, roles: newRoles };
    });
  };

  return (
    <>
      <Button
        className={`px-2 py-1 rounded mr-4 text-xs uppercase ${className ?? ''}`}
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Update roles
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Update user roles</DialogTitle>
            <DialogDescription>Grant or revoke permissions for the user account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`flex flex-row space-x-2`}>
              <Switch
                id="admin-role"
                checked={formData.roles.includes(UserRoleEnum.admin)}
                onCheckedChange={() => toggleStatus(UserRoleEnum.admin)}
              />
              <Label>Administrator</Label>
            </div>
            <div className={`flex flex-row space-x-2`}>
              <Switch
                id="user-role"
                checked={formData.roles.includes(UserRoleEnum.user)}
                onCheckedChange={() => toggleStatus(UserRoleEnum.user)}
              />
              <Label>User</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Update roles
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
