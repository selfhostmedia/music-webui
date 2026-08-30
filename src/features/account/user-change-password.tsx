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
import { toast } from 'sonner';
import { useAccounts } from '@/hooks/user/use-accounts';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod/v3';
import type { paths } from '@/types/api-schema';

type UpdatePasswordEndpoint = paths['/api/user/update-password']['post'];
type UpdatePasswordBodyDto = UpdatePasswordEndpoint['requestBody']['content']['application/json'];

type FormData = UpdatePasswordBodyDto & {
  confirmPassword: string;
};

const schema = z
  .object({
    newPassword: z
      .string()
      .refine((value) => value.length > 0, {
        message: 'Password is required',
      })
      .refine((value) => value.length >= 1, {
        message: 'Password is too short',
      })
      .refine((value) => value.length <= 255, {
        message: 'Password is too long',
      }),
    confirmPassword: z
      .string()
      .refine((value) => value.length > 0, {
        message: 'Confirm password is required',
      })
      .refine((value) => value.length >= 1, {
        message: 'Confirm password is too short',
      })
      .refine((value) => value.length <= 255, {
        message: 'Confirm password is too long',
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export function UserChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const { updatePassword } = useAccounts();
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (formData: FormData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await updatePassword(
      {
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Password changed successfully. You will need to log in again with the new password.');
        },
        onError: (error) => {
          for (let i = 0; i < error.messages.length; i += 1) {
            const message = error.messages[i];
            switch (message) {
              case 'invalid-password-error':
                setError('newPassword', { type: 'manual', message: 'The specified password is invalid.' });
                break;
              case 'invalid-password-length-error':
                setError('newPassword', { type: 'manual', message: 'The new password length is invalid.' });
                break;
              default:
                // eslint-disable-next-line no-console
                console.error('Unexpected error occurred while changing password:', error);
                toast.error('An internal server error occurred. Please try again later.');
                break;
            }
          }
        },
      },
    );
    setOpen(false);
  });

  return (
    <>
      <Button className="px-2 py-1 rounded mr-4 text-xs uppercase" onClick={() => setOpen(true)} variant="outline">
        Change password
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Change your password</DialogTitle>
            <DialogDescription>
              After changing your password, you will be required to log in again with the new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword', { required: true })}
                placeholder="Enter new password"
              />
              <FormValidationError text={errors.newPassword?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { required: true })}
                placeholder="Enter new password"
              />
              <FormValidationError text={errors.confirmPassword?.message} />
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
