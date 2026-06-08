import { useState } from 'react';
import type { AppData, EntityName } from '../types';
import { DataTable } from '../components/DataTable';
import { FormModal } from '../components/FormModal';
import { entityLabels } from '../lib/repository';

interface EntityPageProps {
  entity: EntityName;
  data: AppData;
  onCreate: (entity: EntityName, payload: Record<string, unknown>) => void;
  onDelete: (entity: EntityName, id: number) => void;
}

const descriptions: Record<EntityName, string> = {
  ong: 'Cadastro das organizações responsáveis pelos projetos sociais.',
  projeto: 'Ações sociais com orçamento, status, meta de atendimento e indicadores.',
  doador: 'Pessoas físicas ou jurídicas que contribuem com a ONG.',
  doacao: 'Contribuições gerais para a ONG ou direcionadas a projetos específicos.',
  recurso: 'Itens financeiros, materiais, humanos ou serviços utilizados nos projetos.',
  voluntario: 'Pessoas que doam tempo, habilidades e disponibilidade.',
  voluntariado: 'Vínculo entre voluntário e projeto, com função e carga horária.'
};

export function EntityPage({ entity, data, onCreate, onDelete }: EntityPageProps) {
  const [open, setOpen] = useState(false);
  const rows = data[entity] as unknown as Record<string, unknown>[];

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cadastro e controle</p>
          <h1>{entityLabels[entity]}</h1>
          <p>{descriptions[entity]}</p>
        </div>
        <button className="primary" onClick={() => setOpen(true)}>+ Novo registro</button>
      </div>
      <DataTable entity={entity} rows={rows} onDelete={(id) => onDelete(entity, id)} />
      {open && (
        <FormModal
          entity={entity}
          title={`Novo registro - ${entityLabels[entity]}`}
          onClose={() => setOpen(false)}
          onSubmit={(payload) => {
            onCreate(entity, payload);
            setOpen(false);
          }}
        />
      )}
    </section>
  );
}
