import {
  EntryForm,
  EntryFormButton,
  EntryFormDescription,
  EntryFormError,
  EntryFormHeading,
  EntryFormHorizontalGroup,
  EntryFormInput,
  EntryFormLabel,
  EntryFormVerticalGroup,
} from '@/components';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import z from 'zod/v3';

type FormData = {
  username: string;
  password: string;
  remember?: boolean;
};

const schema = z.object({
  username: z.string().min(1, { message: 'Username is too short' }).max(255, { message: 'Username is too long' }),
  password: z.string().min(1, { message: 'Password is too short' }).max(255, { message: 'Password is too long' }),
  remember: z.boolean().optional(),
});

export default function SignInPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      const { error, data: response } = await api.post('/api/guest/create-session', {
        body: {
          username: data.username,
          password: data.password,
          expiresDays: data.remember ? 3650 : 1,
        },
      });
      if (error) {
        throw error instanceof Error ? error : new Error('An unknown error occurred');
      }
      if (!response.success || !response.jwtToken) {
        throw new Error('An unknown error occurred');
      }
      login(response.jwtToken, data.remember);
      await navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in:', error instanceof Error ? error.message : error);
      switch (error) {
        case 'invalid-username-error':
          errors.username = {
            type: 'manual',
            message: 'Your username is not valid',
          };
          return;
        case 'invalid-password-error':
          errors.password = {
            type: 'manual',
            message: 'Your password is not valid',
          };
          return;
        default:
          toast.error('An unknown error occurred');
      }
    }
  });

  return (
    <EntryForm onSubmit={onSubmit}>
      <EntryFormHeading text="Sign in" />
      <EntryFormDescription>
        Administrators can reset passwords through the web interface or via command line.
      </EntryFormDescription>
      <EntryFormVerticalGroup>
        <EntryFormLabel text="Username" htmlFor="username" />
        <EntryFormInput
          type="text"
          id="username"
          placeholder="username"
          {...register('username', { required: true })}
        />
        <EntryFormError text={errors.username?.message} />
      </EntryFormVerticalGroup>
      <EntryFormVerticalGroup>
        <EntryFormLabel text="Password" htmlFor="password" />
        <EntryFormInput
          id="password"
          type="password"
          placeholder="********"
          {...register('password', { required: true })}
        />
        <EntryFormError text={errors.password?.message} />
      </EntryFormVerticalGroup>
      <EntryFormHorizontalGroup>
        <input type="checkbox" id="remember" {...register('remember')} />
        <EntryFormLabel text="Remember me indefinitely" htmlFor="remember" />
      </EntryFormHorizontalGroup>
      <EntryFormButton text="Sign In" type="submit" />
    </EntryForm>
  );
}
