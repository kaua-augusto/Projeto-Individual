const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const formError = document.getElementById('form-error');
const demoHint = document.getElementById('demo-hint');

redirectIfLoggedIn();

if (DEMO_MODE) {
  demoHint.textContent = 'MODO DEMO — teste com v@nightcity.net / samurai';
}

const reason = new URLSearchParams(location.search).get('motivo');
if (reason == 'sessao') {
  showMessage('Faça login para abrir o painel.');
} else if (reason == 'saiu') {
  showMessage('Você saiu da rede. Até a próxima, choom.', true);
}

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  logIn();
});

function logIn() {
  showLoading();
  formError.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email == '' || password == '') {
    showMessage('Preencha e-mail e senha para entrar.');
    hideLoading();
    return false;
  }

  console.log('FORM LOGIN: ', email);
  loginButton.disabled = true;

  fetchApi('/usuarios/autenticar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emailServer: email,
      senhaServer: password
    })
  })
    .then(function (json) {
      console.log(json);
      showMessage('Acesso liberado. Carregando seu painel...', true);
      startSession(json);
    })
    .catch(function (error) {
      console.error(error);
      loginButton.disabled = false;
      hideLoading(error.mensagem || 'Houve um erro ao tentar realizar o login!');
    });

  return false;
}
