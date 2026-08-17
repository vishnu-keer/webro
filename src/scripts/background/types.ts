import type * as THREE from 'three';

/** Called once per frame. Returned by every scene factory. */
export type SceneUpdate = (elapsed: number, pointer: Pointer) => void;

export interface Pointer {
  /** Normalised -0.5 … 0.5 from the viewport centre. */
  readonly x: number;
  readonly y: number;
}

export interface SceneContext {
  readonly THREE: typeof THREE;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly quality: QualityTier;
}

export type SceneFactory = (context: SceneContext) => SceneUpdate;

export interface QualityTier {
  readonly name: 'phone' | 'tablet' | 'desktop';
  /** Caps devicePixelRatio — the single biggest GPU cost on mobile. */
  readonly pixelRatio: number;
  /** Multiplier applied to object counts. */
  readonly density: number;
  readonly antialias: boolean;
}
