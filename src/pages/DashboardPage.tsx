import type { AppData } from '../types';
import { StatCard } from '../components/StatCard';

interface DashboardPageProps {
  data: AppData;
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardPage({ data }: DashboardPageProps) {
  const totalDoacoes = data.doacao.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalRecursos = data.recurso.reduce((sum, item) => sum + Number(item.valor_estimado || 0), 0);
  const horas = data.voluntariado.reduce((sum, item) => sum + Number(item.carga_horaria || 0), 0);
  const pessoasImpactadas = data.projeto.reduce((sum, item) => sum + Number(item.meta_atendimento || 0), 0);
  const projetosAtivos = data.projeto.filter((item) => item.status === 'em_andamento').length;

  const rankingProjetos = data.projeto.map((projeto) => {
    const recebido = data.doacao
      .filter((doacao) => doacao.id_projeto === projeto.id_projeto)
      .reduce((sum, doacao) => sum + Number(doacao.valor || 0), 0);
    return { projeto: projeto.nome, recebido };
  }).sort((a, b) => b.recebido - a.recebido);

  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Gestão social integrada</p>
          <h1>Painel gerencial da ONG</h1>
          <p>Controle doações, projetos, voluntários, recursos e indicadores sociais em uma única visão.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total arrecadado" value={money.format(totalDoacoes)} helper="Soma das doações monetárias registradas" />
        <StatCard label="Projetos ativos" value={projetosAtivos} helper={`${data.projeto.length} projetos cadastrados`} />
        <StatCard label="Horas voluntárias" value={horas} helper="Carga horária registrada em vínculos" />
        <StatCard label="Meta de impacto" value={pessoasImpactadas} helper="Pessoas previstas nas ações sociais" />
      </div>

      <div className="content-grid two-cols">
        <article className="panel">
          <h2>Doações por projeto</h2>
          <div className="ranking-list">
            {rankingProjetos.map((item) => (
              <div key={item.projeto}>
                <span>{item.projeto}</span>
                <strong>{money.format(item.recebido)}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="panel accent-panel">
          <h2>Indicadores de prestação de contas</h2>
          <p>O sistema foi planejado para apoiar transparência, rastreabilidade de doações e relatórios de impacto social.</p>
          <ul>
            <li>Doações vinculadas a doador e ONG.</li>
            <li>Doações opcionais por projeto específico.</li>
            <li>Recursos e voluntariado associados ao projeto.</li>
            <li>Consentimento LGPD em doadores e voluntários.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
