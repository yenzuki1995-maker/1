import type { HexCoord, BoardUnit } from '../types';
import { BOARD_COLS, BOARD_ROWS, RANGE_HEX } from '../constants';

// Offset-coordinate hex grid (even-r offset).
// Converts to cube coords for math then back.

export function offsetToCube(hex: HexCoord): { x: number; y: number; z: number } {
  const x = hex.q - (hex.r - (hex.r & 1)) / 2;
  const z = hex.r;
  const y = -x - z;
  return { x, y, z };
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const ca = offsetToCube(a);
  const cb = offsetToCube(b);
  return Math.max(
    Math.abs(ca.x - cb.x),
    Math.abs(ca.y - cb.y),
    Math.abs(ca.z - cb.z)
  );
}

export function rangeHexes(range: 'melee' | 'ranged' | 'magic'): number {
  return RANGE_HEX[range];
}

// All 6 neighbours of a hex in offset coords
function neighbours(hex: HexCoord): HexCoord[] {
  const { q, r } = hex;
  const parity = r & 1;
  const dirs = parity
    ? [
        { dq: +1, dr: 0 }, { dq: +1, dr: -1 }, { dq: 0, dr: -1 },
        { dq: -1, dr: 0 }, { dq: 0, dr: +1 }, { dq: +1, dr: +1 },
      ]
    : [
        { dq: +1, dr: 0 }, { dq: 0, dr: -1 }, { dq: -1, dr: -1 },
        { dq: -1, dr: 0 }, { dq: -1, dr: +1 }, { dq: 0, dr: +1 },
      ];
  return dirs
    .map(({ dq, dr }) => ({ q: q + dq, r: r + dr }))
    .filter((h) => h.q >= 0 && h.q < BOARD_COLS && h.r >= 0 && h.r < BOARD_ROWS);
}

// Greedy step toward target hex avoiding occupied cells
export function stepToward(
  from: HexCoord,
  to: HexCoord,
  units: BoardUnit[],
): HexCoord {
  const occupied = new Set(
    units.filter((u) => u.status === 'alive').map((u) => `${u.hex.q},${u.hex.r}`)
  );
  occupied.delete(`${from.q},${from.r}`); // allow movement from current

  const candidates = neighbours(from).filter(
    (h) => !occupied.has(`${h.q},${h.r}`)
  );

  if (candidates.length === 0) return from; // blocked

  // Pick the neighbour closest to destination
  let best = from;
  let bestDist = hexDistance(from, to);
  for (const c of candidates) {
    const d = hexDistance(c, to);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

// Returns all hexes within radius of center
export function hexesInRadius(center: HexCoord, radius: number): HexCoord[] {
  const result: HexCoord[] = [];
  for (let q = 0; q < BOARD_COLS; q++) {
    for (let r = 0; r < BOARD_ROWS; r++) {
      if (hexDistance(center, { q, r }) <= radius) {
        result.push({ q, r });
      }
    }
  }
  return result;
}

export function isSameHex(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}
