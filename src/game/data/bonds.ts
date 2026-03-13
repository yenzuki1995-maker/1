import type { BondDefinition } from '../types';

export const BONDS: Record<string, BondDefinition> = {
  staff_and_wheel: {
    id: 'staff_and_wheel',
    name: 'Staff & Wheel',
    heroIds: ['sun_wukong', 'nezha'],
    lore: 'The Great Sage and the Third Prince — rivals turned brothers in the fires of heaven.',
    thresholds: [50, 150, 300, 500, 800],
    levelEffects: [
      {
        level: 1,
        description: 'Old rivals. +5% attack for both Sun Wukong and Nezha.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 5 },
      },
      {
        level: 2,
        description: 'Wary allies. +10% attack for both.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 10 },
      },
      {
        level: 3,
        description: 'Sworn brothers. +20% attack for both.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 20 },
      },
      {
        level: 4,
        description: 'Divine partnership. +20% attack + +15% HP for both.',
        passiveBonus: { stat: 'hp', type: 'percent', value: 15 },
      },
      {
        level: 5,
        description: 'Heavenly duo. Unlocks combo: Fire-Staff Barrage.',
        abilityUnlock: {
          id: 'fire_staff_barrage',
          name: 'Fire-Staff Barrage',
          description: 'Wukong and Nezha combine their powers, dealing 300% damage to all enemies.',
          manaCost: 100,
          cooldownTicks: 0,
          effect: { type: 'damage_aoe', value: 3.0, radius: 10 },
        },
      },
    ],
  },

  shadow_gate: {
    id: 'shadow_gate',
    name: 'Shadow Gate',
    heroIds: ['jinwoo', 'iseul'],
    lore: 'The Shadow Monarch and the Gate Opener — two sides of the same dimensional rift.',
    thresholds: [50, 150, 300, 500, 800],
    levelEffects: [
      {
        level: 1,
        description: 'Uneasy alliance. +5% HP for both Jinwoo and Iseul.',
        passiveBonus: { stat: 'hp', type: 'percent', value: 5 },
      },
      {
        level: 2,
        description: 'Mutual respect. +10% HP for both.',
        passiveBonus: { stat: 'hp', type: 'percent', value: 10 },
      },
      {
        level: 3,
        description: 'Trusted partners. +15% HP for both.',
        passiveBonus: { stat: 'hp', type: 'percent', value: 15 },
      },
      {
        level: 4,
        description: 'Unbreakable bond. +15% HP + +12% defense for both.',
        passiveBonus: { stat: 'defense', type: 'percent', value: 12 },
      },
      {
        level: 5,
        description: 'Dimensional rulers. Unlocks combo: Shadow Realm.',
        abilityUnlock: {
          id: 'shadow_realm',
          name: 'Shadow Realm',
          description: 'Opens a shadow gate beneath all enemies, stunning them for 2s and dealing 200% damage.',
          manaCost: 100,
          cooldownTicks: 0,
          effect: { type: 'damage_aoe', value: 2.0, radius: 10, duration: 10 },
        },
      },
    ],
  },

  blade_and_shadow: {
    id: 'blade_and_shadow',
    name: 'Blade & Shadow',
    heroIds: ['hayate', 'oni_mai'],
    lore: 'The Phantom Blade and the Oni Slayer — speed and power forged in moonlit combat.',
    thresholds: [50, 150, 300, 500, 800],
    levelEffects: [
      {
        level: 1,
        description: 'Competitive rivals. +5% attack speed for both.',
        passiveBonus: { stat: 'attackSpeed', type: 'percent', value: 5 },
      },
      {
        level: 2,
        description: 'Training partners. +10% attack speed for both.',
        passiveBonus: { stat: 'attackSpeed', type: 'percent', value: 10 },
      },
      {
        level: 3,
        description: 'Battle-tested duo. +20% attack speed for both.',
        passiveBonus: { stat: 'attackSpeed', type: 'percent', value: 20 },
      },
      {
        level: 4,
        description: 'Elite hunters. +20% attack speed + +15% attack for both.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 15 },
      },
      {
        level: 5,
        description: 'Legendary hunters. Unlocks combo: Demon Flash Strike.',
        abilityUnlock: {
          id: 'demon_flash_strike',
          name: 'Demon Flash Strike',
          description: 'A lightning-fast simultaneous strike dealing 250% damage to a single enemy.',
          manaCost: 100,
          cooldownTicks: 0,
          effect: { type: 'damage_single', value: 2.5 },
        },
      },
    ],
  },

  chosen_ones: {
    id: 'chosen_ones',
    name: 'Chosen Ones',
    heroIds: ['jinwoo', 'hayate'],
    lore: 'Two apex hunters whose fates cross — one shaped by death, the other by shadow.',
    thresholds: [60, 180, 360, 600, 1000],
    levelEffects: [
      {
        level: 1,
        description: 'Acknowledged peers. +5% all stats.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 5 },
      },
      {
        level: 2,
        description: 'Respected rivals. +8% all stats.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 8 },
      },
      {
        level: 3,
        description: 'Chosen Warriors. +10% all stats.',
        passiveBonus: { stat: 'attack', type: 'percent', value: 10 },
      },
      {
        level: 4,
        description: 'Apex Hunters. +10% attack + +10% HP for both.',
        passiveBonus: { stat: 'hp', type: 'percent', value: 10 },
      },
      {
        level: 5,
        description: 'Sovereign Executors. Unlocks combo: Sovereign Execute.',
        abilityUnlock: {
          id: 'sovereign_execute',
          name: 'Sovereign Execute',
          description: 'Instantly eliminates the lowest HP enemy regardless of remaining health.',
          manaCost: 100,
          cooldownTicks: 0,
          effect: { type: 'damage_single', value: 9999 },
        },
      },
    ],
  },
};

export const BOND_IDS = Object.keys(BONDS);

export function getBondsForHero(heroId: string): BondDefinition[] {
  return Object.values(BONDS).filter((b) => b.heroIds.includes(heroId as never));
}

export function getBondLevel(bondXp: number, thresholds: number[]): number {
  let level = 0;
  for (const t of thresholds) {
    if (bondXp >= t) level++;
    else break;
  }
  return level;
}
