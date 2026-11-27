var TECLA_ANTERIOR = 'ArrowLeft';
var TECLA_PROXIMA = 'ArrowRight';
var CLASSE_TROCA = 'agradecimento-trocando';

var pessoas = [
  {
    nome: 'Andre "Zidane" Luis',
    categoria: 'Família/Padrasto',
    papel: 'Solo',
    apelido: 'Zidane',
    foto: './assets/img/agradecimentos/andre.png',
    marca: { icone: '🛡️', legenda: 'Pai é quem cria' },
    qualidades: [
      { icone: '💪', nome: 'Força' },
      { icone: '🛡️', nome: 'Proteção' },
      { icone: '🧭', nome: 'Direção' },
      { icone: '📚', nome: 'Educação' },
      { icone: '🤝', nome: 'Presença' },
      { icone: '❤️', nome: 'Carinho' }
    ],
    hacks: [
      { icone: '⚙', texto: 'Ser forte nas dificuldades' },
      { icone: '✦', texto: 'Buscar sempre o melhor' },
      { icone: '⚖', texto: 'Pensar no futuro' }
    ],
    anos: 18,
    inspiracao: '9+',
    porque: 'Meu padrasto me ensinou que pai é quem cria. Sempre buscou o melhor para minha educação e futuro, me criou para ser forte e lidar com as dificuldades. Muito obrigado!'
  },
  {
    nome: 'Meire "mamãe" Ellen',
    categoria: 'Família/Mãe',
    papel: 'Mentora',
    apelido: 'Mamãe',
    foto: './assets/img/agradecimentos/meire.png',
    marca: { icone: '❤️', legenda: 'Se sacrificou por mim e pela minha irmã' },
    qualidades: [
      { icone: '❤️', nome: 'Carinho' },
      { icone: '🤗', nome: 'Amor' },
      { icone: '🛡️', nome: 'Sacrifício' },
      { icone: '🕊️', nome: 'Liberdade' },
      { icone: '🧠', nome: 'Consciência' },
      { icone: '✨', nome: 'Bondade' }
    ],
    hacks: [
      { icone: '☀', texto: 'Ser bom com as pessoas' },
      { icone: '🧭', texto: 'Trilhar o próprio caminho' },
      { icone: '✦', texto: 'Nunca desistir' }
    ],
    anos: 19,
    inspiracao: '10',
    porque: 'Minha mãe sempre se sacrificou por mim e minha irmã, me deu carinho, amor e condição para trilhar meu próprio caminho com consciência e liberdade. Me ensinou a ser bom. Muito obrigado!'
  },
  {
    nome: 'Tia Sandra',
    categoria: 'Família/Tia',
    papel: 'Fixer',
    apelido: 'Tia',
    foto: './assets/img/agradecimentos/sandra.png',
    marca: { icone: '🎓', legenda: 'O sonho dela era me ver numa faculdade' },
    qualidades: [
      { icone: '❤️', nome: 'Amor' },
      { icone: '📚', nome: 'Educação' },
      { icone: '🤝', nome: 'Apoio' },
      { icone: '🏠', nome: 'Segunda mãe' },
      { icone: '🎯', nome: 'Carreira' },
      { icone: '⏳', nome: 'Paciência' }
    ],
    hacks: [
      { icone: '🎓', texto: 'Estudar para realizar sonhos' },
      { icone: '🤝', texto: 'Apoiar com o que for possível' },
      { icone: '✦', texto: 'Acreditar no futuro' }
    ],
    anos: 19,
    inspiracao: '9+',
    porque: 'Minha tia foi uma segunda mãe para mim, me educa, me ama e me apoia com tudo que lhe é possível para meu futuro e carreira, seu sonho era me ver numa faculdade, estou fazendo isso por ela também. Muito obrigado pelo apoio!'
  },
  {
    nome: 'Professora Roberta',
    categoria: 'ETEC/Professora',
    papel: 'Netrunner',
    apelido: 'Prof',
    foto: './assets/img/agradecimentos/roberta.png',
    marca: { icone: '📖', legenda: 'Educação transforma a vida de alguém' },
    qualidades: [
      { icone: '🧠', nome: 'Didática' },
      { icone: '💡', nome: 'Inspiração' },
      { icone: '🎯', nome: 'Incentivo' },
      { icone: '🤝', nome: 'Confiança' },
      { icone: '🔍', nome: 'Visão' },
      { icone: '⏳', nome: 'Paciência' }
    ],
    hacks: [
      { icone: '📖', texto: 'Aprender na prática' },
      { icone: '🚀', texto: 'Ir atrás da oportunidade' },
      { icone: '✦', texto: 'Acreditar na educação' }
    ],
    anos: 5,
    inspiracao: '9+',
    porque: 'Foi minha professora e a do meu padrasto em tempos diferentes na ETEC, ela nos ensinou na prática o poder de transformação que a educação pode ter na vida de alguém. Me incentivou a entrar na SPTech por acreditar na metodologia de ensino de vocês. Não poderia ser mais grato, muito obrigado, professora!'
  }
];

var indiceAtual = 0;

function mostrarPessoa(indice) {
  if (indice < 0) {
    indice = pessoas.length - 1;
  }
  if (indice >= pessoas.length) {
    indice = 0;
  }
  indiceAtual = indice;

  var pessoa = pessoas[indice];
  span_categoria.textContent = pessoa.categoria;
  span_papel.textContent = pessoa.papel;
  p_apelido.textContent = pessoa.apelido;
  span_marca_icone.textContent = pessoa.marca.icone;
  p_marca_legenda.textContent = pessoa.marca.legenda;
  img_foto.src = pessoa.foto;
  img_foto.alt = 'Foto de ' + pessoa.nome;
  b_anos.textContent = pessoa.anos;
  b_inspiracao.textContent = pessoa.inspiracao;
  p_porque.textContent = pessoa.porque;
  div_porque.scrollTop = 0;

  listarQualidades(pessoa.qualidades);
  listarHacks(pessoa.hacks);
  marcarIndicador();
  animarTroca();
}

function mostrarAnterior() {
  mostrarPessoa(indiceAtual - 1);
}

function mostrarProxima() {
  mostrarPessoa(indiceAtual + 1);
}

function navegarPeloTeclado(evento) {
  if (evento.key == TECLA_ANTERIOR) {
    mostrarAnterior();
  } else if (evento.key == TECLA_PROXIMA) {
    mostrarProxima();
  }
}

function listarQualidades(qualidades) {
  var itens = '';
  for (var indice = 0; indice < qualidades.length; indice++) {
    itens += '<li><span aria-hidden="true">' + escaparHtml(qualidades[indice].icone) + '</span>' + escaparHtml(qualidades[indice].nome) + '</li>';
  }
  ul_qualidades.innerHTML = itens;
}

function listarHacks(hacks) {
  var itens = '';
  for (var indice = 0; indice < hacks.length; indice++) {
    var texto = escaparHtml(hacks[indice].texto);
    itens += '<li role="img" aria-label="' + texto + '" title="' + texto + '">' + escaparHtml(hacks[indice].icone) + '</li>';
  }
  ul_hacks.innerHTML = itens;
}

function criarIndicadores() {
  for (var indice = 0; indice < pessoas.length; indice++) {
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.setAttribute('aria-label', 'Mostrar ' + pessoas[indice].nome);
    botao.setAttribute('onclick', 'mostrarPessoa(' + indice + ')');
    div_indicadores.appendChild(botao);
  }
}

function marcarIndicador() {
  var botoes = div_indicadores.children;
  for (var indice = 0; indice < botoes.length; indice++) {
    if (indice == indiceAtual) {
      botoes[indice].setAttribute('aria-current', 'true');
    } else {
      botoes[indice].removeAttribute('aria-current');
    }
  }
}

function animarTroca() {
  section_painel.classList.remove(CLASSE_TROCA);
  void section_painel.offsetWidth;
  section_painel.classList.add(CLASSE_TROCA);
}

ajustarMenuDaSessao();
criarIndicadores();
mostrarPessoa(0);
document.addEventListener('keydown', navegarPeloTeclado);
