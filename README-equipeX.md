# ONGConnect StudentHelp

Sistema demonstrativo para a Parte 3 do projeto de Modelagem de Dados da ONG StudentHelp.

O projeto inclui:

- Front-end em React + Vite + TypeScript.
- UI/UX com painel gerencial, cadastros, tabelas e relatórios.
- Integração pronta com Supabase/PostgreSQL.
- Script SQL único para MySQL 8.0 exigido na Parte 3.
- Schema Supabase com tabelas, integridade, índices, trigger, views e dados de teste.
- Dados demonstrativos locais para rodar o sistema antes de conectar ao Supabase.

## 1. Como rodar no VS Code

Abra a pasta do projeto no VS Code e execute:

```bash
npm install
npm run dev
```

Acesse o endereço exibido no terminal, geralmente:

```bash
http://localhost:5173
```

Sem configurar Supabase, o sistema abre em modo de demonstração local.

## 2. Como ligar ao Supabase

1. Crie um projeto no Supabase.
2. Abra o menu SQL Editor.
3. Execute o arquivo:

```bash
supabase/schema_e_seed_supabase.sql
```

4. Copie `.env.example` para `.env.local`.
5. Preencha:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
VITE_USE_SUPABASE=true
```

6. Rode novamente:

```bash
npm run dev
```

## 3. Arquivo oficial da Parte 3 para avaliação

O script principal da entrega acadêmica está em:

```bash
parte3/equipeX-ongconnect.sql
```

Ele contempla:

- `CREATE DATABASE + USE`.
- Tabelas normalizadas para o terceiro setor.
- Chaves primárias e estrangeiras.
- Restrições `UNIQUE`, `CHECK`, `ENUM` e integridade referencial.
- Índices para relatórios de impacto.
- Triggers para auditoria de doações.
- Views para dashboards gerenciais.
- Dados de teste realistas com mais de 50 registros.
- 15 consultas SQL para relatórios sociais.

## 4. Estrutura do repositório

```text
ongconnect-studenthelp/
├── src/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── supabase/
│   ├── schema_e_seed_supabase.sql
│   └── 15_consultas_relatorios_supabase.sql
├── parte3/
│   └── equipeX-ongconnect.sql
├── docs/
│   └── equipeX-relatorio-final.pdf
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── README.md
```

## 5. Como subir para o GitHub

```bash
git init
git add .
git commit -m "Entrega Parte 3 - ONGConnect StudentHelp"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
 git push -u origin main
```

Remova o espaço antes do último comando se copiar exatamente:

```bash
git push -u origin main
```

## 6. Observação de segurança

Este projeto é acadêmico e demonstrativo. Para uso real, recomenda-se implementar autenticação, políticas de Row Level Security no Supabase e regras de permissão por perfil de usuário.
