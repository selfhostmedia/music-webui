import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormValidationError } from '@/components/form-validation-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRootPaths } from '@/hooks/user/use-root-paths';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod/v3';
import type { paths } from '@/types/api-schema';

type CreateBodyDto = paths['/api/user/create-root-path']['post']['requestBody']['content']['application/json'];

const schema = z.object({
  rootPath: z
    .string()
    .refine((value) => value.length > 0, {
      message: 'Root path is required',
    })
    .refine((value) => value.length >= 1, {
      message: 'Root path is too short',
    })
    .refine((value) => value.length <= 1024, {
      message: 'Root path is too long',
    }),
});

export function RootPathAddForm() {
  const [open, setOpen] = useState(false);
  const { createRootPath } = useRootPaths();
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateBodyDto>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (formData: CreateBodyDto) => {
    await createRootPath(
      {
        rootPath: formData.rootPath,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Root path added successfully.  It will begin indexing shortly if the indexer is enabled.');
        },
        onError: (error) => {
          for (let i = 0; i < error.messages.length; i += 1) {
            const message = error.messages[i];
            switch (message) {
              case 'root-path-does-not-exist-error':
                setError('rootPath', { type: 'manual', message: 'The specified root path does not exist.' });
                break;
              case 'duplicate-root-path-error':
                setError('rootPath', {
                  type: 'manual',
                  message: 'The specified root path has already been added to this account.',
                });
                break;
              default:
                // eslint-disable-next-line no-console
                console.error('Unexpected error occurred while adding root path:', error);
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
      <Button className="px-2 mb-4 py-1 rounded text-xs uppercase" onClick={() => setOpen(true)} variant="outline">
        <Plus /> Add root path
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add root path</DialogTitle>
            <DialogDescription>
              <span className="block mb-4">
                Add a path containing some or all of your music library. The indexer will scan this path for music files
                and add them to your library. You can have multiple paths.
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rootPath">New path</Label>
              <Input id="rootPath" {...register('rootPath', { required: true })} placeholder="Enter new path" />
              <FormValidationError text={errors.rootPath?.message} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save new path</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
