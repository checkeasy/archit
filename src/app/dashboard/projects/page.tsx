'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Euro,
  Ruler,
} from 'lucide-react';
import { formatCurrency, getPhaseLabel, getStatusColor, cn } from '@/lib/utils';
import { PROJECT_PHASES } from '@/lib/constants';
import type { Project, ProjectPhase, ProjectStatus } from '@/types';

// ============================================
// Mock Clients
// ============================================
const mockClients = [
  { id: 'c1', name: 'SCI Les Terrasses' },
  { id: 'c2', name: 'M. et Mme Martin' },
  { id: 'c3', name: 'Nextech SAS' },
  { id: 'c4', name: 'SARL Le Comptoir' },
  { id: 'c5', name: 'Mairie de Caluire' },
  { id: 'c6', name: 'Groupe Immobilier Rhone' },
  { id: 'c7', name: 'M. Lefebvre' },
  { id: 'c8', name: 'Association Sport pour Tous' },
];

// ============================================
// Mock Projects
// ============================================
const mockProjects: Array<Omit<Project, 'client'> & { client?: { name: string } }> = [
  {
    id: '1',
    name: 'Residence Les Terrasses',
    description: 'Construction neuve R+3, 24 logements collectifs',
    reference: 'PRJ-00012',
    client_id: 'c1',
    client: { name: 'SCI Les Terrasses' },
    status: 'active',
    phase: 'dce',
    budget: 320000,
    surface_m2: 2400,
    address: '12 rue des Lilas, Lyon 69003',
    city: 'Lyon',
    postal_code: '69003',
    start_date: '2025-09-01',
    end_date: '2026-12-31',
    created_by: 'u1',
    created_at: '2025-09-01',
    updated_at: '2026-02-15',
  },
  {
    id: '2',
    name: 'Maison Martin',
    description: 'Extension et renovation maison individuelle',
    reference: 'PRJ-00011',
    client_id: 'c2',
    client: { name: 'M. et Mme Martin' },
    status: 'active',
    phase: 'apd',
    budget: 85000,
    surface_m2: 180,
    address: '8 chemin du Parc, Villeurbanne',
    city: 'Villeurbanne',
    postal_code: '69100',
    start_date: '2025-11-15',
    end_date: '2026-06-30',
    created_by: 'u1',
    created_at: '2025-11-15',
    updated_at: '2026-02-14',
  },
  {
    id: '3',
    name: 'Bureaux Nextech',
    description: 'Amenagement bureaux open-space 600m2',
    reference: 'PRJ-00010',
    client_id: 'c3',
    client: { name: 'Nextech SAS' },
    status: 'active',
    phase: 'pro',
    budget: 195000,
    surface_m2: 600,
    address: '45 avenue de la Republique, Paris',
    city: 'Paris',
    postal_code: '75011',
    start_date: '2025-10-01',
    end_date: '2026-08-15',
    created_by: 'u1',
    created_at: '2025-10-01',
    updated_at: '2026-02-12',
  },
  {
    id: '4',
    name: 'Restaurant Le Comptoir',
    description: 'Renovation complete + mise aux normes ERP',
    reference: 'PRJ-00009',
    client_id: 'c4',
    client: { name: 'SARL Le Comptoir' },
    status: 'active',
    phase: 'act',
    budget: 145000,
    surface_m2: 280,
    address: '3 place Bellecour, Lyon',
    city: 'Lyon',
    postal_code: '69002',
    start_date: '2025-07-01',
    end_date: '2026-04-30',
    created_by: 'u1',
    created_at: '2025-07-01',
    updated_at: '2026-02-10',
  },
  {
    id: '5',
    name: 'Ecole Montessori Les Petits Chenes',
    description: 'Construction ecole maternelle 6 classes',
    reference: 'PRJ-00008',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'on_hold',
    phase: 'esquisse',
    budget: 520000,
    surface_m2: 1200,
    address: '22 rue Jean Moulin, Caluire-et-Cuire',
    city: 'Caluire-et-Cuire',
    postal_code: '69300',
    start_date: '2026-01-15',
    end_date: '2027-09-01',
    created_by: 'u1',
    created_at: '2026-01-15',
    updated_at: '2026-02-08',
  },
  {
    id: '6',
    name: 'Immeuble Confluence T4',
    description: 'Rehabilitation immeuble haussmannien, 18 lots',
    reference: 'PRJ-00007',
    client_id: 'c6',
    client: { name: 'Groupe Immobilier Rhone' },
    status: 'active',
    phase: 'visa',
    budget: 480000,
    surface_m2: 3200,
    address: '78 quai Perrache, Lyon',
    city: 'Lyon',
    postal_code: '69002',
    start_date: '2025-03-01',
    end_date: '2026-06-30',
    created_by: 'u1',
    created_at: '2025-03-01',
    updated_at: '2026-02-05',
  },
  {
    id: '7',
    name: 'Villa Lefebvre',
    description: 'Maison contemporaine bois-beton, terrain en pente',
    reference: 'PRJ-00006',
    client_id: 'c7',
    client: { name: 'M. Lefebvre' },
    status: 'active',
    phase: 'aps',
    budget: 210000,
    surface_m2: 240,
    address: '15 impasse des Cerisiers, Ecully',
    city: 'Ecully',
    postal_code: '69130',
    start_date: '2026-01-10',
    end_date: '2026-11-30',
    created_by: 'u1',
    created_at: '2026-01-10',
    updated_at: '2026-02-03',
  },
  {
    id: '8',
    name: 'Complexe Sportif Municipal',
    description: 'Gymnase + piscine, marche public',
    reference: 'PRJ-00005',
    client_id: 'c8',
    client: { name: 'Association Sport pour Tous' },
    status: 'completed',
    phase: 'delivered',
    budget: 1200000,
    surface_m2: 5000,
    address: '1 avenue du Stade, Bron',
    city: 'Bron',
    postal_code: '69500',
    start_date: '2024-01-15',
    end_date: '2025-12-01',
    created_by: 'u1',
    created_at: '2024-01-15',
    updated_at: '2025-12-01',
  },
  {
    id: '9',
    name: 'Loft Croix-Rousse',
    description: 'Transformation atelier en loft, 150m2',
    reference: 'PRJ-00004',
    client_id: 'c2',
    client: { name: 'M. et Mme Martin' },
    status: 'active',
    phase: 'det',
    budget: 110000,
    surface_m2: 150,
    address: '34 montee de la Grande Cote, Lyon',
    city: 'Lyon',
    postal_code: '69001',
    start_date: '2025-06-01',
    end_date: '2026-03-15',
    created_by: 'u1',
    created_at: '2025-06-01',
    updated_at: '2026-02-16',
  },
  {
    id: '10',
    name: 'Centre Medical Saint-Exupery',
    description: 'Construction centre medical pluridisciplinaire',
    reference: 'PRJ-00003',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'active',
    phase: 'prospect',
    budget: null,
    surface_m2: 800,
    address: 'Rue Saint-Exupery, Caluire-et-Cuire',
    city: 'Caluire-et-Cuire',
    postal_code: '69300',
    start_date: null,
    end_date: null,
    created_by: 'u1',
    created_at: '2026-02-10',
    updated_at: '2026-02-10',
  },
];

// ============================================
// Helpers
// ============================================
function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    prospect: 'bg-slate-100 text-slate-700',
    esquisse: 'bg-violet-50 text-violet-700',
    aps: 'bg-indigo-50 text-indigo-700',
    apd: 'bg-blue-50 text-blue-700',
    pro: 'bg-sky-50 text-sky-700',
    dce: 'bg-teal-50 text-teal-700',
    act: 'bg-green-50 text-green-700',
    visa: 'bg-lime-50 text-lime-700',
    det: 'bg-yellow-50 text-yellow-700',
    aor: 'bg-orange-50 text-orange-700',
    reception: 'bg-red-50 text-red-700',
    delivered: 'bg-emerald-50 text-emerald-700',
  };
  return colors[phase] || 'bg-gray-100 text-gray-700';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Termine',
    cancelled: 'Annule',
  };
  return labels[status] || status;
}

function getProgressFromPhase(phase: ProjectPhase): number {
  const phaseOrder: ProjectPhase[] = [
    'prospect', 'esquisse', 'aps', 'apd', 'pro',
    'dce', 'act', 'visa', 'det', 'aor', 'reception', 'delivered',
  ];
  const idx = phaseOrder.indexOf(phase);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / phaseOrder.length) * 100);
}

// ============================================
// Constants
// ============================================
const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'on_hold', label: 'En pause' },
  { value: 'completed', label: 'Termine' },
  { value: 'cancelled', label: 'Annule' },
];

// ============================================
// Component
// ============================================
export default function ProjectsPage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);

  // New project form state
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    client_id: '',
    phase: 'prospect' as ProjectPhase,
    budget: '',
    surface_m2: '',
    address: '',
    start_date: '',
    end_date: '',
  });

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.name.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchPhase = !phaseFilter || p.phase === phaseFilter;
      return matchSearch && matchStatus && matchPhase;
    });
  }, [search, statusFilter, phaseFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Kanban data
  const kanbanColumns = useMemo(() => {
    return PROJECT_PHASES.map((phase) => ({
      key: phase.key,
      label: phase.label,
      color: phase.color,
      projects: filteredProjects.filter((p) => p.phase === phase.key),
    }));
  }, [filteredProjects]);

  // Reset page when filters change
  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleCreateProject = () => {
    // Mock: just close the modal
    setShowNewModal(false);
    setNewProject({
      name: '',
      description: '',
      client_id: '',
      phase: 'prospect',
      budget: '',
      surface_m2: '',
      address: '',
      start_date: '',
      end_date: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'kanban'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet, client, reference..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={phaseFilter}
          onChange={(e) => handleFilterChange(setPhaseFilter, e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
        >
          <option value="">Toutes les phases</option>
          {PROJECT_PHASES.map((phase) => (
            <option key={phase.key} value={phase.key}>
              {phase.label}
            </option>
          ))}
        </select>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1000px] table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-[100px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reference
                  </th>
                  <th className="w-[250px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nom
                  </th>
                  <th className="w-[180px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="w-[80px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Phase
                  </th>
                  <th className="w-[130px] px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Budget
                  </th>
                  <th className="w-[120px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Avancement
                  </th>
                  <th className="w-[100px] px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProjects.map((project) => {
                  const progress = getProgressFromPhase(project.phase);
                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-sm font-mono text-gray-500 hover:text-[var(--color-primary)]"
                        >
                          {project.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="block"
                        >
                          <p className="text-sm font-medium text-gray-900 hover:text-[var(--color-primary)]">
                            {project.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {project.description}
                          </p>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-700">{project.client?.name}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPhaseColor(project.phase)}`}
                        >
                          {getPhaseLabel(project.phase)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {project.budget ? formatCurrency(project.budget) : '--'}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-gray-100">
                            <div
                              className="h-1.5 rounded-full bg-[var(--color-primary)] transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginatedProjects.map((project) => {
              const progress = getProgressFromPhase(project.phase);
              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block px-5 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="text-xs text-gray-500">{project.client?.name}</p>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{project.reference}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPhaseColor(project.phase)}`}
                    >
                      {getPhaseLabel(project.phase)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[var(--color-primary)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{progress}%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {project.budget ? formatCurrency(project.budget) : '--'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">Aucun projet trouve</p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez de modifier vos filtres de recherche.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <p className="text-sm text-gray-500">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                {' - '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}
                {' sur '}
                {filteredProjects.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                      currentPage === page
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {kanbanColumns.map((column) => (
              <div
                key={column.key}
                className="w-[280px] shrink-0 rounded-xl border border-gray-200 bg-gray-50/50"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-sm font-semibold text-gray-900">{column.label}</h3>
                  </div>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-medium text-gray-600">
                    {column.projects.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="space-y-2 p-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {column.projects.length === 0 && (
                    <p className="py-6 text-center text-xs text-gray-400">
                      Aucun projet
                    </p>
                  )}
                  {column.projects.map((project) => {
                    const progress = getProgressFromPhase(project.phase);
                    return (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className="block rounded-lg border border-gray-200 bg-white p-3 hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {project.client?.name}
                        </p>
                        {project.budget && (
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            {formatCurrency(project.budget)}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: column.color,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{progress}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowNewModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Nouveau projet</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ex: Residence Les Terrasses"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Description du projet..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors resize-none"
                />
              </div>

              {/* Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Client
                </label>
                <select
                  value={newProject.client_id}
                  onChange={(e) =>
                    setNewProject({ ...newProject, client_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                >
                  <option value="">Selectionner un client</option>
                  {mockClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phase initiale
                </label>
                <select
                  value={newProject.phase}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      phase: e.target.value as ProjectPhase,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                >
                  {PROJECT_PHASES.map((phase) => (
                    <option key={phase.key} value={phase.key}>
                      {phase.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget + Surface row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Euro className="h-3.5 w-3.5" />
                      Budget (EUR)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    placeholder="250 000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" />
                      Surface (m2)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newProject.surface_m2}
                    onChange={(e) =>
                      setNewProject({ ...newProject, surface_m2: e.target.value })
                    }
                    placeholder="200"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    Adresse
                  </span>
                </label>
                <input
                  type="text"
                  value={newProject.address}
                  onChange={(e) =>
                    setNewProject({ ...newProject, address: e.target.value })
                  }
                  placeholder="12 rue des Lilas, 69003 Lyon"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                />
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Date debut
                    </span>
                  </label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) =>
                      setNewProject({ ...newProject, start_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Date fin
                    </span>
                  </label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) =>
                      setNewProject({ ...newProject, end_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setShowNewModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
                className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Creer le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
