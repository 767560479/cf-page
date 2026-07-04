async function readJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function showResult(el, data) {
  el.textContent = JSON.stringify(data, null, 2)
}

const kvForm = document.getElementById('kv-form')
const kvResult = document.getElementById('kv-result')
const kvRead = document.getElementById('kv-read')
const kvDelete = document.getElementById('kv-delete')

function getKvKey() {
  return kvForm.key.value.trim()
}

kvForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const key = getKvKey()
  const value = kvForm.value.value
  const res = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  showResult(kvResult, await readJson(res))
})

kvRead.addEventListener('click', async () => {
  const key = getKvKey()
  if (!key) return
  const res = await fetch(`/api/kv/${encodeURIComponent(key)}`)
  showResult(kvResult, await readJson(res))
})

kvDelete.addEventListener('click', async () => {
  const key = getKvKey()
  if (!key) return
  const res = await fetch(`/api/kv/${encodeURIComponent(key)}`, { method: 'DELETE' })
  showResult(kvResult, await readJson(res))
})

const noteForm = document.getElementById('note-form')
const notesList = document.getElementById('notes-list')

async function loadNotes() {
  const res = await fetch('/api/notes')
  const data = await readJson(res)
  notesList.innerHTML = ''
  for (const note of data.notes ?? []) {
    const li = document.createElement('li')
    li.className = 'note-item'
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(note.title)}</strong>
        ${note.content ? `<p>${escapeHtml(note.content)}</p>` : ''}
        <small>#${note.id} · ${note.created_at}</small>
      </div>
      <button type="button" data-id="${note.id}" class="btn-pill btn-pill--danger">删除</button>
    `
    li.querySelector('button').addEventListener('click', async () => {
      await fetch(`/api/notes/${note.id}`, { method: 'DELETE' })
      await loadNotes()
    })
    notesList.appendChild(li)
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = noteForm.title.value.trim()
  const content = noteForm.content.value.trim()
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content: content || undefined }),
  })
  noteForm.reset()
  await loadNotes()
})

loadNotes()
