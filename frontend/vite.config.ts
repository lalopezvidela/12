
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
 import react from '@vitejs/plugin-react'; // Uncomment and use in plugins if needed

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
 plugins: [react()], // Uncomment this line if you want to use the React plugin
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    preview: {
      host: true,
      port: Number(process.env.PORT) || 4173,
      allowedHosts: ['lox-6lxs.onrender.com', 'localhost', '127.0.0.1'],
    },
    server: {
      host: true,
      cors: {
        origin: [
          'https://lox-6lxs.onrender.com',
          'http://localhost:3000'
        ],
        credentials: true
      }
    }
  };
});
