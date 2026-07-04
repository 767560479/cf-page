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
          mode === 'dev-remote' ? { configPath: './wrangler.dev-remote.jsonc' } : undefined
        ),
      entry: 'src/index.tsx'
    })
  ]
}))
