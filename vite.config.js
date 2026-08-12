import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

const pages = [
  'index', 'ozellikler', 'windows', 'mobil', 'indir', 'sss', 'basvuru', 'iletisim', 'kvkk',
]

export default defineConfig({
  plugins: [tailwindcss()],
  server: { port: 5710 },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((name) => [name, resolve(__dirname, `${name}.html`)]),
      ),
    },
  },
})
