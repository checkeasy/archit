'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileText,
  Edit3,
  Mail,
  CreditCard,
  Calendar,
  Euro,
  Percent,
  Receipt,
  Building2,
  User,
  MapPin,
  Phone,
  AtSign,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Bell,
  History,
  CircleDot,
  CheckCircle2,
  Copy,
  MoreHorizontal,
  Printer,
  FolderOpen,
  LinkIcon,
  TrendingUp,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { InvoiceStatus } from '@/types';

// ============================================
// Types
// ============================================

interface InvoiceLineItem {
  id: string;
  description: string;
  phase: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: string;
  label: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
}

interface HistoryEvent {
  id: string;
  date: string;
  label: string;
  icon: 'create' | 'send' | 'payment' | 'reminder' | 'edit';
  user: string;
}

interface RelatedInvoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  createdAt: string;
  dueDate: string;
  paidDate: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalTTC: number;
  paidAmount: number;
  notes: string | null;
  quoteNumber: string | null;
  quoteId: string | null;
  projectName: string;
  projectId: string;
  projectReference: string;
  paymentTerms: string;
  // Émetteur
  fromName: string;
  fromCompany: string;
  fromAddress: string;
  fromCity: string;
  fromPostalCode: string;
  fromSiret: string;
  fromTvaIntra: string;
  fromEmail: string;
  fromPhone: string;
  fromIban: string;
  fromBic: string;
  fromBank: string;
  // Destinataire
  toName: string;
  toCompany: string;
  toAddress: string;
  toCity: string;
  toPostalCode: string;
  toEmail: string;
  toPhone: string;
  // Lignes
  items: InvoiceLineItem[];
  // Paiements
  payments: Payment[];
  // Historique
  history: HistoryEvent[];
  // Factures liées
  relatedInvoices: RelatedInvoice[];
  // Overdues
  overdueDays: number;
  nextReminderDays: number | null;
}

// ============================================
// Mock Data
// ============================================

const MOCK_INVOICE: InvoiceDetail = {
  id: 'inv-042',
  invoiceNumber: 'FAC-2026-042',
  status: 'sent',
  createdAt: '2026-02-01',
  dueDate: '2026-03-15',
  paidDate: null,
  subtotal: 16350,
  taxRate: 20,
  taxAmount: 3270,
  totalTTC: 19620,
  paidAmount: 5886,
  notes: 'Honoraires correspondant aux phases APS et APD du projet Résidence Les Terrasses du Parc, conformément au contrat de maîtrise d\'oeuvre signé le 15/11/2025.',
  quoteNumber: 'DEV-2026-038',
  quoteId: 'quote-038',
  projectName: 'Résidence Les Terrasses',
  projectId: 'proj-terrasses',
  projectReference: 'PRJ-2026-015',
  paymentTerms: '30 jours fin de mois',
  // Émetteur
  fromName: 'Jean Dupont',
  fromCompany: 'Atelier Dupont Architecture',
  fromAddress: '24 rue de la République',
  fromCity: 'Lyon',
  fromPostalCode: '69002',
  fromSiret: '823 456 789 00012',
  fromTvaIntra: 'FR 82 823456789',
  fromEmail: 'contact@atelier-dupont.fr',
  fromPhone: '04 72 00 12 34',
  fromIban: 'FR76 3000 6000 0112 3456 7890 189',
  fromBic: 'AGRIFRPP',
  fromBank: 'Crédit Agricole Centre-Est',
  // Destinataire
  toName: 'Pierre Lefèvre',
  toCompany: 'SCI Les Terrasses du Parc',
  toAddress: '42 avenue de la Liberté',
  toCity: 'Lyon',
  toPostalCode: '69006',
  toEmail: 'p.lefevre@terrasses-du-parc.fr',
  toPhone: '06 12 34 56 78',
  // Lignes
  items: [
    {
      id: 'li-1',
      description: 'Phase APS - Villa Méditerranée',
      phase: 'APS',
      quantity: 1,
      unit: 'forfait',
      unitPrice: 4800,
      total: 4800,
    },
    {
      id: 'li-2',
      description: 'Phase APD - Résidence Les Pins',
      phase: 'APD',
      quantity: 1,
      unit: 'forfait',
      unitPrice: 7200,
      total: 7200,
    },
    {
      id: 'li-3',
      description: 'Modification plans - Loft Confluence',
      phase: 'PRO',
      quantity: 1,
      unit: 'forfait',
      unitPrice: 1350,
      total: 1350,
    },
    {
      id: 'li-4',
      description: 'Frais de déplacement',
      phase: null,
      quantity: 6,
      unit: 'déplacement',
      unitPrice: 500,
      total: 3000,
    },
  ],
  // Paiements
  payments: [
    {
      id: 'pay-1',
      label: 'Acompte 30%',
      amount: 5886,
      date: '2026-02-05',
      method: 'Virement bancaire',
      reference: 'VIR-2026-0218',
    },
  ],
  // Historique
  history: [
    {
      id: 'h-1',
      date: '2026-02-01',
      label: 'Facture créée',
      icon: 'create',
      user: 'Jean Dupont',
    },
    {
      id: 'h-2',
      date: '2026-02-02',
      label: 'Envoyée au client par email',
      icon: 'send',
      user: 'Jean Dupont',
    },
    {
      id: 'h-3',
      date: '2026-02-05',
      label: 'Acompte de 5 886,00 € reçu',
      icon: 'payment',
      user: 'Système',
    },
    {
      id: 'h-4',
      date: '2026-02-18',
      label: 'Relance envoyée au client',
      icon: 'reminder',
      user: 'Jean Dupont',
    },
  ],
  // Factures liées (même client)
  relatedInvoices: [
    {
      id: 'inv-035',
      number: 'FAC-2026-035',
      date: '2026-01-10',
      amount: 8400,
      status: 'paid',
    },
    {
      id: 'inv-039',
      number: 'FAC-2026-039',
      date: '2026-01-22',
      amount: 12300,
      status: 'paid',
    },
    {
      id: 'inv-044',
      number: 'FAC-2026-044',
      date: '2026-02-10',
      amount: 6750,
      status: 'draft',
    },
  ],
  overdueDays: 0,
  nextReminderDays: 3,
};

// Clone with overdue status for demo
const MOCK_OVERDUE: InvoiceDetail = {
  ...MOCK_INVOICE,
  id: 'inv-overdue',
  invoiceNumber: 'FAC-2026-031',
  status: 'overdue',
  createdAt: '2025-12-20',
  dueDate: '2026-01-31',
  paidAmount: 0,
  payments: [],
  overdueDays: 18,
  nextReminderDays: null,
  history: [
    {
      id: 'h-1',
      date: '2025-12-20',
      label: 'Facture créée',
      icon: 'create',
      user: 'Jean Dupont',
    },
    {
      id: 'h-2',
      date: '2025-12-21',
      label: 'Envoyée au client par email',
      icon: 'send',
      user: 'Jean Dupont',
    },
    {
      id: 'h-3',
      date: '2026-02-03',
      label: 'Première relance envoyée',
      icon: 'reminder',
      user: 'Système',
    },
    {
      id: 'h-4',
      date: '2026-02-10',
      label: 'Deuxième relance envoyée',
      icon: 'reminder',
      user: 'Jean Dupont',
    },
  ],
};

const MOCK_PAID: InvoiceDetail = {
  ...MOCK_INVOICE,
  id: 'inv-paid',
  invoiceNumber: 'FAC-2026-028',
  status: 'paid',
  paidDate: '2026-02-10',
  paidAmount: 19620,
  overdueDays: 0,
  nextReminderDays: null,
  payments: [
    {
      id: 'pay-1',
      label: 'Acompte 30%',
      amount: 5886,
      date: '2026-02-05',
      method: 'Virement bancaire',
      reference: 'VIR-2026-0218',
    },
    {
      id: 'pay-2',
      label: 'Solde final',
      amount: 13734,
      date: '2026-02-10',
      method: 'Virement bancaire',
      reference: 'VIR-2026-0244',
    },
  ],
  history: [
    ...MOCK_INVOICE.history,
    {
      id: 'h-5',
      date: '2026-02-10',
      label: 'Paiement du solde reçu - Facture soldée',
      icon: 'payment',
      user: 'Système',
    },
  ],
};

const INVOICES_MAP: Record<string, InvoiceDetail> = {
  'inv-042': MOCK_INVOICE,
  'inv-overdue': MOCK_OVERDUE,
  'inv-paid': MOCK_PAID,
};

// ============================================
// Helpers
// ============================================

function getStatusLabel(status: InvoiceStatus): string {
  const map: Record<InvoiceStatus, string> = {
    draft: 'Brouillon',
    sent: 'En attente',
    paid: 'Payée',
    overdue: 'En retard',
    cancelled: 'Annulée',
  };
  return map[status] || status;
}

function getStatusBadgeStyle(status: InvoiceStatus): React.CSSProperties {
  switch (status) {
    case 'paid':
      return {
        backgroundColor: '#ecfdf5',
        color: '#059669',
        border: '1px solid #a7f3d0',
      };
    case 'sent':
      return {
        backgroundColor: '#fffbeb',
        color: '#d97706',
        border: '1px solid #fde68a',
      };
    case 'overdue':
      return {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      };
    case 'draft':
      return {
        backgroundColor: '#f9fafb',
        color: '#6b7280',
        border: '1px solid #e5e7eb',
      };
    case 'cancelled':
      return {
        backgroundColor: '#f9fafb',
        color: '#9ca3af',
        border: '1px solid #e5e7eb',
      };
    default:
      return {
        backgroundColor: '#f9fafb',
        color: '#6b7280',
        border: '1px solid #e5e7eb',
      };
  }
}

function getStatusIcon(status: InvoiceStatus) {
  switch (status) {
    case 'paid':
      return CheckCircle;
    case 'overdue':
      return AlertCircle;
    case 'sent':
      return Clock;
    case 'draft':
      return FileText;
    default:
      return FileText;
  }
}

function getHistoryIcon(type: string) {
  switch (type) {
    case 'create':
      return CircleDot;
    case 'send':
      return Send;
    case 'payment':
      return CheckCircle2;
    case 'reminder':
      return Bell;
    case 'edit':
      return Edit3;
    default:
      return CircleDot;
  }
}

function getHistoryIconColor(type: string): string {
  switch (type) {
    case 'create':
      return '#6b7280';
    case 'send':
      return '#2563EB';
    case 'payment':
      return '#059669';
    case 'reminder':
      return '#d97706';
    case 'edit':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
}

function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateLongFR(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatAmountFR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function getPhaseBadgeStyle(phase: string): React.CSSProperties {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    APS: { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' },
    APD: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    PRO: { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
    DCE: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    ESQ: { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' },
  };
  const c = colors[phase] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
  return {
    backgroundColor: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
  };
}

// ============================================
// Component
// ============================================

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [showActions, setShowActions] = useState(false);

  const invoice = INVOICES_MAP[invoiceId] || MOCK_INVOICE;
  const StatusIcon = getStatusIcon(invoice.status);
  const remainingAmount = invoice.totalTTC - invoice.paidAmount;
  const paidPercentage = invoice.totalTTC > 0
    ? Math.round((invoice.paidAmount / invoice.totalTTC) * 100)
    : 0;

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* 1. HEADER */}
      {/* ============================================ */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            }}
            className="flex items-center justify-center"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ padding: '8px' }}>
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.025em',
              }}>
                {invoice.invoiceNumber}
              </h1>
              <span
                className="flex items-center gap-1.5"
                style={{
                  ...getStatusBadgeStyle(invoice.status),
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <StatusIcon style={{ width: '13px', height: '13px' }} />
                {getStatusLabel(invoice.status)}
              </span>
            </div>
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#6b7280' }}>
              Projet : {invoice.projectName} ({invoice.projectReference})
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <button
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#047857';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
            >
              <CheckCircle style={{ width: '15px', height: '15px' }} />
              Marquer comme payée
            </button>
          )}
          <button
            className="flex items-center gap-2"
            style={{
              backgroundColor: '#2563EB',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Mail style={{ width: '15px', height: '15px' }} />
            Envoyer par email
          </button>
          <button
            className="flex items-center gap-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#374151',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Download style={{ width: '15px', height: '15px' }} />
            Télécharger PDF
          </button>
          <button
            className="flex items-center gap-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#374151',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Edit3 style={{ width: '15px', height: '15px' }} />
            Modifier
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowActions(!showActions)}
              style={{
                backgroundColor: '#ffffff',
                color: '#6b7280',
                padding: '9px 10px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <MoreHorizontal style={{ width: '16px', height: '16px' }} />
            </button>
            {showActions && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  padding: '6px',
                  zIndex: 50,
                  minWidth: '200px',
                }}
              >
                <button
                  className="flex items-center gap-2 w-full"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#374151',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Printer style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                  Imprimer
                </button>
                <button
                  className="flex items-center gap-2 w-full"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#374151',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Copy style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                  Dupliquer
                </button>
                <button
                  className="flex items-center gap-2 w-full"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#374151',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Send style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                  Envoyer un rappel
                </button>
                <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '4px 0' }} />
                <button
                  className="flex items-center gap-2 w-full"
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#dc2626',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  Annuler la facture
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ALERT BANNER (Overdue) */}
      {/* ============================================ */}
      {invoice.status === 'overdue' && (
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#fee2e2',
              borderRadius: '10px',
            }}
          >
            <AlertTriangle style={{ width: '18px', height: '18px', color: '#dc2626' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b' }}>
              Cette facture est en retard de {invoice.overdueDays} jours
            </p>
            <p style={{ fontSize: '13px', color: '#dc2626', marginTop: '2px' }}>
              Date d&apos;échéance dépassée le {formatDateFR(invoice.dueDate)}. Montant restant dû : {formatAmountFR(remainingAmount)}.
            </p>
          </div>
          <button
            className="ml-auto flex items-center gap-2 shrink-0"
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Send style={{ width: '14px', height: '14px' }} />
            Relancer
          </button>
        </div>
      )}

      {/* Paid banner */}
      {invoice.status === 'paid' && (
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#d1fae5',
              borderRadius: '10px',
            }}
          >
            <CheckCircle style={{ width: '18px', height: '18px', color: '#059669' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#065f46' }}>
              Facture intégralement payée
            </p>
            <p style={{ fontSize: '13px', color: '#059669', marginTop: '2px' }}>
              Paiement soldé le {invoice.paidDate ? formatDateFR(invoice.paidDate) : '-'} pour un montant total de {formatAmountFR(invoice.totalTTC)}.
            </p>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* 3. SUMMARY CARDS ROW */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Montant HT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#eff6ff',
                borderRadius: '10px',
              }}
            >
              <Euro style={{ width: '18px', height: '18px', color: '#2563EB' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Montant HT</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
                {formatAmountFR(invoice.subtotal)}
              </p>
            </div>
          </div>
        </div>

        {/* TVA */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#faf5ff',
                borderRadius: '10px',
              }}
            >
              <Percent style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>TVA ({invoice.taxRate}%)</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
                {formatAmountFR(invoice.taxAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Montant TTC */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ecfdf5',
                borderRadius: '10px',
              }}
            >
              <Receipt style={{ width: '18px', height: '18px', color: '#059669' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Montant TTC</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
                {formatAmountFR(invoice.totalTTC)}
              </p>
            </div>
          </div>
        </div>

        {/* Échéance */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: invoice.status === 'overdue' ? '1px solid #fecaca' : '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: invoice.status === 'overdue' ? '#fef2f2' : '#fffbeb',
                borderRadius: '10px',
              }}
            >
              <Calendar style={{
                width: '18px',
                height: '18px',
                color: invoice.status === 'overdue' ? '#dc2626' : '#d97706',
              }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Échéance</p>
              <p style={{
                fontSize: '20px',
                fontWeight: 700,
                color: invoice.status === 'overdue' ? '#dc2626' : '#111827',
                letterSpacing: '-0.025em',
              }}>
                {formatDateFR(invoice.dueDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 4. TWO-COLUMN LAYOUT */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================ */}
        {/* LEFT COLUMN (2/3) - Invoice preview */}
        {/* ============================================ */}
        <div className="lg:col-span-2 space-y-6">
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Blue top stripe */}
            <div style={{ height: '4px', backgroundColor: '#2563EB' }} />

            <div style={{ padding: '36px 40px' }}>
              {/* Invoice header: logo/company + FACTURE */}
              <div className="flex items-start justify-between" style={{ marginBottom: '36px' }}>
                <div>
                  {/* Company logo placeholder */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#2563EB',
                      borderRadius: '14px',
                      marginBottom: '14px',
                    }}
                  >
                    <Building2 style={{ width: '28px', height: '28px', color: '#ffffff' }} />
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                    {invoice.fromCompany}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {invoice.fromName}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {invoice.fromAddress}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {invoice.fromPostalCode} {invoice.fromCity}
                  </p>
                  <div className="flex items-center gap-4" style={{ marginTop: '8px' }}>
                    <span className="flex items-center gap-1" style={{ fontSize: '12px', color: '#9ca3af' }}>
                      <Phone style={{ width: '11px', height: '11px' }} />
                      {invoice.fromPhone}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: '12px', color: '#9ca3af' }}>
                      <AtSign style={{ width: '11px', height: '11px' }} />
                      {invoice.fromEmail}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#2563EB',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}>
                    FACTURE
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#374151',
                    marginTop: '6px',
                  }}>
                    {invoice.invoiceNumber}
                  </p>
                  {invoice.quoteNumber && (
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      Réf. devis : {invoice.quoteNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Client block + dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8" style={{ marginBottom: '32px' }}>
                {/* Facturé à */}
                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <p style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#9ca3af',
                    marginBottom: '12px',
                  }}>
                    Facturé à
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                    {invoice.toCompany}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {invoice.toName}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {invoice.toAddress}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {invoice.toPostalCode} {invoice.toCity}
                  </p>
                  <div className="flex items-center gap-4" style={{ marginTop: '8px' }}>
                    <span className="flex items-center gap-1" style={{ fontSize: '12px', color: '#9ca3af' }}>
                      <AtSign style={{ width: '11px', height: '11px' }} />
                      {invoice.toEmail}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: '12px', color: '#9ca3af' }}>
                      <Phone style={{ width: '11px', height: '11px' }} />
                      {invoice.toPhone}
                    </span>
                  </div>
                </div>

                {/* Détails de la facture */}
                <div>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#9ca3af',
                    marginBottom: '12px',
                  }}>
                    Détails
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Date d&apos;émission</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {formatDateFR(invoice.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Date d&apos;échéance</span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: invoice.status === 'overdue' ? '#dc2626' : '#111827',
                      }}>
                        {formatDateFR(invoice.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Conditions</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {invoice.paymentTerms}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Statut</span>
                      <span
                        className="flex items-center gap-1"
                        style={{
                          ...getStatusBadgeStyle(invoice.status),
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line items table */}
              <div style={{ marginBottom: '28px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{
                        textAlign: 'left',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Description
                      </th>
                      <th style={{
                        textAlign: 'left',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Phase
                      </th>
                      <th style={{
                        textAlign: 'right',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Qté
                      </th>
                      <th style={{
                        textAlign: 'right',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Unité
                      </th>
                      <th style={{
                        textAlign: 'right',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Prix unitaire
                      </th>
                      <th style={{
                        textAlign: 'right',
                        paddingBottom: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6b7280',
                      }}>
                        Total HT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: index < invoice.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                        }}
                      >
                        <td style={{ padding: '14px 8px 14px 0', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                          {item.description}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          {item.phase ? (
                            <span
                              style={{
                                ...getPhaseBadgeStyle(item.phase),
                                borderRadius: '6px',
                                padding: '2px 10px',
                                fontSize: '11px',
                                fontWeight: 600,
                                display: 'inline-block',
                              }}
                            >
                              {item.phase}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#d1d5db' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '13px', color: '#6b7280' }}>
                          {item.unit}
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                          {formatAmountFR(item.unitPrice)}
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                          {formatAmountFR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals section */}
              <div className="flex justify-end">
                <div style={{ width: '320px' }}>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Sous-total HT</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      {formatAmountFR(invoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>TVA ({invoice.taxRate}%)</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      {formatAmountFR(invoice.taxAmount)}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between"
                    style={{
                      padding: '14px 0',
                      marginTop: '8px',
                      borderTop: '2px solid #111827',
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Total TTC</span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em' }}>
                      {formatAmountFR(invoice.totalTTC)}
                    </span>
                  </div>

                  {/* Paid / remaining */}
                  <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px' }}>
                    <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Déjà payé</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>
                        {formatAmountFR(invoice.paidAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>Reste dû</span>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: remainingAmount > 0 ? '#dc2626' : '#059669',
                      }}>
                        {formatAmountFR(remainingAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#9ca3af',
                    marginBottom: '8px',
                  }}>
                    Notes
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                    {invoice.notes}
                  </p>
                </div>
              )}

              {/* RIB / IBAN */}
              <div
                style={{
                  marginTop: '28px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #f3f4f6',
                }}
              >
                <p style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#9ca3af',
                  marginBottom: '12px',
                }}>
                  Coordonnées bancaires
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>IBAN</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>
                      {invoice.fromIban}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>BIC</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>
                      {invoice.fromBic}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Banque</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                      {invoice.fromBank}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mentions obligatoires */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <p style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#d1d5db',
                  marginBottom: '8px',
                }}>
                  Mentions légales
                </p>
                <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.7' }}>
                  <p>
                    SIRET : {invoice.fromSiret} — TVA intracommunautaire : {invoice.fromTvaIntra}
                  </p>
                  <p style={{ marginTop: '4px' }}>
                    En cas de retard de paiement, une pénalité de 3 fois le taux d&apos;intérêt légal sera appliquée,
                    conformément à l&apos;article L.441-10 du Code de commerce. Une indemnité forfaitaire de 40 €
                    pour frais de recouvrement sera également exigible (art. D.441-5 du Code de commerce).
                  </p>
                  <p style={{ marginTop: '4px' }}>
                    Pas d&apos;escompte pour paiement anticipé. Conditions de paiement : {invoice.paymentTerms}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* RIGHT COLUMN (1/3) - Sidebar cards */}
        {/* ============================================ */}
        <div className="space-y-5">
          {/* ---- Paiements reçus ---- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div className="flex items-center gap-2">
                <CreditCard style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                  Paiements reçus
                </h3>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: paidPercentage === 100 ? '#059669' : '#d97706',
                  backgroundColor: paidPercentage === 100 ? '#ecfdf5' : '#fffbeb',
                  borderRadius: '6px',
                  padding: '2px 8px',
                }}
              >
                {paidPercentage}%
              </span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {/* Payment list */}
              {invoice.payments.length > 0 ? (
                <div className="space-y-3" style={{ marginBottom: '16px' }}>
                  {invoice.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between"
                      style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #f3f4f6',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                          {payment.label}
                        </p>
                        <div className="flex items-center gap-2" style={{ marginTop: '3px' }}>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {formatDateFR(payment.date)}
                          </span>
                          <span style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            backgroundColor: '#d1d5db',
                            display: 'inline-block',
                          }} />
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {payment.method}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669' }}>
                          {formatAmountFR(payment.amount)}
                        </span>
                        <CheckCircle2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{
                    padding: '24px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>
                    Aucun paiement reçu
                  </p>
                </div>
              )}

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Progression</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {formatAmountFR(invoice.paidAmount)} / {formatAmountFR(invoice.totalTTC)}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${paidPercentage}%`,
                      backgroundColor: paidPercentage === 100 ? '#059669' : '#2563EB',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Solde restant</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: remainingAmount > 0 ? '#dc2626' : '#059669',
                  }}>
                    {formatAmountFR(remainingAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Devis associé ---- */}
          {invoice.quoteNumber && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <FileText style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                  Devis associé
                </h3>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <Link
                  href={`/dashboard/quotes/${invoice.quoteId}`}
                  className="flex items-center justify-between"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '10px',
                    border: '1px solid #dbeafe',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}>
                      {invoice.quoteNumber}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      Devis accepté
                    </p>
                  </div>
                  <ChevronRight style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                </Link>
              </div>
            </div>
          )}

          {/* ---- Projet associé ---- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <FolderOpen style={{ width: '16px', height: '16px', color: '#2563EB' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Projet associé
              </h3>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <Link
                href={`/dashboard/projects/${invoice.projectId}`}
                className="flex items-center justify-between"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              >
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    {invoice.projectName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {invoice.projectReference}
                  </p>
                </div>
                <ChevronRight style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
              </Link>
            </div>
          </div>

          {/* ---- Historique ---- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <History style={{ width: '16px', height: '16px', color: '#2563EB' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Historique
              </h3>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '20px',
                    bottom: '20px',
                    width: '2px',
                    backgroundColor: '#f3f4f6',
                  }}
                />
                <div className="space-y-4">
                  {invoice.history.map((event, index) => {
                    const Icon = getHistoryIcon(event.icon);
                    const iconColor = getHistoryIconColor(event.icon);
                    return (
                      <div key={event.id} className="flex items-start gap-3" style={{ position: 'relative' }}>
                        <div
                          className="flex items-center justify-center shrink-0"
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                            border: `2px solid ${iconColor}20`,
                            zIndex: 1,
                          }}
                        >
                          <Icon style={{ width: '13px', height: '13px', color: iconColor }} />
                        </div>
                        <div style={{ paddingTop: '3px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            {event.label}
                          </p>
                          <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {formatDateLongFR(event.date)}
                            </span>
                            <span style={{
                              width: '3px',
                              height: '3px',
                              borderRadius: '50%',
                              backgroundColor: '#d1d5db',
                              display: 'inline-block',
                            }} />
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {event.user}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Rappels ---- */}
          {invoice.nextReminderDays !== null && invoice.status !== 'paid' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <Bell style={{ width: '16px', height: '16px', color: '#d97706' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                  Rappels
                </h3>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#fffbeb',
                    borderRadius: '10px',
                    border: '1px solid #fde68a',
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '8px',
                    }}
                  >
                    <Clock style={{ width: '15px', height: '15px', color: '#d97706' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                      Prochaine relance automatique
                    </p>
                    <p style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                      Dans {invoice.nextReminderDays} jours
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Mode</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                      Email automatique
                    </span>
                  </div>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Fréquence</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                      Tous les 7 jours
                    </span>
                  </div>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Relances envoyées</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                      1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- Client info ---- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <User style={{ width: '16px', height: '16px', color: '#2563EB' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                Client
              </h3>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '10px',
                    }}
                  >
                    <Building2 style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {invoice.toCompany}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {invoice.toName}
                    </p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {invoice.toAddress}, {invoice.toPostalCode} {invoice.toCity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                    <AtSign style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {invoice.toEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {invoice.toPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 5. RELATED INVOICES */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <div className="flex items-center gap-2">
            <LinkIcon style={{ width: '16px', height: '16px', color: '#2563EB' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
              Autres factures du même client
            </h3>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            padding: '2px 8px',
          }}>
            {invoice.relatedInvoices.length} factures
          </span>
        </div>
        <div style={{ padding: '4px 8px' }}>
          {invoice.relatedInvoices.length > 0 ? (
            <div>
              {invoice.relatedInvoices.map((related, index) => {
                const relStatusStyle = getStatusBadgeStyle(related.status);
                return (
                  <Link
                    key={related.id}
                    href={`/dashboard/invoices/${related.id}`}
                    className="flex items-center justify-between"
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s ease',
                      borderBottom: index < invoice.relatedInvoices.length - 1 ? '1px solid #f9fafb' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                        }}
                      >
                        <Receipt style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                          {related.number}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {formatDateFR(related.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                        {formatAmountFR(related.amount)}
                      </span>
                      <span
                        style={{
                          ...relStatusStyle,
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(related.status)}
                      </span>
                      <ChevronRight style={{ width: '14px', height: '14px', color: '#d1d5db' }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ padding: '32px', color: '#9ca3af', fontSize: '13px' }}
            >
              Aucune autre facture pour ce client
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER - Quick stats */}
      {/* ============================================ */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '18px 20px',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#eff6ff',
              borderRadius: '10px',
            }}
          >
            <TrendingUp style={{ width: '18px', height: '18px', color: '#2563EB' }} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Total facturé au client</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              {formatAmountFR(
                invoice.totalTTC + invoice.relatedInvoices.reduce((sum, r) => sum + r.amount, 0)
              )}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '18px 20px',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ecfdf5',
              borderRadius: '10px',
            }}
          >
            <CheckCircle style={{ width: '18px', height: '18px', color: '#059669' }} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Factures payées</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              {invoice.relatedInvoices.filter((r) => r.status === 'paid').length} / {invoice.relatedInvoices.length + 1}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '18px 20px',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fffbeb',
              borderRadius: '10px',
            }}
          >
            <Clock style={{ width: '18px', height: '18px', color: '#d97706' }} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Délai moyen de paiement</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              18 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
