# AI_STATE — Codenome: AKAI

Última atualização: 2026-10-11 (sessão arena/9008fa86, revisão 2).

## Revisão 2 (correções desta sessão)
1. **Rei separado dos heróis**: 4 retratos gerados (`generated/king_portraits/`),
   busto apenas, chroma-key magenta no boot; criação do Rei cicla os 4 retratos.
   Migração de saves antigos ('male'/'female' → m1/f1).
2. **Setas verdes** do pack GUI (Buttons.png) em escala 4 p/ navegação de criação/escolha.
3. **Fonte**: variante tan + drop-shadow escuro (2-pass) — texto legível.
4. **Pathfinding A*** (`core/pathfinding.ts` + testes): herói e mobs contornam rochas;
   repath periódico + ao trocar alvo + se bloqueado.
5. **Janelas por propósito**: Levels p/ Torre, Settings p/ Rei, character_panel p/ Equipe,
   Inventory só no inventário, popup offline sem grades.

## Estado atual
**MVP local (vertical slice) IMPLEMENTADO e jogável em dev (`npm run dev`).**

### O que existe (arquivos principais)
- Config: `src/config/balance.ts` (toda regra numérica centralizada), `heroes.ts`, `floors.ts`, `assets.ts` (manifesto).
- Core puro (testável): `state.ts`, `battle.ts`, `xp.ts`, `equipment.ts`, `market.ts`, `offline.ts`, `persistence.ts`, `rng.ts`, `types.ts`.
- UI de arte: `ui/PixelText.ts` (bitmap font do Text1.png), `ui/widgets.ts`, `ui/hud.ts`.
- Cenas: `BootScene`, `KingCreationScene`, `HeroChoiceScene`, `LobbyScene`, `TowerScene`,
  overlays `InventoryOverlay`, `TeamOverlay`, `TowerSelectOverlay`, `SettingsOverlay` (debug dev-only).
- Pipeline: `tools/prepare_public_assets.py` (public/ p/ build), `vercel.json`.
- Docs completos em `docs/` + `docs/ART_ASSET_AUDIT.md`.
- Testes: `tests/*.test.ts` (30 testes passando).

### Sistemas implementados
Rei (nome+skin+validação), escolha 1-de-4, equipe 3 slots c/ custos, herói ativo,
Torre 10 andares sem boss, auto-battle c/ skills, inimigos c/ aggro+respawn 5s no spawn,
loot 5% c/ raridade+X individual+qualidade, inventário equipar/vender, XP dividido,
XP do Rei, offline 2h/8h, save local, debug mode (?debug=1), HUD full-screen portrait.

### Como testar
`npm run dev` → abrir preview. `?debug=1` habilita Debug Mode. `npm test`, `npm run build`.

### Bugs conhecidos / polish PENDING
- Resize durante a Torre não re-ancora a HUD (só cenas de menu reiniciam).
- Sem áudio (lacuna de asset). Sem efeitos de projétil (adaptação tween/flash).
- Retrato do Rei = frame idle-front (busto dedicado PENDING).
- Cena de Boss PENDING (engine 3×1 pronta e testada).

### Decisões técnicas (Tipo B) registradas
- PixelFont por grade fixa verificada (não labeling runtime).
- Movimento manual sem arcade physics. Overlays = scenes paralelas (idle continua).
- DOM input só para nickname.

### Próximo passo lógico
1. Cena de Boss (Boss Arena 3×1) com packs de boss convertidos (fase 12).
2. Polish: resize contínuo da Torre, atlas de UI, áudio quando adquirido.
3. Fase online: Supabase + Google Auth + chat + mercado.
