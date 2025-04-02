import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true, // Permite acesso externo
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'jotai'],
          'pdf': ['jspdf'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'excel': ['xlsx']
        }
      }
    }
  }
});