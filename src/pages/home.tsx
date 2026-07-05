import { externalSites, localApps } from '../data/site-links'
import { SiteFooter, SiteNav } from '../components/site-shell'

const TAG_VARIANTS = ['tag-pill--teal', 'tag-pill--violet', 'tag-pill--green'] as const

function TagList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null
  return (
    <>
      {tags.map((tag, i) => (
        <span class={`tag-pill ${TAG_VARIANTS[i % TAG_VARIANTS.length]}`} key={tag}>
          {tag}
        </span>
      ))}
    </>
  )
}

export function HomePage() {
  return (
    <>
      <SiteNav />
      <div class="page-wrap">
        <section class="page-hero">
          <div class="page-hero__content">
            <h1 class="page-hero__title display">cf-page</h1>
            <p class="page-hero__subtitle">
              小工具与实验页面集合 — 部署在 Cloudflare Pages 上的功能入口。
            </p>
            <a class="page-hero__link" href="/lab">
              进入实验室 →
            </a>
          </div>
        </section>

        <section class="page-section">
          <p class="section-label">本站功能</p>
          <ul class="card-grid">
            {localApps.map((app) => (
              <li key={app.path}>
                <a class="feature-card" href={app.path}>
                  <span class="feature-card__icon" aria-hidden="true">
                    {app.icon ?? '◆'}
                  </span>
                  <div class="feature-card__head">
                    <h2 class="feature-card__title">{app.title}</h2>
                    <TagList tags={app.tags} />
                  </div>
                  <p class="feature-card__desc">{app.description}</p>
                  <span class="feature-card__link">进入 →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section class="page-section">
          <p class="section-label">我的站点</p>
          <ul class="card-grid">
            {externalSites.map((site) => (
              <li key={site.href}>
                <a
                  class="feature-card"
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="feature-card__badge">外链</span>
                  <span class="feature-card__icon" aria-hidden="true">
                    {site.icon ?? '↗'}
                  </span>
                  <h2 class="feature-card__title">{site.title}</h2>
                  <p class="feature-card__desc">{site.description}</p>
                  <span class="feature-card__link">访问 →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SiteFooter />
    </>
  )
}
