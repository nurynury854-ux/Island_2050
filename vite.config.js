import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is the tool that runs the dev server and builds the final website.
export default defineConfig({
  plugins: [react()],
});
