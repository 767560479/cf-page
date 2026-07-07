import kv from './routes/kv'
import notes from './routes/notes'
import family from './routes/family'
import { HomePage } from './pages/home'
import { LabPage } from './pages/lab'
import { FamilyTreePage } from './pages/family-tree'
import { CourseSchedulePage } from './pages/course-schedule'
import { RollCallPage } from './pages/roll-call'
import { SeatChartPage } from './pages/seat-chart'
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

export default app
