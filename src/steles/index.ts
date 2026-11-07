import type { SteleData } from './types'
import tanYiDian from './tan-yi-dian'

/** 新增墓碑：新建拼音文件，import 后放入列表即可 */
const steles: SteleData[] = [tanYiDian]

const bySlug = new Map(steles.map((s) => [s.slug, s]))

export type { SteleData } from './types'

export function getStele(slug: string): SteleData | undefined {
  return bySlug.get(slug)
}

export function listSteles(): SteleData[] {
  return steles
}
