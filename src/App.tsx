import './index.css';
import { AuthProvider } from './hooks/use-auth.tsx';
import { LibraryProvider } from './features/library/library.tsx';
import { PreferencesProvider } from './hooks/use-preferences.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueueProvider } from './features/library/queue.tsx';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import AccountPage from './pages/account';
import AdminHomePage from './pages/admin/home.tsx';
import AdminLayout from './layouts/admin-layout.tsx';
import AlbumArtistsPage from './pages/album-artists.tsx';
import AlbumsPage from './pages/albums';
import FoldersPage from './pages/folders';
import GuestLayout from './layouts/guest-layout';
import HomePage from './pages/home';
import QueuePage from './pages/queue.tsx';
import SignInPage from './pages/signin';
import SignOutPage from './pages/signout';
import TrackArtistsPage from './pages/track-artists.tsx';
import TrackComposersPage from './pages/track-composers.tsx';
import TrackGenresPage from './pages/track-genres.tsx';
import TracksPage from './pages/tracks.tsx';
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
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/folders/:folderId/:slug*" element={<FoldersPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/track-artists" element={<TrackArtistsPage />} />
        <Route path="/track-artists/:artistId/:slug" element={<TrackArtistsPage />} />
        <Route path="/track-composers" element={<TrackComposersPage />} />
        <Route path="/track-composers/:composerId/:slug" element={<TrackComposersPage />} />
        <Route path="/track-genres" element={<TrackGenresPage />} />
        <Route path="/track-genres/:genreId/:slug" element={<TrackGenresPage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="signout" element={<SignOutPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="admin" element={<AdminHomePage />} />
      </Route>
    </Route>,
  ),
);

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div className="w-full min-w-32 min-h-screen overflow-auto select-none">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PreferencesProvider>
            <LibraryProvider>
              <QueueProvider>
                <TooltipProvider>
                  <Toaster />
                  <RouterProvider router={router} />
                </TooltipProvider>
              </QueueProvider>
            </LibraryProvider>
          </PreferencesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}
