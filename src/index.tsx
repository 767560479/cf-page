import { Hono } from 'hono'
import { renderer } from './renderer'
import kv from './routes/kv'
import notes from './routes/notes'

type Bindings = {
  KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.route('/api/kv', kv)
app.route('/api/notes', notes)

app.get('/', (c) => {
  return c.render(
    <>
      <main class="container">
        <header>
          <h1>cf-page 实验室</h1>
          <p>Cloudflare Pages + KV + D1 快速原型脚手架</p>
        </header>

        <section class="panel">
          <h2>KV 键值存储</h2>
          <form id="kv-form" class="form">
            <label>
              Key
              <input name="key" type="text" placeholder="demo-key" required />
            </label>
            <label>
              Value
              <input name="value" type="text" placeholder="hello kv" required />
            </label>
            <div class="actions">
              <button type="submit">写入</button>
              <button type="button" id="kv-read">读取</button>
              <button type="button" id="kv-delete" class="danger">删除</button>
            </div>
          </form>
          <pre id="kv-result" class="result">等待操作…</pre>
        </section>

        <section class="panel">
          <h2>D1 Notes</h2>
          <form id="note-form" class="form">
            <label>
              标题
              <input name="title" type="text" placeholder="一个小想法" required />
            </label>
            <label>
              内容
              <textarea name="content" rows="3" placeholder="可选描述"></textarea>
            </label>
            <button type="submit">添加 Note</button>
          </form>
          <ul id="notes-list" class="notes-list"></ul>
        </section>

        <section class="panel hint">
          <h2>如何加新页面</h2>
          <ol>
            <li>最快：在 <code>src/index.tsx</code> 加 <code>app.get('/my-idea', ...)</code></li>
            <li>变大后：新建 <code>src/routes/my-idea.tsx</code>，用 <code>app.route()</code> 挂载</li>
            <li>新 API 放 <code>src/routes/</code>，新表写 migration 后跑 <code>npm run db:migrate:local</code></li>
          </ol>
        </section>
      </main>
      <script src="/static/lab.js"></script>
    </>
  )
})

export default app
