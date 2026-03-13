// ── Combat ────────────────────────────────────────────────────────────────────
export const COMBAT_TICK_MS = 200;       // ms between battle ticks
export const MANA_PER_HIT = 15;
export const MAX_MANA = 100;
export const MAX_COMBAT_LOG = 30;

// Board: 4 cols × 6 rows (offset-coord, player on rows 0-2, enemies on rows 3-5)
export const BOARD_COLS = 4;
export const BOARD_ROWS = 6;
export const PLAYER_ROW_MAX = 2;
export const ENEMY_ROW_MIN = 3;

// Attack range in hexes
export const RANGE_HEX: Record<'melee' | 'ranged' | 'magic', number> = {
  melee: 1,
  ranged: 3,
  magic: 2,
};

// ── Hero ──────────────────────────────────────────────────────────────────────
export const MAX_HERO_LEVEL = 30;
export const ABILITY_UNLOCK_LEVELS = [10, 20, 30];

// XP required to reach each level (index = level, value = total XP needed)
export const XP_TO_LEVEL: number[] = Array.from({ length: MAX_HERO_LEVEL + 1 }, (_, i) =>
  i === 0 ? 0 : Math.floor(100 * Math.pow(i, 1.5))
);

// ── Skill Tree ────────────────────────────────────────────────────────────────
export const SKILL_TIER_FRAGMENT_COST = [10, 25, 50, 100, 200];

// ── Equipment ─────────────────────────────────────────────────────────────────
export const MAX_ITEM_UPGRADE = 10;
export const ITEM_UPGRADE_BONUS_PER_LEVEL = 0.1; // +10% stats per upgrade level

// ── Buildings ─────────────────────────────────────────────────────────────────
export const MAX_BUILDING_LEVEL = 5;

// ── Bonds ─────────────────────────────────────────────────────────────────────
export const MAX_BOND_LEVEL = 5;
export const BOND_XP_PER_BATTLE = 20;

// ── Persist ───────────────────────────────────────────────────────────────────
export const SAVE_KEY = 'clan_ascendant_save';
export const AUTO_SAVE_INTERVAL_MS = 30_000; // 30s
