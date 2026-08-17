import type { SceneFactory } from '../types';
import { createMaterials } from '../materials';
import { palette } from '../palette';
import { scaleCount } from '../quality';

/**
 * Home — a slow wireframe globe with nodes orbiting it, echoing the globe
 * inside the WEBRO logo.
 */
export const orbital: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const materials = createMaterials({ THREE });
  camera.position.z = 9;

  const group = new THREE.Group();
  scene.add(group);

  const detail = quality.name === 'phone' ? 1 : 2;
  const globe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.1, detail)),
    materials.line(palette.lime, 0.3),
  );
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.05, 1),
    materials.solid(palette.sage, 0.08, false),
  );
  group.add(globe, core);

  const nodes = Array.from({ length: scaleCount(26, quality, 10) }, () => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 8, 8),
      materials.solid(palette.deep, 0.7, false),
    );
    group.add(mesh);
    return {
      mesh,
      radius: 3.9 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      elevation: (Math.random() - 0.5) * 2.2,
      speed: 0.0016 + Math.random() * 0.0028,
    };
  });

  return (elapsed, pointer) => {
    globe.rotation.y += 0.0013;
    core.rotation.y += 0.0013;

    for (const node of nodes) {
      node.angle += node.speed;
      node.mesh.position.set(
        Math.cos(node.angle) * node.radius,
        node.elevation + Math.sin(elapsed * 0.5 + node.angle) * 0.25,
        Math.sin(node.angle) * node.radius,
      );
    }

    group.rotation.y = pointer.x * 0.4;
    group.rotation.x = pointer.y * 0.28;
  };
};
