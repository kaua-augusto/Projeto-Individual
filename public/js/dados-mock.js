// Respostas falsas da API para o modo demonstração (MODO_DEMO no sessao.js).
// Os dados ficam no sessionStorage: duram até fechar a aba ou sair da conta.

var ATRASO_MOCK = 300; // milissegundos, para parecer uma chamada de rede
var PADRAO_DATA_MOCK = /^\d{4}-\d{2}-\d{2}$/;
var CHAVE_USUARIOS_MOCK = 'DEMO_USUARIOS';

// Conta de exemplo com progresso: v@nightcity.net / samurai
var ID_EXEMPLO_MOCK = '99';
var DESBLOQUEADAS_EXEMPLO_MOCK = 31;
var HORAS_EXEMPLO_MOCK = 187;
var PRIMEIRO_DESBLOQUEIO_MOCK = new Date(2024, 1, 10).getTime();
var USUARIO_EXEMPLO_MOCK = { id: 99, nome: 'V', email: 'v@nightcity.net', senha: 'samurai' };

// [nome, % global de referência, descrição (vazia = secreta), arquivo do ícone] - igual ao script-tabelas.sql
var CONQUISTAS_MOCK = [
  ['The Fool', 88.4, '', 'the-fool.jpg'],
  ['The Lovers', 67.2, '', 'the-lovers.jpg'],
  ['Right Back At Ya', 65.9, 'Mate ou incapacite um inimigo que jogou uma granada em você.', 'right-back-at-ya.jpg'],
  ['The Wheel of Fortune', 53.8, '', 'the-wheel-of-fortune.jpg'],
  ['Stanislavski\'s Method', 50.9, 'Use 10 vezes uma opção de diálogo ligada ao histórico de V.', 'stanislavskis-method.jpg'],
  ['The Hermit', 50.4, '', 'the-hermit.jpg'],
  ['True Soldier', 46.7, 'Mate ou incapacite 300 inimigos com armas de longo alcance.', 'true-soldier.jpg'],
  ['The High Priestess', 45.3, '', 'the-high-priestess.jpg'],
  ['Full Body Conversion', 42.8, 'Instale ao menos um implante em cada sistema e parte do corpo.', 'full-body-conversion.jpg'],
  ['Christmas Tree Attack', 42.5, 'Conclua um Breach Protocol com pelo menos 3 daemons enviados.', 'christmas-tree-attack.jpg'],
  ['Legend of The Afterlife', 41.6, 'Alcance o Street Cred máximo.', 'legend-of-the-afterlife.jpg'],
  ['Life of the Road', 40.0, '', 'life-of-the-road.jpg'],
  ['Gun Fu', 37.5, 'Mate ou incapacite 3 inimigos em sequência com revólver ou pistola a curta distância.', 'gun-fu.jpg'],
  ['The World', 35.1, 'Conclua a história principal.', 'the-world.jpg'],
  ['Bushido and Chill', 32.7, '', 'bushido-and-chill.jpg'],
  ['True Warrior', 31.6, 'Mate ou incapacite 100 inimigos com armas brancas.', 'true-warrior.jpg'],
  ['Master Crafter', 31.1, 'Fabrique 3 itens lendários.', 'master-crafter.jpg'],
  ['Judy vs Night City', 29.6, '', 'judy-vs-night-city.jpg'],
  ['Two Heads, One Bullet', 27.1, 'Mate ou incapacite 2 inimigos com o mesmo tiro de rifle de precisão.', 'two-heads-one-bullet.jpg'],
  ['To Protect and Serve', 26.5, '', 'to-protect-and-serve.jpg'],
  ['The Quick and the Dead', 26.5, 'Mate ou incapacite 50 inimigos com o tempo desacelerado.', 'the-quick-and-the-dead.jpg'],
  ['All the President\'s Men', 25.1, 'Salve a presidente Myers.', 'all-the-presidents-men.jpg'],
  ['Arachnophobia', 24.7, '', 'arachnophobia.jpg'],
  ['I Am The Law', 24.5, 'Conclua todos os avistamentos de ciberpsicóticos.', 'i-am-the-law.jpg'],
  ['The Wandering Fool', 20.9, 'Encontre todos os grafites de tarô do trabalho Fool on the Hill.', 'the-wandering-fool.jpg'],
  ['Ten out of Ten', 19.7, 'Alcance o nível máximo em qualquer habilidade.', 'ten-out-of-ten.jpg'],
  ['Breathtaking', 16.9, 'Colete todos os itens que pertenceram a Johnny Silverhand.', 'breathtaking.jpg'],
  ['The Sun', 16.8, '', 'the-sun.jpg'],
  ['V for Vendetta', 16.6, 'Depois de reviver com o Segundo Coração, elimine quem te matou em até 5 segundos.', 'v-for-vendetta.jpg'],
  ['The Star', 16.4, '', 'the-star.jpg'],
  ['To Bad Decisions!', 15.8, '', 'to-bad-decisions.jpg'],
  ['Spin Doctor', 14.0, '', 'spin-doctor.jpg'],
  ['Temperance', 12.5, '', 'temperance.jpg'],
  ['Must Be Rats', 11.6, 'Use o quickhack Distrair Inimigos 30 vezes sem chamar atenção.', 'must-be-rats.jpg'],
  ['Easy Come, Easy Go', 11.2, 'Roube o caminhão médico da Arasaka ou entregue 10 veículos ao El Capitan.', 'easy-come-easy-go.jpg'],
  ['King of Wands', 10.9, '', 'king-of-wands.jpg'],
  ['The Jungle', 9.8, 'Conclua todos os gigs e ocorrências NCPD de Santo Domingo.', 'the-jungle.jpg'],
  ['Dirty Deeds', 9.5, 'Conclua todos os gigs de Dogtown.', 'dirty-deeds.jpg'],
  ['Mean Streets', 9.2, 'Conclua todos os gigs e ocorrências NCPD de Heywood.', 'mean-streets.jpg'],
  ['Gunslinger', 9.0, 'Acerte uma granada inimiga no ar com um revólver.', 'gunslinger.jpg'],
  ['Frequent Flyer', 9.0, 'Encontre todos os terminais de viagem rápida.', 'frequent-flyer.jpg'],
  ['City Lights', 8.8, 'Conclua todos os gigs e ocorrências NCPD do City Center.', 'city-lights.jpg'],
  ['It\'s Elementary', 8.6, 'Conclua todos os gigs e ocorrências NCPD de Watson.', 'its-elementary.jpg'],
  ['Greetings from Pacifica!', 7.9, 'Conclua todos os gigs e ocorrências NCPD de Pacifica.', 'greetings-from-pacifica.jpg'],
  ['Little Tokyo', 7.8, 'Conclua todos os gigs e ocorrências NCPD de Westbrook.', 'little-tokyo.jpg'],
  ['Autojock', 7.7, 'Compre todos os veículos disponíveis para compra.', 'autojock.jpg'],
  ['The Devil', 7.3, '', 'the-devil.jpg'],
  ['The APB is Not Enough', 7.3, 'Torne-se o criminoso mais procurado de Dogtown.', 'the-apb-is-not-enough.jpg'],
  ['The Wasteland', 7.2, 'Conclua todos os gigs e ocorrências NCPD das Badlands.', 'the-wasteland.jpg'],
  ['Relic Ruler', 6.7, 'Desbloqueie todas as vantagens da árvore Relic.', 'relic-ruler.jpg'],
  ['Rough Landing', 6.4, 'Com o Berserk ativo, faça uma Aterrissagem de Super-Herói que elimine 2 inimigos.', 'rough-landing.jpg'],
  ['The Tower', 6.4, '', 'the-tower.jpg'],
  ['Judgement Day', 6.2, 'Elimine três chefes da categoria "Aumento de atividade criminosa".', 'judgement-day.jpg'],
  ['King of Swords', 6.0, '', 'king-of-swords.jpg'],
  ['Daemon In The Shell', 5.8, 'Mate ou incapacite 3 inimigos com um único quickhack Detonar Granada.', 'daemon-in-the-shell.jpg'],
  ['King of Pentacles', 4.8, '', 'king-of-pentacles.jpg'],
  ['King of Cups', 4.2, '', 'king-of-cups.jpg']
];

var CATEGORIAS_MOCK = [
  { idCategoria: 1, nome: 'Missões principais', descricao: 'história e finais', total: 26, concluidas: 22 },
  { idCategoria: 2, nome: 'Trabalhos secundários', descricao: 'side jobs', total: 60, concluidas: 41 },
  { idCategoria: 3, nome: 'Gigs', descricao: 'fixers de todos os distritos', total: 75, concluidas: 48 },
  { idCategoria: 4, nome: 'Ocorrências NCPD', descricao: 'scanner hustles', total: 160, concluidas: 97 },
  { idCategoria: 5, nome: 'Ciberpsicóticos', descricao: 'avistamentos', total: 17, concluidas: 17 },
  { idCategoria: 6, nome: 'Cartas de tarô', descricao: 'grafites pela cidade', total: 23, concluidas: 9 },
  { idCategoria: 7, nome: 'Veículos', descricao: 'garagem', total: 90, concluidas: 37 },
  { idCategoria: 8, nome: 'Armas icônicas', descricao: 'arsenal', total: 70, concluidas: 26 }
];

// Chamada pelo chamarApi (sessao.js) quando MODO_DEMO está ligado; devolve o mesmo formato da rota de verdade
function respostaMock(url, opcoes) {
  var corpo = opcoes && opcoes.body ? JSON.parse(opcoes.body) : {};

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        resolve(rotearMock(url, corpo));
      } catch (erro) {
        reject(erro);
      }
    }, ATRASO_MOCK);
  });
}

function rotearMock(url, corpo) {
  if (url == '/usuarios/cadastrar') return cadastrarMock(corpo);
  if (url == '/usuarios/autenticar') return autenticarMock(corpo);
  if (url.indexOf('/usuarios/perfil/') == 0) return perfilMock();
  if (url == '/usuarios/horas') return atualizarHorasMock(corpo);
  if (url.indexOf('/conquistas/listar/') == 0) return lerMock(chaveMock('CONQUISTAS'), conquistasIniciais());
  if (url == '/conquistas/marcar') return marcarConquistaMock(corpo);
  if (url.indexOf('/progresso/categorias/') == 0) return lerMock(chaveMock('CATEGORIAS'), categoriasIniciais());
  if (url == '/progresso/atualizar') return atualizarCategoriaMock(corpo);
  throw erroMock(404, 'NAO_ENCONTRADO', 'Rota não simulada no modo demo: ' + url);
}

function cadastrarMock(corpo) {
  var usuarios = lerMock(CHAVE_USUARIOS_MOCK, []);
  var emailUsado = usuarios.concat(USUARIO_EXEMPLO_MOCK).some(function (usuario) {
    return usuario.email == corpo.emailServer;
  });
  if (emailUsado) {
    throw erroMock(409, 'EMAIL_DUPLICADO', 'Esse e-mail já está cadastrado. Faça login.');
  }

  var novoUsuario = { id: usuarios.length + 1, nome: corpo.nomeServer, email: corpo.emailServer, senha: corpo.senhaServer };
  usuarios.push(novoUsuario);
  salvarMock(CHAVE_USUARIOS_MOCK, usuarios);
  return { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email };
}

function autenticarMock(corpo) {
  var usuarios = lerMock(CHAVE_USUARIOS_MOCK, []).concat(USUARIO_EXEMPLO_MOCK);
  var usuario = usuarios.find(function (candidato) {
    return candidato.email == corpo.emailServer && candidato.senha == corpo.senhaServer;
  });
  if (!usuario) {
    throw erroMock(403, 'LOGIN_INVALIDO', 'Email e/ou senha inválido(s)');
  }
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

function perfilMock() {
  var perfilVazio = { horasJogadas: 0, dtHoras: null };
  var perfilExemplo = { horasJogadas: HORAS_EXEMPLO_MOCK, dtHoras: Date.now() - 2 * MILISSEGUNDOS_POR_DIA };
  var perfil = lerMock(chaveMock('PERFIL'), ehContaExemplo() ? perfilExemplo : perfilVazio);
  perfil.nome = sessionStorage.NOME_USUARIO;
  return perfil;
}

function atualizarHorasMock(corpo) {
  var horas = Number(corpo.horasServer);
  if (isNaN(horas) || horas < 0) {
    throw erroMock(400, 'HORAS_INVALIDAS', 'Número de horas inválido!');
  }

  var perfil = { horasJogadas: Math.round(horas), dtHoras: Date.now() };
  salvarMock(chaveMock('PERFIL'), perfil);
  return perfil;
}

function marcarConquistaMock(corpo) {
  var conquistas = lerMock(chaveMock('CONQUISTAS'), conquistasIniciais());
  var desbloqueada = corpo.desbloqueadaServer != false;
  var data = dataDesbloqueioMock(corpo.dataServer);

  for (var i = 0; i < conquistas.length; i++) {
    if (conquistas[i].idConquista == corpo.idConquistaServer) {
      conquistas[i].desbloqueada = desbloqueada;
      conquistas[i].dtDesbloqueio = desbloqueada ? data : null;
      conquistas[i].desbloqueadaEm = desbloqueada ? new Date(data + 'T12:00:00').getTime() : null;
    }
  }
  salvarMock(chaveMock('CONQUISTAS'), conquistas);
  return { idConquista: corpo.idConquistaServer, desbloqueada: desbloqueada, data: data };
}

function atualizarCategoriaMock(corpo) {
  var categorias = lerMock(chaveMock('CATEGORIAS'), categoriasIniciais());
  var concluidas = 0;

  for (var i = 0; i < categorias.length; i++) {
    if (categorias[i].idCategoria == corpo.idCategoriaServer) {
      concluidas = Math.max(0, Math.min(categorias[i].total, Number(corpo.concluidasServer)));
      categorias[i].concluidas = concluidas;
    }
  }
  salvarMock(chaveMock('CATEGORIAS'), categorias);
  return { idCategoria: corpo.idCategoriaServer, concluidas: concluidas };
}

// Mesma regra do servidor: data vazia, inválida ou no futuro vira hoje
function dataDesbloqueioMock(data) {
  var hoje = formatarData(Date.now());
  if (PADRAO_DATA_MOCK.test(data || '') && data <= hoje) {
    return data;
  }
  return hoje;
}

function conquistasIniciais() {
  var comExemplo = ehContaExemplo();
  var conquistas = [];

  for (var i = 0; i < CONQUISTAS_MOCK.length; i++) {
    var linha = CONQUISTAS_MOCK[i];
    var desbloqueada = comExemplo && i < DESBLOQUEADAS_EXEMPLO_MOCK;
    var momento = dataExemploMock(i);

    conquistas.push({
      idConquista: i + 1,
      nome: linha[0],
      descricao: linha[2],
      oculta: linha[2] == '',
      desbloqueada: desbloqueada,
      desbloqueadaEm: desbloqueada ? momento : null,
      dtDesbloqueio: desbloqueada ? formatarData(momento) : null,
      global: linha[1],
      imagem: linha[3]
    });
  }
  return conquistas;
}

// Espalha os desbloqueios da conta de exemplo mais ou menos um por mês, com alguns meses vazios e outros com dois,
// para a linha do tempo ter forma
function dataExemploMock(posicao) {
  return PRIMEIRO_DESBLOQUEIO_MOCK + (posicao * 31 + (posicao % 4) * 3) * MILISSEGUNDOS_POR_DIA;
}

function categoriasIniciais() {
  var categorias = JSON.parse(JSON.stringify(CATEGORIAS_MOCK));
  if (ehContaExemplo()) {
    return categorias;
  }

  for (var i = 0; i < categorias.length; i++) {
    categorias[i].concluidas = 0;
  }
  return categorias;
}

function ehContaExemplo() {
  return sessionStorage.ID_USUARIO == ID_EXEMPLO_MOCK;
}

// Cada usuário do modo demo tem os próprios dados guardados
function chaveMock(nome) {
  return 'DEMO_' + nome + '_' + (sessionStorage.ID_USUARIO || '0');
}

function erroMock(status, codigo, mensagem) {
  return { status: status, codigo: codigo, mensagem: mensagem };
}

function lerMock(chave, valorPadrao) {
  try {
    var valor = sessionStorage.getItem(chave);
    return valor ? JSON.parse(valor) : valorPadrao;
  } catch (erro) {
    return valorPadrao;
  }
}

function salvarMock(chave, valor) {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.error('Não foi possível salvar os dados do modo demo:', erro);
  }
}
