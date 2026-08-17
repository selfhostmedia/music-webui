import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IndexerToggle } from './indexer-toggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRootPaths } from '@/hooks/use-root-paths';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type ErrorCodes =
  | components['schemas']['AdminUpdateRootPathBadRequestErrorMessage']
  | components['schemas']['AdminUpdateRootPathNotFoundErrorMessage'];

type RootPathDto = components['schemas']['AdminRootPathDto'];

export function RootPathUpdateForm({ rootPath }: { rootPath: RootPathDto }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ newPath: rootPath.rootPath });
  const { updateRootPath } = useRootPaths();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateRootPath(
      {
        rootPathId: rootPath.id,
        body: formData,
      },
      {
        onSuccess: () => {
          setFormData({ newPath: '' });
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
        className="px-2 py-1 rounded mr-4 text-xs uppercase"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Change path
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Update root path</DialogTitle>
            <div className="space-y-4">
              <DialogDescription>
                When the path changes the indexer will automatically purge old
                file references from the database because the files no longer
                exist, then it will find them in their new location and add them
                to the database.
              </DialogDescription>
              <p className="block mb-4 text-muted-foreground">
                If you wish to preserve custom metadata or avoid fully scanning
                the path again:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground">
                <li className="mb-2">Disable the indexer</li>
                <li className="mb-2">
                  Make the changes to your filesystem or docker volume mapping
                </li>
                <li className="mb-2">Save the new root path below</li>
                <li>Re-enable indexer</li>
              </ol>
            </div>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <IndexerToggle />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPath">New path</Label>
              <Input
                id="newPath"
                name="newPath"
                value={formData.newPath}
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
              <Button type="submit">Update root path</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
