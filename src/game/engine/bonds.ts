import { BONDS, getBondLevel } from '../data/bonds';
import { BOND_XP_PER_BATTLE } from '../constants';

// Given the heroes who participated in a battle, award bond XP to all relevant bonds.
export function awardBondXp(
  participatingHeroIds: string[],
  currentBondXp: Record<string, number>,
): Record<string, number> {
  const updated = { ...currentBondXp };

  for (const bond of Object.values(BONDS)) {
    const allPresent = bond.heroIds.every((id) => participatingHeroIds.includes(id));
    if (!allPresent) continue;

    updated[bond.id] = (updated[bond.id] ?? 0) + BOND_XP_PER_BATTLE;
  }

  return updated;
}

export interface BondLevelUp {
  bondId: string;
  newLevel: number;
}

// Compare old and new bond XP to find any level-ups
export function checkBondLevelUps(
  oldBondXp: Record<string, number>,
  newBondXp: Record<string, number>,
): BondLevelUp[] {
  const levelUps: BondLevelUp[] = [];

  for (const bond of Object.values(BONDS)) {
    const oldLevel = getBondLevel(oldBondXp[bond.id] ?? 0, bond.thresholds);
    const newLevel = getBondLevel(newBondXp[bond.id] ?? 0, bond.thresholds);
    if (newLevel > oldLevel) {
      levelUps.push({ bondId: bond.id, newLevel });
    }
  }

  return levelUps;
}
