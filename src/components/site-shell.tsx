import type { Child } from 'hono/jsx'

const NAV_LINKS = [
  { href: '/family-tree', label: '家族树' },
  { href: '/lab', label: '实验室' },
  { href: '/codex', label: 'Codex' },
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
        <a class="btn-pill btn-pill--dark site-nav__cta" href="/">
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

export function HeroScatter({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right' ? 'hero-scatter--right' : 'hero-scatter--left'
  return (
    <div class={`hero-scatter ${flip}`} aria-hidden="true">
      <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="48" r="28" fill="#64c6ff" stroke="#343433" stroke-width="1.5" />
        <circle cx="38" cy="44" r="3" fill="#343433" />
        <circle cx="46" cy="44" r="3" fill="#343433" />
        <rect x="118" y="24" width="32" height="32" rx="8" fill="#ffcd6c" stroke="#343433" stroke-width="1.5" transform="rotate(12 134 40)" />
        <path d="M24 120 Q48 96 72 120 T120 112" stroke="#343433" stroke-width="1.5" fill="none" />
        <circle cx="88" cy="160" r="22" fill="#00c978" stroke="#343433" stroke-width="1.5" />
        <path d="M130 88 l8 8 m0-8 l-8 8" stroke="#ff3e00" stroke-width="2" stroke-linecap="round" />
        <circle cx="56" cy="168" r="6" fill="#ff58ae" stroke="#343433" stroke-width="1" />
        <rect x="100" y="140" width="14" height="14" rx="3" fill="#9f4fff" stroke="#343433" stroke-width="1" />
      </svg>
    </div>
  )
}

export function PageBack({ href = '/', label = '← 返回首页' }: { href?: string; label?: string }) {
  return (
    <a class="link-inline" href={href}>
      {label}
    </a>
  )
}
