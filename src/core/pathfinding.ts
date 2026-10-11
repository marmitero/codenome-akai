// Tiny A* over the tower tile grid (4-directional). Pure + tested.
// Fixes: entities must route AROUND obstacles instead of getting stuck.

export interface Point { x: number; y: number }

export function astar(
  grid: number[][],
  start: Point,
  goal: Point,
): Point[] {
  const H = grid.length;
  const W = grid[0]?.length ?? 0;
  const inB = (p: Point) => p.x >= 0 && p.y >= 0 && p.x < W && p.y < H;
  const walk = (p: Point) => inB(p) && grid[p.y][p.x] === 0;
  if (!walk(start) || !walk(goal)) return [];

  const key = (p: Point) => p.y * W + p.x;
  const g = new Map<number, number>();
  const came = new Map<number, number>();
  const open: { p: Point; f: number }[] = [];
  const h = (p: Point) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);
  g.set(key(start), 0);
  open.push({ p: start, f: h(start) });

  const dirs = [
    { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
  ];

  let guard = 0;
  while (open.length && guard++ < 4000) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const { p } = open.splice(bi, 1)[0];
    if (p.x === goal.x && p.y === goal.y) {
      const path: Point[] = [];
      let k = key(p);
      let cur: Point = p;
      path.push(cur);
      while (came.has(k)) {
        k = came.get(k)!;
        cur = { x: k % W, y: Math.floor(k / W) };
        path.push(cur);
      }
      path.reverse();
      return path;
    }
    for (const d of dirs) {
      const n = { x: p.x + d.x, y: p.y + d.y };
      if (!walk(n)) continue;
      const nk = key(n);
      const ng = (g.get(key(p)) ?? Infinity) + 1;
      if (ng < (g.get(nk) ?? Infinity)) {
        g.set(nk, ng);
        came.set(nk, key(p));
        open.push({ p: n, f: ng + h(n) });
      }
    }
  }
  return [];
}
