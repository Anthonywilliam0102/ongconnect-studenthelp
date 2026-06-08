import type { EntityName } from '../types';
import { primaryKeys } from '../lib/repository';

interface DataTableProps {
  entity: EntityName;
  rows: Record<string, unknown>[];
  onDelete: (id: number) => void;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function DataTable({ entity, rows, onDelete }: DataTableProps) {
  const columns = rows.length > 0 ? Object.keys(rows[0]).slice(0, 8) : [];
  const pk = primaryKeys[entity];

  if (rows.length === 0) {
    return <div className="empty-state">Nenhum registro encontrado.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => <th key={col}>{col}</th>)}
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[pk])}>
              {columns.map((col) => <td key={col}>{formatValue(row[col])}</td>)}
              <td>
                <button className="ghost danger" onClick={() => onDelete(Number(row[pk]))}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
