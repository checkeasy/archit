'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Euro,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Copy,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  FileX,
  Send,
  XCircle,
  CalendarClock,
} from 'lucide-react';
import type { QuoteStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// ============================================
// Constants
// ============================================

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  expired: 'Expiré',
};

const STATUS_ICONS: Record<QuoteStatus, React.ReactNode> = {
  draft: <FileText style={{ width: 12, height: 12 }} />,
  sent: <Send style={{ width: 12, height: 12 }} />,
  accepted: <CheckCircle2 style={{ width: 12, height: 12 }} />,
  rejected: <XCircle style={{ width: 12, height: 12 }} />,
  expired: <CalendarClock style={{ width: 12, height: 12 }} />,
};

const STATUS_STYLES: Record<QuoteStatus, { bg: string; color: string; border: string }> = {
  draft: { bg: '#F9FAFB', color: '#4B5563', border: '#E5E7EB' },
  sent: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  accepted: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
  rejected: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
  expired: { bg: '#F9FAFB', color: '#6B7280', border: '#D1D5DB' },
};

const FILTER_TABS: { key: QuoteStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'draft', label: 'Brouillon' },
  { key: 'sent', label: 'Envoyé' },
  { key: 'accepted', label: 'Accepté' },
  { key: 'rejected', label: 'Refusé' },
  { key: 'expired', label: 'Expiré' },
];

type SortField = 'created_at' | 'total' | 'status' | 'quote_number' | 'client';
type SortDirection = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_QUOTES: any[] = [
  {
    id: '1',
    project_id: 'p1',
    project: { name: 'Rénovation maison bourgeoise', id: 'p1', description: null, reference: null, client_id: 'c1', status: 'active', phase: 'apd', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c1',
    client: { name: 'Jean-Pierre Dumont', id: 'c1', email: null, phone: null, company: null, address: null, city: null, postal_code: null, notes: null, type: 'particulier', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00001',
    status: 'accepted' as QuoteStatus,
    subtotal: 45000,
    tax_rate: 20,
    tax_amount: 9000,
    total: 54000,
    valid_until: '2026-03-15',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2026-01-10',
    updated_at: '2026-01-10',
  },
  {
    id: '2',
    project_id: 'p2',
    project: { name: 'Extension villa contemporaine', id: 'p2', description: null, reference: null, client_id: 'c2', status: 'active', phase: 'esquisse', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c2',
    client: { name: 'Marie Lefèvre', id: 'c2', email: null, phone: null, company: null, address: null, city: null, postal_code: null, notes: null, type: 'particulier', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00002',
    status: 'sent' as QuoteStatus,
    subtotal: 32000,
    tax_rate: 20,
    tax_amount: 6400,
    total: 38400,
    valid_until: '2026-03-20',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2026-02-01',
    updated_at: '2026-02-01',
  },
  {
    id: '3',
    project_id: 'p3',
    project: { name: 'Aménagement bureaux startup', id: 'p3', description: null, reference: null, client_id: 'c3', status: 'active', phase: 'pro', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c3',
    client: { name: 'SCI Les Ateliers', id: 'c3', email: null, phone: null, company: 'SCI Les Ateliers', address: null, city: null, postal_code: null, notes: null, type: 'professionnel', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00003',
    status: 'draft' as QuoteStatus,
    subtotal: 18500,
    tax_rate: 20,
    tax_amount: 3700,
    total: 22200,
    valid_until: null,
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2026-02-10',
    updated_at: '2026-02-10',
  },
  {
    id: '4',
    project_id: 'p4',
    project: { name: 'Construction maison passive', id: 'p4', description: null, reference: null, client_id: 'c4', status: 'active', phase: 'dce', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c4',
    client: { name: 'Famille Bernard', id: 'c4', email: null, phone: null, company: null, address: null, city: null, postal_code: null, notes: null, type: 'particulier', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00004',
    status: 'accepted' as QuoteStatus,
    subtotal: 67000,
    tax_rate: 20,
    tax_amount: 13400,
    total: 80400,
    valid_until: '2026-02-28',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2025-12-15',
    updated_at: '2025-12-15',
  },
  {
    id: '5',
    project_id: null,
    client_id: 'c5',
    client: { name: 'Commune de Versailles', id: 'c5', email: null, phone: null, company: 'Commune de Versailles', address: null, city: null, postal_code: null, notes: null, type: 'public', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00005',
    status: 'rejected' as QuoteStatus,
    subtotal: 95000,
    tax_rate: 20,
    tax_amount: 19000,
    total: 114000,
    valid_until: '2026-01-31',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2025-11-20',
    updated_at: '2025-11-20',
  },
  {
    id: '6',
    project_id: 'p6',
    project: { name: 'Réhabilitation loft industriel', id: 'p6', description: null, reference: null, client_id: 'c6', status: 'active', phase: 'aps', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c6',
    client: { name: 'Antoine Moreau', id: 'c6', email: null, phone: null, company: null, address: null, city: null, postal_code: null, notes: null, type: 'particulier', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00006',
    status: 'sent' as QuoteStatus,
    subtotal: 28000,
    tax_rate: 20,
    tax_amount: 5600,
    total: 33600,
    valid_until: '2026-03-25',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2026-02-14',
    updated_at: '2026-02-14',
  },
  {
    id: '7',
    project_id: 'p7',
    project: { name: 'Surélévation immeuble haussmannien', id: 'p7', description: null, reference: null, client_id: 'c7', status: 'active', phase: 'esquisse', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c7',
    client: { name: 'Copropriété Rivoli', id: 'c7', email: null, phone: null, company: 'Copropriété Rivoli', address: null, city: null, postal_code: null, notes: null, type: 'professionnel', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00007',
    status: 'expired' as QuoteStatus,
    subtotal: 52000,
    tax_rate: 20,
    tax_amount: 10400,
    total: 62400,
    valid_until: '2026-01-15',
    notes: null,
    conditions: null,
    created_by: '',
    created_at: '2025-10-25',
    updated_at: '2025-10-25',
  },
];

// ============================================
// Helper functions
// ============================================

function isExpired(validUntil: string | null): boolean {
  if (!validUntil) return false;
  return new Date(validUntil) < new Date();
}

function daysUntilExpiry(validUntil: string | null): number | null {
  if (!validUntil) return null;
  const diff = new Date(validUntil).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const STATUS_SORT_ORDER: Record<QuoteStatus, number> = {
  sent: 0,
  draft: 1,
  accepted: 2,
  rejected: 3,
  expired: 4,
};

// ============================================
// Main Component
// ============================================

export default function QuotesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // ---------- Counts per status ----------
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_QUOTES.length };
    MOCK_QUOTES.forEach((q) => {
      counts[q.status] = (counts[q.status] || 0) + 1;
    });
    return counts;
  }, []);

  // ---------- KPI computations ----------
  const kpis = useMemo(() => {
    const totalCount = MOCK_QUOTES.length;
    const totalAmount = MOCK_QUOTES.reduce((sum, q) => sum + q.total, 0);
    const acceptedCount = MOCK_QUOTES.filter((q) => q.status === 'accepted').length;
    const decidedCount = MOCK_QUOTES.filter((q) => q.status === 'accepted' || q.status === 'rejected').length;
    const acceptanceRate = decidedCount > 0 ? Math.round((acceptedCount / decidedCount) * 100) : 0;
    const pendingCount = MOCK_QUOTES.filter((q) => q.status === 'sent').length;
    const pendingAmount = MOCK_QUOTES.filter((q) => q.status === 'sent').reduce((sum, q) => sum + q.total, 0);
    return { totalCount, totalAmount, acceptanceRate, pendingCount, pendingAmount };
  }, []);

  // ---------- Filter + Search ----------
  const filteredQuotes = useMemo(() => {
    return MOCK_QUOTES.filter((quote) => {
      const matchesFilter = activeFilter === 'all' || quote.status === activeFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        quote.quote_number.toLowerCase().includes(query) ||
        quote.client.name.toLowerCase().includes(query) ||
        (quote.project?.name || '').toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // ---------- Sort ----------
  const sortedQuotes = useMemo(() => {
    const sorted = [...filteredQuotes];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = (STATUS_SORT_ORDER[a.status as QuoteStatus] || 0) - (STATUS_SORT_ORDER[b.status as QuoteStatus] || 0);
          break;
        case 'quote_number':
          comparison = a.quote_number.localeCompare(b.quote_number);
          break;
        case 'client':
          comparison = a.client.name.localeCompare(b.client.name);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredQuotes, sortField, sortDirection]);

  // ---------- Sort handler ----------
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function renderSortIcon(field: SortField) {
    if (sortField !== field) {
      return <ArrowUpDown style={{ width: 14, height: 14, color: '#9CA3AF' }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp style={{ width: 14, height: 14, color: '#2563EB' }} />
    ) : (
      <ArrowDown style={{ width: 14, height: 14, color: '#2563EB' }} />
    );
  }

  // ---------- Action handlers (demo) ----------
  function handleDuplicate(e: React.MouseEvent, quoteId: string) {
    e.stopPropagation();
    setOpenActionMenu(null);
    alert(`Devis ${quoteId} dupliqué (démo)`);
  }

  function handleDelete(e: React.MouseEvent, quoteId: string) {
    e.stopPropagation();
    setOpenActionMenu(null);
    alert(`Devis ${quoteId} supprimé (démo)`);
  }

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.025em',
            }}
          >
            Devis
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="inline-flex items-center gap-2"
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Nouveau devis
        </Link>
      </div>

      {/* ==================== KPI Cards ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 : Total devis */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6B7280' }}>Total devis</p>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '0.5rem',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText style={{ width: 18, height: 18, color: '#2563EB' }} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
            {kpis.totalCount}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            devis créés au total
          </p>
        </div>

        {/* Card 2 : Montant total */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6B7280' }}>Montant total</p>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '0.5rem',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Euro style={{ width: 18, height: 18, color: '#047857' }} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
            {formatCurrency(kpis.totalAmount)}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            tous statuts confondus TTC
          </p>
        </div>

        {/* Card 3 : Taux d'acceptation */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6B7280' }}>Taux d&apos;acceptation</p>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '0.5rem',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp style={{ width: 18, height: 18, color: '#D97706' }} />
            </div>
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
            {kpis.acceptanceRate}%
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            sur les devis acceptés / refusés
          </p>
        </div>

        {/* Card 4 : En attente */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6B7280' }}>En attente</p>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '0.5rem',
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock style={{ width: 18, height: 18, color: '#7C3AED' }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2" style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
              {kpis.pendingCount}
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6B7280' }}>
              ({formatCurrency(kpis.pendingAmount)})
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            devis envoyés en attente de réponse
          </p>
        </div>
      </div>

      {/* ==================== Filters & Search ==================== */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '0.75rem',
          border: '1px solid #E5E7EB',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter tabs with count badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => {
              const count = statusCounts[tab.key] || 0;
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className="inline-flex items-center gap-1.5"
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    border: isActive ? '1px solid #2563EB' : '1px solid transparent',
                    backgroundColor: isActive ? '#EFF6FF' : '#F9FAFB',
                    color: isActive ? '#2563EB' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#2563EB' : '#E5E7EB',
                      color: isActive ? '#FFFFFF' : '#6B7280',
                      borderRadius: '9999px',
                      padding: '0.0625rem 0.4375rem',
                      minWidth: '1.25rem',
                      textAlign: 'center',
                      lineHeight: '1.125rem',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par n°, client, projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                minWidth: '18rem',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#374151',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                backgroundColor: '#F9FAFB',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
            />
          </div>
        </div>
      </div>

      {/* ==================== Table ==================== */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '0.75rem',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort('quote_number')}
                >
                  <div className="inline-flex items-center gap-1.5">
                    N° Devis
                    {renderSortIcon('quote_number')}
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort('client')}
                >
                  <div className="inline-flex items-center gap-1.5">
                    Client
                    {renderSortIcon('client')}
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Projet
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort('total')}
                >
                  <div className="inline-flex items-center justify-end gap-1.5">
                    Total TTC
                    {renderSortIcon('total')}
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort('status')}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    Statut
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Validité
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => handleSort('created_at')}
                >
                  <div className="inline-flex items-center gap-1.5">
                    Créé le
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: '4.5rem',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotes.length > 0 ? (
                sortedQuotes.map((quote, index) => {
                  const expired = isExpired(quote.valid_until) && quote.status !== 'expired' && quote.status !== 'accepted' && quote.status !== 'rejected';
                  const daysLeft = daysUntilExpiry(quote.valid_until);
                  const expiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && quote.status !== 'accepted' && quote.status !== 'rejected';
                  const isHovered = hoveredRow === quote.id;
                  const isMenuOpen = openActionMenu === quote.id;
                  const statusStyle = STATUS_STYLES[quote.status as QuoteStatus];

                  return (
                    <tr
                      key={quote.id}
                      onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                      onMouseEnter={() => setHoveredRow(quote.id)}
                      onMouseLeave={() => {
                        setHoveredRow(null);
                        if (!isMenuOpen) setOpenActionMenu(null);
                      }}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                        backgroundColor: isHovered ? '#F9FAFB' : '#FFFFFF',
                        borderBottom: index < sortedQuotes.length - 1 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      {/* N° Devis */}
                      <td style={{ padding: '0.875rem 1.5rem' }}>
                        <Link
                          href={`/dashboard/quotes/${quote.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2"
                          style={{ textDecoration: 'none' }}
                        >
                          <FileText style={{ width: 16, height: 16, color: '#9CA3AF', flexShrink: 0 }} />
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#2563EB',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                          >
                            {quote.quote_number}
                          </span>
                        </Link>
                      </td>

                      {/* Client */}
                      <td style={{ padding: '0.875rem 1.5rem' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                            {quote.client.name}
                          </p>
                          {quote.client.company && quote.client.company !== quote.client.name && (
                            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>
                              {quote.client.company}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Projet */}
                      <td style={{ padding: '0.875rem 1.5rem' }}>
                        {quote.project?.name ? (
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {quote.project.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>--</span>
                        )}
                      </td>

                      {/* Total TTC */}
                      <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                            {formatCurrency(quote.total)}
                          </p>
                          <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: '0.0625rem' }}>
                            HT : {formatCurrency(quote.subtotal)}
                          </p>
                        </div>
                      </td>

                      {/* Statut */}
                      <td style={{ padding: '0.875rem 1.5rem', textAlign: 'center' }}>
                        <span
                          className="inline-flex items-center gap-1"
                          style={{
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {STATUS_ICONS[quote.status as QuoteStatus]}
                          {STATUS_LABELS[quote.status as QuoteStatus]}
                        </span>
                      </td>

                      {/* Validité */}
                      <td style={{ padding: '0.875rem 1.5rem' }}>
                        {quote.valid_until ? (
                          <div>
                            <p style={{ fontSize: '0.8125rem', color: expired ? '#DC2626' : '#374151' }}>
                              {formatDate(quote.valid_until)}
                            </p>
                            {expired && (
                              <div className="inline-flex items-center gap-1" style={{ marginTop: '0.25rem' }}>
                                <AlertTriangle style={{ width: 12, height: 12, color: '#DC2626' }} />
                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#DC2626' }}>
                                  Expiré
                                </span>
                              </div>
                            )}
                            {expiringSoon && (
                              <div className="inline-flex items-center gap-1" style={{ marginTop: '0.25rem' }}>
                                <Clock style={{ width: 12, height: 12, color: '#D97706' }} />
                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#D97706' }}>
                                  J-{daysLeft}
                                </span>
                              </div>
                            )}
                            {!expired && !expiringSoon && daysLeft !== null && daysLeft > 7 && quote.status !== 'accepted' && quote.status !== 'rejected' && (
                              <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: '0.125rem' }}>
                                {daysLeft} jours restants
                              </p>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8125rem', color: '#D1D5DB' }}>--</span>
                        )}
                      </td>

                      {/* Créé le */}
                      <td style={{ padding: '0.875rem 1.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                          {formatDate(quote.created_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenu(isMenuOpen ? null : quote.id);
                            }}
                            className="inline-flex items-center justify-center"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '0.375rem',
                              border: 'none',
                              backgroundColor: isHovered || isMenuOpen ? '#F3F4F6' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.1s ease',
                              color: '#6B7280',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isHovered ? '#F3F4F6' : 'transparent')}
                          >
                            <MoreHorizontal style={{ width: 16, height: 16 }} />
                          </button>

                          {/* Dropdown menu */}
                          {isMenuOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '0.25rem',
                                width: '10rem',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '0.5rem',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                                zIndex: 50,
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenu(null);
                                  router.push(`/dashboard/quotes/${quote.id}`);
                                }}
                                className="flex items-center gap-2 w-full"
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '0.8125rem',
                                  color: '#374151',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Eye style={{ width: 14, height: 14, color: '#6B7280' }} />
                                Voir le devis
                              </button>
                              <button
                                onClick={(e) => handleDuplicate(e, quote.id)}
                                className="flex items-center gap-2 w-full"
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '0.8125rem',
                                  color: '#374151',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Copy style={{ width: 14, height: 14, color: '#6B7280' }} />
                                Dupliquer
                              </button>
                              <div style={{ height: '1px', backgroundColor: '#F3F4F6' }} />
                              <button
                                onClick={(e) => handleDelete(e, quote.id)}
                                className="flex items-center gap-2 w-full"
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '0.8125rem',
                                  color: '#DC2626',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Trash2 style={{ width: 14, height: 14, color: '#DC2626' }} />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* ==================== Empty State ==================== */
                <tr>
                  <td colSpan={8} style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div className="flex flex-col items-center">
                      {/* Illustration */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          backgroundColor: '#F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <FileX style={{ width: 36, height: 36, color: '#D1D5DB' }} />
                      </div>
                      <p
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.375rem',
                        }}
                      >
                        Aucun devis trouvé
                      </p>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#9CA3AF',
                          maxWidth: '20rem',
                          lineHeight: '1.375',
                        }}
                      >
                        {searchQuery
                          ? `Aucun résultat pour "${searchQuery}". Essayez une autre recherche.`
                          : activeFilter !== 'all'
                            ? `Aucun devis avec le statut "${STATUS_LABELS[activeFilter as QuoteStatus]}".`
                            : 'Vous n\'avez pas encore créé de devis. Commencez par en créer un.'}
                      </p>
                      {!searchQuery && activeFilter === 'all' && (
                        <Link
                          href="/dashboard/quotes/new"
                          className="inline-flex items-center gap-2"
                          style={{
                            marginTop: '1.25rem',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1.125rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                        >
                          <Plus style={{ width: 16, height: 16 }} />
                          Créer un devis
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================== Table Footer ==================== */}
        {sortedQuotes.length > 0 && (
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{
              padding: '0.75rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA',
            }}
          >
            <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
              {sortedQuotes.length} devis affichés sur {MOCK_QUOTES.length}
            </p>
            <div className="flex items-center gap-3">
              <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                Montant affiché :{' '}
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {formatCurrency(sortedQuotes.reduce((s, q) => s + q.total, 0))}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Close any open menu when clicking outside */}
      {openActionMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
          }}
          onClick={() => setOpenActionMenu(null)}
        />
      )}
    </div>
  );
}
