var TAMANHO_MINIMO_SENHA = 6;

redirecionarSeLogado();

function cadastrar() {
  aguardar();
  div_erros_login.hidden = true;

  var nomeVar = input_nome.value.trim();
  var emailVar = input_email.value.trim();
  var senhaVar = input_senha.value;
  var confirmacaoVar = input_confirmacao.value;

  if (nomeVar == '' || emailVar == '' || senhaVar == '' || confirmacaoVar == '') {
    mostrarMensagem('Preencha todos os campos para criar o perfil.');
    finalizarAguardar();
    return false;
  }

  if (emailVar.indexOf('@') == -1 || emailVar.indexOf('.') == -1) {
    mostrarMensagem('E-mail inválido. Use o formato nome@provedor.com');
    finalizarAguardar();
    return false;
  }

  if (senhaVar.length < TAMANHO_MINIMO_SENHA) {
    mostrarMensagem('A senha precisa ter pelo menos ' + TAMANHO_MINIMO_SENHA + ' caracteres.');
    finalizarAguardar();
    return false;
  }

  if (senhaVar != confirmacaoVar) {
    mostrarMensagem('As senhas não batem. Confira e tente de novo.');
    finalizarAguardar();
    return false;
  }

  btn_cadastrar.disabled = true;

  chamarApi('/usuarios/cadastrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nomeServer: nomeVar,
      emailServer: emailVar,
      senhaServer: senhaVar
    })
  })
    .then(function (json) {
      mostrarMensagem('Cadastro feito! Abrindo seu painel...');
      iniciarSessao(json);
    })
    .catch(function (erro) {
      console.error(erro);
      btn_cadastrar.disabled = false;
      finalizarAguardar(erro.mensagem || 'Houve um erro ao tentar realizar o cadastro!');
    });

  return false;
}
