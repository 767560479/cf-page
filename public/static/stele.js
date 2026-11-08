;(() => {
  const body = document.getElementById('stele-body')
  const main = document.getElementById('stele-main')
  if (!body || !main) return

  const sides = body.querySelectorAll('.stele-side')
  const couplets = body.querySelectorAll('.stele-couplet')
  let scheduled = false

  function measureMainHeight() {
    // 竖排在部分移动浏览器上 getBoundingClientRect 偶发偏小，多取几种值
    const rect = main.getBoundingClientRect().height
    const offset = main.offsetHeight
    const scroll = main.scrollHeight
    return Math.max(rect, offset, scroll)
  }

  function syncHeight() {
    void main.offsetHeight
    const h = measureMainHeight()
    if (h < 8) return false

    const style = getComputedStyle(main)
    const fontSize = Number.parseFloat(style.fontSize) || 0
    const letterSpacing = Number.parseFloat(style.letterSpacing) || 0
    // 竖排下一字约占：字号 + 字距
    const raise = Math.max(fontSize + letterSpacing, fontSize * 1.1)
    const sideH = Math.max(0, Math.round(h - raise))
    const mainH = Math.round(h)

    body.style.setProperty('--stele-main-h', `${mainH}px`)
    body.style.setProperty('--stele-side-h', `${sideH}px`)

    // 直接写 style，避免部分移动端 CSS 变量 + writing-mode 不同步
    sides.forEach((el) => {
      el.style.height = `${sideH}px`
      el.style.maxHeight = `${sideH}px`
    })

    // flex + writing-mode 下 align-self:center 在 iOS 常失效；用底对齐 + margin 居中
    couplets.forEach((el) => {
      const ch = Math.max(
        el.getBoundingClientRect().height,
        el.offsetHeight,
        el.scrollHeight
      )
      const lift = Math.max(0, (mainH - ch) / 2)
      el.style.marginBottom = `${lift}px`
      el.style.alignSelf = 'flex-end'
    })

    return true
  }

  function schedule() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scheduled = false
        syncHeight()
      })
    })
  }

  schedule()

  if (document.fonts?.ready) {
    document.fonts.ready.then(schedule).catch(() => {})
  }

  window.addEventListener('resize', schedule)
  window.visualViewport?.addEventListener('resize', schedule)
  window.addEventListener('orientationchange', () => setTimeout(schedule, 50))
  window.addEventListener('load', schedule)

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(schedule)
    ro.observe(main)
    sides.forEach((el) => ro.observe(el))
  }

  // 移动端字体/竖排晚布局再补几枪
  ;[50, 150, 400, 1000, 2000].forEach((ms) => setTimeout(schedule, ms))
})()
