export type SteleData = {
  /** URL 段（拼音），如 tan-yi-dian → /stele/tan-yi-dian */
  slug: string
  /** 显示用姓名 */
  name: string
  title: string
  header: string
  coupletRight: string
  coupletLeft: string
  main: string
  /** 主碑右侧碑文（一整段，竖排满列后自动折） */
  rightText: string
  /** 主碑左侧碑文（一整段，竖排满列后自动折） */
  leftText: string
}
