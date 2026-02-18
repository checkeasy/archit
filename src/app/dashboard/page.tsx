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
import { PROJECT_PHASES } from '@/lib/constants';
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
    name: 'Résidence Les Terrasses',
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
    description: 'Extension et rénovation maison individuelle',
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
    description: 'Aménagement bureaux open-space 600m2',
    reference: 'PRJ-00010',
    client_id: 'c3',
    client: { name: 'Nextech SAS' },
    status: 'active' as ProjectStatus,
    phase: 'pro' as ProjectPhase,
    budget: 195000,
    surface_m2: 600,
    address: '45 avenue de la République',
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
    description: 'Rénovation complète + mise aux normes ERP',
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
    name: 'École Montessori Les Petits Chênes',
    description: 'Construction école maternelle 6 classes',
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
    action: 'a mis à jour le bordereau DCE',
    details: 'Résidence Les Terrasses',
    entity_type: 'document',
    entity_id: 'd1',
    created_at: '2026-02-18T09:45:00',
  },
  {
    id: 'a2',
    user_id: 'u2',
    user: { full_name: 'Marie Lefèvre' },
    project_id: '2',
    action: 'a ajouté un commentaire sur',
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
    action: 'a importé les plans PRO de',
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
    action: 'a créé une facture pour',
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
    action: 'a validé la phase PRO de',
    details: 'Résidence Les Terrasses',
    entity_type: 'project',
    entity_id: '1',
    created_at: '2026-02-17T10:20:00',
  },
  {
    id: 'a6',
    user_id: 'u2',
    user: { full_name: 'Marie Lefèvre' },
    project_id: '5',
    action: 'a déposé le permis de construire pour',
    details: 'École Montessori Les Petits Chênes',
    entity_type: 'permit',
    entity_id: 'p1',
    created_at: '2026-02-16T16:45:00',
  },
];

// ============================================
// Sparkline & Chart Data
// ============================================

const sparklineData = {
  projets: [8, 9, 9, 10, 10, 11, 12],
  clients: [28, 29, 30, 31, 32, 33, 34],
  factures: [3, 5, 4, 6, 5, 4, 5],
  chiffre: [22000, 24500, 25000, 23000, 26000, 27500, 28400],
};

const revenueData = [
  { month: 'Sep 2025', amount: 18500 },
  { month: 'Oct 2025', amount: 22300 },
  { month: 'Nov 2025', amount: 24800 },
  { month: 'Dec 2025', amount: 19200 },
  { month: 'Jan 2026', amount: 26100 },
  { month: 'Fév 2026', amount: 28400 },
];

const phaseDistribution = [
  { key: 'esquisse', count: 1 },
  { key: 'aps', count: 1 },
  { key: 'apd', count: 1 },
  { key: 'pro', count: 1 },
  { key: 'dce', count: 1 },
  { key: 'act', count: 1 },
  { key: 'visa', count: 1 },
  { key: 'det', count: 1 },
  { key: 'delivered', count: 1 },
  { key: 'prospect', count: 1 },
];

// ============================================
// Helper: create SVG sparkline path
// ============================================
function createSparklinePath(data: number[], width: number, height: number): string {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const usableHeight = height - padding * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * stepX;
    const y = padding + usableHeight - ((value - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return points.join(' ');
}

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
// Helper: phase color (Tailwind classes)
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
// Helper: get phase hex color from constants
// ============================================
function getPhaseHexColor(phaseKey: string): string {
  const found = PROJECT_PHASES.find((p) => p.key === phaseKey);
  return found ? found.color : '#94a3b8';
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
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
}

// ============================================
// Sub-component: Sparkline SVG
// ============================================
function Sparkline({
  data,
  color,
  width = 100,
  height = 32,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const points = createSparklinePath(data, width, height);
  // Create area fill path
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const usableHeight = height - padding * 2;
  const stepX = width / (data.length - 1);

  const areaPoints = data.map((value, index) => {
    const x = index * stepX;
    const y = padding + usableHeight - ((value - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const areaPath = `M0,${height} L${areaPoints.join(' L')} L${width},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================
// Component
// ============================================
export default function DashboardPage() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.amount));
  const maxPhaseCount = Math.max(...phaseDistribution.map((d) => d.count));

  const kpiCards = [
    {
      label: 'Projets actifs',
      value: mockStats.activeProjects.toString(),
      icon: FolderKanban,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      change: '+2 ce mois',
      changeColor: '#16a34a',
      sparkData: sparklineData.projets,
      sparkColor: '#2563EB',
    },
    {
      label: 'Clients',
      value: mockStats.totalClients.toString(),
      icon: Users,
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      change: '+3 ce mois',
      changeColor: '#16a34a',
      sparkData: sparklineData.clients,
      sparkColor: '#059669',
    },
    {
      label: 'Factures en attente',
      value: mockStats.pendingInvoices.toString(),
      subValue: formatCurrency(mockStats.pendingAmount),
      icon: Receipt,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      change: null,
      changeColor: '#D97706',
      sparkData: sparklineData.factures,
      sparkColor: '#D97706',
    },
    {
      label: 'Chiffre du mois',
      value: formatCurrency(mockStats.monthlyRevenue),
      icon: TrendingUp,
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      change: '+12% vs mois dernier',
      changeColor: '#16a34a',
      sparkData: sparklineData.chiffre,
      sparkColor: '#059669',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue, Jean. Voici un aperçu de votre activité.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            Nouveau client
          </Link>
          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <div className="flex items-start justify-between">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '6px' }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    {card.value}
                  </p>
                  {card.subValue && (
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#4b5563', marginTop: '4px' }}>
                      {card.subValue}
                    </p>
                  )}
                  {card.change && (
                    <p style={{ fontSize: '12px', color: card.changeColor, fontWeight: 500, marginTop: '6px' }}>
                      {card.change}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: card.iconColor }} />
                  </div>
                  <Sparkline data={card.sparkData} color={card.sparkColor} width={100} height={32} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart + Phase Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Bar Chart */}
        <div
          className="lg:col-span-2"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Chiffre d&apos;affaires mensuel
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>6 derniers mois</p>
          </div>
          <div className="space-y-3">
            {revenueData.map((item) => {
              const barWidth = (item.amount / maxRevenue) * 100;
              return (
                <div key={item.month} className="flex items-center gap-3">
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#6b7280',
                      width: '72px',
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    {item.month.replace('2025', '25').replace('2026', '26')}
                  </p>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        backgroundColor: '#F3F4F6',
                        borderRadius: '6px',
                        height: '28px',
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#2563EB',
                          height: '100%',
                          width: `${barWidth}%`,
                          borderRadius: '6px',
                          transition: 'width 0.6s ease',
                          minWidth: '4px',
                        }}
                      />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#111827',
                      width: '80px',
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Total période : <span style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(revenueData.reduce((s, d) => s + d.amount, 0))}</span>
            </p>
            <p style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500 }}>
              +12% vs période précédente
            </p>
          </div>
        </div>

        {/* Phase Distribution */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
            Répartition par phase
          </h2>
          <div className="space-y-2">
            {phaseDistribution.map((item) => {
              const barWidth = (item.count / maxPhaseCount) * 100;
              const color = getPhaseHexColor(item.key);
              return (
                <div key={item.key} className="flex items-center gap-2">
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#4b5563',
                      width: '60px',
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    {getPhaseLabel(item.key)}
                  </p>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        height: '22px',
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: color,
                          height: '100%',
                          width: `${barWidth}%`,
                          borderRadius: '4px',
                          transition: 'width 0.6s ease',
                          minWidth: '4px',
                        }}
                      />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#111827',
                      width: '24px',
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    {item.count}
                  </p>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Total : <span style={{ fontWeight: 600, color: '#111827' }}>{phaseDistribution.reduce((s, d) => s + d.count, 0)} projets</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Projects + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Projets récents</h2>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
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
            <h2 className="text-base font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {mockActivities.map((activity) => {
              const Icon = getActivityIcon(activity.action);
              return (
                <div key={activity.id} className="flex gap-3 px-5 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary text-xs font-semibold">
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
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Voir toute l&apos;activité
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900">Échéances à venir</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
              22<br />Fev
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dépôt PC - École Montessori</p>
              <p className="text-xs text-gray-500">Dans 4 jours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
              28<br />Fev
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Rendu DCE - Résidence Les Terrasses</p>
              <p className="text-xs text-gray-500">Dans 10 jours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
              05<br />Mar
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Réunion chantier - Restaurant</p>
              <p className="text-xs text-gray-500">Dans 15 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
