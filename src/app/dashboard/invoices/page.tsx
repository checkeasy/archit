'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Receipt,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { Invoice, InvoiceStatus } from '@/types';

// ============================================
// Mock Data
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
    project_name: 'Renovation Haussmannien Paix',
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
    project_name: 'Residence Les Terrasses',
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
    project_name: 'Mediatheque Versailles',
    invoice_number: 'FA-2026-0003',
    status: 'overdue',
    subtotal: 32000,
    tax_rate: 20,
    tax_amount: 6400,
    amount: 38400,
    due_date: '2026-01-31',
    paid_date: null,
    paid_amount: 0,
    notes: 'Phase PRO - Situation n2',
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
    project_name: 'Renovation Haussmannien Paix',
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
    project_name: 'Residence Les Terrasses',
    invoice_number: 'FA-2026-0005',
    status: 'paid',
    subtotal: 37000,
    tax_rate: 20,
    tax_amount: 7400,
    amount: 44400,
    due_date: '2026-01-28',
    paid_date: '2026-01-25',
    paid_amount: 44400,
    notes: 'Phase DCE - Situation n1',
    created_by: 'user-1',
    created_at: '2025-12-28T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
];

// ============================================
// Helpers
// ============================================

function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Brouillon',
    sent: 'Envoyee',
    paid: 'Payee',
    overdue: 'En retard',
    cancelled: 'Annulee',
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
    default:
      return FileText;
  }
}

// ============================================
// Filter Tabs
// ============================================

type FilterTab = 'all' | InvoiceStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'draft', label: 'Brouillon' },
  { key: 'sent', label: 'Envoyee' },
  { key: 'paid', label: 'Payee' },
  { key: 'overdue', label: 'En retard' },
];

// ============================================
// Component
// ============================================

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Computed stats
  const totalPending = useMemo(() => {
    return mockInvoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'draft')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, []);

  const totalPaidThisMonth = useMemo(() => {
    return mockInvoices
      .filter((inv) => {
        if (inv.status !== 'paid' || !inv.paid_date) return false;
        const paidDate = new Date(inv.paid_date);
        const now = new Date();
        return (
          paidDate.getMonth() === now.getMonth() &&
          paidDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inv) => sum + inv.paid_amount, 0);
  }, []);

  const totalOverdue = useMemo(() => {
    return mockInvoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, []);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((inv) => {
      const matchSearch =
        !search ||
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
        inv.project_name.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || inv.status === activeTab;
      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredInvoices.length} facture{filteredInvoices.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total en attente */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700">Total en attente</p>
              <p className="text-xl font-bold text-amber-900">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>

        {/* Total paye ce mois */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Paye ce mois</p>
              <p className="text-xl font-bold text-emerald-900">{formatCurrency(totalPaidThisMonth)}</p>
            </div>
          </div>
        </div>

        {/* En retard */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700">En retard</p>
              <p className="text-xl font-bold text-red-900">{formatCurrency(totalOverdue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une facture, un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {mockInvoices.filter((inv) =>
                    tab.key === 'all' ? true : inv.status === tab.key
                  ).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  N* Facture
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Montant TTC
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Statut
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date echeance
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date paiement
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getInvoiceStatusIcon(invoice.status);
                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-sm font-mono font-medium text-gray-900 hover:text-[#2563EB] transition-colors"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="block"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {invoice.client_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {invoice.project_name}
                        </p>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          getStatusColor(invoice.status)
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {getInvoiceStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-600">
                        {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-600">
                        {invoice.paid_date ? formatDate(invoice.paid_date) : '-'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-sm font-medium text-[#2563EB] hover:text-blue-800 transition-colors"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredInvoices.map((invoice) => {
            const StatusIcon = getInvoiceStatusIcon(invoice.status);
            return (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="block px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </p>
                    <p className="text-xs text-gray-500">{invoice.client_name}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                      getStatusColor(invoice.status)
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {getInvoiceStatusLabel(invoice.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Ech. {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredInvoices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Receipt className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Aucune facture trouvee</p>
            <p className="text-sm text-gray-500 mt-1">
              Essayez de modifier vos filtres de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
