# GDD — Codenome: AKAI (resumo executivo)

RPG 2D Idle / Auto-Battle / Loot / Tower Progression para navegador.
Mobile-portrait-first, tela cheia, identidade de jogo mobile (não é um site/dashboard).

## Fantasia
O jogador é o **REI** (meta-personagem = conta). Os heróis são **súditos/campeões**,
entidades colecionáveis e comerciáveis. O Rei administra; os campeões lutam.

## Pilares
1. **Idle de verdade**: combate automático; o jogador configura/decide, não clica para atacar.
2. **Loot com valor**: drop raro (5% baseline), raridade + X individual + qualidade; god rolls existem.
3. **Torre como teste individual**: andares = campos de caça sem boss; a equipe é estratégica
   (XP dividido entre membros).
4. **Boss como evento especial**: conteúdo separado, equipe inteira (3×1).
5. **Economia com sinks**: taxa de mercado 15% consumida; desbloqueios caros (slots 2/3).
6. **Progresso contínuo**: offline progress com teto (2h free / 8h VIP).

## Identidade
- Conta = 1 Rei (nickname único no online; validação local no MVP).
- Criação: nome + skin (arquitetado para skins futuras).
- 4 heróis iniciais, escolha de 1; diferenças reais de função/atributos/skills.
- Equipe: slot 1 grátis; slot 2 = nv 10 + 150.000 coin; slot 3 = nv 25 + 1.000.000 coin.

## Loop principal (vertical slice implementado)
Criar Rei → escolher 1 de 4 → equipe → escolher herói ativo → entrar na Torre →
batalha automática (herói caminha até o inimigo mais próximo; inimigos agreem e atacam
a ≤1 tile; respawn 5s no spawn original) → vitória → XP (dividido) + Coin + loot possível →
"Procurando..." (~3s sem alvo) → próximo inimigo → limpar andar (10 abates) → próximo andar.
Derrota → volta ao Lobby. Fechar navegador → offline progress no retorno.

## Sistemas (estado atual)
| Sistema | Status MVP local |
|---|---|
| Rei/nickname/skin | ✅ |
| 4 heróis iniciais + escolha | ✅ |
| Equipe 3 slots c/ desbloqueio | ✅ |
| Combate 1×1 auto + skills | ✅ |
| Torre 10 andares, sem boss | ✅ |
| Loot/raridade/X/inventário/venda/equip | ✅ |
| XP herói + XP Rei (divisão de equipe) | ✅ |
| Offline progress (teto free) | ✅ |
| Debug Mode (?debug=1) | ✅ dev-only |
| Save local (PersistenceService) | ✅ |
| Boss 3×1 (engine) | ✅ em testes; cena PENDING |
| Mercado P2P / chat / guildas / PvP | ⛔ fase online |
| VIP / monetização | ⛔ arquitetura pronta (flag vip) |

Ver `docs/PENDING_RULES.md` e `docs/ROADMAP.md`.
