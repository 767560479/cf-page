export type Gender = 'male' | 'female' | 'unknown'
export type ParentRole = 'father' | 'mother'

export type Person = {
  id: number
  name: string
  gender: Gender
  birth_date: string | null
  death_date: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type PersonDetail = Person & {
  father_id: number | null
  mother_id: number | null
  spouse_ids: number[]
  child_ids: number[]
}

export type PersonSummary = Person & {
  father_id: number | null
  mother_id: number | null
  spouse_ids: number[]
}

export type TreeEdge = {
  from: number
  to: number
  type: 'parent' | 'spouse'
  role?: ParentRole
}

export type TreeGraph = {
  focus_id: number
  nodes: Person[]
  edges: TreeEdge[]
}

export type CreatePersonInput = {
  name: string
  gender?: Gender
  birth_date?: string | null
  death_date?: string | null
  avatar_url?: string | null
  bio?: string | null
  father_id?: number | null
  mother_id?: number | null
  spouse_id?: number | null
}

export type UpdatePersonInput = {
  name?: string
  gender?: Gender
  birth_date?: string | null
  death_date?: string | null
  avatar_url?: string | null
  bio?: string | null
}

function normalizeSpousePair(a: number, b: number): [number, number] {
  return a < b ? [a, b] : [b, a]
}

async function getParentLinks(db: D1Database) {
  const { results } = await db
    .prepare('SELECT child_id, parent_id, role FROM parent_links')
    .all<{ child_id: number; parent_id: number; role: ParentRole }>()
  return results ?? []
}

async function getSpouseLinks(db: D1Database) {
  const { results } = await db
    .prepare('SELECT person_a_id, person_b_id FROM spouse_links')
    .all<{ person_a_id: number; person_b_id: number }>()
  return results ?? []
}

function buildRelationMaps(
  parentLinks: { child_id: number; parent_id: number; role: ParentRole }[],
  spouseLinks: { person_a_id: number; person_b_id: number }[]
) {
  const parentsByChild = new Map<number, { father_id: number | null; mother_id: number | null }>()
  const childrenByParent = new Map<number, number[]>()
  const spousesByPerson = new Map<number, number[]>()

  for (const link of parentLinks) {
    const entry = parentsByChild.get(link.child_id) ?? { father_id: null, mother_id: null }
    if (link.role === 'father') entry.father_id = link.parent_id
    if (link.role === 'mother') entry.mother_id = link.parent_id
    parentsByChild.set(link.child_id, entry)

    const children = childrenByParent.get(link.parent_id) ?? []
    children.push(link.child_id)
    childrenByParent.set(link.parent_id, children)
  }

  for (const link of spouseLinks) {
    const aSpouses = spousesByPerson.get(link.person_a_id) ?? []
    aSpouses.push(link.person_b_id)
    spousesByPerson.set(link.person_a_id, aSpouses)

    const bSpouses = spousesByPerson.get(link.person_b_id) ?? []
    bSpouses.push(link.person_a_id)
    spousesByPerson.set(link.person_b_id, bSpouses)
  }

  return { parentsByChild, childrenByParent, spousesByPerson }
}

export async function listPersons(db: D1Database): Promise<PersonSummary[]> {
  const persons = await db
    .prepare(
      'SELECT id, name, gender, birth_date, death_date, avatar_url, bio, created_at, updated_at FROM persons ORDER BY id'
    )
    .all<Person>()
  const parentLinks = await getParentLinks(db)
  const spouseLinks = await getSpouseLinks(db)
  const { parentsByChild, spousesByPerson } = buildRelationMaps(parentLinks, spouseLinks)

  return (persons.results ?? []).map((p) => {
    const parents = parentsByChild.get(p.id) ?? { father_id: null, mother_id: null }
    return {
      ...p,
      father_id: parents.father_id,
      mother_id: parents.mother_id,
      spouse_ids: spousesByPerson.get(p.id) ?? [],
    }
  })
}

export async function getPerson(db: D1Database, id: number): Promise<PersonDetail | null> {
  const person = await db
    .prepare(
      'SELECT id, name, gender, birth_date, death_date, avatar_url, bio, created_at, updated_at FROM persons WHERE id = ?'
    )
    .bind(id)
    .first<Person>()
  if (!person) return null

  const parentLinks = await getParentLinks(db)
  const spouseLinks = await getSpouseLinks(db)
  const { parentsByChild, childrenByParent, spousesByPerson } = buildRelationMaps(
    parentLinks,
    spouseLinks
  )

  const parents = parentsByChild.get(id) ?? { father_id: null, mother_id: null }
  const childSet = new Set<number>()
  for (const childId of childrenByParent.get(id) ?? []) {
    childSet.add(childId)
  }

  return {
    ...person,
    father_id: parents.father_id,
    mother_id: parents.mother_id,
    spouse_ids: spousesByPerson.get(id) ?? [],
    child_ids: [...childSet],
  }
}

export async function wouldCreateParentCycle(
  db: D1Database,
  childId: number,
  parentId: number
): Promise<boolean> {
  if (childId === parentId) return true

  const parentLinks = await getParentLinks(db)
  const { parentsByChild } = buildRelationMaps(parentLinks, [])

  const visited = new Set<number>()
  const stack = [childId]

  while (stack.length > 0) {
    const current = stack.pop()!
    if (current === parentId) return true
    if (visited.has(current)) continue
    visited.add(current)

    const parents = parentsByChild.get(current)
    if (parents?.father_id) stack.push(parents.father_id)
    if (parents?.mother_id) stack.push(parents.mother_id)
  }

  return false
}

async function setParentLink(
  db: D1Database,
  childId: number,
  parentId: number,
  role: ParentRole
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (childId === parentId) {
    return { ok: false, error: '不能将自己设为父母' }
  }

  const child = await db.prepare('SELECT id FROM persons WHERE id = ?').bind(childId).first()
  const parent = await db.prepare('SELECT id, gender FROM persons WHERE id = ?').bind(parentId).first<{
    id: number
    gender: Gender
  }>()
  if (!child || !parent) {
    return { ok: false, error: '成员不存在' }
  }

  if (role === 'father' && parent.gender === 'female') {
    return { ok: false, error: '父亲角色需对应男性成员' }
  }
  if (role === 'mother' && parent.gender === 'male') {
    return { ok: false, error: '母亲角色需对应女性成员' }
  }

  const cycle = await wouldCreateParentCycle(db, childId, parentId)
  if (cycle) {
    return { ok: false, error: '该关系会导致循环血缘，无法设置' }
  }

  await db
    .prepare(
      `INSERT INTO parent_links (child_id, parent_id, role) VALUES (?, ?, ?)
       ON CONFLICT(child_id, role) DO UPDATE SET parent_id = excluded.parent_id`
    )
    .bind(childId, parentId, role)
    .run()

  return { ok: true }
}

async function setSpouseLink(
  db: D1Database,
  personA: number,
  personB: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (personA === personB) {
    return { ok: false, error: '不能与自己结为配偶' }
  }

  const a = await db.prepare('SELECT id FROM persons WHERE id = ?').bind(personA).first()
  const b = await db.prepare('SELECT id FROM persons WHERE id = ?').bind(personB).first()
  if (!a || !b) {
    return { ok: false, error: '成员不存在' }
  }

  const [pa, pb] = normalizeSpousePair(personA, personB)
  await db
    .prepare(
      `INSERT INTO spouse_links (person_a_id, person_b_id) VALUES (?, ?)
       ON CONFLICT(person_a_id, person_b_id) DO NOTHING`
    )
    .bind(pa, pb)
    .run()

  return { ok: true }
}

export async function createPerson(
  db: D1Database,
  input: CreatePersonInput
): Promise<{ person: PersonDetail } | { error: string }> {
  const name = input.name.trim()
  if (!name) return { error: '姓名不能为空' }

  const gender = input.gender ?? 'unknown'
  const result = await db
    .prepare(
      `INSERT INTO persons (name, gender, birth_date, death_date, avatar_url, bio)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING id, name, gender, birth_date, death_date, avatar_url, bio, created_at, updated_at`
    )
    .bind(
      name,
      gender,
      input.birth_date?.trim() || null,
      input.death_date?.trim() || null,
      input.avatar_url?.trim() || null,
      input.bio?.trim() || null
    )
    .first<Person>()

  if (!result) return { error: '创建成员失败' }

  if (input.father_id) {
    const r = await setParentLink(db, result.id, input.father_id, 'father')
    if (!r.ok) {
      await db.prepare('DELETE FROM persons WHERE id = ?').bind(result.id).run()
      return { error: r.error }
    }
  }
  if (input.mother_id) {
    const r = await setParentLink(db, result.id, input.mother_id, 'mother')
    if (!r.ok) {
      await db.prepare('DELETE FROM persons WHERE id = ?').bind(result.id).run()
      return { error: r.error }
    }
  }
  if (input.spouse_id) {
    const r = await setSpouseLink(db, result.id, input.spouse_id)
    if (!r.ok) {
      await db.prepare('DELETE FROM persons WHERE id = ?').bind(result.id).run()
      return { error: r.error }
    }
  }

  const person = await getPerson(db, result.id)
  if (!person) return { error: '创建成员失败' }
  return { person }
}

export async function updatePerson(
  db: D1Database,
  id: number,
  input: UpdatePersonInput
): Promise<{ person: PersonDetail } | { error: string }> {
  const existing = await getPerson(db, id)
  if (!existing) return { error: '成员不存在' }

  const name = input.name !== undefined ? input.name.trim() : existing.name
  if (!name) return { error: '姓名不能为空' }

  const gender = input.gender ?? existing.gender
  const birth_date =
    input.birth_date !== undefined ? input.birth_date?.trim() || null : existing.birth_date
  const death_date =
    input.death_date !== undefined ? input.death_date?.trim() || null : existing.death_date
  const avatar_url =
    input.avatar_url !== undefined ? input.avatar_url?.trim() || null : existing.avatar_url
  const bio = input.bio !== undefined ? input.bio?.trim() || null : existing.bio

  await db
    .prepare(
      `UPDATE persons SET name = ?, gender = ?, birth_date = ?, death_date = ?, avatar_url = ?, bio = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(name, gender, birth_date, death_date, avatar_url, bio, id)
    .run()

  const person = await getPerson(db, id)
  if (!person) return { error: '更新失败' }
  return { person }
}

export async function deletePerson(
  db: D1Database,
  id: number
): Promise<{ deleted: true; id: number } | { error: string }> {
  const existing = await getPerson(db, id)
  if (!existing) return { error: '成员不存在' }

  const result = await db.prepare('DELETE FROM persons WHERE id = ?').bind(id).run()
  if ((result.meta.changes ?? 0) === 0) return { error: '删除失败' }
  return { deleted: true, id }
}

export async function upsertParentLink(
  db: D1Database,
  childId: number,
  parentId: number,
  role: ParentRole
): Promise<{ ok: true } | { error: string }> {
  const result = await setParentLink(db, childId, parentId, role)
  if (!result.ok) return { error: result.error }
  return { ok: true }
}

export async function removeParentLink(
  db: D1Database,
  childId: number,
  role: ParentRole
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM parent_links WHERE child_id = ? AND role = ?')
    .bind(childId, role)
    .run()
  return (result.meta.changes ?? 0) > 0
}

export async function upsertSpouseLink(
  db: D1Database,
  personA: number,
  personB: number
): Promise<{ ok: true } | { error: string }> {
  const result = await setSpouseLink(db, personA, personB)
  if (!result.ok) return { error: result.error }
  return { ok: true }
}

export async function removeSpouseLink(
  db: D1Database,
  personA: number,
  personB: number
): Promise<boolean> {
  const [pa, pb] = normalizeSpousePair(personA, personB)
  const result = await db
    .prepare('DELETE FROM spouse_links WHERE person_a_id = ? AND person_b_id = ?')
    .bind(pa, pb)
    .run()
  return (result.meta.changes ?? 0) > 0
}

export async function buildTreeGraph(
  db: D1Database,
  focusId: number,
  up: number,
  down: number
): Promise<TreeGraph | { error: string }> {
  const focus = await getPerson(db, focusId)
  if (!focus) return { error: '焦点成员不存在' }

  const allPersons = await db
    .prepare(
      'SELECT id, name, gender, birth_date, death_date, avatar_url, bio, created_at, updated_at FROM persons'
    )
    .all<Person>()
  const personMap = new Map((allPersons.results ?? []).map((p) => [p.id, p]))

  const parentLinks = await getParentLinks(db)
  const spouseLinks = await getSpouseLinks(db)
  const { parentsByChild, childrenByParent, spousesByPerson } = buildRelationMaps(
    parentLinks,
    spouseLinks
  )

  const included = new Set<number>()
  const edges: TreeEdge[] = []
  const edgeKeys = new Set<string>()

  function addEdge(edge: TreeEdge) {
    const key =
      edge.type === 'spouse'
        ? `s:${Math.min(edge.from, edge.to)}:${Math.max(edge.from, edge.to)}`
        : `p:${edge.from}:${edge.to}:${edge.role}`
    if (edgeKeys.has(key)) return
    edgeKeys.add(key)
    edges.push(edge)
  }

  function includePerson(id: number) {
    if (personMap.has(id)) included.add(id)
  }

  function includeSpouses(id: number) {
    for (const spouseId of spousesByPerson.get(id) ?? []) {
      includePerson(spouseId)
      addEdge({ from: id, to: spouseId, type: 'spouse' })
    }
  }

  function includeParents(id: number) {
    const parents = parentsByChild.get(id)
    if (parents?.father_id) {
      includePerson(parents.father_id)
      addEdge({ from: parents.father_id, to: id, type: 'parent', role: 'father' })
    }
    if (parents?.mother_id) {
      includePerson(parents.mother_id)
      addEdge({ from: parents.mother_id, to: id, type: 'parent', role: 'mother' })
    }
  }

  includePerson(focusId)
  includeSpouses(focusId)

  let upFrontier = [focusId]
  for (let gen = 0; gen < up; gen++) {
    const next: number[] = []
    for (const id of upFrontier) {
      const parents = parentsByChild.get(id)
      for (const parentId of [parents?.father_id, parents?.mother_id]) {
        if (!parentId) continue
        includePerson(parentId)
        includeSpouses(parentId)
        addEdge({
          from: parentId,
          to: id,
          type: 'parent',
          role: parents?.father_id === parentId ? 'father' : 'mother',
        })
        next.push(parentId)
      }
    }
    upFrontier = next
  }

  let downFrontier = [focusId]
  for (let gen = 0; gen < down; gen++) {
    const next: number[] = []
    for (const id of downFrontier) {
      for (const childId of childrenByParent.get(id) ?? []) {
        includePerson(childId)
        includeSpouses(childId)
        const parents = parentsByChild.get(childId)
        const role: ParentRole = parents?.father_id === id ? 'father' : 'mother'
        addEdge({ from: id, to: childId, type: 'parent', role })
        next.push(childId)
      }
    }
    downFrontier = next
  }

  for (const id of included) {
    includeSpouses(id)
    const parents = parentsByChild.get(id)
    if (parents?.father_id && included.has(parents.father_id)) {
      addEdge({ from: parents.father_id, to: id, type: 'parent', role: 'father' })
    }
    if (parents?.mother_id && included.has(parents.mother_id)) {
      addEdge({ from: parents.mother_id, to: id, type: 'parent', role: 'mother' })
    }
  }

  const nodes = [...included]
    .map((id) => personMap.get(id))
    .filter((p): p is Person => p !== undefined)

  return { focus_id: focusId, nodes, edges }
}

export async function getDefaultFocusId(db: D1Database): Promise<number | null> {
  const row = await db.prepare('SELECT id FROM persons ORDER BY id LIMIT 1').first<{ id: number }>()
  return row?.id ?? null
}
