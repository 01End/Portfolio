// HUD instrument layer — live clock + location bottom-left, cursor
// coordinates bottom-center — plus the blueprint grid overlay with
// crosshair marks at line intersections.

const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0');

export function initHud(site) {
  const clock = document.getElementById('hud-clock');
  const coords = document.getElementById('hud-coords');

  // --- live clock in Ahmed's timezone ------------------------------
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: site.timeZone || 'Africa/Cairo',
  });
  const tick = () => {
    clock.textContent = `${site.hudLocation || 'gmt+2 eg'} ${fmt.format(new Date())}`;
  };
  tick();
  setInterval(tick, 1000);

  // --- cursor coordinate readout (fine pointers only) ---------------
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'mousemove',
      (e) => {
        coords.textContent = `${pad4(e.clientX)} X ${pad4(e.clientY)} Y`;
      },
      { passive: true }
    );
  } else {
    coords.remove();
  }

  buildBlueprint();
}

// Faint column/row lines across the viewport with + marks where
// they cross — the technical-drawing layer.
function buildBlueprint() {
  const root = document.getElementById('blueprint');
  if (!root) return;

  const cols = [25, 50, 75]; // vw
  const rows = [33, 66]; // vh

  root.innerHTML =
    cols.map((x) => `<i class="bp-line bp-v" style="left:${x}vw"></i>`).join('') +
    rows.map((y) => `<i class="bp-line bp-h" style="top:${y}vh"></i>`).join('') +
    cols
      .flatMap((x) =>
        rows.map(
          (y) => `<i class="bp-cross" style="left:${x}vw;top:${y}vh"></i>`
        )
      )
      .join('');
}
