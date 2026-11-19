var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email);

    var instrucaoSql = `
        SELECT idUsuario, nome, email
            FROM usuario
            WHERE email = ? AND senha = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n\n function cadastrar():", nome, email);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, email, senha]);
}

function buscarPerfil(idUsuario) {
    var instrucaoSql = `
        SELECT nome, horasJogadas, dtHoras
            FROM vwPerfilUsuario
            WHERE idUsuario = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizarHoras(idUsuario, horas) {
    var instrucaoSql = `
        INSERT INTO tempoJogo (fkUsuario, horasJogadas, dtHoras) VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE horasJogadas = VALUES(horasJogadas), dtHoras = VALUES(dtHoras);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario, horas]);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarPerfil,
    atualizarHoras
};
