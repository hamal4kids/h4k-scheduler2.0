import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/h4k-scheduler2.0/',
  plugins: [react()],
});
