# cf-page — Cloudflare Pages 快速原型脚手架

Hono + Cloudflare Pages + **KV** + **D1**，用于快速做小页面和小功能。

## 前置条件

- Node.js 18+
- Cloudflare 账号
- `npx wrangler login` 已登录

## 首次配置 Cloudflare 资源

脚手架已带占位 binding，部署前请创建真实资源并更新 [`wrangler.jsonc`](wrangler.jsonc)：

```bash
# 创建 KV（记下输出的 id）
npx wrangler kv namespace create CF_PAGE_KV

# 创建 D1 数据库（记下 database_id）
npx wrangler d1 create cf-page-db
```

将 `wrangler.jsonc` 中 `kv_namespaces[0].id` 和 `d1_databases[0].database_id` 替换为上面命令输出的值。

生成 TypeScript 绑定类型：

```bash
npm run cf-typegen
```

## 本地开发

```bash
# 安装依赖（网络不稳时推荐 pnpm install）
pnpm install

# 本地 D1 建表
pnpm run db:migrate:local

# 启动开发服务器（热更新）
pnpm run dev

# 完整 KV/D1 绑定验证（需先 build）
pnpm run build
pnpm exec wrangler pages dev dist --port 8788
```

浏览器打开终端提示的地址（通常 `http://localhost:5173`）：

| 路径 | 说明 |
|------|------|
| `/` | **功能入口门户**（本站应用 + 外链） |
| `/family-tree` | 家族树（D1 CRUD + 可缩放树图） |
| `/lab` | KV / D1 实验室 |
| `/codex` | Codex 概念展示页 |

> **家族树**依赖 D1。`pnpm run dev` 使用 Cloudflare 本地适配器，需先执行 `pnpm run db:migrate:local`。若 API 无数据，可用 `pnpm run build` + `pnpm exec wrangler pages dev dist` 验证完整绑定。

## 家族树

路径 [`/family-tree`](http://localhost:5173/family-tree)，数据存 D1（`persons` / `parent_links` / `spouse_links`）。

**功能：** 成员增删改查；父亲/母亲/配偶关系；焦点人物上下 N 代子图；dagre 布局 + 滚轮/按钮缩放与拖拽平移；姓名搜索定位。

**首次使用：**

```bash
pnpm run db:migrate:local   # 含示例三代张氏家族数据
pnpm run dev
# 打开 http://localhost:5173/family-tree
```

**部署后**需额外执行：`pnpm run db:migrate:remote`

**API 前缀：** `/api/family`（persons、parents、spouses、tree）

> 当前无登录，部署到公网前请评估隐私风险。

## 部署

```bash
# 首次需创建 Pages 项目（仅一次）
pnpm exec wrangler pages project create cf-page --production-branch main

# 线上 D1 建表（首次部署后执行一次）
pnpm run db:migrate:remote

# 构建并部署到 *.pages.dev
pnpm run deploy
```

部署后在 Cloudflare Dashboard → Pages → cf-page → Settings → Bindings 确认 KV / D1 已关联（wrangler.jsonc 中的绑定通常会自动同步）。

## 日常发布 checklist

按你这次改了什么，对照执行即可。

### 只改了页面 / API / 静态资源

- [ ] 本地验证：`pnpm run dev`（或 `pnpm run build` + `pnpm exec wrangler pages dev dist`）
- [ ] 部署：`pnpm run deploy`

### 新建或修改了 D1 表结构

- [ ] 在 `migrations/` 新增 SQL（如 `0002_add_xxx.sql`）
- [ ] 本地迁移：`pnpm run db:migrate:local`
- [ ] 本地验证相关 API / 页面
- [ ] 部署代码：`pnpm run deploy`
- [ ] **线上迁移**：`pnpm run db:migrate:remote`（必做，deploy 不会自动建表）

> 顺序建议：先本地 migrate 验证，再 deploy，最后 remote migrate。若新 API 依赖新表，remote migrate 要在上线后尽快执行，否则线上会报「表不存在」。

### 只改了 KV 相关逻辑

- [ ] 本地验证
- [ ] `pnpm run deploy`（KV 无需 migration）

### 改了 wrangler 绑定（新增 KV / D1 / 环境变量）

- [ ] 更新 `wrangler.jsonc`
- [ ] `pnpm run cf-typegen`（更新 TypeScript 类型）
- [ ] Dashboard → Pages → cf-page → Bindings 确认已同步
- [ ] `pnpm run deploy`

### 快速对照

| 改动类型 | deploy | db:migrate:local | db:migrate:remote |
|---------|--------|------------------|-------------------|
| 新页面 / 改 UI | ✅ | — | — |
| 新 API（无新表） | ✅ | — | — |
| 新 D1 表 / 改字段 | ✅ | ✅ | ✅ |
| 仅 KV | ✅ | — | — |

## 项目结构

```
src/
  index.tsx          # 主应用 + 路由
  renderer.tsx       # HTML 布局
  data/
    site-links.ts    # 首页入口配置（本站 + 外链）
  pages/
    home.tsx         # 首页门户
    codex-landing.tsx
    family-tree.tsx
    lab.tsx
  routes/
    kv.ts            # /api/kv/*
    notes.ts         # /api/notes/*
    family.ts        # /api/family/*
  lib/
    db.ts            # D1 Notes
    family.ts        # D1 家族树
migrations/          # D1 迁移（0002 为家族树表 + 示例数据）
public/static/       # 静态 CSS / JS
```

## 如何加新功能

### 加一个新页面

1. 在 `src/pages/` 新建页面组件
2. 在 `src/index.tsx` 注册路由
3. 在 [`src/data/site-links.ts`](src/data/site-links.ts) 的 `localApps` 增加一项，首页会自动出现入口

**最快** — 在 `src/index.tsx` 增加路由：

```tsx
app.get('/my-idea', (c) => c.render(<h1>我的小功能</h1>))
```

**功能变大** — 新建 `src/routes/my-idea.tsx`，在主入口挂载：

```tsx
import myIdea from './routes/my-idea'
app.route('/my-idea', myIdea)
```

### 加一个新 API

1. 在 `src/routes/` 新建 Hono 子路由
2. 在 `src/index.tsx` 用 `app.route('/api/xxx', xxx)` 挂载
3. 若需新表：在 `migrations/` 加 SQL，执行 `npm run db:migrate:local`

### KV vs D1 怎么选

| 场景 | 推荐 |
|------|------|
| 配置、缓存、简单 JSON | KV |
| 列表、筛选、关系数据 | D1 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 构建到 `dist/` |
| `npm run preview` | 用 wrangler 预览构建产物 |
| `npm run deploy` | 部署到 Cloudflare Pages |
| `npm run db:migrate:local` | 本地 D1 迁移 |
| `npm run db:migrate:remote` | 线上 D1 迁移 |
| `npm run cf-typegen` | 生成 Cloudflare 绑定类型 |

## 本地 D1 调试

```bash
npx wrangler d1 execute cf-page-db --local --command "SELECT * FROM notes"
```
