import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    build(),
    devServer({
      adapter: () =>
        cloudflareAdapter(
          mode === 'dev-remote' ? { proxy: { environment: 'dev-remote' } } : undefined
        ),
      entry: 'src/index.tsx'
    })
  ]
}))
