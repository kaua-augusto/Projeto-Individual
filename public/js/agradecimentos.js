var TECLA_ANTERIOR = 'ArrowLeft';
var TECLA_PROXIMA = 'ArrowRight';
var CLASSE_TROCA = 'agradecimento-trocando';
var FOTO_EXEMPLO = './assets/img/agradecimentos/exemplo.svg';

var pessoas = [
  {
    nome: 'Mãe',
    categoria: 'Família/Mãe',
    papel: 'Mentora',
    apelido: 'M',
    foto: FOTO_EXEMPLO,
    marca: { icone: '☕', legenda: 'Café pronto antes de qualquer conversa difícil' },
    qualidades: [
      { icone: '⏳', nome: 'Paciência' },
      { icone: '😄', nome: 'Humor' },
      { icone: '🛡️', nome: 'Proteção' },
      { icone: '💪', nome: 'Força' },
      { icone: '🧭', nome: 'Direção' },
      { icone: '❤️', nome: 'Carinho' }
    ],
    hacks: [
      { icone: '⚙', texto: 'Resolver um problema de cada vez' },
      { icone: '⌛', texto: 'Esperar a hora certa' },
      { icone: '✎', texto: 'Anotar tudo para não esquecer' },
      { icone: '☂', texto: 'Estar sempre preparado' },
      { icone: '⚖', texto: 'Pensar antes de decidir' },
      { icone: '☀', texto: 'Começar o dia cedo' },
      { icone: '♫', texto: 'Cantar para aliviar o peso' },
      { icone: '✦', texto: 'Nunca desistir' }
    ],
    anos: 20,
    inspiracao: '9+',
    porque: 'Texto de exemplo. Troque pelo motivo do agradecimento: o que ela fez, quando apareceu na sua vida e como ajudou você a chegar até aqui. Se o texto for longo, o painel ganha uma barra de rolagem.'
  },
  {
    nome: 'Professor da SPTech',
    categoria: 'SPTech/Professor',
    papel: 'Netrunner',
    apelido: 'P',
    foto: FOTO_EXEMPLO,
    marca: { icone: '⌨', legenda: 'Sempre com um exemplo de código na manga' },
    qualidades: [
      { icone: '🧠', nome: 'Didática' },
      { icone: '⏳', nome: 'Paciência' },
      { icone: '🔍', nome: 'Atenção' },
      { icone: '💡', nome: 'Ideias' },
      { icone: '🤝', nome: 'Apoio' },
      { icone: '🎯', nome: 'Foco' }
    ],
    hacks: [
      { icone: '⚙', texto: 'Ler a mensagem de erro com calma' },
      { icone: '⌕', texto: 'Pesquisar antes de perguntar' },
      { icone: '✎', texto: 'Dar nomes que explicam o código' },
      { icone: '⚑', texto: 'Fazer commits pequenos' },
      { icone: '⚖', texto: 'Escolher a solução mais simples' },
      { icone: '☰', texto: 'Organizar o projeto em camadas' }
    ],
    anos: 1,
    inspiracao: '8+',
    porque: 'Texto de exemplo. Conte aqui como esta pessoa ajudou no curso e no projeto.'
  },
  {
    nome: 'Amigo da turma',
    categoria: 'Amigos/Turma',
    papel: 'Solo',
    apelido: 'A',
    foto: FOTO_EXEMPLO,
    marca: { icone: '🎮', legenda: 'Parceiro de jogatina e de madrugada estudando' },
    qualidades: [
      { icone: '😄', nome: 'Humor' },
      { icone: '🤝', nome: 'Lealdade' },
      { icone: '⚡', nome: 'Energia' },
      { icone: '🎧', nome: 'Escuta' },
      { icone: '🧩', nome: 'Criatividade' },
      { icone: '🔥', nome: 'Coragem' }
    ],
    hacks: [
      { icone: '♫', texto: 'Estudar com uma boa playlist' },
      { icone: '☕', texto: 'Fazer pausas na hora certa' },
      { icone: '✦', texto: 'Comemorar cada entrega' }
    ],
    anos: 5,
    inspiracao: '9+',
    porque: 'Texto de exemplo. Escreva aqui o motivo do agradecimento.'
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
