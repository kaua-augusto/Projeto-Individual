// Rank pelo % de conclusão: o primeiro mínimo que o usuário alcança define o rank
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

// Cores com significado fixo, lidas do style.css: amarelo = concluído, ciano = informação
var estilos = getComputedStyle(document.documentElement);
var corAmarelo = estilos.getPropertyValue('--yellow').trim();
var corCiano = estilos.getPropertyValue('--cyan').trim();
var corTexto = estilos.getPropertyValue('--text').trim();
var corApagada = estilos.getPropertyValue('--muted').trim();
var corGrade = estilos.getPropertyValue('--border').trim();

// ===== Gráficos =====
// Criados uma vez, vazios; a cada carga só os dados mudam e o chart.update() redesenha

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

// Barras deitadas, uma por categoria de missão, de 0 a 100%
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

// ===== Carga dos dados =====

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
      // Mostra o conteúdo antes de desenhar, para os gráficos já terem tamanho na tela
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

// Chamada pelo sessao.js quando o usuário volta para a aba
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

// ===== Cards =====

function atualizarCards(quantidadeDesbloqueadas, quantidadeFaltando) {
  var total = conquistas.length;
  var porcentagem = porcentagemConclusao(quantidadeDesbloqueadas, total);
  var porcentagemFalta = Math.round((100 - porcentagem) * 10) / 10;
  var horas = perfil.horasJogadas || 0;

  span_porcentagem.textContent = porcentagem.toLocaleString('pt-BR') + '%';
  progress_conclusao.value = porcentagem;
  p_rank.textContent = 'Rank: ' + buscarRank(porcentagem);

  span_desbloqueadas.textContent = quantidadeDesbloqueadas;
  span_total.textContent = ' / ' + total;

  span_faltam.textContent = quantidadeFaltando;
  p_faltam_info.textContent = quantidadeFaltando == 0
    ? 'platinou. Lenda.'
    : `${quantidadeFaltando == 1 ? 'conquista' : 'conquistas'} · ${porcentagemFalta.toLocaleString('pt-BR')}% do total`;

  span_horas.textContent = horas.toLocaleString('pt-BR') + 'h';
  p_horas_info.textContent = descreverHoras(horas, quantidadeDesbloqueadas);

  p_comecar.hidden = quantidadeDesbloqueadas > 0;
}

function buscarRank(porcentagem) {
  for (var i = 0; i < RANKS.length; i++) {
    if (porcentagem >= RANKS[i].minimo) {
      return RANKS[i].nome;
    }
  }
}

// "atualizado há 2 dias · 6h por conquista" (horas jogadas ÷ conquistas marcadas)
function descreverHoras(horas, quantidadeDesbloqueadas) {
  if (!perfil.dtHoras) {
    return 'ainda não informado';
  }

  var texto = 'atualizado ' + tempoRelativo(perfil.dtHoras);
  if (horas > 0 && quantidadeDesbloqueadas > 0) {
    var horasPorConquista = (horas / quantidadeDesbloqueadas).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    texto += ' · ' + horasPorConquista + 'h por conquista';
  }
  return texto;
}

// ===== Linha do tempo =====

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
  p_melhor_mes.textContent = descreverMelhorMes();
}

// Conta as conquistas de cada mês pelo texto da data (aaaa-mm-dd), sem new Date(), para o fuso não trocar o mês.
// Vai do mês anterior à primeira conquista (o ponto zero da linha) até o mês atual, com 0 nos meses sem conquista.
function montarLinhaTempo(desbloqueadas) {
  var quantidadePorMes = {};
  var primeiroMes = null;
  var ultimoMes = null;

  for (var i = 0; i < desbloqueadas.length; i++) {
    var data = desbloqueadas[i].dtDesbloqueio;
    if (!data) {
      continue; // sem data não tem mês para entrar
    }
    var chave = data.slice(0, 7);
    quantidadePorMes[chave] = (quantidadePorMes[chave] || 0) + 1;
    if (primeiroMes == null || chave < primeiroMes) primeiroMes = chave;
    if (ultimoMes == null || chave > ultimoMes) ultimoMes = chave;
  }
  if (primeiroMes == null) {
    return [];
  }

  // Meses contados como ano * 12 + mês, para comparar e somar sem trocar de ano na mão
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

// "2026-11" -> 2026 * 12 + 10
function numeroDoMes(chave) {
  return Number(chave.slice(0, 4)) * 12 + Number(chave.slice(5, 7)) - 1;
}

function descreverMelhorMes() {
  if (linhaTempo.length == 0) {
    return 'Sem conquistas ainda: a linha começa na primeira.';
  }

  var melhor = linhaTempo[0];
  for (var i = 0; i < linhaTempo.length; i++) {
    if (linhaTempo[i].novas > melhor.novas) {
      melhor = linhaTempo[i];
    }
  }
  return `Mês mais produtivo: ${melhor.rotulo} (+${melhor.novas})`;
}

// ===== Missões por categoria =====

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

  p_media_missoes.textContent = `Média das ${categorias.length} categorias: ${porcentagemMissoes(categorias)}%`;
}

// ===== Destaques =====

function atualizarDestaques(desbloqueadas, faltando) {
  var maisFaceis = pegarPrimeiras(faltando, function (a, b) { return b.global - a.global; });
  var recentes = pegarPrimeiras(desbloqueadas, function (a, b) { return b.desbloqueadaEm - a.desbloqueadaEm; });
  var maisRaras = pegarPrimeiras(desbloqueadas, function (a, b) { return a.global - b.global; });

  ul_mais_faceis.innerHTML = montarListaDestaque(maisFaceis, 'Nada faltando. 100%!', function (conquista) {
    return conquista.global.toLocaleString('pt-BR') + '%';
  });
  ul_recentes.innerHTML = montarListaDestaque(recentes, 'Nenhuma conquista ainda.', function (conquista) {
    return tempoRelativo(conquista.desbloqueadaEm);
  });
  ul_mais_raras.innerHTML = montarListaDestaque(maisRaras, 'Nenhuma conquista ainda.', function (conquista) {
    return `<span class="${buscarRaridade(conquista.global).classe}">${conquista.global.toLocaleString('pt-BR')}%</span>`;
  });
}

function pegarPrimeiras(lista, comparar) {
  return lista.slice().sort(comparar).slice(0, TAMANHO_LISTA_DESTAQUE);
}

// Itens de uma lista de destaque; descreverLado devolve o que aparece à direita de cada item
function montarListaDestaque(lista, mensagemVazia, descreverLado) {
  if (lista.length == 0) {
    return `<li class="achievement-item">${mensagemVazia}</li>`;
  }

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

// ===== Horas jogadas =====

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

// Chamada no onsubmit do formulário: o return false evita que a página recarregue
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

// Primeira carga da tela
if (validarSessao()) {
  carregarPainel();
}
