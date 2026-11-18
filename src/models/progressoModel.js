var database = require("../database/config");

function listarCategorias(idUsuario) {
    var instrucaoSql = `
        SELECT idCategoria, nome, descricao, total, concluidas
            FROM vwProgressoUsuario
            WHERE idUsuario = ?
            ORDER BY idCategoria;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

function buscarTotalCategoria(idCategoria) {
    var instrucaoSql = `
        SELECT total
            FROM categoria
            WHERE idCategoria = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idCategoria]);
}

function atualizar(idUsuario, idCategoria, concluidas) {
    var instrucaoSql = `
        INSERT INTO progresso (fkUsuario, fkCategoria, concluidas) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE concluidas = VALUES(concluidas);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario, idCategoria, concluidas]);
}

module.exports = {
    listarCategorias,
    buscarTotalCategoria,
    atualizar
};
