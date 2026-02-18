'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import {
  ArrowLeft, Download, Send, Edit, Copy, CheckCircle, XCircle, FileText,
  Building2, Mail, Phone, MapPin, User, Calendar, Clock, Eye, Bell,
  Paperclip, ExternalLink, Receipt, TrendingUp, Shield, MoreHorizontal,
  Printer, Trash2,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface QuoteLineItem {
  id: string;
  phaseCode: string;
  description: string;
  details: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface HistoryEvent {
  id: string;
  date: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface LinkedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

// =============================================================================
// Reusable Styles
// =============================================================================

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
};
const cardHeaderStyle: React.CSSProperties = {
  padding: '16px 24px', borderBottom: '1px solid #F3F4F6',
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 600, color: '#111827',
};
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: '#9CA3AF',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
};
const outlineBtn: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB',
  backgroundColor: '#FFFFFF', color: '#374151', fontSize: 13, fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.15s',
};
const primaryBtn: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: 'none',
  backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: 13, fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.15s',
};
const smallIcon = { width: 15, height: 15 };
const tinyIcon = { width: 14, height: 14 };
const grayBg: React.CSSProperties = {
  backgroundColor: '#F9FAFB', padding: 16, borderRadius: 8,
  border: '1px solid #F3F4F6',
};
const thStyle = (align: string, w?: number): React.CSSProperties => ({
  textAlign: align as 'left' | 'center' | 'right', padding: '12px 16px',
  fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase',
  letterSpacing: '0.05em', ...(w ? { width: w } : {}),
});

// =============================================================================
// Mock Data
// =============================================================================

const QUOTE_DATA = {
  id: 'q-2026-042',
  quoteNumber: 'DEV-2026-042',
  status: 'sent' as QuoteStatus,
  validDays: 30,
  validUntil: '2026-03-15',
  createdAt: '13/02/2026',
  updatedAt: '14/02/2026',
  subtotal: 24500,
  taxRate: 20,
  taxAmount: 4900,
  total: 29400,
  notes: "Mission complète de maîtrise d'œuvre pour la construction de la Résidence Les Terrasses du Parc. Les prestations couvrent l'ensemble des phases de conception, de l'esquisse jusqu'au dossier de consultation des entreprises. Ce projet comprend la réalisation de 24 logements collectifs de standing sur un terrain de 3 200 m² en zone urbaine.",
  conditions: `Conditions de paiement :
- 30% à la signature du présent devis
- 30% à la validation de la phase APD
- 30% à la remise du dossier DCE
- 10% à la réception définitive des travaux

Les honoraires sont soumis à la TVA au taux en vigueur (20%).
Le présent devis est valable 30 jours à compter de sa date d'émission.
Tout dépassement de délai imputable au client pourra entraîner une révision des honoraires.
Les prestations supplémentaires non prévues au présent devis feront l'objet d'un avenant.
En cas de litige, le tribunal compétent sera celui de Paris.`,
  createdBy: 'Jean Dupont',
};

const FIRM_DATA = {
  name: 'Atelier d\'Architecture Moderne',
  address: '42 avenue des Champs-Élysées',
  postalCode: '75008',
  city: 'Paris',
  phone: '01 45 67 89 00',
  email: 'contact@atelier-archi-moderne.fr',
  siret: '812 345 678 00012',
  tvaIntra: 'FR 76 812345678',
};

const CLIENT_DATA = {
  name: 'SCI Les Terrasses du Parc',
  contactPerson: 'Pierre-Antoine Lefèvre',
  email: 'pa.lefevre@terrasses-du-parc.fr',
  phone: '01 42 68 93 15',
  mobile: '06 78 45 12 39',
  address: '28 boulevard Haussmann',
  postalCode: '75009',
  city: 'Paris',
  siret: '903 456 789 00021',
  type: 'SCI (Société Civile Immobilière)',
};

const PROJECT_DATA = {
  id: 'proj-2026-018',
  name: 'Résidence Les Terrasses',
  reference: 'PROJ-2026-018',
  phaseLabel: 'DCE - Dossier de Consultation',
  status: 'En cours',
  surface: '1 250 m²',
  budget: '2 800 000 €',
  address: '12 rue des Acacias, 75017 Paris',
  progress: 65,
};

const QUOTE_LINES: QuoteLineItem[] = [
  { id: 'l1', phaseCode: 'ESQ', description: 'Études préliminaires',
    details: 'Analyse du site, relevé de l\'existant, études de faisabilité, premières esquisses et intentions architecturales.',
    quantity: 1, unit: 'forfait', unitPrice: 3500, total: 3500 },
  { id: 'l2', phaseCode: 'APS', description: 'Avant-Projet Sommaire',
    details: 'Plans de masse, coupes, façades à l\'échelle 1/200. Estimation prévisionnelle du coût des travaux. Dossier de présentation.',
    quantity: 1, unit: 'forfait', unitPrice: 5000, total: 5000 },
  { id: 'l3', phaseCode: 'APD', description: 'Avant-Projet Définitif',
    details: 'Plans détaillés à l\'échelle 1/100, descriptif des ouvrages, estimation détaillée. Constitution du dossier de permis de construire.',
    quantity: 1, unit: 'forfait', unitPrice: 7500, total: 7500 },
  { id: 'l4', phaseCode: 'PRO', description: 'Projet',
    details: 'Plans d\'exécution détaillés, cahier des clauses techniques particulières (CCTP), planning prévisionnel des travaux.',
    quantity: 1, unit: 'forfait', unitPrice: 5500, total: 5500 },
  { id: 'l5', phaseCode: 'DCE', description: 'Dossier de Consultation des Entreprises',
    details: 'Préparation des pièces de consultation, quantitatifs détaillés, analyse des offres des entreprises et rapport comparatif.',
    quantity: 1, unit: 'forfait', unitPrice: 3000, total: 3000 },
];

const HISTORY_EVENTS: HistoryEvent[] = [
  { id: 'h1', date: '13/02/2026 à 09:32', label: 'Devis créé par Jean Dupont',
    icon: <FileText style={tinyIcon} />, color: '#6B7280' },
  { id: 'h2', date: '13/02/2026 à 11:45', label: 'Annexe technique ajoutée',
    icon: <Paperclip style={tinyIcon} />, color: '#6B7280' },
  { id: 'h3', date: '14/02/2026 à 14:15', label: 'Envoyé au client par email',
    icon: <Send style={tinyIcon} />, color: '#2563EB' },
  { id: 'h4', date: '15/02/2026 à 10:48', label: 'Consulté par le client',
    icon: <Eye style={tinyIcon} />, color: '#7C3AED' },
  { id: 'h5', date: '15/02/2026 à 10:52', label: 'PDF téléchargé par le client',
    icon: <Download style={tinyIcon} />, color: '#7C3AED' },
  { id: 'h6', date: '17/02/2026 à 09:00', label: 'Relance automatique envoyée',
    icon: <Bell style={tinyIcon} />, color: '#F59E0B' },
];

const LINKED_DOCUMENTS: LinkedDocument[] = [
  { id: 'd1', name: 'DEV-2026-042.pdf', type: 'PDF', size: '245 Ko', date: '14/02/2026' },
  { id: 'd2', name: 'Annexe-technique-terrasses.pdf', type: 'PDF', size: '1,2 Mo', date: '13/02/2026' },
  { id: 'd3', name: 'Plan-masse-esquisse.dwg', type: 'DWG', size: '3,8 Mo', date: '10/02/2026' },
];

// =============================================================================
// Status Configuration
// =============================================================================

const STATUS_CFG: Record<QuoteStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  draft:    { label: 'Brouillon', bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB', dot: '#9CA3AF' },
  sent:     { label: 'Envoyé',    bg: '#FFFBEB', text: '#92400E', border: '#FCD34D', dot: '#F59E0B' },
  accepted: { label: 'Accepté',   bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7', dot: '#10B981' },
  rejected: { label: 'Refusé',    bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5', dot: '#EF4444' },
  expired:  { label: 'Expiré',    bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB', dot: '#9CA3AF' },
};

// =============================================================================
// Helper: IconBadge
// =============================================================================

function IconBadge({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10, backgroundColor: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </div>
  );
}

// =============================================================================
// Helper: SummaryCard
// =============================================================================

function SummaryCard({ label, value, valueColor, icon, iconBg, borderColor }: {
  label: string; value: string; valueColor?: string; icon: React.ReactNode;
  iconBg: string; borderColor?: string;
  subtitle?: string;
}) {
  return (
    <div style={{
      ...cardStyle, border: `1px solid ${borderColor || '#E5E7EB'}`,
      padding: '20px 24px', overflow: 'visible',
    }}>
      <div className="flex items-center gap-3">
        <IconBadge bg={iconBg}>{icon}</IconBadge>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </p>
          <p style={{ fontSize: 22, fontWeight: 700, color: valueColor || '#111827', marginTop: 2 }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Helper: InfoRow for sidebar
// =============================================================================

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
        {children}
      </div>
      <div style={{ height: 1, backgroundColor: '#F3F4F6' }} />
    </>
  );
}

// =============================================================================
// Component
// =============================================================================

export default function QuoteDetailPage() {
  const params = useParams();
  const [showMenu, setShowMenu] = useState(false);

  const q = QUOTE_DATA;
  const cl = CLIENT_DATA;
  const proj = PROJECT_DATA;
  const st = STATUS_CFG[q.status];

  const today = new Date();
  const expiry = new Date(q.validUntil);
  const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / 86400000));
  const expiringSoon = daysLeft <= 7 && daysLeft > 0;
  const expiryFormatted = q.validUntil.split('-').reverse().join('/');

  return (
    <div className="space-y-6" style={{ paddingBottom: 40 }}>
      {/* ===== HEADER ===== */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quotes" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 10,
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#6B7280',
          }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.025em' }}>
                Devis {q.quoteNumber}
              </h1>
              <span className="inline-flex items-center gap-1.5" style={{
                padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                backgroundColor: st.bg, color: st.text, border: `1px solid ${st.border}`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: st.dot }} />
                {st.label}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              Créé le 13/02/2026 par {q.createdBy}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="inline-flex items-center gap-2" style={outlineBtn}>
            <Edit style={smallIcon} /> Modifier
          </button>
          <button className="inline-flex items-center gap-2" style={outlineBtn}>
            <Copy style={smallIcon} /> Dupliquer
          </button>
          <button className="inline-flex items-center gap-2" style={outlineBtn}>
            <Download style={smallIcon} /> Télécharger PDF
          </button>
          <button className="inline-flex items-center gap-2" style={primaryBtn}>
            <Send style={smallIcon} /> Envoyer au client
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#6B7280', cursor: 'pointer',
            }}>
              <MoreHorizontal style={{ width: 16, height: 16 }} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 42, width: 200,
                backgroundColor: '#FFFFFF', borderRadius: 10, border: '1px solid #E5E7EB',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden',
              }}>
                <button className="flex items-center gap-2 w-full" style={{
                  padding: '10px 14px', fontSize: 13, color: '#374151',
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <Printer style={tinyIcon} /> Imprimer
                </button>
                <button className="flex items-center gap-2 w-full" style={{
                  padding: '10px 14px', fontSize: 13, color: '#DC2626',
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <Trash2 style={tinyIcon} /> Supprimer le devis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Montant HT" value={formatCurrency(q.subtotal)}
          icon={<TrendingUp style={{ width: 18, height: 18, color: '#2563EB' }} />} iconBg="#EFF6FF" />
        <SummaryCard label={`TVA (${q.taxRate}%)`} value={formatCurrency(q.taxAmount)}
          icon={<Receipt style={{ width: 18, height: 18, color: '#EA580C' }} />} iconBg="#FFF7ED" />
        <SummaryCard label="Montant TTC" value={formatCurrency(q.total)} valueColor="#059669"
          icon={<Shield style={{ width: 18, height: 18, color: '#059669' }} />} iconBg="#ECFDF5" />
        <div style={{
          ...cardStyle, border: expiringSoon ? '1px solid #FCD34D' : '1px solid #E5E7EB',
          padding: '20px 24px', overflow: 'visible',
        }}>
          <div className="flex items-center gap-3">
            <IconBadge bg={expiringSoon ? '#FFFBEB' : '#F3F4F6'}>
              <Clock style={{ width: 18, height: 18, color: expiringSoon ? '#D97706' : '#6B7280' }} />
            </IconBadge>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Validité
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: expiringSoon ? '#D97706' : '#111827', marginTop: 2 }}>
                {q.validDays} jours
              </p>
              <p style={{ fontSize: 11, color: expiringSoon ? '#D97706' : '#9CA3AF', marginTop: 1 }}>
                Expire le {expiryFormatted}{expiringSoon ? ` (${daysLeft}j restants)` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN (2/3) ===== */}
        <div className="lg:col-span-2 space-y-6">

          {/* --- Client Info --- */}
          <div style={cardStyle}>
            <div className="flex items-center justify-between" style={cardHeaderStyle}>
              <div className="flex items-center gap-2">
                <Building2 style={{ width: 16, height: 16, color: '#2563EB' }} />
                <h2 style={sectionTitle}>Informations client</h2>
              </div>
              <Link href="/dashboard/clients/c1" className="inline-flex items-center gap-1"
                style={{ fontSize: 12, color: '#2563EB', fontWeight: 500, textDecoration: 'none' }}>
                Voir la fiche <ExternalLink style={{ width: 12, height: 12 }} />
              </Link>
            </div>
            <div style={{ padding: 24 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Client details */}
                <div className="space-y-4">
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{cl.name}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{cl.type}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <User style={{ ...tinyIcon, color: '#9CA3AF', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{cl.contactPerson}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF' }}>Interlocuteur principal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin style={{ ...tinyIcon, color: '#9CA3AF', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, color: '#374151' }}>{cl.address}</p>
                      <p style={{ fontSize: 13, color: '#374151' }}>{cl.postalCode} {cl.city}</p>
                    </div>
                  </div>
                </div>
                {/* Contact info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail style={{ ...tinyIcon, color: '#9CA3AF', flexShrink: 0 }} />
                    <a href={`mailto:${cl.email}`} style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>
                      {cl.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone style={{ ...tinyIcon, color: '#9CA3AF', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{cl.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone style={{ ...tinyIcon, color: '#9CA3AF', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>
                      {cl.mobile}
                      <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 6 }}>(mobile)</span>
                    </span>
                  </div>
                  <div style={{
                    marginTop: 8, padding: '8px 12px',
                    backgroundColor: '#F9FAFB', borderRadius: 8,
                    border: '1px solid #F3F4F6', fontSize: 12, color: '#6B7280',
                  }}>
                    SIRET : {cl.siret}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: 1, backgroundColor: '#F3F4F6', margin: '20px 0' }} />

              {/* Firm info (Émetteur) */}
              <div>
                <h3 style={labelStyle}>Émetteur du devis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                      {FIRM_DATA.name}
                    </p>
                    <p style={{ fontSize: 13, color: '#374151' }}>
                      {FIRM_DATA.address}
                    </p>
                    <p style={{ fontSize: 13, color: '#374151' }}>
                      {FIRM_DATA.postalCode} {FIRM_DATA.city}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone style={{ ...tinyIcon, color: '#9CA3AF', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#374151' }}>{FIRM_DATA.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail style={{ ...tinyIcon, color: '#9CA3AF', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#374151' }}>{FIRM_DATA.email}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                      SIRET : {FIRM_DATA.siret} | TVA : {FIRM_DATA.tvaIntra}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Quote Lines Table --- */}
          <div style={cardStyle}>
            <div className="flex items-center justify-between" style={cardHeaderStyle}>
              <div className="flex items-center gap-2">
                <FileText style={{ width: 16, height: 16, color: '#2563EB' }} />
                <h2 style={sectionTitle}>Lignes de devis</h2>
              </div>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                {QUOTE_LINES.length} postes
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={thStyle('left', 50)}>#</th>
                    <th style={thStyle('left')}>Phase / Description</th>
                    <th style={thStyle('center', 80)}>Quantité</th>
                    <th style={thStyle('right', 130)}>Prix unitaire</th>
                    <th style={thStyle('right', 130)}>Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {QUOTE_LINES.map((line, i) => (
                    <tr key={line.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: 16, verticalAlign: 'top' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 26, height: 26, borderRadius: 8,
                          backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 600,
                        }}>{i + 1}</span>
                      </td>
                      <td style={{ padding: 16, verticalAlign: 'top' }}>
                        <div className="flex items-center gap-2">
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                            backgroundColor: '#F0F4FF', color: '#2563EB', fontSize: 11, fontWeight: 600,
                          }}>{line.phaseCode}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{line.description}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
                          {line.details}
                        </p>
                      </td>
                      <td style={{ padding: 16, textAlign: 'center', verticalAlign: 'top', fontSize: 13, color: '#374151' }}>
                        {line.quantity}<br />
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{line.unit}</span>
                      </td>
                      <td style={{ padding: 16, textAlign: 'right', verticalAlign: 'top', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td style={{ padding: 16, textAlign: 'right', verticalAlign: 'top', fontSize: 14, color: '#111827', fontWeight: 600 }}>
                        {formatCurrency(line.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ borderTop: '2px solid #E5E7EB', padding: '20px 24px' }}>
              <div className="flex justify-end">
                <div style={{ width: 320 }}>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>Sous-total HT</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{formatCurrency(q.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>TVA ({q.taxRate}%)</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{formatCurrency(q.taxAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between" style={{
                    padding: '12px 16px', marginTop: 8, backgroundColor: '#EFF6FF',
                    borderRadius: 10, border: '1px solid #BFDBFE',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1E40AF' }}>Total TTC</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1E40AF' }}>{formatCurrency(q.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Conditions & Notes --- */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={sectionTitle}>Conditions et notes</h2>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={labelStyle}>Notes</h3>
                <p style={{ ...grayBg, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                  {q.notes}
                </p>
              </div>
              <div>
                <h3 style={labelStyle}>Conditions de paiement</h3>
                <div style={{ ...grayBg, fontSize: 13, color: '#4B5563', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {q.conditions}
                </div>
              </div>
              {/* Validity warning */}
              <div className="flex items-center gap-3" style={{
                marginTop: 16, padding: '12px 16px', backgroundColor: '#FFFBEB',
                borderRadius: 8, border: '1px solid #FDE68A',
              }}>
                <Clock style={{ width: 16, height: 16, color: '#D97706', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#92400E' }}>
                  Ce devis est valable {q.validDays} jours, soit jusqu&apos;au{' '}
                  <strong>{expiryFormatted}</strong>.
                  Passé ce délai, une nouvelle proposition pourra être établie.
                </p>
              </div>

              {/* Signature section */}
              <div style={{ marginTop: 24 }}>
                <h3 style={labelStyle}>Bon pour accord</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div style={{
                    padding: 16, borderRadius: 8,
                    border: '1px dashed #D1D5DB', backgroundColor: '#F9FAFB',
                    minHeight: 80,
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>
                      Signature du maître d&apos;ouvrage
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                      Lu et approuvé, bon pour accord
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 24 }}>
                      Date : ____/____/________
                    </p>
                  </div>
                  <div style={{
                    padding: 16, borderRadius: 8,
                    border: '1px dashed #D1D5DB', backgroundColor: '#F9FAFB',
                    minHeight: 80,
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>
                      Signature de l&apos;architecte
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {FIRM_DATA.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 24 }}>
                      Date : ____/____/________
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (1/3) ===== */}
        <div className="space-y-6">

          {/* --- Projet associé --- */}
          <div style={cardStyle}>
            <div className="flex items-center gap-2" style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <Building2 style={{ width: 16, height: 16, color: '#2563EB' }} />
              <h2 style={sectionTitle}>Projet associé</h2>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ ...grayBg, borderRadius: 10 }}>
                <div className="flex items-start justify-between">
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                    {proj.name}
                  </p>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                    backgroundColor: '#ECFDF5', color: '#065F46', fontSize: 11, fontWeight: 600,
                  }}>{proj.status}</span>
                </div>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, marginBottom: 12 }}>
                  Réf. {proj.reference}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Phase actuelle</span>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 6,
                      backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 600,
                    }}>{proj.phaseLabel.split(' - ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Surface</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{proj.surface}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Budget estimé</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{proj.budget}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Adresse</span>
                    <span style={{ fontSize: 12, color: '#374151', textAlign: 'right', maxWidth: '60%' }}>
                      {proj.address}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 16 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Avancement global</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>
                      {proj.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${proj.progress}%`, height: '100%',
                      backgroundColor: '#2563EB', borderRadius: 3,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                <Link href={`/dashboard/projects/${proj.id}`}
                  className="flex items-center justify-center gap-2 w-full"
                  style={{
                    marginTop: 16, padding: '9px 16px', borderRadius: 8,
                    backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: 13, fontWeight: 500,
                    textDecoration: 'none', border: '1px solid #BFDBFE',
                  }}>
                  <ExternalLink style={tinyIcon} /> Voir le projet
                </Link>
              </div>
            </div>
          </div>

          {/* --- Historique --- */}
          <div style={cardStyle}>
            <div className="flex items-center gap-2" style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <Calendar style={{ width: 16, height: 16, color: '#2563EB' }} />
              <h2 style={sectionTitle}>Historique</h2>
            </div>
            <div style={{ padding: 20 }}>
              {HISTORY_EVENTS.map((ev, i) => (
                <div key={ev.id} className="flex gap-3" style={{ position: 'relative' }}>
                  {i < HISTORY_EVENTS.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 14, top: 32, bottom: 0,
                      width: 2, backgroundColor: '#E5E7EB',
                    }} />
                  )}
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    backgroundColor: `${ev.color}15`, border: `1px solid ${ev.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ev.color, flexShrink: 0, zIndex: 1,
                  }}>{ev.icon}</div>
                  <div style={{ paddingBottom: 20, flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{ev.label}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Documents liés --- */}
          <div style={cardStyle}>
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2">
                <Paperclip style={{ width: 16, height: 16, color: '#2563EB' }} />
                <h2 style={sectionTitle}>Documents liés</h2>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 22, height: 22, borderRadius: 7,
                backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: 11, fontWeight: 600, padding: '0 6px',
              }}>{LINKED_DOCUMENTS.length}</span>
            </div>
            <div style={{ padding: 12 }}>
              <div className="space-y-2">
                {LINKED_DOCUMENTS.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3" style={{
                    padding: '10px 12px', borderRadius: 8,
                    border: '1px solid #F3F4F6', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      backgroundColor: doc.type === 'PDF' ? '#FEF2F2' : '#FFF7ED',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <FileText style={{
                        width: 16, height: 16,
                        color: doc.type === 'PDF' ? '#DC2626' : '#EA580C',
                      }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 500, color: '#374151',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{doc.name}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                        {doc.type} - {doc.size} - {doc.date}
                      </p>
                    </div>
                    <Download style={{ width: 14, height: 14, color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center gap-2 w-full" style={{
                marginTop: 12, padding: '9px 16px', borderRadius: 8,
                border: '1px dashed #D1D5DB', backgroundColor: 'transparent',
                color: '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
                <Paperclip style={tinyIcon} /> Ajouter un document
              </button>
            </div>
          </div>

          {/* --- Résumé rapide --- */}
          <div style={cardStyle}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={sectionTitle}>Résumé rapide</h2>
            </div>
            <div style={{ padding: 20 }}>
              <div className="space-y-3">
                <InfoRow label="Référence">
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{q.quoteNumber}</span>
                </InfoRow>
                <InfoRow label="Date de création">
                  <span style={{ fontSize: 13, color: '#374151' }}>{q.createdAt}</span>
                </InfoRow>
                <InfoRow label="Dernière modification">
                  <span style={{ fontSize: 13, color: '#374151' }}>{q.updatedAt}</span>
                </InfoRow>
                <InfoRow label="Nombre de postes">
                  <span style={{ fontSize: 13, color: '#374151' }}>{QUOTE_LINES.length}</span>
                </InfoRow>
                <InfoRow label="Taux de TVA">
                  <span style={{ fontSize: 13, color: '#374151' }}>{q.taxRate}%</span>
                </InfoRow>
                <InfoRow label="Montant HT">
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    {formatCurrency(q.subtotal)}
                  </span>
                </InfoRow>
                <InfoRow label="Montant TTC">
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>
                    {formatCurrency(q.total)}
                  </span>
                </InfoRow>
                <InfoRow label="Validité">
                  <span style={{ fontSize: 13, color: '#374151' }}>
                    {q.validDays} jours
                  </span>
                </InfoRow>
                <InfoRow label="Statut">
                  <span className="inline-flex items-center gap-1" style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    backgroundColor: st.bg, color: st.text, border: `1px solid ${st.border}`,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%', backgroundColor: st.dot,
                    }} />
                    {st.label}
                  </span>
                </InfoRow>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Créé par</span>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      backgroundColor: '#EFF6FF', color: '#2563EB',
                      fontSize: 10, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>JD</div>
                    <span style={{ fontSize: 13, color: '#374151' }}>{q.createdBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ACTIONS BAR ===== */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 24px',
      }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
              Actions rapides
            </h3>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              Modifier le statut ou convertir ce devis en facture
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="inline-flex items-center gap-2" style={{
              padding: '10px 20px', borderRadius: 8,
              border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2',
              color: '#DC2626', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              <XCircle style={{ width: 16, height: 16 }} />
              Marquer comme refusé
            </button>
            <button className="inline-flex items-center gap-2" style={{
              padding: '10px 20px', borderRadius: 8,
              border: '1px solid #6EE7B7', backgroundColor: '#ECFDF5',
              color: '#065F46', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              <CheckCircle style={{ width: 16, height: 16 }} />
              Marquer comme accepté
            </button>
            <button className="inline-flex items-center gap-2" style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              backgroundColor: '#2563EB', color: '#FFFFFF',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(37,99,235,0.3)',
              transition: 'all 0.15s',
            }}>
              <Receipt style={{ width: 16, height: 16 }} />
              Convertir en facture
            </button>
          </div>
        </div>

        {/* Informational note */}
        <div style={{
          marginTop: 16, padding: '12px 16px',
          backgroundColor: '#EFF6FF', borderRadius: 8,
          border: '1px solid #BFDBFE',
        }}>
          <p style={{ fontSize: 12, color: '#1E40AF' }}>
            <strong>Note :</strong> La conversion en facture créera automatiquement une facture
            avec les mêmes lignes et montants que ce devis. Le devis sera alors marqué comme
            accepté et lié à la facture correspondante.
          </p>
        </div>
      </div>
    </div>
  );
}
