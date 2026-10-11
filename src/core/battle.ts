// Battle Engine — presentation-independent (master prompt §63-§66).
// Produces events; the Phaser renderer turns them into feedback.
// Supports TowerBattle (1×1 active hero) and BossBattle (whole team ×1 boss).

import { COMBAT } from '../config/balance';
import type { BattleEvent, CombatStats, SkillDef } from './types';
import type { Rng } from './rng';

export interface Fighter {
  id: string;
  side: 'hero' | 'enemy';
  stats: CombatStats;
  hp: number;
  skill?: SkillDef;
  skillReadyAt: number;
  nextAttackAt: number;
}

export interface BattleTickResult {
  events: BattleEvent[];
  finished: 'hero_win' | 'hero_lose' | null;
}

export function makeFighter(
  id: string,
  side: 'hero' | 'enemy',
  stats: CombatStats,
  skill?: SkillDef,
): Fighter {
  return { id, side, stats, hp: stats.maxHp, skill, skillReadyAt: 0, nextAttackAt: 0 };
}

export function damageFormula(
  attacker: CombatStats,
  defender: CombatStats,
  rng: Rng,
  mult = 1,
): { amount: number; critical: boolean } {
  const critical = rng() < attacker.crit;
  const mitigation = COMBAT.defenseBase / (COMBAT.defenseBase + defender.defense);
  const variance = 0.9 + rng() * 0.2;
  let amount = attacker.attack * mitigation * mult * variance;
  if (critical) amount *= COMBAT.criticalMultiplier;
  return { amount: Math.max(1, Math.round(amount)), critical };
}

/**
 * Advance the battle simulation. `now` is a monotonic ms clock.
 * Every fighter whose cooldown elapsed and who has a live opposing target attacks.
 */
export function tickBattle(fighters: Fighter[], now: number, rng: Rng): BattleTickResult {
  const events: BattleEvent[] = [];
  const heroes = () => fighters.filter((f) => f.side === 'hero' && f.hp > 0);
  const enemies = () => fighters.filter((f) => f.side === 'enemy' && f.hp > 0);

  for (const f of fighters) {
    if (f.hp <= 0) continue;
    const targets = f.side === 'hero' ? enemies() : heroes();
    if (targets.length === 0) break;
    const target = targets[0];

    if (now >= f.nextAttackAt) {
      const cd = f.side === 'hero' ? COMBAT.heroAttackCooldownMs : COMBAT.enemyAttackCooldownMs;
      f.nextAttackAt = now + cd;

      let mult = 1;
      let hits = 1;
      let lifesteal = 0;
      let healFrac = 0;
      if (f.skill && now >= f.skillReadyAt) {
        f.skillReadyAt = now + f.skill.cooldownMs;
        mult = f.skill.damageMult;
        hits = f.skill.hits;
        lifesteal = f.skill.lifesteal;
        healFrac = f.skill.healFraction;
        events.push({ type: 'skill_used', attackerId: f.id, skillId: f.skill.id, ts: now });
      }

      events.push({ type: 'attack_started', attackerId: f.id, targetId: target.id, ts: now });

      for (let i = 0; i < hits; i++) {
        if (target.hp <= 0) break;
        const { amount, critical } = damageFormula(f.stats, target.stats, rng, mult);
        target.hp = Math.max(0, target.hp - amount);
        events.push({
          type: 'damage_dealt',
          attackerId: f.id,
          targetId: target.id,
          amount,
          critical,
          ts: now,
        });
        if (critical) events.push({ type: 'critical_hit', attackerId: f.id, targetId: target.id, amount, ts: now });
        events.push({
          type: target.side === 'hero' ? 'character_damaged' : 'enemy_damaged',
          targetId: target.id,
          amount,
          ts: now,
        });
        if (lifesteal > 0) {
          const heal = Math.round(amount * lifesteal);
          f.hp = Math.min(f.stats.maxHp, f.hp + heal);
          events.push({ type: 'character_healed', targetId: f.id, amount: heal, ts: now });
        }
        if (target.hp <= 0) {
          events.push({
            type: target.side === 'hero' ? 'character_defeated' : 'enemy_defeated',
            targetId: target.id,
            attackerId: f.id,
            ts: now,
          });
        }
      }

      if (healFrac > 0) {
        const heal = Math.round(f.stats.maxHp * healFrac);
        f.hp = Math.min(f.stats.maxHp, f.hp + heal);
        events.push({ type: 'character_healed', targetId: f.id, amount: heal, ts: now });
      }
    }
  }

  let finished: BattleTickResult['finished'] = null;
  if (enemies().length === 0 && heroes().length > 0) finished = 'hero_win';
  else if (heroes().length === 0) finished = 'hero_lose';
  if (finished) {
    events.push({ type: finished === 'hero_win' ? 'battle_won' : 'battle_lost', ts: now });
    events.push({ type: 'battle_finished', ts: now });
  }
  return { events, finished };
}
