import { Hono } from 'hono'
import { renderer } from './renderer'
import kv from './routes/kv'
import notes from './routes/notes'
import family from './routes/family'
import { CodexLanding } from './pages/codex-landing'
import { HomePage } from './pages/home'
import { LabPage } from './pages/lab'
import { FamilyTreePage } from './pages/family-tree'

type Bindings = {
  KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.route('/api/kv', kv)
app.route('/api/notes', notes)
app.route('/api/family', family)

app.get('/', (c) => {
  return c.render(<HomePage />, { title: 'cf-page' })
})

app.get('/codex', (c) => {
  return c.render(<CodexLanding />, {
    title: 'Codex — 不只是写代码',
    css: '/static/codex.css',
  })
})

app.get('/lab', (c) => {
  return c.render(<LabPage />, { title: 'cf-page 实验室' })
})

app.get('/family-tree', (c) => {
  return c.render(<FamilyTreePage />, {
    title: '家族树',
    css: '/static/family-tree.css',
  })
})

export default app
