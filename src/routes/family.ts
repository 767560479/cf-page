import { Hono } from 'hono'
import {
  buildTreeGraph,
  createPerson,
  deletePerson,
  getDefaultFocusId,
  getPerson,
  listPersons,
  removeParentLink,
  removeSpouseLink,
  updatePerson,
  upsertParentLink,
  upsertSpouseLink,
  type CreatePersonInput,
  type ParentRole,
  type UpdatePersonInput,
} from '../lib/family'

type Bindings = {
  DB: D1Database
}

const family = new Hono<{ Bindings: Bindings }>()

family.get('/persons', async (c) => {
  const persons = await listPersons(c.env.DB)
  return c.json({ persons })
})

family.get('/persons/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: '无效的成员 id' }, 400)
  }
  const person = await getPerson(c.env.DB, id)
  if (!person) return c.json({ error: '成员不存在' }, 404)
  return c.json({ person })
})

family.post('/persons', async (c) => {
  const body = await c.req.json<CreatePersonInput>()
  const result = await createPerson(c.env.DB, body)
  if ('error' in result) return c.json({ error: result.error }, 400)
  return c.json({ person: result.person }, 201)
})

family.patch('/persons/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: '无效的成员 id' }, 400)
  }
  const body = await c.req.json<UpdatePersonInput>()
  const result = await updatePerson(c.env.DB, id, body)
  if ('error' in result) return c.json({ error: result.error }, 400)
  return c.json({ person: result.person })
})

family.delete('/persons/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: '无效的成员 id' }, 400)
  }
  const result = await deletePerson(c.env.DB, id)
  if ('error' in result) return c.json({ error: result.error }, 404)
  return c.json(result)
})

family.put('/parents', async (c) => {
  const body = await c.req.json<{ child_id?: number; parent_id?: number; role?: ParentRole }>()
  const childId = Number(body.child_id)
  const parentId = Number(body.parent_id)
  const role = body.role
  if (!Number.isInteger(childId) || !Number.isInteger(parentId) || !role) {
    return c.json({ error: 'child_id、parent_id、role 均为必填' }, 400)
  }
  if (role !== 'father' && role !== 'mother') {
    return c.json({ error: 'role 必须为 father 或 mother' }, 400)
  }
  const result = await upsertParentLink(c.env.DB, childId, parentId, role)
  if ('error' in result) return c.json({ error: result.error }, 400)
  return c.json({ ok: true })
})

family.delete('/parents', async (c) => {
  const body = await c.req.json<{ child_id?: number; role?: ParentRole }>()
  const childId = Number(body.child_id)
  const role = body.role
  if (!Number.isInteger(childId) || !role) {
    return c.json({ error: 'child_id 与 role 均为必填' }, 400)
  }
  const removed = await removeParentLink(c.env.DB, childId, role)
  if (!removed) return c.json({ error: '父母关系不存在' }, 404)
  return c.json({ ok: true })
})

family.put('/spouses', async (c) => {
  const body = await c.req.json<{ person_a_id?: number; person_b_id?: number }>()
  const personA = Number(body.person_a_id)
  const personB = Number(body.person_b_id)
  if (!Number.isInteger(personA) || !Number.isInteger(personB)) {
    return c.json({ error: 'person_a_id 与 person_b_id 均为必填' }, 400)
  }
  const result = await upsertSpouseLink(c.env.DB, personA, personB)
  if ('error' in result) return c.json({ error: result.error }, 400)
  return c.json({ ok: true })
})

family.delete('/spouses', async (c) => {
  const body = await c.req.json<{ person_a_id?: number; person_b_id?: number }>()
  const personA = Number(body.person_a_id)
  const personB = Number(body.person_b_id)
  if (!Number.isInteger(personA) || !Number.isInteger(personB)) {
    return c.json({ error: 'person_a_id 与 person_b_id 均为必填' }, 400)
  }
  const removed = await removeSpouseLink(c.env.DB, personA, personB)
  if (!removed) return c.json({ error: '配偶关系不存在' }, 404)
  return c.json({ ok: true })
})

family.get('/tree', async (c) => {
  let focusId = Number(c.req.query('focus'))
  const up = Math.min(Math.max(Number(c.req.query('up') ?? 3), 0), 10)
  const down = Math.min(Math.max(Number(c.req.query('down') ?? 3), 0), 10)

  if (!Number.isInteger(focusId) || focusId <= 0) {
    const defaultId = await getDefaultFocusId(c.env.DB)
    if (!defaultId) return c.json({ focus_id: null, nodes: [], edges: [] })
    focusId = defaultId
  }

  const result = await buildTreeGraph(c.env.DB, focusId, up, down)
  if ('error' in result) return c.json({ error: result.error }, 400)
  return c.json(result)
})

export default family
