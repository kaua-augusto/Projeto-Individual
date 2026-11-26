var ESPERA_SALVAR = 500;

var idUsuario = sessionStorage.ID_USUARIO;

var categorias = [];
var salvamentosPendentes = {};
var temporizadoresSalvar = {};

function listarCategorias() {
  chamarApi(`/progresso/categorias/${idUsuario}`, { cache: 'no-store' })
    .then(function (lista) {
      categorias = lista;
      mostrarCategorias();
    })
    .catch(function (erro) {
      console.error(erro);
      div_categorias.innerHTML = '';
      p_erro_categorias.hidden = false;
    });
}

function mostrarCategorias() {
  var linhas = '';
  for (var i = 0; i < categorias.length; i++) {
    linhas += montarLinha(categorias[i]);
  }
  div_categorias.innerHTML = linhas;
  atualizarTotal();
}

function montarLinha(categoria) {
  var id = categoria.idCategoria;
  var nome = escaparHtml(categoria.nome);
  var porcentagem = porcentagemCategoria(categoria);

  return `
    <div class="category-row">
      <div class="category-info">
        <label for="input_qtd_${id}">${nome}</label>
        <p id="p_falta_${id}">${escaparHtml(descreverFalta(categoria))}</p>
      </div>
      <progress id="progress_${id}" max="100" value="${porcentagem}" aria-label="Progresso em ${nome}"></progress>
      <p class="category-percentage" id="p_porcentagem_${id}">${porcentagem}%</p>
      <div class="counter">
        <button class="counter-button" type="button" onclick="mudarValor(${id}, -1)" aria-label="Diminuir ${nome}">−</button>
        <input id="input_qtd_${id}" type="number" value="${categoria.concluidas}" min="0" max="${categoria.total}" oninput="definirValor(${id}, this.value, true)" onchange="definirValor(${id}, this.value, false)">
        <button class="counter-button" type="button" onclick="mudarValor(${id}, 1)" aria-label="Aumentar ${nome}">+</button>
        <span>/ ${categoria.total}</span>
      </div>
    </div>`;
}

function descreverFalta(categoria) {
  var falta = categoria.total - categoria.concluidas;
  if (falta <= 0) {
    return 'completa ✓';
  }
  return `${categoria.descricao} · faltam ${falta}`;
}

function mudarValor(idCategoria, passo) {
  definirValor(idCategoria, buscarCategoria(idCategoria).concluidas + passo, false);
}

function definirValor(idCategoria, valor, digitando) {
  var categoria = buscarCategoria(idCategoria);
  var digitado = String(valor);
  var preso = Math.max(0, Math.min(categoria.total, Number(valor) || 0));
  categoria.concluidas = preso;

  if (!digitando || (digitado !== '' && Number(digitado) != preso)) {
    document.getElementById('input_qtd_' + idCategoria).value = preso;
  }
  atualizarLinha(categoria);
  atualizarTotal();
  agendarSalvamento(idCategoria, preso);
}

function atualizarLinha(categoria) {
  var id = categoria.idCategoria;
  var porcentagem = porcentagemCategoria(categoria);
  document.getElementById('progress_' + id).value = porcentagem;
  document.getElementById('p_porcentagem_' + id).textContent = porcentagem + '%';
  document.getElementById('p_falta_' + id).textContent = descreverFalta(categoria);
}

function atualizarTotal() {
  if (categorias.length == 0) {
    return;
  }

  var completas = 0;
  for (var i = 0; i < categorias.length; i++) {
    if (categorias[i].concluidas >= categorias[i].total) {
      completas++;
    }
  }
  span_total_porcentagem.textContent = porcentagemMissoes(categorias);
  span_completas.textContent = completas;
  span_qtd_categorias.textContent = categorias.length;
}

function agendarSalvamento(idCategoria, valor) {
  salvamentosPendentes[idCategoria] = valor;
  clearTimeout(temporizadoresSalvar[idCategoria]);
  temporizadoresSalvar[idCategoria] = setTimeout(function () {
    salvarCategoria(idCategoria, valor);
  }, ESPERA_SALVAR);
}

function salvarCategoria(idCategoria, concluidas) {
  delete salvamentosPendentes[idCategoria];

  chamarApi('/progresso/atualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idUsuarioServer: idUsuario,
      idCategoriaServer: idCategoria,
      concluidasServer: concluidas
    })
  })
    .then(function () {
      mostrarMensagem('Progresso salvo.');
    })
    .catch(function (erro) {
      console.error(erro);
      mostrarMensagem('Erro ao salvar. Tente de novo.');
    });
}

function salvarPendentesAoSair() {
  var ids = Object.keys(salvamentosPendentes);
  for (var i = 0; i < ids.length; i++) {
    clearTimeout(temporizadoresSalvar[ids[i]]);
    fetch('/progresso/atualizar', {
      method: 'PUT',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idUsuarioServer: idUsuario,
        idCategoriaServer: ids[i],
        concluidasServer: salvamentosPendentes[ids[i]]
      })
    }).catch(function (erro) {
      console.error(erro);
    });
  }
  salvamentosPendentes = {};
}

function buscarCategoria(idCategoria) {
  return categorias.find(function (categoria) {
    return categoria.idCategoria == idCategoria;
  });
}

window.addEventListener('pagehide', salvarPendentesAoSair);
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'hidden') {
    salvarPendentesAoSair();
  }
});

if (validarSessao()) {
  listarCategorias();
}
