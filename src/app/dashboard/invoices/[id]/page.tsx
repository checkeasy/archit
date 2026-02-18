'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileText,
  Printer,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { InvoiceStatus } from '@/types';

// ============================================
// Mock Data
// ============================================

interface InvoiceLineItem {
  id: string;
  description: string;
  phase: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface InvoiceDetail {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  created_at: string;
  due_date: string;
  paid_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  amount: number;
  paid_amount: number;
  notes: string | null;
  quote_number: string | null;
  project_name: string;
  project_reference: string;
  // Emetteur
  from_name: string;
  from_company: string;
  from_address: string;
  from_city: string;
  from_postal_code: string;
  from_siret: string;
  from_email: string;
  from_phone: string;
  // Destinataire
  to_name: string;
  to_company: string | null;
  to_address: string;
  to_city: string;
  to_postal_code: string;
  to_email: string;
  // Lignes
  items: InvoiceLineItem[];
}

const MOCK_INVOICES: Record<string, InvoiceDetail> = {
  'inv-001': {
    id: 'inv-001',
    invoice_number: 'FA-2026-0001',
    status: 'paid',
    created_at: '2025-12-15',
    due_date: '2026-01-15',
    paid_date: '2026-01-10',
    subtotal: 6450,
    tax_rate: 20,
    tax_amount: 1290,
    amount: 7740,
    paid_amount: 7740,
    notes: 'Acompte 30% correspondant a la phase Esquisse du projet de renovation.',
    quote_number: 'DEV-2025-0012',
    project_name: 'Renovation Haussmannien Paix',
    project_reference: 'PRJ-00012',
    from_name: 'Jean Dupont',
    from_company: 'Atelier Dupont Architecture',
    from_address: '24 rue de la Republique',
    from_city: 'Lyon',
    from_postal_code: '69002',
    from_siret: '123 456 789 00012',
    from_email: 'contact@atelier-dupont.fr',
    from_phone: '04 72 00 00 00',
    to_name: 'Marie Dubois',
    to_company: null,
    to_address: '15 rue de la Paix',
    to_city: 'Paris',
    to_postal_code: '75002',
    to_email: 'marie.dubois@email.fr',
    items: [
      {
        id: 'li-1',
        description: 'Releve de l\'existant et diagnostic',
        phase: 'Esquisse',
        quantity: 1,
        unit: 'forfait',
        unit_price: 2500,
        total: 2500,
      },
      {
        id: 'li-2',
        description: 'Etude de faisabilite et esquisses',
        phase: 'Esquisse',
        quantity: 1,
        unit: 'forfait',
        unit_price: 2200,
        total: 2200,
      },
      {
        id: 'li-3',
        description: 'Rendus 3D preliminaires (2 vues)',
        phase: 'Esquisse',
        quantity: 2,
        unit: 'unite',
        unit_price: 450,
        total: 900,
      },
      {
        id: 'li-4',
        description: 'Frais de deplacement',
        phase: null,
        quantity: 1,
        unit: 'forfait',
        unit_price: 850,
        total: 850,
      },
    ],
  },
  'inv-002': {
    id: 'inv-002',
    invoice_number: 'FA-2026-0002',
    status: 'sent',
    created_at: '2026-02-01',
    due_date: '2026-03-15',
    paid_date: null,
    subtotal: 55500,
    tax_rate: 20,
    tax_amount: 11100,
    amount: 66600,
    paid_amount: 0,
    notes: 'Acompte 30% correspondant aux phases Esquisse et APS.',
    quote_number: 'DEV-2025-0008',
    project_name: 'Residence Les Terrasses',
    project_reference: 'PRJ-00013',
    from_name: 'Jean Dupont',
    from_company: 'Atelier Dupont Architecture',
    from_address: '24 rue de la Republique',
    from_city: 'Lyon',
    from_postal_code: '69002',
    from_siret: '123 456 789 00012',
    from_email: 'contact@atelier-dupont.fr',
    from_phone: '04 72 00 00 00',
    to_name: 'Jean-Pierre Martin',
    to_company: 'Martin Immobilier SAS',
    to_address: '8 avenue Foch',
    to_city: 'Lyon',
    to_postal_code: '69006',
    to_email: 'jp.martin@martinimmobilier.fr',
    items: [
      {
        id: 'li-1',
        description: 'Mission Esquisse - 24 logements collectifs',
        phase: 'Esquisse',
        quantity: 1,
        unit: 'forfait',
        unit_price: 28000,
        total: 28000,
      },
      {
        id: 'li-2',
        description: 'Mission APS - Etudes preliminaires',
        phase: 'APS',
        quantity: 1,
        unit: 'forfait',
        unit_price: 22000,
        total: 22000,
      },
      {
        id: 'li-3',
        description: 'Maquette 3D et perspectives',
        phase: 'Esquisse',
        quantity: 1,
        unit: 'forfait',
        unit_price: 5500,
        total: 5500,
      },
    ],
  },
  'inv-003': {
    id: 'inv-003',
    invoice_number: 'FA-2026-0003',
    status: 'overdue',
    created_at: '2025-12-20',
    due_date: '2026-01-31',
    paid_date: null,
    subtotal: 32000,
    tax_rate: 20,
    tax_amount: 6400,
    amount: 38400,
    paid_amount: 0,
    notes: 'Situation n2 correspondant a l\'avancement de la phase PRO.',
    quote_number: null,
    project_name: 'Mediatheque Versailles',
    project_reference: 'PRJ-00010',
    from_name: 'Jean Dupont',
    from_company: 'Atelier Dupont Architecture',
    from_address: '24 rue de la Republique',
    from_city: 'Lyon',
    from_postal_code: '69002',
    from_siret: '123 456 789 00012',
    from_email: 'contact@atelier-dupont.fr',
    from_phone: '04 72 00 00 00',
    to_name: 'Commune de Versailles',
    to_company: 'Mairie de Versailles',
    to_address: '4 place de la Loi',
    to_city: 'Versailles',
    to_postal_code: '78000',
    to_email: 'urbanisme@versailles.fr',
    items: [
      {
        id: 'li-1',
        description: 'Mission PRO - Plans d\'execution',
        phase: 'PRO',
        quantity: 1,
        unit: 'forfait',
        unit_price: 18000,
        total: 18000,
      },
      {
        id: 'li-2',
        description: 'CCTP tous lots',
        phase: 'PRO',
        quantity: 1,
        unit: 'forfait',
        unit_price: 9000,
        total: 9000,
      },
      {
        id: 'li-3',
        description: 'Estimation detaillee des travaux',
        phase: 'PRO',
        quantity: 1,
        unit: 'forfait',
        unit_price: 5000,
        total: 5000,
      },
    ],
  },
};

// ============================================
// Helpers
// ============================================

function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Brouillon',
    sent: 'Envoyee',
    paid: 'Payee',
    overdue: 'En retard',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
}

function getStatusIcon(status: InvoiceStatus) {
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
// Component
// ============================================

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  // Get invoice data (fallback for unknown IDs)
  const invoice = MOCK_INVOICES[invoiceId] || MOCK_INVOICES['inv-001'];
  const StatusIcon = getStatusIcon(invoice.status);
  const resteDu = invoice.amount - invoice.paid_amount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Facture {invoice.invoice_number}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  getStatusColor(invoice.status)
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {getInvoiceStatusLabel(invoice.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Projet : {invoice.project_name} ({invoice.project_reference})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {invoice.status === 'sent' || invoice.status === 'overdue' ? (
            <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
              <CheckCircle className="h-4 w-4" />
              Marquer payee
            </button>
          ) : null}
          {invoice.status === 'overdue' && (
            <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
              <Send className="h-4 w-4" />
              Envoyer rappel
            </button>
          )}
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* Payment Status Banner */}
      {invoice.status === 'overdue' && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Facture en retard de paiement
            </p>
            <p className="text-sm text-red-600">
              Date d&apos;echeance depassee : {formatDate(invoice.due_date)}. Montant restant du : {formatCurrency(resteDu)}.
            </p>
          </div>
        </div>
      )}

      {invoice.status === 'paid' && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Facture integralement payee
            </p>
            <p className="text-sm text-emerald-600">
              Paiement recu le {invoice.paid_date ? formatDate(invoice.paid_date) : '-'} pour un montant de {formatCurrency(invoice.paid_amount)}.
            </p>
          </div>
        </div>
      )}

      {/* Invoice A4-like Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">FACTURE</h2>
            <p className="mt-1 text-lg font-semibold text-[#2563EB]">{invoice.invoice_number}</p>
            {invoice.quote_number && (
              <p className="mt-1 text-sm text-gray-500">
                Ref. devis : {invoice.quote_number}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-600 sm:text-right space-y-1">
            <div className="flex sm:justify-end gap-2">
              <span className="text-gray-400">Date d&apos;emission :</span>
              <span className="font-medium text-gray-900">{formatDate(invoice.created_at)}</span>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-gray-400">Date d&apos;echeance :</span>
              <span className={cn(
                'font-medium',
                invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'
              )}>
                {formatDate(invoice.due_date)}
              </span>
            </div>
          </div>
        </div>

        {/* De / A */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">De</p>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{invoice.from_company}</p>
              <p className="text-gray-600">{invoice.from_name}</p>
              <p className="text-gray-600">{invoice.from_address}</p>
              <p className="text-gray-600">{invoice.from_postal_code} {invoice.from_city}</p>
              <p className="text-gray-500 mt-2">SIRET : {invoice.from_siret}</p>
              <p className="text-gray-500">{invoice.from_email}</p>
              <p className="text-gray-500">{invoice.from_phone}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Facture a</p>
            <div className="space-y-1 text-sm">
              {invoice.to_company && (
                <p className="font-semibold text-gray-900">{invoice.to_company}</p>
              )}
              <p className={cn(invoice.to_company ? 'text-gray-600' : 'font-semibold text-gray-900')}>
                {invoice.to_name}
              </p>
              <p className="text-gray-600">{invoice.to_address}</p>
              <p className="text-gray-600">{invoice.to_postal_code} {invoice.to_city}</p>
              <p className="text-gray-500 mt-2">{invoice.to_email}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phase
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Qte
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Unite
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Prix unitaire
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total HT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-3.5 pr-4">
                    {item.phase ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {item.phase}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 text-right text-sm text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-right text-sm text-gray-500">
                    {item.unit}
                  </td>
                  <td className="py-3.5 text-right text-sm text-gray-700">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-3.5 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Sous-total HT</span>
              <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">TVA ({invoice.tax_rate}%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div className="flex items-center justify-between border-t-2 border-gray-900 pt-3">
              <span className="text-base font-bold text-gray-900">Total TTC</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
            </div>

            {/* Payment info */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Montant paye</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrency(invoice.paid_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">Reste du</span>
                <span className={cn(
                  'font-bold text-base',
                  resteDu > 0 ? 'text-red-600' : 'text-emerald-600'
                )}>
                  {formatCurrency(resteDu)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Notes</p>
            <p className="text-sm text-gray-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}

        {/* Conditions */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            Conditions de paiement : virement bancaire sous 30 jours. En cas de retard de paiement,
            une penalite de 3 fois le taux d&apos;interet legal sera appliquee, ainsi qu&apos;une indemnite
            forfaitaire de 40 EUR pour frais de recouvrement.
          </p>
        </div>
      </div>
    </div>
  );
}
