function ajustarLinksDaSessao() {
  if (!estaLogado()) {
    return;
  }

  a_acao_principal.href = './dashboard.html';
  a_acao_principal.textContent = 'Abrir meu painel';
  a_acao_final.href = './dashboard.html';
  a_acao_final.textContent = 'Ver meu progresso';
  a_acao_secundaria.hidden = true;
}

ajustarMenuDaSessao();
ajustarLinksDaSessao();
