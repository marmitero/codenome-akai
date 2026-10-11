# Codenome: AKAI

RPG 2D Idle / Auto-Battle / Loot / Tower Progression para navegador.
Você é o **Rei**; seus campeões lutam na Torre.

## Jogar no Windows (zip do GitHub)

1. Baixe o ZIP do repositório e extraia.
2. Instale o [Node.js LTS](https://nodejs.org) (se ainda não tiver).
3. Dê dois cliques em **`jogar.bat`**.
4. O jogo abre em `http://localhost:5173`.

O bat instala as dependências na primeira vez e sobe o servidor local.
Modo debug (dev): `http://localhost:5173/?debug=1`.

## Manual (qualquer SO)

```bash
npm install
npm run dev        # joga em http://localhost:5173
```

## Build de produção

```bash
npm run assets:prepare   # copia os assets referenciados p/ public/
npm run build            # tsc + vite build (dist/)
npm run test             # vitest (regras de gameplay/economia)
```

## Estrutura

- `src/core` regras puras testáveis · `src/config` balance centralizado + manifesto de assets
- `src/scenes` Phaser 3 · `docs/` GDD/sistemas · `AI_STATE.md` estado do projeto
- Assets: packs CraftPix do próprio repositório (originais intocados) + retratos do Rei em `generated/`.
