// Codenome: AKAI — core domain types.
// These are pure data shapes; they do NOT depend on Phaser.

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'celestial';

export type EquipSlot = 'weapon' | 'armor' | 'accessory';

export type WeaponType =
  | 'espada'
  | 'adaga'
  | 'machado'
  | 'maca'
  | 'besta'
  | 'cajado'
  | 'livro_arcano'
  | 'luvas'
  | 'garras';

export interface StatBlock {
  attack: number;
  defense: number;
  hp: number;
  crit: number; // 0..1 chance
}

/** X multiplier applied per-stat. Each stat rolls its own X (never shared). */
export type XValues = Partial<Record<keyof StatBlock, number>>;

export interface Equipment {
  id: string;
  ownerId: string | null;
  characterId: string | null;
  slot: EquipSlot;
  itemType: WeaponType | 'armor' | 'accessory';
  level: number;
  rarity: Rarity;
  stats: StatBlock;
  xValues: XValues;
  quality: number; // 0..1 derived from average X
  sellValue: number;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

export interface SkillDef {
  id: string;
  name: string;
  cooldownMs: number;
  /** damage multiplier applied to a normal hit */
  damageMult: number;
  /** fraction of max hp healed on use (0 = none) */
  healFraction: number;
  /** number of consecutive hits */
  hits: number;
  /** lifesteal fraction of damage dealt */
  lifesteal: number;
}

export interface HeroDef {
  defId: string;
  name: string;
  className: string;
  role: string;
  /** sprite set key in the asset manifest */
  spriteSet: string;
  base: StatBlock;
  /** stat growth added per level */
  growth: StatBlock;
  skill: SkillDef;
  weapon: WeaponType;
  description: string;
}

export interface HeroInstance {
  id: string;
  defId: string;
  name: string;
  level: number;
  xp: number;
  stars: number;
  equipment: Record<EquipSlot, Equipment | null>;
}

export interface KingState {
  name: string;
  /** king portrait id (KING_PORTRAITS) */
  skin: string;
  level: number;
  xp: number;
  coins: number;
  diamonds: number;
  vip: boolean;
  highestFloor: number;
  createdAt: number;
  lastActiveAt: number;
  tutorialDone: boolean;
}

export interface TeamState {
  /** hero ids, index = slot (0..2). null = empty */
  slots: (string | null)[];
  /** whether each slot is unlocked */
  unlocked: boolean[];
  /** which unlocked slot is the active combatant in the Tower */
  activeIndex: number;
}

export interface SaveState {
  version: number;
  king: KingState | null;
  heroes: Record<string, HeroInstance>;
  chosenInitialHero: string | null;
  team: TeamState;
  inventory: Equipment[];
}

export interface CombatStats extends StatBlock {
  maxHp: number;
}

export type BattleEventType =
  | 'battle_started'
  | 'attack_started'
  | 'skill_used'
  | 'damage_dealt'
  | 'critical_hit'
  | 'status_applied'
  | 'character_damaged'
  | 'enemy_damaged'
  | 'character_healed'
  | 'character_defeated'
  | 'enemy_defeated'
  | 'battle_won'
  | 'battle_lost'
  | 'battle_finished';

export interface BattleEvent {
  type: BattleEventType;
  attackerId?: string;
  targetId?: string;
  amount?: number;
  critical?: boolean;
  skillId?: string;
  ts: number;
}

export interface EnemyDef {
  id: string;
  name: string;
  spriteSet: string;
  base: StatBlock;
  xpReward: number;
  coinReward: number;
}
