import { create } from 'zustand';
import type { GameState, BattleState, HexCoord, EquipSlot, ItemInstance } from '../game/types';
import { HEROES, STARTER_HERO_IDS } from '../game/data/heroes';
import { getStage } from '../game/data/stages';
import { initBattle, processBattleTick } from '../game/engine/combat';
import { rollLoot } from '../game/engine/loot';
import { awardBondXp, checkBondLevelUps } from '../game/engine/bonds';
import { addXpToHero, getFragmentsForLevel, getXpToNextLevel } from '../game/engine/leveling';
import { saveGame, loadGame } from './persistence';
import { COMBAT_TICK_MS, AUTO_SAVE_INTERVAL_MS, MAX_HERO_LEVEL } from '../game/constants';

// ── Initial state factory ────────────────────────────────────────────────────

function makeInitialHero(definitionId: string) {
  return {
    definitionId,
    level: 1,
    xp: 0,
    xpToNextLevel: getXpToNextLevel(1),
    skillFragments: 0,
    unlockedSkillNodeIds: [],
    equipment: {},
  };
}

function createInitialState(): GameState {
  const heroes: GameState['heroes'] = {};
  for (const id of STARTER_HERO_IDS) {
    heroes[id] = makeInitialHero(id);
  }
  return {
    heroes,
    unlockedHeroIds: [...STARTER_HERO_IDS],
    inventory: {},
    resources: { gold: 100, materials: 0 },
    buildingLevels: {},
    bondXp: {},
    clearedStages: [],
    currentChapter: 1,
    playerBoard: {
      sun_wukong: { q: 0, r: 1 },
      hayate: { q: 2, r: 1 },
    },
    isInitialized: true,
  };
}

// ── Store interface ──────────────────────────────────────────────────────────

interface GameStore extends GameState {
  currentBattle: BattleState | null;
  battleInterval: ReturnType<typeof setInterval> | null;
  saveInterval: ReturnType<typeof setInterval> | null;

  // Battle
  startBattle: (stageId: string) => void;
  stopBattle: () => void;
  claimRewards: (stageId: string) => void;

  // Board
  placeHero: (heroId: string, hex: HexCoord) => void;
  removeHeroFromBoard: (heroId: string) => void;

  // Hero progression
  equipItem: (heroId: string, slot: EquipSlot, itemInstanceId: string) => void;
  unequipItem: (heroId: string, slot: EquipSlot) => void;
  unlockSkillNode: (heroId: string, nodeId: string) => void;

  // Base
  upgradeBuilding: (buildingId: string) => void;

  // Persistence
  save: () => Promise<void>;
  load: () => Promise<void>;
  initGame: () => Promise<void>;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial game state
  ...createInitialState(),
  currentBattle: null,
  battleInterval: null,
  saveInterval: null,

  // ── Battle ──────────────────────────────────────────────────────────────────
  startBattle: (stageId) => {
    const state = get();
    if (state.battleInterval) clearInterval(state.battleInterval);

    let battle = initBattle(stageId, state);
    set({ currentBattle: battle });

    const interval = setInterval(() => {
      const current = get().currentBattle;
      if (!current || current.outcome !== 'pending') {
        clearInterval(interval);
        set({ battleInterval: null });
        return;
      }
      const next = processBattleTick(current);
      set({ currentBattle: next });
    }, COMBAT_TICK_MS);

    set({ battleInterval: interval });
  },

  stopBattle: () => {
    const { battleInterval } = get();
    if (battleInterval) clearInterval(battleInterval);
    set({ currentBattle: null, battleInterval: null });
  },

  claimRewards: (stageId) => {
    const state = get();
    const stage = getStage(stageId);
    if (!stage) return;

    const loot = rollLoot(stage.rewards);
    const newInventory = { ...state.inventory };
    for (const item of loot.items) {
      newInventory[item.id] = item;
    }

    // Distribute XP to participating heroes
    const participatingHeroIds = Object.keys(state.playerBoard);
    const xpEach = Math.floor(loot.xp / Math.max(1, participatingHeroIds.length));

    const updatedHeroes = { ...state.heroes };
    for (const heroId of participatingHeroIds) {
      const inst = updatedHeroes[heroId];
      if (!inst) continue;
      const prevLevel = inst.level;
      const updated = addXpToHero(inst, xpEach);
      // Award fragments for leveling up
      let fragments = inst.skillFragments;
      for (let lv = prevLevel + 1; lv <= updated.level; lv++) {
        fragments += getFragmentsForLevel(lv);
      }
      updatedHeroes[heroId] = { ...updated, skillFragments: fragments };
    }

    // Bond XP
    const oldBondXp = state.bondXp;
    const newBondXp = awardBondXp(participatingHeroIds, oldBondXp);

    // Unlock hero if first clear
    const updatedUnlocked = [...state.unlockedHeroIds];
    if (!state.clearedStages.includes(stageId) && stage.heroUnlock) {
      if (!updatedUnlocked.includes(stage.heroUnlock)) {
        updatedUnlocked.push(stage.heroUnlock);
        updatedHeroes[stage.heroUnlock] = makeInitialHero(stage.heroUnlock);
      }
    }

    set({
      heroes: updatedHeroes,
      unlockedHeroIds: updatedUnlocked,
      inventory: newInventory,
      resources: {
        ...state.resources,
        gold: state.resources.gold + loot.gold,
      },
      bondXp: newBondXp,
      clearedStages: state.clearedStages.includes(stageId)
        ? state.clearedStages
        : [...state.clearedStages, stageId],
      currentBattle: null,
      battleInterval: null,
    });
  },

  // ── Board ───────────────────────────────────────────────────────────────────
  placeHero: (heroId, hex) => {
    const state = get();
    if (!state.unlockedHeroIds.includes(heroId)) return;
    // Remove from previous position
    const newBoard = Object.fromEntries(
      Object.entries(state.playerBoard).filter(([id]) => id !== heroId)
    );
    // Also displace any hero already on that hex
    for (const [id, h] of Object.entries(newBoard)) {
      if (h.q === hex.q && h.r === hex.r) {
        delete newBoard[id];
      }
    }
    newBoard[heroId] = hex;
    set({ playerBoard: newBoard });
  },

  removeHeroFromBoard: (heroId) => {
    const state = get();
    const newBoard = { ...state.playerBoard };
    delete newBoard[heroId];
    set({ playerBoard: newBoard });
  },

  // ── Hero progression ────────────────────────────────────────────────────────
  equipItem: (heroId, slot, itemInstanceId) => {
    const state = get();
    const hero = state.heroes[heroId];
    if (!hero) return;
    const item = state.inventory[itemInstanceId];
    if (!item) return;
    set({
      heroes: {
        ...state.heroes,
        [heroId]: {
          ...hero,
          equipment: { ...hero.equipment, [slot]: itemInstanceId },
        },
      },
    });
  },

  unequipItem: (heroId, slot) => {
    const state = get();
    const hero = state.heroes[heroId];
    if (!hero) return;
    const newEquip = { ...hero.equipment };
    delete newEquip[slot];
    set({
      heroes: {
        ...state.heroes,
        [heroId]: { ...hero, equipment: newEquip },
      },
    });
  },

  unlockSkillNode: (heroId, nodeId) => {
    const state = get();
    const hero = state.heroes[heroId];
    if (!hero) return;
    if (hero.unlockedSkillNodeIds.includes(nodeId)) return;

    // Find the node and check cost
    const { SKILL_TREES } = require('../game/data/skillTrees');
    const node = (SKILL_TREES[heroId] ?? []).find((n: any) => n.id === nodeId);
    if (!node) return;
    if (hero.skillFragments < node.fragmentCost) return;
    // Check prerequisites
    for (const req of node.requires) {
      if (!hero.unlockedSkillNodeIds.includes(req)) return;
    }

    set({
      heroes: {
        ...state.heroes,
        [heroId]: {
          ...hero,
          skillFragments: hero.skillFragments - node.fragmentCost,
          unlockedSkillNodeIds: [...hero.unlockedSkillNodeIds, nodeId],
        },
      },
    });
  },

  // ── Base ────────────────────────────────────────────────────────────────────
  upgradeBuilding: (buildingId) => {
    const state = get();
    const { BUILDINGS } = require('../game/data/buildings');
    const building = BUILDINGS[buildingId];
    if (!building) return;
    const currentLevel = state.buildingLevels[buildingId] ?? 0;
    if (currentLevel >= building.maxLevel) return;

    const cost = building.upgradeCost(currentLevel);
    if (
      state.resources.gold < cost.gold ||
      state.resources.materials < cost.materials
    )
      return;

    set({
      buildingLevels: { ...state.buildingLevels, [buildingId]: currentLevel + 1 },
      resources: {
        gold: state.resources.gold - cost.gold,
        materials: state.resources.materials - cost.materials,
      },
    });
  },

  // ── Persistence ─────────────────────────────────────────────────────────────
  save: async () => {
    const state = get();
    const gameState: GameState = {
      heroes: state.heroes,
      unlockedHeroIds: state.unlockedHeroIds,
      inventory: state.inventory,
      resources: state.resources,
      buildingLevels: state.buildingLevels,
      bondXp: state.bondXp,
      clearedStages: state.clearedStages,
      currentChapter: state.currentChapter,
      playerBoard: state.playerBoard,
      isInitialized: state.isInitialized,
    };
    await saveGame(gameState);
  },

  load: async () => {
    const saved = await loadGame();
    if (saved) {
      set({ ...saved, currentBattle: null, battleInterval: null });
    }
  },

  initGame: async () => {
    await get().load();

    // Start auto-save
    const existing = get().saveInterval;
    if (existing) clearInterval(existing);
    const saveInterval = setInterval(() => {
      get().save();
    }, AUTO_SAVE_INTERVAL_MS);
    set({ saveInterval });
  },
}));
