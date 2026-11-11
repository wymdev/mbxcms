import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Keep the build portable between the domain root and cPanel staging folders.
  base: './',
  plugins: [react(), tailwindcss()],
});
