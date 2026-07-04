import { HeroScatter, PageBack, SiteFooter, SiteNav } from '../components/site-shell'

const WORKFLOW_NODES = [
  { side: 'left', title: '需求分析', desc: '理解目标与约束', icon: 'search', color: '#64c6ff' },
  { side: 'left', title: '任务拆解', desc: '自动拆解与规划', icon: 'tree', color: '#ffcd6c' },
  { side: 'left', title: '编码实现', desc: '生成代码与测试', icon: 'code', color: '#00c978' },
  { side: 'right', title: '测试验证', desc: '自动化测试与验证', icon: 'shield', color: '#00ca48' },
  { side: 'right', title: '部署运维', desc: '一键部署与监控', icon: 'cloud', color: '#9f4fff' },
  { side: 'right', title: '文档沉淀', desc: '生成文档与知识库', icon: 'doc', color: '#ff58ae' },
] as const

const VALUE_CARDS = [
  {
    title: '复杂需求处理效率更高',
    desc: '端到端自动化推进，交付更快更稳定',
    icon: '🚀',
  },
  {
    title: '减少人工切换与重复衔接',
    desc: '打通全流程环节，降低沟通与切换成本',
    icon: '🔗',
  },
  {
    title: '让 AI 从执行器走向协调者',
    desc: '全局理解与任务编排，更懂目标与优先级',
    icon: '🤖',
  },
  {
    title: '更适合团队化与长期任务',
    desc: '协同透明可追踪，沉淀复用资产',
    icon: '👥',
  },
  {
    title: 'AI 编程产品竞争进入流程时代',
    desc: '从功能比拼转向流程与生态的系统竞争',
    icon: '📈',
  },
] as const

function NodeIcon({ name }: { name: string }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 1.75,
    'stroke-linecap': 'round' as const,
    'stroke-linejoin': 'round' as const,
  }

  switch (name) {
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l4 4" />
        </svg>
      )
    case 'tree':
      return (
        <svg {...props}>
          <path d="M12 3v4M8 7h8M10 11h4M12 11v4M9 19h6M12 15v4" />
        </svg>
      )
    case 'code':
      return (
        <svg {...props}>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 6l-4 12" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...props}>
          <path d="M7 18h9a4 4 0 000-8 5 5 0 00-9.5-1.5A3.5 3.5 0 007 18z" />
          <path d="M12 14v5M10 17l2-2 2 2" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...props}>
          <path d="M8 4h8l4 4v12H8V4z" />
          <path d="M16 4v4h4M10 12h6M10 16h4" />
        </svg>
      )
    default:
      return null
  }
}

function WorkflowNode({
  title,
  desc,
  icon,
  color,
}: {
  title: string
  desc: string
  icon: string
  color: string
}) {
  return (
    <article class="codex-node">
      <div class="codex-node__icon" style={`background:${color}`}>
        <NodeIcon name={icon} />
      </div>
      <h3 class="codex-node__title">{title}</h3>
      <p class="codex-node__desc">{desc}</p>
    </article>
  )
}

export function CodexLanding() {
  const leftNodes = WORKFLOW_NODES.filter((n) => n.side === 'left')
  const rightNodes = WORKFLOW_NODES.filter((n) => n.side === 'right')

  return (
    <>
      <SiteNav current="/codex" />
      <section class="page-hero">
        <HeroScatter side="left" />
        <div class="page-hero__content">
          <div class="badge-row">
            <span class="badge-pill">效率升级</span>
            <span class="badge-pill">AI 协作</span>
            <span class="badge-pill">开发趋势</span>
          </div>
          <h1 class="page-hero__title display">不只是写代码</h1>
          <p class="page-hero__subtitle">
            动态工作流让 Codex 更像开发协作中枢，而不只是单点工具
          </p>
        </div>
        <HeroScatter side="right" />
      </section>

      <section class="codex-workflow-band">
        <div class="page-wrap">
          <p class="section-label">流程协同</p>
          <div class="workflow-diagram">
            <svg class="workflow-lines" viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g stroke="#e5d5c3" stroke-width="1.5" fill="none">
                <path d="M600 180 L280 100" />
                <path d="M600 180 L280 240" />
                <path d="M600 180 L280 380" />
                <path d="M600 180 L920 100" />
                <path d="M600 180 L920 240" />
                <path d="M600 180 L920 380" />
              </g>
            </svg>

            <div class="workflow-col workflow-col--left">
              {leftNodes.map((node) => (
                <WorkflowNode key={node.title} {...node} />
              ))}
            </div>

            <div class="codex-hub">
              <div class="codex-hub__icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none" stroke="#343433" stroke-width="1.5">
                  <rect x="16" y="16" width="32" height="32" rx="8" fill="#64c6ff" stroke="#343433" />
                  <path d="M32 24v16M24 32h16" stroke="#343433" stroke-width="2" />
                </svg>
              </div>
              <p class="codex-hub__label">效率提升 流程协同</p>
            </div>

            <div class="workflow-col workflow-col--right">
              {rightNodes.map((node) => (
                <WorkflowNode key={node.title} {...node} />
              ))}
            </div>
          </div>

          <div class="codex-dark-preview">
            <div class="dark-card">
              <h3 class="dark-card__title">开发协作中枢</h3>
              <div class="action-row">
                <span class="action-row__icon action-row__icon--blue" />
                <div>
                  <div class="action-row__label">需求分析</div>
                  <div class="action-row__hint">理解目标与约束</div>
                </div>
              </div>
              <div class="action-row">
                <span class="action-row__icon action-row__icon--violet" />
                <div>
                  <div class="action-row__label">任务编排</div>
                  <div class="action-row__hint">自动拆解与规划</div>
                </div>
              </div>
              <div class="action-row">
                <span class="action-row__icon action-row__icon--green" />
                <div>
                  <div class="action-row__label">编码实现</div>
                  <div class="action-row__hint">生成代码与测试</div>
                </div>
              </div>
              <div class="action-row">
                <span class="action-row__icon action-row__icon--pink" />
                <div>
                  <div class="action-row__label">部署运维</div>
                  <div class="action-row__hint">一键部署与监控</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="page-wrap page-section">
        <p class="section-label">价值主张</p>
        <ul class="card-grid card-grid--3">
          {VALUE_CARDS.map((card) => (
            <li key={card.title}>
              <article class="feature-card" style="cursor:default;">
                <span class="feature-card__icon">{card.icon}</span>
                <h2 class="feature-card__title">{card.title}</h2>
                <p class="feature-card__desc">{card.desc}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter>
        <p>
          从工具到平台，从单点到协同，让开发更高效，让团队更敏捷，让创新持续发生
        </p>
        <p style="margin-top: 12px;">
          <PageBack /> · <a href="/lab">实验室</a>
        </p>
      </SiteFooter>
    </>
  )
}
