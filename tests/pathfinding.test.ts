import { describe, expect, it } from 'vitest';
import { astar } from '../src/core/pathfinding';

const W = 9;
const H = 7;
function gridWithWall(): number[][] {
  const g = Array.from({ length: H }, () => Array(W).fill(0));
  // vertical wall with a gap at the top
  for (let y = 1; y < H - 1; y++) g[y][4] = 2;
  g[0][4] = 0; // wait: keep wall solid except gap at y=0? build gap at y=1
  for (let y = 0; y < H; y++) g[y][4] = 2;
  g[1][4] = 0; // single gap
  return g;
}

describe('A* obstacle routing', () => {
  it('routes around a wall through the gap', () => {
    const g = gridWithWall();
    const path = astar(g, { x: 1, y: 5 }, { x: 7, y: 5 });
    expect(path.length).toBeGreaterThan(0);
    for (const p of path) expect(g[p.y][p.x]).toBe(0); // never crosses rock
    expect(path[path.length - 1]).toEqual({ x: 7, y: 5 });
    expect(path[0]).toEqual({ x: 1, y: 5 });
    // must pass through the gap row
    expect(path.some((p) => p.x === 4 && p.y === 1)).toBe(true);
  });

  it('returns empty when unreachable', () => {
    const g = gridWithWall();
    for (let y = 0; y < H; y++) g[y][4] = 2; // fully sealed
    expect(astar(g, { x: 1, y: 5 }, { x: 7, y: 5 })).toEqual([]);
  });

  it('straight line when no obstacles', () => {
    const g = Array.from({ length: 5 }, () => Array(5).fill(0));
    const path = astar(g, { x: 0, y: 0 }, { x: 4, y: 0 });
    expect(path.length).toBe(5);
  });
});
