import { Hono } from 'hono'
import { createNote, deleteNote, listNotes } from '../lib/db'

type Bindings = {
  DB: D1Database
}

const notes = new Hono<{ Bindings: Bindings }>()

notes.get('/', async (c) => {
  const items = await listNotes(c.env.DB)
  return c.json({ notes: items })
})

notes.post('/', async (c) => {
  const body = await c.req.json<{ title?: string; content?: string }>()
  const title = body.title?.trim()
  if (!title) {
    return c.json({ error: 'title is required' }, 400)
  }
  const content = body.content?.trim() || null
  const note = await createNote(c.env.DB, title, content)
  if (!note) {
    return c.json({ error: 'failed to create note' }, 500)
  }
  return c.json({ note }, 201)
})

notes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'invalid id' }, 400)
  }
  const deleted = await deleteNote(c.env.DB, id)
  if (!deleted) {
    return c.json({ error: 'note not found' }, 404)
  }
  return c.json({ id, deleted: true })
})

export default notes
