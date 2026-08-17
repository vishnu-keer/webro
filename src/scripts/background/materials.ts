import type * as THREE from 'three';
import type { SceneContext } from './types';

/** Shared material factories so every scene renders consistently. */
export function createMaterials({ THREE: Three }: Pick<SceneContext, 'THREE'>) {
  return {
    solid(color: number, opacity = 0.5, flatShading = true): THREE.MeshStandardMaterial {
      return new Three.MeshStandardMaterial({
        color,
        emissive: 0x1a2411,
        metalness: 0.18,
        roughness: 0.6,
        flatShading,
        transparent: true,
        opacity,
      });
    },
    line(color: number, opacity = 0.34): THREE.LineBasicMaterial {
      return new Three.LineBasicMaterial({ color, transparent: true, opacity });
    },
  };
}
