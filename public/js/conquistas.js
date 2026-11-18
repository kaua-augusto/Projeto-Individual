var CHAVE_FILTRO = 'EDGERUNNING_FILTRO';
var CHAVE_ORDEM = 'EDGERUNNING_ORDEM';
var FILTRO_PADRAO = 'todas';
var ORDEM_PADRAO = 'faceis';
// Uma data sozinha é lida como meia-noite UTC, que no Brasil ainda é o dia anterior; meio-dia mantém o mesmo dia
var MEIO_DIA = 'T12:00:00';

var idUsuario = sessionStorage.ID_USUARIO;

var conquistas = [];
var filtroAtual = FILTRO_PADRAO;

function listarConquistas(silencioso) {
  if (!silencioso) {
    mostrarCarregando();
  }

  chamarApi(`/conquistas/listar/${idUsuario}`, { cache: 'no-store' })
    .then(function (lista) {
      conquistas = lista;
      atualizarContadores();
      mostrarConteudo();
      mudarFiltro(filtroAtual);
    })
    .catch(function (erro) {
      console.error(erro);
      if (!silencioso) {
        mostrarErroCarregamento(erro);
      }
    });
}

// Chamada pelo sessao.js quando o usuário volta para a aba
function atualizarAoVoltar() {
  if (conquistas.length > 0) {
    listarConquistas(true);
  }
}

function atualizarContadores() {
  var feitas = 0;
  for (var i = 0; i < conquistas.length; i++) {
    if (conquistas[i].desbloqueada) {
      feitas++;
    }
  }
  var faltando = conquistas.length - feitas;
  var porcentagem = porcentagemConclusao(feitas, conquistas.length);

  b_contador.textContent = feitas + ' / ' + conquistas.length;
  span_contador_info.textContent = `${porcentagem.toLocaleString('pt-BR')}% concluído · faltam ${faltando}`;
  span_qtd_todas.textContent = conquistas.length;
  span_qtd_feitas.textContent = feitas;
  span_qtd_faltando.textContent = faltando;
}

// ===== Filtro, busca e ordem =====

function mudarFiltro(filtro) {
  filtroAtual = filtro;

  var botoes = document.querySelectorAll('.filter-button');
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].setAttribute('aria-pressed', botoes[i].dataset.filtro == filtro);
  }
  mostrarConquistas();
}

function mostrarConquistas() {
  var busca = input_busca.value.trim().toLowerCase();
  var ordem = select_ordem.value;
  salvarEscolha(CHAVE_FILTRO, filtroAtual);
  salvarEscolha(CHAVE_ORDEM, ordem);

  var visiveis = [];
  for (var i = 0; i < conquistas.length; i++) {
    if (passaNoFiltro(conquistas[i], busca)) {
      visiveis.push(conquistas[i]);
    }
  }
  ordenarConquistas(visiveis, ordem);

  if (visiveis.length == 0) {
    div_conquistas.innerHTML = '<p>Nenhuma conquista com esse filtro.</p>';
    return;
  }

  var cards = '';
  for (var j = 0; j < visiveis.length; j++) {
    cards += montarCard(visiveis[j]);
  }
  div_conquistas.innerHTML = cards;
}

function passaNoFiltro(conquista, busca) {
  if (filtroAtual == 'feitas' && !conquista.desbloqueada) return false;
  if (filtroAtual == 'faltando' && conquista.desbloqueada) return false;
  return (conquista.nome + ' ' + conquista.descricao).toLowerCase().indexOf(busca) != -1;
}

function ordenarConquistas(lista, ordem) {
  lista.sort(function (a, b) {
    if (ordem == 'faceis') return (b.global || 0) - (a.global || 0);
    if (ordem == 'raras') return (a.global || 0) - (b.global || 0);
    if (ordem == 'recentes') return (b.desbloqueadaEm || 0) - (a.desbloqueadaEm || 0);
    return a.nome.localeCompare(b.nome);
  });
}

// ===== Cards =====

function montarCard(conquista) {
  var raridade = buscarRaridade(conquista.global);
  var nome = escaparHtml(conquista.nome);
  var descricao = conquista.descricao ? escaparHtml(conquista.descricao) : '// Conquista secreta — sem spoilers';
  var textoGlobal = conquista.global != null ? conquista.global.toLocaleString('pt-BR') + '% dos jogadores (referência)' : '';
  var classe = conquista.desbloqueada ? 'achievement-card achievement-unlocked' : 'achievement-card';

  return `
    <div class="${classe}">
      <div class="achievement-summary">
        ${iconeConquista(conquista)}
        <div class="achievement-info">
          <h3>${nome}</h3>
          <p>${descricao}</p>
          <span class="${raridade.classe}">${raridade.nome}</span>
        </div>
      </div>
      <div class="achievement-actions">${montarAcoes(conquista, nome)}</div>
      <progress max="100" value="${conquista.global || 0}" aria-label="${textoGlobal}"></progress>
      <p class="achievement-global">${textoGlobal}</p>
    </div>`;
}

// Bloqueada: botão para marcar. Desbloqueada: a data em que pegou (dá para trocar) e o botão para desmarcar.
function montarAcoes(conquista, nome) {
  var id = conquista.idConquista;
  if (!conquista.desbloqueada) {
    return `
      <span class="achievement-locked">Bloqueada</span>
      <button class="button button-solid" type="button" onclick="marcarConquista(${id}, true)" aria-label="Marcar ${nome} como desbloqueada">+ Tenho essa</button>`;
  }
  return `
    <label for="input_data_${id}">✓ em</label>
    <input id="input_data_${id}" type="date" value="${conquista.dtDesbloqueio}" max="${formatarData(Date.now())}" onchange="marcarConquista(${id}, true, this.value)">
    <button class="button button-outline" type="button" onclick="marcarConquista(${id}, false)" aria-label="Desmarcar ${nome}">Desmarcar</button>`;
}

// Marca, desmarca ou troca a data; sem data o servidor salva hoje
function marcarConquista(idConquista, desbloqueada, data) {
  var conquista = conquistas.find(function (item) {
    return item.idConquista == idConquista;
  });

  chamarApi('/conquistas/marcar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idUsuarioServer: idUsuario,
      idConquistaServer: idConquista,
      desbloqueadaServer: desbloqueada,
      dataServer: data || ''
    })
  })
    .then(function (json) {
      conquista.desbloqueada = json.desbloqueada;
      conquista.dtDesbloqueio = json.desbloqueada ? json.data : null;
      conquista.desbloqueadaEm = json.desbloqueada ? new Date(json.data + MEIO_DIA).getTime() : null;
      atualizarContadores();
      mostrarConquistas();
      mostrarMensagem(conquista.nome + (json.desbloqueada ? ' registrada.' : ' desmarcada.'));
    })
    .catch(function (erro) {
      console.error(erro);
      mostrarMensagem(erro.mensagem || 'Erro ao salvar. Tente de novo.');
    });
}

// ===== Filtro e ordem lembrados entre visitas =====

function lerEscolha(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    return null;
  }
}

function salvarEscolha(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (erro) {
    console.error('Não foi possível lembrar o filtro:', erro);
  }
}

// Os links "ver todas" da visão geral chegam com ?filtro= e ?ordem=; sem eles vale a última escolha
var parametrosUrl = new URLSearchParams(location.search);
filtroAtual = parametrosUrl.get('filtro') || lerEscolha(CHAVE_FILTRO) || FILTRO_PADRAO;
select_ordem.value = parametrosUrl.get('ordem') || lerEscolha(CHAVE_ORDEM) || ORDEM_PADRAO;

// Primeira carga da tela
if (validarSessao()) {
  listarConquistas();
}
