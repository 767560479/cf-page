import type { Child } from 'hono/jsx'

const NAV_LINKS = [
  { href: '/family-tree', label: '家族树' },
  { href: '/lab', label: '实验室' },
]

export function SiteNav({ current }: { current?: string }) {
  return (
    <header class="site-nav">
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="/">
          cf-page
        </a>
        <nav class="site-nav__links" aria-label="主导航">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class={current === link.href ? 'is-active' : undefined}
              aria-current={current === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a class="btn btn-signup site-nav__cta" href="/">
          全部功能
        </a>
      </div>
    </header>
  )
}

export function SiteFooter({ children }: { children?: Child }) {
  return (
    <footer class="site-footer">
      {children ?? <p>部署于 Cloudflare Pages</p>}
    </footer>
  )
}

export function PageBack({ href = '/', label = '← 返回首页' }: { href?: string; label?: string }) {
  return (
    <a class="link-inline" href={href}>
      {label}
    </a>
  )
}
