import * as d3 from 'd3'
import dagre from '@dagrejs/dagre'

const NODE_W = 136
const NODE_H = 72
const NODE_GAP = 20
const SPOUSE_GAP = 32
const LAYER_Y_TOLERANCE = 36
const API = '/api/family'

const GENDER_STYLE = {
  male: { fill: 'rgba(100,198,255,0.35)', stroke: '#64c6ff', avatar: '#64c6ff', dot: '#64c6ff' },
  female: { fill: 'rgba(255,88,174,0.28)', stroke: '#ff58ae', avatar: '#ff58ae', dot: '#ff58ae' },
  unknown: { fill: '#ffffff', stroke: '#f2f0ed', avatar: '#f2f0ed', dot: null },
}

function genderStyle(gender) {
  return GENDER_STYLE[gender] ?? GENDER_STYLE.unknown
}

const state = {
  persons: [],
  focusId: null,
  selectedId: null,
  highlightId: null,
  graph: null,
  collapsedIds: new Set(),
  zoomTransform: d3.zoomIdentity,
  zoomScale: 1,
}

const MOBILE_MQ = window.matchMedia('(max-width: 1024px), (pointer: coarse)')

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
  addDialogTitle: document.getElementById('ft-add-dialog-title'),
  addRelationHint: document.getElementById('ft-add-relation-hint'),
  addRelationTypeWrap: document.getElementById('ft-add-relation-type-wrap'),
  contextMenu: document.getElementById('ft-context-menu'),
  contextMenuTitle: document.getElementById('ft-context-menu-title'),
}

const REL_LABELS = {
  father: '父亲',
  mother: '母亲',
  child: '子女',
  spouse: '配偶',
}

const addDraft = { relatedId: null, relType: '' }

let gRoot
let gZoom
let zoomBehavior
let contextMenuTargetId = null
let suppressNodeClick = false
let longPressTimer = null
const LONG_PRESS_MS = 500

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

function hideContextMenu() {
  if (!el.contextMenu) return
  el.contextMenu.hidden = true
  contextMenuTargetId = null
}

function showContextMenu(personId, clientX, clientY) {
  const p = state.persons.find((x) => x.id === personId)
  if (!p || !el.contextMenu) return

  if (el.contextMenuTitle) {
    el.contextMenuTitle.textContent = `为「${p.name}」添加`
  }

  for (const action of ['father', 'mother', 'child', 'spouse']) {
    const btn = el.contextMenu.querySelector(`[data-action="${action}"]`)
    if (!btn) continue
    if (action === 'father') btn.disabled = !!p.father_id
    else if (action === 'mother') btn.disabled = !!p.mother_id
    else if (action === 'spouse') btn.disabled = !!(p.spouse_ids && p.spouse_ids[0])
    else btn.disabled = false
  }

  contextMenuTargetId = personId
  el.contextMenu.hidden = false

  const pad = 8
  el.contextMenu.style.left = `${clientX}px`
  el.contextMenu.style.top = `${clientY}px`
  const rect = el.contextMenu.getBoundingClientRect()
  let left = clientX
  let top = clientY
  if (rect.right > window.innerWidth - pad) left = window.innerWidth - rect.width - pad
  if (rect.bottom > window.innerHeight - pad) top = window.innerHeight - rect.height - pad
  left = Math.max(pad, left)
  top = Math.max(pad, top)
  el.contextMenu.style.left = `${left}px`
  el.contextMenu.style.top = `${top}px`
}

function isToggleTarget(event) {
  const target = event.target
  return target instanceof Element && !!target.closest('.ft-node-toggle')
}

function bindNodePointerEvents(nodesG) {
  nodesG
    .style('touch-action', 'manipulation')
    .on('contextmenu', (event, d) => {
      if (isToggleTarget(event)) return
      event.preventDefault()
      event.stopPropagation()
      suppressNodeClick = true
      showContextMenu(d.id, event.clientX, event.clientY)
    })
    .on('pointerdown', (event, d) => {
      if (isToggleTarget(event)) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      clearTimeout(longPressTimer)
      longPressTimer = setTimeout(() => {
        longPressTimer = null
        suppressNodeClick = true
        showContextMenu(d.id, event.clientX, event.clientY)
      }, LONG_PRESS_MS)
    })
    .on('pointerup', (event, d) => {
      if (isToggleTarget(event)) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      clearTimeout(longPressTimer)
      longPressTimer = null
      if (suppressNodeClick) {
        suppressNodeClick = false
        event.stopPropagation()
        return
      }
      event.stopPropagation()
      hideContextMenu()
      selectPerson(d.id)
    })
    .on('pointercancel', () => {
      clearTimeout(longPressTimer)
      longPressTimer = null
    })
    .on('pointerleave', () => {
      clearTimeout(longPressTimer)
      longPressTimer = null
    })
}

function resetAddDraft() {
  addDraft.relatedId = null
  addDraft.relType = ''
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

function setEmptyState(visible, message = '', showAddBtn = true) {
  if (!el.empty) return
  el.empty.hidden = !visible
  if (visible && message) {
    el.empty.querySelector('p').textContent = message
  }
  const addBtn = document.getElementById('ft-empty-add')
  if (addBtn) addBtn.hidden = !showAddBtn
}

async function loadPersons() {
  const data = await api('/persons')
  state.persons = Array.isArray(data.persons) ? data.persons : []
  if (state.persons.length > 0) {
    setEmptyState(false)
  }
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

async function loadTree({ revealId } = {}) {
  if (!state.focusId && state.persons.length > 0) {
    refreshFocusSelect()
  }
  if (!state.focusId) {
    state.graph = null
    renderGraph()
    if (state.persons.length === 0) {
      setEmptyState(true, '还没有家族成员，点击下方按钮添加第一位祖先')
    } else {
      setEmptyState(true, '无法确定焦点成员', false)
    }
    return
  }
  setEmptyState(false)
  const up = Number(el.genUp.value) || 3
  const down = Number(el.genDown.value) || 3
  const raw = await api(`/tree?focus=${state.focusId}&up=${up}&down=${down}`)
  state.graph = normalizeTreeGraph(raw)
  if (revealId) revealPersonInTree(revealId)
  if (!state.graph.nodes.length) {
    setEmptyState(true, '暂无可见节点，请切换焦点或添加关系', false)
    renderGraph()
    return
  }
  setEmptyState(false)
  renderGraph()
  if (revealId) centerOnNode(revealId)
  else fitView()
}

function normalizeTreeGraph(raw) {
  return {
    focus_id: raw?.focus_id ?? null,
    nodes: Array.isArray(raw?.nodes) ? raw.nodes : [],
    edges: Array.isArray(raw?.edges) ? raw.edges : [],
  }
}

function buildChildrenMap(edges) {
  const map = new Map()
  for (const edge of edges) {
    if (edge.type !== 'parent') continue
    const list = map.get(edge.from) ?? []
    if (!list.includes(edge.to)) list.push(edge.to)
    map.set(edge.from, list)
  }
  return map
}

function buildParentMap(edges) {
  const map = new Map()
  for (const edge of edges) {
    if (edge.type !== 'parent') continue
    const list = map.get(edge.to) ?? []
    if (!list.includes(edge.from)) list.push(edge.from)
    map.set(edge.to, list)
  }
  return map
}

function collectDescendants(rootId, childrenMap) {
  const hidden = new Set()
  const queue = [...(childrenMap.get(rootId) ?? [])]
  while (queue.length) {
    const id = queue.shift()
    if (hidden.has(id)) continue
    hidden.add(id)
    for (const childId of childrenMap.get(id) ?? []) queue.push(childId)
  }
  return hidden
}

function applyCollapsedFilter(graph, collapsedIds) {
  if (!collapsedIds.size) return graph
  const childrenMap = buildChildrenMap(graph.edges)
  const hidden = new Set()
  for (const id of collapsedIds) {
    for (const d of collectDescendants(id, childrenMap)) hidden.add(d)
  }
  const visibleIds = new Set(graph.nodes.filter((n) => !hidden.has(n.id)).map((n) => n.id))
  return {
    focus_id: graph.focus_id,
    nodes: graph.nodes.filter((n) => visibleIds.has(n.id)),
    edges: graph.edges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to)),
  }
}

function pruneCollapsedIds() {
  if (!state.graph) return
  const ids = new Set(state.graph.nodes.map((n) => n.id))
  for (const id of state.collapsedIds) {
    if (!ids.has(id)) state.collapsedIds.delete(id)
  }
}

/** 展开 personId 及其所有祖先，确保新加/关联成员不被 collapsed 过滤掉 */
function revealPersonInTree(personId) {
  if (!state.graph) return
  state.collapsedIds.delete(personId)
  const parentMap = buildParentMap(state.graph.edges)
  const queue = [personId]
  const seen = new Set()
  while (queue.length) {
    const id = queue.shift()
    if (seen.has(id)) continue
    seen.add(id)
    state.collapsedIds.delete(id)
    for (const parentId of parentMap.get(id) ?? []) {
      state.collapsedIds.delete(parentId)
      queue.push(parentId)
    }
  }
}

function toggleCollapse(personId) {
  if (state.collapsedIds.has(personId)) state.collapsedIds.delete(personId)
  else state.collapsedIds.add(personId)
  renderGraph()
}

function expandAll() {
  state.collapsedIds.clear()
  renderGraph()
}

function collapseAll() {
  if (!state.graph) return
  const childrenMap = buildChildrenMap(state.graph.edges)
  const keepUncollapsed = new Set([state.graph.focus_id])
  for (const edge of state.graph.edges) {
    if (edge.type !== 'spouse') continue
    if (edge.from === state.graph.focus_id || edge.to === state.graph.focus_id) {
      keepUncollapsed.add(edge.from)
      keepUncollapsed.add(edge.to)
    }
  }
  state.collapsedIds.clear()
  for (const [id, children] of childrenMap) {
    if (children.length > 0 && !keepUncollapsed.has(id)) state.collapsedIds.add(id)
  }
  renderGraph()
}

function layoutGraph(graph) {
  const nodes = graph.nodes ?? []
  const edges = graph.edges ?? []
  const spouseEdges = edges.filter((e) => e.type === 'spouse')

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', nodesep: 56, ranksep: NODE_H + NODE_GAP, marginx: 40, marginy: 40 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const node of nodes) {
    g.setNode(String(node.id), { width: NODE_W, height: NODE_H, person: node })
  }

  // ponytail: 配偶边不参与 dagre 层级布局；无父子边的配偶（如吴兴）靠同层打包定位
  for (const edge of edges) {
    if (edge.type === 'parent') {
      g.setEdge(String(edge.from), String(edge.to), { edgeType: 'parent' })
    }
  }

  dagre.layout(g)

  const positions = new Map()
  const nodeIds = g.nodes()
  if (nodeIds) {
    nodeIds.forEach((id) => {
      const n = g.node(id)
      if (!n) return
      positions.set(Number(id), { x: n.x, y: n.y, person: n.person })
    })
  }

  anchorSpousesToPartners(positions, spouseEdges, edges.filter((e) => e.type === 'parent'))
  const layers = groupNodesByLayer(positions)
  for (const layer of layers) {
    packLayer(positions, buildLayerUnits(layer.ids, spouseEdges, positions))
  }
  resolveLayerOverlaps(positions)

  return { positions, spouseEdges, parentEdges: edges.filter((e) => e.type === 'parent') }
}

/** 配偶与伴侣同层；优先跟随在树中有父母/子女链的一方，避免无关系配偶把伴侣拽到错误代际 */
function anchorSpousesToPartners(positions, spouseEdges, parentEdges) {
  const childIds = new Set(parentEdges.map((e) => e.to))
  const parentIds = new Set(parentEdges.map((e) => e.from))

  for (const edge of spouseEdges) {
    const a = positions.get(edge.from)
    const b = positions.get(edge.to)
    if (!a || !b) continue

    let y
    const aInTree = childIds.has(edge.from) || parentIds.has(edge.from)
    const bInTree = childIds.has(edge.to) || parentIds.has(edge.to)
    if (aInTree && !bInTree) y = a.y
    else if (bInTree && !aInTree) y = b.y
    else y = Math.max(a.y, b.y)

    a.y = y
    b.y = y
  }
}

function groupNodesByLayer(positions) {
  const layers = []
  for (const [id, pos] of positions) {
    let layer = layers.find((l) => Math.abs(l.y - pos.y) < LAYER_Y_TOLERANCE)
    if (!layer) {
      layer = { y: pos.y, ids: [] }
      layers.push(layer)
    }
    layer.ids.push(id)
    layer.y = layer.ids.reduce((s, i) => s + positions.get(i).y, 0) / layer.ids.length
  }
  for (const layer of layers) {
    for (const id of layer.ids) {
      const p = positions.get(id)
      p.y = layer.y
      positions.set(id, p)
    }
  }
  return layers
}

function buildLayerUnits(layerIds, spouseEdges, positions) {
  const inLayer = new Set(layerIds)
  const partnerOf = new Map()
  for (const e of spouseEdges) {
    if (inLayer.has(e.from) && inLayer.has(e.to)) {
      partnerOf.set(e.from, e.to)
      partnerOf.set(e.to, e.from)
    }
  }

  const used = new Set()
  const units = []
  const sorted = [...layerIds].sort((a, b) => positions.get(a).x - positions.get(b).x)

  for (const id of sorted) {
    if (used.has(id)) continue
    const partner = partnerOf.get(id)
    if (partner != null && !used.has(partner)) {
      const [left, right] = [id, partner].sort((a, b) => positions.get(a).x - positions.get(b).x)
      units.push({ ids: [left, right], width: NODE_W * 2 + SPOUSE_GAP })
      used.add(left)
      used.add(right)
    } else {
      units.push({ ids: [id], width: NODE_W })
      used.add(id)
    }
  }
  return units
}

/** 同层按单元（单人 / 配偶对）水平打包，避免配偶对齐后压住兄弟姐妹 */
function packLayer(positions, units) {
  if (units.length === 0) return

  const totalWidth =
    units.reduce((s, u) => s + u.width, 0) + Math.max(0, units.length - 1) * NODE_GAP
  const avgX =
    units.reduce((s, u) => {
      const cx = u.ids.reduce((ss, id) => ss + positions.get(id).x, 0) / u.ids.length
      return s + cx
    }, 0) / units.length

  let cursor = avgX - totalWidth / 2

  for (const unit of units) {
    if (unit.ids.length === 2) {
      const [left, right] = unit.ids
      positions.get(left).x = cursor + NODE_W / 2
      positions.get(right).x = cursor + NODE_W + SPOUSE_GAP + NODE_W / 2
    } else {
      positions.get(unit.ids[0]).x = cursor + NODE_W / 2
    }
    cursor += unit.width + NODE_GAP
  }
}

/** 同层内仅水平推开，不破坏代际 y */
function resolveLayerOverlaps(positions) {
  for (let iter = 0; iter < 12; iter++) {
    let moved = false
    for (const layer of groupNodesByLayer(positions)) {
      const ids = [...layer.ids].sort((a, b) => positions.get(a).x - positions.get(b).x)
      for (let j = 1; j < ids.length; j++) {
        const left = positions.get(ids[j - 1])
        const right = positions.get(ids[j])
        const need = NODE_W + NODE_GAP
        const gap = right.x - left.x
        if (gap < need) {
          const shift = (need - gap) / 2 + 1
          left.x -= shift
          right.x += shift
          moved = true
        }
      }
    }
    if (!moved) break
  }
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
  hideContextMenu()
  if (!gRoot) initSvg()
  else {
    const wrap = el.svg.parentElement
    const rect = wrap.getBoundingClientRect()
    d3.select(el.svg).attr('width', rect.width).attr('height', rect.height)
  }

  gZoom.selectAll('*').remove()

  if (!state.graph || state.graph.nodes.length === 0) return

  pruneCollapsedIds()
  const visibleGraph = applyCollapsedFilter(state.graph, state.collapsedIds)
  const fullChildrenMap = buildChildrenMap(state.graph.edges)

  const { positions, spouseEdges, parentEdges } = layoutGraph(visibleGraph)

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
    .data(visibleGraph.nodes)
    .join('g')
    .attr('class', (d) => {
      let cls = 'ft-node'
      if (state.collapsedIds.has(d.id)) cls += ' ft-node--collapsed'
      if (d.id === state.selectedId) cls += ' ft-node--selected'
      if (d.id === state.highlightId) cls += ' ft-node--highlight'
      return cls
    })
    .attr('transform', (d) => {
      const pos = positions.get(d.id)
      if (!pos) return 'translate(0,0)'
      return `translate(${pos.x - NODE_W / 2},${pos.y - NODE_H / 2})`
    })

  bindNodePointerEvents(nodesG)

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
    .attr('fill', (d) => genderStyle(d.gender).fill)
    .attr('stroke', (d) => {
      if (d.id === state.selectedId) return '#ff3e00'
      if (d.id === state.highlightId) return '#00c978'
      return genderStyle(d.gender).stroke
    })
    .attr('stroke-width', (d) =>
      d.id === state.selectedId || d.id === state.highlightId ? 3 : 2
    )

  nodesG.each(function (d) {
    const g = d3.select(this)
    const gs = genderStyle(d.gender)
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
      g.append('circle')
        .attr('class', avatarCls)
        .attr('cx', 26)
        .attr('cy', 28)
        .attr('r', 18)
        .attr('fill', gs.avatar)
      let textCls = 'ft-node-avatar-text'
      if (d.gender === 'male' || d.gender === 'female') textCls += ' ft-node-avatar-text--on-color'
      g.append('text')
        .attr('class', textCls)
        .attr('x', 26)
        .attr('y', 28)
        .attr('fill', d.gender === 'male' || d.gender === 'female' ? '#ffffff' : null)
        .text(d.name.charAt(0))
    }
  })

  nodesG
    .filter((d) => genderStyle(d.gender).dot)
    .append('circle')
    .attr('class', 'ft-node-gender-dot')
    .attr('cx', NODE_W - 12)
    .attr('cy', 12)
    .attr('r', 4)
    .attr('fill', (d) => genderStyle(d.gender).dot)

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

  nodesG.each(function (d) {
    const childCount = (fullChildrenMap.get(d.id) ?? []).length
    if (childCount === 0) return

    const collapsed = state.collapsedIds.has(d.id)
    const g = d3.select(this)
    const toggleG = g
      .append('g')
      .attr('class', `ft-node-toggle${collapsed ? ' ft-node-toggle--collapsed' : ''}`)
      .attr('transform', `translate(${NODE_W / 2}, ${NODE_H + 4})`)
      .style('cursor', 'pointer')

    toggleG
      .append('rect')
      .attr('class', 'ft-node-toggle-bg')
      .attr('x', -9)
      .attr('y', -9)
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 4)

    toggleG
      .append('text')
      .attr('class', 'ft-node-toggle-icon')
      .attr('y', 1)
      .text(collapsed ? '▶' : '▼')

    if (collapsed) {
      toggleG
        .append('text')
        .attr('class', 'ft-node-collapse-badge')
        .attr('x', 14)
        .attr('y', 1)
        .text(String(childCount))
    }

    toggleG.on('click', (event) => {
      event.stopPropagation()
      toggleCollapse(d.id)
    })
    toggleG.on('pointerdown', (event) => event.stopPropagation())
    toggleG.on('pointerup', (event) => event.stopPropagation())
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

async function openEditorForSelection() {
  const id = state.selectedId ?? state.focusId
  if (!id) {
    window.alert('请先点击节点或设置焦点')
    return
  }
  await selectPerson(id)
}

async function selectPerson(id, { openDrawer = true } = {}) {
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
  if (openDrawer && isMobile()) openPanel()
}

function openAddDialog(opts) {
  setMsg(el.addMsg, '')
  el.addForm.reset()
  resetAddDraft()

  let relatedId = null
  let relType = ''
  if (typeof opts === 'number') {
    relatedId = opts
    relType = 'child'
  } else if (opts) {
    relatedId = opts.relatedId ?? null
    relType = opts.relType ?? ''
  }

  const prefill = relatedId && relType
  if (prefill) {
    addDraft.relatedId = relatedId
    addDraft.relType = relType
    const p = state.persons.find((x) => x.id === relatedId)
    if (el.addDialogTitle) el.addDialogTitle.textContent = `添加${REL_LABELS[relType]}`
    if (el.addRelationHint) {
      el.addRelationHint.hidden = false
      el.addRelationHint.textContent = `将作为「${p?.name ?? ''}」的${REL_LABELS[relType]}。若树上未出现新节点，请增大工具栏的「上/下」代数。`
    }
    if (el.addRelationTypeWrap) el.addRelationTypeWrap.hidden = true
    el.addRelatedWrap.hidden = true
    el.addGender.value =
      relType === 'father' ? 'male' : relType === 'mother' ? 'female' : 'unknown'
  } else {
    if (el.addDialogTitle) el.addDialogTitle.textContent = '添加成员'
    if (el.addRelationHint) el.addRelationHint.hidden = true
    if (el.addRelationTypeWrap) el.addRelationTypeWrap.hidden = false
    fillPersonSelect(el.addRelated, state.persons, relatedId ?? null, null)
    if (relatedId) {
      el.addRelationType.value = 'child'
      el.addRelatedWrap.hidden = false
      el.addRelated.value = String(relatedId)
    } else {
      el.addRelatedWrap.hidden = el.addRelationType.value === ''
    }
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
    await loadTree({ revealId: id })
    await selectPerson(id, { openDrawer: false })
    if (isMobile()) closePanel()
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
  const relType = addDraft.relType || el.addRelationType.value
  const relatedId = addDraft.relatedId ?? (el.addRelated.value ? Number(el.addRelated.value) : null)

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
    resetAddDraft()
    await loadPersons()
    state.focusId = relType && relatedId ? relatedId : newId
    refreshFocusSelect()
    await loadTree({ revealId: newId })
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
  document.getElementById('ft-expand-all')?.addEventListener('click', expandAll)
  document.getElementById('ft-collapse-all')?.addEventListener('click', collapseAll)

  document.getElementById('ft-add-btn').addEventListener('click', () => openAddDialog())
  document.getElementById('ft-edit-btn')?.addEventListener('click', () => openEditorForSelection())
  document.getElementById('ft-empty-add').addEventListener('click', () => openAddDialog())
  document.getElementById('ft-add-cancel').addEventListener('click', () => {
    resetAddDraft()
    el.addDialog.close()
  })

  el.contextMenu?.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const action = btn.getAttribute('data-action')
      const id = contextMenuTargetId
      hideContextMenu()
      if (!id) return
      if (action === 'detail') {
        await selectPerson(id)
        return
      }
      if (['father', 'mother', 'child', 'spouse'].includes(action)) {
        openAddDialog({ relatedId: id, relType: action })
      }
    })
  })

  document.addEventListener('click', (event) => {
    if (el.contextMenu?.hidden) return
    if (el.contextMenu?.contains(event.target)) return
    hideContextMenu()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideContextMenu()
  })

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
  setEmptyState(true, message, showAddButton)
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
