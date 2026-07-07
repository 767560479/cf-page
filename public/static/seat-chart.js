(function () {
  'use strict';

  function seatChartDialog(opts) {
    return new Promise(function (resolve) {
      var overlay = document.getElementById('sc-dialog-overlay');
      var titleEl = document.getElementById('sc-dialog-title');
      var textEl = document.getElementById('sc-dialog-text');
      var inputEl = document.getElementById('sc-dialog-input');
      var textareaEl = document.getElementById('sc-dialog-textarea');
      var actionsEl = document.getElementById('sc-dialog-actions');
      if (!overlay) {
        resolve({ isConfirmed: false });
        return;
      }

      titleEl.textContent = opts.title || '';
      textEl.textContent = opts.text || '';
      textEl.style.display = opts.text ? 'block' : 'none';

      inputEl.style.display = 'none';
      textareaEl.style.display = 'none';
      inputEl.value = opts.inputValue || '';
      textareaEl.value = opts.inputValue || '';

      if (opts.input === 'text') {
        inputEl.style.display = 'block';
      } else if (opts.input === 'textarea') {
        textareaEl.style.display = 'block';
        textareaEl.placeholder = opts.inputPlaceholder || '';
      }

      actionsEl.innerHTML = '';
      if (opts.showCancelButton) {
        var cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-ghost';
        cancelBtn.textContent = opts.cancelButtonText || '取消';
        cancelBtn.addEventListener('click', function () {
          overlay.classList.remove('is-open');
          resolve({ isConfirmed: false });
        });
        actionsEl.appendChild(cancelBtn);
      }

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.textContent = opts.confirmButtonText || '确定';
      confirmBtn.addEventListener('click', function () {
        overlay.classList.remove('is-open');
        var value = opts.input === 'textarea' ? textareaEl.value : opts.input === 'text' ? inputEl.value : undefined;
        resolve({ isConfirmed: true, value: value });
      });
      actionsEl.appendChild(confirmBtn);

      overlay.classList.add('is-open');
    });
  }

  function seatChartAlert(title, text) {
    return seatChartDialog({ title: title, text: text || '', confirmButtonText: '确定' });
  }

  const STORAGE_KEY = 'seatSchemes';
  const DEFAULT_COLS = 8;
  const DEFAULT_ROWS = 6;

  let state = {
    students: [],           // { id, name, gender, height, remark }
    seats: [],              // 2D: [row][col] = studentId | null
    layout: { cols: DEFAULT_COLS, rows: DEFAULT_ROWS, podium: 'bottom', aisleCols: [2, 4, 6] },
    bindPairs: [],          // [[id1, id2], ...]
    excludePairs: [],       // [[id1, id2], ...]
    history: [],
    historyIndex: -1,
    nextId: 1,
    currentSchemeId: null
  };

  function genId() { return 's' + (state.nextId++); }

  function getSchemeList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  function saveSchemeList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function pushHistory() {
    const snapshot = {
      students: JSON.parse(JSON.stringify(state.students)),
      seats: state.seats.map(row => row.slice()),
      layout: { ...state.layout }
    };
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snapshot);
    if (state.history.length > 50) state.history.shift();
    else state.historyIndex++;
  }

  function undo() {
    if (state.historyIndex <= 0) return;
    state.historyIndex--;
    const s = state.history[state.historyIndex];
    state.students = JSON.parse(JSON.stringify(s.students));
    state.seats = s.seats.map(row => row.slice());
    state.layout = { ...s.layout };
    renderAll();
  }

  function redo() {
    if (state.historyIndex >= state.history.length - 1) return;
    state.historyIndex++;
    const s = state.history[state.historyIndex];
    state.students = JSON.parse(JSON.stringify(s.students));
    state.seats = s.seats.map(row => row.slice());
    state.layout = { ...s.layout };
    renderAll();
  }

  function buildSeatGrid() {
    const { cols, rows, podium, aisleCols } = state.layout;
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) grid[r][c] = state.seats[r] && state.seats[r][c] != null ? state.seats[r][c] : null;
    }
    return grid;
  }

  function ensureSeatsSize() {
    const { cols, rows } = state.layout;
    while (state.seats.length < rows) state.seats.push([]);
    for (let r = 0; r < rows; r++) {
      while (state.seats[r].length < cols) state.seats[r].push(null);
      state.seats[r] = state.seats[r].slice(0, cols);
    }
    state.seats = state.seats.slice(0, rows);
  }

  function getStudent(id) { return state.students.find(s => s.id === id); }

  function parsePasteText(text) {
    const lines = text.trim().split(/\r?\n/).map(l => l.split(/[\t,，]/).map(c => c.trim()));
    if (lines.length < 2) return [];
    const header = lines[0].map(h => (h || '').toLowerCase());
    const nameIdx = header.findIndex(h => h.includes('姓名') || h === 'name');
    const genderIdx = header.findIndex(h => h.includes('性别') || h === 'gender');
    const heightIdx = header.findIndex(h => h.includes('身高') || h === 'height');
    const remarkIdx = header.findIndex(h => h.includes('备注') || h.includes('特殊') || h === 'remark');
    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      const name = (nameIdx >= 0 ? row[nameIdx] : row[0]) || '';
      if (!name) continue;
      const gender = (genderIdx >= 0 ? row[genderIdx] : row[1]) || '男';
      let height = (heightIdx >= 0 ? row[heightIdx] : row[2]) || '中';
      if (!['高', '中', '矮'].includes(height)) height = '中';
      const remark = (remarkIdx >= 0 ? row[remarkIdx] : row[3]) || '';
      students.push({ id: genId(), name, gender: gender === '女' ? '女' : '男', height, remark });
    }
    return students;
  }

  function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const first = wb.SheetNames[0];
          const ws = wb.Sheets[first];
          const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          const students = parsePasteText(json.map(row => row.join('\t')).join('\n'));
          resolve(students);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsArrayBuffer(file);
    });
  }

  function createTemplateBlob() {
    const rows = [
      ['姓名', '性别', '身高', '备注/特殊需求'],
      ['张三', '男', '中', ''],
      ['李四', '女', '矮', '需前排'],
      ['王五', '男', '高', '近视']
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '学生名单');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function syncLayoutInputs() {
    document.getElementById('colCount').value = state.layout.cols;
    document.getElementById('rowCount').value = state.layout.rows;
    document.getElementById('podiumPos').value = state.layout.podium;
    document.getElementById('aisleCol').value = (state.layout.aisleCols || []).join(',');
  }

  function loadScheme(id) {
    const list = getSchemeList();
    const scheme = list.find(s => s.id === id);
    if (!scheme) return;
    state.students = JSON.parse(JSON.stringify(scheme.students));
    state.seats = (scheme.seats || []).map(row => row.slice());
    state.layout = { ...(scheme.layout || state.layout) };
    state.bindPairs = (scheme.bindPairs || []).map(p => p.slice());
    state.excludePairs = (scheme.excludePairs || []).map(p => p.slice());
    state.currentSchemeId = id;
    ensureSeatsSize();
    syncLayoutInputs();
    renderAll();
  }

  function saveCurrentScheme(name) {
    const list = getSchemeList();
    const payload = {
      id: state.currentSchemeId || 'scheme_' + Date.now(),
      name: name || '未命名方案',
      students: JSON.parse(JSON.stringify(state.students)),
      seats: state.seats.map(row => row.slice()),
      layout: { ...state.layout },
      bindPairs: state.bindPairs.map(p => p.slice()),
      excludePairs: state.excludePairs.map(p => p.slice())
    };
    const idx = list.findIndex(s => s.id === payload.id);
    if (idx >= 0) list[idx] = payload;
    else list.push(payload);
    saveSchemeList(list);
    state.currentSchemeId = payload.id;
    renderSchemeSelect();
  }

  function renderSchemeSelect() {
    const sel = document.getElementById('schemeSelect');
    const list = getSchemeList();
    sel.innerHTML = '<option value="">-- 选择或新建 --</option>' +
      list.map(s => `<option value="${s.id}" ${s.id === state.currentSchemeId ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('');
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applyLayout() {
    const cols = Math.max(2, Math.min(12, parseInt(document.getElementById('colCount').value, 10) || DEFAULT_COLS));
    const rows = Math.max(1, Math.min(20, parseInt(document.getElementById('rowCount').value, 10) || DEFAULT_ROWS));
    const podium = document.getElementById('podiumPos').value;
    const aisleStr = (document.getElementById('aisleCol').value || '').trim();
    const aisleCols = aisleStr ? aisleStr.split(/[,，\s]+/).map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n >= 1) : [];
    state.layout = { cols, rows, podium, aisleCols };
    ensureSeatsSize();
    pushHistory();
    renderAll();
  }

  function renderSeatCard(studentId, row, col) {
    const isEmpty = !studentId;
    const student = studentId ? getStudent(studentId) : null;
    const needFront = student && /前排|需前排|需前台|前派/i.test(student.remark);
    const needMiddle = student && /中间|需中间/i.test(student.remark);
    const tags = [];
    if (student) {
      if (/近视/i.test(student.remark)) tags.push('近视');
      if (/高个子|高个/i.test(student.remark) || student.height === '高') tags.push('高');
      if (needFront) tags.push('需前排');
      if (needMiddle) tags.push('需中间');
    }
    const genderClass = student && student.gender === '女' ? 'girl' : (student ? 'boy' : 'empty-seat');
    const genderIcon = student ? (student.gender === '女' ? '♀' : '♂') : '';
    const name = student ? escapeHtml(student.name) : '空位';
    const tagHtml = tags.length ? `<span class="sc-seat-tags">${tags.join(' ')}</span>` : '';
    return `<div class="seat-card ${genderClass}"
      data-student-id="${studentId || ''}" data-row="${row}" data-col="${col}"
      draggable="${isEmpty ? 'false' : 'true'}">
      <div class="sc-seat-name">${name}</div>
      ${genderIcon ? `<span class="sc-seat-gender">${genderIcon}</span>` : ''}
      ${tagHtml}
    </div>`;
  }

  function renderSeatGrid() {
    const gridEl = document.getElementById('seatGrid');
    const { cols, rows, podium, aisleCols } = state.layout;
    ensureSeatsSize();

    const totalCols = cols + aisleCols.length;
    let gridHtml = '';
    const isPodiumTop = podium === 'top';
    const isPodiumLeft = podium === 'left';
    const isPodiumRight = podium === 'right';

    if (isPodiumTop) {
      gridHtml += '<div class="podium sc-podium-bar" style="grid-column: 1 / -1">讲台</div>';
    }
    for (let r = 0; r < rows; r++) {
      if (isPodiumLeft) gridHtml += '<div class="podium sc-podium-side" style="grid-column: 1">讲台</div>';
      for (let c = 0; c < cols; c++) {
        const hasAisleLeft = aisleCols.includes(c);
        if (hasAisleLeft) gridHtml += `<div style="min-width: 12px;"></div>`;
        const sid = state.seats[r] && state.seats[r][c] != null ? state.seats[r][c] : null;
        gridHtml += renderSeatCard(sid, r, c);
      }
      if (isPodiumRight) gridHtml += '<div class="podium sc-podium-side">讲台</div>';
    }
    if (podium === 'bottom') {
      gridHtml += '<div class="podium sc-podium-bar" style="grid-column: 1 / -1">讲台</div>';
    }

    gridEl.innerHTML = gridHtml;
    gridEl.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;

    gridEl.querySelectorAll('.seat-card[data-student-id]').forEach(card => {
      const id = card.getAttribute('data-student-id');
      if (!id) return;
      card.addEventListener('click', () => openEditModal(id));
    });

    initSeatGridSortable();
  }

  function initSeatGridSortable() {
    const grid = document.getElementById('seatGrid');
    if (!grid) return;
    grid.querySelectorAll('.seat-card').forEach(card => {
      card.addEventListener('dragstart', onSeatDragStart);
      card.addEventListener('dragover', onSeatDragOver);
      card.addEventListener('drop', onSeatDrop);
      card.addEventListener('dragend', onSeatDragEnd);
    });
  }

  let dragSource = null;
  function onSeatDragStart(e) {
    const id = e.currentTarget.getAttribute('data-student-id');
    if (!id) { e.preventDefault(); return; }
    dragSource = { type: 'seat', id, row: +e.currentTarget.getAttribute('data-row'), col: +e.currentTarget.getAttribute('data-col') };
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  }

  function onSeatDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const card = e.currentTarget;
    if (card.classList.contains('seat-card')) card.classList.add('drag-over');
  }

  function onSeatDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const target = e.currentTarget;
    const targetId = target.getAttribute('data-student-id');
    const targetRow = +target.getAttribute('data-row');
    const targetCol = +target.getAttribute('data-col');
    const srcId = e.dataTransfer.getData('text/plain');
    if (!srcId) return;

    if (dragSource && dragSource.type === 'seat') {
      const fromR = dragSource.row, fromC = dragSource.col;
      const toR = targetRow, toC = targetCol;
      if (fromR === toR && fromC === toC) return;
      pushHistory();
      const atFrom = state.seats[fromR] && state.seats[fromR][fromC];
      const atTo = state.seats[toR] && state.seats[toR][toC];
      state.seats[fromR][fromC] = atTo;
      state.seats[toR][toC] = atFrom;
      renderAll();
    } else if (dragSource && dragSource.type === 'unassigned') {
      pushHistory();
      state.seats[targetRow][targetCol] = srcId;
      renderAll();
    }
    dragSource = null;
  }

  function onSeatDragEnd(e) {
    e.currentTarget.classList.remove('opacity-50');
    document.querySelectorAll('.seat-card.drag-over').forEach(el => el.classList.remove('drag-over'));
    dragSource = null;
  }

  function renderUnassigned() {
    const listEl = document.getElementById('unassignedList');
    const assigned = new Set();
    state.seats.forEach(row => row.forEach(id => { if (id) assigned.add(id); }));
    const unassigned = state.students.filter(s => !assigned.has(s.id));
    document.getElementById('unassignedCount').textContent = unassigned.length;

    listEl.innerHTML = unassigned.map(s => {
      const genderClass = s.gender === '女' ? 'girl' : 'boy';
      return `<li class="seat-card ${genderClass} unassigned-item"
        data-student-id="${s.id}" draggable="true">
        <span class="sc-seat-gender">${s.gender === '女' ? '♀' : '♂'}</span>
        <span class="sc-seat-name">${escapeHtml(s.name)}</span>
      </li>`;
    }).join('');

    listEl.querySelectorAll('.unassigned-item').forEach(li => {
      li.addEventListener('click', (e) => { if (!e.target.closest('i')) openEditModal(li.getAttribute('data-student-id')); });
      li.addEventListener('dragstart', e => {
        dragSource = { type: 'unassigned', id: li.getAttribute('data-student-id') };
        e.dataTransfer.setData('text/plain', li.getAttribute('data-student-id'));
        e.dataTransfer.effectAllowed = 'move';
      });
    });

    Sortable.create(listEl, {
      group: 'seats',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd: function () {
        const order = [];
        listEl.querySelectorAll('.unassigned-item').forEach(el => order.push(el.getAttribute('data-student-id')));
      }
    });
  }

  function renderAll() {
    renderUnassigned();
    renderSeatGrid();
    document.getElementById('undoBtn').disabled = state.historyIndex <= 0;
    document.getElementById('redoBtn').disabled = state.historyIndex >= state.history.length - 1 || state.history.length === 0;
  }

  function openEditModal(studentId) {
    const s = getStudent(studentId);
    if (!s) return;
    document.getElementById('editStudentId').value = s.id;
    document.getElementById('editName').value = s.name;
    document.getElementById('editGender').value = s.gender;
    document.getElementById('editHeight').value = s.height;
    document.getElementById('editRemark').value = s.remark || '';
    document.getElementById('editModal').classList.add('is-open');
  }

  function closeEditModal() {
    document.getElementById('editModal').classList.remove('is-open');
  }

  function saveEditModal() {
    const id = document.getElementById('editStudentId').value;
    const s = getStudent(id);
    if (!s) return;
    pushHistory();
    s.name = document.getElementById('editName').value.trim() || s.name;
    s.gender = document.getElementById('editGender').value;
    s.height = document.getElementById('editHeight').value;
    s.remark = document.getElementById('editRemark').value.trim();
    closeEditModal();
    renderAll();
  }

  function openRelationModal() {
    document.getElementById('bindPairs').value = state.bindPairs.map(([a, b]) => {
      const na = getStudent(a)?.name || a;
      const nb = getStudent(b)?.name || b;
      return na + ' ' + nb;
    }).join('\n');
    document.getElementById('excludePairs').value = state.excludePairs.map(([a, b]) => {
      const na = getStudent(a)?.name || a;
      const nb = getStudent(b)?.name || b;
      return na + ' ' + nb;
    }).join('\n');
    document.getElementById('relationModal').classList.add('is-open');
  }

  function parsePairs(text) {
    const pairs = [];
    const lines = (text || '').trim().split(/\r?\n/);
    for (const line of lines) {
      const parts = line.split(/[\s,，]+/).filter(Boolean);
      if (parts.length >= 2) {
        const a = state.students.find(s => s.name === parts[0])?.id || parts[0];
        const b = state.students.find(s => s.name === parts[1])?.id || parts[1];
        if (a && b && a !== b) pairs.push([a, b]);
      }
    }
    return pairs;
  }

  function saveRelationModal() {
    state.bindPairs = parsePairs(document.getElementById('bindPairs').value);
    state.excludePairs = parsePairs(document.getElementById('excludePairs').value);
    document.getElementById('relationModal').classList.remove('is-open');
  }

  function runAutoSeat() {
    const base = document.querySelector('input[name="baseStrategy"]:checked')?.value || 'random';
    const gender = document.querySelector('input[name="genderStrategy"]:checked')?.value || 'same';
    const heightOn = document.getElementById('heightStrategy').checked;
    const heightMiddle = document.getElementById('heightMiddle').checked;
    const specialFront = document.getElementById('specialFront').checked;

    let list = state.students.slice();
    const needFrontIds = new Set();
    const needMiddleIds = new Set();
    if (specialFront) {
      list.forEach(s => {
        if (/前排|需前排|需前台|前派/i.test(s.remark)) needFrontIds.add(s.id);
        if (/中间|需中间/i.test(s.remark)) needMiddleIds.add(s.id);
      });
    }

    if (heightOn || heightMiddle) {
      const order = { '矮': 0, '中': 1, '高': 2 };
      list.sort((a, b) => order[a.height] - order[b.height]);
      if (heightMiddle) {
        const mid = Math.floor(list.length / 2);
        const left = list.slice(0, mid).reverse();
        const right = list.slice(mid);
        list = [];
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
          if (left[i]) list.push(left[i]);
          if (right[i]) list.push(right[i]);
        }
      }
    }

    if (gender === 'same') {
      const boys = list.filter(s => s.gender === '男');
      const girls = list.filter(s => s.gender === '女');
      list = [];
      const maxPairs = Math.max(Math.ceil(boys.length / 2), Math.ceil(girls.length / 2));
      for (let i = 0; i < maxPairs; i++) {
        if (boys[i * 2]) list.push(boys[i * 2]);
        if (boys[i * 2 + 1]) list.push(boys[i * 2 + 1]);
        if (girls[i * 2]) list.push(girls[i * 2]);
        if (girls[i * 2 + 1]) list.push(girls[i * 2 + 1]);
      }
    } else if (gender === 'pair') {
      const boys = list.filter(s => s.gender === '男');
      const girls = list.filter(s => s.gender === '女');
      list = [];
      for (let i = 0; i < Math.max(boys.length, girls.length); i++) {
        if (boys[i]) list.push(boys[i]);
        if (girls[i]) list.push(girls[i]);
      }
    } else if (gender === 'alternate') {
      const boys = list.filter(s => s.gender === '男');
      const girls = list.filter(s => s.gender === '女');
      list = [];
      for (let i = 0; i < Math.max(boys.length, girls.length); i++) {
        if (i % 2 === 0) {
          if (boys[i]) list.push(boys[i]);
          if (girls[i]) list.push(girls[i]);
        } else {
          if (girls[i]) list.push(girls[i]);
          if (boys[i]) list.push(boys[i]);
        }
      }
    }

    if (base === 'random') {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }

    const bindSet = new Set();
    state.bindPairs.forEach(([a, b]) => { bindSet.add(a + ',' + b); bindSet.add(b + ',' + a); });
    const excludeSet = new Set();
    state.excludePairs.forEach(([a, b]) => { excludeSet.add(a + ',' + b); excludeSet.add(b + ',' + a); });

    const { cols, rows, podium } = state.layout;
    const total = cols * rows;
    const indices = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) indices.push([r, c]);
    const frontCount = Math.min(needFrontIds.size, Math.ceil(cols * 2));
    let frontIndices;
    if (podium === 'bottom') {
      frontIndices = indices.filter(([r]) => r >= rows - 2);
    } else if (podium === 'top') {
      frontIndices = indices.filter(([r]) => r < 2);
    } else if (podium === 'left') {
      frontIndices = indices.filter(([, c]) => c < 2);
    } else {
      frontIndices = indices.filter(([, c]) => c >= cols - 2);
    }
    frontIndices = frontIndices.slice(0, Math.max(frontCount, frontIndices.length));
    const middleStart = Math.floor(indices.length / 2) - Math.floor(cols * 0.5);
    const middleIndices = indices.slice(Math.max(0, middleStart), middleStart + cols);

    const placed = new Set();
    const result = [];
    for (let r = 0; r < rows; r++) { result[r] = []; for (let c = 0; c < cols; c++) result[r][c] = null; }

    function tryPlace(sid, avoidRow, avoidCol) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (avoidRow === r && avoidCol === c) continue;
          if (result[r][c] != null) continue;
          const left = result[r]?.[c - 1], right = result[r]?.[c + 1];
          const neighborIds = [left, right].filter(Boolean);
          for (const nid of neighborIds) {
            if (excludeSet.has(sid + ',' + nid)) return null;
          }
          return [r, c];
        }
      }
      return null;
    }

    const toPlace = list.map(s => s.id);
    const bindPlaced = new Set();
    toPlace.forEach(id => {
      const buddy = state.bindPairs.find(p => (p[0] === id || p[1] === id) && (p[0] === id ? p[1] : p[0]));
      if (buddy) {
        const other = buddy[0] === id ? buddy[1] : buddy[0];
        if (toPlace.includes(other) && !bindPlaced.has(id) && !bindPlaced.has(other)) {
          const pos = tryPlace(id);
          if (pos) {
            const [r, c] = pos;
            result[r][c] = id;
            placed.add(id);
            const nextC = c + 1 < cols && result[r][c + 1] == null ? c + 1 : c - 1 >= 0 && result[r][c - 1] == null ? c - 1 : null;
            if (nextC != null) { result[r][nextC] = other; placed.add(other); bindPlaced.add(id); bindPlaced.add(other); }
          }
        }
      }
    });

    const needFrontList = toPlace.filter(id => needFrontIds.has(id) && !placed.has(id));
    needFrontList.forEach(id => {
      for (const [r, c] of frontIndices) {
        if (result[r][c] != null) continue;
        const left = result[r]?.[c - 1], right = result[r]?.[c + 1];
        const neighborIds = [left, right].filter(Boolean);
        let ok = true;
        for (const nid of neighborIds) {
          if (excludeSet.has(id + ',' + nid)) { ok = false; break; }
        }
        if (ok) { result[r][c] = id; placed.add(id); break; }
      }
    });

    const needMiddleList = toPlace.filter(id => needMiddleIds.has(id) && !placed.has(id));
    needMiddleList.forEach(id => {
      for (const [r, c] of middleIndices) {
        if (result[r][c] != null) continue;
        const left = result[r]?.[c - 1], right = result[r]?.[c + 1];
        const neighborIds = [left, right].filter(Boolean);
        let ok = true;
        for (const nid of neighborIds) {
          if (excludeSet.has(id + ',' + nid)) { ok = false; break; }
        }
        if (ok) { result[r][c] = id; placed.add(id); break; }
      }
    });

    const rest = toPlace.filter(id => !placed.has(id));
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (result[r][c] != null) continue;
        if (idx < rest.length) result[r][c] = rest[idx++];
      }
    }

    pushHistory();
    state.seats = result;
    renderAll();
  }

  function exportExcel() {
    const { cols, rows } = state.layout;
    const data = [['行', '列', '姓名', '性别', '身高', '备注']];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = state.seats[r]?.[c];
        const s = id ? getStudent(id) : null;
        data.push([r + 1, c + 1, s ? s.name : '', s ? s.gender : '', s ? s.height : '', s ? (s.remark || '') : '']);
      }
    }
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '座位表');
    XLSX.writeFile(wb, '座位表.xlsx');
  }

  function exportPdf() {
    const el = document.getElementById('seatGrid');
    if (!el) return;
    html2canvas(el, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, w - 20, (canvas.height / canvas.width) * (w - 20) * 0.3);
      const names = state.students.slice().sort((a, b) => (a.name.localeCompare(b.name, 'zh-CN')));
      let y = (canvas.height / canvas.width) * (w - 20) * 0.3 + 20;
      pdf.setFontSize(10);
      pdf.text('名单索引（按姓名排序）', 10, y);
      y += 8;
      names.forEach(s => {
        const pos = findSeatPos(s.id);
        const posStr = pos ? `第${pos.row + 1}行第${pos.col + 1}列` : '未排';
        pdf.text(`${s.name} - ${posStr}`, 10, y);
        y += 6;
        if (y > h - 15) { pdf.addPage(); y = 20; }
      });
      pdf.save('座位表.pdf');
    });
  }

  function findSeatPos(studentId) {
    for (let r = 0; r < state.seats.length; r++) {
      const c = state.seats[r]?.indexOf(studentId);
      if (c >= 0) return { row: r, col: c };
    }
    return null;
  }

  function exportImage() {
    const el = document.getElementById('seatGrid');
    if (!el) return;
    html2canvas(el, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = '座位表.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  function resetConfirm() {
    seatChartDialog({
      title: '确认重置？',
      text: '将清空当前座位表，学生将回到未排座列表',
      showCancelButton: true,
      cancelButtonText: '取消',
      confirmButtonText: '确定重置'
    }).then(function (res) {
      if (res.isConfirmed) {
        pushHistory();
        state.seats = state.seats.map(function (row) { return row.map(function () { return null; }); });
        renderAll();
        seatChartAlert('已重置');
      }
    });
  }

  function bindEvents() {
    document.getElementById('applyLayoutBtn').addEventListener('click', () => { pushHistory(); applyLayout(); });
    document.getElementById('fileInput').addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      parseExcelFile(file).then(students => {
        if (students.length) {
          pushHistory();
          const maxId = state.students.reduce((m, s) => Math.max(m, parseInt(s.id.replace(/\D/g, '') || 0)), 0);
          state.nextId = maxId + 1;
          state.students = state.students.concat(students);
          ensureSeatsSize();
          renderAll();
          seatChartAlert('导入成功', '共 ' + students.length + ' 人');
        }
        this.value = '';
      }).catch(function () { seatChartAlert('导入失败', '请检查文件格式'); });
    });
    document.getElementById('templateDownload').addEventListener('click', function (e) {
      e.preventDefault();
      const blob = createTemplateBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '学生名单模板.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById('pasteBtn').addEventListener('click', function () {
      seatChartDialog({
        title: '粘贴表格数据',
        input: 'textarea',
        inputPlaceholder: '从 Excel 复制后粘贴到这里（含表头）',
        showCancelButton: true,
        confirmButtonText: '确定导入'
      }).then(function (res) {
        if (res.isConfirmed && res.value) {
          const students = parsePasteText(res.value);
          if (students.length) {
            pushHistory();
            state.students = state.students.concat(students);
            ensureSeatsSize();
            renderAll();
            seatChartAlert('导入成功', '共 ' + students.length + ' 人');
          } else {
            seatChartAlert('未解析到有效数据', '请包含表头：姓名、性别、身高、备注');
          }
        }
      });
    });
    document.getElementById('schemeSelect').addEventListener('change', function () {
      const id = this.value;
      if (id) loadScheme(id);
    });
    document.getElementById('saveSchemeBtn').addEventListener('click', function () {
      var current = state.currentSchemeId ? getSchemeList().find(function (s) { return s.id === state.currentSchemeId; }) : null;
      seatChartDialog({
        title: '保存方案',
        input: 'text',
        inputValue: current ? current.name : '新方案',
        showCancelButton: true
      }).then(function (res) {
        if (res.isConfirmed) saveCurrentScheme(res.value || '未命名方案');
      });
    });
    document.getElementById('newSchemeBtn').addEventListener('click', () => {
      state.currentSchemeId = null;
      document.getElementById('schemeSelect').value = '';
    });
    document.getElementById('autoSeatBtn').addEventListener('click', runAutoSeat);
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('resetBtn').addEventListener('click', resetConfirm);
    document.getElementById('relationBtn').addEventListener('click', openRelationModal);
    document.getElementById('exportExcelBtn').addEventListener('click', exportExcel);
    document.getElementById('exportPdfBtn').addEventListener('click', exportPdf);
    document.getElementById('exportImageBtn').addEventListener('click', exportImage);
    document.getElementById('editModalSave').addEventListener('click', saveEditModal);
    document.getElementById('editModalCancel').addEventListener('click', closeEditModal);
    document.getElementById('relationModalSave').addEventListener('click', saveRelationModal);
    document.getElementById('relationModalCancel').addEventListener('click', function () {
      document.getElementById('relationModal').classList.remove('is-open');
    });
  }

  function init() {
    syncLayoutInputs();
    ensureSeatsSize();
    renderSchemeSelect();
    renderAll();
    bindEvents();
  }

  init();
})();
