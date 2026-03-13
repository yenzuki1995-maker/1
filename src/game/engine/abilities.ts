import type { BoardUnit, BattleState } from '../types';
import { hexesInRadius } from './hexGrid';

export function resolveAbility(
  caster: BoardUnit,
  units: BoardUnit[],
  log: string[],
): void {
  const ability = caster.abilities[0]; // primary ability
  if (!ability) return;

  const { effect } = ability;
  const abilityPowerMult = 1 + getAbilityPower(caster) / 100;

  switch (effect.type) {
    case 'damage_single': {
      const target = findNearestEnemy(caster, units);
      if (!target) break;
      const dmg = Math.floor(caster.attack * effect.value * abilityPowerMult);
      target.currentHp -= dmg;
      if (target.currentHp <= 0) target.status = 'dead';
      log.push(`✨ ${caster.heroId} uses ${ability.name}! ${dmg} damage to ${target.heroId}`);
      break;
    }

    case 'damage_aoe': {
      const radius = effect.radius ?? 2;
      const targets = units.filter(
        (u) =>
          u.isEnemy !== caster.isEnemy &&
          u.status === 'alive' &&
          hexesInRadius(caster.hex, radius).some(
            (h) => h.q === u.hex.q && h.r === u.hex.r
          )
      );
      const dmg = Math.floor(caster.attack * effect.value * abilityPowerMult);
      for (const t of targets) {
        t.currentHp -= dmg;
        if (t.currentHp <= 0) t.status = 'dead';
      }
      log.push(`✨ ${caster.heroId} uses ${ability.name}! ${dmg} AoE to ${targets.length} enemies`);
      break;
    }

    case 'heal_self': {
      const healAmt = Math.floor(caster.maxHp * effect.value);
      caster.currentHp = Math.min(caster.maxHp, caster.currentHp + healAmt);
      log.push(`💚 ${caster.heroId} uses ${ability.name}! Healed ${healAmt} HP`);
      break;
    }

    case 'buff_team': {
      const allies = units.filter((u) => u.isEnemy === caster.isEnemy && u.status === 'alive');
      for (const ally of allies) {
        ally.activeBuffs.push({
          type: 'attack_boost',
          value: effect.value,
          remainingTicks: effect.duration ?? 25,
        });
      }
      log.push(`⬆️ ${caster.heroId} uses ${ability.name}! Team buffed`);
      break;
    }

    case 'debuff': {
      const enemies = units.filter((u) => u.isEnemy !== caster.isEnemy && u.status === 'alive');
      for (const enemy of enemies) {
        enemy.activeBuffs.push({
          type: 'attack_reduction',
          value: effect.value,
          remainingTicks: effect.duration ?? 20,
        });
      }
      log.push(`⬇️ ${caster.heroId} uses ${ability.name}! Enemies debuffed`);
      break;
    }

    case 'summon': {
      // Shadow soldiers / clones — represented as temporary board units
      // For simplicity we deal bonus damage instead of actual summoning
      const target = findNearestEnemy(caster, units);
      if (!target) break;
      const dmg = Math.floor(caster.attack * effect.value * abilityPowerMult);
      target.currentHp -= dmg;
      if (target.currentHp <= 0) target.status = 'dead';
      log.push(`👥 ${caster.heroId} uses ${ability.name}! Shadow strike ${dmg} damage`);
      break;
    }
  }
}

export function findNearestEnemy(unit: BoardUnit, units: BoardUnit[]): BoardUnit | null {
  const enemies = units.filter((u) => u.isEnemy !== unit.isEnemy && u.status === 'alive');
  if (enemies.length === 0) return null;

  let nearest: BoardUnit | null = null;
  let minDist = Infinity;
  for (const e of enemies) {
    const d =
      Math.abs(e.hex.q - unit.hex.q) + Math.abs(e.hex.r - unit.hex.r);
    if (d < minDist) {
      minDist = d;
      nearest = e;
    }
  }
  return nearest;
}

function getAbilityPower(unit: BoardUnit): number {
  return unit.activeBuffs
    .filter((b) => b.type === 'ability_power_boost')
    .reduce((sum, b) => sum + b.value, 0);
}

export function getEffectiveAttack(unit: BoardUnit): number {
  const boost = unit.activeBuffs
    .filter((b) => b.type === 'attack_boost')
    .reduce((sum, b) => sum + b.value * unit.attack, 0);
  return unit.attack + boost;
}

export function getEffectiveDefense(unit: BoardUnit): number {
  const reduction = unit.activeBuffs
    .filter((b) => b.type === 'attack_reduction')
    .reduce((sum, b) => sum + b.value, 0);
  return unit.defense * (1 - reduction);
}
