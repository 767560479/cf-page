import { PageBack, SiteNav } from '../components/site-shell'

export function FamilyTreePage() {
  return (
    <>
      <SiteNav current="/family-tree" />
      <div class="ft-page">
      <header class="page-toolbar">
        <div class="page-toolbar__group">
          <PageBack label="← 首页" />
          <h1 class="page-toolbar__title">家族树</h1>
        </div>
        <div class="page-toolbar__group page-toolbar__group--focus">
          <span id="ft-focus-badge" class="ft-focus-badge" aria-live="polite">
            焦点：—
          </span>
          <label class="toolbar-field">
            <span class="visually-hidden">切换焦点</span>
            <select id="ft-focus-select" aria-label="切换焦点成员"></select>
          </label>
        </div>
        <div class="page-toolbar__group page-toolbar__group--compact">
          <label class="toolbar-field">
            <span>上</span>
            <input id="ft-gen-up" type="number" min="0" max="10" value="3" />
          </label>
          <label class="toolbar-field">
            <span>下</span>
            <input id="ft-gen-down" type="number" min="0" max="10" value="3" />
          </label>
        </div>
        <div class="page-toolbar__group page-toolbar__group--grow">
          <input id="ft-search" type="search" placeholder="搜索姓名…" class="toolbar-field" style="width:100%;max-width:200px;padding:6px 10px;border:none;border-radius:6px;box-shadow:inset 0 0 0 1px var(--color-stone-surface);background:var(--surface-white);" />
        </div>
        <div class="page-toolbar__group page-toolbar__group--compact">
          <button type="button" id="ft-edit-btn" class="btn-pill btn-pill--sand ft-edit-btn">
            编辑成员
          </button>
          <button type="button" id="ft-add-btn" class="btn-pill btn-pill--dark">
            + 添加成员
          </button>
          <button type="button" id="ft-zoom-out" class="btn-pill btn-pill--sand" title="缩小">
            −
          </button>
          <span id="ft-zoom-label" class="toolbar-field" style="min-width:44px;justify-content:center;">
            100%
          </span>
          <button type="button" id="ft-zoom-in" class="btn-pill btn-pill--sand" title="放大">
            +
          </button>
          <button type="button" id="ft-fit-btn" class="btn-pill btn-pill--sand">
            适应屏幕
          </button>
        </div>
      </header>

      <div class="split-layout">
        <div class="split-layout__main ft-canvas-wrap">
          <div id="ft-empty" class="empty-state" hidden>
            <p>还没有家族成员</p>
            <button type="button" id="ft-empty-add" class="btn-pill btn-pill--dark">
              添加第一位祖先
            </button>
          </div>
          <svg id="ft-svg" class="ft-svg" aria-label="家族树画布"></svg>
        </div>

        <div id="ft-panel-backdrop" class="ft-panel-backdrop" hidden aria-hidden="true"></div>

        <aside id="ft-panel" class="split-layout__aside">
          <div class="ft-panel-sheet-head">
            <div class="ft-panel-handle" aria-hidden="true"></div>
            <button type="button" id="ft-panel-close" class="ft-panel-close" aria-label="关闭详情">
              ×
            </button>
          </div>
          <div id="ft-panel-empty" class="panel-empty">
            <p>点击节点查看详情</p>
          </div>
          <form id="ft-detail-form" class="form" hidden>
            <div class="panel-header">
              <h2>成员详情</h2>
              <button type="button" id="ft-focus-here" class="btn-pill btn-pill--sand" style="padding:4px 10px;font-size:12px;">
                设为焦点
              </button>
            </div>
            <input type="hidden" id="ft-person-id" />
            <label>
              姓名
              <input id="ft-name" type="text" required />
            </label>
            <label>
              性别
              <select id="ft-gender">
                <option value="unknown">未知</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
            <label>
              出生
              <input id="ft-birth" type="text" placeholder="如 1990 或 1990-05" />
            </label>
            <label>
              卒年
              <input id="ft-death" type="text" placeholder="可选" />
            </label>
            <label>
              头像 URL
              <input id="ft-avatar" type="url" placeholder="https://…" />
            </label>
            <label>
              备注
              <textarea id="ft-bio" rows="3"></textarea>
            </label>

            <fieldset class="relations-fieldset">
              <legend>关系</legend>
              <label>
                父亲
                <select id="ft-father">
                  <option value="">— 无 —</option>
                </select>
              </label>
              <label>
                母亲
                <select id="ft-mother">
                  <option value="">— 无 —</option>
                </select>
              </label>
              <label>
                配偶
                <select id="ft-spouse">
                  <option value="">— 无 —</option>
                </select>
              </label>
            </fieldset>

            <div class="form-actions">
              <button type="submit" class="btn-pill btn-pill--dark">
                保存
              </button>
              <button type="button" id="ft-delete-btn" class="btn-pill btn-pill--danger">
                删除
              </button>
            </div>
            <p id="ft-panel-msg" class="form-msg" role="status"></p>
          </form>
        </aside>
      </div>
      </div>

      <dialog id="ft-add-dialog" class="dialog">
        <form id="ft-add-form" method="dialog" class="form">
          <h2 id="ft-add-dialog-title">添加成员</h2>
          <p id="ft-add-relation-hint" class="ft-add-relation-hint" hidden></p>
          <label>
            姓名
            <input id="ft-add-name" type="text" required />
          </label>
          <label>
            性别
            <select id="ft-add-gender">
              <option value="unknown">未知</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>
          <label>
            出生
            <input id="ft-add-birth" type="text" />
          </label>
          <label id="ft-add-relation-type-wrap">
            与现有成员关系
            <select id="ft-add-relation-type">
              <option value="">无（独立添加）</option>
              <option value="child">作为其子女</option>
              <option value="father">作为其父</option>
              <option value="mother">作为其母</option>
              <option value="spouse">作为其配偶</option>
            </select>
          </label>
          <label id="ft-add-related-wrap" hidden>
            关联成员
            <select id="ft-add-related"></select>
          </label>
          <div class="form-actions">
            <button type="submit" class="btn-pill btn-pill--dark">
              创建
            </button>
            <button type="button" id="ft-add-cancel" class="btn-pill btn-pill--sand">
              取消
            </button>
          </div>
          <p id="ft-add-msg" class="form-msg" role="status"></p>
        </form>
      </dialog>

      <div id="ft-context-menu" class="ft-context-menu" hidden role="menu">
        <p id="ft-context-menu-title" class="ft-context-menu__title"></p>
        <button type="button" class="ft-context-menu__item" data-action="father">
          添加父亲
        </button>
        <button type="button" class="ft-context-menu__item" data-action="mother">
          添加母亲
        </button>
        <button type="button" class="ft-context-menu__item" data-action="child">
          添加子女
        </button>
        <button type="button" class="ft-context-menu__item" data-action="spouse">
          添加配偶
        </button>
        <button type="button" class="ft-context-menu__item ft-context-menu__item--detail" data-action="detail">
          查看详情
        </button>
      </div>

      <script type="module" src="/static/family-tree.js"></script>
    </>
  )
}
