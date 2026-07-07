import { PageBack, SiteFooter, SiteNav } from '../components/site-shell'

export function CourseSchedulePage() {
  return (
    <>
      <SiteNav current="/course-schedule" />
      <div class="cs-app">
        <header class="cs-header">
          <div>
            <PageBack label="← 首页" />
            <h1>课程表编排</h1>
          </div>
          <div class="cs-actions">
            <button type="button" class="btn btn-ghost" id="btnReset">
              重置课表
            </button>
            <button type="button" class="btn btn-primary" id="btnExport">
              导出课表
            </button>
          </div>
        </header>

        <main class="cs-main">
          <aside class="cs-sidebar">
            <div class="cs-sidebar-header">
              <h2>科目列表</h2>
              <div class="cs-add-subject">
                <input
                  type="text"
                  id="newSubject"
                  placeholder="输入新科目名称"
                  maxlength={8}
                  aria-label="新科目名称"
                />
                <button type="button" class="btn btn-primary" id="btnAddSubject">
                  添加科目
                </button>
              </div>
            </div>
            <ul class="cs-subject-list" id="subjectList">
              <li class="subject-item color-0" draggable={true} data-subject="语文">
                语文
              </li>
              <li class="subject-item color-1" draggable={true} data-subject="数学">
                数学
              </li>
              <li class="subject-item color-2" draggable={true} data-subject="英语">
                英语
              </li>
              <li class="subject-item color-3" draggable={true} data-subject="物理">
                物理
              </li>
              <li class="subject-item color-4" draggable={true} data-subject="化学">
                化学
              </li>
              <li class="subject-item color-5" draggable={true} data-subject="生物">
                生物
              </li>
              <li class="subject-item color-6" draggable={true} data-subject="历史">
                历史
              </li>
              <li class="subject-item color-7" draggable={true} data-subject="地理">
                地理
              </li>
              <li class="subject-item color-8" draggable={true} data-subject="政治">
                政治
              </li>
              <li class="subject-item color-9" draggable={true} data-subject="体育">
                体育
              </li>
              <li class="subject-item color-10" draggable={true} data-subject="音乐">
                音乐
              </li>
              <li class="subject-item color-11" draggable={true} data-subject="美术">
                美术
              </li>
            </ul>
          </aside>

          <section class="cs-schedule-wrap">
            <div class="cs-schedule-table-wrap">
              <table class="cs-schedule-table schedule-table" id="scheduleTable">
                <thead>
                  <tr>
                    <th class="th-time">时段</th>
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th>周六</th>
                    <th>周日</th>
                  </tr>
                </thead>
                <tbody id="scheduleBody">
                  <tr>
                    <td class="td-time">第1节</td>
                    <td class="cell" data-day="0" data-slot="0"></td>
                    <td class="cell" data-day="1" data-slot="0"></td>
                    <td class="cell" data-day="2" data-slot="0"></td>
                    <td class="cell" data-day="3" data-slot="0"></td>
                    <td class="cell" data-day="4" data-slot="0"></td>
                    <td class="cell" data-day="5" data-slot="0"></td>
                    <td class="cell" data-day="6" data-slot="0"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第2节</td>
                    <td class="cell" data-day="0" data-slot="1"></td>
                    <td class="cell" data-day="1" data-slot="1"></td>
                    <td class="cell" data-day="2" data-slot="1"></td>
                    <td class="cell" data-day="3" data-slot="1"></td>
                    <td class="cell" data-day="4" data-slot="1"></td>
                    <td class="cell" data-day="5" data-slot="1"></td>
                    <td class="cell" data-day="6" data-slot="1"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第3节</td>
                    <td class="cell" data-day="0" data-slot="2"></td>
                    <td class="cell" data-day="1" data-slot="2"></td>
                    <td class="cell" data-day="2" data-slot="2"></td>
                    <td class="cell" data-day="3" data-slot="2"></td>
                    <td class="cell" data-day="4" data-slot="2"></td>
                    <td class="cell" data-day="5" data-slot="2"></td>
                    <td class="cell" data-day="6" data-slot="2"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第4节</td>
                    <td class="cell" data-day="0" data-slot="3"></td>
                    <td class="cell" data-day="1" data-slot="3"></td>
                    <td class="cell" data-day="2" data-slot="3"></td>
                    <td class="cell" data-day="3" data-slot="3"></td>
                    <td class="cell" data-day="4" data-slot="3"></td>
                    <td class="cell" data-day="5" data-slot="3"></td>
                    <td class="cell" data-day="6" data-slot="3"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第5节</td>
                    <td class="cell" data-day="0" data-slot="4"></td>
                    <td class="cell" data-day="1" data-slot="4"></td>
                    <td class="cell" data-day="2" data-slot="4"></td>
                    <td class="cell" data-day="3" data-slot="4"></td>
                    <td class="cell" data-day="4" data-slot="4"></td>
                    <td class="cell" data-day="5" data-slot="4"></td>
                    <td class="cell" data-day="6" data-slot="4"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第6节</td>
                    <td class="cell" data-day="0" data-slot="5"></td>
                    <td class="cell" data-day="1" data-slot="5"></td>
                    <td class="cell" data-day="2" data-slot="5"></td>
                    <td class="cell" data-day="3" data-slot="5"></td>
                    <td class="cell" data-day="4" data-slot="5"></td>
                    <td class="cell" data-day="5" data-slot="5"></td>
                    <td class="cell" data-day="6" data-slot="5"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第7节</td>
                    <td class="cell" data-day="0" data-slot="6"></td>
                    <td class="cell" data-day="1" data-slot="6"></td>
                    <td class="cell" data-day="2" data-slot="6"></td>
                    <td class="cell" data-day="3" data-slot="6"></td>
                    <td class="cell" data-day="4" data-slot="6"></td>
                    <td class="cell" data-day="5" data-slot="6"></td>
                    <td class="cell" data-day="6" data-slot="6"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第8节</td>
                    <td class="cell" data-day="0" data-slot="7"></td>
                    <td class="cell" data-day="1" data-slot="7"></td>
                    <td class="cell" data-day="2" data-slot="7"></td>
                    <td class="cell" data-day="3" data-slot="7"></td>
                    <td class="cell" data-day="4" data-slot="7"></td>
                    <td class="cell" data-day="5" data-slot="7"></td>
                    <td class="cell" data-day="6" data-slot="7"></td>
                  </tr>
                  <tr>
                    <td class="td-time">第9节</td>
                    <td class="cell" data-day="0" data-slot="8"></td>
                    <td class="cell" data-day="1" data-slot="8"></td>
                    <td class="cell" data-day="2" data-slot="8"></td>
                    <td class="cell" data-day="3" data-slot="8"></td>
                    <td class="cell" data-day="4" data-slot="8"></td>
                    <td class="cell" data-day="5" data-slot="8"></td>
                    <td class="cell" data-day="6" data-slot="8"></td>
                  </tr>
                  <tr>
                    <td class="td-time">晚读</td>
                    <td class="cell" data-day="0" data-slot="9"></td>
                    <td class="cell" data-day="1" data-slot="9"></td>
                    <td class="cell" data-day="2" data-slot="9"></td>
                    <td class="cell" data-day="3" data-slot="9"></td>
                    <td class="cell" data-day="4" data-slot="9"></td>
                    <td class="cell" data-day="5" data-slot="9"></td>
                    <td class="cell" data-day="6" data-slot="9"></td>
                  </tr>
                  <tr>
                    <td class="td-time">晚课1</td>
                    <td class="cell" data-day="0" data-slot="10"></td>
                    <td class="cell" data-day="1" data-slot="10"></td>
                    <td class="cell" data-day="2" data-slot="10"></td>
                    <td class="cell" data-day="3" data-slot="10"></td>
                    <td class="cell" data-day="4" data-slot="10"></td>
                    <td class="cell" data-day="5" data-slot="10"></td>
                    <td class="cell" data-day="6" data-slot="10"></td>
                  </tr>
                  <tr>
                    <td class="td-time">晚课2</td>
                    <td class="cell" data-day="0" data-slot="11"></td>
                    <td class="cell" data-day="1" data-slot="11"></td>
                    <td class="cell" data-day="2" data-slot="11"></td>
                    <td class="cell" data-day="3" data-slot="11"></td>
                    <td class="cell" data-day="4" data-slot="11"></td>
                    <td class="cell" data-day="5" data-slot="11"></td>
                    <td class="cell" data-day="6" data-slot="11"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
      <script src="/static/course-schedule.js"></script>
      <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
    </>
  )
}
