import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['**/*.spec.{ts,tsx}'],
    server: {
      deps: {
        inline: ['next-intl', 'use-intl'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/i18n/routing': path.resolve(__dirname, './test/mocks/i18n-routing.ts'),
      'next/navigation': path.resolve(
        __dirname,
        './test/mocks/next-navigation.ts',
      ),
      'next/image': path.resolve(__dirname, './test/mocks/next-image.tsx'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
})
