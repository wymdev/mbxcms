import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'logo.png', '.htaccess'],
      manifest: {
        name: 'Mergui Boss Money Exchange',
        short_name: 'Mergui Boss',
        description: 'Thai Baht and Myanmar Kyat exchange with live rates and no service fee.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0A2A20',
        theme_color: '#0A2A20',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            // live rates: always try the network first, fall back to the last copy when offline
            urlPattern: ({ url }) => url.pathname.includes('/rates'),
            handler: 'NetworkFirst',
            options: { cacheName: 'mbx-rates', networkTimeoutSeconds: 4 },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'mbx-fonts' },
          },
        ],
      },
    }),
  ],
});
