function ajustarLinksDaSessao() {
  if (!estaLogado()) {
    return;
  }

  a_login.href = './dashboard.html';
  a_login.textContent = 'Meu painel';
  a_cadastro.href = './login.html?motivo=saiu';
  a_cadastro.textContent = 'Sair';
  a_cadastro.onclick = limparSessao;
  a_acao_principal.href = './dashboard.html';
  a_acao_principal.textContent = 'Abrir meu painel';
  a_acao_final.href = './dashboard.html';
  a_acao_final.textContent = 'Ver meu progresso';
  a_acao_secundaria.hidden = true;
}

ajustarLinksDaSessao();
