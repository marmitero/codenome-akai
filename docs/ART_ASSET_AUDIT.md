# ART ASSET AUDIT — repositório codenome-akai

Inventário REAL gerado na FASE 0 (2026-10-11) com `tools/summarize_packs.py`,
`tools/png_size.py`, `tools/components.py` e inspeção visual (`tools/frame_probe.py`).
20.757 arquivos no repo; 15.755 PNGs. Licença de todos os packs: CraftPix Free
(`License.txt` → https://craftpix.net/file-licenses/).

## Convenções verificadas

- **Personagens/mobs (packs "4 direction")**: spritesheets de frames 64×64,
  4 linhas = direções na ordem **[down, left, right, up]** (verificado visualmente
  com `tools/frame_probe.py` em `male_idle_rows.png` / `slime1_idle_rows.png`).
  Animações por pack: Idle / Walk / Run / Attack / Hurt / Death (+ Run_Attack/Walk_Attack em alguns).
- **Tilesets**: tiles de 16×16 (cursed land, path/road, rocks, bushes, trees, undead...).
- **GUI pack** (`free-basic-pixel-art-ui-for-rpg`): folhas únicas (Buttons.png 400×528,
  Inventory.png 336×160, character_panel.png 192×160, Icons.png 96×304, Text1.png 70×322).
  `Text1.png` é um alfabeto pixel completo (A–Z, 0–9, `.,:?!()+-=`) em 7 variantes de cor,
  grade fixa: linhas y=1/10/19/28/37, pitch 7px, x0=1, variante = faixa de 46px.
- Packs "boss" (pirate/tribal/top-down-boss/goblin chief): sequências PNG de frames grandes
  (840×720 etc.), NÃO 64×64 — reservados para a fase de Bosses.

## Packs e uso no MVP local

| Pack | Conteúdo | Uso |
|---|---|---|
| free-base-4-direction-male-character-pixel-art | herói 4-dir (Sword/Unarmed) | Rei (skin) + herói Guardião |
| free-base-4-direction-female-character-pixel-art | heroína 4-dir | Rainha (skin) + heroína Duelista |
| free-swordsman-1-3-level-pixel-top-down-sprite-character | guerreiro 4-dir (3 níveis) | herói Guerreiro (lvl1) |
| free-vampire-4-direction-pixel-character-sprite-pack | vampiros 4-dir (2 variants) | herói Ceifador + mob elite |
| free-slime-mobs-pixel-art-top-down-sprite-pack | 3 slimes 4-dir | mobs andares 1–3 |
| free-predator-plant-mobs-pixel-art-pack | plantas predadoras 4-dir | mobs andares 4–5 |
| free-top-down-orc-game-character-pixel-art | orcs 4-dir | mobs andares 6–7/9–10 |
| free-cursed-land-top-down-pixel-art-tileset | ground 16px, objetos, água | chão/bordas da Torre |
| free-rocks-and-stones-top-down-pixel-art | rochas avulsas 32/64px | obstáculos/decoração |
| free-basic-pixel-art-ui-for-rpg | botões, painéis, ícones, fonte pixel | HUD/GUI inteira |

## Crops de GUI validados (em px da folha)

- Botões rotulados (coluna esquerda, x=13,w=56,h=12): RESUME y274, RESTART y290,
  SETTINGS y306, LEVELS y322, INVENTORY y338, EQUIPMENT y354, SHOP y370, CRAFT y386, QUIT y402;
  CREATE (18,468,43,14); DECLINE (4,258,39,13); SAVE (212,258,39,13); square (13,12,22,23);
  blank wide (16,435,128,12); AGAIN (210,12,29,13); NEXT (210,44,29,13); BUY (211,170,26,14).
- Painéis Inventory.png: empty (7,0,98,101), grid (119,0,98,101), titled (231,0,98,101);
  titleBar (48,112,89,16); setas (177,113,14,14)/(193,113,14,14).
- Ícones: coin (243,115,10,10), diamond (260,115,9,11), ~20 item icons 12×12 (y130–159).

## Tiles de chão validados (grade 16px de Ground.png)

- Flat walkable: (17,1), (34,4), (3,2), (12,2) — detectados por `full alpha + baixa variância`.
- Borda/obstáculo "thorn bush": (0,0), (2,0).

## Lacunas (PENDING de arte)

1. **Áudio**: nenhum pack de áudio no repositório → `AUDIO_GUIDELINES.md` registra aquisição futura.
2. **Bitmap font branca/clara para fundos claros**: variantes existentes são escuras/teal; aceitável por ora.
3. **Retrato/bust dedicado do Rei**: packs só têm corpos 64×64; usamos frame idle-front como retrato
   (aceitável §4). Lacuna registrada para arte futura de busto real.
4. **Bosses**: packs de boss existem (pirate/tribal/4-dir boss, goblin chief) mas usam sequências
   grandes; pipeline de conversão para a fase BOSS ainda não implementado.
5. **Ícones de skill/projéteis**: sem pack de efeitos; feedback atual = flash/tween + números
   (adaptação técnica permitida §60). Documentar geração/aquisição futura.
6. **Autotiling completo**: usamos flat tiles + bordas bush; autotile real é polish futuro.

Nenhum placeholder genérico (emoji/gradiente) é usado como arte final.
