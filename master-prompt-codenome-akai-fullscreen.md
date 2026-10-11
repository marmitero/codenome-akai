# MASTER PROMPT DE DESENVOLVIMENTO

# Codenome: AKAI

## MMORPG 2D IDLE / AUTO-BATTLE / LOOT RPG PARA NAVEGADOR

---

# 0. MANDATO MÁXIMO DO AGENTE

Você é o **Agente Principal de Desenvolvimento** responsável por projetar, implementar, testar, documentar, corrigir, evoluir e preparar para lançamento o projeto **Codenome: AKAI**.

Este documento é a especificação central do projeto.

Você deve tratá-lo como uma instrução operacional de desenvolvimento de um produto de jogo real.

Você NÃO está construindo:

* um dashboard;
* um CRUD;
* um protótipo administrativo;
* uma coleção de telas;
* uma visual novel;
* um jogo baseado em textos;
* uma planilha gamificada;
* um mockup;
* uma aplicação SaaS com aparência de jogo.

Você está construindo um:

> **RPG 2D Idle / Auto-Battle / Loot / Tower Progression para navegador, com identidade de jogo mobile/Android, preparado para desktop e futuramente jogável integralmente em Android através do navegador.**

O produto precisa transmitir:

* RPG;
* progressão;
* combate;
* personagens;
* coleção;
* equipamentos;
* raridade;
* loot;
* descoberta;
* estratégia;
* automação;
* economia;
* torre;
* bosses;
* evolução;
* social;
* sensação de jogo contínuo.

O jogador deve olhar para a aplicação e imediatamente perceber:

> **"Isso é um jogo."**

Não:

> "Isso é um sistema web com botões que imita um jogo."

---

# 1. NOME E IDENTIDADE

Nome atual:

**Codenome: AKAI**

Gênero:

* 2D Idle RPG;
* Auto-Battle;
* Loot RPG;
* Tower Progression;
* Collection RPG;
* MMORPG assíncrono;
* Social RPG
* Top-Down RPG.

Plataforma inicial:

**Navegador desktop e celular, com experiência de tela cheia desde o primeiro MVP.**

Prioridade de design: **mobile portrait (vertical)**. Desktop continua suportado, mas não deve ditar a composição da interface.

O jogo deve ocupar a área útil inteira do navegador, sem layout de site, cabeçalho de aplicação, sidebar permanente ou hub ao redor de uma arena central. A experiência deve lembrar um jogo mobile instalado, aberto dentro do navegador.

## REGRA VISUAL INEGOCIÁVEL

O jogo é uma experiência **full-screen**, com prioridade para **celular na vertical**. Não construir um site com hub ao redor e jogo no centro. Todo o jogo — mapa/cena, combate, HUD, GUI, menus, inventário, personagens, mercado e chat — deve ser apresentado como parte da experiência de jogo, usando prioritariamente os assets do repositório https://github.com/marmitero/codenome-akai.

A composição em portrait deve ser tratada como o layout principal e validada desde o primeiro vertical slice; não deixar a adaptação mobile para uma fase posterior.

---

# 2. FANTASIA CENTRAL DO JOGADOR

O jogador não é um aventureiro comum.

O jogador é o:

# REI

Ele administra seu reino.

Os personagens jogáveis são:

# SÚDITOS / HERÓIS / CAMPEÕES

Eles lutam em nome do Rei.

A fantasia central é:

> "Eu sou o Rei. Eu escolho meus campeões, fortaleço meu reino, equipei meus súditos, decido quem enviará para a Torre e construo uma equipe cada vez mais poderosa."

O Rei NÃO participa do combate normal.

O Rei é uma identidade/meta-personagem.

---

# 3. O REI

## 3.1 Função

O Rei representa a conta do jogador.

Ele possui:

* nome;
* nível;
* progresso;
* recursos;
* inventário;
* personagens;
* equipamentos;
* progresso da Torre;
* configurações;
* perfil.

O nível do Rei é o:

# NÍVEL DA CONTA

---

# 4. IDENTIDADE VISUAL DO REI

O Rei NÃO precisa possuir um sprite completo.

A representação visual será composta por:

* retrato;
* rosto;
* tórax;
* imagem PNG;
* avatar de perfil.

O foco visual deve ser:

> **portrait / bust / face + torso**

O Rei deverá aparecer:

* na HUD;
* no perfil;
* em elementos de identidade da conta quando apropriado.

O Rei NÃO precisa aparecer fisicamente dentro da arena de batalha.

---

# 5. CRIAÇÃO DO REI

No primeiro acesso, o jogador deve criar seu Rei.

A criação inicial deve permitir:

* escolher nome;
* escolher uma das skins disponíveis.

O sistema inicialmente utilizará:

# NOME + SKIN

Não criar sistema complexo de customização corporal se não houver necessidade.

As skins são assets visuais independentes.

O sistema deve ser arquitetado para permitir futuramente:

* novas skins;
* skins premium;
* skins de eventos;
* skins desbloqueáveis;
* skins exclusivas.

---

# 6. NOME DO REI / NICKNAME

O nome do Rei funciona como:

# NICKNAME DO JOGADOR

No ambiente online:

* deve ser único;
* não podem existir dois Reis com o mesmo nickname;
* deve existir validação de disponibilidade;
* deve existir proteção contra nomes inválidos;
* deve existir normalização adequada;
* deve impedir abuso básico.

O nickname será utilizado em:

* perfil;
* chat;
* sistemas sociais;
* rankings;
* mercado;
* guilda;
* arena;
* atividades multiplayer futuras.

---

# 7. CONTA

## MVP LOCAL

Permitir:

* modo Guest;
* persistência local.

## MVP ONLINE

Implementar:

* autenticação Google;
* conta persistente;
* associação do Rei à conta.

## LANÇAMENTO

Google Authentication deve ser o método oficial inicialmente.

Arquitetar o sistema para permitir futuros provedores sem reescrever a arquitetura.

---

# 8. REGRA DE UMA CONTA

Cada conta possui:

# 1 REI

Não criar múltiplos personagens/Reis por conta inicialmente.

A arquitetura pode ser extensível para isso no futuro, mas não implementar múltiplos Reis sem necessidade.

---

# 9. HERÓIS / SÚDITOS

Os heróis são personagens independentes do Rei e são como se fossem "itens", podendo ser vendidos no mercado da comunidade e também ter heróis repetidos na mesma conta.

Cada herói deve possuir:

* identidade;
* nome;
* sprite;
* retrato;
* classe;
* nível;
* XP;
* estrelas;
* skills;
* atributos;
* equipamento;
* arma;
* progressão;
* estado;
* raridade ou classificação apropriada;
* histórico/propriedade.

Os heróis são entidades comerciáveis (apenas para referencia, é como se o rei fosse um treinador e os heróis seus pokemons, apenas para analogia.)

---

# 10. HERÓIS INICIAIS

No início do jogo existem:

# 4 HERÓIS INICIAIS

O jogador deve escolher:

# 1 DOS 4

Ao escolher um:

* recebe aquele herói;
* começa a progressão com ele;
* os outros permanecem indisponíveis;
* podem ser obtidos posteriormente pelo sistema geral de aquisição.

O jogador NÃO recebe os quatro.

A escolha inicial deve possuir impacto real na experiência inicial.

Os quatro heróis devem possuir diferenças reais de:

* função;
* atributos;
* skills;
* estilo de combate;
* progressão.

Não criar quatro personagens visualmente diferentes mas mecanicamente iguais.

---

# 11. OBTENÇÃO DE NOVOS HERÓIS

Novos personagens podem ser obtidos através de:

* summons;
* caixas;
* compra;
* eventos;
* recompensas;
* sistemas de conquista;
* mercado entre jogadores;
* outros sistemas de aquisição futuros.

A arquitetura deve permitir múltiplos métodos.

---

# 12. INVENTÁRIO DE PERSONAGENS

O jogador possui:

# PERSONAGENS ILIMITADOS

Não criar limite artificial de quantidade de heróis possuídos.

O jogador pode colecionar personagens indefinidamente e repetidamente.

---

# 13. EQUIPE

A equipe representa quais heróis o Rei está utilizando para sua progressão.

Inicialmente:

# 1 SLOT

O segundo slot é desbloqueável.

O terceiro slot também é desbloqueável.

---

# 14. SLOTS DE EQUIPE

## SLOT 1

Disponível inicialmente.

## SLOT 2

Requer:

* Nível mínimo da conta;
* Coin para desbloqueio.

Nível mínimo:
# 10
Custo de Coins
# 150.000
## SLOT 3

Requer:

* Nível mínimo da conta;
* Coin para desbloqueio.

Nível mínimo:

# 25
Custo de Coins
# 1.000.000


Não hardcodar custos espalhados pelo código.

Criar configuração centralizada.

---

# 16. LIMITE DE EQUIPE

Máximo inicial:

# 3 HERÓIS

Não implementar equipe maior sem decisão futura.

A arquitetura deve permitir expansão futura.

---


---

# 19. SELEÇÃO DO EQUIPE

O sistema deve permitir ao jogador selecionar qual herói da equipe será o combatente atual.

o primeiro personagem deve possuir um um tutorial guiado ensinando o jogador a adicionar o herói na equipe, os proximos não precisam de tutorial

A UI deve tornar claro:

* herói ativo;
* nível;
* vida;
* poder;
* equipamento;
* progresso;
* inimigo atual.

---

# 20. XP DA EQUIPE

Todos os heróis presentes na equipe recebem XP relacionada à progressão.

Porém:

# O XP É DIVIDIDO ENTRE OS MEMBROS DA EQUIPE.

Exemplo conceitual:

### 1 herói

Recebe:

> 100% do XP disponível.

### 2 heróis

Cada um recebe uma parcela menor.

### 3 heróis

Cada um recebe uma parcela ainda menor.

O objetivo é:

> Quanto mais personagens o jogador leva na equipe, maior é a flexibilidade de progressão, porém menor é a velocidade individual de evolução.

Isso cria um trade-off.

O sistema exato de divisão deve ser centralizado e configurável.

Não espalhar fórmulas pelo código.

---

# 21. BATALHA DE BOSS

Boss é uma exceção deliberada.

Boss NÃO pertence ao fluxo normal da Torre.

Boss será um:

# SISTEMA / LOCAL / ATIVIDADE SEPARADA

A Torre não deve utilizar automaticamente:

> andar 10 = boss
> andar 20 = boss
> andar 30 = boss

Essa regra está ABOLIDA.

---

# 22. TORRE

Os andares da Torre representam "campos de caça":

# DIFICULDADE E PROGRESSÃO DOS INIMIGOS

A Torre deve conter:

* andares;
* dificuldade crescente;
* inimigos;
* grupos;
* progressão;
* recompensas.

Os andares NÃO devem possuir Boss.

---

# 23. BOSS CONTENT

Bosses devem existir em conteúdos separados.

Possíveis estruturas:

* Boss Arena;
* Boss Dungeon;
* Boss Challenge;
* World Boss;
* Guild Boss;
* Event Boss.

A arquitetura deve permitir todas.

---

# 24. COMBATE DE BOSS

Nos Bosses:

# TODA A EQUIPE PARTICIPA.

Se o jogador possui:

```text
Herói A
Herói B
Herói C
```

o Boss pode resultar em:

```text
3 HERÓIS × 1 BOSS
```

Todos atacam simultaneamente.


---

# 26. FLUXO DA TORRE

O loop principal deve ser:

```text
ENTRAR NA TORRE
↓
SELECIONAR ANDAR
↓
SELECIONAR HERÓI
↓
TELEPORTAR PARA MAPA
↓
HERÓI SE LOCOMOVE ATÉ INIMIGO MAIS PRÓXIMO E ATACA AUTOMATICAMENTE
↓
INIMIGO DERROTADO
↓
XP
↓
COIN
↓
POSSÍVEL LOOT
↓
HERÓI SE LOCOMOVE ATÉ O PRÓXIMO INIMIGO MAIS PRÓXIMO E ATACA AUTOMATICAMENTE
↓
REPETIR
```

---

# 27. INIMIGOS NOS ANDARES

Inimigos devem ser visiveis no mapa e atacarem no estilo hack'n slash
Inimigos também devem identificar o herói no mapa e se locomover em direção dos heróis
mais de um inimigo pode atacar simultaneamente, contanto que estejam até 1 tile de distancia do herói
inimigos respawnam 5 segundos após serem derrotados, mas respawnam em seu local de spawn normal, e não onde foram derrotados



---


---

# 29. MENU DURANTE A batalha

O jogador pode navegar pela interface durante o estado de procura.

A busca não deve quebrar o fluxo.

O sistema deve manter o estado corretamente.

Se o jogador abrir:

* inventário;
* personagem;
* perfil;
* equipamentos;
* configurações;

o timer deve continuar ou ser tratado de maneira consistente.

---

# 30. EQUIPAMENTOS

Equipamentos são:

# RECURSOS DE VALOR

O jogo NÃO deve despejar equipamentos constantemente.

Equipamentos precisam ser relativamente raros.

A existência de loot não significa que todo inimigo deve entregar equipamento.

Considerar 1 equipamento a cada 7~16 kills para equipamentos basicos. essas taxas devem aumentar exponencialmente conforme qualidade/status/raridade do equipamento, de modo que o futuro mercado da comunidade tenha valor
---

# 31. DROP DE EQUIPAMENTO

O fluxo deve ser:

```text
INIMIGO DERROTADO
↓
VERIFICAR DROP
↓
PODE NÃO DROPAR EQUIPAMENTO
↓
SE DROPAR:
    determinar equipamento
    determinar raridade
    determinar atributos
    determinar X
    determinar qualidade
```

---

# 32. PROBABILIDADE INICIAL DE EQUIPAMENTO

Usar inicialmente como baseline:

```text
Nenhum equipamento: 95%

Equipamento: 5%
```

Essa taxa deve ser configurável.

Não espalhar:

```text
0.05
```

pelo código.

Criar configuração central.

Esses valores podem ser alterados futuramente após testes de economia.

---

# 33. RARIDADE

Dentro dos equipamentos dropados, utilizar inicialmente:

```text
Common       50%
Uncommon     30%
Rare         15%
Epic          4%
Legendary   0.9%
Celestial   0.1%
```

Esses valores são:

# CONFIGURAÇÃO INICIAL

Não são regras imutáveis.

O sistema deve permitir balanceamento posterior.

---

# 34. EQUIPAMENTO BOM DEVE SER RARO

Não basta possuir:

> Legendary

para garantir um equipamento excelente.

A qualidade final depende de:

* raridade;
* atributos;
* X;
* combinações;
* características;
* compatibilidade com o personagem;
* função do item.

Equipamentos perfeitos devem ser difíceis de obter.

---

# 35. EQUIPAMENTOS RUINS

Equipamentos podem possuir:

* atributos ruins;
* X baixo;
* combinações pouco úteis;
* atributos inadequados para determinada build.

Isso é permitido e desejado.

O objetivo é criar:

# GOD ROLLS

como itens realmente valiosos.

Um equipamento raro não deve automaticamente ser perfeito.

---

# 36. X INDIVIDUAL

Cada atributo relevante de equipamento possui seu próprio:

# X

O X é gerado individualmente.

Nunca assumir:

> "Todo atributo possui o mesmo X."

Exemplo conceitual:

```text
Attack × 1.72
Defense × 0.93
Critical × 1.41
HP × 2.08
```

O sistema deve preservar essa individualidade.

---

# 37. FÓRMULA DE ATRIBUTOS

Manter a arquitetura conceitual:

```text
BASE
×
RARIDADE
×
X
=
VALOR FINAL
```

A implementação matemática exata deve ficar centralizada.

Nunca duplicar fórmulas em componentes de UI.

---

# 38. EQUIPAMENTO NÃO DEVE SER AUTOMATICAMENTE SUPERIOR APENAS POR NÍVEL

Um item de nível maior pode ser pior.

O jogador deve comparar:

* atributos;
* X;
* raridade;
* sinergia;
* build;
* função.

Isso valoriza o loot.

---

# 39. VENDA DE EQUIPAMENTOS

Equipamentos podem ser vendidos por:

# COIN

O jogador pode vender equipamentos para gerar Coin.

---

# 40. MERCADO DA COMUNIDADE

Equipamentos também podem ser anunciados para negociação entre jogadores.

O mercado da comunidade deve permitir:

* anúncio;
* preço;
* compra;
* cancelamento;
* histórico;
* status;
* taxa;
* proteção contra duplicação;
* validação server-side.

---

# 41. TAXA DE MERCADO

Toda transação entre jogadores terá:

# 15% DE TAXA

Essa taxa:

* não vai para outro jogador;
* não gera Coin para o vendedor;
* é consumida pelo servidor;
* funciona como sink econômico.

Exemplo:

```text
Venda: 100.000 Coin

Jogador comprador paga:
100.000

Vendedor recebe:
85.000

Servidor consome:
15.000
```

A transação deve ser realizada de maneira atomicamente segura pelo backend.

---

# 42. MERCADO ONLINE

O mercado entre jogadores é sistema de lançamento/produção.

Não precisa bloquear o MVP local.

No modo local pode existir:

* mock;
* desativado;
* estrutura técnica.

Não simular uma economia online falsa como se fosse real.

---

# 43. COIN

Coin é uma das principais moedas do jogo.

Usada para:

* desbloquear slots;
* compras;
* melhorias;
* sistemas;
* mercado;
* progressão.

A economia deve possuir:

# FONTES

e

# SUMIDOUROS

claramente documentados.

---

# 44. OUTRAS MOEDAS

O sistema poderá possuir:

* Coin;
* Diamonds;
* moedas especiais;
* moedas de eventos;
* recursos.

Cada moeda deve ter:

* origem;
* uso;
* limite;
* persistência;
* auditoria;
* regras de segurança.

---

# 45. XP

Existem pelo menos:

## XP DO REI

e

## XP DOS HERÓIS

Nunca misturar.

O XP do Rei controla:

* nível da conta;
* desbloqueios;
* slots;
* progressão geral.

O XP do herói controla:

* nível do personagem;
* evolução individual.

---

# 46. PROGRESSÃO DO REI

O nível do Rei é:

# NÍVEL DA CONTA

Ele controla progressões gerais.

Inicialmente:

```text
Nível 1:
1 slot

Nível 10:
2º slot disponível

Nível 25:
3º slot disponível
```

Mas o desbloqueio exige:

# NÍVEL MÍNIMO + COIN

---

# 47. OFFLINE PROGRESS

O jogo deve possuir arquitetura para progressão offline.

O sistema deve registrar:

```text
lastActiveAt
```

e futuramente calcular:

```text
offlineDuration
offlineRewards
offlineCombatSimulation
```

---

# 48. LIMITE OFFLINE

Jogadores Free:

# máximo de 2 horas acumuladas

Jogadores VIP:

# máximo de 8 horas acumuladas

O tempo offline não pode gerar recompensa infinita.

O sistema deve:

1. registrar última atividade;
2. calcular duração;
3. limitar duração;
4. simular/projetar recompensas;
5. entregar ao jogador no retorno.

---

# 49. VIP

VIP deve ser mantido no projeto.

Não precisa estar completamente funcional no primeiro MVP.

A arquitetura deve ser criada desde cedo para suportar:

* VIP level;
* benefícios;
* duração;
* status;
* compra futura;
* recompensas.

Não implementar pagamentos reais até a etapa adequada.

---

# 50. CHAT GLOBAL

O Chat Global deve ser:

# FUNCIONAL NO MVP ONLINE

No MVP local:

> desativado.

No MVP online:

* mensagens em tempo real;
* nickname;
* avatar;
* timestamp;
* limite de caracteres;
* rate limit;
* anti-spam básico;
* validação server-side.

A arquitetura deve utilizar infraestrutura realtime adequada.

---

# 51. CHAT NÃO É APENAS UI

Não criar um chat falso que apenas adiciona mensagens no frontend.

No online:

```text
Cliente
↓
Backend/Realtime
↓
Validação
↓
Persistência
↓
Broadcast
↓
Outros clientes
```

O cliente não deve poder forjar:

* autor;
* timestamp;
* permissões;
* identidade.

---

# 52. GUILDAS

Guildas fazem parte do produto final.

Devem ser arquitetadas para:

* criação;
* entrada;
* saída;
* cargos;
* membros;
* chat;
* progressão;
* Boss de guilda;
* recursos;
* rankings.

Não bloquear o MVP.

---

# 53. ARENA / PVP

Arena/PvP faz parte do produto futuro.

Deve utilizar:

# SERVER AUTHORITATIVE

Nunca confiar no resultado calculado exclusivamente pelo navegador.

Não bloquear o MVP PvE.

---

# 54. BOSSES

Existirão sistemas de Boss separados da Torre.

Possibilidades:

* Boss individual;
* Boss de equipe;
* Boss de guilda;
* World Boss;
* Boss de evento.

Bosses podem ser fonte importante de:

* equipamentos;
* recursos;
* moedas;
* recompensas especiais.

---

# 55. TORRE NÃO POSSUI BOSS OBRIGATÓRIO

Remover definitivamente qualquer regra semelhante a:

```text
andar 10 = Boss
andar 20 = Boss
andar 30 = Boss
```

Os andares da Torre definem:

* dificuldade;
* inimigos;
* progressão;
* recompensas.

Bosses são conteúdos separados.

---

# 56. AUTOMAÇÃO

O jogo é Idle.

O jogador NÃO deve clicar em cada ataque.

O fluxo deve ser automático.

O jogador:

* configura;
* escolhe;
* equipa;
* decide;
* inicia;
* observa;
* melhora.

O combate executa sozinho.

---

# 57. AUTOMATION LOOP

Conceitualmente:

```text
CONFIGURAR
↓
INICIAR
↓
BATALHA
↓
RECOMPENSA
↓
NOVO INIMIGO
↓
BATALHA
↓
REPETIR
```

O jogador pode sair e retornar.

---

# 58. NÃO TRANSFORMAR EM CLICKER

Não exigir:

* clicar para atacar;
* clicar em inimigos;
* clicar para causar dano;
* clicar em cada habilidade.

O jogador é um administrador/estrategista.

Não um operador manual de combate.

---

# 59. DIREÇÃO VISUAL — JOGO EM TELA CHEIA

O produto deve ser um jogo 2D de tela cheia executado dentro do navegador, com composição inspirada em RPGs/idle games mobile. Não é um site com um jogo embutido.

**Proibido como layout principal:**
- hub/site ao redor de uma arena central;
- cabeçalho de site ou navbar permanente;
- sidebar de desktop espremida na versão mobile;
- grade de cards como estrutura dominante;
- dashboard com gráficos e painéis administrativos;
- janela de batalha pequena dentro de uma página maior.

**Obrigatório:**
- o jogo ocupa toda a área útil do navegador;
- a cena de jogo é o fundo visual da experiência;
- HUD e menus são camadas integradas ao jogo;
- telas de inventário, personagens, mercado, perfil, chat e melhorias abrem como telas, painéis sobrepostos ou subcenas do próprio jogo;
- transições, animações, partículas e feedback visual dão unidade à experiência;
- a batalha permanece como atividade visual principal quando a Torre está ativa;
- a interface é desenhada para touch e leitura em tela pequena, sem perder qualidade no desktop.

A UI deve usar os sprites, ícones, molduras, painéis, botões, barras, retratos e demais recursos visuais disponíveis nos packs do repositório. Não substituir os assets existentes por componentes genéricos de HTML/CSS apenas por conveniência. Se faltar algum recurso visual, deve ser documentado para futura aquisição ou geração se possivel for.

---

# 60. BATALHA VISUAL

A batalha precisa ser percebida como combate real, não como uma lista de números.

Deve apresentar, conforme os assets disponíveis:
- sprites animados de herói e inimigo;
- idle, ataque, dano, habilidade, vitória, derrota e morte quando existirem animações adequadas;
- deslocamento ou antecipação de ataque;
- projéteis, partículas, impactos e efeitos;
- números de dano e cura legíveis, sem encobrir a ação;
- barras de vida integradas à cena;
- feedback de crítico, estados e habilidades;
- cenário ou mapa composto a partir dos assets disponíveis.

Se um pack não contiver uma animação necessária, criar uma adaptação técnica discreta a partir dos frames disponíveis (por exemplo, flip, deslocamento, flash ou tween), sem inventar sprites de aparência incompatível e sem apresentar efeitos temporários como arte final. se necessário, documente para futura aquisição ou geração de sprites faltantes

---

# 61. POLÍTICA OBRIGATÓRIA DE ASSETS — REPOSITÓRIO CODENOME-AKAI

Repositório:
https://github.com/marmitero/codenome-akai

**Usar os sprites do repositório para tudo que possuir equivalente adequado nos packs**, incluindo:
- heróis e personagens jogáveis;
- monstros e inimigos comuns;
- NPCs;
- bosses;
- retratos e avatares;
- mapas, tilesets, terrenos, decoração e fundos;
- botões, molduras, painéis, janelas, barras e outros elementos de GUI;
- ícones de itens, armas, recursos, moedas, habilidades e estados;
- efeitos visuais, projéteis e animações;
- objetos do mundo, portais, baús e elementos interativos.

Não significa que cada pack necessariamente contenha todas essas categorias. Primeiro inspecionar o repositório e criar um inventário real dos recursos encontrados. Para qualquer categoria sem asset adequado, registrar a lacuna em `docs/ART_ASSET_AUDIT.md` e `AI_STATE.md`; só então propor uma solução compatível com a direção artística.

Antes de implementar a cena:
1. listar as pastas e packs disponíveis;
2. identificar formatos, dimensões, transparência, escala e licenças;
3. detectar spritesheets e determinar frame width/height, ordem dos frames e animações;
4. identificar tilesets, tamanho dos tiles, autotiling e camadas;
5. identificar GUI/ícones/fontes/efeitos/áudio;
6. gerar um catálogo visual ou uma página interna de teste dos assets;
7. criar um manifesto de assets com caminhos estáveis e nomes semânticos;
8. mapear cada categoria de gameplay ao asset que será utilizado;
9. validar que os assets carregam corretamente no navegador e em telas de alta densidade;
10. documentar assets ausentes, duplicados, corrompidos ou com licença incerta.

Não renomear, mover, converter ou sobrescrever em massa os arquivos originais sem necessidade. Se conversões forem necessárias, manter os originais e criar uma pipeline reproduzível.

**GUI também é arte do jogo.** Se existirem botões, molduras, ícones, barras, fundos de painel e elementos de interface nos packs, usá-los de forma consistente. CSS pode controlar posicionamento, escala e responsividade, mas não deve transformar a interface numa aplicação web genérica.

---

# 62. PLACEHOLDERS E LACUNAS DE ARTE

Placeholders são permitidos apenas durante desenvolvimento interno e precisam ser identificados. Não usar emojis, círculos, quadrados, gradientes genéricos ou ícones aleatórios como substitutos permanentes para personagens, monstros, itens ou GUI.

Quando não houver asset adequado:
- registrar a lacuna;
- procurar primeiro em todos os packs existentes;
- verificar se outro asset do mesmo estilo pode ser reaproveitado;
- se necessário, criar uma adaptação temporária coerente e identificada;
- não afirmar que a categoria está concluída enquanto faltar arte final;
- não misturar assets de estilos radicalmente diferentes sem uma justificativa visual documentada.

Nunca entregar a versão final com placeholders de arte ou GUI.

---

# 63. TECNOLOGIA E ARQUITETURA DE RENDERIZAÇÃO

Stack recomendada:

```text
TypeScript
Vite
Phaser 3
HTML5 Canvas / WebGL
Supabase (fase online)
```

**Phaser 3 é o motor principal de apresentação e interação do jogo.** Usá-lo para cenas, sprites, tiles, animações, câmera, partículas, input touch, HUD desenhada no jogo, transições e overlays.

React não é obrigatório e não deve ser introduzido apenas para construir um dashboard ao redor do Phaser. Só usar React se uma necessidade concreta justificar uma interface DOM independente; mesmo nesse caso, o jogo continua em tela cheia e o React não deve duplicar a HUD.

Separar claramente:
- regras e simulação de gameplay;
- estado do jogo;
- catálogo e carregamento de assets;
- renderer Phaser;
- interface/HUD;
- persistência local;
- API/backend online.

A lógica de combate, loot, progressão e economia não deve depender diretamente de objetos visuais do Phaser. O renderer apresenta eventos; ele não decide resultados econômicos ou regras de combate.

---

# 64. SEPARAÇÃO DO BATTLE ENGINE

O Battle Engine permanece independente da apresentação.

```text
Battle State
+ Combat Rules
+ Character Stats
+ Enemy Stats
+ Skills
+ Equipment
= Battle Result / Events
```

Phaser recebe os eventos e os transforma em animações e feedback. A simulação deve continuar testável sem abrir o navegador nem renderizar sprites.

---

# 65. DOIS MODOS DE BATALHA

O sistema deve suportar pelo menos:

## TowerBattle

## BossBattle

```

Não duplicar completamente a lógica.

Criar um Battle Engine extensível.

---

# 66. EVENTOS DE COMBATE

O Battle Engine deve produzir eventos como:

```text
battle_started
attack_started
skill_used
damage_dealt
critical_hit
status_applied
status_removed
character_damaged
character_defeated
enemy_damaged
enemy_defeated
battle_won
battle_lost
battle_finished
```

O renderer transforma os eventos em feedback visual.

---

# 67. RESPONSIVIDADE — MOBILE PORTRAIT FIRST

A experiência prioritária é o celular na vertical (portrait). Desktop é suportado, mas a interface não pode ser simplesmente uma versão desktop encolhida.

Regras obrigatórias:
- ocupar `100dvh` e a largura disponível, considerando as áreas seguras do dispositivo;
- evitar rolagem da página inteira durante a partida; a rolagem deve existir apenas dentro de menus/listas que realmente precisem dela;
- adaptar a composição por proporção de tela, não apenas por breakpoints de largura;
- manter a arena de batalha visível e com espaço suficiente para ler os sprites;
- HUD compacta, com hierarquia visual clara;
- usar botões touch-friendly e áreas de toque confortáveis;
- abrir inventário, personagem, equipe, mercado, perfil e configurações como telas ou painéis em camadas do jogo;
- permitir fechar menus facilmente e voltar à cena anterior sem perder o estado da batalha;
- manter o ciclo idle/combate funcionando enquanto menus compatíveis estiverem abertos;
- adaptar tipografia, ícones, barras e espaçamento sem distorcer sprites;
- não depender de hover, mouse ou teclado;
- suportar notch, barras do navegador e safe areas;
- testar em larguras pequenas e dispositivos com diferentes densidades de pixels.

Em desktop, usar o espaço extra para ampliar a cena e organizar menus sem retornar ao conceito de “site com hub ao redor e jogo no centro”. A experiência continua sendo um jogo de tela cheia.

---

# 68. NAVEGADOR ANDROID E COMPORTAMENTO DE TELA

O jogo deve ser jogável no navegador Android sem instalação obrigatória.

Implementar:
- canvas que se redimensiona ao mudar orientação ou tamanho da janela;
- escala proporcional e pixel-art nítida quando aplicável;
- pausa ou comportamento consistente ao alternar de aba;
- recuperação segura do estado após suspensão do navegador;
- suporte a touch;
- prevenção de zoom/seleção acidental em controles de jogo, sem bloquear acessibilidade fora do jogo;
- tratamento de `visibilitychange` para salvar estado e calcular progresso de forma confiável;
- carregamento progressivo dos assets e feedback de loading;
- evitar descarregar todos os assets repetidamente ao alternar telas;
- performance aceitável em aparelhos Android modestos.

Se o usuário girar o celular, adaptar o layout ao novo formato. Não exigir rotação para horizontal; o portrait é o formato de referência principal.

---

# 69. HUD DE TELA CHEIA

A HUD deve comunicar rapidamente:
- Rei, nickname e nível da conta;
- recursos principais;
- herói ativo e sua vida;
- inimigo atual e sua vida;
- andar e progresso;
- estado do combate/estado “Procurando”;
- recompensas e loot recente;
- atalhos para personagens, equipe, inventário, melhorias, mercado e perfil;
- acesso ao chat global no online, sem ocupar a arena inteira.

A HUD deve ser composta visualmente com os assets disponíveis no repositório. Priorizar ícones reconhecíveis e indicadores compactos. Não colocar todos os dados ao mesmo tempo se isso prejudicar a leitura no celular: detalhes secundários podem aparecer em painéis sobrepostos.

Em portrait, organizar as informações em zonas verticais coerentes:
1. faixa superior compacta de Rei/recursos;
2. arena visual ampla no centro;
3. informações essenciais de combate próximas da arena;
4. navegação inferior com ícones/arte do jogo;
5. notificações e chat recolhíveis, sem bloquear os sprites.

Essas zonas são diretrizes, não uma licença para criar barras genéricas. Adaptar a composição aos sprites e à GUI real encontrados no repositório.

---

---

# 70. INVENTÁRIO

Criar inventário real.

Deve suportar:

* equipamentos;
* armas;
* itens;
* fragmentos;
* consumíveis;
* materiais;
* filtros;
* ordenação;
* equipar;
* vender;
* anunciar.

---

# 71. EQUIPAMENTO

Slots de equipamento devem ser reais.

Cada item deve possuir dados estruturados.

Não armazenar equipamentos como simples strings.

Exemplo conceitual:

```text
Equipment
├── id
├── ownerId
├── characterId
├── slot
├── itemType
├── level
├── rarity
├── stats
├── xValues
├── quality
├── createdAt
└── metadata
```

Adaptar conforme arquitetura final.

---

# 72. SISTEMA DE ARMAS

Manter as categorias já definidas no projeto:

* Espada;
* Adaga;
* Machado;
* Maça;
* Besta;
* Cajado;
* Livro Arcano;
* Luvas;
* Garras.

Cada tipo deve possuir estrutura para características próprias.

Se alguma característica ainda não estiver definida:

# NÃO INVENTAR COMO REGRA OFICIAL.

Registrar como:

```text
PENDING
```

---

# 73. REGRA CONTRA INVENÇÃO

Existem três tipos de decisão.

## Tipo A — Regra definida

Implementar exatamente.

## Tipo B — Decisão técnica

A IA pode decidir.

Exemplo:

* biblioteca;
* estrutura interna;
* padrão de código;
* cache;
* organização de arquivos.

## Tipo C — Regra de gameplay/economia crítica

Não inventar.

Exemplos:

* preço;
* monetização;
* drop econômico crítico;
* fórmula de moeda;
* taxa de pagamento;
* vantagem de VIP;
* regra competitiva.

Registrar:

```text
PENDING
```

e, quando necessário, solicitar decisão humana.

---

# 74. DOCUMENTAÇÃO

Criar e manter:

```text
/docs
    GDD.md
    ARCHITECTURE.md
    GAME_SYSTEMS.md
    COMBAT_SYSTEM.md
    EQUIPMENT_SYSTEM.md
    CHARACTER_SYSTEM.md
    WEAPON_SYSTEM.md
    SKILL_SYSTEM.md
    ECONOMY_SYSTEM.md
    TOWER_SYSTEM.md
    BOSS_SYSTEM.md
    AUTOMATION_SYSTEM.md
    INVENTORY_SYSTEM.md
    MARKET_SYSTEM.md
    CHAT_SYSTEM.md
    SOCIAL_SYSTEM.md
    AUTH_SYSTEM.md
    MMO_SYSTEMS.md
    UI_UX.md
    ART_GUIDELINES.md
    AUDIO_GUIDELINES.md
    SECURITY.md
    PERFORMANCE.md
    TESTING.md
    ROADMAP.md
    PENDING_RULES.md

AI_STATE.md
```

---

# 75. AI_STATE.md

`AI_STATE.md` é obrigatório.

No começo de cada sessão:

1. ler AI_STATE;
2. ler documentação relevante;
3. inspecionar código;
4. verificar assets;
5. verificar estado atual;
6. identificar próximo passo.

No final:

1. testar;
2. registrar implementação;
3. registrar arquivos;
4. registrar sistemas;
5. registrar bugs;
6. registrar decisões;
7. registrar pendências;
8. registrar próximo passo;
9. atualizar AI_STATE.

---

# 76. CICLO OBRIGATÓRIO

Sempre trabalhar:

```text
DOCUMENTAR
↓
ARQUITETAR
↓
IMPLEMENTAR
↓
TESTAR
↓
CORRIGIR
↓
DOCUMENTAR
↓
ATUALIZAR AI_STATE
↓
AVANÇAR
```

Nunca:

```text
IMPLEMENTAR
IMPLEMENTAR
IMPLEMENTAR
IMPLEMENTAR
DOCUMENTAR NO FINAL
```

---

# 77. DEBUG MODE

Criar Debug Mode exclusivo para desenvolvimento.

Permitir:

* adicionar Coin;
* adicionar Diamonds;
* adicionar XP;
* criar personagem;
* criar fragmentos;
* criar equipamento;
* escolher raridade;
* definir X;
* alterar nível;
* alterar estrelas;
* escolher andar;
* iniciar batalha;
* matar inimigo;
* matar personagem;
* iniciar Boss;
* testar loot;
* testar mercado;
* testar offline rewards;
* testar chat;
* testar autenticação.

Nunca disponibilizar Debug Mode ao jogador final.

---

# 78. TESTES

Criar testes automatizados para:

* XP;
* níveis;
* slots;
* desbloqueios;
* Coin;
* loot;
* raridade;
* X;
* equipamento;
* inventário;
* venda;
* mercado;
* taxa de 15%;
* fragmentos;
* craft;
* combate 1×1;
* Boss 3×1;
* divisão de XP;
* timer de procura;
* offline rewards;
* limite Free;
* limite VIP.

---

# 81. TESTE CRÍTICO — XP

Garantir:

### 1 herói

XP individual máximo.

### 2 heróis

XP individual menor.

### 3 heróis

XP individual ainda menor.

Todos os membros elegíveis devem receber XP.

---

# 82. MVP LOCAL

O primeiro grande objetivo é um:

# VERTICAL SLICE JOGÁVEL

O MVP local deve conter:

* criação do Rei;
* nickname;
* skin;
* 4 heróis iniciais;
* escolha de 1;
* personagens;
* equipe;
* slot 1;
* desbloqueio slot 2;
* desbloqueio slot 3;
* Coin;
* XP do Rei;
* XP de herói;
* Torre;
* vários andares;
* inimigos;
* combate;
* seleção do herói;
* batalha automática;
* skills;
* equipamento;
* raridade;
* X;
* loot raro;
* inventário;
* venda por Coin;
* automação;
* offline progress;
* limite de 2 horas;
* HUD de tela cheia mobile portrait;
* navegação em overlays/telas internas;
* Debug Mode;
* save local.

---

# 83. MVP LOCAL — NÃO PRECISA DE BACKEND

Pode utilizar:

```text
localStorage
```

ou:

```text
IndexedDB
```

Criar entretanto:

```text
PersistenceService
```

A camada deve permitir posteriormente trocar:

```text
LOCAL
↓
SUPABASE
```

sem reescrever todos os sistemas.

---

# 84. MVP ONLINE

Depois do MVP local funcionar:

Implementar:

```text
Google Auth
Supabase
Database
RLS
Realtime
Cloud Save
Server-side validation
Chat
```

---

# 85. SUPABASE

Utilizar Supabase para:

* Authentication;
* PostgreSQL;
* Realtime;
* Row Level Security;
* funções server-side quando necessário;
* persistência;
* dados de jogadores;
* personagens;
* equipamentos;
* inventário;
* economia;
* mercado;
* chat;
* guildas.

Não colocar segredos no frontend.

---

# 86. SERVER AUTHORITATIVE

No lançamento:

# O CLIENTE NÃO É CONFIÁVEL.

O servidor deve validar:

* Coin;
* Diamonds;
* XP;
* níveis;
* loot;
* equipamentos;
* personagens;
* fragmentos;
* mercado;
* transações;
* progressão;
* recompensas;
* PvP;
* Boss;
* sistemas econômicos.

Nunca confiar simplesmente em:

```text
localStorage
```

ou:

```text
client state
```

para valores econômicos.

---

# 87. MERCADO SERVER-AUTHORITATIVE

Toda negociação deve ser processada atomicamente.

Nunca permitir:

```text
duplicação de item
```

ou:

```text
duplicação de moeda
```

O servidor deve validar:

* item existe;
* item pertence ao vendedor;
* item não está bloqueado;
* preço válido;
* comprador possui Coin;
* vendedor ainda possui item;
* transação ainda está disponível.

Depois:

```text
Buyer - Price
Seller + Price - 15%
Server consumes 15%
Item -> Buyer
```

Tudo de forma atômica.

---

# 88. GOOGLE AUTH

Implementar login Google no online.

Após login:

```text
Google Account
↓
Player Account
↓
King Profile
↓
Game Data
```

Nunca misturar identidade de autenticação com estado de gameplay de maneira desorganizada.

---

# 89. GITHUB

O projeto deve ser versionado no Git.

A IA deve:

* criar branches quando apropriado;
* fazer commits coerentes;
* revisar alterações;
* evitar commits gigantes quando desnecessários;
* manter documentação;
* manter histórico;
* fazer push em todas as etapas para evitar perca de progresso.

Nunca apagar trabalho funcional sem necessidade.

---

# 90. VERCEL

O frontend de produção deve ser preparado para deploy na Vercel.

A IA deve:

* preparar build;
* corrigir erros;
* configurar scripts;
* configurar variáveis;
* verificar produção;
* testar build;
* verificar rotas;
* corrigir problemas de deploy.

---

# 91. VARIÁVEIS DE AMBIENTE

Nunca colocar:

* secrets;
* service role keys;
* tokens privados;

no código público.

Separar:

```text
.env.local
```

e configurações de produção.

Documentar variáveis necessárias.

---

# 92. SEGURANÇA

Implementar progressivamente:

* RLS;
* validação server-side;
* rate limits;
* proteção do chat;
* proteção de mercado;
* proteção econômica;
* validação de inputs;
* sanitização;
* proteção de APIs;
* controle de permissões.

---

# 93. ANTI-CHEAT

O objetivo não é criar um sistema anti-cheat perfeito no MVP.

Mas a arquitetura final deve dificultar:

* alteração de Coin;
* alteração de XP;
* criação de item;
* criação de personagem;
* duplicação;
* manipulação de loot;
* falsificação de mercado;
* manipulação de PvP.

---

# 94. PERFORMANCE

O jogo deve ser otimizado para:

* desktop;
* browser;
* Android browser;
* conexões razoáveis;
* sessões longas;
* idle.

Evitar:

* loops desnecessários;
* renderizações excessivas;
* vazamentos de memória;
* downloads gigantes;
* assets duplicados.

---

# 95. RESPONSIVIDADE

Criar breakpoints e layouts adaptáveis.

Mobile portrait (prioridade):
```text
jogo ocupa a tela inteira
HUD compacta com arte do pack
arena central ampla
navegação inferior integrada
menus em overlays/telas de jogo
chat recolhível
controles touch
```

Desktop:
```text
jogo também ocupa a tela inteira
arena e HUD adaptadas à proporção
menus em overlays ou subcenas
nenhuma moldura de site/hub externo
```

---

# 96. ROADMAP GERAL

## FASE 0 — INSPEÇÃO

* analisar repositório;
* inventariar todos os packs de sprites;
* criar catálogo visual dos assets;
* analisar assets;
* analisar código;
* analisar estrutura;
* identificar tecnologia;
* identificar gaps.

---

## FASE 1 — DOCUMENTAÇÃO

Criar:

* GDD;
* Architecture;
* Game Systems;
* Combat;
* Characters;
* Equipment;
* Economy;
* Tower;
* Boss;
* UI;
* Roadmap;
* AI_STATE.

---

## FASE 2 — FUNDAÇÃO

Implementar:

* projeto;
* estado;
* serviços;
* persistence abstraction;
* Battle Engine;
* renderer;
* UI architecture;
* asset pipeline.

---

## FASE 3 — REI

Implementar:

* King;
* nickname;
* skin;
* profile;
* account level.

---

## FASE 4 — PERSONAGENS

Implementar:

* 4 iniciais;
* seleção;
* personagens;
* atributos;
* XP;
* níveis;
* skills.

---

## FASE 5 — EQUIPE

Implementar:

* slot 1;
* slot 2;
* nível 10;
* Coin;
* slot 3;
* nível 25;
* Coin;
* seleção de equipe;
* seleção de herói ativo.

---

## FASE 6 — COMBATE

Implementar:

* 1×1;
* Battle Engine;
* ataques;
* skills;
* dano;
* morte;
* vitória;
* derrota;
* feedback visual.

---

## FASE 7 — TORRE

Implementar:

* andares;
* dificuldade;
* inimigos;
* progressão;
* rewards.

---

## FASE 8 — SEARCHING LOOP

Implementar:

```text
Victory
↓
Rewards
↓
Searching
↓
~3 seconds
↓
Next enemy
```

Com animação real.

---

## FASE 9 — EQUIPAMENTOS

Implementar:

* slots;
* armas;
* raridades;
* X;
* stats;
* loot;
* inventário;
* equipar;
* vender.

---

## FASE 10 — ECONOMIA

Implementar:

* Coin;
* fontes;
* sinks;
* custos;
* balanceamento;
* configuração central.

---

## FASE 11 — OFFLINE

Implementar:

* lastActiveAt;
* offline duration;
* reward simulation;
* 2h Free;
* 8h VIP.

---

## FASE 12 — BOSS

Implementar:

* Boss Area;
* Boss Battle;
* equipe 3×1;
* fragmentos;
* recompensas.

---

## FASE 13 — MVP LOCAL

Testar o loop completo.

Não avançar até o jogo ser realmente jogável.

---

# 97. FASE ONLINE

Depois do MVP local:

```text
Google Auth
↓
Supabase
↓
Database
↓
Cloud Save
↓
Realtime
↓
Chat
↓
Server Authority
```

---

# 98. FASE SOCIAL

Implementar:

* chat;
* guildas;
* comunidade;
* perfis;
* rankings;
* mercado.

---

# 99. FASE MARKET

Implementar:

* anúncios;
* compra;
* venda;
* taxa 15%;
* histórico;
* proteção contra duplicação.

---

# 100. FASE PVP

Implementar:

* Arena;
* matchmaking;
* combate;
* ranking;
* recompensas.

Tudo server-authoritative.

---

# 101. FASE MONETIZAÇÃO

Implementar:

* VIP;
* Battle Pass;
* Diamonds;
* caixas;
* compras;
* benefícios.

Sempre respeitar:

* segurança;
* server authority;
* economia;
* transparência;
* prevenção de duplicação.

---

# 102. FASE POLISH

Depois dos sistemas:

* animações;
* efeitos;
* áudio;
* UI;
* feedback;
* transições;
* performance;
* mobile;
* acessibilidade;
* UX.

---

# 103. BETA

Antes do lançamento:

* testar múltiplos usuários;
* testar chat;
* testar mercado;
* testar economia;
* testar autenticação;
* testar persistência;
* testar offline;
* testar mobile portrait em dispositivos reais/emulação;
* testar orientação e safe areas;
* testar carregamento e uso dos packs de sprites;
* testar Vercel;
* testar Supabase;
* testar recuperação de erros.

---

# 104. LANÇAMENTO

Somente considerar lançamento quando:

* build está estável;
* autenticação funciona;
* save funciona;
* economia funciona;
* chat funciona;
* mercado funciona;
* segurança básica funciona;
* RLS está configurado;
* produção funciona;
* mobile funciona;
* assets finais estão aplicados;
* documentação está atualizada;
* AI_STATE está atualizado;
* testes críticos passam.

---

# 105. NÃO FAZER

Nunca:

* criar apenas menus;
* criar somente mockups;
* criar CRUD;
* transformar tudo em cards;
* usar estética SaaS;
* usar personagens como quadrados;
* usar emojis como arte principal;
* fazer batalha somente por números;
* fazer todo inimigo dropar equipamento;
* fazer todo equipamento ser bom;
* criar Boss automaticamente nos andares 10/20/30;
* colocar toda lógica dentro do React;
* confiar no cliente para economia;
* hardcodar probabilidades espalhadas;
* hardcodar custos espalhados;
* ignorar AI_STATE;
* ignorar documentação;
* inventar regras econômicas críticas;
* deixar placeholders no produto final.

---

# 106. PRINCÍPIO DE DESIGN

Sempre perguntar:

> Isso parece um jogo?

Se não:

> melhorar.

Sempre perguntar:

> Isso gera uma decisão interessante para o jogador?

Se não:

> reconsiderar.

Sempre perguntar:

> Isso valoriza progressão, coleção, combate ou economia?

Se não:

> evitar complexidade desnecessária.

---

# 107. PRINCÍPIO DA TORRE

A Torre deve gerar a sensação:

> "Qual dos meus heróis é melhor para continuar avançando?"

Não:

> "Coloquei os três e eles simplesmente esmagam tudo."

A equipe é uma ferramenta estratégica.

---

# 108. PRINCÍPIO DO LOOT

O jogador deve pensar:

> "Será que finalmente veio um item bom?"

e não:

> "Tenho 300 equipamentos inúteis."

Loot deve possuir valor.

---

# 109. PRINCÍPIO DO PERSONAGEM

O jogador deve pensar:

> "Preciso conseguir esse personagem."

summons, Bosses, eventos e mercado devem alimentar essa sensação de coleção.

---

# 110. PRINCÍPIO DO BOSS

Boss deve parecer uma atividade especial.

Não simplesmente:

> "mais um inimigo da Torre."

Boss é conteúdo separado.

A equipe inteira participa.

Recompensas especiais são possíveis.

---

# 111. PRINCÍPIO DO IDLE

Idle não significa:

> tela parada.

Idle significa:

> sistemas funcionando continuamente enquanto o jogador administra e observa.

Por isso:

* batalha visual;
* procura;
* animações;
* loot;
* progressão;
* recompensas;
* offline progress

devem transmitir atividade contínua.

---

# 112. PRINCÍPIO DE DESENVOLVIMENTO AUTÔNOMO

A IA deve realizar automaticamente tudo que conseguir.

Isso inclui:

* criação de arquivos;
* alteração de código;
* refatoração;
* documentação;
* testes;
* scripts;
* migrations;
* configuração;
* Git;
* análise;
* debugging;
* build;
* deploy quando possível;
* integração.

O usuário deve ser solicitado apenas quando:

1. uma ação exige acesso manual que o agente não possui;
2. uma decisão crítica de gameplay/economia ainda não foi definida;
3. uma credencial/autorização precisa ser fornecida;
4. uma ação externa exige confirmação humana.

Não pedir autorização para decisões técnicas triviais.

---

# 113. PESQUISA EXTERNA

Quando necessário, pesquisar:

* documentação oficial;
* GitHub;
* bibliotecas;
* Phaser;
* TypeScript;
* Phaser 3;
* Vite;
* Vite;
* Supabase;
* Vercel;
* APIs;
* padrões de segurança;
* compatibilidade mobile.

Sempre preferir documentação oficial.

---

# 114. DECISÕES TÉCNICAS

Quando uma decisão for puramente técnica:

> escolha a alternativa mais robusta, simples, sustentável e compatível com o projeto.

Não interromper o desenvolvimento para perguntar:

> "Você prefere biblioteca A ou B?"

quando isso não altera gameplay.

---

# 115. DECISÕES DE GAMEPLAY

Quando uma regra de gameplay não estiver definida:

* verificar documentação;
* verificar PENDING_RULES;
* verificar GDD;
* verificar AI_STATE.

Se for crítica:

# PERGUNTAR AO USUÁRIO.

Se não for crítica:

# implementar solução temporária documentada como PENDING.

---

# 116. PRIMEIRO PASSO OBRIGATÓRIO

NÃO começar criando telas aleatoriamente.

Primeiro:

```text
1. INSPECIONAR PROJETO
2. INSPECIONAR ASSETS
3. INSPECIONAR CÓDIGO
4. INSPECIONAR DOCUMENTAÇÃO
5. CRIAR/ATUALIZAR AI_STATE
6. IDENTIFICAR GAPS
7. CRIAR ARQUITETURA
8. DEFINIR ROADMAP
9. IMPLEMENTAR FUNDAÇÃO
```

---

# 117. PRIMEIRO VERTICAL SLICE

O primeiro vertical slice funcional deve provar:

```text
Rei
↓
Escolha de personagem
↓
Equipe
↓
Escolha de herói
↓
Torre
↓
Batalha
↓
Vitória
↓
XP/Coin
↓
Possível loot
↓
Novo inimigo
↓
Nova batalha
↓
Progressão
↓
Se perder volta pro Lobby (Vips podem ativar função para recuperar vida no lobby e voltar para a batalha automaticamente)
```

Se esse loop não estiver divertido e funcional:

# NÃO avançar para sistemas MMO complexos.

---

# 118. DEFINIÇÃO DE SUCESSO DO MVP

O MVP será considerado bem-sucedido quando o jogador puder:

1. criar seu Rei;
2. escolher sua identidade;
3. escolher 1 dos 4 heróis;
4. montar sua equipe;
5. desbloquear slots;
6. escolher um herói para a Torre;
7. entrar em batalha;
8. lutar;
9. ganhar;
10. receber XP;
11. receber Coin;
12. eventualmente encontrar equipamento;
13. equipá-lo;
14. continuar;
15. observar a animação Procurando;
16. enfrentar o próximo inimigo;
17. melhorar seu personagem;
18. avançar na Torre;
19. fechar o navegador;
20. retornar e recuperar progresso offline.

---

# 119. DEFINIÇÃO DE SUCESSO ONLINE

A versão online deverá adicionar:

```text
Google Login
+
Cloud Save
+
Nickname único
+
Chat Global
+
Realtime
+
Server Authority
+
Mercado
+
Segurança
```

---

# 120. DEFINIÇÃO DE SUCESSO DO LANÇAMENTO

O produto final deverá ser:

# Codenome: AKAI

Um RPG 2D TOP-DOWN Idle/Auto-Battle em que:

> O jogador é o Rei.

> Os personagens são seus súditos.

> Ele escolhe quais campeões evoluir.

> A Torre testa individualmente cada campeão.

> Equipamentos são raros e valiosos.

> Bosses são atividades especiais onde a equipe inteira luta.

> O reino continua progredindo enquanto o jogador administra sua conta.

> A economia funciona online.

> Outros jogadores podem negociar.

> O chat cria vida no mundo.

> O jogador pode continuar sua jornada no desktop ou Android pelo navegador.

---

# 121. PRINCÍPIO FINAL

O jogo não deve parecer uma planilha.

Não deve parecer uma aplicação web.

Não deve parecer uma demonstração técnica.

Não deve parecer um protótipo gerado por IA.

Deve parecer:

# UM JOGO.

O jogador deve sentir:

> **"Esse é o meu Rei."**

> **"Esses são os meus campeões."**

> **"Qual deles devo fortalecer?"**

> **"Será que esse equipamento é bom?"**

> **"Consigo chegar mais longe nessa Torre?"**

> **"Preciso daquele personagem."**

> **"Vou tentar esse Boss."**

> **"Meu reino continuou progredindo enquanto eu estava fora."**

Essa sensação deve orientar todas as decisões de desenvolvimento.

---

# 122. AGORA EXECUTE

Comece imediatamente.

## ETAPA 1

Inspecione completamente:

* projeto;
* GitHub;
* código;
* assets;
* sprites;
* documentação;
* configuração.

## ETAPA 2

Crie/atualize:

```text
/docs
AI_STATE.md
```

## ETAPA 3

Apresente internamente a arquitetura necessária.

## ETAPA 4

Implemente a fundação.

## ETAPA 5

Implemente o Vertical Slice.

## ETAPA 6

Teste.

## ETAPA 7

Corrija.

## ETAPA 8

Atualize documentação.

## ETAPA 9

Atualize AI_STATE.

## ETAPA 10

Continue automaticamente para a próxima etapa lógica.

---

# 123. REGRA DE CONTINUIDADE

Não pare simplesmente após:

* criar documentação;
* criar componentes;
* criar telas;
* criar banco;
* criar mockups;
* criar arquitetura.

O objetivo é:

# CONSTRUIR O JOGO.

A cada etapa:

```text
DOCUMENTAÇÃO
↓
CÓDIGO
↓
TESTE
↓
CORREÇÃO
↓
BUILD
↓
ESTADO ATUALIZADO
↓
PRÓXIMA ETAPA
```

O projeto deve permanecer executável durante todo o desenvolvimento.

---

# 124. PRIORIDADE GLOBAL

Quando houver conflito entre prioridades, utilizar:

```text
GAMEPLAY
>
FUNCIONALIDADE
>
ESTABILIDADE
>
PERFORMANCE
>
VISUAL
>
UX
>
SISTEMAS SECUNDÁRIOS
>
CONTEÚDO
>
POLISH
```

Mas nunca sacrificar segurança e integridade econômica para acelerar conteúdo online.

---

# 125. RESULTADO FINAL

Construir:

# Codenome: AKAI

### PREPARE

### CHOOSE

### EQUIP

### DEPLOY

### FIGHT

### LOOT

### UPGRADE

### CONQUER

### CLIMB

O Rei administra.

Os campeões lutam.

A Torre desafia.

O loot recompensa.

O reino continua.
