# COMBAT SYSTEM
- TowerBattle: 1 herói ativo × mobs visíveis no mapa; auto-battle (§56-58).
- BossBattle: equipe inteira × 1 boss (tickBattle suporta N×1; cena = fase 12).
- Fórmula: `BASE × mitigação(def) × mult × variação(0.9–1.1)`, crítico ×1.5 (core/battle.damageFormula).
- Cooldowns: herói 900ms; inimigo 1200ms; alcance inimigo ≈1 tile (26px); aggro 5 tiles.
- Eventos: battle_started/attack_started/skill_used/damage_dealt/critical_hit/
  character_damaged/enemy_damaged/character_healed/character_defeated/enemy_defeated/
  battle_won/battle_lost/battle_finished.
- Inimigos: respawn 5s NO spawn original (§27); vários podem atacar simultaneamente.
- Derrota do herói → volta ao Lobby (P-04 VIP auto-revive PENDING).
