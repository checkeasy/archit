'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Search, Filter } from 'lucide-react';
import type { Quote, QuoteStatus } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  expired: 'Expiré',
};

const FILTER_TABS: { key: QuoteStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'draft', label: 'Brouillon' },
  { key: 'sent', label: 'Envoyé' },
  { key: 'accepted', label: 'Accepté' },
  { key: 'rejected', label: 'Refusé' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_QUOTES: any[] = [
  {
    id: '1',
    project_id: 'p1',
    project: { name: 'Rénovation maison bourgeoise', id: 'p1', description: null, reference: null, client_id: 'c1', status: 'active', phase: 'apd', budget: null, surface_m2: null, address: null, city: null, postal_code: null, start_date: null, end_date: null, created_by: '', created_at: '', updated_at: '' },
    client_id: 'c1',
    client: { name: 'Jean-Pierre Dumont', id: 'c1', email: null, phone: null, company: null, address: null, city: null, postal_code: null, notes: null, type: 'particulier', created_by: '', created_at: '', updated_at: '' },
    quote_number: 'DEVIS-00001',
    status: 'accepted',
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
    status: 'sent',
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
    status: 'draft',
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
    status: 'accepted',
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
    status: 'rejected',
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
    status: 'sent',
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
];

export default function QuotesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = MOCK_QUOTES.filter((quote) => {
    const matchesFilter = activeFilter === 'all' || quote.status === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <Link
          href="/dashboard/quotes/new"
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau devis
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  N° Devis
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Montant HT
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  TVA
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total TTC
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#2563EB] hover:underline">
                        {quote.quote_number}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{quote.client.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {quote.project?.name || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-700">
                      {formatCurrency(quote.subtotal)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-500">
                      {formatCurrency(quote.tax_amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(quote.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}
                    >
                      {STATUS_LABELS[quote.status as QuoteStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(quote.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Aucun devis trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
