# Diário de prompt

Prompts used to build `public/style.css`, in the order the rules appear in the file. Each entry lists the prompt and the rules it produced.

## 1. Design tokens and base styles

> começa o style.css pelas variáveis no :root com as cores do site, quero tudo com cara de cyberpunk 2077: fundo bem escuro, amarelo como cor principal e os detalhes em ciano, verde, magenta, roxo, vermelho e vinho. coloca também uma variável pra sombra de glitch, outra pros cantos cortados e as fontes (consolas no texto e chakra petch nos títulos), mais as medidas do header, footer, sidebar e da margem lateral. depois faz o reset e o básico das tags: títulos amarelos em caixa alta, parágrafo ciano, foco em roxo e input, select, progress, details e tabela já no estilo escuro

Rules: `:root`, `*`, `html`, `body`, `h1`, `h2`, `h3`, `h4`, `h1 span`, `h2 span`, `p`, `a`, `a:hover`, `:focus-visible`, `input`, `select`, `input:focus`, `select:focus`, `progress`, `details`, `summary`, `table`, `th`, `td`.

## 2. Public header and menu

> faz o header das páginas públicas fixo no topo, com a logo e o nome edgerunning na esquerda com a sombra de glitch, e o menu na direita numa caixa meio transparente com blur, borda roxa e canto cortado. os links ficam amarelos em caixa alta e dão um glitch rápido quando passa o mouse, o da página atual fica em negrito. separa os grupos de links com uma linha fininha e coloca um botão de menu que só aparece no celular

Rules: `.header`, `.header > *`, `.header a`, `.brand`, `.brand a`, `.header .brand`, `.brand-symbol`, `.header nav`, `.menu-button`, `.header nav a`, `.header nav a:hover`, `.header nav a:focus-visible`, `.menu-button:hover`, `.menu-button:focus-visible`, `.header nav a.active`, `@keyframes glitch`, `.nav-divider`.

## 3. Buttons, labels and messages

> preciso de um botão padrão pra usar no site todo, com borda amarela, um preenchido e outro só com contorno, no hover ele fica verde com um brilho roxo. aproveita e faz o rótulo pequeno das seções, a caixa de alerta que fica fixa no canto com borda magenta (e uma versão verde pra quando salvar alguma coisa) e um aviso simples com borda verde

Rules: `.section-label`, `.button`, `.button-solid`, `.button-outline`, `.button:hover`, `.alert`, `.alert-success`, `.status`, `.notice`.

## 4. Background photos

> quero foto de fundo no hero, na visão geral, na chamada do final, no login e no dashboard. a foto cobre a seção inteira mas bem apagada pra dar pra ler o texto, e em cima dela vai um degradê roxo escuro vindo da esquerda

Rules: `.hero-background`, `.overview-background`, `.call-background`, `.login-background`, `.dashboard-background`, `.hero::after`, `.call-to-action::after`, `.dashboard::after`.

## 5. Landing page hero

> faz o hero da página inicial ocupando a tela toda com tudo centralizado, a logo grande, o nome edgerunning em destaque, o título com uma palavra em roxo e os botões de entrar e cadastrar um do lado do outro

Rules: `.hero`, `.hero-copy`, `.hero h2 span`, `.hero-brand`, `.hero-brand-symbol`, `.hero-actions`.

## 6. Landing page sections

> monta o resto da página inicial: a visão geral com fundo um pouco mais claro e degradê em cima e embaixo, o como funciona com três cards de passo lado a lado, o sobre com uma citação de borda magenta clarinha do lado do texto e a chamada final com o texto na esquerda e o botão na direita

Rules: `.section`, `.overview`, `.overview::after`, `.steps`, `.step-grid`, `.step-card`, `.step-card .section-label`, `.about`, `.about-quote`, `.about-copy`, `.call-copy`, `.universe-copy`, `.call-to-action`, `.call-to-action .button`.

## 7. Login and sign-up

> arruma o login e o cadastro em duas colunas, texto de boas vindas na esquerda e o card do formulário na direita com um brilho roxo e um degradê redondo atrás. o label fica em cima do input, o botão centralizado no final, o "aguarde" em verde e os erros em magenta

Rules: `.login`, `.login-copy`, `.login-card`, `.form`, `.field`, `.form .field`, `.field label`, `.form .button`, `#div_aguardar`, `#div_erros_login`.

## 8. Footer

> faz um rodapé simples com uma borda em cima, o nome do projeto de um lado e o aviso de projeto de fã do outro, com a letra pequena

Rules: `.page-footer`.

## 9. Universe page sections

> na página universo cada seção vira um card escuro com canto cortado e borda roxa, com um degradê roxo que troca de lado de uma seção pra outra. a imagem grande fica na esquerda com moldura amarela e embaixo dela três miniaturas pra trocar a imagem, a que está selecionada fica com borda verde. quando a seção aparece na tela ela sobe devagar e o título dá o glitch. a página toda tem um degradê verde vindo do canto de cima na esquerda e do canto de baixo na direita

Rules: `.universe`, `.universe-section`, `.universe-section.visible`, `.universe-section.visible h2`, `.universe-window`, `.universe-section:nth-child(even) .universe-window`, `.universe-media`, `.universe-thumbnails`, `.universe-thumbnails img`, `.universe-thumbnails button`, `.universe-thumbnails button:hover`, `.universe-thumbnails .active`.

## 10. "Por que isso me interessa"

> embaixo de cada imagem grande do universo coloca o "por que isso me interessa" como uma abinha amarela grudada na moldura. fechado ele não pode ocupar espaço nenhum senão a seção muda de tamanho

Rules: `.universe-interesse`, `.universe-interesse:not([open])`, `.universe-interesse summary`, `.universe-interesse p`.

## 11. Arrow to the next section

> coloca uma seta verde entre as seções do universo descendo e subindo devagar pra mostrar que tem mais coisa embaixo, no hover ela fica amarela. usa o mesmo estilo de ícone nas setas da tela de agradecimentos

Rules: `.universe-section:has(.universe-next)`, `.universe-next`, `.universe-next:hover`, `.universe-next:focus-visible`, `.universe-next svg`, `.agradecimento-seta svg`, `@keyframes nudge-down`.

## 12. Thanks page panel

> quero a tela de agradecimentos parecida com a tela de build do cyberpunk 2077: um painel vinho bem escuro com borda vermelha e canto cortado, uns textos em pé bem apagados nas laterais e uma barra no topo com as abas da categoria e do papel na esquerda, a aba "obrigado" no meio sublinhada de amarelo e a marca na direita. o apelido da pessoa fica grande no centro e embaixo divide em três colunas com a foto no meio

Rules: `.agradecimento-palco`, `.agradecimento-painel`, `.agradecimento-lateral`, `.agradecimento-lateral-direita`, `.agradecimento-barra`, `.agradecimento-abas`, `.agradecimento-aba-ativa`, `.agradecimento-aba-ativa span`, `.agradecimento-barra .brand`, `.agradecimento-apelido`, `.agradecimento-corpo`.

## 13. Thanks page columns

> agora as colunas dos agradecimentos. na esquerda vai a marca registrada num bloco com a borda vermelha mais grossa na esquerda, o cyberware numa grade de 3x2 com quadrados vermelhos com emoji e nome, e os hacks como iconezinhos com borda. no meio a foto sem fundo sumindo embaixo, com um quadradinho amarelo do lado. na direita os anos de apoio em amarelo, a inspiração, uma árvore de perks com octógonos amarelos ligados por uma linha e o bloco do "por que" com borda amarela, rolando quando o texto for grande

Rules: `.agradecimento-coluna > h3`, `.agradecimento-marca`, `.agradecimento-marca span`, `.agradecimento-qualidades`, `.agradecimento-qualidades li`, `.agradecimento-qualidades span`, `.agradecimento-hacks`, `.agradecimento-hacks li`, `.agradecimento-foto`, `.agradecimento-foto::before`, `.agradecimento-foto img`, `.agradecimento-atributo`, `.agradecimento-atributo b`, `.agradecimento-atributo-principal`, `.agradecimento-perks`, `.agradecimento-arvore`, `.agradecimento-octogono`, `.agradecimento-porque`, `.agradecimento-porque h3`.

## 14. Thanks page navigation

> coloca as setas redondas vermelhas fora do painel, uma de cada lado, quando passa o mouse a borda fica amarela e o ícone dá um glitch. embaixo do painel põe as bolinhas mostrando qual pessoa está aparecendo, e quando trocar de pessoa o conteúdo aparece com um fade e o apelido dá o glitch

Rules: `.agradecimento-indicadores`, `.agradecimento-indicadores button`, `.agradecimento-indicadores [aria-current="true"]`, `.agradecimento-seta`, `.agradecimento-seta-proxima`, `.agradecimento-seta:hover`, `.agradecimento-seta:focus-visible`, `.agradecimento-seta:hover svg`, `.agradecimento-seta:focus-visible svg`, `.agradecimento-trocando .agradecimento-corpo`, `.agradecimento-trocando .agradecimento-apelido`, `@keyframes glitch-icone`, `@keyframes aparecer`.

## 15. Red corner gradients on the thanks page

> quero que faça um gradiente como o das outras telas na tela de agradecimento, terá na esquerda superior indo para o centro e na direita inferior indo para o centro, igual os outros só que será em vermelho. use o minimo de linhas de css possível.

Rules: `.agradecimentos`.

## 16. Dashboard sidebar

> faz a sidebar do dashboard igual à do blue cheese, fixa na esquerda com a marca em cima, os links um embaixo do outro com canto cortado e a conta do usuário no final com o avatar redondo de borda amarela. o link da página atual fica com fundo amarelo e no hover fica roxo com o glitch

Rules: `.dashboard-sidebar`, `.sidebar-brand`, `.sidebar-brand img`, `.sidebar-nav`, `.sidebar-nav a`, `.sidebar-nav a:hover`, `.sidebar-nav a.active`, `.sidebar-account`, `.sidebar-user`, `.sidebar-avatar`, `.sidebar-avatar img`.

## 17. Dashboard layout and header

> monta a parte principal do dashboard do lado da sidebar, com a foto de fundo parada na tela e um degradê verde vindo da esquerda. no topo vai o título com glitch e um contador grande amarelo na direita. deixa os botões do dashboard menores e arruma a mensagem de erro quando não carregar

Rules: `.dashboard`, `.dashboard-background`, `.dashboard::after`, `.dashboard-header`, `.dashboard-title`, `.dashboard-title h1`, `.banner-counter`, `.banner-counter b`, `.dashboard .button`, `.dashboard .page-footer`, `.load-error h3`, `.load-error ol`.

## 18. Dashboard cards

> faz a primeira linha do dashboard com quatro cards de canto cortado, o primeiro um pouco mais largo. os números ficam grandes na chakra petch e cada cor quer dizer uma coisa: amarelo é o principal ou completo, verde é informação e magenta é o que falta. no card de horas coloca um formulariozinho pra digitar as horas

Rules: `.dashboard-cards`, `.dashboard-card`, `.dashboard-panel`, `.dashboard-card .button`, `.dashboard-card progress`, `.card-valor`, `.card-unit`, `.card-valor-principal`, `.card-valor-falta`, `.card-valor-falta .card-unit`, `.card-valor-info`, `.hours-form label`, `.hours-form input`.

## 19. Dashboard panels and chart

> faz a grade de painéis do dashboard em três colunas, o painel do gráfico pegando duas. cada painel tem um título pequeno com glitch e um link na direita, e o gráfico fica numa caixa de altura fixa

Rules: `.dashboard-grid`, `.chart-card`, `.dashboard-panel-header`, `.dashboard-panel-header h2`, `.dashboard-panel-header a`, `.dashboard-chart-container`.

## 20. Achievement lists and rarity

> arruma o ícone das conquistas, um quadrado com borda que mostra as iniciais se a imagem não carregar, e quando estiver bloqueada fica cinza. nas listas do dashboard cada conquista é uma linha com ícone, nome, descrição e um valor na direita. coloca uma cor pra cada raridade: lendária amarela, épica roxa, rara verde, incomum branca e comum ciano

Rules: `.achievement-icon`, `.achievement-icon-locked`, `.achievement-list`, `.achievement-item`, `.achievement-item .achievement-icon`, `.achievement-info`, `.achievement-info strong`, `.achievement-info h3`, `.achievement-side`, `.rarity-legendary`, `.rarity-epic`, `.rarity-rare`, `.rarity-uncommon`, `.rarity-common`.

## 21. Achievements page

> na página de conquistas coloca os filtros em botões com a quantidade do lado (o filtro ativo fica verde) e as conquistas num grid de três colunas. a desbloqueada ganha borda verde, e embaixo de cada uma vai a data com o botão de salvar na direita e a barrinha da porcentagem global

Rules: `.filters`, `.filter-buttons`, `.filter-button`, `.filter-button span`, `.filter-button[aria-pressed="true"]`, `.achievement-grid`, `.achievement-card`, `.achievement-unlocked`, `.achievement-summary`, `.achievement-actions`, `.achievement-actions input`, `.achievement-actions .button`, `.achievement-locked`, `.achievement-card progress`, `.achievement-global`.

## 22. Missions page

> na página de missões cada categoria é uma linha com nome, descrição, barra de progresso, a porcentagem em verde e um contador com botão de menos e de mais do lado do input

Rules: `.category-list`, `.category-row`, `.category-info`, `.category-info label`, `.category-info p`, `.category-row progress`, `.category-percentage`, `.counter`, `.counter input`, `.counter span`, `.counter-button`, `.counter-button:hover`.

## 23. Mobile

> deixa o site responsivo com uma media query só de 800px. diminui a margem e os títulos, troca o menu pelo botão de menu, todo grid vira uma coluna, as setas dos agradecimentos chegam mais perto e a sidebar do dashboard vai pra cima do conteúdo, em linha

Rules: `@media (max-width: 800px)`.
