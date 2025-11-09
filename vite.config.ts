import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  base: '/web-game/',
  plugins: [react()],
} satisfies UserConfig