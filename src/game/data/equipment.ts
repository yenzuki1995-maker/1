import type { ItemTemplate } from '../types';

export const ITEM_TEMPLATES: Record<string, ItemTemplate> = {
  // ── Weapons ──────────────────────────────────────────────────────────────────
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    slot: 'weapon',
    rarity: 'common',
    statBonuses: { attack: 8 },
    dropSource: ['ch1_s1', 'ch1_s2', 'ch1_s3'],
  },
  phantom_dagger: {
    id: 'phantom_dagger',
    name: 'Phantom Dagger',
    slot: 'weapon',
    rarity: 'rare',
    statBonuses: { attack: 20, attackSpeed: 0.1 },
    dropSource: ['ch1_s5', 'ch1_s6', 'ch1_s7'],
  },
  demon_blade: {
    id: 'demon_blade',
    name: 'Demon Blade',
    slot: 'weapon',
    rarity: 'epic',
    statBonuses: { attack: 45 },
    dropSource: ['ch2_s4', 'ch2_s5'],
  },
  ruyi_jingu_bang: {
    id: 'ruyi_jingu_bang',
    name: 'Ruyi Jingu Bang',
    slot: 'weapon',
    rarity: 'legendary',
    statBonuses: { attack: 80, attackSpeed: 0.2 },
    dropSource: ['ch3_s8'],
  },

  // ── Armor ─────────────────────────────────────────────────────────────────────
  leather_vest: {
    id: 'leather_vest',
    name: 'Leather Vest',
    slot: 'armor',
    rarity: 'common',
    statBonuses: { defense: 6, hp: 30 },
    dropSource: ['ch1_s1', 'ch1_s2'],
  },
  shadow_cloak: {
    id: 'shadow_cloak',
    name: 'Shadow Cloak',
    slot: 'armor',
    rarity: 'rare',
    statBonuses: { defense: 18, hp: 80 },
    dropSource: ['ch1_s6', 'ch1_s7', 'ch1_s8'],
  },
  oni_plate: {
    id: 'oni_plate',
    name: 'Oni Plate',
    slot: 'armor',
    rarity: 'epic',
    statBonuses: { defense: 40, hp: 200 },
    dropSource: ['ch2_s6', 'ch2_s7'],
  },
  dragon_scale_armor: {
    id: 'dragon_scale_armor',
    name: 'Dragon Scale Armor',
    slot: 'armor',
    rarity: 'legendary',
    statBonuses: { defense: 70, hp: 400 },
    dropSource: ['ch3_s6', 'ch3_s7'],
  },

  // ── Helms ─────────────────────────────────────────────────────────────────────
  iron_helm: {
    id: 'iron_helm',
    name: 'Iron Helm',
    slot: 'helm',
    rarity: 'common',
    statBonuses: { defense: 4, hp: 20 },
    dropSource: ['ch1_s2', 'ch1_s3'],
  },
  jade_crown: {
    id: 'jade_crown',
    name: 'Jade Crown',
    slot: 'helm',
    rarity: 'epic',
    statBonuses: { defense: 25, hp: 120 },
    dropSource: ['ch2_s3', 'ch2_s4'],
  },

  // ── Gloves ────────────────────────────────────────────────────────────────────
  cloth_wraps: {
    id: 'cloth_wraps',
    name: 'Cloth Wraps',
    slot: 'gloves',
    rarity: 'common',
    statBonuses: { attack: 4, attackSpeed: 0.05 },
    dropSource: ['ch1_s1', 'ch1_s2'],
  },
  shinobi_gloves: {
    id: 'shinobi_gloves',
    name: 'Shinobi Gloves',
    slot: 'gloves',
    rarity: 'rare',
    statBonuses: { attack: 12, attackSpeed: 0.15 },
    dropSource: ['ch1_s7', 'ch1_s8'],
  },

  // ── Boots ─────────────────────────────────────────────────────────────────────
  worn_boots: {
    id: 'worn_boots',
    name: 'Worn Boots',
    slot: 'boots',
    rarity: 'common',
    statBonuses: { hp: 25 },
    dropSource: ['ch1_s1', 'ch1_s2', 'ch1_s3'],
  },
  wind_fire_wheels: {
    id: 'wind_fire_wheels',
    name: 'Wind Fire Wheels',
    slot: 'boots',
    rarity: 'legendary',
    statBonuses: { hp: 150, attackSpeed: 0.25 },
    dropSource: ['ch3_s5'],
  },

  // ── Accessories ───────────────────────────────────────────────────────────────
  jade_pendant: {
    id: 'jade_pendant',
    name: 'Jade Pendant',
    slot: 'accessory',
    rarity: 'rare',
    statBonuses: { hp: 60, defense: 10 },
    dropSource: ['ch1_s5', 'ch1_s6'],
  },
  shadow_ring: {
    id: 'shadow_ring',
    name: 'Shadow Ring',
    slot: 'accessory',
    rarity: 'epic',
    statBonuses: { attack: 30, hp: 100 },
    dropSource: ['ch2_s5', 'ch2_s6'],
  },
};
