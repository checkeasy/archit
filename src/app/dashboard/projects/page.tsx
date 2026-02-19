'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FolderKanban,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Clock,
  Filter,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Briefcase,
  Activity,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  XCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatDate, getPhaseLabel, getStatusColor, cn } from '@/lib/utils';
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
  { id: 'c6', name: 'Groupe Immobilier Rhône' },
  { id: 'c7', name: 'M. Lefebvre' },
  { id: 'c8', name: 'Association Sport pour Tous' },
  { id: 'c9', name: 'SCI Presqu\'île Invest' },
  { id: 'c10', name: 'Cabinet Médical Pasteur' },
];

// ============================================
// Mock Projects (10 projets réalistes)
// ============================================
const mockProjects: Array<Omit<Project, 'client'> & { client?: { name: string } }> = [
  {
    id: '1',
    name: 'Résidence Les Terrasses',
    description: 'Construction neuve R+3, 24 logements collectifs avec parking souterrain',
    reference: 'PRJ-2025-012',
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
    description: 'Extension et rénovation maison individuelle, surélévation R+1',
    reference: 'PRJ-2025-011',
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
    description: 'Aménagement bureaux open-space 600m², cloisons amovibles et salle de réunion',
    reference: 'PRJ-2025-010',
    client_id: 'c3',
    client: { name: 'Nextech SAS' },
    status: 'active',
    phase: 'pro',
    budget: 195000,
    surface_m2: 600,
    address: '45 avenue de la République, Paris',
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
    description: 'Rénovation complète + mise aux normes ERP catégorie 5',
    reference: 'PRJ-2025-009',
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
    name: 'École Montessori Les Petits Chênes',
    description: 'Construction école maternelle 6 classes, réfectoire et cour paysagée',
    reference: 'PRJ-2026-001',
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
    description: 'Réhabilitation immeuble haussmannien, 18 lots, ravalement façade classée',
    reference: 'PRJ-2025-007',
    client_id: 'c6',
    client: { name: 'Groupe Immobilier Rhône' },
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
    description: 'Maison contemporaine bois-béton, terrain en pente, piscine naturelle',
    reference: 'PRJ-2026-002',
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
    description: 'Gymnase + piscine, marché public lot unique, HQE niveau excellent',
    reference: 'PRJ-2024-005',
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
    description: 'Transformation atelier soyeux en loft, 150m², verrière et mezzanine',
    reference: 'PRJ-2025-004',
    client_id: 'c2',
    client: { name: 'M. et Mme Martin' },
    status: 'active',
    phase: 'det',
    budget: 110000,
    surface_m2: 150,
    address: '34 montée de la Grande Côte, Lyon',
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
    name: 'Centre Médical Saint-Exupéry',
    description: 'Construction centre médical pluridisciplinaire, accessibilité PMR totale',
    reference: 'PRJ-2026-003',
    client_id: 'c5',
    client: { name: 'Mairie de Caluire' },
    status: 'active',
    phase: 'prospect',
    budget: null,
    surface_m2: 800,
    address: 'Rue Saint-Exupéry, Caluire-et-Cuire',
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
function getPhaseColorHex(phase: string): string {
  const found = PROJECT_PHASES.find((p) => p.key === phase);
  return found ? found.color : '#94a3b8';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
}

function getStatusDot(status: string): string {
  const colors: Record<string, string> = {
    active: '#22c55e',
    on_hold: '#f59e0b',
    completed: '#3b82f6',
    cancelled: '#9ca3af',
  };
  return colors[status] || '#9ca3af';
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active': return CheckCircle2;
    case 'on_hold': return PauseCircle;
    case 'completed': return CheckCircle2;
    case 'cancelled': return XCircle;
    default: return AlertCircle;
  }
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

function formatSurface(m2: number | null): string {
  if (!m2) return '--';
  return new Intl.NumberFormat('fr-FR').format(m2) + ' m\u00B2';
}

function truncateText(str: string | null, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

function getDaysRemaining(endDate: string | null): { text: string; urgent: boolean } | null {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `${Math.abs(diff)}j de retard`, urgent: true };
  if (diff === 0) return { text: 'Échéance aujourd\'hui', urgent: true };
  if (diff <= 30) return { text: `${diff}j restants`, urgent: diff <= 14 };
  const months = Math.floor(diff / 30);
  return { text: `${months} mois restant${months > 1 ? 's' : ''}`, urgent: false };
}

// ============================================
// Sort types
// ============================================
type SortField = 'name' | 'client' | 'phase' | 'budget' | 'surface_m2' | 'start_date' | 'status';
type SortDirection = 'asc' | 'desc';

// ============================================
// Constants
// ============================================
const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'on_hold', label: 'En pause' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
];

const PHASE_ORDER: ProjectPhase[] = [
  'prospect', 'esquisse', 'aps', 'apd', 'pro',
  'dce', 'act', 'visa', 'det', 'aor', 'reception', 'delivered',
];

// ============================================
// Component
// ============================================
export default function ProjectsPage() {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  // Unique clients for filter
  const uniqueClients = useMemo(() => {
    const clientMap = new Map<string, string>();
    mockProjects.forEach((p) => {
      if (p.client_id && p.client?.name) {
        clientMap.set(p.client_id, p.client.name);
      }
    });
    return Array.from(clientMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.name.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchPhase = !phaseFilter || p.phase === phaseFilter;
      const matchClient = !clientFilter || p.client_id === clientFilter;
      return matchSearch && matchStatus && matchPhase && matchClient;
    });
  }, [search, statusFilter, phaseFilter, clientFilter]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'client':
          comparison = (a.client?.name || '').localeCompare(b.client?.name || '');
          break;
        case 'phase':
          comparison = PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase);
          break;
        case 'budget':
          comparison = (a.budget || 0) - (b.budget || 0);
          break;
        case 'surface_m2':
          comparison = (a.surface_m2 || 0) - (b.surface_m2 || 0);
          break;
        case 'start_date':
          comparison = (a.start_date || '').localeCompare(b.start_date || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredProjects, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // KPI calculations
  const kpis = useMemo(() => {
    const total = mockProjects.length;
    const active = mockProjects.filter((p) => p.status === 'active').length;
    const onHold = mockProjects.filter((p) => p.status === 'on_hold').length;
    const completed = mockProjects.filter((p) => p.status === 'completed').length;
    const totalBudget = mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSurface = mockProjects.reduce((sum, p) => sum + (p.surface_m2 || 0), 0);
    const avgBudget = totalBudget / mockProjects.filter((p) => p.budget).length;
    return { total, active, onHold, completed, totalBudget, totalSurface, avgBudget };
  }, []);

  // Phase pipeline counts
  const phaseCounts = useMemo(() => {
    return PROJECT_PHASES.map((phase) => ({
      ...phase,
      count: mockProjects.filter((p) => p.phase === phase.key).length,
    }));
  }, []);

  const totalPipelineProjects = phaseCounts.reduce((s, p) => s + p.count, 0);

  // Sort handler
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  // Reset page when filters change
  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleCreateProject = () => {
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

  const activeFiltersCount = [statusFilter, phaseFilter, clientFilter].filter(Boolean).length;

  // Sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" style={{ opacity: 0.4 }} />;
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3 w-3" style={{ color: '#2563EB' }} />
      : <ArrowDown className="h-3 w-3" style={{ color: '#2563EB' }} />;
  };

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#111827', lineHeight: 1.2, letterSpacing: '-0.025em' }}>
            Projets
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
            Gérez l'ensemble de vos projets d'architecture -- {kpis.active} projet{kpis.active > 1 ? 's' : ''} en cours
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div
            className="flex items-center gap-0.5"
            style={{
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}
          >
            <button
              onClick={() => setView('grid')}
              className="flex items-center gap-1.5"
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                transition: 'all 150ms',
                backgroundColor: view === 'grid' ? '#ffffff' : 'transparent',
                color: view === 'grid' ? '#111827' : '#6b7280',
                boxShadow: view === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grille</span>
            </button>
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-1.5"
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                transition: 'all 150ms',
                backgroundColor: view === 'list' ? '#ffffff' : 'transparent',
                color: view === 'list' ? '#111827' : '#6b7280',
                boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#2563EB',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'background-color 150ms',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(37,99,235,0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* KPI Cards */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total projets */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            padding: '22px',
            transition: 'all 200ms',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2563EB, #3b82f6)',
              borderRadius: '14px 14px 0 0',
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
              }}
            >
              <FolderKanban style={{ width: '22px', height: '22px', color: '#2563EB' }} />
            </div>
            <span
              className="flex items-center gap-1"
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#f0fdf4',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#16a34a',
              }}
            >
              <TrendingUp style={{ width: '10px', height: '10px' }} />
              +2 ce mois
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.025em' }}>
              {kpis.total}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              Total projets
            </p>
          </div>
        </div>

        {/* En cours */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            padding: '22px',
            transition: 'all 200ms',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #22c55e, #4ade80)',
              borderRadius: '14px 14px 0 0',
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
              }}
            >
              <Activity style={{ width: '22px', height: '22px', color: '#22c55e' }} />
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#fefce8',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#ca8a04',
                }}
              >
                {kpis.onHold} en pause
              </span>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.025em' }}>
              {kpis.active}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              En cours
            </p>
          </div>
        </div>

        {/* Budget total */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            padding: '22px',
            transition: 'all 200ms',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #d97706, #f59e0b)',
              borderRadius: '14px 14px 0 0',
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
              }}
            >
              <Euro style={{ width: '22px', height: '22px', color: '#d97706' }} />
            </div>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#f0f9ff',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#0369a1',
              }}
            >
              moy. {new Intl.NumberFormat('fr-FR', { notation: 'compact', style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(kpis.avgBudget)}
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.025em' }}>
              {new Intl.NumberFormat('fr-FR', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'EUR', maximumFractionDigits: 1 }).format(kpis.totalBudget)}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              Budget total
            </p>
          </div>
        </div>

        {/* Surface totale */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            padding: '22px',
            transition: 'all 200ms',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              borderRadius: '14px 14px 0 0',
            }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex items-center justify-center"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f3e8ff',
              }}
            >
              <Ruler style={{ width: '22px', height: '22px', color: '#7c3aed' }} />
            </div>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#faf5ff',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#7c3aed',
              }}
            >
              {kpis.completed} livré{kpis.completed > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.025em' }}>
              {new Intl.NumberFormat('fr-FR').format(kpis.totalSurface)}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              Surface totale (m²)
            </p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Phase Filter Bar (Pills) */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '18px 20px',
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
            Filtrer par phase
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} affiché{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Phase pills row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* "Tous" pill */}
          <button
            onClick={() => handleFilterChange(setPhaseFilter, '')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: !phaseFilter ? '2px solid #2563EB' : '1px solid #e5e7eb',
              backgroundColor: !phaseFilter ? '#eff6ff' : '#ffffff',
              color: !phaseFilter ? '#2563EB' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 150ms',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (phaseFilter) {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (phaseFilter) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            Tous ({totalPipelineProjects})
          </button>

          {/* Phase pills */}
          {phaseCounts.map((phase) => {
            const isActive = phaseFilter === phase.key;
            return (
              <button
                key={phase.key}
                onClick={() => handleFilterChange(setPhaseFilter, isActive ? '' : phase.key)}
                className="flex items-center gap-1.5"
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 600 : 500,
                  border: isActive ? `2px solid ${phase.color}` : '1px solid #e5e7eb',
                  backgroundColor: isActive ? `${phase.color}12` : '#ffffff',
                  color: isActive ? phase.color : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  opacity: phase.count === 0 ? 0.4 : 1,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive && phase.count > 0) {
                    e.currentTarget.style.borderColor = phase.color;
                    e.currentTarget.style.backgroundColor = `${phase.color}08`;
                    e.currentTarget.style.color = phase.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: phase.color,
                    flexShrink: 0,
                  }}
                />
                {phase.label}
                {phase.count > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '10px',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: isActive ? phase.color : '#f3f4f6',
                      color: isActive ? '#ffffff' : '#6b7280',
                      padding: '0 5px',
                    }}
                  >
                    {phase.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pipeline progress bar */}
        <div style={{ marginTop: '14px' }}>
          <div
            className="flex"
            style={{
              height: '6px',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
            }}
          >
            {phaseCounts.map((phase) =>
              phase.count > 0 ? (
                <div
                  key={phase.key}
                  style={{
                    width: `${(phase.count / totalPipelineProjects) * 100}%`,
                    minWidth: '4px',
                    backgroundColor: phase.color,
                    transition: 'all 300ms ease',
                    opacity: phaseFilter && phaseFilter !== phase.key ? 0.25 : 1,
                  }}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Search & Advanced Filters */}
      {/* ============================================ */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: '#9ca3af' }}
            />
            <input
              type="text"
              placeholder="Rechercher un projet, client, référence, ville..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                padding: '10px 16px 10px 40px',
                fontSize: '0.875rem',
                color: '#111827',
                outline: 'none',
                transition: 'all 150ms',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {search && (
              <button
                onClick={() => handleFilterChange(setSearch, '')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                <X style={{ width: '12px', height: '12px', color: '#6b7280' }} />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: showFilters ? '#eff6ff' : '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: showFilters ? '#2563EB' : '#374151',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            <Filter className="h-4 w-4" />
            Filtres avancés
            {activeFiltersCount > 0 && (
              <span
                className="flex items-center justify-center"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className="h-3.5 w-3.5"
              style={{
                transition: 'transform 150ms',
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: '#f9fafb',
              border: '1px solid #f3f4f6',
            }}
          >
            <div className="flex-1">
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phase
              </label>
              <select
                value={phaseFilter}
                onChange={(e) => handleFilterChange(setPhaseFilter, e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Toutes les phases</option>
                {PROJECT_PHASES.map((phase) => (
                  <option key={phase.key} value={phase.key}>
                    {phase.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Client
              </label>
              <select
                value={clientFilter}
                onChange={(e) => handleFilterChange(setClientFilter, e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Tous les clients</option>
                {uniqueClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setPhaseFilter('');
                    setClientFilter('');
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-1"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                >
                  <X className="h-3.5 w-3.5" />
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* GRID VIEW */}
      {/* ============================================ */}
      {view === 'grid' && (
        <>
          {paginatedProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProjects.map((project) => {
                const progress = getProgressFromPhase(project.phase);
                const phaseColor = getPhaseColorHex(project.phase);
                const deadline = getDaysRemaining(project.end_date);
                const isHovered = hoveredCard === project.id;

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    style={{
                      display: 'block',
                      borderRadius: '14px',
                      border: isHovered ? `1px solid ${phaseColor}40` : '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                      transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      boxShadow: isHovered ? `0 8px 24px ${phaseColor}15` : '0 1px 3px rgba(0,0,0,0.04)',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setHoveredCard(project.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Top colored accent bar */}
                    <div
                      style={{
                        height: '4px',
                        background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)`,
                      }}
                    />

                    <div style={{ padding: '18px 20px 20px' }}>
                      {/* Card header - phase badge + status */}
                      <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                        <span
                          className="flex items-center gap-1.5"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: phaseColor,
                            backgroundColor: `${phaseColor}12`,
                            border: `1px solid ${phaseColor}25`,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: phaseColor,
                            }}
                          />
                          {getPhaseLabel(project.phase)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            style={{
                              display: 'inline-block',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: getStatusDot(project.status),
                            }}
                          />
                          <span style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 500 }}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                      </div>

                      {/* Project name */}
                      <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}>
                        {project.name}
                      </h3>

                      {/* Reference */}
                      <p style={{
                        fontSize: '0.6875rem',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        color: '#9ca3af',
                        marginBottom: '6px',
                        letterSpacing: '0.02em',
                      }}>
                        {project.reference}
                      </p>

                      {/* Description snippet */}
                      {project.description && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          lineHeight: 1.5,
                          marginBottom: '14px',
                        }}>
                          {truncateText(project.description, 80)}
                        </p>
                      )}

                      {/* Divider */}
                      <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '0 0 14px 0' }} />

                      {/* Client + Location */}
                      <div className="space-y-2" style={{ marginBottom: '14px' }}>
                        <div className="flex items-center gap-2">
                          <Building2 style={{ width: '13px', height: '13px', color: '#9ca3af', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                            {project.client?.name}
                          </span>
                        </div>
                        {project.city && (
                          <div className="flex items-center gap-2">
                            <MapPin style={{ width: '13px', height: '13px', color: '#9ca3af', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {project.city} {project.postal_code ? `(${project.postal_code})` : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Metrics row */}
                      <div className="flex items-center gap-4" style={{ marginBottom: '14px' }}>
                        <div className="flex items-center gap-1.5">
                          <Euro style={{ width: '13px', height: '13px', color: '#d97706' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                            {project.budget ? formatCurrency(project.budget) : '--'}
                          </span>
                        </div>
                        <div
                          style={{ width: '1px', height: '14px', backgroundColor: '#e5e7eb' }}
                        />
                        <div className="flex items-center gap-1.5">
                          <Ruler style={{ width: '13px', height: '13px', color: '#7c3aed' }} />
                          <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                            {formatSurface(project.surface_m2)}
                          </span>
                        </div>
                      </div>

                      {/* Dates + Deadline warning */}
                      {(project.start_date || deadline) && (
                        <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                          {project.start_date && (
                            <div className="flex items-center gap-1.5">
                              <Calendar style={{ width: '12px', height: '12px', color: '#9ca3af' }} />
                              <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                                {formatDate(project.start_date)}
                                {project.end_date ? ` - ${formatDate(project.end_date)}` : ''}
                              </span>
                            </div>
                          )}
                          {deadline && (
                            <span
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '10px',
                                backgroundColor: deadline.urgent ? '#fef2f2' : '#f0fdf4',
                                color: deadline.urgent ? '#dc2626' : '#16a34a',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {deadline.text}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Progress bar */}
                      <div>
                        <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 500 }}>
                            Avancement
                          </span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: phaseColor }}>
                            {progress}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '6px',
                            borderRadius: '10px',
                            backgroundColor: '#f3f4f6',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              borderRadius: '10px',
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}cc)`,
                              transition: 'width 500ms ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state for grid */
            <div
              className="flex flex-col items-center justify-center"
              style={{
                padding: '80px 20px',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  marginBottom: '24px',
                }}
              >
                <FolderKanban style={{ width: '36px', height: '36px', color: '#93c5fd' }} />
              </div>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Aucun projet trouvé
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', maxWidth: '380px', lineHeight: 1.6 }}>
                Aucun projet ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres ou créez un nouveau projet.
              </p>
              <div className="flex items-center gap-3" style={{ marginTop: '24px' }}>
                {(search || activeFiltersCount > 0) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                      setPhaseFilter('');
                      setClientFilter('');
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                <button
                  onClick={() => setShowNewModal(true)}
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    backgroundColor: '#2563EB',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  <Plus className="h-4 w-4" />
                  Créer un projet
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* LIST VIEW (Table) */}
      {/* ============================================ */}
      {view === 'list' && (
        <div
          style={{
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {paginatedProjects.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                      {([
                        { field: 'name' as SortField, label: 'Projet', width: '260px', align: 'left' as const },
                        { field: 'client' as SortField, label: 'Client', width: '170px', align: 'left' as const },
                        { field: 'phase' as SortField, label: 'Phase', width: '120px', align: 'left' as const },
                        { field: 'budget' as SortField, label: 'Budget', width: '140px', align: 'right' as const },
                        { field: 'surface_m2' as SortField, label: 'Surface', width: '100px', align: 'right' as const },
                        { field: 'start_date' as SortField, label: 'Période', width: '170px', align: 'left' as const },
                        { field: 'status' as SortField, label: 'Statut', width: '100px', align: 'left' as const },
                      ]).map((col) => (
                        <th
                          key={col.field}
                          style={{
                            width: col.width,
                            padding: '14px 20px',
                            textAlign: col.align,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'color 150ms',
                          }}
                          onClick={() => handleSort(col.field)}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {col.label}
                            <SortIcon field={col.field} />
                          </span>
                        </th>
                      ))}
                      <th style={{ width: '100px', padding: '14px 20px', fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Avancement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((project, idx) => {
                      const progress = getProgressFromPhase(project.phase);
                      const phaseColor = getPhaseColorHex(project.phase);
                      const deadline = getDaysRemaining(project.end_date);
                      return (
                        <tr
                          key={project.id}
                          style={{
                            borderBottom: idx < paginatedProjects.length - 1 ? '1px solid #f9fafb' : 'none',
                            transition: 'background-color 150ms',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafbfd')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                        >
                          {/* Projet */}
                          <td style={{ padding: '16px 20px' }}>
                            <div className="flex items-start gap-3">
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  backgroundColor: `${phaseColor}12`,
                                  flexShrink: 0,
                                  marginTop: '2px',
                                }}
                              >
                                <Briefcase style={{ width: '16px', height: '16px', color: phaseColor }} />
                              </div>
                              <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                                  {project.name}
                                </p>
                                <p style={{ fontSize: '0.6875rem', fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: '#9ca3af' }}>
                                  {project.reference}
                                </p>
                                {project.city && (
                                  <div className="flex items-center gap-1" style={{ marginTop: '3px' }}>
                                    <MapPin style={{ width: '10px', height: '10px', color: '#d1d5db' }} />
                                    <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                                      {project.city}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Client */}
                          <td style={{ padding: '16px 20px' }}>
                            <div className="flex items-center gap-2">
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: '#f3f4f6',
                                  fontSize: '0.625rem',
                                  fontWeight: 700,
                                  color: '#6b7280',
                                  flexShrink: 0,
                                }}
                              >
                                {(project.client?.name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <p style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                                {project.client?.name}
                              </p>
                            </div>
                          </td>

                          {/* Phase */}
                          <td style={{ padding: '16px 20px' }}>
                            <span
                              className="inline-flex items-center gap-1.5"
                              style={{
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                color: phaseColor,
                                backgroundColor: `${phaseColor}12`,
                                border: `1px solid ${phaseColor}25`,
                              }}
                            >
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: phaseColor,
                                }}
                              />
                              {getPhaseLabel(project.phase)}
                            </span>
                          </td>

                          {/* Budget */}
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                              {project.budget ? formatCurrency(project.budget) : '--'}
                            </p>
                          </td>

                          {/* Surface */}
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <p style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                              {formatSurface(project.surface_m2)}
                            </p>
                          </td>

                          {/* Période */}
                          <td style={{ padding: '16px 20px' }}>
                            {project.start_date ? (
                              <div>
                                <p style={{ fontSize: '0.8125rem', color: '#374151' }}>
                                  {formatDate(project.start_date)}
                                </p>
                                {project.end_date && (
                                  <div className="flex items-center gap-1.5" style={{ marginTop: '2px' }}>
                                    <span style={{ fontSize: '0.6875rem', color: '#d1d5db' }}>--</span>
                                    <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                                      {formatDate(project.end_date)}
                                    </span>
                                    {deadline && (
                                      <span
                                        style={{
                                          fontSize: '0.5625rem',
                                          fontWeight: 600,
                                          padding: '1px 6px',
                                          borderRadius: '8px',
                                          backgroundColor: deadline.urgent ? '#fef2f2' : '#f0fdf4',
                                          color: deadline.urgent ? '#dc2626' : '#16a34a',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {deadline.text}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8125rem', color: '#d1d5db' }}>--</span>
                            )}
                          </td>

                          {/* Statut */}
                          <td style={{ padding: '16px 20px' }}>
                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '50%',
                                  backgroundColor: getStatusDot(project.status),
                                }}
                              />
                              <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                                {getStatusLabel(project.status)}
                              </span>
                            </div>
                          </td>

                          {/* Progress */}
                          <td style={{ padding: '16px 20px' }}>
                            <div className="flex items-center gap-2.5">
                              <div
                                style={{
                                  flex: 1,
                                  height: '6px',
                                  borderRadius: '10px',
                                  backgroundColor: '#f3f4f6',
                                  overflow: 'hidden',
                                  minWidth: '50px',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    borderRadius: '10px',
                                    width: `${progress}%`,
                                    background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}cc)`,
                                    transition: 'width 300ms ease',
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>
                                {progress}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards for list view */}
              <div className="md:hidden">
                {paginatedProjects.map((project, idx) => {
                  const progress = getProgressFromPhase(project.phase);
                  const phaseColor = getPhaseColorHex(project.phase);
                  const deadline = getDaysRemaining(project.end_date);
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      style={{
                        display: 'block',
                        padding: '16px 20px',
                        borderBottom: idx < paginatedProjects.length - 1 ? '1px solid #f3f4f6' : 'none',
                        textDecoration: 'none',
                        transition: 'background-color 150ms',
                      }}
                    >
                      <div className="flex items-start justify-between" style={{ marginBottom: '10px' }}>
                        <div className="flex items-start gap-3">
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              backgroundColor: `${phaseColor}12`,
                              flexShrink: 0,
                            }}
                          >
                            <Briefcase style={{ width: '16px', height: '16px', color: phaseColor }} />
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                              {project.name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                              {project.client?.name}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontFamily: 'ui-monospace, SFMono-Regular, monospace', color: '#9ca3af' }}>
                          {project.reference}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
                        <span
                          className="inline-flex items-center gap-1.5"
                          style={{
                            padding: '3px 8px',
                            borderRadius: '20px',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: phaseColor,
                            backgroundColor: `${phaseColor}12`,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: phaseColor,
                            }}
                          />
                          {getPhaseLabel(project.phase)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            style={{
                              display: 'inline-block',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: getStatusDot(project.status),
                            }}
                          />
                          <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        {deadline && (
                          <span
                            style={{
                              fontSize: '0.5625rem',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '8px',
                              backgroundColor: deadline.urgent ? '#fef2f2' : '#f0fdf4',
                              color: deadline.urgent ? '#dc2626' : '#16a34a',
                            }}
                          >
                            {deadline.text}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            style={{
                              width: '70px',
                              height: '5px',
                              borderRadius: '10px',
                              backgroundColor: '#f3f4f6',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                borderRadius: '10px',
                                width: `${progress}%`,
                                backgroundColor: phaseColor,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 600 }}>
                            {progress}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {project.surface_m2 && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {formatSurface(project.surface_m2)}
                            </span>
                          )}
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                            {project.budget ? formatCurrency(project.budget) : '--'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty state for list */
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: '80px 20px' }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  marginBottom: '24px',
                }}
              >
                <FolderKanban style={{ width: '36px', height: '36px', color: '#93c5fd' }} />
              </div>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Aucun projet trouvé
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', maxWidth: '380px', lineHeight: 1.6 }}>
                Aucun projet ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres ou créez un nouveau projet.
              </p>
              <div className="flex items-center gap-3" style={{ marginTop: '24px' }}>
                {(search || activeFiltersCount > 0) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                      setPhaseFilter('');
                      setClientFilter('');
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                <button
                  onClick={() => setShowNewModal(true)}
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    backgroundColor: '#2563EB',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  <Plus className="h-4 w-4" />
                  Créer un projet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* Pagination */}
      {/* ============================================ */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: '12px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              {' - '}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedProjects.length)}
            </span>
            {' sur '}
            <span style={{ fontWeight: 600, color: '#374151' }}>
              {sortedProjects.length}
            </span>
            {' projets'}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: currentPage === 1 ? '#f9fafb' : '#ffffff',
                color: currentPage === 1 ? '#d1d5db' : '#374151',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="flex items-center justify-center"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: currentPage === page ? '1px solid #2563EB' : '1px solid transparent',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  backgroundColor: currentPage === page ? '#2563EB' : 'transparent',
                  color: currentPage === page ? '#ffffff' : '#6b7280',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: currentPage === totalPages ? '#f9fafb' : '#ffffff',
                color: currentPage === totalPages ? '#d1d5db' : '#374151',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* New Project Modal */}
      {/* ============================================ */}
      {showNewModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 60 }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowNewModal(false)}
          />
          <div
            className="relative mx-4 w-full"
            style={{
              maxWidth: '560px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 10,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between"
              style={{
                borderBottom: '1px solid #f3f4f6',
                padding: '22px 24px',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
                  Nouveau projet
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
                  Créez un nouveau projet d'architecture
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5" style={{ padding: '24px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Nom du projet <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ex : Résidence Les Terrasses"
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 150ms',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  placeholder="Description du projet..."
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    outline: 'none',
                    resize: 'none',
                    transition: 'all 150ms',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Client + Phase row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Client
                  </label>
                  <select
                    value={newProject.client_id}
                    onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.8125rem',
                      color: '#374151',
                      outline: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="">Sélectionner</option>
                    {mockClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Phase initiale
                  </label>
                  <select
                    value={newProject.phase}
                    onChange={(e) => setNewProject({ ...newProject, phase: e.target.value as ProjectPhase })}
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.8125rem',
                      color: '#374151',
                      outline: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {PROJECT_PHASES.map((phase) => (
                      <option key={phase.key} value={phase.key}>
                        {phase.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget + Surface row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    <span className="flex items-center gap-1">
                      <Euro style={{ width: '13px', height: '13px' }} />
                      Budget (EUR)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    placeholder="250 000"
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 150ms',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    <span className="flex items-center gap-1">
                      <Ruler style={{ width: '13px', height: '13px' }} />
                      Surface (m²)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newProject.surface_m2}
                    onChange={(e) => setNewProject({ ...newProject, surface_m2: e.target.value })}
                    placeholder="200"
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 150ms',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  <span className="flex items-center gap-1">
                    <MapPin style={{ width: '13px', height: '13px' }} />
                    Adresse
                  </span>
                </label>
                <input
                  type="text"
                  value={newProject.address}
                  onChange={(e) => setNewProject({ ...newProject, address: e.target.value })}
                  placeholder="12 rue des Lilas, 69003 Lyon"
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 150ms',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    <span className="flex items-center gap-1">
                      <Calendar style={{ width: '13px', height: '13px' }} />
                      Date début
                    </span>
                  </label>
                  <input
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 150ms',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    <span className="flex items-center gap-1">
                      <Calendar style={{ width: '13px', height: '13px' }} />
                      Date fin
                    </span>
                  </label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 150ms',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3"
              style={{
                borderTop: '1px solid #f3f4f6',
                padding: '18px 24px',
              }}
            >
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
                className="inline-flex items-center gap-2"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: !newProject.name.trim() ? '#93c5fd' : '#2563EB',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: !newProject.name.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 150ms',
                  boxShadow: !newProject.name.trim() ? 'none' : '0 1px 3px rgba(37,99,235,0.3)',
                }}
                onMouseEnter={(e) => {
                  if (newProject.name.trim()) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newProject.name.trim()) {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                Créer le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
