import type { SceneFactory } from '../types';
import { createMaterials } from '../materials';
import { palette } from '../palette';
import { scaleCount } from '../quality';

/** Pricing — columns rising steadily. Growth, without a chart cliché. */
export const columns: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const materials = createMaterials({ THREE });
  camera.position.z = 13;

  const group = new THREE.Group();
  group.rotation.x = 0.16;
  scene.add(group);

  const count = scaleCount(22, quality, 10);
  const spacing = (22 / count) * 0.95;

  const bars = Array.from({ length: count }, (_, index) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 4, 0.5),
      materials.solid(index % 5 === 0 ? palette.gold : palette.sage, 0.42),
    );
    mesh.position.set((index - count / 2) * spacing, 0, Math.sin(index * 0.8) * 2.2);
    group.add(mesh);
    return { mesh, offset: index * 0.35 };
  });

  return (elapsed, pointer) => {
    for (const bar of bars) {
      const height = 1.6 + (Math.sin(elapsed * 0.9 + bar.offset) * 0.5 + 0.5) * 3.4;
      bar.mesh.scale.y = height / 4;
      bar.mesh.position.y = height / 2 - 2.6;
    }

    group.rotation.y = pointer.x * 0.26 + Math.sin(elapsed * 0.14) * 0.07;
  };
};
