import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { UserRoleEnum } from '@/types/api-schema';
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/use-accounts';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type ErrorCodes = components['schemas']['AdminCreateAccountBadRequestErrorMessageEnum'];

export function UserAddForm({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { createAccount } = useAccounts();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    roles: [] as UserRoleEnum[],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.roles.length) {
      toast.error('Please select at least one role.');
      return;
    }
    await createAccount(
      {
        username: formData.username,
        password: formData.password,
        roles: formData.roles,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          const message: ErrorCodes = error.message as ErrorCodes;
          switch (message) {
            case 'invalid-user-role-error':
              toast.error('No roles were specified for the account.');
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

  const toggleStatus = (role: UserRoleEnum) => {
    setFormData((prev) => {
      const newRoles = prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role];
      return { ...prev, roles: newRoles };
    });
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
        <Plus /> Add account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add user account</DialogTitle>
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

            <div className="space-y-2">
              <Label htmlFor="password">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
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
              <Button type="submit" variant="default">
                Add account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
