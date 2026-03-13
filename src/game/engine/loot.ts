import type { ItemInstance, StageReward } from '../types';
import { uuid } from '../utils/format';

export interface LootResult {
  items: ItemInstance[];
  gold: number;
  xp: number;
}

export function rollLoot(reward: StageReward): LootResult {
  const items: ItemInstance[] = [];

  for (const entry of reward.lootTable) {
    if (Math.random() < entry.dropChance) {
      items.push({
        id: uuid(),
        templateId: entry.templateId,
        upgradeLevel: 0,
      });
    }
  }

  return {
    items,
    gold: reward.gold,
    xp: reward.xp,
  };
}
