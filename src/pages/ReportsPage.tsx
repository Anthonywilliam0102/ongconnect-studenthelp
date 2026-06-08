import { useMemo, useState } from 'react';
import type { AppData } from '../types';
import { ReportMetric } from '../components/ReportMetric';
import { buildReport, type ReportPeriod } from '../lib/reporting';
import { formatDate, formatDateTime, money, number } from '../lib/formatters';

interface ReportsPageProps {
  data: AppData;
}

const periodOptions: { value: ReportPeriod; label: string; description: string }[] = [
  { value: 'semanal', label: 'Semanal', description: 'Últimos 7 dias de movimentação' },
  { value: 'quinzenal', label: 'Quinzenal', description: 'Últimos 15 dias de movimentação' },
  { value: 'mensal', label: 'Mensal', description: 'Últimos 30 dias de movimentação' }
];

export function ReportsPage({ data }: ReportsPageProps) {
  const [period, setPeriod] = useState<ReportPeriod>('semanal');
  const report = useMemo(() => buildReport(data, period), [data, period]);

  function handlePrint() {
    const previousTitle = document.title;
    document.title = `StudentHelp - ${report.title}`;
    window.print();
    document.title = previousTitle;
  }

  return (
    <section className="page reports-page">
      <div className="page-header report-actions-card no-print">
        <div>
          <p className="eyebrow">Relatórios sociais</p>
          <h1>Prestação de contas imprimível</h1>
          <p>
            Selecione o período, confira os indicadores da ONG e use o botão para imprimir ou salvar o relatório em PDF.
          </p>
        </div>
        <div className="report-controls">
          <label className="period-field">
            <span>Período do relatório</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value as ReportPeriod)}>
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <button className="primary print-button" onClick={handlePrint}>Imprimir / Salvar PDF</button>
        </div>
      </div>

      <div className="period-switcher no-print" aria-label="Alternar período do relatório">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            className={period === option.value ? 'period-card active' : 'period-card'}
            onClick={() => setPeriod(option.value)}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>

      <article className="print-area" id="relatorio-social">
        <header className="report-cover">
          <div className="report-brand">
            <div className="report-logo">SH</div>
            <div>
              <strong>StudentHelp • ONGConnect</strong>
              <span>Sistema de controle social, doações, projetos e voluntariado</span>
            </div>
          </div>
          <div className="report-title-block">
            <p className="eyebrow">Relatório gerencial</p>
            <h2>{report.title}</h2>
            <p>
              Período analisado: <strong>{formatDate(report.startDate)} a {formatDate(report.endDate)}</strong>
            </p>
          </div>
          <div className="report-meta">
            <span>Gerado em</span>
            <strong>{formatDateTime(report.generatedAt)}</strong>
          </div>
        </header>

        <section className="report-summary-grid">
          <ReportMetric label="Total arrecadado" value={money.format(report.totalDoacoes)} helper={`${report.quantidadeDoacoes} doação(ões) no período`} />
          <ReportMetric label="Doadores ativos" value={number.format(report.doadoresAtivos)} helper="Doadores com movimentação" />
          <ReportMetric label="Projetos movimentados" value={number.format(report.projetosComMovimento)} helper="Projetos com doação, recurso ou voluntariado" />
          <ReportMetric label="Horas voluntárias" value={`${number.format(report.horasVoluntarias)}h`} helper="Carga horária registrada" />
          <ReportMetric label="Recursos alocados" value={money.format(report.totalRecursos)} helper="Valor estimado dos recursos" />
          <ReportMetric label="Meta de impacto" value={number.format(report.metaImpacto)} helper="Pessoas previstas nos projetos movimentados" />
        </section>

        <section className="report-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">Projetos sociais</p>
              <h3>Movimentação por projeto</h3>
            </div>
            <span>{report.rowsByProject.length} projeto(s)</span>
          </div>
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Status</th>
                  <th>Doações</th>
                  <th>Total doado</th>
                  <th>Recursos</th>
                  <th>Voluntários</th>
                  <th>Horas</th>
                  <th>Meta</th>
                </tr>
              </thead>
              <tbody>
                {report.rowsByProject.length ? report.rowsByProject.map((row) => (
                  <tr key={row.id_projeto}>
                    <td>{row.projeto}</td>
                    <td><span className="status-pill">{row.status.replace('_', ' ')}</span></td>
                    <td>{number.format(row.quantidade_doacoes)}</td>
                    <td>{money.format(row.total_doacoes)}</td>
                    <td>{money.format(row.total_recursos)}</td>
                    <td>{number.format(row.voluntarios)}</td>
                    <td>{number.format(row.horas_voluntarias)}h</td>
                    <td>{number.format(row.meta_atendimento)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8}>Nenhuma movimentação encontrada para este período.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="report-grid-2">
          <div className="report-section compact-section">
            <div className="section-title">
              <div>
                <p className="eyebrow">Doadores</p>
                <h3>Ranking de contribuição</h3>
              </div>
            </div>
            <div className="mini-list">
              {report.rowsByDonor.length ? report.rowsByDonor.slice(0, 6).map((row) => (
                <div key={row.doador}>
                  <span>{row.doador}<small>{row.quantidade_doacoes} doação(ões)</small></span>
                  <strong>{money.format(row.total_doado)}</strong>
                </div>
              )) : <p className="muted-message">Nenhum doador movimentou o período.</p>}
            </div>
          </div>

          <div className="report-section compact-section">
            <div className="section-title">
              <div>
                <p className="eyebrow">Leitura executiva</p>
                <h3>Resumo para apresentação</h3>
              </div>
            </div>
            <ul className="report-notes">
              <li>O relatório consolida doações, recursos e voluntariado do período selecionado.</li>
              <li>Os dados apoiam prestação de contas e acompanhamento de impacto social.</li>
              <li>O botão de impressão permite salvar o relatório em PDF pelo navegador.</li>
            </ul>
          </div>
        </section>

        <footer className="report-footer">
          <span>StudentHelp • ONGConnect</span>
          <span>Relatório demonstrativo gerado pelo sistema acadêmico</span>
        </footer>
      </article>
    </section>
  );
}
