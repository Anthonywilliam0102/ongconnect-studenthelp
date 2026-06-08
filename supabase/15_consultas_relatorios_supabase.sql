-- 15 consultas de relatorios sociais para Supabase/PostgreSQL

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

-- 4. Projetos ativos com percentual do orcamento arrecadado
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
