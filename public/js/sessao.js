// Modo demonstração: true faz as chamadas da API serem respondidas pelo dados-mock.js, sem servidor nem banco
var MODO_DEMO = false;

var MILISSEGUNDOS_POR_DIA = 86400000;
var TEMPO_MENSAGEM = 5000;

var temporizadorMensagem = null;

// ===== Sessão =====

function estaLogado() {
  try {
    return sessionStorage.ID_USUARIO != null && sessionStorage.NOME_USUARIO != null;
  } catch (erro) {
    return false;
  }
}

// Páginas do painel: sem sessão, guarda a página pedida e vai para o login; com sessão, mostra o usuário no menu
function validarSessao() {
  if (!estaLogado()) {
    try {
      sessionStorage.DESTINO = location.pathname.split('/').pop();
    } catch (erro) {
    }
    window.location.replace('./login.html?motivo=sessao');
    return false;
  }

  var nome = sessionStorage.NOME_USUARIO;
  var partes = nome.trim().split(/\s+/);
  var iniciais = nome.slice(0, 2);
  if (partes.length >= 2) {
    iniciais = partes[0][0] + partes[1][0]; // ['JOHNNY', 'SILVERHAND'] = 'JS'
  }

  nome_usuario.textContent = nome;
  avatar_usuario.textContent = iniciais.toUpperCase();
  return true;
}

// Login e cadastro: quem já está logado vai direto para o painel
function redirecionarSeLogado() {
  if (estaLogado()) {
    window.location.replace('./dashboard.html');
  }
}

// Guarda o usuário e abre a página que ele tentou acessar antes do login (ou a visão geral)
function iniciarSessao(json) {
  sessionStorage.ID_USUARIO = json.id;
  sessionStorage.NOME_USUARIO = json.nome;
  sessionStorage.EMAIL_USUARIO = json.email;

  var destino = sessionStorage.DESTINO || 'dashboard.html';
  sessionStorage.removeItem('DESTINO');

  setTimeout(function () {
    window.location.replace('./' + destino);
  }, 900); // tempo para o usuário ler a mensagem de sucesso
}

// Chamada no onclick do link "Sair", que leva para o login
function limparSessao() {
  sessionStorage.clear();
}

// ===== Carregamento e mensagens =====

function aguardar() {
  div_aguardar.hidden = false;
}

function finalizarAguardar(texto) {
  div_aguardar.hidden = true;

  if (texto) {
    div_erros_login.hidden = false;
    div_erros_login.textContent = texto;
  }
}

// Aviso no canto da tela que some sozinho
function mostrarMensagem(texto) {
  span_mensagem.textContent = texto;
  div_alerta.hidden = false;

  clearTimeout(temporizadorMensagem);
  temporizadorMensagem = setTimeout(esconderMensagem, TEMPO_MENSAGEM);
}

function esconderMensagem() {
  div_alerta.hidden = true;
}

// ===== Menu das páginas públicas (telas estreitas) =====

function alternarMenu() {
  var aberto = nav_menu.classList.toggle('nav-open');
  btn_menu.setAttribute('aria-expanded', aberto);
}

function fecharMenu() {
  nav_menu.classList.remove('nav-open');
  btn_menu.setAttribute('aria-expanded', false);
}

// ===== API =====

// Toda chamada da API passa por aqui: no modo demo quem responde é o dados-mock.js.
// Com servidor, devolve o JSON da resposta ou lança { status, codigo, mensagem } para o .catch de quem chamou.
function chamarApi(url, opcoes) {
  if (MODO_DEMO) {
    return respostaMock(url, opcoes);
  }

  return fetch(url, opcoes)
    .catch(function () {
      throw { status: 0, codigo: 'SEM_CONEXAO', mensagem: 'Não foi possível conectar ao servidor.' };
    })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }

      return resposta.text().then(function (texto) {
        var erro;
        try {
          erro = JSON.parse(texto);
        } catch (erroLeitura) {
          erro = texto;
        }
        // O servidor responde com texto puro (400) ou com a mensagem do MySQL em JSON (500)
        if (typeof erro != 'object' || erro == null) {
          erro = { mensagem: erro };
        }
        erro.status = resposta.status;
        throw erro;
      });
    });
}

// ===== Formatação =====

// Data no formato aaaa-mm-dd, no fuso de quem está usando o site (o mesmo do campo <input type="date">)
function formatarData(milissegundos) {
  var data = new Date(milissegundos);
  return data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0') + '-' + String(data.getDate()).padStart(2, '0');
}

// 3 dias atrás -> "há 3 dias"
function tempoRelativo(milissegundos) {
  var dias = Math.floor((Date.now() - milissegundos) / MILISSEGUNDOS_POR_DIA);
  if (dias <= 0) return 'hoje';
  if (dias == 1) return 'ontem';
  if (dias < 30) return 'há ' + dias + ' dias';

  var meses = Math.floor(dias / 30);
  if (meses < 12) return 'há ' + meses + (meses == 1 ? ' mês' : ' meses');

  var anos = Math.floor(meses / 12);
  return 'há ' + anos + (anos == 1 ? ' ano' : ' anos');
}

// Texto digitado pelo usuário vira texto comum antes de entrar no HTML (evita que vire tag)
function escaparHtml(texto) {
  var elemento = document.createElement('div');
  elemento.textContent = texto == null ? '' : texto;
  return elemento.innerHTML;
}

// ===== Voltar para a página =====

// O botão Voltar pode mostrar uma cópia guardada da página do painel; recarrega para não exibir dados velhos
window.addEventListener('pageshow', function (evento) {
  if (evento.persisted && document.body.classList.contains('dashboard-page')) {
    location.reload();
  }
});

// Ao voltar para a aba, a página recarrega os dados sem mostrar o carregando (atualizarAoVoltar fica no js de cada página)
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'visible' && typeof atualizarAoVoltar == 'function') {
    atualizarAoVoltar();
  }
});
