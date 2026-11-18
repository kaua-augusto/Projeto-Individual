var RANKS = [
  { minimo: 100, nome: 'Lenda de Night City' },
  { minimo: 75, nome: 'Solo de elite' },
  { minimo: 50, nome: 'Mercenário' },
  { minimo: 25, nome: 'Street kid' },
  { minimo: 0, nome: 'Choom' }
];
var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
var TAMANHO_LISTA_DESTAQUE = 5;

var idUsuario = sessionStorage.ID_USUARIO;

var conquistas = [];
var categorias = [];
var perfil = null;
var linhaTempo = [];

var estilos = getComputedStyle(document.documentElement);
var corAmarelo = estilos.getPropertyValue('--yellow').trim();
var corCiano = estilos.getPropertyValue('--cyan').trim();
var corTexto = estilos.getPropertyValue('--text').trim();
var corApagada = estilos.getPropertyValue('--muted').trim();
var corGrade = estilos.getPropertyValue('--border').trim();

var chartLinhaTempo = new Chart(graficoLinhaTempo, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{ data: [], borderColor: corAmarelo, backgroundColor: corAmarelo, tension: 0.2 }]
  },
  options: {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (item) {
            var mes = linhaTempo[item.dataIndex];
            var porcentagem = porcentagemConclusao(mes.acumuladas, conquistas.length).toLocaleString('pt-BR');
            return [`${mes.acumuladas} de ${conquistas.length} conquistas (${porcentagem}%)`, `+${mes.novas} neste mês`];
          }
        }
      }
    },
    scales: {
      x: { grid: { color: corGrade }, ticks: { color: corApagada } },
      y: {
        min: 0,
        title: { display: true, text: 'Conquistas acumuladas', color: corApagada },
        grid: { color: corGrade },
        ticks: { color: corApagada, precision: 0 }
      }
    }
  }
});

var chartCategorias = new Chart(graficoCategorias, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  },
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (item) {
            var categoria = categorias[item.dataIndex];
            return `${categoria.concluidas} de ${categoria.total} · faltam ${categoria.total - categoria.concluidas}`;
          }
        }
      }
    },
    scales: {
      x: { min: 0, max: 100, grid: { color: corGrade }, ticks: { color: corApagada, callback: function (valor) { return valor + '%'; } } },
      y: { grid: { display: false }, ticks: { color: corTexto } }
    }
  }
});

function carregarPainel(silencioso) {
  if (!silencioso) {
    mostrarCarregando();
  }

  Promise.all([
    chamarApi(`/conquistas/listar/${idUsuario}`, { cache: 'no-store' }),
    chamarApi(`/usuarios/perfil/${idUsuario}`, { cache: 'no-store' }),
    chamarApi(`/progresso/categorias/${idUsuario}`, { cache: 'no-store' })
  ])
    .then(function (respostas) {
      conquistas = respostas[0];
      perfil = respostas[1];
      categorias = respostas[2];
      mostrarConteudo();
      atualizarPainel();
    })
    .catch(function (erro) {
      console.error('Erro ao carregar o painel:', erro);
      if (!silencioso) {
        mostrarErroCarregamento(erro);
      }
    });
}

function atualizarAoVoltar() {
  if (perfil) {
    carregarPainel(true);
  }
}

function atualizarPainel() {
  var desbloqueadas = [];
  var faltando = [];
  for (var i = 0; i < conquistas.length; i++) {
    if (conquistas[i].desbloqueada) {
      desbloqueadas.push(conquistas[i]);
    } else {
      faltando.push(conquistas[i]);
    }
  }

  atualizarCards(desbloqueadas.length, faltando.length);
  atualizarLinhaTempo(desbloqueadas);
  atualizarCategorias();
  atualizarDestaques(desbloqueadas, faltando);
}

function atualizarCards(quantidadeDesbloqueadas, quantidadeFaltando) {
  var total = conquistas.length;
  var porcentagem = porcentagemConclusao(quantidadeDesbloqueadas, total);
  var porcentagemFalta = Math.round((100 - porcentagem) * 10) / 10;

  span_porcentagem.textContent = porcentagem.toLocaleString('pt-BR');
  progress_conclusao.value = porcentagem;
  span_rank.textContent = buscarRank(porcentagem);

  span_desbloqueadas.textContent = quantidadeDesbloqueadas;
  span_total.textContent = total;

  span_faltam.textContent = quantidadeFaltando;
  span_faltam_plural.hidden = quantidadeFaltando == 1;
  span_porcentagem_falta.textContent = porcentagemFalta.toLocaleString('pt-BR');
  p_faltam_info.hidden = quantidadeFaltando == 0;
  p_platinou.hidden = quantidadeFaltando > 0;

  atualizarHoras(quantidadeDesbloqueadas);

  p_comecar.hidden = quantidadeDesbloqueadas > 0;
}

function buscarRank(porcentagem) {
  for (var i = 0; i < RANKS.length; i++) {
    if (porcentagem >= RANKS[i].minimo) {
      return RANKS[i].nome;
    }
  }
}

function atualizarHoras(quantidadeDesbloqueadas) {
  var horas = perfil.horasJogadas || 0;
  var temMedia = horas > 0 && quantidadeDesbloqueadas > 0;

  span_horas.textContent = horas.toLocaleString('pt-BR');
  p_horas_vazio.hidden = perfil.dtHoras != null;
  p_horas_info.hidden = perfil.dtHoras == null;
  if (perfil.dtHoras == null) {
    return;
  }

  span_horas_atualizado.textContent = tempoRelativo(perfil.dtHoras);
  span_horas_media.hidden = !temMedia;
  if (temMedia) {
    span_horas_por_conquista.textContent = (horas / quantidadeDesbloqueadas).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  }
}

function atualizarLinhaTempo(desbloqueadas) {
  linhaTempo = montarLinhaTempo(desbloqueadas);

  var rotulos = [];
  var valores = [];
  var linhasTabela = '';
  for (var i = 0; i < linhaTempo.length; i++) {
    rotulos.push(linhaTempo[i].rotulo);
    valores.push(linhaTempo[i].acumuladas);
    linhasTabela += `<tr><td>${linhaTempo[i].rotulo}</td><td>+${linhaTempo[i].novas}</td><td>${linhaTempo[i].acumuladas}</td></tr>`;
  }

  chartLinhaTempo.data.labels = rotulos;
  chartLinhaTempo.data.datasets[0].data = valores;
  chartLinhaTempo.options.scales.y.max = conquistas.length;
  chartLinhaTempo.options.scales.y.title.text = `Conquistas acumuladas (de ${conquistas.length})`;
  chartLinhaTempo.update();

  tbody_linha_tempo.innerHTML = linhasTabela;
  atualizarMelhorMes();
}

function montarLinhaTempo(desbloqueadas) {
  var quantidadePorMes = {};
  var primeiroMes = null;
  var ultimoMes = null;

  for (var i = 0; i < desbloqueadas.length; i++) {
    var data = desbloqueadas[i].dtDesbloqueio;
    if (!data) {
      continue;
    }
    var chave = data.slice(0, 7);
    quantidadePorMes[chave] = (quantidadePorMes[chave] || 0) + 1;
    if (primeiroMes == null || chave < primeiroMes) primeiroMes = chave;
    if (ultimoMes == null || chave > ultimoMes) ultimoMes = chave;
  }
  if (primeiroMes == null) {
    return [];
  }

  var hoje = new Date();
  var mesAtual = hoje.getFullYear() * 12 + hoje.getMonth();
  var mesFinal = Math.max(mesAtual, numeroDoMes(ultimoMes));
  var mes = numeroDoMes(primeiroMes) - 1;

  var linha = [];
  var acumuladas = 0;
  while (mes <= mesFinal) {
    var ano = Math.floor(mes / 12);
    var mesDoAno = mes % 12;
    var chaveMes = ano + '-' + String(mesDoAno + 1).padStart(2, '0');
    var novas = quantidadePorMes[chaveMes] || 0;
    acumuladas += novas;

    linha.push({ rotulo: MESES[mesDoAno] + '/' + String(ano).slice(2), novas: novas, acumuladas: acumuladas });
    mes++;
  }
  return linha;
}

function numeroDoMes(chave) {
  return Number(chave.slice(0, 4)) * 12 + Number(chave.slice(5, 7)) - 1;
}

function atualizarMelhorMes() {
  p_sem_linha.hidden = linhaTempo.length > 0;
  p_melhor_mes.hidden = linhaTempo.length == 0;
  if (linhaTempo.length == 0) {
    return;
  }

  var melhor = linhaTempo[0];
  for (var i = 0; i < linhaTempo.length; i++) {
    if (linhaTempo[i].novas > melhor.novas) {
      melhor = linhaTempo[i];
    }
  }
  span_melhor_mes.textContent = melhor.rotulo;
  span_melhor_mes_novas.textContent = melhor.novas;
}

function atualizarCategorias() {
  var rotulos = [];
  var valores = [];
  var cores = [];
  for (var i = 0; i < categorias.length; i++) {
    var porcentagem = porcentagemCategoria(categorias[i]);
    rotulos.push(categorias[i].nome);
    valores.push(porcentagem);
    cores.push(porcentagem == 100 ? corAmarelo : corCiano);
  }

  chartCategorias.data.labels = rotulos;
  chartCategorias.data.datasets[0].data = valores;
  chartCategorias.data.datasets[0].backgroundColor = cores;
  chartCategorias.update();

  span_qtd_categorias.textContent = categorias.length;
  span_media_missoes.textContent = porcentagemMissoes(categorias);
}

function atualizarDestaques(desbloqueadas, faltando) {
  var maisFaceis = pegarPrimeiras(faltando, function (a, b) { return b.global - a.global; });
  var recentes = pegarPrimeiras(desbloqueadas, function (a, b) { return b.desbloqueadaEm - a.desbloqueadaEm; });
  var maisRaras = pegarPrimeiras(desbloqueadas, function (a, b) { return a.global - b.global; });

  ul_mais_faceis.innerHTML = montarListaDestaque(maisFaceis, function (conquista) {
    return conquista.global.toLocaleString('pt-BR') + '%';
  });
  ul_recentes.innerHTML = montarListaDestaque(recentes, function (conquista) {
    return tempoRelativo(conquista.desbloqueadaEm);
  });
  ul_mais_raras.innerHTML = montarListaDestaque(maisRaras, function (conquista) {
    return `<span class="${buscarRaridade(conquista.global).classe}">${conquista.global.toLocaleString('pt-BR')}%</span>`;
  });

  p_faceis_vazio.hidden = maisFaceis.length > 0;
  p_recentes_vazio.hidden = recentes.length > 0;
  p_raras_vazio.hidden = maisRaras.length > 0;
}

function pegarPrimeiras(lista, comparar) {
  return lista.slice().sort(comparar).slice(0, TAMANHO_LISTA_DESTAQUE);
}

function montarListaDestaque(lista, descreverLado) {
  var html = '';
  for (var i = 0; i < lista.length; i++) {
    var conquista = lista[i];
    var descricao = conquista.descricao ? escaparHtml(conquista.descricao) : 'Conquista secreta';
    html += `
      <li class="achievement-item">
        ${iconeConquista(conquista)}
        <div class="achievement-info"><strong>${escaparHtml(conquista.nome)}</strong><small>${descricao}</small></div>
        <span class="achievement-side">${descreverLado(conquista)}</span>
      </li>`;
  }
  return html;
}

function abrirFormularioHoras() {
  form_horas.hidden = false;
  btn_editar_horas.hidden = true;
  input_horas.value = perfil.horasJogadas || '';
  input_horas.focus();
}

function fecharFormularioHoras() {
  form_horas.hidden = true;
  btn_editar_horas.hidden = false;
}

function fecharHorasComEsc(evento) {
  if (evento.key == 'Escape') {
    fecharFormularioHoras();
  }
}

function salvarHoras() {
  var horasVar = Number(input_horas.value);
  if (input_horas.value === '' || isNaN(horasVar) || horasVar < 0) {
    mostrarMensagem('Digite um número de horas válido.');
    return false;
  }

  chamarApi('/usuarios/horas', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idUsuarioServer: idUsuario,
      horasServer: horasVar
    })
  })
    .then(function (json) {
      perfil.horasJogadas = json.horasJogadas;
      perfil.dtHoras = json.dtHoras;
      fecharFormularioHoras();
      atualizarPainel();
      mostrarMensagem('Horas atualizadas.');
    })
    .catch(function (erro) {
      console.error(erro);
      mostrarMensagem(erro.mensagem || 'Erro ao salvar as horas.');
    });

  return false;
}

if (validarSessao()) {
  carregarPainel();
}
