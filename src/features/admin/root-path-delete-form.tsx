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
import { useRootPaths } from '@/hooks/use-root-paths';
import { useState } from 'react';
import type { components } from '@/types/api-schema';

type RootPathDto = components['schemas']['AdminRootPathDto'];
type ErrorCodes = components['schemas']['AdminDeleteRootPathNotFoundErrorMessageEnum'];

export function RootPathDeleteForm({ rootPath }: { rootPath: RootPathDto }) {
  const [open, setOpen] = useState(false);
  const { deleteRootPath } = useRootPaths();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteRootPath(rootPath.id, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: (error) => {
        const errorMessage = error.message as ErrorCodes;
        switch (errorMessage) {
          case 'root-path-not-found-error':
            toast.error('The specified root path ID is invalid.');
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
      <Button className="px-2 py-1 rounded mr-4 text-xs uppercase" onClick={() => setOpen(true)} variant="destructive">
        Delete path
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Delete root path</DialogTitle>
            <DialogDescription>
              Deleting the path will not delete the files from your disk, but it will remove all references to the files
              in the database. These files can be reindexed any time by adding the path again, but custom metadata will
              be permanently lost by this action.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Delete root path
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
