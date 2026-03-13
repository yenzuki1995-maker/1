import { XP_TO_LEVEL, MAX_HERO_LEVEL } from '../constants';
import type { HeroInstance } from '../types';

export function addXpToHero(instance: HeroInstance, xpGain: number): HeroInstance {
  if (instance.level >= MAX_HERO_LEVEL) return instance;

  let { level, xp, xpToNextLevel } = instance;
  xp += xpGain;

  while (level < MAX_HERO_LEVEL && xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = getXpToNextLevel(level);
  }

  if (level >= MAX_HERO_LEVEL) xp = 0;

  return { ...instance, level, xp, xpToNextLevel };
}

export function getXpToNextLevel(level: number): number {
  if (level >= MAX_HERO_LEVEL) return 0;
  return XP_TO_LEVEL[level + 1] - XP_TO_LEVEL[level];
}

export function getFragmentsForLevel(level: number): number {
  return Math.floor(level * 1.5);
}
