const root = document.querySelector('[data-learn-grid]')
if (root) {
  const search = document.querySelector('[data-learn-search]')
  const filters = [...document.querySelectorAll('[data-learn-filter]')]
  const cards = [...root.querySelectorAll('.learn-card')]
  const empty = document.querySelector('[data-learn-empty]')
  const frame = document.querySelector('[data-learn-frame]')
  const now = document.querySelector('[data-learn-now]')
  const icons = [...document.querySelectorAll('[data-learn-ico]')]
  let side = 'all'

  function titleOf(card) {
    return card.querySelector('.learn-card-title')?.textContent?.trim() || ''
  }

  function markSide(kind) {
    icons.forEach((el) => {
      el.hidden = el.getAttribute('data-learn-ico') !== kind
    })
  }

  function placeholder() {
    let hold = frame?.querySelector('[data-learn-placeholder]')
    if (hold || !frame) return hold
    hold = document.createElement('div')
    hold.className = 'learn-placeholder'
    hold.setAttribute('data-learn-placeholder', '')
    hold.innerHTML = '<span class="learn-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 7.5v9l7-4.5-7-4.5z"/></svg></span>'
    frame.prepend(hold)
    return hold
  }

  function show(card) {
    if (!card || !frame) return
    cards.forEach((el) => el.classList.toggle('is-active', el === card))
    const title = titleOf(card)
    if (now) now.textContent = title
    markSide(card.dataset.side === 'windows' ? 'windows' : 'phone')
    frame.querySelector('iframe')?.remove()
    const hold = placeholder()
    const id = (card.dataset.yt || '').trim()
    if (id) {
      if (hold) hold.hidden = true
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
      iframe.title = title
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.allowFullscreen = true
      frame.append(iframe)
      return
    }
    if (hold) hold.hidden = false
  }

  function paint() {
    const q = (search?.value || '').trim().toLocaleLowerCase('tr')
    let shown = 0
    cards.forEach((card) => {
      const okSide = side === 'all' || card.dataset.side === side
      const okText = !q || titleOf(card).toLocaleLowerCase('tr').includes(q)
      const on = okSide && okText
      card.hidden = !on
      if (on) shown += 1
    })
    if (empty) empty.hidden = shown !== 0
    const active = cards.find((card) => card.classList.contains('is-active') && !card.hidden)
    if (!active) {
      const next = cards.find((card) => !card.hidden)
      if (next) show(next)
    } else if (now) {
      now.textContent = titleOf(active)
      markSide(active.dataset.side === 'windows' ? 'windows' : 'phone')
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      show(card)
      document.querySelector('[data-learn-stage]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  })

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      side = btn.getAttribute('data-learn-filter') || 'all'
      filters.forEach((el) => {
        const on = el === btn
        el.classList.toggle('is-active', on)
        el.setAttribute('aria-pressed', on ? 'true' : 'false')
      })
      paint()
    })
  })

  const all = filters.find((el) => el.getAttribute('data-learn-filter') === 'all')
  if (all) all.setAttribute('aria-pressed', 'true')

  search?.addEventListener('input', paint)
  document.addEventListener('isg:locale', paint)

  const first = cards[0]
  if (first) show(first)
}
