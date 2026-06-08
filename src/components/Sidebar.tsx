import type { EntityName } from '../types';

type Page = 'dashboard' | 'relatorios' | EntityName;

interface SidebarProps {
  active: Page;
  onChange: (page: Page) => void;
  onlineMode: boolean;
}

const nav: { key: Page; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Painel', icon: '▣' },
  { key: 'ong', label: 'ONGs', icon: '●' },
  { key: 'projeto', label: 'Projetos', icon: '◆' },
  { key: 'doador', label: 'Doadores', icon: '◐' },
  { key: 'doacao', label: 'Doações', icon: '◉' },
  { key: 'voluntario', label: 'Voluntários', icon: '◇' },
  { key: 'voluntariado', label: 'Voluntariado', icon: '◎' },
  { key: 'recurso', label: 'Recursos', icon: '▤' },
  { key: 'relatorios', label: 'Relatórios', icon: '▧' }
];

export function Sidebar({ active, onChange, onlineMode }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">SH</div>
        <div>
          <strong>StudentHelp</strong>
          <span>ONGConnect</span>
        </div>
      </div>

      <nav>
        {nav.map((item) => (
          <button
            key={item.key}
            className={active === item.key ? 'nav-item active' : 'nav-item'}
            onClick={() => onChange(item.key)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="connection-card">
        <small>Modo de dados</small>
        <strong>{onlineMode ? 'Supabase conectado' : 'Demonstração local'}</strong>
        <p>{onlineMode ? 'Registros lidos e gravados no banco.' : 'Preencha .env.local para integrar ao Supabase.'}</p>
      </div>
    </aside>
  );
}
