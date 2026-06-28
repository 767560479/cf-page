export type Note = {
  id: number
  title: string
  content: string | null
  created_at: string
}

export async function listNotes(db: D1Database): Promise<Note[]> {
  const { results } = await db
    .prepare('SELECT id, title, content, created_at FROM notes ORDER BY id DESC')
    .all<Note>()
  return results ?? []
}

export async function createNote(
  db: D1Database,
  title: string,
  content: string | null
): Promise<Note | null> {
  const result = await db
    .prepare('INSERT INTO notes (title, content) VALUES (?, ?) RETURNING id, title, content, created_at')
    .bind(title, content)
    .first<Note>()
  return result
}

export async function deleteNote(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare('DELETE FROM notes WHERE id = ?').bind(id).run()
  return (result.meta.changes ?? 0) > 0
}
