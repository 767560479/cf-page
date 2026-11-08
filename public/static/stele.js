;(() => {
  const body = document.getElementById('stele-body')
  const main = document.getElementById('stele-main')
  if (!body || !main) return

  function syncHeight() {
    const h = main.getBoundingClientRect().height
    if (h <= 0) return

    const style = getComputedStyle(main)
    const fontSize = Number.parseFloat(style.fontSize) || 0
    const letterSpacing = Number.parseFloat(style.letterSpacing) || 0
    // 竖排下一字约占：字号 + 字距
    const raise = fontSize + letterSpacing

    body.style.setProperty('--stele-main-h', `${Math.round(h)}px`)
    body.style.setProperty(
      '--stele-side-h',
      `${Math.max(0, Math.round(h - raise))}px`
    )
  }

  syncHeight()
  if (document.fonts?.ready) {
    document.fonts.ready.then(syncHeight).catch(() => {})
  }
  window.addEventListener('resize', syncHeight)
})()
