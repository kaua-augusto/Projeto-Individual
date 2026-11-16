const loginLink = document.getElementById('nav-login');
const signupLink = document.getElementById('nav-signup');
const primaryAction = document.getElementById('primary-action');
const secondaryAction = document.getElementById('secondary-action');
const finalAction = document.getElementById('final-action');

if (isLoggedIn()) {
  loginLink.href = 'dashboard/dashboard.html';
  loginLink.textContent = 'Meu painel';
  signupLink.href = '#';
  signupLink.textContent = 'Sair';
  signupLink.addEventListener('click', function (event) {
    event.preventDefault();
    clearSession();
  });
  primaryAction.href = 'dashboard/dashboard.html';
  primaryAction.textContent = 'Abrir meu painel';
  finalAction.href = 'dashboard/dashboard.html';
  finalAction.textContent = 'Ver meu progresso';
  secondaryAction.hidden = true;
}
