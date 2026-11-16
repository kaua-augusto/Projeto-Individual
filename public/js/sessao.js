const DEMO_MODE = false;

const ROOT = location.pathname.indexOf('/dashboard/') != -1 ? '../' : './';

function isLoggedIn() {
  try {
    return sessionStorage.ID_USUARIO != null && sessionStorage.NOME_USUARIO != null;
  } catch (error) {
    return false;
  }
}

function validateSession() {
  if (!isLoggedIn()) {
    try { sessionStorage.DESTINO = location.pathname.split('/').pop(); } catch (error) { }
    window.location.replace(ROOT + 'login.html?motivo=sessao');
    return false;
  }

  const name = sessionStorage.NOME_USUARIO;
  const userName = document.getElementById('user-name');
  if (userName) userName.innerHTML = name;

  const userInitial = document.getElementById('user-initial');
  if (userInitial) userInitial.innerHTML = name.charAt(0).toUpperCase();

  return true;
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.replace(ROOT + 'dashboard/dashboard.html');
  }
}

function startSession(json) {
  sessionStorage.ID_USUARIO = json.id;
  sessionStorage.NOME_USUARIO = json.nome;
  sessionStorage.EMAIL_USUARIO = json.email;

  const destination = sessionStorage.DESTINO || 'dashboard.html';
  sessionStorage.removeItem('DESTINO');

  setTimeout(function () {
    window.location.replace(ROOT + 'dashboard/' + destination);
  }, 900);
}

function clearSession() {
  sessionStorage.clear();
  window.location.replace(ROOT + 'login.html?motivo=saiu');
}

function showLoading() {
  const loading = document.getElementById('loading');
  loading.hidden = false;
}

function hideLoading(text) {
  const loading = document.getElementById('loading');
  loading.hidden = true;

  const formError = document.getElementById('form-error');
  if (text) {
    formError.hidden = false;
    formError.innerHTML = text;
  }
}

function showMessage(text, success) {
  const alertBox = document.getElementById('alert');
  const alertMessage = document.getElementById('alert-message');

  alertMessage.innerHTML = text;
  alertBox.hidden = false;

  clearTimeout(window.messageTimer);
  window.messageTimer = setTimeout(hideMessage, 5000);
}

function hideMessage() {
  document.getElementById('alert').hidden = true;
}

function fetchApi(url, options) {
  if (DEMO_MODE) {
    return respostaMock(url, options);
  }

  return fetch(url, options)
    .catch(function () {
      throw { status: 0, codigo: 'SEM_CONEXAO', mensagem: 'Não foi possível conectar ao servidor.' };
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return response.text().then(function (text) {
        let error;
        try { error = JSON.parse(text); } catch (parseError) { error = { mensagem: text }; }
        error.status = response.status;
        throw error;
      });
    });
}

function formatHours(minutes) {
  const hours = Math.floor(minutes / 60);
  return hours.toLocaleString('pt-BR');
}

function formatDate(milliseconds) {
  return new Date(milliseconds).toLocaleDateString('pt-BR');
}

function relativeTime(milliseconds) {
  const days = Math.floor((Date.now() - milliseconds) / 86400000);
  if (days <= 0) return 'hoje';
  if (days == 1) return 'ontem';
  if (days < 30) return 'há ' + days + ' dias';
  const months = Math.floor(days / 30);
  if (months < 12) return 'há ' + months + (months == 1 ? ' mês' : ' meses');
  const years = Math.floor(months / 12);
  return 'há ' + years + (years == 1 ? ' ano' : ' anos');
}

function escapeHtml(text) {
  const element = document.createElement('div');
  element.textContent = text == null ? '' : text;
  return element.innerHTML;
}

window.addEventListener('pageshow', function (event) {
  if (event.persisted && location.pathname.indexOf('/dashboard/') != -1) {
    location.reload();
  }
});

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState == 'visible' && typeof window.refreshOnReturn == 'function') {
    window.refreshOnReturn();
  }
});
