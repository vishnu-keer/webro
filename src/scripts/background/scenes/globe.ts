import type * as THREE from 'three';
import type { SceneFactory } from '../types';
import { createMaterials } from '../materials';
import { palette } from '../palette';

const RADIUS = 2.7;
const JAIPUR: [number, number] = [26.9, 75.8];

/** Markets served — US, UK, UAE, Canada, Australia, Japan, Singapore. */
const DESTINATIONS: readonly [number, number][] = [
  [38, -97], [54, -2], [24, 54], [56, -106], [-25, 133], [35, 138], [1, 103],
];

/** Contact — arcs flying from Jaipur to every market we work in. */
export const globe: SceneFactory = ({ THREE, scene, camera, quality }) => {
  const materials = createMaterials({ THREE });
  camera.position.z = 9;

  const group = new THREE.Group();
  scene.add(group);

  const detail = quality.name === 'phone' ? 1 : 2;
  group.add(
    new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS, detail)),
      materials.line(palette.lime, 0.26),
    ),
    new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 0.99, 24, 18),
      materials.solid(palette.sage, 0.09, false),
    ),
  );

  /** Latitude/longitude to a point on the sphere. */
  const toVector = (lat: number, lon: number): THREE.Vector3 =>
    new THREE.Vector3(
      RADIUS * Math.cos((lat * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180),
      RADIUS * Math.sin((lat * Math.PI) / 180),
      RADIUS * Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180),
    );

  const origin = toVector(JAIPUR[0], JAIPUR[1]);
  const hub = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 10),
    materials.solid(palette.gold, 1, false),
  );
  hub.position.copy(origin);
  group.add(hub);

  const destinations = quality.name === 'phone' ? DESTINATIONS.slice(0, 4) : DESTINATIONS;

  const arcs = destinations.map(([lat, lon]) => {
    const end = toVector(lat, lon);
    // Lift the control point off the surface so the arc bows outward.
    const control = origin.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS * 1.62);
    const curve = new THREE.QuadraticBezierCurve3(origin, control, end);

    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)),
        materials.line(palette.gold, 0.42),
      ),
    );

    const city = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      materials.solid(palette.deep, 0.9, false),
    );
    city.position.copy(end);

    const traveller = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 8, 8),
      materials.solid(palette.gold, 1, false),
    );
    group.add(city, traveller);

    return { curve, traveller, phase: Math.random() };
  });

  return (elapsed, pointer) => {
    group.rotation.y += 0.0016;

    for (const arc of arcs) {
      arc.traveller.position.copy(arc.curve.getPoint((elapsed * 0.22 + arc.phase) % 1));
    }

    group.rotation.x = pointer.y * 0.24;
    group.position.x = pointer.x * 0.5;
  };
};
