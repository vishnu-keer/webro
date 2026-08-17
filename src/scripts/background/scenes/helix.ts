import type * as THREE from 'three';
import type { SceneFactory } from '../types';
import { createMaterials } from '../materials';
import { palette } from '../palette';
import { scaleCount } from '../quality';

const RADIUS = 1.75;
const HEIGHT = 11;

/** About — two strands winding together: design and engineering as one team. */
export const helix: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const materials = createMaterials({ THREE });
  camera.position.z = 11;

  const group = new THREE.Group();
  group.rotation.z = 0.34;
  scene.add(group);

  const count = scaleCount(54, quality, 20);
  const strandA: THREE.Mesh[] = [];
  const strandB: THREE.Mesh[] = [];
  const rungs: { mesh: THREE.Mesh; index: number }[] = [];

  for (let i = 0; i < count; i += 1) {
    const a = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      materials.solid(palette.deep, 0.72, false),
    );
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      materials.solid(palette.gold, 0.72, false),
    );
    group.add(a, b);
    strandA.push(a);
    strandB.push(b);

    // Every third pair gets a connecting rung — enough to read as a ladder
    // without tripling the object count.
    if (i % 3 === 0) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 1, 5),
        materials.solid(palette.sage, 0.32, false),
      );
      group.add(mesh);
      rungs.push({ mesh, index: i });
    }
  }

  return (elapsed, pointer) => {
    for (let i = 0; i < count; i += 1) {
      const y = (i / count - 0.5) * HEIGHT;
      const theta = i * 0.42 + elapsed * 0.55;

      strandA[i]!.position.set(Math.cos(theta) * RADIUS, y, Math.sin(theta) * RADIUS);
      strandB[i]!.position.set(
        Math.cos(theta + Math.PI) * RADIUS,
        y,
        Math.sin(theta + Math.PI) * RADIUS,
      );
    }

    for (const { mesh, index } of rungs) {
      const a = strandA[index]!.position;
      const b = strandB[index]!.position;
      mesh.position.copy(a).add(b).multiplyScalar(0.5);
      mesh.scale.y = a.distanceTo(b);
      mesh.lookAt(b);
      mesh.rotateX(Math.PI / 2);
    }

    group.rotation.y = pointer.x * 0.34;
  };
};
