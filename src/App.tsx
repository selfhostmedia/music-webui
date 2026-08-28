import './index.css';
import { AuthProvider } from './hooks/use-auth.tsx';
import { PlaybackProvider } from './features/playback.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import AccountPage from './pages/account';
import AdminHomePage from './pages/admin/home.tsx';
import AdminLayout from './layouts/admin-layout.tsx';
import AlbumArtistsPage from './pages/album-artists.tsx';
import AlbumsPage from './pages/albums';
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
        <Route path="/" element={<HomePage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumId/:slug" element={<AlbumsPage />} />
        <Route path="/album-artists" element={<AlbumArtistsPage />} />
        <Route path="/album-artists/:artistId/:slug" element={<AlbumArtistsPage />} />
        <Route path="account" element={<AccountPage />} />
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
      className="w-full min-w-32 min-h-screen overflow-auto"
      style={{
        backgroundColor: 'var(--background)',
        backgroundImage: 'var(--background-image)',
        backgroundRepeat: 'repeat',
      }}
    >
      <PlaybackProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <RouterProvider router={router} />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PlaybackProvider>
    </div>
  );
}

export default App;
