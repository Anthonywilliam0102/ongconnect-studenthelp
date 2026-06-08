import type { AppData, Doacao, Projeto, Recurso, Voluntariado } from '../types';

export type ReportPeriod = 'semanal' | 'quinzenal' | 'mensal';

export interface ProjectReportRow {
  id_projeto: number;
  projeto: string;
  status: string;
  meta_atendimento: number;
  total_doacoes: number;
  quantidade_doacoes: number;
  total_recursos: number;
  horas_voluntarias: number;
  voluntarios: number;
}

export interface DonorReportRow {
  doador: string;
  quantidade_doacoes: number;
  total_doado: number;
}

export interface ReportSummary {
  period: ReportPeriod;
  title: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  doacoes: Doacao[];
  recursos: Recurso[];
  voluntariado: Voluntariado[];
  projetos: Projeto[];
  totalDoacoes: number;
  quantidadeDoacoes: number;
  doadoresAtivos: number;
  projetosComMovimento: number;
  horasVoluntarias: number;
  totalRecursos: number;
  metaImpacto: number;
  rowsByProject: ProjectReportRow[];
  rowsByDonor: DonorReportRow[];
}

const periodConfig: Record<ReportPeriod, { title: string; days: number }> = {
  semanal: { title: 'Relatório semanal', days: 7 },
  quinzenal: { title: 'Relatório quinzenal', days: 15 },
  mensal: { title: 'Relatório mensal', days: 30 }
};

function normalizeDate(date: string): Date | null {
  if (!date) return null;
  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function maxDateFromData(data: AppData): Date {
  const dates = [
    ...data.doacao.map((item) => normalizeDate(item.data_doacao)),
    ...data.recurso.map((item) => normalizeDate(item.data_alocacao)),
    ...data.voluntariado.map((item) => normalizeDate(item.data_inicio)),
    ...data.projeto.map((item) => normalizeDate(item.data_inicio))
  ].filter((date): date is Date => Boolean(date));

  if (!dates.length) return new Date();
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function inPeriod(date: string, startDate: Date, endDate: Date): boolean {
  const parsed = normalizeDate(date);
  if (!parsed) return false;
  return parsed >= startDate && parsed <= endDate;
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function buildReport(data: AppData, period: ReportPeriod): ReportSummary {
  const config = periodConfig[period];
  const endDate = maxDateFromData(data);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (config.days - 1));

  const doacoes = data.doacao.filter((item) => inPeriod(item.data_doacao, startDate, endDate));
  const recursos = data.recurso.filter((item) => inPeriod(item.data_alocacao, startDate, endDate));
  const voluntariado = data.voluntariado.filter((item) => inPeriod(item.data_inicio, startDate, endDate));

  const projectIds = unique([
    ...doacoes.map((item) => item.id_projeto).filter((id): id is number => typeof id === 'number'),
    ...recursos.map((item) => item.id_projeto),
    ...voluntariado.map((item) => item.id_projeto)
  ]);

  const projetos = data.projeto.filter((projeto) => projectIds.includes(projeto.id_projeto));
  const totalDoacoes = doacoes.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalRecursos = recursos.reduce((sum, item) => sum + Number(item.valor_estimado || 0), 0);
  const horasVoluntarias = voluntariado.reduce((sum, item) => sum + Number(item.carga_horaria || 0), 0);
  const metaImpacto = projetos.reduce((sum, item) => sum + Number(item.meta_atendimento || 0), 0);

  const rowsByProject = data.projeto.map((projeto) => {
    const doacoesProjeto = doacoes.filter((item) => item.id_projeto === projeto.id_projeto);
    const recursosProjeto = recursos.filter((item) => item.id_projeto === projeto.id_projeto);
    const voluntariadoProjeto = voluntariado.filter((item) => item.id_projeto === projeto.id_projeto);

    return {
      id_projeto: projeto.id_projeto,
      projeto: projeto.nome,
      status: projeto.status,
      meta_atendimento: Number(projeto.meta_atendimento || 0),
      total_doacoes: doacoesProjeto.reduce((sum, item) => sum + Number(item.valor || 0), 0),
      quantidade_doacoes: doacoesProjeto.length,
      total_recursos: recursosProjeto.reduce((sum, item) => sum + Number(item.valor_estimado || 0), 0),
      horas_voluntarias: voluntariadoProjeto.reduce((sum, item) => sum + Number(item.carga_horaria || 0), 0),
      voluntarios: unique(voluntariadoProjeto.map((item) => item.id_voluntario)).length
    };
  }).filter((row) => row.quantidade_doacoes > 0 || row.total_recursos > 0 || row.horas_voluntarias > 0)
    .sort((a, b) => (b.total_doacoes + b.total_recursos + b.horas_voluntarias) - (a.total_doacoes + a.total_recursos + a.horas_voluntarias));

  const rowsByDonor = data.doador.map((doador) => {
    const doacoesDoador = doacoes.filter((item) => item.id_doador === doador.id_doador);
    return {
      doador: doador.nome_razao_social,
      quantidade_doacoes: doacoesDoador.length,
      total_doado: doacoesDoador.reduce((sum, item) => sum + Number(item.valor || 0), 0)
    };
  }).filter((row) => row.quantidade_doacoes > 0)
    .sort((a, b) => b.total_doado - a.total_doado);

  return {
    period,
    title: config.title,
    startDate,
    endDate,
    generatedAt: new Date(),
    doacoes,
    recursos,
    voluntariado,
    projetos,
    totalDoacoes,
    quantidadeDoacoes: doacoes.length,
    doadoresAtivos: unique(doacoes.map((item) => item.id_doador)).length,
    projetosComMovimento: projectIds.length,
    horasVoluntarias,
    totalRecursos,
    metaImpacto,
    rowsByProject,
    rowsByDonor
  };
}
