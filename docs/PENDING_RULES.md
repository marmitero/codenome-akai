# PENDING RULES — decisões aguardando definição humana ou fase futura

Regras de gameplay/economia crítica NÃO são inventadas (§73): ficam PENDING.

| ID | Tema | Status | Nota |
|---|---|---|---|
| P-01 | Split exato de XP da equipe | TEMP (balance.ts `teamSplitShares` [1.0, 0.6, 0.45]) | monotonia 1>2>3 é obrigatória; valores finais = decisão de design |
| P-02 | VIP benefícios/duração/preço | PENDING | arquitetura pronta (flag `vip`); não implementar pagamento agora |
| P-03 | Preço/monetização (Diamonds, Battle Pass) | PENDING | fase MONETIZAÇÃO |
| P-04 | Recuperação de vida no Lobby p/ VIP + auto-retorno | PENDING | descrito no §117; não implementado |
| P-05 | Características por tipo de arma (§72) | PENDING | categorias existem; traits = PENDING |
| P-06 | Curvas finais de XP/coin | TEMP | baselines em balance.ts |
| P-07 | Conteúdo de Boss (arena/dungeon/world/guild) | PENDING | engine 3×1 pronta; cena/design = fase 12 |
| P-08 | Regras de chat/guildas/arena | PENDING | fase online/social |
| P-09 | Summon/caixas/aquisição de heróis | PENDING | §11 lista métodos; economia = decisão humana |
| P-10 | Deploy Vercel produção + variáveis | PARCIAL | build pronto; secrets/Supabase = fase online |

Temporários implementados estão marcados no código como tal e centralizados em
`src/config/balance.ts`.
