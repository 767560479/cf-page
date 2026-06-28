import { Hono } from 'hono'

type Bindings = {
  KV: KVNamespace
}

const kv = new Hono<{ Bindings: Bindings }>()

kv.get('/:key', async (c) => {
  const key = c.req.param('key')
  const value = await c.env.KV.get(key)
  if (value === null) {
    return c.json({ key, value: null }, 404)
  }
  return c.json({ key, value })
})

kv.put('/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.json<{ value?: string }>()
  if (body.value === undefined) {
    return c.json({ error: 'value is required' }, 400)
  }
  await c.env.KV.put(key, body.value)
  return c.json({ key, value: body.value })
})

kv.delete('/:key', async (c) => {
  const key = c.req.param('key')
  await c.env.KV.delete(key)
  return c.json({ key, deleted: true })
})

export default kv
