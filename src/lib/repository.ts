import type { AppData, EntityName } from '../types';
import { initialData } from '../data/mockData';
import { supabase, useSupabase } from './supabase';

export const entityLabels: Record<EntityName, string> = {
  ong: 'ONGs',
  projeto: 'Projetos',
  doador: 'Doadores',
  doacao: 'Doações',
  recurso: 'Recursos',
  voluntario: 'Voluntários',
  voluntariado: 'Voluntariado'
};

export const primaryKeys: Record<EntityName, string> = {
  ong: 'id_ong',
  projeto: 'id_projeto',
  doador: 'id_doador',
  doacao: 'id_doacao',
  recurso: 'id_recurso',
  voluntario: 'id_voluntario',
  voluntariado: 'id_voluntariado'
};

export async function loadAll(): Promise<AppData> {
  if (!useSupabase || !supabase) return structuredClone(initialData);

  const tables: EntityName[] = ['ong', 'projeto', 'doador', 'doacao', 'recurso', 'voluntario', 'voluntariado'];
  const result: Partial<AppData> = {};

  for (const table of tables) {
    const { data, error } = await (supabase.from(table) as any).select('*').order(primaryKeys[table], { ascending: true });
    if (error) throw new Error(`Erro ao carregar ${table}: ${error.message}`);
    result[table] = (data ?? []) as never;
  }

  return result as AppData;
}

export async function insertRecord<T extends EntityName>(entity: T, payload: Record<string, unknown>): Promise<void> {
  if (!useSupabase || !supabase) return;
  const pk = primaryKeys[entity];
  const cleanPayload = { ...payload };
  delete cleanPayload[pk];
  const { error } = await (supabase.from(entity) as any).insert(cleanPayload);
  if (error) throw new Error(`Erro ao inserir ${entity}: ${error.message}`);
}

export async function deleteRecord<T extends EntityName>(entity: T, id: number): Promise<void> {
  if (!useSupabase || !supabase) return;
  const pk = primaryKeys[entity];
  const { error } = await (supabase.from(entity) as any).delete().eq(pk, id);
  if (error) throw new Error(`Erro ao remover ${entity}: ${error.message}`);
}
