
var MODO_DEMO = false;

var RAIZ = location.pathname.indexOf("/dashboard/") != -1 ? "../" : "./";

function usuarioLogado() {
    try {
        return sessionStorage.ID_USUARIO != null && sessionStorage.NOME_USUARIO != null;
    } catch (e) {
        return false;
    }
}

function validarSessao() {
    if (!usuarioLogado()) {
        try { sessionStorage.DESTINO = location.pathname.split("/").pop(); } catch (e) { }
        window.location.replace(RAIZ + "login.html?motivo=sessao");
        return false;
    }

    var nome = sessionStorage.NOME_USUARIO;
    var b_usuario = document.getElementById("b_usuario");
    if (b_usuario) b_usuario.innerHTML = nome;

    var b_inicial = document.getElementById("b_inicial");
    if (b_inicial) b_inicial.innerHTML = nome.charAt(0).toUpperCase();

    return true;
}

function redirecionarSeLogado() {
    if (usuarioLogado()) {
        window.location.replace(RAIZ + "dashboard/dashboard.html");
    }
}

function entrarNaSessao(json) {
    sessionStorage.ID_USUARIO = json.id;
    sessionStorage.NOME_USUARIO = json.nome;
    sessionStorage.EMAIL_USUARIO = json.email;

    var destino = sessionStorage.DESTINO || "dashboard.html";
    sessionStorage.removeItem("DESTINO");

    setTimeout(function () {
        window.location.replace(RAIZ + "dashboard/" + destino);
    }, 900);
}

function limparSessao() {
    sessionStorage.clear();
    window.location.replace(RAIZ + "login.html?motivo=saiu");
}

function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.hidden = false;
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.hidden = true;

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.hidden = false;
        divErrosLogin.innerHTML = texto;
    }
}

function mostrarMensagem(texto, sucesso) {
    var cardErro = document.getElementById("cardErro");
    var mensagem_erro = document.getElementById("mensagem_erro");

    mensagem_erro.innerHTML = texto;
    cardErro.hidden = false;

    clearTimeout(window.timerMensagem);
    window.timerMensagem = setTimeout(sumirMensagem, 5000);
}

function sumirMensagem() {
    document.getElementById("cardErro").hidden = true;
}

function buscarApi(url, opcoes) {
    if (MODO_DEMO) {
        return respostaMock(url, opcoes);
    }

    return fetch(url, opcoes)
        .catch(function () {
            throw { status: 0, codigo: "SEM_CONEXAO", mensagem: "Não foi possível conectar ao servidor." };
        })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }
            return resposta.text().then(function (texto) {
                var erro;
                try { erro = JSON.parse(texto); } catch (e) { erro = { mensagem: texto }; }
                erro.status = resposta.status;
                throw erro;
            });
        });
}

function formatarHoras(minutos) {
    var horas = Math.floor(minutos / 60);
    return horas.toLocaleString("pt-BR");
}

function formatarData(ms) {
    return new Date(ms).toLocaleDateString("pt-BR");
}

function tempoRelativo(ms) {
    var dias = Math.floor((Date.now() - ms) / 86400000);
    if (dias <= 0) return "hoje";
    if (dias == 1) return "ontem";
    if (dias < 30) return "há " + dias + " dias";
    var meses = Math.floor(dias / 30);
    if (meses < 12) return "há " + meses + (meses == 1 ? " mês" : " meses");
    var anos = Math.floor(meses / 12);
    return "há " + anos + (anos == 1 ? " ano" : " anos");
}

function escaparHtml(texto) {
    var div = document.createElement("div");
    div.textContent = texto == null ? "" : texto;
    return div.innerHTML;
}

window.addEventListener("pageshow", function (evento) {
    if (evento.persisted && location.pathname.indexOf("/dashboard/") != -1) {
        location.reload();
    }
});

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState == "visible" && typeof window.atualizarAoVoltar == "function") {
        window.atualizarAoVoltar();
    }
});
