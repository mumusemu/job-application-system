import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://server:5000', // Docker Compose'da tanımladığınız server ismi
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0', // Docker'dan erişim için 0.0.0.0 kullanabilirsiniz
    strictPort: true,
    port: 3000,
  },
  preview: {
    host: '0.0.0.0', 
    strictPort: true,
    port: 3000,
  },
});
