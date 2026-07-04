import { PageBack, SiteFooter, SiteNav } from '../components/site-shell'

export function LabPage() {
  return (
    <>
      <SiteNav current="/lab" />
      <main class="page-wrap">
        <header class="page-section" style="padding-top: 48px; text-align: center;">
          <h1 class="display" style="font-size: var(--text-heading-lg); margin: 0 0 12px;">
            实验室
          </h1>
          <p style="margin: 0; color: var(--color-body-brown);">
            Cloudflare Pages + KV + D1 快速原型脚手架
          </p>
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
            <div class="form-actions">
              <button type="submit" class="btn-pill btn-pill--dark">
                写入
              </button>
              <button type="button" id="kv-read" class="btn-pill btn-pill--sand">
                读取
              </button>
              <button type="button" id="kv-delete" class="btn-pill btn-pill--danger">
                删除
              </button>
            </div>
          </form>
          <pre id="kv-result" class="result">
            等待操作…
          </pre>
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
            <button type="submit" class="btn-pill btn-pill--dark">
              添加 Note
            </button>
          </form>
          <ul id="notes-list" class="notes-list"></ul>
        </section>

        <section class="panel panel--stone hint">
          <h2>如何加新页面</h2>
          <ol>
            <li>
              在 <code>src/data/site-links.ts</code> 注册入口，并在 <code>src/index.tsx</code> 加路由
            </li>
            <li>
              变大后：新建 <code>src/routes/my-idea.tsx</code>，用 <code>app.route()</code> 挂载
            </li>
            <li>
              新 API 放 <code>src/routes/</code>，新表写 migration 后跑{' '}
              <code>pnpm run db:migrate:local</code>
            </li>
          </ol>
          <p style="margin-top: 16px;">
            <PageBack /> · <a href="/family-tree">家族树</a>
          </p>
        </section>
      </main>
      <SiteFooter />
      <script src="/static/lab.js"></script>
    </>
  )
}
