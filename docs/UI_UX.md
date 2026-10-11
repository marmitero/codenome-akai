# UI/UX
Full-screen, portrait-first (§59/§67/§69). Zonas: topo = Rei/recursos (kingBar);
centro = arena; base = navegação (quadrados de arte + labels pixel). Menus = overlays
em cena própria (não pausam o idle). Todo texto em bitmap font do pack (Text1.png).
Botões/painéis/ícones = crops do pack GUI (assets.ts UI.*). DOM usado apenas para o
input de nickname (necessidade técnica de teclado mobile). Sem hover-dependência.
Resize: cenas de menu reiniciam; Torre re-ancora HUD (polish de resize contínuo = PENDING).
