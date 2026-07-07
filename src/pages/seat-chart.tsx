import { PageBack, SiteFooter, SiteNav } from '../components/site-shell'

export function SeatChartPage() {
  return (
    <>
      <SiteNav current="/seat-chart" />
      <div class="sc-page">
        <header class="sc-page-header">
          <PageBack label="← 首页" />
          <h1>学生智能排座</h1>
          <p>纯前端运行 · 数据本地存储 · 支持 Excel 导入导出</p>
        </header>

        <section class="panel sc-panel">
          <h2>方案与布局</h2>
          <div class="sc-toolbar">
            <div class="sc-field">
              <label htmlFor="schemeSelect">当前方案</label>
              <div class="sc-scheme-row">
                <select id="schemeSelect">
                  <option value="">-- 选择或新建 --</option>
                </select>
                <button type="button" id="saveSchemeBtn" class="btn btn-ghost">
                  保存
                </button>
                <button type="button" id="newSchemeBtn" class="btn btn-ghost">
                  新建
                </button>
              </div>
            </div>
            <div class="sc-field">
              <label htmlFor="colCount">列数</label>
              <input type="number" id="colCount" min={2} max={12} value={8} />
            </div>
            <div class="sc-field">
              <label htmlFor="rowCount">行数</label>
              <input type="number" id="rowCount" min={1} max={20} value={6} />
            </div>
            <div class="sc-field">
              <label htmlFor="podiumPos">讲台位置</label>
              <select id="podiumPos">
                <option value="bottom">下</option>
                <option value="top">上</option>
                <option value="left">左</option>
                <option value="right">右</option>
              </select>
            </div>
            <div class="sc-field">
              <label htmlFor="aisleCol">过道列</label>
              <input
                type="text"
                id="aisleCol"
                placeholder="2,4,6"
                defaultValue="2,4,6"
                title="过道在指定列右侧，多列用逗号分隔"
              />
            </div>
            <button type="button" id="applyLayoutBtn" class="btn btn-primary">
              应用布局
            </button>
          </div>
        </section>

        <section class="panel sc-panel">
          <h2>数据导入</h2>
          <div class="sc-import-row">
            <label class="btn btn-ghost">
              选择 Excel/CSV
              <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" class="visually-hidden" />
            </label>
            <a id="templateDownload" href="#" class="btn btn-ghost">
              下载模板
            </a>
            <button type="button" id="pasteBtn" class="btn btn-ghost">
              从剪贴板粘贴
            </button>
          </div>
          <p class="sc-hint">模板需包含列：姓名、性别、身高(高/中/矮)、备注</p>
        </section>

        <section class="panel sc-panel">
          <h2>排座策略与操作</h2>
          <div class="sc-strategy-grid">
            <div class="sc-strategy-group">
              <span>基础</span>
              <label>
                <input type="radio" name="baseStrategy" value="random" defaultChecked /> 完全随机
              </label>
              <label>
                <input type="radio" name="baseStrategy" value="order" /> 按名单顺序
              </label>
            </div>
            <div class="sc-strategy-group">
              <span>性别</span>
              <label>
                <input type="radio" name="genderStrategy" value="same" defaultChecked /> 同性同桌
              </label>
              <label>
                <input type="radio" name="genderStrategy" value="pair" /> 男女搭配
              </label>
              <label>
                <input type="radio" name="genderStrategy" value="alternate" /> 男女间隔
              </label>
            </div>
            <div class="sc-strategy-group">
              <span>身高</span>
              <label>
                <input type="checkbox" id="heightStrategy" /> 前矮后高
              </label>
              <label>
                <input type="checkbox" id="heightMiddle" /> 中间矮两边高
              </label>
            </div>
            <div class="sc-strategy-group">
              <span>特殊</span>
              <label>
                <input type="checkbox" id="specialFront" defaultChecked /> 需前排/需中间优先
              </label>
            </div>
          </div>
          <div class="sc-actions">
            <button type="button" id="autoSeatBtn" class="btn btn-primary">
              一键排座
            </button>
            <button type="button" id="undoBtn" class="btn btn-ghost" title="上一步">
              撤销
            </button>
            <button type="button" id="redoBtn" class="btn btn-ghost" title="下一步">
              重做
            </button>
            <button type="button" id="resetBtn" class="btn btn-ghost">
              一键重置
            </button>
            <button type="button" id="relationBtn" class="btn btn-ghost">
              同桌关系
            </button>
          </div>
        </section>

        <section class="panel sc-panel">
          <h2>导出与分享</h2>
          <div class="sc-actions" style="margin-top: 0;">
            <button type="button" id="exportExcelBtn" class="btn btn-ghost">
              导出 Excel
            </button>
            <button type="button" id="exportPdfBtn" class="btn btn-ghost">
              导出 PDF
            </button>
            <button type="button" id="exportImageBtn" class="btn btn-ghost">
              导出图片
            </button>
          </div>
        </section>

        <div class="sc-main-grid">
          <div class="panel sc-unassigned-panel">
            <h3>
              未排座 (<span id="unassignedCount">0</span>)
            </h3>
            <ul id="unassignedList" class="sc-unassigned-list"></ul>
          </div>
          <div class="panel">
            <h2>座位表</h2>
            <div id="classroomWrap" class="sc-classroom-wrap">
              <div id="seatGrid"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="editModal" class="sc-modal-overlay">
        <div class="sc-modal">
          <h3>编辑学生</h3>
          <input type="hidden" id="editStudentId" />
          <div class="sc-form-stack">
            <div>
              <label htmlFor="editName">姓名</label>
              <input type="text" id="editName" />
            </div>
            <div>
              <label htmlFor="editGender">性别</label>
              <select id="editGender">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div>
              <label htmlFor="editHeight">身高</label>
              <select id="editHeight">
                <option value="矮">矮</option>
                <option value="中">中</option>
                <option value="高">高</option>
              </select>
            </div>
            <div>
              <label htmlFor="editRemark">备注/特殊需求</label>
              <input type="text" id="editRemark" placeholder="如：需前排、近视、高个子" />
            </div>
          </div>
          <div class="sc-modal-actions">
            <button type="button" id="editModalSave" class="btn btn-primary">
              保存
            </button>
            <button type="button" id="editModalCancel" class="btn btn-ghost">
              取消
            </button>
          </div>
        </div>
      </div>

      <div id="relationModal" class="sc-modal-overlay">
        <div class="sc-modal sc-modal--wide">
          <h3>同桌关系（绑定/互斥）</h3>
          <p class="sc-hint">绑定：必须同桌；互斥：禁止同桌。每行一对，用空格或逗号分隔</p>
          <div>
            <label htmlFor="bindPairs">必须同桌（白名单）</label>
            <textarea id="bindPairs" rows={4} placeholder="张三 李四"></textarea>
          </div>
          <div>
            <label htmlFor="excludePairs">禁止同桌（黑名单）</label>
            <textarea id="excludePairs" rows={4} placeholder="小明 小红"></textarea>
          </div>
          <div class="sc-modal-actions">
            <button type="button" id="relationModalSave" class="btn btn-primary">
              保存
            </button>
            <button type="button" id="relationModalCancel" class="btn btn-ghost">
              取消
            </button>
          </div>
        </div>
      </div>

      <div id="sc-dialog-overlay" class="sc-modal-overlay">
        <div class="sc-modal">
          <h3 id="sc-dialog-title"></h3>
          <p id="sc-dialog-text"></p>
          <input type="text" id="sc-dialog-input" />
          <textarea id="sc-dialog-textarea"></textarea>
          <div id="sc-dialog-actions"></div>
        </div>
      </div>

      <SiteFooter />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="/static/seat-chart.js"></script>
    </>
  )
}
