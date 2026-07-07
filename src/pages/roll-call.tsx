import { PageBack, SiteFooter, SiteNav } from '../components/site-shell'

export function RollCallPage() {
  return (
    <>
      <SiteNav current="/roll-call" />
      <div class="rc-page">
        <header class="rc-page-header">
          <div>
            <PageBack label="← 首页" />
            <h1>课堂点名</h1>
          </div>
          <button type="button" class="btn btn-ghost" id="settings-btn" aria-label="设置">
            设置
          </button>
        </header>

        <div id="toast" class="rc-toast rc-toast--info">
          <span id="toast-message"></span>
        </div>

        <section class="panel rc-section">
          <h2>导入学生名单</h2>
          <div id="upload-area" class="rc-upload-area">
            <div class="rc-upload-icon" aria-hidden="true">
              📁
            </div>
            <p>拖放 Excel 文件到这里，或点击选择文件</p>
            <p class="rc-upload-hint">支持 .xlsx 格式</p>
            <input type="file" id="file-input" accept=".xlsx" class="visually-hidden" />
          </div>

          <div id="file-info" class="rc-file-info is-hidden">
            <div class="rc-file-row">
              <span id="file-name" class="rc-file-name"></span>
              <button type="button" id="remove-file" class="rc-remove-file" aria-label="移除文件">
                ×
              </button>
            </div>
            <div id="column-selection" class="rc-column-selection is-hidden">
              <label htmlFor="column-select">请选择包含学生姓名的列：</label>
              <select id="column-select"></select>
              <button type="button" class="btn btn-primary" id="confirm-column">
                确认导入
              </button>
            </div>
          </div>

          <div id="students-preview" class="rc-students-preview is-hidden">
            <h3>
              学生名单预览 <span id="students-count"></span>
            </h3>
            <div class="rc-students-list-wrap">
              <div id="students-list" class="rc-students-list"></div>
            </div>
          </div>
        </section>

        <section class="panel rc-section">
          <h2>随机点名</h2>
          <div id="name-display" class="rc-name-display">
            <p id="display-text" class="rc-display-text">
              请先导入学生名单
            </p>
            <p class="rc-display-hint">点击下方按钮开始随机点名</p>
            <div id="shine-effect" class="rc-shine-effect"></div>
          </div>
          <div class="rc-controls">
            <button type="button" class="btn btn-primary" id="start-btn">
              开始
            </button>
            <button type="button" class="btn btn-ghost rc-btn-stop" id="stop-btn" disabled>
              停止
            </button>
          </div>
          <div id="feedback-buttons" class="rc-feedback-buttons is-hidden">
            <button type="button" class="btn rc-btn-correct" id="correct-btn">
              回答正确
            </button>
            <button type="button" class="btn rc-btn-effort" id="effort-btn">
              需要努力
            </button>
          </div>
        </section>

        <section class="panel rc-section">
          <h2>今日英雄榜</h2>
          <div id="history-list" class="rc-history-list">
            <div class="rc-history-empty">还没有点名记录</div>
          </div>
        </section>
      </div>

      <div id="result-modal" class="rc-modal-overlay">
        <div class="rc-modal">
          <div id="modal-icon" class="rc-modal__icon"></div>
          <h3 id="modal-title" class="rc-modal__title"></h3>
          <p id="modal-message" class="rc-modal__message"></p>
          <div class="rc-modal-actions">
            <button type="button" class="btn btn-primary" id="close-modal">
              确定
            </button>
          </div>
        </div>
      </div>

      <div id="settings-modal" class="rc-modal-overlay">
        <div class="rc-modal rc-modal--wide">
          <div class="rc-modal__head">
            <h3>个性化设置</h3>
            <button type="button" class="rc-modal-close" id="close-settings" aria-label="关闭">
              ×
            </button>
          </div>
          <div class="rc-settings-group">
            <h4>表扬语录（回答正确时显示）</h4>
            <textarea id="praise-phrases" placeholder="每行输入一条表扬语…"></textarea>
            <p class="rc-settings-hint">每行一条，随机显示</p>
          </div>
          <div class="rc-settings-group">
            <h4>鼓励语录（需要努力时显示）</h4>
            <textarea id="encourage-phrases" placeholder="每行输入一条鼓励语…"></textarea>
            <p class="rc-settings-hint">每行一条，随机显示</p>
          </div>
          <button type="button" class="btn btn-primary btn-full" id="save-settings">
            保存设置
          </button>
        </div>
      </div>

      <div id="animation-container"></div>
      <SiteFooter />
      <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
      <script src="/static/roll-call.js"></script>
    </>
  )
}
