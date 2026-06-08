import { FormEvent, useMemo, useState } from 'react';
import type { EntityName } from '../types';

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime-local' | 'checkbox' | 'select';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const fieldsByEntity: Record<EntityName, FieldDef[]> = {
  ong: [
    { name: 'nome', label: 'Nome da ONG', type: 'text', required: true },
    { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'text' },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'uf', label: 'UF', type: 'text', placeholder: 'PE' },
    { name: 'data_cadastro', label: 'Data de cadastro', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['ativa', 'inativa', 'em_analise'] }
  ],
  projeto: [
    { name: 'id_ong', label: 'ID da ONG', type: 'number', required: true },
    { name: 'nome', label: 'Nome do projeto', type: 'text', required: true },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'data_inicio', label: 'Data de início', type: 'date' },
    { name: 'orcamento_previsto', label: 'Orçamento previsto', type: 'number' },
    { name: 'meta_atendimento', label: 'Meta de atendimento', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['planejado', 'em_andamento', 'concluido', 'cancelado'] }
  ],
  doador: [
    { name: 'nome_razao_social', label: 'Nome/Razão social', type: 'text', required: true },
    { name: 'tipo_doador', label: 'Tipo de doador', type: 'select', options: ['pessoa_fisica', 'pessoa_juridica'] },
    { name: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'text' },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'consentimento_lgpd', label: 'Consentimento LGPD', type: 'checkbox' }
  ],
  doacao: [
    { name: 'id_doador', label: 'ID do doador', type: 'number', required: true },
    { name: 'id_ong', label: 'ID da ONG', type: 'number', required: true },
    { name: 'id_projeto', label: 'ID do projeto (opcional)', type: 'number' },
    { name: 'data_doacao', label: 'Data da doação', type: 'date' },
    { name: 'data_registro', label: 'Data/hora de registro', type: 'datetime-local' },
    { name: 'tipo_doacao', label: 'Tipo da doação', type: 'select', options: ['dinheiro', 'bem', 'servico', 'outro'] },
    { name: 'valor', label: 'Valor', type: 'number' },
    { name: 'emitir_recibo', label: 'Emitir recibo', type: 'checkbox' }
  ],
  recurso: [
    { name: 'id_projeto', label: 'ID do projeto', type: 'number', required: true },
    { name: 'nome', label: 'Nome do recurso', type: 'text', required: true },
    { name: 'tipo_recurso', label: 'Tipo', type: 'select', options: ['financeiro', 'material', 'humano', 'servico'] },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'quantidade', label: 'Quantidade', type: 'number' },
    { name: 'valor_estimado', label: 'Valor estimado', type: 'number' },
    { name: 'data_alocacao', label: 'Data de alocação', type: 'date' },
    { name: 'status_utilizacao', label: 'Status', type: 'select', options: ['disponivel', 'utilizado', 'reservado', 'encerrado'] }
  ],
  voluntario: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'cpf', label: 'CPF', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'text' },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'habilidades', label: 'Habilidades separadas por vírgula', type: 'text' },
    { name: 'disponibilidade', label: 'Disponibilidade separada por vírgula', type: 'text' },
    { name: 'consentimento_lgpd', label: 'Consentimento LGPD', type: 'checkbox' }
  ],
  voluntariado: [
    { name: 'id_voluntario', label: 'ID do voluntário', type: 'number', required: true },
    { name: 'id_projeto', label: 'ID do projeto', type: 'number', required: true },
    { name: 'funcao', label: 'Função', type: 'text' },
    { name: 'data_inicio', label: 'Data de início', type: 'date' },
    { name: 'hora_inicio', label: 'Hora início', type: 'time' },
    { name: 'hora_fim', label: 'Hora fim', type: 'time' },
    { name: 'carga_horaria', label: 'Carga horária', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['ativo', 'encerrado', 'suspenso'] }
  ]
};

interface FormModalProps {
  entity: EntityName;
  title: string;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => void;
}

export function FormModal({ entity, title, onClose, onSubmit }: FormModalProps) {
  const fields = useMemo(() => fieldsByEntity[entity], [entity]);
  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.type === 'checkbox') initial[field.name] = false;
      if (field.type === 'select') initial[field.name] = field.options?.[0] ?? '';
      if (field.type === 'date') initial[field.name] = new Date().toISOString().slice(0, 10);
      if (field.type === 'datetime-local') initial[field.name] = new Date().toISOString().slice(0, 16);
    });
    return initial;
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed: Record<string, unknown> = { ...form };

    fields.forEach((field) => {
      if (field.type === 'number') {
        const value = parsed[field.name];
        parsed[field.name] = value === '' || value === undefined ? null : Number(value);
      }
      if (field.name === 'habilidades' || field.name === 'disponibilidade') {
        parsed[field.name] = String(parsed[field.name] || '').split(',').map((item) => item.trim()).filter(Boolean);
      }
      if (field.name === 'id_projeto' && parsed[field.name] === null) {
        parsed[field.name] = null;
      }
    });

    onSubmit(parsed);
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="ghost" onClick={onClose}>Fechar</button>
        </div>
        <div className="form-grid">
          {fields.map((field) => (
            <label key={field.name} className={field.type === 'checkbox' ? 'check-field' : ''}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select value={String(form[field.name] ?? '')} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                  {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : field.type === 'checkbox' ? (
                <input type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })} />
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={String(form[field.name] ?? '')}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        <button className="primary" type="submit">Salvar registro</button>
      </form>
    </div>
  );
}
