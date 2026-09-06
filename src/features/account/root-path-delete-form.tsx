import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type RootPathDto, useRootPaths } from '@/hooks/user/use-root-paths';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export function RootPathDeleteForm({ rootPath }: { rootPath: RootPathDto }) {
  const [open, setOpen] = useState(false);
  const { deleteRootPath } = useRootPaths();
  const { handleSubmit } = useForm();

  const onSubmit = handleSubmit(async () => {
    await deleteRootPath(
      { id: rootPath.id },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          for (let i = 0; i < error.messages.length; i += 1) {
            const message = error.messages[i];
            switch (message) {
              case 'root-path-not-found-error':
                toast.error('The specified root path ID is invalid.');
                break;
              default:
                // eslint-disable-next-line no-console
                console.error('Unexpected error occurred while deleting root path:', error);
                toast.error('An internal server error occurred. Please try again later.');
                break;
            }
          }
        },
      },
    );
  });

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
              Deleting the path will not delete your files from your disk, but it will remove all references to your
              files in the database. These files can be reindexed any time by adding the path again, but custom metadata
              will be permanently lost by this action. To preserve custom metadata an administrator can pause the
              indexer, update this root path to a new location, and then resume the indexer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
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
