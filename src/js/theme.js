const KEY = 'ak_theme';

// THEME[D] / THEME[L] toggle in the nav. Persisted per visitor.
// Fires 'themechange' so canvas-drawn visuals can re-read tokens.
export function restoreTheme() {
  if (localStorage.getItem(KEY) === 'light') {
    document.documentElement.dataset.theme = 'light';
  }
}

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const apply = (theme) => {
    if (theme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }
    btn.textContent = theme === 'light' ? 'theme[l]' : 'theme[d]';
    btn.dataset.text = btn.textContent; // keep the scramble effect in sync
    window.dispatchEvent(new CustomEvent('themechange'));
  };

  btn.addEventListener('click', () => {
    const next =
      document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    apply(next);
  });

  apply(localStorage.getItem(KEY) === 'light' ? 'light' : 'dark');
}
