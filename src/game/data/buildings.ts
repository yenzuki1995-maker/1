import type { BuildingDefinition } from '../types';

export const BUILDINGS: Record<string, BuildingDefinition> = {
  dragon_shrine: {
    id: 'dragon_shrine',
    name: 'Dragon Shrine',
    description: 'A shrine honoring the great dragons. Empowers heroes of Chinese Mythology.',
    emoji: '🐉',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 200 * (level + 1), materials: 10 * (level + 1) }),
    effect: {
      target: { origin: 'ChineseMythology' },
      stat: 'attack',
      bonusPerLevel: 5,
    },
  },

  shinobi_dojo: {
    id: 'shinobi_dojo',
    name: 'Shinobi Dojo',
    description: 'A hidden training ground where the arts of the ninja are perfected.',
    emoji: '⛩️',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 200 * (level + 1), materials: 10 * (level + 1) }),
    effect: {
      target: { origin: 'Japanese' },
      stat: 'attack',
      bonusPerLevel: 5,
    },
  },

  hunter_association: {
    id: 'hunter_association',
    name: 'Hunter Association',
    description: 'The official guild of awakened hunters. Bolsters HP of Korean heroes.',
    emoji: '🏢',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 200 * (level + 1), materials: 10 * (level + 1) }),
    effect: {
      target: { origin: 'Korean' },
      stat: 'hp',
      bonusPerLevel: 8,
    },
  },

  clan_forge: {
    id: 'clan_forge',
    name: 'Clan Forge',
    description: 'A master forge that enhances the effectiveness of all equipped items.',
    emoji: '⚒️',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 300 * (level + 1), materials: 15 * (level + 1) }),
    effect: {
      target: 'all',
      stat: 'attack',
      bonusPerLevel: 3,
    },
  },

  war_chamber: {
    id: 'war_chamber',
    name: 'War Chamber',
    description: 'A strategic planning room that sharpens every hero\'s combat readiness.',
    emoji: '🗡️',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 400 * (level + 1), materials: 20 * (level + 1) }),
    effect: {
      target: 'all',
      stat: 'defense',
      bonusPerLevel: 3,
    },
  },

  celestial_library: {
    id: 'celestial_library',
    name: 'Celestial Library',
    description: 'Ancient scrolls that elevate the magical arts of all cultivator heroes.',
    emoji: '📚',
    maxLevel: 5,
    upgradeCost: (level) => ({ gold: 250 * (level + 1), materials: 12 * (level + 1) }),
    effect: {
      target: { heroClass: 'Cultivator' },
      stat: 'abilityPower',
      bonusPerLevel: 6,
    },
  },
};

export const BUILDING_IDS = Object.keys(BUILDINGS);
