'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Send,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { Quote, QuoteItem, QuoteStatus } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getPhaseLabel } from '@/lib/utils';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  expired: 'Expiré',
};

const MOCK_QUOTE: Omit<Quote, 'client' | 'project' | 'items'> & {
  client: Record<string, unknown> & {
    name: string;
    company: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    email: string | null;
    phone: string | null;
  };
  project: Record<string, unknown> & { name: string };
  items: QuoteItem[];
} = {
  id: '1',
  project_id: 'p1',
  project: {
    name: 'Rénovation maison bourgeoise',
    id: 'p1',
    description: null,
    reference: null,
    client_id: 'c1',
    status: 'active',
    phase: 'apd',
    budget: null,
    surface_m2: null,
    address: null,
    city: null,
    postal_code: null,
    start_date: null,
    end_date: null,
    created_by: '',
    created_at: '',
    updated_at: '',
  },
  client_id: 'c1',
  client: {
    name: 'Jean-Pierre Dumont',
    company: null,
    address: '15 rue des Lilas',
    city: 'Paris',
    postal_code: '75016',
    email: 'jp.dumont@email.com',
    phone: '06 12 34 56 78',
    id: 'c1',
    notes: null,
    type: 'particulier',
    created_by: '',
    created_at: '',
    updated_at: '',
  },
  quote_number: 'DEVIS-00001',
  status: 'sent',
  subtotal: 45000,
  tax_rate: 20,
  tax_amount: 9000,
  total: 54000,
  valid_until: '2026-03-15',
  notes: 'Mission complète de maîtrise d\'oeuvre pour la rénovation de la maison principale. Les prestations incluent toutes les phases de conception et le suivi de chantier.',
  conditions: `Conditions de paiement : 30% à la commande, 40% en cours de mission, 30% à la livraison.
Les honoraires sont soumis à la TVA au taux en vigueur.
Le présent devis est valable 30 jours à compter de sa date d'émission.`,
  created_by: '',
  created_at: '2026-01-10',
  updated_at: '2026-01-10',
  items: [
    {
      id: 'i1',
      quote_id: '1',
      description: 'Études préliminaires et relevé de l\'existant',
      phase: 'esquisse',
      quantity: 1,
      unit: 'forfait',
      unit_price: 8000,
      total: 8000,
      order_index: 0,
    },
    {
      id: 'i2',
      quote_id: '1',
      description: 'Avant-projet sommaire (APS) - Plans et estimations',
      phase: 'aps',
      quantity: 1,
      unit: 'forfait',
      unit_price: 12000,
      total: 12000,
      order_index: 1,
    },
    {
      id: 'i3',
      quote_id: '1',
      description: 'Avant-projet définitif (APD) - Dossier complet',
      phase: 'apd',
      quantity: 1,
      unit: 'forfait',
      unit_price: 15000,
      total: 15000,
      order_index: 2,
    },
    {
      id: 'i4',
      quote_id: '1',
      description: 'Suivi de chantier et direction des travaux (DET)',
      phase: 'det',
      quantity: 10,
      unit: 'mois',
      unit_price: 1000,
      total: 10000,
      order_index: 3,
    },
  ],
};

const FIRM_INFO = {
  name: 'Atelier d\'Architecture Moderne',
  address: '42 avenue des Champs-Élysées',
  city: 'Paris',
  postal_code: '75008',
  phone: '01 45 67 89 00',
  email: 'contact@atelier-archi-moderne.fr',
  siret: '812 345 678 00012',
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quote = MOCK_QUOTE;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quotes"
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Devis {quote.quote_number}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}
            >
              {STATUS_LABELS[quote.status]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4" />
            Modifier
          </button>
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <Send className="h-4 w-4" />
            Envoyer
          </button>
          <button className="inline-flex items-center gap-2 bg-[#2563EB] text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* Quote Document */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Document Header */}
          <div className="p-8 sm:p-10">
            <div className="flex items-start justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  DEVIS
                </h2>
                <p className="text-sm text-gray-500 mt-1">{quote.quote_number}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Date : {formatDate(quote.created_at)}</p>
                {quote.valid_until && (
                  <p>Valide jusqu&apos;au : {formatDate(quote.valid_until)}</p>
                )}
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  De
                </p>
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900">{FIRM_INFO.name}</p>
                  <p>{FIRM_INFO.address}</p>
                  <p>
                    {FIRM_INFO.postal_code} {FIRM_INFO.city}
                  </p>
                  <p>{FIRM_INFO.phone}</p>
                  <p>{FIRM_INFO.email}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    SIRET : {FIRM_INFO.siret}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  À
                </p>
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900">{quote.client.name}</p>
                  {quote.client.company && <p>{quote.client.company}</p>}
                  {quote.client.address && <p>{quote.client.address}</p>}
                  {(quote.client.postal_code || quote.client.city) && (
                    <p>
                      {quote.client.postal_code} {quote.client.city}
                    </p>
                  )}
                  {quote.client.email && <p>{quote.client.email}</p>}
                  {quote.client.phone && <p>{quote.client.phone}</p>}
                </div>
              </div>
            </div>

            {/* Project reference */}
            {quote.project && (
              <div className="mb-6 text-sm">
                <span className="text-gray-500">Projet : </span>
                <span className="font-medium text-gray-900">{quote.project.name}</span>
              </div>
            )}

            {/* Line Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      Phase
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                      Qté
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      Unité
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                      Prix unit. HT
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                      Total HT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quote.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.phase ? getPhaseLabel(item.phase) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-10">
              <div className="w-72 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sous-total HT</span>
                  <span className="text-gray-900">{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    TVA ({quote.tax_rate}%)
                  </span>
                  <span className="text-gray-700">
                    {formatCurrency(quote.tax_amount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Total TTC</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(quote.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {quote.notes}
                </p>
              </div>
            )}

            {/* Conditions */}
            {quote.conditions && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Conditions
                </h3>
                <p className="text-xs text-gray-400 whitespace-pre-line leading-relaxed">
                  {quote.conditions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Actions */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-100 transition-colors">
              <CheckCircle className="h-4 w-4" />
              Marquer accepté
            </button>
            <button className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 transition-colors">
              <XCircle className="h-4 w-4" />
              Marquer refusé
            </button>
            <button className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-100 transition-colors">
              <Send className="h-4 w-4" />
              Convertir en facture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
