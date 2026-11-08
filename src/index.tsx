import kv from './routes/kv'
import notes from './routes/notes'
import family from './routes/family'
import { HomePage } from './pages/home'
import { LabPage } from './pages/lab'
import { FamilyTreePage } from './pages/family-tree'
import { CourseSchedulePage } from './pages/course-schedule'
import { RollCallPage } from './pages/roll-call'
import { SeatChartPage } from './pages/seat-chart'
import { StelePage } from './pages/stele'
import { getStele, listSteles } from './steles'
import { Hono } from 'hono'
import { renderer } from './renderer'

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

app.get('/lab', (c) => {
  return c.render(<LabPage />, { title: 'cf-page 实验室' })
})

app.get('/family-tree', (c) => {
  return c.render(<FamilyTreePage />, {
    title: '家族树',
    css: '/static/family-tree.css',
  })
})

app.get('/course-schedule', (c) => {
  return c.render(<CourseSchedulePage />, {
    title: '课程表编排',
    css: '/static/course-schedule.css',
  })
})

app.get('/roll-call', (c) => {
  return c.render(<RollCallPage />, {
    title: '课堂点名',
    css: '/static/roll-call.css',
  })
})

app.get('/seat-chart', (c) => {
  return c.render(<SeatChartPage />, {
    title: '学生智能排座',
    css: '/static/seat-chart.css',
  })
})

app.get('/stele', (c) => {
  const first = listSteles()[0]
  if (!first) return c.notFound()
  return c.redirect(`/stele/${first.slug}`)
})

app.get('/stele/:slug', (c) => {
  const stele = getStele(c.req.param('slug'))
  if (!stele) return c.notFound()
  return c.render(<StelePage stele={stele} />, {
    title: stele.title,
    css: '/static/stele.css?v=20261108b',
  })
})

export default app
