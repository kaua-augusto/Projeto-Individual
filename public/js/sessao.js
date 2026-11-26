var MILISSEGUNDOS_POR_DIA = 86400000;
var TEMPO_MENSAGEM = 5000;

var temporizadorMensagem = null;

function estaLogado() {
  try {
    return sessionStorage.ID_USUARIO != null && sessionStorage.NOME_USUARIO != null;
  } catch (erro) {
    return false;
  }
}

function validarSessao() {
  if (!estaLogado()) {
    try {
      sessionStorage.DESTINO = location.pathname.split('/').pop();
    } catch (erro) {
    }
    window.location.replace('./login.html?motivo=sessao');
    return false;
  }

  nome_usuario.textContent = sessionStorage.NOME_USUARIO;
  return true;
}

function redirecionarSeLogado() {
  if (estaLogado()) {
    window.location.replace('./dashboard.html');
  }
}

function iniciarSessao(json) {
  sessionStorage.ID_USUARIO = json.id;
  sessionStorage.NOME_USUARIO = json.nome;
  sessionStorage.EMAIL_USUARIO = json.email;

  var destino = sessionStorage.DESTINO || 'dashboard.html';
  sessionStorage.removeItem('DESTINO');

  setTimeout(function () {
    window.location.replace('./' + destino);
  }, 900);
}

function limparSessao() {
  sessionStorage.clear();
}

function ajustarMenuDaSessao() {
  if (!estaLogado()) {
    return;
  }

  a_login.href = './dashboard.html';
  a_login.textContent = 'Meu painel';
  a_cadastro.href = './login.html?motivo=saiu';
  a_cadastro.textContent = 'Sair';
  a_cadastro.onclick = limparSessao;
}

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

function mostrarMensagem(texto) {
  span_mensagem.textContent = texto;
  div_alerta.hidden = false;

  clearTimeout(temporizadorMensagem);
  temporizadorMensagem = setTimeout(esconderMensagem, TEMPO_MENSAGEM);
}

function esconderMensagem() {
  div_alerta.hidden = true;
}

function alternarMenu() {
  var aberto = nav_menu.classList.toggle('nav-open');
  btn_menu.setAttribute('aria-expanded', aberto);
}

function fecharMenu() {
  nav_menu.classList.remove('nav-open');
  btn_menu.setAttribute('aria-expanded', false);
}

function chamarApi(url, opcoes) {
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
        if (typeof erro != 'object' || erro == null) {
          erro = { mensagem: erro };
        }
        erro.status = resposta.status;
        throw erro;
      });
    });
}

function formatarData(milissegundos) {
  var data = new Date(milissegundos);
  return data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0') + '-' + String(data.getDate()).padStart(2, '0');
}

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

function escaparHtml(texto) {
  var elemento = document.createElement('div');
  elemento.textContent = texto == null ? '' : texto;
  return elemento.innerHTML;
}

window.addEventListener('pageshow', function (evento) {
  if (evento.persisted && document.body.classList.contains('dashboard-page')) {
    location.reload();
  }
});

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'visible' && typeof atualizarAoVoltar == 'function') {
    atualizarAoVoltar();
  }
});
