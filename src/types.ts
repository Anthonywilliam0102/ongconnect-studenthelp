export type StatusProjeto = 'planejado' | 'em_andamento' | 'concluido' | 'cancelado';
export type StatusCadastro = 'ativa' | 'inativa' | 'em_analise';
export type TipoDoador = 'pessoa_fisica' | 'pessoa_juridica';
export type TipoDoacao = 'dinheiro' | 'bem' | 'servico' | 'outro';
export type TipoRecurso = 'financeiro' | 'material' | 'humano' | 'servico';
export type StatusDoacao = 'recebida' | 'pendente' | 'cancelada' | 'destinada';
export type StatusVoluntariado = 'ativo' | 'encerrado' | 'suspenso';
export type StatusRecurso = 'disponivel' | 'utilizado' | 'reservado' | 'encerrado';

export interface Ong {
  id_ong: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  uf: string;
  data_cadastro: string;
  status: StatusCadastro;
}

export interface Projeto {
  id_projeto: number;
  id_ong: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  orcamento_previsto: number;
  meta_atendimento: number;
  status: StatusProjeto;
  dados_impacto?: Record<string, unknown> | null;
}

export interface Doador {
  id_doador: number;
  nome_razao_social: string;
  tipo_doador: TipoDoador;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  consentimento_lgpd: boolean;
}

export interface Doacao {
  id_doacao: number;
  id_doador: number;
  id_ong: number;
  id_projeto: number | null;
  data_doacao: string;
  data_registro: string;
  tipo_doacao: TipoDoacao;
  valor: number;
  emitir_recibo: boolean;
  status?: StatusDoacao;
  descricao?: string;
}

export interface Recurso {
  id_recurso: number;
  id_projeto: number;
  nome: string;
  tipo_recurso: TipoRecurso;
  descricao: string;
  quantidade: number;
  valor_estimado: number;
  data_alocacao: string;
  status_utilizacao: StatusRecurso;
}

export interface Voluntario {
  id_voluntario: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  habilidades: string[];
  disponibilidade: string[];
  consentimento_lgpd: boolean;
}

export interface Voluntariado {
  id_voluntariado: number;
  id_voluntario: number;
  id_projeto: number;
  funcao: string;
  data_inicio: string;
  hora_inicio: string;
  hora_fim: string;
  carga_horaria: number;
  status: StatusVoluntariado;
}

export interface AppData {
  ong: Ong[];
  projeto: Projeto[];
  doador: Doador[];
  doacao: Doacao[];
  recurso: Recurso[];
  voluntario: Voluntario[];
  voluntariado: Voluntariado[];
}

export type EntityName = keyof AppData;
