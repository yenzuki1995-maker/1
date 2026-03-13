import type { SkillNode } from '../types';

// Each hero has 3 branches × 5 tiers = 15 nodes per hero.
// Column layout: offense=0, survival=1, special=2
// Requires previous tier in same branch.

const FRAG_COSTS = [10, 25, 50, 100, 200];

function makeChain(
  heroId: string,
  branch: 'offense' | 'survival' | 'special',
  col: number,
  nodes: Omit<SkillNode, 'id' | 'heroId' | 'branch' | 'tier' | 'position' | 'fragmentCost' | 'requires'>[],
): SkillNode[] {
  return nodes.map((n, i) => ({
    ...n,
    id: `${heroId}_${branch}_${i}`,
    heroId,
    branch,
    tier: i,
    position: { col, row: i },
    fragmentCost: FRAG_COSTS[i],
    requires: i === 0 ? [] : [`${heroId}_${branch}_${i - 1}`],
  }));
}

// ── Sun Wukong ─────────────────────────────────────────────────────────────────
const sunWukongNodes: SkillNode[] = [
  ...makeChain('sun_wukong', 'offense', 0, [
    { name: 'Sharp Staff', description: '+5 flat attack.', effect: { stat: 'attack', type: 'flat', value: 5 } },
    { name: 'Fury', description: '+10% attack.', effect: { stat: 'attack', type: 'percent', value: 10 } },
    { name: 'Staff Mastery', description: '+15% attack.', effect: { stat: 'attack', type: 'percent', value: 15 } },
    { name: "King's Rage", description: '+20% attack.', effect: { stat: 'attack', type: 'percent', value: 20 } },
    { name: 'Ruyi Staff', description: '+30% attack.', effect: { stat: 'attack', type: 'percent', value: 30 } },
  ]),
  ...makeChain('sun_wukong', 'survival', 1, [
    { name: 'Iron Body', description: '+20 flat HP.', effect: { stat: 'hp', type: 'flat', value: 20 } },
    { name: 'Monkey Tough', description: '+5% defense.', effect: { stat: 'defense', type: 'percent', value: 5 } },
    { name: '72 Forms', description: '+10% HP.', effect: { stat: 'hp', type: 'percent', value: 10 } },
    { name: 'Immortal Body', description: '+15% defense.', effect: { stat: 'defense', type: 'percent', value: 15 } },
    { name: 'Undying Will', description: '+25% HP.', effect: { stat: 'hp', type: 'percent', value: 25 } },
  ]),
  ...makeChain('sun_wukong', 'special', 2, [
    { name: 'Echo Clone', description: '+5% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 5 } },
    { name: 'Double Trouble', description: '+10% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 10 } },
    { name: 'Triple Threat', description: '+15% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 15 } },
    { name: 'Clone Army', description: '+20% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 20 } },
    { name: 'Staff of Heaven', description: '+40% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 40 } },
  ]),
];

// ── Nezha ──────────────────────────────────────────────────────────────────────
const nezhaNodes: SkillNode[] = [
  ...makeChain('nezha', 'offense', 0, [
    { name: 'Wheel Spark', description: '+8 flat attack.', effect: { stat: 'attack', type: 'flat', value: 8 } },
    { name: 'Blazing Wheel', description: '+12% attack.', effect: { stat: 'attack', type: 'percent', value: 12 } },
    { name: 'Fire Mastery', description: '+18% attack.', effect: { stat: 'attack', type: 'percent', value: 18 } },
    { name: 'Heaven Fire', description: '+22% attack.', effect: { stat: 'attack', type: 'percent', value: 22 } },
    { name: 'Divine Flame', description: '+35% attack.', effect: { stat: 'attack', type: 'percent', value: 35 } },
  ]),
  ...makeChain('nezha', 'survival', 1, [
    { name: 'Lotus Shell', description: '+15 flat HP.', effect: { stat: 'hp', type: 'flat', value: 15 } },
    { name: 'Jade Skin', description: '+8% defense.', effect: { stat: 'defense', type: 'percent', value: 8 } },
    { name: 'Rebirth Armor', description: '+12% HP.', effect: { stat: 'hp', type: 'percent', value: 12 } },
    { name: 'Lotus Rebirth', description: '+18% defense.', effect: { stat: 'defense', type: 'percent', value: 18 } },
    { name: 'Undying Lotus', description: '+28% HP.', effect: { stat: 'hp', type: 'percent', value: 28 } },
  ]),
  ...makeChain('nezha', 'special', 2, [
    { name: 'Ring Toss', description: '+5% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 5 } },
    { name: 'Heaven Ring', description: '+12% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 12 } },
    { name: 'Fire Arts', description: '+18% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 18 } },
    { name: 'Celestial Arts', description: '+25% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 25 } },
    { name: 'Primordial Fire', description: '+45% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 45 } },
  ]),
];

// ── Hayate ─────────────────────────────────────────────────────────────────────
const hayateNodes: SkillNode[] = [
  ...makeChain('hayate', 'offense', 0, [
    { name: 'Honed Blade', description: '+6 flat attack.', effect: { stat: 'attack', type: 'flat', value: 6 } },
    { name: 'Phantom Strike', description: '+10% attack.', effect: { stat: 'attack', type: 'percent', value: 10 } },
    { name: 'Blade Dance', description: '+15% attack.', effect: { stat: 'attack', type: 'percent', value: 15 } },
    { name: 'Void Slash', description: '+20% attack.', effect: { stat: 'attack', type: 'percent', value: 20 } },
    { name: 'Phantom Blade', description: '+30% attack.', effect: { stat: 'attack', type: 'percent', value: 30 } },
  ]),
  ...makeChain('hayate', 'survival', 1, [
    { name: 'Shadow Cloak', description: '+5% defense.', effect: { stat: 'defense', type: 'flat', value: 5 } },
    { name: 'Evasion', description: '+8% defense.', effect: { stat: 'defense', type: 'percent', value: 8 } },
    { name: 'Ninja Resilience', description: '+10% HP.', effect: { stat: 'hp', type: 'percent', value: 10 } },
    { name: 'Ghost Shroud', description: '+15% defense.', effect: { stat: 'defense', type: 'percent', value: 15 } },
    { name: 'Void Veil', description: '+25% HP.', effect: { stat: 'hp', type: 'percent', value: 25 } },
  ]),
  ...makeChain('hayate', 'special', 2, [
    { name: 'Swift Feet', description: '+5% attack speed.', effect: { stat: 'attackSpeed', type: 'percent', value: 5 } },
    { name: 'Rapid Strikes', description: '+10% attack speed.', effect: { stat: 'attackSpeed', type: 'percent', value: 10 } },
    { name: 'Lightning Hands', description: '+15% attack speed.', effect: { stat: 'attackSpeed', type: 'percent', value: 15 } },
    { name: 'Storm Blade', description: '+20% attack speed.', effect: { stat: 'attackSpeed', type: 'percent', value: 20 } },
    { name: 'Phantom Flurry', description: '+35% attack speed.', effect: { stat: 'attackSpeed', type: 'percent', value: 35 } },
  ]),
];

// ── Oni Mai ────────────────────────────────────────────────────────────────────
const oniMaiNodes: SkillNode[] = [
  ...makeChain('oni_mai', 'offense', 0, [
    { name: 'Demon Edge', description: '+7 flat attack.', effect: { stat: 'attack', type: 'flat', value: 7 } },
    { name: 'Slayer Instinct', description: '+10% attack.', effect: { stat: 'attack', type: 'percent', value: 10 } },
    { name: 'Demon Strength', description: '+15% attack.', effect: { stat: 'attack', type: 'percent', value: 15 } },
    { name: 'Oni Power', description: '+20% attack.', effect: { stat: 'attack', type: 'percent', value: 20 } },
    { name: 'Crimson Wrath', description: '+30% attack.', effect: { stat: 'attack', type: 'percent', value: 30 } },
  ]),
  ...makeChain('oni_mai', 'survival', 1, [
    { name: 'Demon Hide', description: '+30 flat HP.', effect: { stat: 'hp', type: 'flat', value: 30 } },
    { name: 'Iron Will', description: '+10% defense.', effect: { stat: 'defense', type: 'percent', value: 10 } },
    { name: 'Oni Blood', description: '+15% HP.', effect: { stat: 'hp', type: 'percent', value: 15 } },
    { name: 'Demon Fortress', description: '+20% defense.', effect: { stat: 'defense', type: 'percent', value: 20 } },
    { name: 'Undying Rage', description: '+30% HP.', effect: { stat: 'hp', type: 'percent', value: 30 } },
  ]),
  ...makeChain('oni_mai', 'special', 2, [
    { name: 'Blood Taste', description: '+5% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 5 } },
    { name: 'Life Drain', description: '+10% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 10 } },
    { name: 'Demon Arts', description: '+15% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 15 } },
    { name: 'Crimson Arts', description: '+22% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 22 } },
    { name: 'Oni Mastery', description: '+40% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 40 } },
  ]),
];

// ── Jinwoo ─────────────────────────────────────────────────────────────────────
const jinwooNodes: SkillNode[] = [
  ...makeChain('jinwoo', 'offense', 0, [
    { name: 'Shadow Edge', description: '+8 flat attack.', effect: { stat: 'attack', type: 'flat', value: 8 } },
    { name: 'Dark Power', description: '+12% attack.', effect: { stat: 'attack', type: 'percent', value: 12 } },
    { name: 'Monarch Strike', description: '+18% attack.', effect: { stat: 'attack', type: 'percent', value: 18 } },
    { name: "Shadow King's Might", description: '+25% attack.', effect: { stat: 'attack', type: 'percent', value: 25 } },
    { name: 'Sovereign Power', description: '+35% attack.', effect: { stat: 'attack', type: 'percent', value: 35 } },
  ]),
  ...makeChain('jinwoo', 'survival', 1, [
    { name: 'Shadow Armor', description: '+20 flat HP.', effect: { stat: 'hp', type: 'flat', value: 20 } },
    { name: 'Dark Resilience', description: '+8% defense.', effect: { stat: 'defense', type: 'percent', value: 8 } },
    { name: 'Monarch Endurance', description: '+12% HP.', effect: { stat: 'hp', type: 'percent', value: 12 } },
    { name: 'Shadow Bastion', description: '+18% defense.', effect: { stat: 'defense', type: 'percent', value: 18 } },
    { name: 'Immortal Monarch', description: '+28% HP.', effect: { stat: 'hp', type: 'percent', value: 28 } },
  ]),
  ...makeChain('jinwoo', 'special', 2, [
    { name: 'Shadow Army I', description: '+8% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 8 } },
    { name: 'Shadow Army II', description: '+14% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 14 } },
    { name: "Ruler's Domain", description: '+20% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 20 } },
    { name: "Monarch's Edict", description: '+28% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 28 } },
    { name: 'Arise', description: '+50% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 50 } },
  ]),
];

// ── Iseul ──────────────────────────────────────────────────────────────────────
const iseulNodes: SkillNode[] = [
  ...makeChain('iseul', 'offense', 0, [
    { name: 'Rift Strike', description: '+6 flat attack.', effect: { stat: 'attack', type: 'flat', value: 6 } },
    { name: 'Gate Force', description: '+10% attack.', effect: { stat: 'attack', type: 'percent', value: 10 } },
    { name: 'Void Surge', description: '+15% attack.', effect: { stat: 'attack', type: 'percent', value: 15 } },
    { name: 'Rift Mastery', description: '+20% attack.', effect: { stat: 'attack', type: 'percent', value: 20 } },
    { name: 'Dimensional Power', description: '+30% attack.', effect: { stat: 'attack', type: 'percent', value: 30 } },
  ]),
  ...makeChain('iseul', 'survival', 1, [
    { name: 'Barrier Ward', description: '+15 flat HP.', effect: { stat: 'hp', type: 'flat', value: 15 } },
    { name: 'Gate Shield', description: '+8% defense.', effect: { stat: 'defense', type: 'percent', value: 8 } },
    { name: 'Void Ward', description: '+12% HP.', effect: { stat: 'hp', type: 'percent', value: 12 } },
    { name: 'Rift Bastion', description: '+16% defense.', effect: { stat: 'defense', type: 'percent', value: 16 } },
    { name: 'Dimensional Fortress', description: '+25% HP.', effect: { stat: 'hp', type: 'percent', value: 25 } },
  ]),
  ...makeChain('iseul', 'special', 2, [
    { name: 'Gate Sense', description: '+6% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 6 } },
    { name: 'Spatial Arts', description: '+12% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 12 } },
    { name: 'Void Arts', description: '+18% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 18 } },
    { name: 'Gate Mastery', description: '+25% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 25 } },
    { name: 'Dimensional Ascendance', description: '+45% ability power.', effect: { stat: 'abilityPower', type: 'percent', value: 45 } },
  ]),
];

export const SKILL_TREES: Record<string, SkillNode[]> = {
  sun_wukong: sunWukongNodes,
  nezha: nezhaNodes,
  hayate: hayateNodes,
  oni_mai: oniMaiNodes,
  jinwoo: jinwooNodes,
  iseul: iseulNodes,
};

export function getSkillNode(heroId: string, nodeId: string): SkillNode | undefined {
  return SKILL_TREES[heroId]?.find((n) => n.id === nodeId);
}
