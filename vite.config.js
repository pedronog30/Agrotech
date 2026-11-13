import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Só vale no "npm run dev": o Vite não roda a pasta api/ (quem roda é a
  // Vercel). Então, rodando local, repassamos as chamadas /api/... para o
  // site publicado. Assim a chave da API nunca precisa estar no computador.
  server: {
    proxy: {
      '/api': {
        target: 'https://agroconsulta.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
