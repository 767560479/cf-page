(function () {
  const STORAGE_KEY = 'course-schedule-data';
  const SUBJECTS_KEY = 'course-subjects-list';
  const COLOR_COUNT = 16;

  const DEFAULT_SUBJECT_ORDER = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '体育', '音乐', '美术'];

  let subjectListEl;
  let scheduleBodyEl;
  let btnReset;
  let btnExport;
  let btnAddSubject;
  let newSubjectInput;

  function getSubjectColorIndex(name) {
    const idx = DEFAULT_SUBJECT_ORDER.indexOf(name);
    if (idx >= 0) return idx % COLOR_COUNT;
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    return Math.abs(hash) % COLOR_COUNT;
  }

  function applyColorToSubjectItem(li) {
    var name = li.dataset.subject || li.textContent.trim();
    var idx = getSubjectColorIndex(name);
    li.classList.remove.apply(
      li.classList,
      Array.from({ length: COLOR_COUNT }, function (_, i) {
        return 'color-' + i;
      })
    );
    li.classList.add('color-' + idx);
  }

  function getCells() {
    const cells = [];
    scheduleBodyEl.querySelectorAll('.cell').forEach(function (td) {
      const day = parseInt(td.dataset.day, 10);
      const slot = parseInt(td.dataset.slot, 10);
      cells.push({ el: td, day, slot });
    });
    return cells;
  }

  function getScheduleData() {
    const data = {};
    getCells().forEach(function (c) {
      const tag = c.el.querySelector('.course-tag');
      if (tag) data[c.day + '-' + c.slot] = tag.dataset.subject;
    });
    return data;
  }

  function createCourseTag(subject, day, slot) {
    const span = document.createElement('span');
    span.className = 'course-tag color-' + getSubjectColorIndex(subject);
    span.dataset.subject = subject;

    const label = document.createElement('span');
    label.className = 'course-tag__label';
    label.textContent = subject;
    span.appendChild(label);

    const remove = document.createElement('span');
    remove.className = 'remove';
    remove.textContent = '×';
    remove.title = '移除';
    remove.addEventListener('click', function (e) {
      e.stopPropagation();
      setCell(day, slot, '');
      save();
    });
    span.appendChild(remove);
    return span;
  }

  function renderSchedule(data) {
    getCells().forEach(function (c) {
      const key = c.day + '-' + c.slot;
      const subject = (data && data[key]) || '';
      c.el.classList.remove('empty-hint');
      c.el.innerHTML = '';
      if (subject) {
        c.el.appendChild(createCourseTag(subject, c.day, c.slot));
      } else {
        c.el.classList.add('empty-hint');
      }
    });
  }

  function setCell(day, slot, subject) {
    const data = getScheduleData();
    const key = day + '-' + slot;
    if (subject) data[key] = subject;
    else delete data[key];
    renderSchedule(data);
  }

  function save() {
    const data = getScheduleData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('保存课表失败', e);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      renderSchedule(data);
    } catch (e) {
      console.warn('读取课表失败', e);
      renderSchedule({});
    }
  }

  function getSubjectNames() {
    return Array.from(subjectListEl.querySelectorAll('.subject-item')).map(function (li) {
      return li.dataset.subject || li.textContent.trim();
    });
  }

  function saveSubjects() {
    try {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(getSubjectNames()));
    } catch (e) {
      console.warn('保存科目列表失败', e);
    }
  }

  function loadSubjects() {
    try {
      const raw = localStorage.getItem(SUBJECTS_KEY);
      const names = raw ? JSON.parse(raw) : null;
      if (names && Array.isArray(names) && names.length > 0) {
        subjectListEl.innerHTML = '';
        names.forEach(function (name) {
          addSubjectToList(name);
        });
      }
    } catch (e) {
      console.warn('读取科目列表失败', e);
    }
  }

  function addSubjectToList(name) {
    name = (name || '').trim();
    if (!name) return;
    const li = document.createElement('li');
    li.className = 'subject-item';
    li.draggable = true;
    li.dataset.subject = name;
    li.textContent = name;
    applyColorToSubjectItem(li);
    li.addEventListener('dragstart', onSubjectDragStart);
    li.addEventListener('dragend', onSubjectDragEnd);
    subjectListEl.appendChild(li);
  }

  let draggedSubject = null;

  function getSubjectItemFromEvent(e) {
    return e.currentTarget && e.currentTarget.classList.contains('subject-item')
      ? e.currentTarget
      : e.target.closest('.subject-item');
  }

  function onSubjectDragStart(e) {
    const item = getSubjectItemFromEvent(e);
    if (!item) return;
    draggedSubject = item.dataset.subject || item.textContent.trim();
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', draggedSubject);
    e.dataTransfer.setData('application/x-subject', draggedSubject);
  }

  function onSubjectDragEnd(e) {
    const item = getSubjectItemFromEvent(e);
    if (item) item.classList.remove('dragging');
    draggedSubject = null;
    document.querySelectorAll('.cell.drag-over').forEach(function (c) {
      c.classList.remove('drag-over');
    });
  }

  function bindSubjectDragEvents() {
    subjectListEl.querySelectorAll('.subject-item').forEach(function (li) {
      li.addEventListener('dragstart', onSubjectDragStart);
      li.addEventListener('dragend', onSubjectDragEnd);
    });
  }

  function init() {
    subjectListEl = document.getElementById('subjectList');
    scheduleBodyEl = document.getElementById('scheduleBody');
    btnReset = document.getElementById('btnReset');
    btnExport = document.getElementById('btnExport');
    btnAddSubject = document.getElementById('btnAddSubject');
    newSubjectInput = document.getElementById('newSubject');

    if (!subjectListEl || !scheduleBodyEl) {
      console.error('课程表：缺少必要的 DOM 元素');
      return;
    }

    scheduleBodyEl.addEventListener('dragover', function (e) {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      document.querySelectorAll('.cell.drag-over').forEach(function (c) {
        if (c !== cell) c.classList.remove('drag-over');
      });
      cell.classList.add('drag-over');
    });

    scheduleBodyEl.addEventListener('dragleave', function (e) {
      if (!e.target.closest('.cs-schedule-table')) return;
      const cell = e.target.closest('.cell');
      if (cell && !cell.contains(e.relatedTarget)) {
        cell.classList.remove('drag-over');
      }
    });

    scheduleBodyEl.addEventListener('drop', function (e) {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      e.preventDefault();
      cell.classList.remove('drag-over');
      const subject =
        e.dataTransfer.getData('application/x-subject') ||
        e.dataTransfer.getData('text/plain') ||
        draggedSubject;
      if (!subject) return;
      const day = parseInt(cell.dataset.day, 10);
      const slot = parseInt(cell.dataset.slot, 10);
      setCell(day, slot, subject);
      save();
    });

    bindSubjectDragEvents();

    if (btnAddSubject && newSubjectInput) {
      btnAddSubject.addEventListener('click', function () {
        const name = newSubjectInput.value.trim();
        if (!name) return;
        addSubjectToList(name);
        newSubjectInput.value = '';
        saveSubjects();
      });

      newSubjectInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btnAddSubject.click();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (!confirm('确定要清空整个课表吗？')) return;
        renderSchedule({});
        save();
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', exportToExcel);
    }

    loadSubjects();
    load();

    subjectListEl.querySelectorAll('.subject-item').forEach(applyColorToSubjectItem);

    getCells().forEach(function (c) {
      if (!c.el.querySelector('.course-tag')) c.el.classList.add('empty-hint');
    });
  }

  const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const SLOT_NAMES = ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节', '第9节', '晚读', '晚课1', '晚课2'];

  function exportToExcel() {
    if (typeof XLSX === 'undefined') {
      alert('请确保已加载 SheetJS 库，无法导出 Excel。');
      return;
    }
    const data = getScheduleData();
    const rows = [['时段', ...DAY_NAMES]];
    for (var slot = 0; slot < 12; slot++) {
      var row = [SLOT_NAMES[slot]];
      for (var day = 0; day < 7; day++) {
        row.push(data[day + '-' + slot] || '');
      }
      rows.push(row);
    }
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var colWidths = [{ wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    ws['!cols'] = colWidths;
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '课程表');
    var fileName = '课程表_' + new Date().toISOString().slice(0, 10) + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
