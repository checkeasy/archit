'use client';

import { useMemo } from 'react';
import { PROJECT_PHASES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { Project, ProjectPhase, ProjectStatus } from '@/types';

// ============================================
// Types
// ============================================

type KanbanProject = Omit<Project, 'client'> & { client?: { name: string } };

interface ProjectKanbanProps {
  projects?: KanbanProject[];
}

// ============================================
// Status Helpers
// ============================================

function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Termine',
    cancelled: 'Annule',
  };
  return labels[status] || status;
}

function getStatusBadgeStyle(status: ProjectStatus): React.CSSProperties {
  const styles: Record<ProjectStatus, React.CSSProperties> = {
    active: {
      backgroundColor: '#ecfdf5',
      color: '#047857',
      border: '1px solid #a7f3d0',
    },
    on_hold: {
      backgroundColor: '#fffbeb',
      color: '#b45309',
      border: '1px solid #fde68a',
    },
    completed: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe',
    },
    cancelled: {
      backgroundColor: '#f9fafb',
      color: '#6b7280',
      border: '1px solid #e5e7eb',
    },
  };
  return styles[status] || styles.cancelled;
}

// ============================================
// Mock Data
// ============================================

const MOCK_PROJECTS: KanbanProject[] = [
  {
    id: 'proj-001',
    name: 'Residence Les Terrasses',
    description: 'Construction de 12 logements',
    reference: 'PRJ-001',
    client_id: 'c1',
    client: { name: 'SCI Les Terrasses' },
    status: 'active',
    phase: 'apd',
    budget: 185000,
    surface_m2: 1200,
    address: '15 rue des Terrasses',
    city: 'Lyon',
    postal_code: '69003',
    start_date: '2025-09-01',
    end_date: '2027-03-01',
    created_by: 'user-1',
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'proj-002',
    name: 'Maison Martin',
    description: 'Maison individuelle contemporaine',
    reference: 'PRJ-002',
    client_id: 'c2',
    client: { name: 'M. et Mme Martin' },
    status: 'active',
    phase: 'esquisse',
    budget: 45000,
    surface_m2: 180,
    address: '8 chemin du Lac',
    city: 'Annecy',
    postal_code: '74000',
    start_date: '2026-01-10',
    end_date: '2027-06-01',
    created_by: 'user-1',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'proj-003',
    name: 'Bureaux Nextech',
    description: 'Amenagement open-space 500m2',
    reference: 'PRJ-003',
    client_id: 'c3',
    client: { name: 'Nextech SAS' },
    status: 'active',
    phase: 'pro',
    budget: 92000,
    surface_m2: 500,
    address: '22 avenue de la Tech',
    city: 'Villeurbanne',
    postal_code: '69100',
    start_date: '2025-11-01',
    end_date: '2026-08-01',
    created_by: 'user-1',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'proj-004',
    name: 'Restaurant Le Comptoir',
    description: 'Renovation complete restaurant',
    reference: 'PRJ-004',
    client_id: 'c4',
    client: { name: 'SARL Le Comptoir' },
    status: 'on_hold',
    phase: 'dce',
    budget: 67000,
    surface_m2: 220,
    address: '5 place Bellecour',
    city: 'Lyon',
    postal_code: '69002',
    start_date: '2025-07-01',
    end_date: '2026-04-01',
    created_by: 'user-1',
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'proj-005',
    name: 'Ecole Montessori',
    description: 'Extension et reamenagement',
    reference: 'PRJ-005',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'active',
    phase: 'visa',
    budget: 310000,
    surface_m2: 800,
    address: '12 rue de la Republique',
    city: 'Caluire',
    postal_code: '69300',
    start_date: '2025-03-01',
    end_date: '2026-09-01',
    created_by: 'user-1',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2026-02-05T10:00:00Z',
  },
  {
    id: 'proj-006',
    name: 'Loft Confluence',
    description: 'Transformation local commercial en loft',
    reference: 'PRJ-006',
    client_id: 'c2',
    client: { name: 'M. et Mme Martin' },
    status: 'active',
    phase: 'det',
    budget: 78000,
    surface_m2: 150,
    address: '45 quai Rambaud',
    city: 'Lyon',
    postal_code: '69002',
    start_date: '2025-06-01',
    end_date: '2026-05-01',
    created_by: 'user-1',
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2026-02-12T10:00:00Z',
  },
  {
    id: 'proj-007',
    name: 'Villa Savoie',
    description: 'Construction villa moderne',
    reference: 'PRJ-007',
    client_id: 'c1',
    client: { name: 'SCI Les Terrasses' },
    status: 'completed',
    phase: 'delivered',
    budget: 120000,
    surface_m2: 280,
    address: '3 impasse des Cerisiers',
    city: 'Ecully',
    postal_code: '69130',
    start_date: '2024-09-01',
    end_date: '2025-12-15',
    created_by: 'user-1',
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
  },
  {
    id: 'proj-008',
    name: 'Clinique Pasteur',
    description: 'Renovation accueil et salles d\'attente',
    reference: 'PRJ-008',
    client_id: 'c3',
    client: { name: 'Nextech SAS' },
    status: 'active',
    phase: 'aps',
    budget: 55000,
    surface_m2: 350,
    address: '18 boulevard Pasteur',
    city: 'Lyon',
    postal_code: '69008',
    start_date: '2026-01-15',
    end_date: '2026-10-01',
    created_by: 'user-1',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-14T10:00:00Z',
  },
  {
    id: 'proj-009',
    name: 'Gymnase Municipal',
    description: 'Construction gymnase polyvalent',
    reference: 'PRJ-009',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'active',
    phase: 'act',
    budget: 450000,
    surface_m2: 1500,
    address: '7 avenue du Stade',
    city: 'Caluire',
    postal_code: '69300',
    start_date: '2025-05-01',
    end_date: '2027-01-01',
    created_by: 'user-1',
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2026-02-08T10:00:00Z',
  },
  {
    id: 'proj-010',
    name: 'Entrepot Logistique',
    description: 'Construction entrepot 2000m2',
    reference: 'PRJ-010',
    client_id: 'c4',
    client: { name: 'SARL Le Comptoir' },
    status: 'active',
    phase: 'aor',
    budget: 280000,
    surface_m2: 2000,
    address: '100 route de Satolas',
    city: 'Saint-Priest',
    postal_code: '69800',
    start_date: '2025-01-01',
    end_date: '2026-06-01',
    created_by: 'user-1',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'proj-011',
    name: 'Maison de Retraite',
    description: 'Extension aile sud',
    reference: 'PRJ-011',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'active',
    phase: 'reception',
    budget: 520000,
    surface_m2: 900,
    address: '25 rue des Tilleuls',
    city: 'Caluire',
    postal_code: '69300',
    start_date: '2024-06-01',
    end_date: '2026-03-01',
    created_by: 'user-1',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
];

// ============================================
// Kanban Phases (excluding prospect)
// ============================================

const KANBAN_PHASES: readonly { key: string; label: string; color: string }[] = PROJECT_PHASES.filter(
  (p) => p.key !== 'prospect'
);

// ============================================
// Inline Style Constants
// ============================================

const containerStyle: React.CSSProperties = {
  overflowX: 'auto',
  paddingBottom: '16px',
};

const columnsWrapperStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  minWidth: 'fit-content',
  padding: '4px',
};

function getColumnStyle(color: string): React.CSSProperties {
  return {
    minWidth: '280px',
    maxWidth: '300px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    borderTop: `4px solid ${color}`,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  };
}

const columnHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const columnTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#111827',
};

function getCountBadgeStyle(color: string): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '22px',
    height: '22px',
    borderRadius: '11px',
    fontSize: '11px',
    fontWeight: 600,
    color: color,
    backgroundColor: `${color}15`,
    padding: '0 6px',
  };
}

const columnBodyStyle: React.CSSProperties = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  minHeight: '120px',
};

const projectCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '12px',
  cursor: 'pointer',
  transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
};

const projectNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '4px',
  lineHeight: '1.3',
};

const clientNameStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginBottom: '8px',
};

const budgetStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#111827',
};

const statusBadgeBaseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '11px',
  fontWeight: 500,
  borderRadius: '9999px',
  padding: '2px 8px',
};

const emptyColumnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: '80px',
  color: '#d1d5db',
  fontSize: '12px',
  fontStyle: 'italic',
};

// ============================================
// Component
// ============================================

export default function ProjectKanban({ projects }: ProjectKanbanProps) {
  const projectData = projects ?? MOCK_PROJECTS;

  // Group projects by phase
  const columns = useMemo(() => {
    const grouped: Record<string, KanbanProject[]> = {};

    for (const phase of KANBAN_PHASES) {
      grouped[phase.key] = [];
    }

    for (const project of projectData) {
      if (grouped[project.phase]) {
        grouped[project.phase].push(project);
      }
    }

    return KANBAN_PHASES.map((phase) => ({
      key: phase.key,
      label: phase.label,
      color: phase.color,
      projects: grouped[phase.key] || [],
    }));
  }, [projectData]);

  return (
    <div style={containerStyle}>
      <div style={columnsWrapperStyle}>
        {columns.map((column) => (
          <div key={column.key} style={getColumnStyle(column.color)}>
            {/* Column Header */}
            <div style={columnHeaderStyle}>
              <span style={columnTitleStyle}>{column.label}</span>
              <span style={getCountBadgeStyle(column.color)}>
                {column.projects.length}
              </span>
            </div>

            {/* Column Body */}
            <div style={columnBodyStyle}>
              {column.projects.length === 0 ? (
                <div style={emptyColumnStyle}>
                  Aucun projet
                </div>
              ) : (
                column.projects.map((project) => (
                  <div
                    key={project.id}
                    style={projectCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {/* Project Name */}
                    <div style={projectNameStyle}>{project.name}</div>

                    {/* Client Name */}
                    <div style={clientNameStyle}>
                      {project.client?.name || 'Client non defini'}
                    </div>

                    {/* Budget & Status Row */}
                    <div className="flex items-center justify-between">
                      <span style={budgetStyle}>
                        {project.budget ? formatCurrency(project.budget) : '--'}
                      </span>
                      <span
                        style={{
                          ...statusBadgeBaseStyle,
                          ...getStatusBadgeStyle(project.status),
                        }}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
