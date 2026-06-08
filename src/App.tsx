import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { EntityPage } from './pages/EntityPage';
import { ReportsPage } from './pages/ReportsPage';
import type { AppData, EntityName } from './types';
import { deleteRecord, insertRecord, loadAll, primaryKeys } from './lib/repository';
import { useSupabase } from './lib/supabase';

type Page = 'dashboard' | 'relatorios' | EntityName;

const entityPages: EntityName[] = ['ong', 'projeto', 'doador', 'doacao', 'recurso', 'voluntario', 'voluntariado'];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      setError('');
      setData(await loadAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao carregar dados.');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const content = useMemo(() => {
    if (error) return <div className="error-box">{error}</div>;
    if (!data) return <div className="loading">Carregando StudentHelp...</div>;

    if (page === 'dashboard') return <DashboardPage data={data} />;
    if (page === 'relatorios') return <ReportsPage data={data} />;
    if (entityPages.includes(page as EntityName)) {
      const entity = page as EntityName;
      return (
        <EntityPage
          entity={entity}
          data={data}
          onCreate={async (target, payload) => {
            if (useSupabase) {
              await insertRecord(target, payload);
              await refresh();
              return;
            }
            setData((current) => {
              if (!current) return current;
              const pk = primaryKeys[target];
              const existing = current[target] as unknown as Record<string, unknown>[];
              const nextId = existing.length ? Math.max(...existing.map((item) => Number(item[pk]))) + 1 : 1;
              return {
                ...current,
                [target]: [...existing, { [pk]: nextId, ...payload }]
              } as AppData;
            });
          }}
          onDelete={async (target, id) => {
            if (useSupabase) {
              await deleteRecord(target, id);
              await refresh();
              return;
            }
            setData((current) => {
              if (!current) return current;
              const pk = primaryKeys[target];
              const existing = current[target] as unknown as Record<string, unknown>[];
              return {
                ...current,
                [target]: existing.filter((item) => Number(item[pk]) !== id)
              } as AppData;
            });
          }}
        />
      );
    }

    return <DashboardPage data={data} />;
  }, [data, error, page]);

  return (
    <div className="app-shell">
      <Sidebar active={page} onChange={setPage} onlineMode={useSupabase} />
      <main className="main-content">{content}</main>
    </div>
  );
}
