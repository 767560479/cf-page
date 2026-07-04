import * as d3 from 'd3'
import dagre from '@dagrejs/dagre'

const NODE_W = 136
const NODE_H = 72
const API = '/api/family'

const state = {
  persons: [],
  focusId: null,
  selectedId: null,
  highlightId: null,
  graph: null,
  zoomTransform: d3.zoomIdentity,
  zoomScale: 1,
}

const MOBILE_MQ = window.matchMedia('(max-width: 900px)')

const el = {
  svg: document.getElementById('ft-svg'),
  empty: document.getElementById('ft-empty'),
  focusSelect: document.getElementById('ft-focus-select'),
  focusBadge: document.getElementById('ft-focus-badge'),
  genUp: document.getElementById('ft-gen-up'),
  genDown: document.getElementById('ft-gen-down'),
  search: document.getElementById('ft-search'),
  zoomLabel: document.getElementById('ft-zoom-label'),
  panel: document.getElementById('ft-panel'),
  panelBackdrop: document.getElementById('ft-panel-backdrop'),
  panelClose: document.getElementById('ft-panel-close'),
  panelEmpty: document.getElementById('ft-panel-empty'),
  detailForm: document.getElementById('ft-detail-form'),
  personId: document.getElementById('ft-person-id'),
  name: document.getElementById('ft-name'),
  gender: document.getElementById('ft-gender'),
  birth: document.getElementById('ft-birth'),
  death: document.getElementById('ft-death'),
  avatar: document.getElementById('ft-avatar'),
  bio: document.getElementById('ft-bio'),
  father: document.getElementById('ft-father'),
  mother: document.getElementById('ft-mother'),
  spouse: document.getElementById('ft-spouse'),
  panelMsg: document.getElementById('ft-panel-msg'),
  addDialog: document.getElementById('ft-add-dialog'),
  addForm: document.getElementById('ft-add-form'),
  addName: document.getElementById('ft-add-name'),
  addGender: document.getElementById('ft-add-gender'),
  addBirth: document.getElementById('ft-add-birth'),
  addRelationType: document.getElementById('ft-add-relation-type'),
  addRelatedWrap: document.getElementById('ft-add-related-wrap'),
  addRelated: document.getElementById('ft-add-related'),
  addMsg: document.getElementById('ft-add-msg'),
}

let gRoot
let gZoom
let zoomBehavior
let touchStart = null

function isMobile() {
  return MOBILE_MQ.matches
}

function updateFocusBadge() {
  if (!el.focusBadge) return
  const p = state.persons.find((x) => x.id === state.focusId)
  el.focusBadge.textContent = p ? `焦点：${p.name}` : '焦点：—'
}

function openPanel() {
  if (!isMobile() || !el.panel) return
  el.panel.classList.add('ft-panel--open')
  if (el.panelBackdrop) {
    el.panelBackdrop.hidden = false
    el.panelBackdrop.setAttribute('aria-hidden', 'false')
  }
}

function closePanel() {
  if (!el.panel) return
  el.panel.classList.remove('ft-panel--open')
  if (el.panelBackdrop) {
    el.panelBackdrop.hidden = true
    el.panelBackdrop.setAttribute('aria-hidden', 'true')
  }
}

async function api(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `请求失败 (${res.status})`)
  return data
}

function setMsg(node, text, type = '') {
  node.textContent = text
  node.className = `form-msg${type ? ` form-msg--${type}` : ''}`
}

function personLabel(p) {
  return `${p.name}${p.birth_date ? ` (${p.birth_date})` : ''}`
}

function fillPersonSelect(select, persons, selectedId, excludeId, emptyLabel = '— 无 —') {
  select.innerHTML = `<option value="">${emptyLabel}</option>`
  for (const p of persons) {
    if (excludeId && p.id === excludeId) continue
    const opt = document.createElement('option')
    opt.value = String(p.id)
    opt.textContent = personLabel(p)
    if (p.id === selectedId) opt.selected = true
    select.appendChild(opt)
  }
}

async function loadPersons() {
  const data = await api('/persons')
  state.persons = data.persons ?? []
  return state.persons
}

function refreshFocusSelect() {
  const prev = state.focusId
  el.focusSelect.innerHTML = ''
  for (const p of state.persons) {
    const opt = document.createElement('option')
    opt.value = String(p.id)
    opt.textContent = personLabel(p)
    el.focusSelect.appendChild(opt)
  }
  if (state.persons.length === 0) {
    state.focusId = null
    updateFocusBadge()
    return
  }
  if (prev && state.persons.some((p) => p.id === prev)) {
    state.focusId = prev
  } else {
    state.focusId = state.persons[0].id
  }
  el.focusSelect.value = String(state.focusId)
  updateFocusBadge()
}

async function loadTree() {
  if (!state.focusId) {
    state.graph = null
    el.empty.hidden = false
    renderGraph()
    return
  }
  el.empty.hidden = true
  const up = Number(el.genUp.value) || 3
  const down = Number(el.genDown.value) || 3
  state.graph = await api(`/tree?focus=${state.focusId}&up=${up}&down=${down}`)
  renderGraph()
  fitView()
}

function layoutGraph(graph) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', nodesep: 48, ranksep: 64, marginx: 40, marginy: 40 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const node of graph.nodes) {
    g.setNode(String(node.id), { width: NODE_W, height: NODE_H, person: node })
  }

  for (const edge of graph.edges) {
    if (edge.type === 'parent') {
      g.setEdge(String(edge.from), String(edge.to), { edgeType: 'parent' })
    }
  }

  dagre.layout(g)

  const positions = new Map()
  g.nodes().forEach((id) => {
    const n = g.node(id)
    positions.set(Number(id), { x: n.x, y: n.y, person: n.person })
  })

  // Align spouses horizontally on same row
  const spouseEdges = graph.edges.filter((e) => e.type === 'spouse')
  for (const edge of spouseEdges) {
    const a = positions.get(edge.from)
    const b = positions.get(edge.to)
    if (!a || !b) continue
    const avgY = (a.y + b.y) / 2
    a.y = avgY
    b.y = avgY
    const gap = NODE_W + 24
    const mid = (a.x + b.x) / 2
    a.x = mid - gap / 2
    b.x = mid + gap / 2
    positions.set(edge.from, a)
    positions.set(edge.to, b)
  }

  return { positions, spouseEdges, parentEdges: graph.edges.filter((e) => e.type === 'parent') }
}

function initSvg() {
  const wrap = el.svg.parentElement
  const rect = wrap.getBoundingClientRect()
  d3.select(el.svg).selectAll('*').remove()
  d3.select(el.svg).attr('width', rect.width).attr('height', rect.height)

  gRoot = d3.select(el.svg).append('g').attr('class', 'ft-root')
  gZoom = gRoot.append('g').attr('class', 'ft-zoom-layer')

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.2, 3])
    .filter((event) => {
      if (event.type === 'dblclick') return false
      const target = event.target
      if (target instanceof Element && target.closest('.ft-node')) return false
      return !event.ctrlKey && !event.button
    })
    .on('zoom', (event) => {
      state.zoomTransform = event.transform
      state.zoomScale = event.transform.k
      gZoom.attr('transform', event.transform)
      el.zoomLabel.textContent = `${Math.round(event.transform.k * 100)}%`
    })

  d3.select(el.svg).call(zoomBehavior).on('dblclick.zoom', null)
}

function linkPath(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const midY = from.y + dy * 0.45
  return `M${from.x},${from.y + NODE_H / 2} C${from.x},${midY} ${to.x},${midY} ${to.x},${to.y - NODE_H / 2}`
}

function spousePath(a, b) {
  return `M${a.x},${a.y} L${b.x},${b.y}`
}

function renderGraph() {
  if (!gRoot) initSvg()
  else {
    const wrap = el.svg.parentElement
    const rect = wrap.getBoundingClientRect()
    d3.select(el.svg).attr('width', rect.width).attr('height', rect.height)
  }

  gZoom.selectAll('*').remove()

  if (!state.graph || state.graph.nodes.length === 0) return

  const { positions, spouseEdges, parentEdges } = layoutGraph(state.graph)

  const edgesG = gZoom.append('g').attr('class', 'ft-edges')

  edgesG
    .selectAll('.ft-edge--parent')
    .data(parentEdges)
    .join('path')
    .attr('class', 'ft-edge ft-edge--parent')
    .attr('d', (d) => {
      const from = positions.get(d.from)
      const to = positions.get(d.to)
      if (!from || !to) return ''
      return linkPath(from, to)
    })

  edgesG
    .selectAll('.ft-edge--spouse')
    .data(spouseEdges)
    .join('path')
    .attr('class', 'ft-edge ft-edge--spouse')
    .attr('d', (d) => {
      const a = positions.get(d.from)
      const b = positions.get(d.to)
      if (!a || !b) return ''
      return spousePath(a, b)
    })

  const nodesG = gZoom
    .selectAll('.ft-node')
    .data(state.graph.nodes)
    .join('g')
    .attr('class', (d) => {
      let cls = 'ft-node'
      if (d.id === state.selectedId) cls += ' ft-node--selected'
      if (d.id === state.highlightId) cls += ' ft-node--highlight'
      return cls
    })
    .attr('transform', (d) => {
      const pos = positions.get(d.id)
      if (!pos) return 'translate(0,0)'
      return `translate(${pos.x - NODE_W / 2},${pos.y - NODE_H / 2})`
    })
    .on('click', (_, d) => {
      selectPerson(d.id)
    })
    .on('touchstart', (event, d) => {
      const t = event.touches[0]
      touchStart = { x: t.clientX, y: t.clientY, id: d.id }
    })
    .on('touchend', (event, d) => {
      if (!touchStart || touchStart.id !== d.id) return
      const t = event.changedTouches[0]
      const dx = t.clientX - touchStart.x
      const dy = t.clientY - touchStart.y
      if (dx * dx + dy * dy < 100) {
        event.preventDefault()
        selectPerson(d.id)
      }
      touchStart = null
    })

  nodesG
    .filter((d) => d.id === state.graph.focus_id)
    .append('text')
    .attr('class', 'ft-node-focus-label')
    .attr('x', NODE_W / 2)
    .attr('y', -6)
    .text('焦点')

  nodesG
    .filter((d) => d.id === state.graph.focus_id)
    .append('rect')
    .attr('class', 'ft-node-focus-ring')
    .attr('x', -4)
    .attr('y', -4)
    .attr('width', NODE_W + 8)
    .attr('height', NODE_H + 8)
    .attr('rx', 10)
    .attr('pointer-events', 'none')

  nodesG
    .append('rect')
    .attr('class', (d) => {
      let c = 'ft-node-card'
      if (d.gender === 'male') c += ' ft-node-card--male'
      if (d.gender === 'female') c += ' ft-node-card--female'
      return c
    })
    .attr('width', NODE_W)
    .attr('height', NODE_H)
    .attr('rx', 8)

  nodesG.each(function (d) {
    const g = d3.select(this)
    if (d.avatar_url) {
      g.append('image')
        .attr('href', d.avatar_url)
        .attr('x', 8)
        .attr('y', 10)
        .attr('width', 36)
        .attr('height', 36)
        .attr('clip-path', 'inset(0 round 18px)')
    } else {
      let avatarCls = 'ft-node-avatar-bg'
      if (d.gender === 'male') avatarCls += ' ft-node-avatar-bg--male'
      if (d.gender === 'female') avatarCls += ' ft-node-avatar-bg--female'
      g.append('circle').attr('class', avatarCls).attr('cx', 26).attr('cy', 28).attr('r', 18)
      let textCls = 'ft-node-avatar-text'
      if (d.gender === 'male' || d.gender === 'female') textCls += ' ft-node-avatar-text--on-color'
      g.append('text')
        .attr('class', textCls)
        .attr('x', 26)
        .attr('y', 28)
        .text(d.name.charAt(0))
    }
  })

  nodesG
    .filter((d) => d.gender === 'male' || d.gender === 'female')
    .append('circle')
    .attr('class', 'ft-node-gender-dot')
    .attr('cx', NODE_W - 12)
    .attr('cy', 12)
    .attr('r', 4)
    .attr('fill', (d) => (d.gender === 'male' ? '#64c6ff' : '#ff58ae'))

  nodesG
    .append('text')
    .attr('class', 'ft-node-name')
    .attr('x', (d) => (d.avatar_url ? 72 : NODE_W / 2))
    .attr('y', 30)
    .text((d) => (d.name.length > 8 ? `${d.name.slice(0, 8)}…` : d.name))

  nodesG
    .append('text')
    .attr('class', 'ft-node-dates')
    .attr('x', (d) => (d.avatar_url ? 72 : NODE_W / 2))
    .attr('y', 48)
    .text((d) => {
      if (d.birth_date && d.death_date) return `${d.birth_date} — ${d.death_date}`
      if (d.birth_date) return `生于 ${d.birth_date}`
      if (d.death_date) return `— ${d.death_date}`
      return ''
    })
}

function fitView() {
  if (!state.graph || state.graph.nodes.length === 0 || !gZoom) return
  const bbox = gZoom.node().getBBox()
  if (!bbox.width || !bbox.height) return
  const svg = el.svg
  const width = svg.clientWidth
  const height = svg.clientHeight
  const pad = 48
  const scale = Math.min(3, Math.max(0.2, Math.min((width - pad) / bbox.width, (height - pad) / bbox.height)))
  const tx = width / 2 - scale * (bbox.x + bbox.width / 2)
  const ty = height / 2 - scale * (bbox.y + bbox.height / 2)
  const transform = d3.zoomIdentity.translate(tx, ty).scale(scale)
  d3.select(svg).call(zoomBehavior.transform, transform)
}

function centerOnNode(nodeId) {
  if (!gZoom) return
  const node = gZoom.selectAll('.ft-node').filter((d) => d.id === nodeId)
  if (node.empty()) return
  const transform = d3.zoomTransform(el.svg)
  const bbox = node.node().getBBox()
  const matrix = node.node().getCTM()
  if (!matrix) return
  const cx = matrix.a * (bbox.x + bbox.width / 2) + matrix.e
  const cy = matrix.d * (bbox.y + bbox.height / 2) + matrix.f
  const width = el.svg.clientWidth
  const height = el.svg.clientHeight
  const scale = Math.max(transform.k, 1)
  const tx = width / 2 - cx * (scale / transform.k)
  const ty = height / 2 - cy * (scale / transform.k)
  d3.select(el.svg).call(
    zoomBehavior.transform,
    d3.zoomIdentity.translate(tx, ty).scale(scale)
  )
}

async function selectPerson(id) {
  state.selectedId = id
  const data = await api(`/persons/${id}`)
  const p = data.person
  el.panelEmpty.hidden = true
  el.detailForm.hidden = false
  el.personId.value = String(p.id)
  el.name.value = p.name
  el.gender.value = p.gender
  el.birth.value = p.birth_date ?? ''
  el.death.value = p.death_date ?? ''
  el.avatar.value = p.avatar_url ?? ''
  el.bio.value = p.bio ?? ''
  fillPersonSelect(el.father, state.persons, p.father_id, p.id)
  fillPersonSelect(el.mother, state.persons, p.mother_id, p.id)
  fillPersonSelect(el.spouse, state.persons, p.spouse_ids[0] ?? null, p.id)
  setMsg(el.panelMsg, '')
  renderGraph()
  openPanel()
}

function openAddDialog(relatedId) {
  setMsg(el.addMsg, '')
  el.addForm.reset()
  fillPersonSelect(el.addRelated, state.persons, relatedId ?? null, null)
  if (relatedId) {
    el.addRelationType.value = 'child'
    el.addRelatedWrap.hidden = false
    el.addRelated.value = String(relatedId)
  } else {
    el.addRelatedWrap.hidden = el.addRelationType.value === ''
  }
  el.addDialog.showModal()
}

async function savePerson(e) {
  e.preventDefault()
  const id = Number(el.personId.value)
  try {
    await api(`/persons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: el.name.value.trim(),
        gender: el.gender.value,
        birth_date: el.birth.value.trim() || null,
        death_date: el.death.value.trim() || null,
        avatar_url: el.avatar.value.trim() || null,
        bio: el.bio.value.trim() || null,
      }),
    })

    const person = (await api(`/persons/${id}`)).person

    async function syncParent(role, selectEl, currentId) {
      const newId = selectEl.value ? Number(selectEl.value) : null
      if (newId === currentId) return
      if (currentId) {
        await api('/parents', {
          method: 'DELETE',
          body: JSON.stringify({ child_id: id, role }),
        })
      }
      if (newId) {
        await api('/parents', {
          method: 'PUT',
          body: JSON.stringify({ child_id: id, parent_id: newId, role }),
        })
      }
    }

    await syncParent('father', el.father, person.father_id)
    await syncParent('mother', el.mother, person.mother_id)

    const newSpouseId = el.spouse.value ? Number(el.spouse.value) : null
    const oldSpouseId = person.spouse_ids[0] ?? null
    if (newSpouseId !== oldSpouseId) {
      if (oldSpouseId) {
        await api('/spouses', {
          method: 'DELETE',
          body: JSON.stringify({ person_a_id: id, person_b_id: oldSpouseId }),
        })
      }
      if (newSpouseId) {
        await api('/spouses', {
          method: 'PUT',
          body: JSON.stringify({ person_a_id: id, person_b_id: newSpouseId }),
        })
      }
    }

    setMsg(el.panelMsg, '已保存', 'ok')
    await loadPersons()
    refreshFocusSelect()
    await loadTree()
    await selectPerson(id)
  } catch (err) {
    setMsg(el.panelMsg, err.message, 'error')
  }
}

async function deletePerson() {
  const id = Number(el.personId.value)
  const p = state.persons.find((x) => x.id === id)
  const msg = p
    ? `确定删除「${p.name}」？关联的父母/配偶链接将一并移除。`
    : '确定删除该成员？'
  if (!confirm(msg)) return
  try {
    await api(`/persons/${id}`, { method: 'DELETE' })
    state.selectedId = null
    el.detailForm.hidden = true
    el.panelEmpty.hidden = false
    closePanel()
    setMsg(el.panelMsg, '')
    await loadPersons()
    refreshFocusSelect()
    await loadTree()
  } catch (err) {
    setMsg(el.panelMsg, err.message, 'error')
  }
}

async function createPerson(e) {
  e.preventDefault()
  const name = el.addName.value.trim()
  if (!name) return
  const body = {
    name,
    gender: el.addGender.value,
    birth_date: el.addBirth.value.trim() || null,
  }
  const relType = el.addRelationType.value
  const relatedId = el.addRelated.value ? Number(el.addRelated.value) : null

  try {
    if (relType === 'child' && relatedId) {
      body.father_id = undefined
      body.mother_id = undefined
      body.spouse_id = undefined
    }

    const created = await api('/persons', { method: 'POST', body: JSON.stringify(body) })
    const newId = created.person.id

    if (relType === 'child' && relatedId) {
      const related = state.persons.find((p) => p.id === relatedId)
      if (related?.gender === 'male') {
        await api('/parents', {
          method: 'PUT',
          body: JSON.stringify({ child_id: newId, parent_id: relatedId, role: 'father' }),
        })
      } else if (related?.gender === 'female') {
        await api('/parents', {
          method: 'PUT',
          body: JSON.stringify({ child_id: newId, parent_id: relatedId, role: 'mother' }),
        })
      } else {
        await api('/parents', {
          method: 'PUT',
          body: JSON.stringify({ child_id: newId, parent_id: relatedId, role: 'father' }),
        })
      }
    } else if (relType === 'father' && relatedId) {
      await api('/parents', {
        method: 'PUT',
        body: JSON.stringify({ child_id: relatedId, parent_id: newId, role: 'father' }),
      })
    } else if (relType === 'mother' && relatedId) {
      await api('/parents', {
        method: 'PUT',
        body: JSON.stringify({ child_id: relatedId, parent_id: newId, role: 'mother' }),
      })
    } else if (relType === 'spouse' && relatedId) {
      await api('/spouses', {
        method: 'PUT',
        body: JSON.stringify({ person_a_id: newId, person_b_id: relatedId }),
      })
    }

    el.addDialog.close()
    await loadPersons()
    state.focusId = newId
    refreshFocusSelect()
    await loadTree()
    await selectPerson(newId)
  } catch (err) {
    setMsg(el.addMsg, err.message, 'error')
  }
}

function setupEvents() {
  el.focusSelect.addEventListener('change', async () => {
    state.focusId = Number(el.focusSelect.value)
    updateFocusBadge()
    await loadTree()
  })

  el.genUp.addEventListener('change', () => loadTree())
  el.genDown.addEventListener('change', () => loadTree())

  el.search.addEventListener('input', () => {
    const q = el.search.value.trim().toLowerCase()
    if (!q) {
      state.highlightId = null
      renderGraph()
      return
    }
    const found = state.persons.find((p) => p.name.toLowerCase().includes(q))
    state.highlightId = found?.id ?? null
    renderGraph()
    if (found) centerOnNode(found.id)
  })

  document.getElementById('ft-zoom-in').addEventListener('click', () => {
    d3.select(el.svg).transition().duration(200).call(zoomBehavior.scaleBy, 1.25)
  })
  document.getElementById('ft-zoom-out').addEventListener('click', () => {
    d3.select(el.svg).transition().duration(200).call(zoomBehavior.scaleBy, 0.8)
  })
  document.getElementById('ft-fit-btn').addEventListener('click', fitView)

  document.getElementById('ft-add-btn').addEventListener('click', () => openAddDialog())
  document.getElementById('ft-empty-add').addEventListener('click', () => openAddDialog())
  document.getElementById('ft-add-cancel').addEventListener('click', () => el.addDialog.close())

  el.addRelationType.addEventListener('change', () => {
    el.addRelatedWrap.hidden = !el.addRelationType.value
  })

  el.detailForm.addEventListener('submit', savePerson)
  document.getElementById('ft-delete-btn').addEventListener('click', deletePerson)
  el.addForm.addEventListener('submit', createPerson)

  document.getElementById('ft-focus-here').addEventListener('click', async () => {
    state.focusId = Number(el.personId.value)
    refreshFocusSelect()
    await loadTree()
  })

  el.panelClose?.addEventListener('click', closePanel)
  el.panelBackdrop?.addEventListener('click', closePanel)

  window.addEventListener('resize', () => {
    if (!isMobile()) closePanel()
    initSvg()
    renderGraph()
    fitView()
  })
}

function showEmpty(message, showAddButton = true) {
  el.empty.hidden = false
  el.empty.querySelector('p').textContent = message
  const addBtn = document.getElementById('ft-empty-add')
  if (addBtn) addBtn.hidden = !showAddButton
}

async function init() {
  setupEvents()
  initSvg()
  try {
    await loadPersons()
  } catch (err) {
    showEmpty(
      `无法加载成员列表：${err.message}。若在线上，请确认 D1 已绑定且已执行 db:migrate:remote。`,
      false
    )
    return
  }
  refreshFocusSelect()
  if (state.persons.length === 0) {
    showEmpty('还没有家族成员，点击下方按钮添加第一位祖先')
    return
  }
  try {
    await loadTree()
  } catch (err) {
    showEmpty(`树图加载失败：${err.message}`, false)
  }
}

init().catch((err) => {
  console.error(err)
  showEmpty(`页面脚本错误：${err.message}`, false)
})
