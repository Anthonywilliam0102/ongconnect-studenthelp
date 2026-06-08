import type { AppData } from '../types';

export const initialData: AppData = {
  ong: [
    { id_ong: 1, nome: 'StudentHelp Recife', cnpj: '12.345.678/0001-90', email: 'contato@studenthelp.org', telefone: '(81) 3333-1000', uf: 'PE', data_cadastro: '2026-05-01', status: 'ativa' },
    { id_ong: 2, nome: 'Rede Solidaria Futuro', cnpj: '98.765.432/0001-11', email: 'gestao@redesolidaria.org', telefone: '(81) 3333-2000', uf: 'PE', data_cadastro: '2026-05-04', status: 'ativa' }
  ],
  projeto: [
    { id_projeto: 1, id_ong: 1, nome: 'Apoio Escolar Comunitario', descricao: 'Aulas de reforco para estudantes em vulnerabilidade.', data_inicio: '2026-05-10', orcamento_previsto: 12000, meta_atendimento: 120, status: 'em_andamento', dados_impacto: { indicador: 'alunos atendidos', meta: 120 } },
    { id_projeto: 2, id_ong: 1, nome: 'Cesta Digital', descricao: 'Doacao de kits tecnologicos para jovens estudantes.', data_inicio: '2026-05-15', orcamento_previsto: 18000, meta_atendimento: 60, status: 'planejado', dados_impacto: { indicador: 'kits entregues', meta: 60 } },
    { id_projeto: 3, id_ong: 1, nome: 'Biblioteca Viva', descricao: 'Criacao de biblioteca itinerante nos bairros.', data_inicio: '2026-05-20', orcamento_previsto: 7000, meta_atendimento: 200, status: 'em_andamento', dados_impacto: { indicador: 'leitores cadastrados', meta: 200 } },
    { id_projeto: 4, id_ong: 2, nome: 'Inclusao Jovem', descricao: 'Oficinas de tecnologia e cidadania para jovens.', data_inicio: '2026-06-01', orcamento_previsto: 22000, meta_atendimento: 90, status: 'planejado', dados_impacto: { indicador: 'jovens capacitados', meta: 90 } }
  ],
  doador: [
    { id_doador: 1, nome_razao_social: 'Maria Helena Souza', tipo_doador: 'pessoa_fisica', cpf_cnpj: '111.222.333-44', email: 'maria@email.com', telefone: '(81) 99911-2233', consentimento_lgpd: true },
    { id_doador: 2, nome_razao_social: 'Comercial Boa Vista LTDA', tipo_doador: 'pessoa_juridica', cpf_cnpj: '22.333.444/0001-55', email: 'financeiro@boavista.com', telefone: '(81) 3211-4455', consentimento_lgpd: true },
    { id_doador: 3, nome_razao_social: 'Joao Pereira', tipo_doador: 'pessoa_fisica', cpf_cnpj: '222.333.444-55', email: 'joao@email.com', telefone: '(81) 98888-1010', consentimento_lgpd: true },
    { id_doador: 4, nome_razao_social: 'Instituto Educar Mais', tipo_doador: 'pessoa_juridica', cpf_cnpj: '33.444.555/0001-66', email: 'contato@educarmais.org', telefone: '(81) 3111-2222', consentimento_lgpd: true }
  ],
  doacao: [
    { id_doacao: 1, id_doador: 1, id_ong: 1, id_projeto: 1, data_doacao: '2026-05-11', data_registro: '2026-05-11T10:00:00', tipo_doacao: 'dinheiro', valor: 500, emitir_recibo: true, status: 'recebida', descricao: 'Doacao para apoio escolar.' },
    { id_doacao: 2, id_doador: 2, id_ong: 1, id_projeto: 2, data_doacao: '2026-05-12', data_registro: '2026-05-12T11:00:00', tipo_doacao: 'dinheiro', valor: 2400, emitir_recibo: true, status: 'recebida', descricao: 'Apoio ao projeto Cesta Digital.' },
    { id_doacao: 3, id_doador: 3, id_ong: 1, id_projeto: null, data_doacao: '2026-05-16', data_registro: '2026-05-16T15:30:00', tipo_doacao: 'bem', valor: 0, emitir_recibo: false, status: 'destinada', descricao: 'Doacao geral de livros.' },
    { id_doacao: 4, id_doador: 4, id_ong: 2, id_projeto: 4, data_doacao: '2026-06-02', data_registro: '2026-06-02T09:30:00', tipo_doacao: 'dinheiro', valor: 5000, emitir_recibo: true, status: 'recebida', descricao: 'Patrocinio de oficinas.' }
  ],
  recurso: [
    { id_recurso: 1, id_projeto: 1, nome: 'Material didatico', tipo_recurso: 'material', descricao: 'Cadernos, apostilas e kits de estudo.', quantidade: 120, valor_estimado: 1800, data_alocacao: '2026-05-13', status_utilizacao: 'reservado' },
    { id_recurso: 2, id_projeto: 2, nome: 'Tablets educacionais', tipo_recurso: 'material', descricao: 'Equipamentos para aulas digitais.', quantidade: 20, valor_estimado: 16000, data_alocacao: '2026-05-18', status_utilizacao: 'disponivel' },
    { id_recurso: 3, id_projeto: 3, nome: 'Livros infantis', tipo_recurso: 'material', descricao: 'Acervo inicial da biblioteca itinerante.', quantidade: 300, valor_estimado: 4500, data_alocacao: '2026-05-22', status_utilizacao: 'utilizado' }
  ],
  voluntario: [
    { id_voluntario: 1, nome: 'Ana Clara Lima', cpf: '123.456.789-00', email: 'ana@email.com', telefone: '(81) 97777-1010', habilidades: ['reforco escolar', 'matematica'], disponibilidade: ['segunda', 'quarta'], consentimento_lgpd: true },
    { id_voluntario: 2, nome: 'Carlos Andre Silva', cpf: '234.567.890-11', email: 'carlos@email.com', telefone: '(81) 96666-2020', habilidades: ['tecnologia', 'logistica'], disponibilidade: ['sabado'], consentimento_lgpd: true },
    { id_voluntario: 3, nome: 'Beatriz Nunes', cpf: '345.678.901-22', email: 'beatriz@email.com', telefone: '(81) 95555-3030', habilidades: ['leitura', 'organizacao'], disponibilidade: ['terca', 'quinta'], consentimento_lgpd: true }
  ],
  voluntariado: [
    { id_voluntariado: 1, id_voluntario: 1, id_projeto: 1, funcao: 'Monitora de reforco', data_inicio: '2026-05-15', hora_inicio: '14:00', hora_fim: '17:00', carga_horaria: 12, status: 'ativo' },
    { id_voluntariado: 2, id_voluntario: 2, id_projeto: 2, funcao: 'Apoio tecnico', data_inicio: '2026-05-20', hora_inicio: '09:00', hora_fim: '12:00', carga_horaria: 8, status: 'ativo' },
    { id_voluntariado: 3, id_voluntario: 3, id_projeto: 3, funcao: 'Mediadora de leitura', data_inicio: '2026-05-25', hora_inicio: '13:00', hora_fim: '16:00', carga_horaria: 9, status: 'ativo' }
  ]
};
