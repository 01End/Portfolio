// Chrome 3D centerpiece for the hero — a glossy metallic torus knot,
// environment-lit with a red accent light, drifting with the cursor.
// three.js is imported lazily after the preloader so the first paint
// never waits on it. Skipped on small screens; static frame when the
// visitor prefers reduced motion.
export async function initHero3d(reduced) {
  const mount = document.getElementById('hero-3d');
  const hero = document.getElementById('hero');
  if (!mount || !hero) return;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  let THREE, RoomEnvironment;
  try {
    THREE = await import('three');
    ({ RoomEnvironment } = await import(
      'three/examples/jsm/environments/RoomEnvironment.js'
    ));
  } catch {
    return; // 3D is decorative — fail silently
  }

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    '#e10600';

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, -0.4, 11);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.7, 0.52, 260, 40),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.16,
      envMapIntensity: 1.1,
    })
  );
  scene.add(mesh);

  const accentLight = new THREE.PointLight(new THREE.Color(accent), 60, 30);
  accentLight.position.set(-4, -2, 4);
  scene.add(accentLight);

  if (import.meta.env.DEV) {
    // manual render hook for automated verification (dev only)
    window.__hero3d = { renderer, scene, camera, mesh };
  }

  function resize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // cursor-following drift
  const target = { x: 0, y: 0 };
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    window.addEventListener(
      'mousemove',
      (e) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );
  }

  if (reduced) {
    mesh.rotation.set(0.6, -0.4, 0.2);
    renderer.render(scene, camera);
    return;
  }

  let raf = null;
  let inView = true;

  function loop(t) {
    const time = t * 0.001;
    mesh.rotation.x += (0.5 + target.y * 0.55 - mesh.rotation.x) * 0.04;
    mesh.rotation.y += (time * 0.14 + target.x * 0.6 - mesh.rotation.y) * 0.05;
    mesh.position.y = Math.sin(time * 0.7) * 0.18;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  const start = () => {
    if (!raf && inView && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      inView ? start() : stop();
    },
    { threshold: 0 }
  ).observe(hero);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
