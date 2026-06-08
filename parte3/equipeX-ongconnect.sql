-- =============================================================
-- ONGCONNECT STUDENTHELP - PARTE 3
-- Script SQL unico para MySQL 8.0
-- Inclui schema, restricoes, indices, triggers, views, dados de teste e 15 consultas.
-- =============================================================

DROP DATABASE IF EXISTS ongconnect_studenthelp;
CREATE DATABASE ongconnect_studenthelp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ongconnect_studenthelp;

-- =========================
-- 1. TABELAS NORMALIZADAS
-- =========================

CREATE TABLE ong (
  id_ong INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  uf CHAR(2) NOT NULL,
  data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
  status ENUM('ativa','inativa','em_analise') NOT NULL DEFAULT 'ativa',
  CHECK (CHAR_LENGTH(uf) = 2)
) ENGINE=InnoDB;

CREATE TABLE doador (
  id_doador INT AUTO_INCREMENT PRIMARY KEY,
  nome_razao_social VARCHAR(150) NOT NULL,
  tipo_doador ENUM('pessoa_fisica','pessoa_juridica') NOT NULL,
  cpf_cnpj VARCHAR(18) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  consentimento_lgpd BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE projeto (
  id_projeto INT AUTO_INCREMENT PRIMARY KEY,
  id_ong INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  data_inicio DATE NOT NULL,
  orcamento_previsto FLOAT NOT NULL DEFAULT 0,
  meta_atendimento INT NOT NULL DEFAULT 0,
  status ENUM('planejado','em_andamento','concluido','cancelado') NOT NULL DEFAULT 'planejado',
  dados_impacto JSON NULL,
  CONSTRAINT fk_projeto_ong FOREIGN KEY (id_ong) REFERENCES ong(id_ong),
  CHECK (orcamento_previsto >= 0),
  CHECK (meta_atendimento >= 0)
) ENGINE=InnoDB;

CREATE TABLE doacao (
  id_doacao INT AUTO_INCREMENT PRIMARY KEY,
  id_doador INT NOT NULL,
  id_ong INT NOT NULL,
  id_projeto INT NULL,
  data_doacao DATE NOT NULL,
  data_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_doacao ENUM('dinheiro','bem','servico','outro') NOT NULL,
  valor FLOAT NOT NULL DEFAULT 0,
  descricao VARCHAR(500) NULL,
  emitir_recibo BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('recebida','pendente','cancelada','destinada') NOT NULL DEFAULT 'recebida',
  CONSTRAINT fk_doacao_doador FOREIGN KEY (id_doador) REFERENCES doador(id_doador),
  CONSTRAINT fk_doacao_ong FOREIGN KEY (id_ong) REFERENCES ong(id_ong),
  CONSTRAINT fk_doacao_projeto FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto),
  CHECK (valor >= 0)
) ENGINE=InnoDB;

CREATE TABLE recurso (
  id_recurso INT AUTO_INCREMENT PRIMARY KEY,
  id_projeto INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  tipo_recurso ENUM('financeiro','material','humano','servico') NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  valor_estimado FLOAT NOT NULL DEFAULT 0,
  data_alocacao DATE NOT NULL,
  status_utilizacao ENUM('disponivel','utilizado','reservado','encerrado') NOT NULL DEFAULT 'disponivel',
  CONSTRAINT fk_recurso_projeto FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto),
  CHECK (quantidade >= 0),
  CHECK (valor_estimado >= 0)
) ENGINE=InnoDB;

CREATE TABLE voluntario (
  id_voluntario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  habilidades SET('reforco_escolar','tecnologia','leitura','logistica','saude','juridico','comunicacao','administrativo') NULL,
  disponibilidade SET('segunda','terca','quarta','quinta','sexta','sabado','domingo') NULL,
  consentimento_lgpd BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE voluntariado (
  id_voluntariado INT AUTO_INCREMENT PRIMARY KEY,
  id_voluntario INT NOT NULL,
  id_projeto INT NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  carga_horaria INT NOT NULL DEFAULT 0,
  status ENUM('ativo','encerrado','suspenso') NOT NULL DEFAULT 'ativo',
  CONSTRAINT fk_voluntariado_voluntario FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario),
  CONSTRAINT fk_voluntariado_projeto FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto),
  CHECK (carga_horaria >= 0)
) ENGINE=InnoDB;

CREATE TABLE auditoria_doacao (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  id_doacao INT NOT NULL,
  acao VARCHAR(30) NOT NULL,
  valor FLOAT NOT NULL,
  data_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao VARCHAR(255) NULL
) ENGINE=InnoDB;

-- =========================
-- 2. INDICES PARA RELATORIOS
-- =========================
CREATE INDEX idx_projeto_ong_status ON projeto(id_ong, status);
CREATE INDEX idx_doacao_data ON doacao(data_doacao);
CREATE INDEX idx_doacao_doador ON doacao(id_doador);
CREATE INDEX idx_doacao_projeto ON doacao(id_projeto);
CREATE INDEX idx_voluntariado_projeto ON voluntariado(id_projeto);
CREATE INDEX idx_recurso_projeto ON recurso(id_projeto);

-- =========================
-- 3. TRIGGERS DE RASTREAMENTO DE DOACOES
-- =========================
DELIMITER $$
CREATE TRIGGER trg_auditoria_doacao_insert
AFTER INSERT ON doacao
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_doacao (id_doacao, acao, valor, observacao)
  VALUES (NEW.id_doacao, 'INSERT', NEW.valor, CONCAT('Doacao registrada para ONG ', NEW.id_ong));
END$$

CREATE TRIGGER trg_auditoria_doacao_update
AFTER UPDATE ON doacao
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_doacao (id_doacao, acao, valor, observacao)
  VALUES (NEW.id_doacao, 'UPDATE', NEW.valor, CONCAT('Status anterior: ', OLD.status, ' | novo: ', NEW.status));
END$$
DELIMITER ;

-- =========================
-- 4. DADOS DE TESTE REALISTAS (50+ REGISTROS)
-- =========================
INSERT INTO ong (nome, cnpj, email, telefone, uf, data_cadastro, status) VALUES
('StudentHelp Recife', '12.345.678/0001-90', 'contato@studenthelp.org', '(81)3333-1000', 'PE', '2026-05-01', 'ativa'),
('Rede Solidaria Futuro', '98.765.432/0001-11', 'gestao@redesolidaria.org', '(81)3333-2000', 'PE', '2026-05-04', 'ativa'),
('Instituto Ponte do Saber', '45.777.888/0001-10', 'ponte@saber.org', '(81)3333-3000', 'PE', '2026-05-08', 'ativa');

INSERT INTO doador (nome_razao_social, tipo_doador, cpf_cnpj, email, telefone, consentimento_lgpd) VALUES
('Maria Helena Souza','pessoa_fisica','111.222.333-44','maria@email.com','(81)99911-2233',TRUE),
('Comercial Boa Vista LTDA','pessoa_juridica','22.333.444/0001-55','financeiro@boavista.com','(81)3211-4455',TRUE),
('Joao Pereira','pessoa_fisica','222.333.444-55','joao@email.com','(81)98888-1010',TRUE),
('Instituto Educar Mais','pessoa_juridica','33.444.555/0001-66','contato@educarmais.org','(81)3111-2222',TRUE),
('Ana Beatriz Lima','pessoa_fisica','333.444.555-66','ana@email.com','(81)97777-3333',TRUE),
('Tech Social Brasil','pessoa_juridica','44.555.666/0001-77','social@techbr.com','(81)3222-4455',TRUE),
('Carlos Roberto Nunes','pessoa_fisica','444.555.666-77','carlos@email.com','(81)96666-7777',TRUE),
('Farmacia Vida Plena','pessoa_juridica','55.666.777/0001-88','contato@vidaplena.com','(81)3555-7788',TRUE),
('Renata Albuquerque','pessoa_fisica','555.666.777-88','renata@email.com','(81)95555-8888',TRUE),
('Mercado Popular Recife','pessoa_juridica','66.777.888/0001-99','adm@mercadopopular.com','(81)3444-9999',TRUE),
('Pedro Araujo','pessoa_fisica','666.777.888-99','pedro@email.com','(81)94444-0000',TRUE),
('Grafica Esperanca','pessoa_juridica','77.888.999/0001-00','vendas@graficaesperanca.com','(81)3666-1010',TRUE);

INSERT INTO projeto (id_ong, nome, descricao, data_inicio, orcamento_previsto, meta_atendimento, status, dados_impacto) VALUES
(1,'Apoio Escolar Comunitario','Aulas de reforco para estudantes em vulnerabilidade.','2026-05-10',12000,120,'em_andamento', JSON_OBJECT('indicador','alunos atendidos','meta',120)),
(1,'Cesta Digital','Doacao de kits tecnologicos para jovens estudantes.','2026-05-15',18000,60,'planejado', JSON_OBJECT('indicador','kits entregues','meta',60)),
(1,'Biblioteca Viva','Biblioteca itinerante nos bairros.','2026-05-20',7000,200,'em_andamento', JSON_OBJECT('indicador','leitores cadastrados','meta',200)),
(2,'Inclusao Jovem','Oficinas de tecnologia e cidadania.','2026-06-01',22000,90,'planejado', JSON_OBJECT('indicador','jovens capacitados','meta',90)),
(2,'Saude em Movimento','Acoes de orientacao basica de saude.','2026-06-05',15000,300,'em_andamento', JSON_OBJECT('indicador','atendimentos sociais','meta',300)),
(3,'Alimenta Comunidade','Distribuicao de alimentos para familias cadastradas.','2026-06-08',25000,500,'em_andamento', JSON_OBJECT('indicador','familias atendidas','meta',500)),
(3,'Mentoria de Carreira','Mentorias para jovens em busca do primeiro emprego.','2026-06-10',9000,80,'planejado', JSON_OBJECT('indicador','jovens mentorados','meta',80)),
(1,'Esporte e Cidadania','Atividades esportivas para criancas e adolescentes.','2026-06-12',11000,150,'planejado', JSON_OBJECT('indicador','participantes','meta',150));

INSERT INTO doacao (id_doador, id_ong, id_projeto, data_doacao, data_registro, tipo_doacao, valor, descricao, emitir_recibo, status) VALUES
(1,1,1,'2026-05-11','2026-05-11 10:00:00','dinheiro',500,'Doacao para apoio escolar',TRUE,'recebida'),
(2,1,2,'2026-05-12','2026-05-12 11:00:00','dinheiro',2400,'Apoio ao projeto Cesta Digital',TRUE,'recebida'),
(3,1,NULL,'2026-05-16','2026-05-16 15:30:00','bem',0,'Doacao geral de livros',FALSE,'destinada'),
(4,2,4,'2026-06-02','2026-06-02 09:30:00','dinheiro',5000,'Patrocinio de oficinas',TRUE,'recebida'),
(5,1,3,'2026-06-03','2026-06-03 10:20:00','dinheiro',300,'Apoio biblioteca',TRUE,'recebida'),
(6,1,2,'2026-06-04','2026-06-04 14:10:00','bem',0,'Tablets usados em bom estado',TRUE,'destinada'),
(7,2,5,'2026-06-04','2026-06-04 16:40:00','dinheiro',850,'Saude em Movimento',TRUE,'recebida'),
(8,2,5,'2026-06-05','2026-06-05 09:00:00','bem',0,'Kits de higiene',TRUE,'destinada'),
(9,3,6,'2026-06-06','2026-06-06 12:00:00','dinheiro',1200,'Alimentos para familias',TRUE,'recebida'),
(10,3,6,'2026-06-07','2026-06-07 08:30:00','bem',0,'Cestas basicas',TRUE,'destinada'),
(11,3,7,'2026-06-08','2026-06-08 18:20:00','dinheiro',450,'Mentoria de carreira',FALSE,'recebida'),
(12,1,8,'2026-06-09','2026-06-09 13:45:00','servico',0,'Impressao de material esportivo',TRUE,'destinada'),
(1,1,1,'2026-06-10','2026-06-10 10:10:00','dinheiro',250,'Doacao recorrente',TRUE,'recebida'),
(2,1,NULL,'2026-06-11','2026-06-11 11:15:00','dinheiro',1000,'Doacao institucional geral',TRUE,'recebida'),
(4,2,4,'2026-06-12','2026-06-12 09:30:00','dinheiro',1800,'Segunda parcela',TRUE,'recebida'),
(6,1,2,'2026-06-13','2026-06-13 14:20:00','dinheiro',3500,'Equipamentos digitais',TRUE,'recebida'),
(9,3,6,'2026-06-14','2026-06-14 10:00:00','dinheiro',750,'Compra de alimentos',TRUE,'recebida'),
(11,3,NULL,'2026-06-15','2026-06-15 17:00:00','outro',0,'Doacao de networking profissional',FALSE,'destinada');

INSERT INTO recurso (id_projeto, nome, tipo_recurso, descricao, quantidade, valor_estimado, data_alocacao, status_utilizacao) VALUES
(1,'Material didatico','material','Cadernos, apostilas e kits de estudo',120,1800,'2026-05-13','reservado'),
(2,'Tablets educacionais','material','Equipamentos para aulas digitais',20,16000,'2026-05-18','disponivel'),
(3,'Livros infantis','material','Acervo inicial da biblioteca itinerante',300,4500,'2026-05-22','utilizado'),
(4,'Laboratorio movel','servico','Apoio tecnico para oficinas',1,6000,'2026-06-02','reservado'),
(5,'Kits de higiene','material','Produtos de higiene basica',250,3200,'2026-06-05','utilizado'),
(6,'Cestas basicas','material','Alimentos para distribuicao',500,18000,'2026-06-07','reservado'),
(7,'Mentores convidados','humano','Profissionais convidados para orientacao',10,4000,'2026-06-10','disponivel'),
(8,'Uniformes esportivos','material','Coletes e materiais esportivos',150,3500,'2026-06-13','disponivel');

INSERT INTO voluntario (nome, cpf, email, telefone, habilidades, disponibilidade, consentimento_lgpd) VALUES
('Ana Clara Lima','123.456.789-00','ana@email.com','(81)97777-1010','reforco_escolar','segunda,quarta',TRUE),
('Carlos Andre Silva','234.567.890-11','carlos@email.com','(81)96666-2020','tecnologia,logistica','sabado',TRUE),
('Beatriz Nunes','345.678.901-22','beatriz@email.com','(81)95555-3030','leitura,administrativo','terca,quinta',TRUE),
('Daniel Souza','456.789.012-33','daniel@email.com','(81)94444-4040','saude','sexta',TRUE),
('Elisa Martins','567.890.123-44','elisa@email.com','(81)93333-5050','comunicacao','segunda,sexta',TRUE),
('Fernando Costa','678.901.234-55','fernando@email.com','(81)92222-6060','logistica','sabado,domingo',TRUE),
('Gabriela Rocha','789.012.345-66','gabriela@email.com','(81)91111-7070','juridico,administrativo','quarta',TRUE),
('Helio Ramos','890.123.456-77','helio@email.com','(81)90000-8080','tecnologia','terca,sabado',TRUE);

INSERT INTO voluntariado (id_voluntario, id_projeto, funcao, data_inicio, hora_inicio, hora_fim, carga_horaria, status) VALUES
(1,1,'Monitora de reforco','2026-05-15','14:00:00','17:00:00',12,'ativo'),
(2,2,'Apoio tecnico','2026-05-20','09:00:00','12:00:00',8,'ativo'),
(3,3,'Mediadora de leitura','2026-05-25','13:00:00','16:00:00',9,'ativo'),
(4,5,'Orientador de saude','2026-06-05','08:00:00','12:00:00',16,'ativo'),
(5,4,'Comunicacao social','2026-06-04','10:00:00','13:00:00',10,'ativo'),
(6,6,'Logistica de distribuicao','2026-06-08','07:00:00','11:00:00',20,'ativo'),
(7,7,'Apoio administrativo','2026-06-11','14:00:00','17:00:00',6,'ativo'),
(8,2,'Instrutor de tecnologia','2026-06-12','09:00:00','12:00:00',12,'ativo'),
(1,8,'Apoio pedagogico','2026-06-13','08:00:00','11:00:00',9,'ativo'),
(3,1,'Apoio leitura','2026-06-14','14:00:00','16:00:00',6,'ativo'),
(5,3,'Divulgacao comunitaria','2026-06-15','09:00:00','11:00:00',4,'ativo'),
(6,5,'Organizacao de insumos','2026-06-16','08:00:00','12:00:00',8,'ativo');

-- =========================
-- 5. VIEWS PARA DASHBOARDS GERENCIAIS
-- =========================
CREATE OR REPLACE VIEW vw_doacoes_por_projeto AS
SELECT
  p.id_projeto,
  p.nome AS nome_projeto,
  o.nome AS nome_ong,
  COUNT(d.id_doacao) AS quantidade_doacoes,
  COALESCE(SUM(d.valor), 0) AS total_doacoes
FROM projeto p
JOIN ong o ON o.id_ong = p.id_ong
LEFT JOIN doacao d ON d.id_projeto = p.id_projeto AND d.status <> 'cancelada'
GROUP BY p.id_projeto, p.nome, o.nome;

CREATE OR REPLACE VIEW vw_voluntarios_por_projeto AS
SELECT
  p.id_projeto,
  p.nome AS nome_projeto,
  COUNT(DISTINCT v.id_voluntario) AS total_voluntarios,
  COALESCE(SUM(vd.carga_horaria), 0) AS total_horas
FROM projeto p
LEFT JOIN voluntariado vd ON vd.id_projeto = p.id_projeto
LEFT JOIN voluntario v ON v.id_voluntario = vd.id_voluntario
GROUP BY p.id_projeto, p.nome;

CREATE OR REPLACE VIEW vw_recursos_por_projeto AS
SELECT
  p.id_projeto,
  p.nome AS nome_projeto,
  COUNT(r.id_recurso) AS total_recursos,
  COALESCE(SUM(r.valor_estimado), 0) AS valor_estimado_total
FROM projeto p
LEFT JOIN recurso r ON r.id_projeto = p.id_projeto
GROUP BY p.id_projeto, p.nome;

CREATE OR REPLACE VIEW vw_prestacao_contas_ong AS
SELECT
  o.id_ong,
  o.nome AS nome_ong,
  (SELECT COUNT(*) FROM projeto p WHERE p.id_ong = o.id_ong) AS total_projetos,
  (SELECT COUNT(*) FROM doacao d WHERE d.id_ong = o.id_ong AND d.status <> 'cancelada') AS total_doacoes,
  (SELECT COALESCE(SUM(d.valor), 0) FROM doacao d WHERE d.id_ong = o.id_ong AND d.status <> 'cancelada') AS valor_total_doacoes,
  (SELECT COUNT(*) FROM recurso r JOIN projeto p ON p.id_projeto = r.id_projeto WHERE p.id_ong = o.id_ong) AS total_recursos,
  (SELECT COALESCE(SUM(r.valor_estimado), 0) FROM recurso r JOIN projeto p ON p.id_projeto = r.id_projeto WHERE p.id_ong = o.id_ong) AS valor_estimado_recursos
FROM ong o;

-- =========================
-- 6. 15 CONSULTAS SQL COMPLEXAS PARA RELATORIOS SOCIAIS
-- =========================

-- 1. Total arrecadado por ONG
SELECT o.nome, COUNT(d.id_doacao) AS quantidade_doacoes, SUM(d.valor) AS total_arrecadado
FROM ong o
JOIN doacao d ON d.id_ong = o.id_ong
GROUP BY o.nome
ORDER BY total_arrecadado DESC;

-- 2. Projetos com maior valor de doacoes recebidas
SELECT * FROM vw_doacoes_por_projeto ORDER BY total_doacoes DESC;

-- 3. Doadores fieis por quantidade e valor doado
SELECT dr.nome_razao_social, COUNT(d.id_doacao) AS quantidade_doacoes, SUM(d.valor) AS valor_total
FROM doador dr
JOIN doacao d ON d.id_doador = dr.id_doador
GROUP BY dr.id_doador, dr.nome_razao_social
HAVING COUNT(d.id_doacao) >= 2 OR SUM(d.valor) >= 1000
ORDER BY valor_total DESC;

-- 4. Projetos ativos com meta de atendimento e valor arrecadado
SELECT p.nome, p.meta_atendimento, COALESCE(SUM(d.valor),0) AS arrecadado,
       ROUND(COALESCE(SUM(d.valor),0) / NULLIF(p.orcamento_previsto,0) * 100, 2) AS percentual_orcamento
FROM projeto p
LEFT JOIN doacao d ON d.id_projeto = p.id_projeto
WHERE p.status = 'em_andamento'
GROUP BY p.id_projeto, p.nome, p.meta_atendimento, p.orcamento_previsto;

-- 5. Horas de voluntariado por projeto
SELECT * FROM vw_voluntarios_por_projeto ORDER BY total_horas DESC;

-- 6. Recursos mais relevantes financeiramente
SELECT p.nome AS projeto, r.nome AS recurso, r.tipo_recurso, r.valor_estimado
FROM recurso r
JOIN projeto p ON p.id_projeto = r.id_projeto
ORDER BY r.valor_estimado DESC;

-- 7. Doacoes gerais sem projeto especifico
SELECT d.id_doacao, dr.nome_razao_social, o.nome AS ong, d.tipo_doacao, d.valor, d.data_doacao
FROM doacao d
JOIN doador dr ON dr.id_doador = d.id_doador
JOIN ong o ON o.id_ong = d.id_ong
WHERE d.id_projeto IS NULL;

-- 8. Voluntarios com maior carga horaria
SELECT v.nome, SUM(vd.carga_horaria) AS total_horas, COUNT(vd.id_voluntariado) AS quantidade_vinculos
FROM voluntario v
JOIN voluntariado vd ON vd.id_voluntario = v.id_voluntario
GROUP BY v.id_voluntario, v.nome
ORDER BY total_horas DESC;

-- 9. Projetos com recursos alocados acima de R$ 5.000
SELECT p.nome, COUNT(r.id_recurso) AS qtd_recursos, SUM(r.valor_estimado) AS valor_total_recursos
FROM projeto p
JOIN recurso r ON r.id_projeto = p.id_projeto
GROUP BY p.id_projeto, p.nome
HAVING SUM(r.valor_estimado) > 5000;

-- 10. Prestacao de contas consolidada por ONG
SELECT * FROM vw_prestacao_contas_ong ORDER BY valor_total_doacoes DESC;

-- 11. Distribuicao de doacoes por tipo
SELECT tipo_doacao, COUNT(*) AS quantidade, SUM(valor) AS total_monetario
FROM doacao
GROUP BY tipo_doacao
ORDER BY quantidade DESC;

-- 12. Projetos sem doacoes monetarias vinculadas
SELECT p.nome
FROM projeto p
LEFT JOIN doacao d ON d.id_projeto = p.id_projeto AND d.valor > 0
WHERE d.id_doacao IS NULL;

-- 13. Doadores pessoa juridica e sua participacao no total arrecadado
SELECT dr.nome_razao_social, SUM(d.valor) AS total_doado,
       ROUND(SUM(d.valor) / (SELECT SUM(valor) FROM doacao WHERE status <> 'cancelada') * 100, 2) AS percentual_total
FROM doador dr
JOIN doacao d ON d.id_doador = dr.id_doador
WHERE dr.tipo_doador = 'pessoa_juridica'
GROUP BY dr.id_doador, dr.nome_razao_social
ORDER BY total_doado DESC;

-- 14. Auditoria das doacoes registradas por trigger
SELECT * FROM auditoria_doacao ORDER BY data_evento DESC;

-- 15. Indicador geral de impacto por projeto
SELECT p.nome, p.meta_atendimento, COALESCE(v.total_horas,0) AS horas_voluntarias,
       COALESCE(dp.total_doacoes,0) AS total_doacoes,
       COALESCE(r.valor_estimado_total,0) AS valor_recursos
FROM projeto p
LEFT JOIN vw_voluntarios_por_projeto v ON v.id_projeto = p.id_projeto
LEFT JOIN vw_doacoes_por_projeto dp ON dp.id_projeto = p.id_projeto
LEFT JOIN vw_recursos_por_projeto r ON r.id_projeto = p.id_projeto
ORDER BY p.meta_atendimento DESC;
