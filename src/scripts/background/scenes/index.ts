import type { BackgroundScene } from '@/types';
import type { SceneFactory } from '../types';
import { orbital } from './orbital';
import { network } from './network';
import { columns } from './columns';
import { helix } from './helix';
import { globe } from './globe';

/** Scene registry. Pages select one via `background` in their front matter. */
export const scenes: Record<BackgroundScene, SceneFactory> = {
  orbital,
  network,
  columns,
  helix,
  globe,
};
