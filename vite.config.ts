import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",      // necesario para exponer fuera del container
    port: 5173,           // puerto fijo
    strictPort: true,
    watch: {
      usePolling: true,   // Vite + Docker necesitan polling para recargar
    },
    hmr: {
      host: "localhost",  // si no, la UI no carga desde fuera del container
      protocol: "ws",
      port: 5173
    }
  }
})
