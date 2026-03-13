// ── Hero ──────────────────────────────────────────────────────────────────────
export type HeroClass =
  | 'Trickster'
  | 'Shinobi'
  | 'Hunter'
  | 'Cultivator'
  | 'OniSlayer'
  | 'Awakened';

export type HeroOrigin =
  | 'ChineseMythology'
  | 'Japanese'
  | 'Korean'
  | 'PanAsian';

export type EquipSlot = 'weapon' | 'armor' | 'helm' | 'gloves' | 'boots' | 'accessory';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AttackRange = 'melee' | 'ranged' | 'magic';

export interface AbilityEffect {
  type:
    | 'damage_single'
    | 'damage_aoe'
    | 'heal_self'
    | 'buff_team'
    | 'summon'
    | 'debuff';
  value: number;
  radius?: number;   // hex radius for AoE
  duration?: number; // in ticks
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldownTicks: number;
  effect: AbilityEffect;
}

export interface HeroDefinition {
  id: string;
  name: string;
  title: string;
  heroClass: HeroClass;
  origin: HeroOrigin;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseAttackSpeed: number; // attacks per second
  attackRange: AttackRange;
  abilities: AbilityDefinition[]; // [0]=base, [1]=lvl10, [2]=lvl20, [3]=lvl30
  unlockCondition: { chapter: number; stage: number } | 'starter';
}

export interface HeroInstance {
  definitionId: string;
  level: number; // 1–30
  xp: number;
  xpToNextLevel: number;
  skillFragments: number;
  unlockedSkillNodeIds: string[];
  equipment: Partial<Record<EquipSlot, string>>; // slot → itemInstanceId
}

// ── Skill Tree ────────────────────────────────────────────────────────────────
export type SkillBranch = 'offense' | 'survival' | 'special';
export type SkillStat = 'attack' | 'defense' | 'hp' | 'attackSpeed' | 'abilityPower';

export interface SkillEffect {
  stat: SkillStat;
  type: 'flat' | 'percent';
  value: number;
}

export interface SkillNode {
  id: string;
  heroId: string;
  name: string;
  description: string;
  tier: number; // 0–4
  branch: SkillBranch;
  position: { col: number; row: number }; // grid position for rendering
  fragmentCost: number;
  requires: string[]; // prerequisite node IDs
  effect: SkillEffect;
}

// ── Equipment ─────────────────────────────────────────────────────────────────
export type EquipStat = 'attack' | 'defense' | 'hp' | 'attackSpeed';

export interface ItemTemplate {
  id: string;
  name: string;
  slot: EquipSlot;
  rarity: Rarity;
  statBonuses: Partial<Record<EquipStat, number>>;
  dropSource: string[]; // stage IDs where this can drop
}

export interface ItemInstance {
  id: string;          // unique UUID
  templateId: string;
  upgradeLevel: number; // 0–10; each +1 = +10% stats
}

// ── Hex Board & Combat ────────────────────────────────────────────────────────
export interface HexCoord {
  q: number;
  r: number;
}

export interface Buff {
  type: string;
  value: number;
  remainingTicks: number;
}

export interface BoardUnit {
  unitId: string;
  heroId: string;
  isEnemy: boolean;
  hex: HexCoord;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  attackCooldown: number;
  currentMana: number;
  maxMana: number;
  status: 'alive' | 'dead';
  activeBuffs: Buff[];
  abilities: AbilityDefinition[];
}

export interface BattleState {
  units: BoardUnit[];
  tick: number;
  log: string[];
  outcome: 'pending' | 'victory' | 'defeat';
}

// ── Base: Buildings ───────────────────────────────────────────────────────────
export interface BuildingEffect {
  target: { origin?: HeroOrigin; heroClass?: HeroClass } | 'all';
  stat: 'attack' | 'defense' | 'hp' | 'abilityPower';
  bonusPerLevel: number; // % per building level
}

export interface BuildingDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  maxLevel: number;
  upgradeCost: (level: number) => { gold: number; materials: number };
  effect: BuildingEffect;
}

// ── Base: Bonds ───────────────────────────────────────────────────────────────
export interface BondEffect {
  level: number;
  description: string;
  passiveBonus?: SkillEffect;
  abilityUnlock?: AbilityDefinition;
}

export interface BondDefinition {
  id: string;
  heroIds: [string, string] | [string, string, string];
  name: string;
  lore: string;
  thresholds: number[]; // XP needed to reach bond levels 1–5
  levelEffects: BondEffect[];
}

// ── World Map ─────────────────────────────────────────────────────────────────
export interface CutscenePanel {
  imageKey: string; // asset key
  dialogue: { speaker: string; text: string }[];
}

export interface EnemyWave {
  enemies: { templateId: string; hex: HexCoord; level: number }[];
}

export interface StageReward {
  xp: number;
  gold: number;
  lootTable: { templateId: string; dropChance: number }[]; // dropChance 0–1
}

export interface Stage {
  id: string;
  chapter: number;
  stageNumber: number;
  name: string;
  cutscenePanels?: CutscenePanel[];
  enemyWaves: EnemyWave[];
  rewards: StageReward;
  heroUnlock?: string;
}

export interface District {
  id: string;
  name: string;
  flavor: string;
  unlockCondition: { chapter: number };
  stages: Stage[];
}

// ── Enemy Template ────────────────────────────────────────────────────────────
export interface EnemyTemplate {
  id: string;
  name: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  attackRange: AttackRange;
  attackSpeed: number;
}

// ── Game State ────────────────────────────────────────────────────────────────
export interface GameState {
  heroes: Record<string, HeroInstance>;       // heroId → instance
  unlockedHeroIds: string[];
  inventory: Record<string, ItemInstance>;    // instanceId → item
  resources: { gold: number; materials: number };
  buildingLevels: Record<string, number>;     // buildingId → level (0 = not built)
  bondXp: Record<string, number>;             // bondId → accumulated XP
  clearedStages: string[];                    // stageId[]
  currentChapter: number;
  playerBoard: Record<string, HexCoord>;      // heroId → pre-battle placement
  isInitialized: boolean;
}
