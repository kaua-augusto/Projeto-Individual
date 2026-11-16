const MIN_PASSWORD_LENGTH = 6;

const signupForm = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmationInput = document.getElementById('password-confirmation');
const signupButton = document.getElementById('signup-button');
const formError = document.getElementById('form-error');

redirectIfLoggedIn();

signupForm.addEventListener('submit', function (event) {
  event.preventDefault();
  signUp();
});

function signUp() {
  showLoading();
  formError.hidden = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmation = confirmationInput.value;

  if (name == '' || email == '' || password == '' || confirmation == '') {
    showMessage('Preencha todos os campos para criar o perfil.');
    hideLoading();
    return false;
  }

  if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
    showMessage('E-mail inválido. Use o formato nome@provedor.com');
    hideLoading();
    return false;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    showMessage('A senha precisa ter pelo menos 6 caracteres.');
    hideLoading();
    return false;
  }

  if (password != confirmation) {
    showMessage('As senhas não batem. Confira e tente de novo.');
    hideLoading();
    return false;
  }

  signupButton.disabled = true;

  fetchApi('/usuarios/cadastrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nomeServer: name,
      emailServer: email,
      senhaServer: password
    }),
  })
    .then(function (json) {
      showMessage('Cadastro feito! Abrindo seu painel...', true);
      startSession(json);
    })
    .catch(function (error) {
      console.log('#ERRO:', error);
      signupButton.disabled = false;
      hideLoading(error.mensagem || 'Houve um erro ao tentar realizar o cadastro!');
    });

  return false;
}
