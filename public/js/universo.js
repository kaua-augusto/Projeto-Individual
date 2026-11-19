var PARTE_VISIVEL_PARA_REVELAR = 0.2;

function trocarMidia(imagemGrande, miniatura) {
  var imagemMiniatura = miniatura.querySelector('img');
  imagemGrande.src = imagemMiniatura.src;
  imagemGrande.alt = imagemMiniatura.alt;

  var miniaturas = miniatura.parentElement.children;
  for (var indice = 0; indice < miniaturas.length; indice++) {
    miniaturas[indice].classList.remove('active');
  }
  miniatura.classList.add('active');
}

function revelarSecoes() {
  var observador = new IntersectionObserver(mostrarSecoesNaTela, { threshold: PARTE_VISIVEL_PARA_REVELAR });
  var secoes = document.querySelectorAll('.universe-section');

  for (var indice = 0; indice < secoes.length; indice++) {
    observador.observe(secoes[indice]);
  }
}

function mostrarSecoesNaTela(entradas, observador) {
  for (var indice = 0; indice < entradas.length; indice++) {
    if (entradas[indice].isIntersecting) {
      entradas[indice].target.classList.add('visible');
      observador.unobserve(entradas[indice].target);
    }
  }
}

ajustarMenuDaSessao();
revelarSecoes();
