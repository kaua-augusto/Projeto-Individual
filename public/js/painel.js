// Funções usadas por mais de uma página do painel (visão geral, conquistas e missões)

var CODIGO_SEM_CONEXAO = 'SEM_CONEXAO';
var PASTA_ICONES = './assets/img/conquistas/';
var TAMANHO_SIGLA = 2;

// Raridade pela % de jogadores que têm a conquista: o primeiro máximo que a % não alcança define o nível
var NIVEIS_RARIDADE = [
  { maximo: 5, nome: 'Lendária', classe: 'rarity-legendary' },
  { maximo: 10, nome: 'Épica', classe: 'rarity-epic' },
  { maximo: 20, nome: 'Rara', classe: 'rarity-rare' },
  { maximo: 50, nome: 'Incomum', classe: 'rarity-uncommon' },
  { maximo: Infinity, nome: 'Comum', classe: 'rarity-common' }
];
var RARIDADE_DESCONHECIDA = { nome: '—', classe: 'rarity-common' };

// ===== Regras de negócio =====

// Conquistas marcadas ÷ total × 100, com uma casa decimal
function porcentagemConclusao(quantidadeDesbloqueadas, total) {
  if (total == 0) {
    return 0;
  }
  return Math.round((quantidadeDesbloqueadas / total) * 1000) / 10;
}

function buscarRaridade(porcentagemGlobal) {
  if (porcentagemGlobal == null) {
    return RARIDADE_DESCONHECIDA;
  }
  for (var i = 0; i < NIVEIS_RARIDADE.length; i++) {
    if (porcentagemGlobal < NIVEIS_RARIDADE[i].maximo) {
      return NIVEIS_RARIDADE[i];
    }
  }
}

function porcentagemCategoria(categoria) {
  if (categoria.total == 0) {
    return 0;
  }
  return Math.round((categoria.concluidas / categoria.total) * 100);
}

// Média das porcentagens das categorias: cada categoria pesa o mesmo, tenha 17 ou 160 itens
function porcentagemMissoes(categorias) {
  if (categorias.length == 0) {
    return 0;
  }
  var soma = 0;
  for (var i = 0; i < categorias.length; i++) {
    soma += porcentagemCategoria(categorias[i]);
  }
  return Math.round(soma / categorias.length);
}

// ===== Ícone da conquista =====

// Ícone oficial da conquista, em cinza enquanto está bloqueada.
// Secreta e ainda bloqueada mostra "?" no lugar do ícone, para não dar spoiler da história.
function iconeConquista(conquista) {
  var sigla = siglaConquista(conquista.nome);
  var classe = conquista.desbloqueada ? 'achievement-icon' : 'achievement-icon achievement-icon-locked';

  if (conquista.oculta && !conquista.desbloqueada) {
    return `<span class="${classe}" aria-hidden="true">?</span>`;
  }
  if (!conquista.imagem) {
    return `<span class="${classe}" aria-hidden="true">${sigla}</span>`;
  }
  return `<img class="${classe}" src="${PASTA_ICONES + conquista.imagem}" alt="${escaparHtml(conquista.nome)}" data-sigla="${sigla}" onerror="trocarIconePorSigla(this)">`;
}

// Imagem que não carregou (arquivo apagado, nome errado): volta a mostrar a sigla na mesma caixa
function trocarIconePorSigla(imagem) {
  imagem.outerHTML = `<span class="${imagem.className}" aria-hidden="true">${imagem.dataset.sigla}</span>`;
}

// Iniciais das palavras com letra maiúscula: "The Wandering Fool" -> "TW"
function siglaConquista(nome) {
  var palavras = nome.replace(/[^A-Za-zÀ-ú0-9 ]/g, '').split(' ');
  var sigla = '';

  for (var i = 0; i < palavras.length; i++) {
    if (sigla.length < TAMANHO_SIGLA && /^[A-ZÀ-Ú0-9]/.test(palavras[i])) {
      sigla += palavras[i][0];
    }
  }
  return sigla || nome[0];
}

// ===== Carregando, conteúdo e erro =====

function mostrarCarregando() {
  p_carregando.hidden = false;
  div_conteudo.hidden = true;
}

function mostrarConteudo() {
  p_carregando.hidden = true;
  div_erro_carregamento.hidden = true;
  div_conteudo.hidden = false;
}

// Troca o conteúdo da página por uma explicação do erro e do que conferir
function mostrarErroCarregamento(erro) {
  var servidorDesligado = erro && erro.codigo == CODIGO_SEM_CONEXAO;
  var codigo = erro && erro.codigo ? erro.codigo : 'ERRO';
  var mensagem = erro && erro.mensagem ? erro.mensagem : 'Não foi possível carregar seus dados.';
  var passos = '<li>Confira se o <b>MySQL</b> está ligado e se o <b>script-tabelas.sql</b> foi executado.</li><li>Veja o terminal do <b>npm start</b> para o erro completo.</li>';
  if (servidorDesligado) {
    passos = '<li>Confira se o <b>npm start</b> está rodando.</li><li>Abra o site pelo endereço do servidor, como <b>http://localhost:3333</b>.</li>';
  }

  div_erro_carregamento.innerHTML = `
    <p class="section-label">Falha na conexão // ${escaparHtml(codigo)}</p>
    <h3>${servidorDesligado ? 'Servidor desligado' : 'Não deu para carregar seus dados'}</h3>
    <p>${escaparHtml(mensagem)}</p>
    <ol>${passos}</ol>
    <button class="button button-outline" type="button" onclick="location.reload()">Tentar de novo</button>`;

  div_erro_carregamento.hidden = false;
  p_carregando.hidden = true;
  div_conteudo.hidden = true;
}
