import { defineConfig } from 'vite';
import _react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [_react()],
});
