export type LocalApp = {
  path: string
  title: string
  description: string
  tags?: string[]
  icon?: string
}

export type ExternalSite = {
  href: string
  title: string
  description: string
  icon?: string
}

export const localApps: LocalApp[] = [
  {
    path: '/family-tree',
    title: '家族树',
    description: '成员增删改查，可缩放家谱图',
    tags: ['D1'],
    icon: '🌳',
  },
  {
    path: '/lab',
    title: '实验室',
    description: 'KV / D1 读写与 Notes 示例',
    tags: ['KV', 'D1'],
    icon: '🧪',
  },
]

export const externalSites: ExternalSite[] = [
  {
    href: 'https://tzf.us.ci/',
    title: '记录 bug blog',
    description: '前端、Vue3、源码笔记与技术文章',
    icon: '📝',
  },
  {
    href: 'https://gxtzf.ccwu.cc/',
    title: 'Telegraph 图床',
    description: '免费图床，拖拽上传，一键复制直链',
    icon: '🖼️',
  },
]
