'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Receipt,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Send,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PercentCircle,
  Euro,
  XCircle,
  Ban,
  CalendarClock,
  FileWarning,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { Invoice, InvoiceStatus } from '@/types';

// ============================================
// Mock Data (10 invoices with due_date & paid_amount)
// ============================================

interface MockInvoice extends Invoice {
  client_name: string;
  project_name: string;
}

const mockInvoices: MockInvoice[] = [
  {
    id: 'inv-001',
    quote_id: 'qt-001',
    project_id: 'proj-001',
    client_id: 'cl-001',
    client_name: 'Marie Dubois',
    project_name: 'Rénovation Haussmannien Paix',
    invoice_number: 'FA-2026-0001',
    status: 'paid',
    subtotal: 6450,
    tax_rate: 20,
    tax_amount: 1290,
    amount: 7740,
    due_date: '2026-01-15',
    paid_date: '2026-01-10',
    paid_amount: 7740,
    notes: 'Acompte 30% - Phase Esquisse',
    created_by: 'user-1',
    created_at: '2025-12-15T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'inv-002',
    quote_id: 'qt-003',
    project_id: 'proj-002',
    client_id: 'cl-002',
    client_name: 'Martin Immobilier SAS',
    project_name: 'Résidence Les Terrasses',
    invoice_number: 'FA-2026-0002',
    status: 'sent',
    subtotal: 55500,
    tax_rate: 20,
    tax_amount: 11100,
    amount: 66600,
    due_date: '2026-03-15',
    paid_date: null,
    paid_amount: 0,
    notes: 'Acompte 30% - Phase Esquisse/APS',
    created_by: 'user-1',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'inv-003',
    quote_id: null,
    project_id: 'proj-003',
    client_id: 'cl-004',
    client_name: 'Commune de Versailles',
    project_name: 'Médiathèque Versailles',
    invoice_number: 'FA-2026-0003',
    status: 'overdue',
    subtotal: 32000,
    tax_rate: 20,
    tax_amount: 6400,
    amount: 38400,
    due_date: '2026-01-31',
    paid_date: null,
    paid_amount: 0,
    notes: 'Phase PRO - Situation n°2',
    created_by: 'user-1',
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2025-12-20T10:00:00Z',
  },
  {
    id: 'inv-004',
    quote_id: 'qt-001',
    project_id: 'proj-001',
    client_id: 'cl-001',
    client_name: 'Marie Dubois',
    project_name: 'Rénovation Haussmannien Paix',
    invoice_number: 'FA-2026-0004',
    status: 'draft',
    subtotal: 8600,
    tax_rate: 20,
    tax_amount: 1720,
    amount: 10320,
    due_date: '2026-03-31',
    paid_date: null,
    paid_amount: 0,
    notes: 'Acompte 40% - Phase APS/APD',
    created_by: 'user-1',
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'inv-005',
    quote_id: null,
    project_id: 'proj-002',
    client_id: 'cl-002',
    client_name: 'Martin Immobilier SAS',
    project_name: 'Résidence Les Terrasses',
    invoice_number: 'FA-2026-0005',
    status: 'paid',
    subtotal: 37000,
    tax_rate: 20,
    tax_amount: 7400,
    amount: 44400,
    due_date: '2026-01-28',
    paid_date: '2026-01-25',
    paid_amount: 44400,
    notes: 'Phase DCE - Situation n°1',
    created_by: 'user-1',
    created_at: '2025-12-28T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'inv-006',
    quote_id: 'qt-005',
    project_id: 'proj-004',
    client_id: 'cl-005',
    client_name: 'Famille Lefèvre',
    project_name: 'Maison individuelle Yvelines',
    invoice_number: 'FA-2026-0006',
    status: 'paid',
    subtotal: 12500,
    tax_rate: 20,
    tax_amount: 2500,
    amount: 15000,
    due_date: '2025-11-30',
    paid_date: '2025-11-28',
    paid_amount: 15000,
    notes: 'Phase Esquisse complète',
    created_by: 'user-1',
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-11-28T10:00:00Z',
  },
  {
    id: 'inv-007',
    quote_id: null,
    project_id: 'proj-005',
    client_id: 'cl-006',
    client_name: 'SCI du Parc',
    project_name: 'Immeuble bureaux Nanterre',
    invoice_number: 'FA-2026-0007',
    status: 'overdue',
    subtotal: 18500,
    tax_rate: 20,
    tax_amount: 3700,
    amount: 22200,
    due_date: '2026-02-05',
    paid_date: null,
    paid_amount: 8000,
    notes: 'Phase APS - Acompte partiel reçu',
    created_by: 'user-1',
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'inv-008',
    quote_id: 'qt-008',
    project_id: 'proj-003',
    client_id: 'cl-004',
    client_name: 'Commune de Versailles',
    project_name: 'Médiathèque Versailles',
    invoice_number: 'FA-2026-0008',
    status: 'sent',
    subtotal: 24000,
    tax_rate: 20,
    tax_amount: 4800,
    amount: 28800,
    due_date: '2026-03-20',
    paid_date: null,
    paid_amount: 0,
    notes: 'Phase DCE - Situation n°1',
    created_by: 'user-1',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'inv-009',
    quote_id: null,
    project_id: 'proj-006',
    client_id: 'cl-007',
    client_name: 'Hôtel & Patrimoine SA',
    project_name: 'Réhabilitation Hôtel Marais',
    invoice_number: 'FA-2025-0042',
    status: 'paid',
    subtotal: 28000,
    tax_rate: 20,
    tax_amount: 5600,
    amount: 33600,
    due_date: '2025-10-15',
    paid_date: '2025-10-12',
    paid_amount: 33600,
    notes: 'Phase APD complète',
    created_by: 'user-1',
    created_at: '2025-09-10T10:00:00Z',
    updated_at: '2025-10-12T10:00:00Z',
  },
  {
    id: 'inv-010',
    quote_id: 'qt-010',
    project_id: 'proj-004',
    client_id: 'cl-005',
    client_name: 'Famille Lefèvre',
    project_name: 'Maison individuelle Yvelines',
    invoice_number: 'FA-2026-0009',
    status: 'cancelled',
    subtotal: 4200,
    tax_rate: 20,
    tax_amount: 840,
    amount: 5040,
    due_date: '2026-01-20',
    paid_date: null,
    paid_amount: 0,
    notes: 'Annulée - Modification périmètre mission',
    created_by: 'user-1',
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
];

// ============================================
// Helpers
// ============================================

function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
}

function getInvoiceStatusIcon(status: InvoiceStatus) {
  switch (status) {
    case 'paid':
      return CheckCircle;
    case 'overdue':
      return AlertCircle;
    case 'sent':
      return Clock;
    case 'cancelled':
      return Ban;
    default:
      return FileText;
  }
}

function getStatusInlineStyles(status: InvoiceStatus): React.CSSProperties {
  switch (status) {
    case 'paid':
      return { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' };
    case 'sent':
      return { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' };
    case 'overdue':
      return { backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' };
    case 'cancelled':
      return { backgroundColor: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' };
    case 'draft':
    default:
      return { backgroundColor: '#f9fafb', color: '#4b5563', borderColor: '#e5e7eb' };
  }
}

function isOverdue(invoice: MockInvoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') return false;
  if (!invoice.due_date) return false;
  return new Date(invoice.due_date) < new Date();
}

function daysOverdue(invoice: MockInvoice): number {
  if (!invoice.due_date) return 0;
  const diff = new Date().getTime() - new Date(invoice.due_date).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ============================================
// Sparkline Mini Chart Component
// ============================================

function SparklineSVG({ data, color, height = 32, width = 80 }: { data: number[]; color: string; height?: number; width?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const areaPoints = [
    `0,${height}`,
    ...points,
    `${width},${height}`,
  ].join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// ============================================
// Monthly Revenue Bar Chart
// ============================================

function MonthlyRevenueChart({ invoices }: { invoices: MockInvoice[] }) {
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: d.getMonth(), year: d.getFullYear() };
  });

  const monthlyData = months.map(({ month, year }) => {
    const total = invoices
      .filter((inv) => {
        if (inv.status !== 'paid' || !inv.paid_date) return false;
        const pd = new Date(inv.paid_date);
        return pd.getMonth() === month && pd.getFullYear() === year;
      })
      .reduce((sum, inv) => sum + inv.paid_amount, 0);
    return { label: monthNames[month], total, month, year };
  });

  const maxVal = Math.max(...monthlyData.map((d) => d.total), 1);
  const barHeight = 100;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px 24px',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            Chiffre d'affaires mensuel
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            6 derniers mois (factures encaissées)
          </p>
        </div>
        <div
          className="flex items-center gap-1"
          style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          <Euro style={{ width: '12px', height: '12px' }} />
          EUR HT
        </div>
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height: `${barHeight + 24}px` }}>
        {monthlyData.map((d, i) => {
          const h = maxVal > 0 ? (d.total / maxVal) * barHeight : 0;
          const isCurrentMonth = d.month === now.getMonth() && d.year === now.getFullYear();
          return (
            <div key={i} className="flex flex-col items-center" style={{ flex: 1 }}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                {d.total > 0 && (
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {(d.total / 1000).toFixed(0)}k
                  </p>
                )}
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: '40px',
                  height: `${Math.max(h, 4)}px`,
                  backgroundColor: isCurrentMonth ? '#2563EB' : '#bfdbfe',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.5s ease, background-color 0.3s ease',
                  cursor: 'pointer',
                }}
                title={`${d.label} : ${formatCurrency(d.total)}`}
              />
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: isCurrentMonth ? 700 : 500,
                  color: isCurrentMonth ? '#2563EB' : '#9ca3af',
                  marginTop: '6px',
                }}
              >
                {d.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Payment Progress Bar
// ============================================

function PaymentProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
  let barColor = '#d1d5db';
  if (pct === 100) barColor = '#10b981';
  else if (pct > 0) barColor = '#f59e0b';

  return (
    <div className="flex items-center gap-2" style={{ minWidth: '100px' }}>
      <div
        style={{
          flex: 1,
          height: '6px',
          backgroundColor: '#f3f4f6',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '3px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, minWidth: '32px', textAlign: 'right' }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

// ============================================
// Filter Tabs
// ============================================

type FilterTab = 'all' | InvoiceStatus;

const FILTER_TABS: { key: FilterTab; label: string; dotColor?: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'draft', label: 'Brouillon', dotColor: '#9ca3af' },
  { key: 'sent', label: 'Envoyées', dotColor: '#3b82f6' },
  { key: 'paid', label: 'Payées', dotColor: '#10b981' },
  { key: 'overdue', label: 'En retard', dotColor: '#ef4444' },
  { key: 'cancelled', label: 'Annulées', dotColor: '#6b7280' },
];

// ============================================
// Sort Config
// ============================================

type SortField = 'date' | 'amount' | 'status' | 'client' | 'due_date';
type SortDir = 'asc' | 'desc';

const STATUS_ORDER: Record<InvoiceStatus, number> = {
  overdue: 0,
  sent: 1,
  draft: 2,
  paid: 3,
  cancelled: 4,
};

// ============================================
// Component
// ============================================

export default function InvoicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // ---- KPI Computations ----

  const totalRevenue = useMemo(() => {
    return mockInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.paid_amount, 0);
  }, []);

  const totalPending = useMemo(() => {
    return mockInvoices
      .filter((inv) => inv.status === 'sent')
      .reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);
  }, []);

  const totalOverdue = useMemo(() => {
    return mockInvoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);
  }, []);

  const recoveryRate = useMemo(() => {
    const totalBillable = mockInvoices
      .filter((inv) => inv.status !== 'cancelled' && inv.status !== 'draft')
      .reduce((sum, inv) => sum + inv.amount, 0);
    if (totalBillable === 0) return 0;
    const totalPaid = mockInvoices
      .filter((inv) => inv.status !== 'cancelled' && inv.status !== 'draft')
      .reduce((sum, inv) => sum + inv.paid_amount, 0);
    return (totalPaid / totalBillable) * 100;
  }, []);

  // Sparkline data (simulated last 6 data points for trend)
  const revenueSparkline = [18200, 22400, 33600, 15000, 52140, 0];
  const pendingSparkline = [42000, 55000, 38000, 66600, 72000, 95400];
  const overdueSparkline = [0, 12000, 5000, 0, 38400, 60600];
  const recoverySparkline = [72, 68, 81, 75, 70, recoveryRate];

  // ---- Filtered + Sorted Invoices ----

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockInvoices.length };
    for (const inv of mockInvoices) {
      counts[inv.status] = (counts[inv.status] || 0) + 1;
    }
    return counts;
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir(field === 'amount' ? 'desc' : 'asc');
      }
    },
    [sortField],
  );

  const filteredInvoices = useMemo(() => {
    let list = mockInvoices.filter((inv) => {
      const matchSearch =
        !search ||
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
        inv.project_name.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || inv.status === activeTab;
      return matchSearch && matchTab;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'due_date':
          cmp = new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime();
          break;
        case 'amount':
          cmp = a.amount - b.amount;
          break;
        case 'status':
          cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          break;
        case 'client':
          cmp = a.client_name.localeCompare(b.client_name, 'fr');
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [search, activeTab, sortField, sortDir]);

  // ---- Render Helpers ----

  function SortableHeader({ label, field, align }: { label: string; field: SortField; align?: 'left' | 'right' }) {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        style={{
          padding: '12px 20px',
          textAlign: align || 'left',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
          color: isActive ? '#2563EB' : '#6b7280',
          cursor: 'pointer',
          userSelect: 'none' as const,
          whiteSpace: 'nowrap' as const,
          transition: 'color 0.15s ease',
        }}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {isActive ? (
            sortDir === 'asc' ? (
              <ArrowUp style={{ width: '12px', height: '12px' }} />
            ) : (
              <ArrowDown style={{ width: '12px', height: '12px' }} />
            )
          ) : (
            <ArrowUpDown style={{ width: '12px', height: '12px', opacity: 0.4 }} />
          )}
        </span>
      </th>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Facturation</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Suivi de vos factures par phase MOP et encaissements
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/invoices/new')}
          className="inline-flex items-center gap-2"
          style={{
            backgroundColor: '#2563EB',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Nouvelle facture
        </button>
      </div>

      {/* ===== 4 KPI Cards with Sparklines ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CA Total (paid) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Chiffre d'affaires
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                <TrendingUp style={{ width: '14px', height: '14px', color: '#10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>+12,3%</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>vs mois dernier</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Euro style={{ width: '20px', height: '20px', color: '#10b981' }} />
              </div>
              <SparklineSVG data={revenueSparkline} color="#10b981" />
            </div>
          </div>
        </div>

        {/* En attente */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En attente
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                {formatCurrency(totalPending)}
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                <Clock style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>
                  {tabCounts['sent'] || 0} facture{(tabCounts['sent'] || 0) > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
              <SparklineSVG data={pendingSparkline} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* En retard */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '20px',
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En retard
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#b91c1c', marginTop: '4px' }}>
                {formatCurrency(totalOverdue)}
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                <AlertCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>
                  {tabCounts['overdue'] || 0} facture{(tabCounts['overdue'] || 0) > 1 ? 's' : ''} à relancer
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileWarning style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              </div>
              <SparklineSVG data={overdueSparkline} color="#ef4444" />
            </div>
          </div>
        </div>

        {/* Taux de recouvrement */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Taux de recouvrement
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                {recoveryRate.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                {recoveryRate >= 70 ? (
                  <>
                    <TrendingUp style={{ width: '14px', height: '14px', color: '#10b981' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>Bon</span>
                  </>
                ) : (
                  <>
                    <TrendingDown style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>À améliorer</span>
                  </>
                )}
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>objectif 85%</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PercentCircle style={{ width: '20px', height: '20px', color: '#2563EB' }} />
              </div>
              <SparklineSVG data={recoverySparkline} color="#2563EB" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Monthly Revenue Chart ===== */}
      <MonthlyRevenueChart invoices={mockInvoices} />

      {/* ===== Search Bar ===== */}
      <div style={{ position: 'relative' }}>
        <Search
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#9ca3af',
          }}
        />
        <input
          type="text"
          placeholder="Rechercher par n° facture, client, projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 16px 11px 42px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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

      {/* ===== Filter Tabs with Count Badges ===== */}
      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        <nav className="flex gap-0" style={{ marginBottom: '-1px', overflowX: 'auto' }}>
          {FILTER_TABS.map((tab) => {
            const count = tabCounts[tab.key] || 0;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2"
                style={{
                  padding: '12px 18px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: `2px solid ${isActive ? '#2563EB' : 'transparent'}`,
                  color: isActive ? '#2563EB' : '#6b7280',
                  background: 'none',
                  border: 'none',
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: isActive ? '#2563EB' : 'transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderBottomColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }
                }}
              >
                {tab.dotColor && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: tab.dotColor,
                    }}
                  />
                )}
                {tab.label}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#eff6ff' : '#f3f4f6',
                    color: isActive ? '#2563EB' : '#6b7280',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===== Data Table ===== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Desktop Table */}
        <div className="hidden md:block" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                <SortableHeader label="N° Facture" field="date" />
                <SortableHeader label="Client / Projet" field="client" />
                <SortableHeader label="Montant TTC" field="amount" align="right" />
                <th
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                  }}
                >
                  Paiement
                </th>
                <SortableHeader label="Statut" field="status" />
                <SortableHeader label="Échéance" field="due_date" />
                <th
                  style={{
                    padding: '12px 20px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getInvoiceStatusIcon(invoice.status);
                const statusStyles = getStatusInlineStyles(invoice.status);
                const overdue = isOverdue(invoice);
                const overdueDays = daysOverdue(invoice);
                const isHovered = hoveredRow === invoice.id;

                return (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom: '1px solid #f9fafb',
                      backgroundColor: isHovered
                        ? overdue
                          ? '#fef2f2'
                          : '#f8fafc'
                        : overdue && invoice.status !== 'overdue'
                          ? '#fffbeb08'
                          : 'transparent',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredRow(invoice.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
                  >
                    {/* N Facture */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: '#111827',
                          }}
                        >
                          {invoice.invoice_number}
                        </span>
                        {overdue && invoice.status !== 'overdue' && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '10px',
                              fontWeight: 600,
                              color: '#ef4444',
                              backgroundColor: '#fef2f2',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #fecaca',
                            }}
                          >
                            <AlertCircle style={{ width: '10px', height: '10px' }} />
                            Retard
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Client / Project */}
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {invoice.client_name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {invoice.project_name}
                      </p>
                    </td>

                    {/* Montant TTC */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                        {formatCurrency(invoice.amount)}
                      </p>
                      {invoice.paid_amount > 0 && invoice.paid_amount < invoice.amount && (
                        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                          Reçu : {formatCurrency(invoice.paid_amount)}
                        </p>
                      )}
                    </td>

                    {/* Payment Progress */}
                    <td style={{ padding: '14px 20px' }}>
                      <PaymentProgressBar paid={invoice.paid_amount} total={invoice.amount} />
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{
                          ...statusStyles,
                          border: `1px solid ${statusStyles.borderColor}`,
                          borderRadius: '20px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <StatusIcon style={{ width: '12px', height: '12px' }} />
                        {getInvoiceStatusLabel(invoice.status)}
                      </span>
                      {invoice.status === 'overdue' && (
                        <p style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
                          {overdueDays} jour{overdueDays > 1 ? 's' : ''} de retard
                        </p>
                      )}
                    </td>

                    {/* Echeance */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-1.5">
                        {overdue && (
                          <CalendarClock style={{ width: '13px', height: '13px', color: '#ef4444' }} />
                        )}
                        <span
                          style={{
                            fontSize: '13px',
                            color: overdue ? '#ef4444' : '#374151',
                            fontWeight: overdue ? 600 : 400,
                          }}
                        >
                          {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                        </span>
                      </div>
                      {invoice.paid_date && (
                        <p style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                          Payé le {formatDate(invoice.paid_date)}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div
                        className="flex items-center justify-end gap-1"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/invoices/${invoice.id}`);
                          }}
                          title="Voir la facture"
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                            e.currentTarget.style.borderColor = '#bfdbfe';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px', color: '#2563EB' }} />
                        </button>
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Relance envoyée pour ${invoice.invoice_number}`);
                            }}
                            title="Relancer le client"
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fffbeb';
                              e.currentTarget.style.borderColor = '#fde68a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            <Send style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Téléchargement PDF : ${invoice.invoice_number}`);
                          }}
                          title="Télécharger le PDF"
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }}
                        >
                          <Download style={{ width: '14px', height: '14px', color: '#374151' }} />
                        </button>
                      </div>
                      {/* Fallback for non-hover (e.g. touch) */}
                      {!isHovered && (
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#2563EB',
                            textDecoration: 'none',
                          }}
                        >
                          Voir
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden" style={{ borderTop: '1px solid #f3f4f6' }}>
          {filteredInvoices.map((invoice) => {
            const StatusIcon = getInvoiceStatusIcon(invoice.status);
            const statusStyles = getStatusInlineStyles(invoice.status);
            const overdue = isOverdue(invoice);
            const overdueDays = daysOverdue(invoice);

            return (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {/* Top row: number + amount */}
                <div className="flex items-start justify-between" style={{ marginBottom: '8px' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        style={{
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {invoice.invoice_number}
                      </p>
                      {overdue && invoice.status !== 'overdue' && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            padding: '1px 5px',
                            borderRadius: '3px',
                          }}
                        >
                          RETARD
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {invoice.client_name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                      {invoice.project_name}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                      {formatCurrency(invoice.amount)}
                    </p>
                    {invoice.paid_amount > 0 && invoice.paid_amount < invoice.amount && (
                      <p style={{ fontSize: '10px', color: '#6b7280' }}>
                        Reçu : {formatCurrency(invoice.paid_amount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment progress */}
                <div style={{ marginBottom: '8px' }}>
                  <PaymentProgressBar paid={invoice.paid_amount} total={invoice.amount} />
                </div>

                {/* Bottom row: status + date */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1"
                    style={{
                      ...statusStyles,
                      border: `1px solid ${statusStyles.borderColor}`,
                      borderRadius: '20px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    <StatusIcon style={{ width: '11px', height: '11px' }} />
                    {getInvoiceStatusLabel(invoice.status)}
                    {invoice.status === 'overdue' && (
                      <span style={{ marginLeft: '2px' }}>({overdueDays}j)</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    {overdue && (
                      <CalendarClock style={{ width: '12px', height: '12px', color: '#ef4444' }} />
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        color: overdue ? '#ef4444' : '#9ca3af',
                        fontWeight: overdue ? 600 : 400,
                      }}
                    >
                      Éch. {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                    </span>
                  </div>
                </div>

                {/* Mobile quick actions */}
                <div className="flex items-center gap-2" style={{ marginTop: '10px' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert(`Téléchargement PDF : ${invoice.invoice_number}`);
                    }}
                    className="flex items-center gap-1"
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#374151',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Download style={{ width: '11px', height: '11px' }} />
                    PDF
                  </button>
                  {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`Relance envoyée pour ${invoice.invoice_number}`);
                      }}
                      className="flex items-center gap-1"
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#f59e0b',
                        backgroundColor: '#fffbeb',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Send style={{ width: '11px', height: '11px' }} />
                      Relancer
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ===== Empty State ===== */}
        {filteredInvoices.length === 0 && (
          <div className="flex flex-col items-center justify-center" style={{ padding: '64px 20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Receipt style={{ width: '28px', height: '28px', color: '#9ca3af' }} />
            </div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Aucune facture trouvée
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px', textAlign: 'center', maxWidth: '360px' }}>
              {search
                ? `Aucun résultat pour "${search}". Essayez un autre terme de recherche.`
                : activeTab !== 'all'
                  ? `Aucune facture avec le statut "${FILTER_TABS.find((t) => t.key === activeTab)?.label}".`
                  : 'Commencez par créer votre première facture pour suivre vos encaissements.'}
            </p>
            {!search && activeTab === 'all' && (
              <button
                onClick={() => router.push('/dashboard/invoices/new')}
                className="inline-flex items-center gap-2"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Créer une facture
              </button>
            )}
            {(search || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveTab('all');
                }}
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2563EB',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===== Summary Footer ===== */}
      {filteredInvoices.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ padding: '0 4px' }}>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''} affichée{filteredInvoices.length > 1 ? 's' : ''}
            {activeTab !== 'all' && (
              <span> - filtre : {FILTER_TABS.find((t) => t.key === activeTab)?.label}</span>
            )}
          </p>
          <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
            Total affiché : {formatCurrency(filteredInvoices.reduce((s, inv) => s + inv.amount, 0))}
          </p>
        </div>
      )}
    </div>
  );
}
