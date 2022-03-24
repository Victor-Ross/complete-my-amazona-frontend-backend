import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare module '*.scss';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
