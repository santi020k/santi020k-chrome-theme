import './styles.css'

const STORAGE_KEY = 'theme'
const rootInDarkMode = () => document.documentElement.getAttribute('data-theme') === 'dark'

const setTheme = theme => {
  if (theme !== 'light' && theme !== 'dark') return

  const root = document.documentElement

  if (root.getAttribute('data-theme') === theme) return

  root.setAttribute('data-theme', theme)

  localStorage.setItem(STORAGE_KEY, theme)
}

const syncToggle = toggle => {
  if (toggle) toggle.setAttribute('aria-checked', String(rootInDarkMode()))
}

const circularReveal = (button, isDark, newTheme) => {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    setTheme(newTheme)

    return
  }

  const rect = button.getBoundingClientRect()
  const x = Math.round(rect.left + rect.width / 2)
  const y = Math.round(rect.top + rect.height / 2)

  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const overlay = document.createElement('div')

  overlay.setAttribute('aria-hidden', 'true')

  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    pointerEvents: 'none',
    backgroundColor: isDark ? '#110c1d' : '#f8f6fd',
    clipPath: `circle(${maxRadius}px at ${x}px ${y}px)`,
    willChange: 'clip-path'
  })

  document.body.appendChild(overlay)

  setTheme(newTheme)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'clip-path 580ms cubic-bezier(0.4, 0, 0.2, 1)'

      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`

      const done = () => overlay.remove()

      overlay.addEventListener('transitionend', done, { once: true })

      setTimeout(done, 750)
    })
  })
}

// ── Boot ──────────────────────────────────────────────────────────────────────
const toggle = document.querySelector('.theme-toggle')
const header = document.querySelector('.site-header')
const navToggle = document.querySelector('.nav-toggle')
const navLinks = document.querySelectorAll('.nav-links a')
const desktopNavQuery = window.matchMedia('(min-width: 941px)')

syncToggle(toggle)

const setNavOpen = isOpen => {
  if (!header || !navToggle) return

  if (isOpen) {
    header.setAttribute('data-nav-open', 'true')
  } else {
    header.removeAttribute('data-nav-open')
  }

  navToggle.setAttribute('aria-expanded', String(isOpen))
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true'

    setNavOpen(!isOpen)
  })
}

for (const link of navLinks) {
  link.addEventListener('click', () => setNavOpen(false))
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setNavOpen(false)
})

desktopNavQuery.addEventListener('change', event => {
  if (event.matches) setNavOpen(false)
})

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    setTheme(e.matches ? 'light' : 'dark')

    syncToggle(toggle)
  }
})

if (toggle) {
  let isAnimating = false

  toggle.addEventListener('click', () => {
    if (isAnimating) return

    const isDark = rootInDarkMode()
    const newTheme = isDark ? 'light' : 'dark'

    isAnimating = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(newTheme)

      syncToggle(toggle)

      isAnimating = false

      return
    }

    circularReveal(toggle, isDark, newTheme)

    syncToggle(toggle)

    setTimeout(() => { isAnimating = false }, 800)
  })
}

// Clipboard: copy the load-unpacked hint
const installBtn = document.querySelector('.button-copy-install')

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('chrome://extensions')

      const original = installBtn.innerHTML

      installBtn.innerHTML = '<span class="command">Copied chrome://extensions!</span>'

      setTimeout(() => { installBtn.innerHTML = original }, 2000)
    } catch {
      // clipboard not available — no-op
    }
  })
}
