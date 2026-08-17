import type { SceneFactory } from '../types';
import { createMaterials } from '../materials';
import { palette } from '../palette';
import { scaleCount } from '../quality';

const LINK_DISTANCE = 3.4;
const BOUNDS = [8.5, 5.5, 4] as const;

/**
 * Services — drifting nodes with links forming and breaking between them.
 *
 * The pair loop is O(n²), so node count matters more here than in any other
 * scene; phones get roughly a quarter of the desktop count.
 */
export const network: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const materials = createMaterials({ THREE });
  camera.position.z = 11;

  const group = new THREE.Group();
  scene.add(group);

  const count = scaleCount(44, quality, 14);
  const nodes = Array.from({ length: count }, () => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 8, 8),
      materials.solid(palette.deep, 0.8, false),
    );
    group.add(mesh);
    return {
      mesh,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 17,
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 8,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.008,
      ),
    };
  });

  // Pre-allocated: worst case is every pair linked, two vertices each.
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(count * count * 6);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  group.add(new THREE.LineSegments(geometry, materials.line(palette.lime, 0.24)));

  const axes = ['x', 'y', 'z'] as const;

  return (_elapsed, pointer) => {
    for (const node of nodes) {
      node.position.add(node.velocity);
      axes.forEach((axis, index) => {
        if (Math.abs(node.position[axis]) > BOUNDS[index]!) node.velocity[axis] *= -1;
      });
      node.mesh.position.copy(node.position);
    }

    let cursor = 0;
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        const a = nodes[i]!.position;
        const b = nodes[j]!.position;
        if (a.distanceTo(b) >= LINK_DISTANCE) continue;

        vertices[cursor++] = a.x; vertices[cursor++] = a.y; vertices[cursor++] = a.z;
        vertices[cursor++] = b.x; vertices[cursor++] = b.y; vertices[cursor++] = b.z;
      }
    }

    geometry.setDrawRange(0, cursor / 3);
    geometry.attributes.position!.needsUpdate = true;

    group.rotation.y = pointer.x * 0.3;
    group.rotation.x = pointer.y * 0.2;
  };
};
