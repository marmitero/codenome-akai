# ARCHITECTURE — Codenome: AKAI

Stack: **TypeScript + Vite + Phaser 3** (renderização/apresentação) + **Vitest**.
Online (fase futura): Supabase (Auth Google, Postgres+RLS, Realtime) + Vercel.

## Separação obrigatória (§63/§64)

```
src/core        → regras puras, SEM Phaser: state, battle, xp, equipment,
                  market, offline, persistence, rng, types        (testável headless)
src/config      → balance centralizado, heróis, andares, asset manifest
src/ui          → PixelText (bitmap font), widgets de arte, HUD
src/scenes      → Phaser scenes (apresentação + input)
src/game        → sessão runtime (singleton GameState, debug flag)
tools/          → inspeção/pipeline de assets (python)
tests/          → vitest (core apenas)
```

O renderer **apresenta eventos**; nunca decide economia. `BattleEngine.tickBattle`
produz `BattleEvent[]` e é usado em testes e na fase Boss; a Torre usa as mesmas
fórmulas (`damageFormula`) com AI de movimentação na cena.

## Persistência
`PersistenceService` (interface) → `LocalStoragePersistence` (MVP).
Troca LOCAL → SUPABASE sem reescrever sistemas (§83). Save em eventos-chave,
ao sair de cena e em `visibilitychange`.

## Assets
Originais nunca são renomeados/movidos (§61). `src/config/assets.ts` é o manifesto
com caminhos estáveis; `tools/prepare_public_assets.mjs` (lista única em
`tools/asset_list.json`, espelho `.py`) copia SOMENTE os arquivos referenciados para
`public/` — necessário apenas p/ `vite build`/Vercel; o dev server serve da raiz.
Windows local: `jogar.bat` na raiz instala e sobe tudo sem Python.
Baking em runtime: spritesheets 64×64 + animações por direção (down/left/right/up),
crops de GUI e bitmap font via canvas NEAREST.

## Cenas
boot → king_creation → hero_choice → lobby ⇄ tower (+ overlays em scene.launch:
inventory, team, tower_select, settings). Overlays rodam em paralelo: o loop idle
**continua** enquanto menus compatíveis estão abertos (§29).

## Escala/responsividade
Phaser Scale.RESIZE + `100dvh`; HUD ancorada em zonas (topo Rei/recursos, centro
arena, base navegação). Sprite scale fixo; layout relativo a width/height da câmera.
Safe areas via viewport-fit=cover; sem hover/teclado.

## Config central
Toda probabilidade/custo/fórmula em `src/config/balance.ts` (drop 5%, raridades,
X 0.5–2.2, fee 15%, slots, offline 2h/8h, search 3s, respawn 5s, curvas de XP,
split de equipe). Nada hardcodado fora de config.
