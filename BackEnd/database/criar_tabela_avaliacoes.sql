CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_jogo INT NOT NULL,
    nota TINYINT NOT NULL,
    comentario VARCHAR(1000) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_avaliacao),
    CONSTRAINT chk_avaliacao_nota CHECK (nota BETWEEN 1 AND 5),
    CONSTRAINT fk_avaliacao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT uq_avaliacao_usuario_jogo UNIQUE (id_usuario, id_jogo),
    INDEX idx_avaliacao_jogo (id_jogo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
