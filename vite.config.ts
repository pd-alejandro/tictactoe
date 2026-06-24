import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 123 << 16,
        firefox: 120 << 16,
        safari: (17 << 16) | (5 << 8),
      }
    }
  }
});