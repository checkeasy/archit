'use client';

import Link from 'next/link';
import {
  FolderKanban,
  Users,
  Receipt,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { formatCurrency, getPhaseLabel, getStatusColor, getInitials } from '@/lib/utils';
import type { Project, DashboardStats, ActivityLog, ProjectPhase, ProjectStatus } from '@/types';

// ============================================
// Mock Data
// ============================================

const mockStats: DashboardStats = {
  activeProjects: 12,
  totalClients: 34,
  pendingInvoices: 5,
  pendingAmount: 47850,
  monthlyRevenue: 28400,
  upcomingDeadlines: 3,
};

const mockProjects: Array<Omit<Project, 'client'> & { client?: { name: string } }> = [
  {
    id: '1',
    name: 'Residence Les Terrasses',
    description: 'Construction neuve R+3, 24 logements collectifs',
    reference: 'PRJ-00012',
    client_id: 'c1',
    client: { name: 'SCI Les Terrasses' },
    status: 'active' as ProjectStatus,
    phase: 'dce' as ProjectPhase,
    budget: 320000,
    surface_m2: 2400,
    address: '12 rue des Lilas',
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
    status: 'active' as ProjectStatus,
    phase: 'apd' as ProjectPhase,
    budget: 85000,
    surface_m2: 180,
    address: '8 chemin du Parc',
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
    status: 'active' as ProjectStatus,
    phase: 'pro' as ProjectPhase,
    budget: 195000,
    surface_m2: 600,
    address: '45 avenue de la Republique',
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
    status: 'active' as ProjectStatus,
    phase: 'act' as ProjectPhase,
    budget: 145000,
    surface_m2: 280,
    address: '3 place Bellecour',
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
    status: 'on_hold' as ProjectStatus,
    phase: 'esquisse' as ProjectPhase,
    budget: 520000,
    surface_m2: 1200,
    address: '22 rue Jean Moulin',
    city: 'Caluire-et-Cuire',
    postal_code: '69300',
    start_date: '2026-01-15',
    end_date: '2027-09-01',
    created_by: 'u1',
    created_at: '2026-01-15',
    updated_at: '2026-02-08',
  },
];

const mockActivities: Array<Omit<ActivityLog, 'user'> & { user?: { full_name: string } }> = [
  {
    id: 'a1',
    user_id: 'u1',
    user: { full_name: 'Jean Dupont' },
    project_id: '1',
    action: 'a mis a jour le bordereau DCE',
    details: 'Residence Les Terrasses',
    entity_type: 'document',
    entity_id: 'd1',
    created_at: '2026-02-18T09:45:00',
  },
  {
    id: 'a2',
    user_id: 'u2',
    user: { full_name: 'Marie Lefevre' },
    project_id: '2',
    action: 'a ajoute un commentaire sur',
    details: 'Maison Martin',
    entity_type: 'comment',
    entity_id: 'cm1',
    created_at: '2026-02-18T08:30:00',
  },
  {
    id: 'a3',
    user_id: 'u1',
    user: { full_name: 'Jean Dupont' },
    project_id: '3',
    action: 'a importe les plans PRO de',
    details: 'Bureaux Nextech',
    entity_type: 'document',
    entity_id: 'd2',
    created_at: '2026-02-17T17:15:00',
  },
  {
    id: 'a4',
    user_id: 'u3',
    user: { full_name: 'Sophie Bernard' },
    project_id: '4',
    action: 'a cree une facture pour',
    details: 'Restaurant Le Comptoir',
    entity_type: 'invoice',
    entity_id: 'inv1',
    created_at: '2026-02-17T14:00:00',
  },
  {
    id: 'a5',
    user_id: 'u1',
    user: { full_name: 'Jean Dupont' },
    project_id: '1',
    action: 'a valide la phase PRO de',
    details: 'Residence Les Terrasses',
    entity_type: 'project',
    entity_id: '1',
    created_at: '2026-02-17T10:20:00',
  },
  {
    id: 'a6',
    user_id: 'u2',
    user: { full_name: 'Marie Lefevre' },
    project_id: '5',
    action: 'a depose le permis de construire pour',
    details: 'Ecole Montessori Les Petits Chenes',
    entity_type: 'permit',
    entity_id: 'p1',
    created_at: '2026-02-16T16:45:00',
  },
];

// ============================================
// Helper: relative time in French
// ============================================
function timeAgo(dateStr: string): string {
  const now = new Date('2026-02-18T10:00:00');
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays} jours`;
}

// ============================================
// Helper: phase color
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

// ============================================
// Helper: activity icon
// ============================================
function getActivityIcon(action: string) {
  if (action.includes('facture')) return Receipt;
  if (action.includes('commentaire')) return MessageSquare;
  if (action.includes('importe') || action.includes('document')) return Upload;
  if (action.includes('valide')) return CheckCircle2;
  if (action.includes('permis')) return FileText;
  return Clock;
}

// ============================================
// Helper: status label
// ============================================
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Termine',
    cancelled: 'Annule',
  };
  return labels[status] || status;
}

// ============================================
// Component
// ============================================
export default function DashboardPage() {
  const kpiCards = [
    {
      label: 'Projets actifs',
      value: mockStats.activeProjects.toString(),
      icon: FolderKanban,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      change: '+2 ce mois',
    },
    {
      label: 'Clients',
      value: mockStats.totalClients.toString(),
      icon: Users,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      change: '+3 ce mois',
    },
    {
      label: 'Factures en attente',
      value: mockStats.pendingInvoices.toString(),
      subValue: formatCurrency(mockStats.pendingAmount),
      icon: Receipt,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
      change: null,
    },
    {
      label: 'Chiffre du mois',
      value: formatCurrency(mockStats.monthlyRevenue),
      icon: TrendingUp,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      change: '+12% vs mois dernier',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue, Jean. Voici un apercu de votre activite.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            Nouveau client
          </Link>
          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Nouveau devis
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  {card.subValue && (
                    <p className="text-sm font-medium text-gray-600">{card.subValue}</p>
                  )}
                  {card.change && (
                    <p className="text-xs text-gray-400">{card.change}</p>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.accentBg}`}>
                  <Icon className={`h-5 w-5 ${card.accentText}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Projects + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Projets recents</h2>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Projet
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Phase
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/dashboard/projects/${project.id}`} className="block">
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.reference}</p>
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
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {project.budget ? formatCurrency(project.budget) : '--'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {mockProjects.map((project) => (
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
                  <p className="text-sm font-medium text-gray-900">
                    {project.budget ? formatCurrency(project.budget) : '--'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Activite recente</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {mockActivities.map((activity) => {
              const Icon = getActivityIcon(activity.action);
              return (
                <div key={activity.id} className="flex gap-3 px-5 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
                    {getInitials(activity.user?.full_name || 'U')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">
                        {activity.user?.full_name}
                      </span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium text-gray-900">
                        {activity.details}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {timeAgo(activity.created_at)}
                    </p>
                  </div>
                  <Icon className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-100 px-5 py-3">
            <Link
              href="/dashboard/activity"
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
            >
              Voir toute l'activite
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900">Echeances a venir</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
              22<br />Fev
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Depot PC - Ecole Montessori</p>
              <p className="text-xs text-gray-500">Dans 4 jours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
              28<br />Fev
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Rendu DCE - Residence Les Terrasses</p>
              <p className="text-xs text-gray-500">Dans 10 jours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
              05<br />Mar
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reunion chantier - Restaurant</p>
              <p className="text-xs text-gray-500">Dans 15 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
