redirecionarSeLogado();

var motivo = new URLSearchParams(location.search).get('motivo');
if (motivo == 'sessao') {
  mostrarMensagem('Faça login para abrir o painel.');
} else if (motivo == 'saiu') {
  mostrarMensagem('Você saiu da rede. Até a próxima, choom.');
}

function entrar() {
  aguardar();
  div_erros_login.hidden = true;

  var emailVar = input_email.value.trim();
  var senhaVar = input_senha.value;

  if (emailVar == '' || senhaVar == '') {
    mostrarMensagem('Preencha e-mail e senha para entrar.');
    finalizarAguardar();
    return false;
  }

  btn_entrar.disabled = true;

  chamarApi('/usuarios/autenticar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emailServer: emailVar,
      senhaServer: senhaVar
    })
  })
    .then(function (json) {
      mostrarMensagem('Acesso liberado. Carregando seu painel...');
      iniciarSessao(json);
    })
    .catch(function (erro) {
      console.error(erro);
      btn_entrar.disabled = false;
      finalizarAguardar(erro.mensagem || 'Houve um erro ao tentar realizar o login!');
    });

  return false;
}
