import type { SteleData } from '../steles'

/** TS 字符串里的 &nbsp; 不会当 HTML 解析，转成全角空格便于竖排留白 */
function steleSpace(text: string) {
  return text.replace(/&nbsp;?/gi, '\u3000')
}

/** 横批逐字 + row-reverse：右起「千」，右→左读「千秋福地」 */
function HeaderBanner({ text }: { text: string }) {
  return (
    <h1 class="stele-header" lang="zh-CN" aria-label={text}>
      {[...text].map((ch, i) => (
        <span class="stele-header__char" key={`${ch}-${i}`}>
          {ch}
        </span>
      ))}
    </h1>
  )
}

export function StelePage({ stele }: { stele: SteleData }) {
  const {
    header,
    coupletRight,
    coupletLeft,
    main,
    rightText,
    leftText,
    title,
  } = stele

  return (
    <main class="stele-page">
      <div class="stele-stage">
        <div class="stele-mist" aria-hidden="true" />
        <article class="stele-stone" aria-label={title}>
          <div class="stele-stone__grain" aria-hidden="true" />

          <HeaderBanner text={header} />

          <div class="stele-body" id="stele-body">
            <p class="stele-couplet stele-couplet--right" lang="zh-CN">
              {steleSpace(coupletRight)}
            </p>

            <div class="stele-side stele-side--right" lang="zh-CN" aria-label="右侧碑文">
              {steleSpace(rightText)}
            </div>

            <p class="stele-main" id="stele-main" lang="zh-CN">
              {steleSpace(main)}
            </p>

            <div class="stele-side stele-side--left" lang="zh-CN" aria-label="左侧碑文">
              {steleSpace(leftText)}
            </div>

            <p class="stele-couplet stele-couplet--left" lang="zh-CN">
              {steleSpace(coupletLeft)}
            </p>
          </div>
        </article>
      </div>

      <script src="/static/stele.js?v=20261108b"></script>
    </main>
  )
}
