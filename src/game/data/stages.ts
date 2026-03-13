import type { District } from '../types';

export const DISTRICTS: District[] = [
  {
    id: 'seoul_gate_district',
    name: 'Seoul Gate District',
    flavor: 'S-rank gates tear open across the city skyline. The streets run with monster ichor.',
    unlockCondition: { chapter: 1 },
    stages: [
      {
        id: 'ch1_s1',
        chapter: 1,
        stageNumber: 1,
        name: 'Gate Breach',
        cutscenePanels: [
          {
            imageKey: 'ch1_panel1',
            dialogue: [
              { speaker: 'Narrator', text: 'Seoul, 2025. A new gate has appeared downtown.' },
              { speaker: 'Sun Wukong', text: 'Finally. A worthy distraction.' },
            ],
          },
          {
            imageKey: 'ch1_panel2',
            dialogue: [
              { speaker: 'Hayate', text: 'These creatures are weak. Let\'s move fast.' },
              { speaker: 'Sun Wukong', text: 'Agreed. I\'ll take left. You take right.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_goblin', hex: { q: 0, r: 3 }, level: 1 },
              { templateId: 'gate_goblin', hex: { q: 1, r: 3 }, level: 1 },
              { templateId: 'gate_goblin', hex: { q: 2, r: 3 }, level: 1 },
            ],
          },
        ],
        rewards: {
          xp: 30,
          gold: 50,
          lootTable: [
            { templateId: 'iron_sword', dropChance: 0.3 },
            { templateId: 'leather_vest', dropChance: 0.3 },
            { templateId: 'worn_boots', dropChance: 0.4 },
          ],
        },
      },
      {
        id: 'ch1_s2',
        chapter: 1,
        stageNumber: 2,
        name: 'Overrun Streets',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_goblin', hex: { q: 0, r: 3 }, level: 1 },
              { templateId: 'gate_goblin', hex: { q: 2, r: 3 }, level: 1 },
              { templateId: 'gate_orc', hex: { q: 1, r: 4 }, level: 1 },
            ],
          },
        ],
        rewards: {
          xp: 40,
          gold: 70,
          lootTable: [
            { templateId: 'iron_sword', dropChance: 0.25 },
            { templateId: 'leather_vest', dropChance: 0.25 },
            { templateId: 'cloth_wraps', dropChance: 0.3 },
            { templateId: 'iron_helm', dropChance: 0.2 },
          ],
        },
      },
      {
        id: 'ch1_s3',
        chapter: 1,
        stageNumber: 3,
        name: 'The Mage\'s Ward',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_mage', hex: { q: 0, r: 4 }, level: 2 },
              { templateId: 'gate_goblin', hex: { q: 1, r: 3 }, level: 2 },
              { templateId: 'gate_goblin', hex: { q: 2, r: 3 }, level: 2 },
              { templateId: 'gate_orc', hex: { q: 3, r: 4 }, level: 2 },
            ],
          },
        ],
        rewards: {
          xp: 55,
          gold: 90,
          lootTable: [
            { templateId: 'iron_sword', dropChance: 0.2 },
            { templateId: 'cloth_wraps', dropChance: 0.25 },
            { templateId: 'iron_helm', dropChance: 0.2 },
            { templateId: 'worn_boots', dropChance: 0.35 },
          ],
        },
      },
      {
        id: 'ch1_s4',
        chapter: 1,
        stageNumber: 4,
        name: 'Troll Bridge',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_orc', hex: { q: 0, r: 3 }, level: 3 },
              { templateId: 'stone_troll', hex: { q: 1, r: 4 }, level: 2 },
              { templateId: 'gate_orc', hex: { q: 2, r: 3 }, level: 3 },
              { templateId: 'gate_mage', hex: { q: 3, r: 5 }, level: 3 },
            ],
          },
        ],
        rewards: {
          xp: 70,
          gold: 120,
          lootTable: [
            { templateId: 'leather_vest', dropChance: 0.2 },
            { templateId: 'phantom_dagger', dropChance: 0.1 },
            { templateId: 'jade_pendant', dropChance: 0.15 },
          ],
        },
      },
      {
        id: 'ch1_s5',
        chapter: 1,
        stageNumber: 5,
        name: 'Nezha\'s Arrival',
        cutscenePanels: [
          {
            imageKey: 'ch1_nezha_panel',
            dialogue: [
              { speaker: 'Narrator', text: 'A streak of fire cuts across the Seoul skyline.' },
              { speaker: 'Nezha', text: 'You two look like you could use some firepower.' },
              { speaker: 'Sun Wukong', text: 'Nezha! What are you doing here?' },
              { speaker: 'Nezha', text: 'Same thing you are. Fighting monsters and trying not to be bored.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_mage', hex: { q: 0, r: 4 }, level: 4 },
              { templateId: 'gate_mage', hex: { q: 2, r: 4 }, level: 4 },
              { templateId: 'stone_troll', hex: { q: 1, r: 3 }, level: 3 },
              { templateId: 'gate_orc', hex: { q: 3, r: 3 }, level: 4 },
            ],
          },
        ],
        rewards: {
          xp: 90,
          gold: 150,
          lootTable: [
            { templateId: 'phantom_dagger', dropChance: 0.2 },
            { templateId: 'shadow_cloak', dropChance: 0.1 },
            { templateId: 'jade_pendant', dropChance: 0.2 },
          ],
        },
        heroUnlock: 'nezha',
      },
      {
        id: 'ch1_s6',
        chapter: 1,
        stageNumber: 6,
        name: 'Gate Boss',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'gate_orc', hex: { q: 0, r: 3 }, level: 4 },
              { templateId: 'gate_mage', hex: { q: 2, r: 4 }, level: 4 },
              { templateId: 'boss_red_gate', hex: { q: 1, r: 5 }, level: 4 },
            ],
          },
        ],
        rewards: {
          xp: 150,
          gold: 250,
          lootTable: [
            { templateId: 'shadow_cloak', dropChance: 0.3 },
            { templateId: 'shinobi_gloves', dropChance: 0.25 },
            { templateId: 'jade_pendant', dropChance: 0.2 },
            { templateId: 'phantom_dagger', dropChance: 0.15 },
          ],
        },
      },
    ],
  },

  {
    id: 'beijing_megacity',
    name: 'Beijing Megacity',
    flavor: 'Ancient powers stir beneath glass towers. The old myths are not mere legend.',
    unlockCondition: { chapter: 2 },
    stages: [
      {
        id: 'ch2_s1',
        chapter: 2,
        stageNumber: 1,
        name: 'Neon Myths',
        cutscenePanels: [
          {
            imageKey: 'ch2_panel1',
            dialogue: [
              { speaker: 'Narrator', text: 'Beijing. The Dragon Ley Lines are awakening.' },
              { speaker: 'Sun Wukong', text: 'I can feel it. Something old is stirring.' },
              { speaker: 'Hayate', text: 'The jade sentinels have gone rogue.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'jade_sentinel', hex: { q: 0, r: 3 }, level: 5 },
              { templateId: 'jade_sentinel', hex: { q: 2, r: 3 }, level: 5 },
            ],
          },
        ],
        rewards: {
          xp: 100,
          gold: 160,
          lootTable: [
            { templateId: 'shadow_cloak', dropChance: 0.2 },
            { templateId: 'jade_pendant', dropChance: 0.25 },
          ],
        },
      },
      {
        id: 'ch2_s3',
        chapter: 2,
        stageNumber: 3,
        name: 'Dragon Spawn',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'jade_sentinel', hex: { q: 0, r: 3 }, level: 6 },
              { templateId: 'dragon_spawn', hex: { q: 1, r: 4 }, level: 6 },
              { templateId: 'dragon_spawn', hex: { q: 3, r: 4 }, level: 6 },
            ],
          },
        ],
        rewards: {
          xp: 130,
          gold: 200,
          lootTable: [
            { templateId: 'demon_blade', dropChance: 0.1 },
            { templateId: 'jade_crown', dropChance: 0.2 },
          ],
        },
      },
      {
        id: 'ch2_s4',
        chapter: 2,
        stageNumber: 4,
        name: 'Corrupted Arts',
        enemyWaves: [
          {
            enemies: [
              { templateId: 'corrupted_cultivator', hex: { q: 0, r: 4 }, level: 7 },
              { templateId: 'corrupted_cultivator', hex: { q: 2, r: 4 }, level: 7 },
              { templateId: 'jade_sentinel', hex: { q: 1, r: 3 }, level: 7 },
              { templateId: 'dragon_spawn', hex: { q: 3, r: 3 }, level: 7 },
            ],
          },
        ],
        rewards: {
          xp: 160,
          gold: 240,
          lootTable: [
            { templateId: 'demon_blade', dropChance: 0.15 },
            { templateId: 'jade_crown', dropChance: 0.2 },
            { templateId: 'shadow_ring', dropChance: 0.1 },
          ],
        },
      },
      {
        id: 'ch2_s8',
        chapter: 2,
        stageNumber: 8,
        name: 'The Shadow Monarch',
        cutscenePanels: [
          {
            imageKey: 'ch2_jinwoo_panel',
            dialogue: [
              { speaker: 'Narrator', text: 'A lone figure stands atop the Beijing Gate wreckage.' },
              { speaker: 'Jinwoo', text: 'You defeated the Jade Dragon. Impressive.' },
              { speaker: 'Sun Wukong', text: 'You were watching the whole time?' },
              { speaker: 'Jinwoo', text: 'I needed to see if you were worth working with. You are.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'dragon_spawn', hex: { q: 0, r: 3 }, level: 9 },
              { templateId: 'corrupted_cultivator', hex: { q: 1, r: 4 }, level: 9 },
              { templateId: 'boss_jade_dragon', hex: { q: 2, r: 5 }, level: 8 },
              { templateId: 'jade_sentinel', hex: { q: 3, r: 3 }, level: 9 },
            ],
          },
        ],
        rewards: {
          xp: 300,
          gold: 500,
          lootTable: [
            { templateId: 'demon_blade', dropChance: 0.3 },
            { templateId: 'shadow_ring', dropChance: 0.25 },
            { templateId: 'oni_plate', dropChance: 0.2 },
          ],
        },
        heroUnlock: 'jinwoo',
      },
    ],
  },

  {
    id: 'tokyo_demon_ward',
    name: 'Tokyo Demon Ward',
    flavor: 'Oni hunters patrol fog-covered alleys. The demon gates never fully close here.',
    unlockCondition: { chapter: 3 },
    stages: [
      {
        id: 'ch3_s1',
        chapter: 3,
        stageNumber: 1,
        name: 'Demon Alley',
        cutscenePanels: [
          {
            imageKey: 'ch3_panel1',
            dialogue: [
              { speaker: 'Narrator', text: 'Tokyo. The demon ward never sleeps.' },
              { speaker: 'Hayate', text: 'I know these streets. Stay close.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'lesser_oni', hex: { q: 0, r: 3 }, level: 10 },
              { templateId: 'demon_archer', hex: { q: 2, r: 4 }, level: 10 },
            ],
          },
        ],
        rewards: {
          xp: 200,
          gold: 300,
          lootTable: [
            { templateId: 'oni_plate', dropChance: 0.15 },
            { templateId: 'shadow_ring', dropChance: 0.1 },
          ],
        },
      },
      {
        id: 'ch3_s4',
        chapter: 3,
        stageNumber: 4,
        name: 'The Gate Opener',
        cutscenePanels: [
          {
            imageKey: 'ch3_iseul_panel',
            dialogue: [
              { speaker: 'Iseul', text: 'Wait! I can open a passage through the demon gate.' },
              { speaker: 'Jinwoo', text: 'And who are you?' },
              { speaker: 'Iseul', text: 'Park Iseul. I\'m the reason the gates can be closed.' },
              { speaker: 'Hayate', text: 'Then you\'d better stick with us.' },
            ],
          },
        ],
        enemyWaves: [
          {
            enemies: [
              { templateId: 'lesser_oni', hex: { q: 0, r: 3 }, level: 12 },
              { templateId: 'tengu', hex: { q: 1, r: 4 }, level: 12 },
              { templateId: 'demon_archer', hex: { q: 2, r: 4 }, level: 12 },
              { templateId: 'lesser_oni', hex: { q: 3, r: 3 }, level: 12 },
            ],
          },
        ],
        rewards: {
          xp: 280,
          gold: 420,
          lootTable: [
            { templateId: 'dragon_scale_armor', dropChance: 0.1 },
            { templateId: 'wind_fire_wheels', dropChance: 0.05 },
          ],
        },
        heroUnlock: 'iseul',
      },
    ],
  },
];

export function getStage(stageId: string): import('../types').Stage | undefined {
  for (const district of DISTRICTS) {
    const stage = district.stages.find((s) => s.id === stageId);
    if (stage) return stage;
  }
  return undefined;
}

export function getAllStages(): import('../types').Stage[] {
  return DISTRICTS.flatMap((d) => d.stages);
}
