import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'



export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/todos": {
        target: "https://todolist-mern-backend-bur5.onrender.com",
        changeOrigin: true,
        secure: true,
      },
      // If you also call /todos/:id, the same proxy will handle it
    }
  }
});
