import type * as THREE from 'three';
import type { BackgroundScene } from '@/types';
import type { Pointer, SceneUpdate } from './types';
import { detectQuality } from './quality';
import { scenes } from './scenes';
import { prefersReducedMotion, isTouchDevice, onIdle } from '../modules/dom';

const POINTER_EASING = 0.05;
const TIME_STEP = 0.01;

/**
 * WebGL page backgrounds.
 *
 * Three.js is imported dynamically so it never blocks first paint — the CSS
 * aurora renders immediately and carries the page if WebGL is unavailable,
 * so the site is never left looking blank or broken.
 *
 * Note on data-saver: an earlier version skipped 3D entirely when
 * `navigator.connection.saveData` was set. Android Chrome reports that on
 * ordinary mobile data, which silently disabled the animation for a large
 * share of real visitors. We now drop to the phone quality tier instead.
 */
/**
 * Teardown for the currently running scene.
 *
 * View transitions call `initBackground` again on every navigation. Without
 * disposing first, each navigation would leak a WebGL context — browsers cap
 * these at roughly 8–16, after which every canvas on the page stops rendering.
 */
let disposeActive: (() => void) | null = null;

export async function initBackground(sceneName: BackgroundScene): Promise<void> {
  disposeActive?.();
  disposeActive = null;

  const canvas = document.querySelector<HTMLCanvasElement>('[data-scene-canvas]');
  if (!canvas) return;

  if (prefersReducedMotion()) {
    canvas.style.display = 'none';
    return;
  }

  const factory = scenes[sceneName];
  if (!factory) {
    canvas.style.display = 'none';
    return;
  }

  onIdle(() => {
    void start(canvas, factory);
  });
}

async function start(
  canvas: HTMLCanvasElement,
  factory: (typeof scenes)[BackgroundScene],
): Promise<void> {
  let THREE_NS: typeof THREE;
  try {
    THREE_NS = await import('three');
  } catch (error) {
    console.warn('[background] three.js failed to load; keeping CSS backdrop', error);
    canvas.style.display = 'none';
    return;
  }

  const quality = detectQuality();

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE_NS.WebGLRenderer({ canvas, alpha: true, antialias: quality.antialias });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatio));
  } catch (error) {
    console.warn('[background] WebGL unavailable; keeping CSS backdrop', error);
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE_NS.Scene();
  const camera = new THREE_NS.PerspectiveCamera(55, 1, 0.1, 200);

  scene.add(new THREE_NS.AmbientLight(0xcdd9a8, 0.95));
  const keyLight = new THREE_NS.PointLight(0xbfe06b, 1.1, 80);
  keyLight.position.set(6, 6, 9);
  const fillLight = new THREE_NS.PointLight(0xd8c48a, 0.75, 80);
  fillLight.position.set(-8, -4, 7);
  scene.add(keyLight, fillLight);

  let update: SceneUpdate;
  try {
    update = factory({ THREE: THREE_NS, scene, camera, quality });
  } catch (error) {
    console.warn('[background] scene failed to build', error);
    canvas.style.display = 'none';
    return;
  }

  const resize = (): void => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const target: Pointer = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };

  if (!isTouchDevice()) {
    window.addEventListener(
      'pointermove',
      (event) => {
        Object.assign(target, {
          x: event.clientX / window.innerWidth - 0.5,
          y: event.clientY / window.innerHeight - 0.5,
        });
      },
      { passive: true },
    );
  }

  let elapsed = 0;
  let frameId: number | null = null;

  const render = (): void => {
    frameId = window.requestAnimationFrame(render);
    elapsed += TIME_STEP;

    pointer.x += (target.x - pointer.x) * POINTER_EASING;
    pointer.y += (target.y - pointer.y) * POINTER_EASING;

    try {
      update(elapsed, pointer);
    } catch (error) {
      // One bad frame must never take down the whole render loop.
      console.warn('[background] update failed; stopping animation', error);
      stop();
      return;
    }

    renderer.render(scene, camera);
  };

  const stop = (): void => {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
  };

  // Do not burn battery in a background tab.
  const onVisibility = (): void => {
    stop();
    if (!document.hidden) render();
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Register teardown so the next navigation can release this context.
  disposeActive = () => {
    stop();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);

    scene.traverse((object) => {
      const mesh = object as Partial<THREE.Mesh>;
      mesh.geometry?.dispose();
      const material = mesh.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    });

    renderer.dispose();
    renderer.forceContextLoss();
  };

  render();
}
