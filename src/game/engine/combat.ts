import type {
  BattleState,
  BoardUnit,
  GameState,
  HexCoord,
  HeroInstance,
} from '../types';
import { HEROES } from '../data/heroes';
import { ENEMY_TEMPLATES } from '../data/enemies';
import { SKILL_TREES } from '../data/skillTrees';
import { ITEM_TEMPLATES } from '../data/equipment';
import { BUILDINGS } from '../data/buildings';
import { BONDS, getBondLevel } from '../data/bonds';
import { getStage } from '../data/stages';
import {
  MANA_PER_HIT,
  MAX_MANA,
  MAX_COMBAT_LOG,
  ABILITY_UNLOCK_LEVELS,
  ITEM_UPGRADE_BONUS_PER_LEVEL,
} from '../constants';
import { stepToward, rangeHexes, hexDistance } from './hexGrid';
import { resolveAbility, findNearestEnemy, getEffectiveAttack, getEffectiveDefense } from './abilities';
import { uuid } from '../utils/format';

// ── Stat calculation helpers ──────────────────────────────────────────────────

export function calcHeroStats(
  heroId: string,
  instance: HeroInstance,
  gameState: GameState,
): { hp: number; attack: number; defense: number; attackSpeed: number; abilityPower: number } {
  const def = HEROES[heroId];
  if (!def) throw new Error(`Unknown hero: ${heroId}`);

  // Base stats scaled by level
  const levelMult = 1 + (instance.level - 1) * 0.08;
  let hp = def.baseHp * levelMult;
  let attack = def.baseAttack * levelMult;
  let defense = def.baseDefense * levelMult;
  let attackSpeed = def.baseAttackSpeed;
  let abilityPower = 0;

  // Skill tree bonuses
  const tree = SKILL_TREES[heroId] ?? [];
  for (const nodeId of instance.unlockedSkillNodeIds) {
    const node = tree.find((n) => n.id === nodeId);
    if (!node) continue;
    const { stat, type, value } = node.effect;
    if (type === 'flat') {
      if (stat === 'hp') hp += value;
      else if (stat === 'attack') attack += value;
      else if (stat === 'defense') defense += value;
      else if (stat === 'attackSpeed') attackSpeed += value;
      else if (stat === 'abilityPower') abilityPower += value;
    } else {
      if (stat === 'hp') hp *= 1 + value / 100;
      else if (stat === 'attack') attack *= 1 + value / 100;
      else if (stat === 'defense') defense *= 1 + value / 100;
      else if (stat === 'attackSpeed') attackSpeed *= 1 + value / 100;
      else if (stat === 'abilityPower') abilityPower += value;
    }
  }

  // Equipment bonuses
  for (const [, itemId] of Object.entries(instance.equipment)) {
    if (!itemId) continue;
    const itemInst = gameState.inventory[itemId];
    if (!itemInst) continue;
    const tmpl = ITEM_TEMPLATES[itemInst.templateId];
    if (!tmpl) continue;
    const upgradeMult = 1 + itemInst.upgradeLevel * ITEM_UPGRADE_BONUS_PER_LEVEL;
    const bonuses = tmpl.statBonuses;
    if (bonuses.attack) attack += bonuses.attack * upgradeMult;
    if (bonuses.defense) defense += bonuses.defense * upgradeMult;
    if (bonuses.hp) hp += bonuses.hp * upgradeMult;
    if (bonuses.attackSpeed) attackSpeed += bonuses.attackSpeed * upgradeMult;
  }

  // Building bonuses
  for (const [buildingId, level] of Object.entries(gameState.buildingLevels)) {
    if (level === 0) continue;
    const building = BUILDINGS[buildingId];
    if (!building) continue;
    const { target, stat, bonusPerLevel } = building.effect;
    const matches =
      target === 'all' ||
      ('origin' in target && target.origin === def.origin) ||
      ('heroClass' in target && target.heroClass === def.heroClass);
    if (!matches) continue;
    const pct = bonusPerLevel * level;
    if (stat === 'hp') hp *= 1 + pct / 100;
    else if (stat === 'attack') attack *= 1 + pct / 100;
    else if (stat === 'defense') defense *= 1 + pct / 100;
    else if (stat === 'abilityPower') abilityPower += pct;
  }

  // Bond bonuses
  for (const bond of Object.values(BONDS)) {
    if (!bond.heroIds.includes(heroId as never)) continue;
    const bondXp = gameState.bondXp[bond.id] ?? 0;
    const bondLevel = getBondLevel(bondXp, bond.thresholds);
    for (const effect of bond.levelEffects) {
      if (effect.level > bondLevel) continue;
      if (!effect.passiveBonus) continue;
      const { stat, type, value } = effect.passiveBonus;
      if (type === 'flat') {
        if (stat === 'attack') attack += value;
        else if (stat === 'defense') defense += value;
        else if (stat === 'hp') hp += value;
      } else {
        if (stat === 'attack') attack *= 1 + value / 100;
        else if (stat === 'defense') defense *= 1 + value / 100;
        else if (stat === 'hp') hp *= 1 + value / 100;
        else if (stat === 'attackSpeed') attackSpeed *= 1 + value / 100;
      }
    }
  }

  return {
    hp: Math.floor(hp),
    attack: Math.floor(attack),
    defense: Math.floor(defense),
    attackSpeed,
    abilityPower: Math.floor(abilityPower),
  };
}

// Get unlocked abilities for a hero at their current level
function getUnlockedAbilities(heroId: string, level: number) {
  const def = HEROES[heroId];
  if (!def) return [];
  return def.abilities.filter((_, i) => {
    if (i === 0) return true;
    return level >= ABILITY_UNLOCK_LEVELS[i - 1];
  });
}

// ── Battle initialization ─────────────────────────────────────────────────────

export function initBattle(stageId: string, gameState: GameState): BattleState {
  const stage = getStage(stageId);
  if (!stage) throw new Error(`Unknown stage: ${stageId}`);

  const units: BoardUnit[] = [];

  // Player units from board placement
  for (const [heroId, hex] of Object.entries(gameState.playerBoard)) {
    const instance = gameState.heroes[heroId];
    if (!instance) continue;
    const stats = calcHeroStats(heroId, instance, gameState);
    units.push({
      unitId: uuid(),
      heroId,
      isEnemy: false,
      hex,
      currentHp: stats.hp,
      maxHp: stats.hp,
      attack: stats.attack,
      defense: stats.defense,
      attackSpeed: stats.attackSpeed,
      attackCooldown: 0,
      currentMana: 0,
      maxMana: MAX_MANA,
      status: 'alive',
      activeBuffs: [],
      abilities: getUnlockedAbilities(heroId, instance.level),
    });
  }

  // Enemy units from first wave
  const wave = stage.enemyWaves[0];
  for (const e of wave.enemies) {
    const tmpl = ENEMY_TEMPLATES[e.templateId];
    if (!tmpl) continue;
    const lvlMult = 1 + (e.level - 1) * 0.08;
    units.push({
      unitId: uuid(),
      heroId: e.templateId,
      isEnemy: true,
      hex: e.hex,
      currentHp: Math.floor(tmpl.baseHp * lvlMult),
      maxHp: Math.floor(tmpl.baseHp * lvlMult),
      attack: Math.floor(tmpl.baseAttack * lvlMult),
      defense: Math.floor(tmpl.baseDefense * lvlMult),
      attackSpeed: tmpl.attackSpeed,
      attackCooldown: 0,
      currentMana: 0,
      maxMana: MAX_MANA,
      status: 'alive',
      activeBuffs: [],
      abilities: [],
    });
  }

  return { units, tick: 0, log: [], outcome: 'pending' };
}

// ── Battle tick ───────────────────────────────────────────────────────────────

export function processBattleTick(battle: BattleState): BattleState {
  // Deep clone units to avoid mutation issues
  const units: BoardUnit[] = battle.units.map((u) => ({
    ...u,
    activeBuffs: u.activeBuffs.map((b) => ({ ...b })),
  }));
  const newLog: string[] = [];

  // Process each alive unit
  for (const unit of units.filter((u) => u.status === 'alive')) {
    // Tick down buffs
    unit.activeBuffs = unit.activeBuffs
      .map((b) => ({ ...b, remainingTicks: b.remainingTicks - 1 }))
      .filter((b) => b.remainingTicks > 0);

    const target = findNearestEnemy(unit, units);
    if (!target) continue;

    const dist = hexDistance(unit.hex, target.hex);
    const inRange = dist <= rangeHexes(
      HEROES[unit.heroId]?.attackRange ??
      (ENEMY_TEMPLATES[unit.heroId]?.attackRange ?? 'melee')
    );

    if (inRange) {
      if (unit.attackCooldown <= 0) {
        // Standard attack
        const effectiveAtk = getEffectiveAttack(unit);
        const effectiveDef = getEffectiveDefense(target);
        const dmg = Math.max(1, Math.floor(effectiveAtk - effectiveDef * 0.4));
        target.currentHp -= dmg;
        unit.currentMana = Math.min(unit.maxMana, unit.currentMana + MANA_PER_HIT);
        unit.attackCooldown = Math.max(1, Math.floor(5 / unit.attackSpeed));
        newLog.push(`${unit.heroId} → ${target.heroId}: ${dmg}`);

        // Ability fire
        if (unit.currentMana >= unit.maxMana && unit.abilities.length > 0) {
          resolveAbility(unit, units, newLog);
          unit.currentMana = 0;
        }

        if (target.currentHp <= 0) target.status = 'dead';
      } else {
        unit.attackCooldown--;
      }
    } else {
      // Move toward target
      unit.hex = stepToward(unit.hex, target.hex, units);
    }
  }

  const playerAlive = units.some((u) => !u.isEnemy && u.status === 'alive');
  const enemyAlive = units.some((u) => u.isEnemy && u.status === 'alive');
  const outcome: BattleState['outcome'] =
    !enemyAlive ? 'victory' : !playerAlive ? 'defeat' : 'pending';

  return {
    units,
    tick: battle.tick + 1,
    log: [...battle.log, ...newLog].slice(-MAX_COMBAT_LOG),
    outcome,
  };
}
