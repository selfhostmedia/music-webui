import './index.css';
import { AuthProvider } from './hooks/use-auth.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import AdminHomePage from './pages/admin/home.tsx';
import AdminLayout from './layouts/admin-layout.tsx';
import GuestLayout from './layouts/guest-layout';
import HomePage from './pages/home';
import SignInPage from './pages/signin';
import SignOutPage from './pages/signout';
import UserLayout from './layouts/user-layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<GuestLayout />}>
        <Route path="signin" element={<SignInPage />} />
      </Route>
      <Route element={<UserLayout />}>
        <Route path="" element={<HomePage />} />
        <Route path="signout" element={<SignOutPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="admin" element={<AdminHomePage />} />
      </Route>
    </Route>,
  ),
);

function App() {
  const queryClient = new QueryClient();

  return (
    <div
      className="w-full min-h-screen overflow-auto"
      style={{
        backgroundColor: 'var(--background)',
        backgroundImage: 'var(--background-image)',
        backgroundRepeat: 'repeat',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <RouterProvider router={router} />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
