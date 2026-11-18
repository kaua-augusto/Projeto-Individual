var database = require("../database/config");

function listar(idUsuario) {
    var instrucaoSql = `
        SELECT idConquista, nome, descricao, raridadeGlobal, imagem, dtDesbloqueio
            FROM vwConquistaUsuario
            WHERE idUsuario = ?
            ORDER BY idConquista;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

function marcar(idUsuario, idConquista, data) {
    var instrucaoSql = `
        INSERT INTO conquistaUsuario (fkUsuario, fkConquista, dtDesbloqueio) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE dtDesbloqueio = VALUES(dtDesbloqueio);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario, idConquista, data]);
}

function desmarcar(idUsuario, idConquista) {
    var instrucaoSql = `
        DELETE FROM conquistaUsuario WHERE fkUsuario = ? AND fkConquista = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario, idConquista]);
}

module.exports = {
    listar,
    marcar,
    desmarcar
};
