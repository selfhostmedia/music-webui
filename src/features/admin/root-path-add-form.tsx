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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/use-accounts';
import { useRootPaths } from '@/hooks/use-root-paths';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type ErrorCodes =
  | components['schemas']['AdminCreateRootPathBadRequestErrorMessage']
  | components['schemas']['AdminCreateRootPathNotFoundErrorMessage'];

export function RootPathAddForm() {
  const [open, setOpen] = useState(false);
  const { accounts } = useAccounts();
  const [formData, setFormData] = useState({ accountId: 0, rootPath: '' });
  const { createRootPath } = useRootPaths();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.accountId === 0) {
      toast.error('Please select an account.');
      return;
    }
    if (!formData.rootPath) {
      toast.error('Please enter a root path.');
      return;
    }
    createRootPath(
      {
        accountId: formData.accountId,
        body: formData,
      },
      {
        onSuccess: () => {
          setFormData({ accountId: 0, rootPath: '' });
          setOpen(false);
        },
        onError: (error) => {
          const message: ErrorCodes = error.message as ErrorCodes;
          switch (message) {
            case 'root-path-does-not-exist-error':
              toast.error('The specified root path does not exist.');
              break;
            case 'duplicate-root-path-error':
              toast.error(
                'The specified root path has already been added to this account.',
              );
              break;
            case 'account-not-found-error':
              toast.error('The specified account does not exist.');
              break;
            default:
              toast.error(error.message);
              break;
          }
        },
      },
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, accountId: Number(value) }));
  };

  return (
    <>
      <Button
        className="px-2 mb-4 py-1 rounded text-xs uppercase"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <Plus /> Add root path
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add root path</DialogTitle>
            <DialogDescription>
              <span className="block mb-4">
                Users can configure their own root paths or you can do it on
                their behalf.
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">Account</Label>
              <NativeSelect
                id="accountId"
                name="accountId"
                onChange={handleSelect}
                className="w-full"
              >
                <NativeSelectOption value={0}>
                  Select an account
                </NativeSelectOption>
                {accounts?.map((account) => (
                  <NativeSelectOption key={account.id} value={account.id}>
                    {account.username}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rootPath">New path</Label>
              <Input
                id="rootPath"
                name="rootPath"
                value={formData.rootPath}
                onChange={handleChange}
                placeholder="Enter new path"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add root path</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
