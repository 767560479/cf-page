;(() => {
  const body = document.getElementById('stele-body')
  const main = document.getElementById('stele-main')
  if (!body || !main) return

  function syncHeight() {
    const h = main.getBoundingClientRect().height
    if (h > 0) {
      body.style.setProperty('--stele-main-h', `${Math.ceil(h)}px`)
    }
  }

  syncHeight()
  if (document.fonts?.ready) {
    document.fonts.ready.then(syncHeight).catch(() => {})
  }
  window.addEventListener('resize', syncHeight)
})()
