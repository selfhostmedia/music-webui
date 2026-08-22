import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      external: [/.*\.pom\.ts$/, /.*pom\.ts$/],
    },
  },
  envDir: false,
  server: {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT || 8000),
  },
  preview: {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT || 8100),
  },
});
