(function () {
  'use strict';

  let students = [];
  let availableStudents = [];
  let isRolling = false;
  let rollInterval;
  let currentName = '';
  let historyRecords = [];

  const defaultPraisePhrases = [
    '你真是个小天才！',
    '太棒了，继续加油！',
    '太厉害了，为你点赞！',
    '真聪明，一点就通！',
    '太精彩了，老师为你骄傲！',
    '你的回答太完美了！',
    '哇，你真的很用心！',
    '真不错，继续保持！',
  ];

  const defaultEncouragePhrases = [
    '没关系，下次一定可以的！',
    '别灰心，继续努力！',
    '加油，老师相信你！',
    '再试一次，你能做到的！',
    '不要放弃，你已经很接近了！',
    '每一次尝试都是进步！',
    '继续努力，你会越来越棒的！',
    '失败是成功之母，继续加油！',
  ];

  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const removeFile = document.getElementById('remove-file');
  const columnSelection = document.getElementById('column-selection');
  const columnSelect = document.getElementById('column-select');
  const confirmColumn = document.getElementById('confirm-column');
  const studentsPreview = document.getElementById('students-preview');
  const studentsList = document.getElementById('students-list');
  const studentsCount = document.getElementById('students-count');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const displayText = document.getElementById('display-text');
  const feedbackButtons = document.getElementById('feedback-buttons');
  const correctBtn = document.getElementById('correct-btn');
  const effortBtn = document.getElementById('effort-btn');
  const historyList = document.getElementById('history-list');
  const resultModal = document.getElementById('result-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const closeModal = document.getElementById('close-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettings = document.getElementById('close-settings');
  const praisePhrases = document.getElementById('praise-phrases');
  const encouragePhrases = document.getElementById('encourage-phrases');
  const saveSettings = document.getElementById('save-settings');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const shineEffect = document.getElementById('shine-effect');
  const animationContainer = document.getElementById('animation-container');

  function showToast(message, type) {
    type = type || 'info';
    toast.className = 'rc-toast rc-toast--' + type;
    toastMessage.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  function openModal(el) {
    el.classList.add('is-open');
  }

  function closeModalEl(el) {
    el.classList.remove('is-open');
  }

  uploadArea.addEventListener('click', function () {
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('is-dragover');
  });

  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('is-dragover');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('is-dragover');
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  function handleFile(file) {
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      !file.name.endsWith('.xlsx')
    ) {
      showToast('请上传 .xlsx 格式的 Excel 文件', 'error');
      return;
    }

    fileName.textContent = file.name;
    fileInfo.classList.remove('is-hidden');

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        columnSelect.innerHTML = '';

        if (jsonData.length > 0) {
          const headerRow = jsonData[0];
          headerRow.forEach(function (header, index) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = header || '第' + (index + 1) + '列';
            columnSelect.appendChild(option);
          });
          columnSelection.classList.remove('is-hidden');
          showToast('文件解析成功，请选择姓名列', 'success');
        } else {
          showToast('Excel 文件中没有数据', 'error');
        }
      } catch (error) {
        console.error('解析文件出错:', error);
        showToast('文件解析失败，请检查文件格式', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  removeFile.addEventListener('click', function () {
    fileInput.value = '';
    fileInfo.classList.add('is-hidden');
    columnSelection.classList.add('is-hidden');
    studentsPreview.classList.add('is-hidden');
    students = [];
    availableStudents = [];
    startBtn.disabled = true;
    displayText.textContent = '请先导入学生名单';
    showToast('已移除文件', 'info');
  });

  confirmColumn.addEventListener('click', function () {
    const columnIndex = parseInt(columnSelect.value, 10);
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        students = [];
        for (let i = 1; i < jsonData.length; i++) {
          const name = jsonData[i][columnIndex];
          if (name && typeof name === 'string' && name.trim() !== '') {
            students.push(name.trim());
          }
        }

        if (students.length === 0) {
          showToast('未找到有效的学生姓名', 'error');
          return;
        }

        availableStudents = students.slice();
        displayStudentPreview();
        startBtn.disabled = false;
        displayText.textContent = '点击开始按钮进行点名';
        showToast('成功导入 ' + students.length + ' 名学生', 'success');
      } catch (error) {
        console.error('导入学生出错:', error);
        showToast('导入学生失败', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  });

  function displayStudentPreview() {
    studentsList.innerHTML = '';
    students.forEach(function (name) {
      const tag = document.createElement('span');
      tag.className = 'rc-student-tag';
      tag.textContent = name;
      studentsList.appendChild(tag);
    });
    studentsCount.textContent = '(' + students.length + ' 名学生)';
    studentsPreview.classList.remove('is-hidden');
  }

  startBtn.addEventListener('click', function () {
    if (availableStudents.length === 0) {
      availableStudents = students.slice();
      showToast('所有学生已点过一轮，已重置名单', 'info');
    }

    isRolling = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    feedbackButtons.classList.add('is-hidden');

    let lastIndex = -1;
    rollInterval = setInterval(function () {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * availableStudents.length);
      } while (randomIndex === lastIndex && availableStudents.length > 1);

      lastIndex = randomIndex;
      currentName = availableStudents[randomIndex];
      displayText.textContent = currentName;
      displayText.style.transition = 'transform 0.1s';
      displayText.style.transform = 'scale(1.05) rotate(1deg)';
      setTimeout(function () {
        displayText.style.transform = 'scale(1) rotate(0)';
      }, 50);
    }, 80);
  });

  stopBtn.addEventListener('click', function () {
    if (!isRolling) return;

    clearInterval(rollInterval);
    isRolling = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    feedbackButtons.classList.remove('is-hidden');

    displayText.style.transition = 'all 0.5s';
    displayText.style.transform = 'scale(1.15)';

    shineEffect.style.opacity = '1';
    shineEffect.style.transform = 'rotate(45deg) translateX(200%)';

    setTimeout(function () {
      displayText.style.transform = 'scale(1)';
      shineEffect.style.opacity = '0';
      shineEffect.style.transform = 'rotate(45deg) translateX(-100%)';
    }, 500);

    availableStudents = availableStudents.filter(function (name) {
      return name !== currentName;
    });
  });

  correctBtn.addEventListener('click', function () {
    const phrases = getPraisePhrases();
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    addHistoryRecord(currentName, 'correct', randomPhrase);
    showResultModal('太棒了！', currentName, randomPhrase, 'success');
    createConfetti(60);
    feedbackButtons.classList.add('is-hidden');
  });

  effortBtn.addEventListener('click', function () {
    const phrases = getEncouragePhrases();
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    addHistoryRecord(currentName, 'effort', randomPhrase);
    showResultModal('继续加油！', currentName, randomPhrase, 'effort');
    createHearts(12);
    feedbackButtons.classList.add('is-hidden');
  });

  function addHistoryRecord(name, type, message) {
    const now = new Date();
    const timeStr =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0');

    historyRecords.unshift({
      name: name,
      type: type,
      message: message,
      time: timeStr,
      timestamp: now.getTime(),
    });
    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (historyRecords.length === 0) {
      historyList.innerHTML =
        '<div class="rc-history-empty">还没有点名记录</div>';
      return;
    }

    historyList.innerHTML = '';
    historyRecords.forEach(function (record, index) {
      const recordEl = document.createElement('div');
      recordEl.className =
        'rc-history-item rc-history-item--' +
        record.type +
        (index === 0 ? ' is-latest' : '');

      const typeText = record.type === 'correct' ? '回答正确' : '继续努力';
      const badgeClass =
        record.type === 'correct'
          ? 'rc-history-badge--correct'
          : 'rc-history-badge--effort';

      recordEl.innerHTML =
        '<div class="rc-history-item__head">' +
        '<div><div class="rc-history-item__name">' +
        record.name +
        '</div>' +
        '<div class="rc-history-item__msg">' +
        record.message +
        '</div></div>' +
        '<div><span class="rc-history-badge ' +
        badgeClass +
        '">' +
        typeText +
        '</span>' +
        '<div class="rc-history-time">' +
        record.time +
        '</div></div></div>';

      historyList.appendChild(recordEl);
    });
  }

  function showResultModal(title, name, message, type) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = '<strong>' + name + '</strong>，' + message;
    modalIcon.textContent = type === 'success' ? '★' : '♥';
    modalIcon.className =
      'rc-modal__icon ' +
      (type === 'success' ? 'rc-modal__icon--success' : 'rc-modal__icon--effort');
    openModal(resultModal);
  }

  closeModal.addEventListener('click', function () {
    closeModalEl(resultModal);
  });

  settingsBtn.addEventListener('click', function () {
    openModal(settingsModal);
  });

  closeSettings.addEventListener('click', function () {
    closeModalEl(settingsModal);
  });

  saveSettings.addEventListener('click', function () {
    const praiseText = praisePhrases.value.trim();
    const encourageText = encouragePhrases.value.trim();

    if (praiseText) localStorage.setItem('praisePhrases', praiseText);
    else localStorage.removeItem('praisePhrases');

    if (encourageText) localStorage.setItem('encouragePhrases', encourageText);
    else localStorage.removeItem('encouragePhrases');

    showToast('设置已保存', 'success');
    closeModalEl(settingsModal);
  });

  function loadSettings() {
    const savedPraise = localStorage.getItem('praisePhrases');
    const savedEncourage = localStorage.getItem('encouragePhrases');
    praisePhrases.value = savedPraise || defaultPraisePhrases.join('\n');
    encouragePhrases.value = savedEncourage || defaultEncouragePhrases.join('\n');
  }

  function getPraisePhrases() {
    const saved = localStorage.getItem('praisePhrases');
    return saved
      ? saved.split('\n').filter(function (p) {
          return p.trim();
        })
      : defaultPraisePhrases;
  }

  function getEncouragePhrases() {
    const saved = localStorage.getItem('encouragePhrases');
    return saved
      ? saved.split('\n').filter(function (p) {
          return p.trim();
        })
      : defaultEncouragePhrases;
  }

  const particleColors = ['#6366f1', '#02b8cc', '#27a644', '#8b5cf6', '#e4f222', '#d0d6e0'];

  function createConfetti(count) {
    animationContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const left = Math.random() * 100;
      const rotation = Math.random() * 360;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 1.5;

      confetti.className = 'rc-particle';
      confetti.style.cssText =
        'left:' +
        left +
        '%;top:-10px;width:' +
        size +
        'px;height:' +
        size +
        'px;background-color:' +
        color +
        ';transform:rotate(' +
        rotation +
        'deg);animation:rc-confetti ' +
        duration +
        's ease-in forwards;animation-delay:' +
        delay +
        's;';
      animationContainer.appendChild(confetti);
    }
  }

  function createHearts(count) {
    animationContainer.innerHTML = '';
    const heartColors = ['#eb5757', '#8b5cf6', '#6366f1', '#02b8cc'];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      const size = Math.random() * 20 + 16;
      const color = heartColors[Math.floor(Math.random() * heartColors.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 5 + 3;
      const delay = Math.random() * 1.5;
      const rotation = (Math.random() - 0.5) * 30;

      heart.className = 'rc-particle';
      heart.textContent = '♥';
      heart.style.cssText =
        'left:' +
        left +
        '%;bottom:-30px;font-size:' +
        size +
        'px;color:' +
        color +
        ';transform:rotate(' +
        rotation +
        'deg);animation:rc-float-up ' +
        duration +
        's ease-in forwards;animation-delay:' +
        delay +
        's;opacity:0.7;';
      animationContainer.appendChild(heart);
    }
  }

  loadSettings();
  startBtn.disabled = true;
  stopBtn.disabled = true;
})();
