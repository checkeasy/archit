'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Pencil,
  X,
  FolderOpen,
  FileText,
  Receipt,
  StickyNote,
  Calendar,
  Euro,
} from 'lucide-react';
import type { Client, Project, Quote, Invoice } from '@/types';
import { CLIENT_TYPES } from '@/lib/constants';
import {
  getInitials,
  formatCurrency,
  formatDate,
  getStatusColor,
  getPhaseLabel,
} from '@/lib/utils';

// ============================================
// Mock Data
// ============================================

const MOCK_CLIENTS: Record<string, Client & { project_count: number }> = {
  'cl-001': {
    id: 'cl-001',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.fr',
    phone: '06 12 34 56 78',
    company: null,
    address: '15 rue de la Paix',
    city: 'Paris',
    postal_code: '75002',
    notes:
      'Cliente fidele depuis 2023. Projet de renovation d\'un appartement haussmannien dans le 2e arrondissement. Budget confirme. Souhaite conserver les moulures et parquets d\'epoque. Second projet en discussion pour un pied-a-terre a Deauville.',
    type: 'particulier',
    created_by: 'user-1',
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
    project_count: 2,
  },
  'cl-002': {
    id: 'cl-002',
    name: 'Jean-Pierre Martin',
    email: 'jp.martin@martinimmobilier.fr',
    phone: '01 42 33 44 55',
    company: 'Martin Immobilier SAS',
    address: '8 avenue Foch',
    city: 'Lyon',
    postal_code: '69006',
    notes:
      'Promoteur immobilier regional. Projets residentiels haut de gamme a Lyon et environs. Contact principal : JP Martin (DG). Paiement a 30 jours. Potentiel de 3-5 projets par an.',
    type: 'professionnel',
    created_by: 'user-1',
    created_at: '2025-08-20T14:30:00Z',
    updated_at: '2025-11-01T09:00:00Z',
    project_count: 5,
  },
  'cl-004': {
    id: 'cl-004',
    name: 'Commune de Versailles',
    email: 'urbanisme@versailles.fr',
    phone: '01 39 24 88 00',
    company: 'Mairie de Versailles',
    address: '4 place de la Loi',
    city: 'Versailles',
    postal_code: '78000',
    notes:
      'Marche public - renovation de la mediatheque centrale. Interlocuteur : Mme Leroy (direction urbanisme). Procedure formalisee, delais de paiement 45 jours.',
    type: 'public',
    created_by: 'user-1',
    created_at: '2025-07-10T11:00:00Z',
    updated_at: '2025-12-15T16:00:00Z',
    project_count: 3,
  },
};

const MOCK_PROJECTS: Record<string, Project[]> = {
  'cl-001': [
    {
      id: 'proj-001',
      name: 'Renovation Haussmannien Paix',
      description: 'Renovation complete appartement 120m2',
      reference: 'PRJ-00012',
      client_id: 'cl-001',
      status: 'active',
      phase: 'apd',
      budget: 180000,
      surface_m2: 120,
      address: '15 rue de la Paix',
      city: 'Paris',
      postal_code: '75002',
      start_date: '2025-10-01',
      end_date: '2026-06-30',
      created_by: 'user-1',
      created_at: '2025-09-20T10:00:00Z',
      updated_at: '2025-12-01T10:00:00Z',
    },
    {
      id: 'proj-007',
      name: 'Pied-a-terre Deauville',
      description: 'Etude de faisabilite pour un appartement bord de mer',
      reference: 'PRJ-00018',
      client_id: 'cl-001',
      status: 'active',
      phase: 'esquisse',
      budget: 95000,
      surface_m2: 65,
      address: null,
      city: 'Deauville',
      postal_code: '14800',
      start_date: '2026-01-15',
      end_date: null,
      created_by: 'user-1',
      created_at: '2026-01-10T09:00:00Z',
      updated_at: '2026-01-10T09:00:00Z',
    },
  ],
  'cl-002': [
    {
      id: 'proj-002',
      name: 'Residence Les Terrasses',
      description: 'Construction de 24 logements collectifs',
      reference: 'PRJ-00013',
      client_id: 'cl-002',
      status: 'active',
      phase: 'dce',
      budget: 3200000,
      surface_m2: 1850,
      address: '45 rue Garibaldi',
      city: 'Lyon',
      postal_code: '69006',
      start_date: '2025-06-01',
      end_date: '2027-12-31',
      created_by: 'user-1',
      created_at: '2025-05-15T10:00:00Z',
      updated_at: '2025-11-20T10:00:00Z',
    },
  ],
  'cl-004': [
    {
      id: 'proj-003',
      name: 'Mediatheque Versailles',
      description: 'Renovation et extension de la mediatheque centrale',
      reference: 'PRJ-00010',
      client_id: 'cl-004',
      status: 'active',
      phase: 'pro',
      budget: 4500000,
      surface_m2: 2200,
      address: '12 rue Royale',
      city: 'Versailles',
      postal_code: '78000',
      start_date: '2025-03-01',
      end_date: '2027-06-30',
      created_by: 'user-1',
      created_at: '2025-02-10T10:00:00Z',
      updated_at: '2025-12-01T10:00:00Z',
    },
  ],
};

const MOCK_QUOTES: Record<string, Quote[]> = {
  'cl-001': [
    {
      id: 'qt-001',
      project_id: 'proj-001',
      client_id: 'cl-001',
      quote_number: 'DEV-2025-0012',
      status: 'accepted',
      subtotal: 21500,
      tax_rate: 20,
      tax_amount: 4300,
      total: 25800,
      valid_until: '2025-11-15',
      notes: null,
      conditions: null,
      created_by: 'user-1',
      created_at: '2025-10-15T10:00:00Z',
      updated_at: '2025-10-20T10:00:00Z',
    },
  ],
  'cl-002': [
    {
      id: 'qt-003',
      project_id: 'proj-002',
      client_id: 'cl-002',
      quote_number: 'DEV-2025-0008',
      status: 'accepted',
      subtotal: 185000,
      tax_rate: 20,
      tax_amount: 37000,
      total: 222000,
      valid_until: '2025-07-30',
      notes: null,
      conditions: null,
      created_by: 'user-1',
      created_at: '2025-06-15T10:00:00Z',
      updated_at: '2025-07-01T10:00:00Z',
    },
  ],
  'cl-004': [],
};

const MOCK_INVOICES: Record<string, Invoice[]> = {
  'cl-001': [
    {
      id: 'inv-001',
      quote_id: 'qt-001',
      project_id: 'proj-001',
      client_id: 'cl-001',
      invoice_number: 'FA-2025-0015',
      status: 'paid',
      subtotal: 6450,
      tax_rate: 20,
      tax_amount: 1290,
      amount: 7740,
      due_date: '2025-11-15',
      paid_date: '2025-11-10',
      paid_amount: 7740,
      notes: 'Acompte 30% - Phase Esquisse',
      created_by: 'user-1',
      created_at: '2025-10-25T10:00:00Z',
      updated_at: '2025-11-10T10:00:00Z',
    },
    {
      id: 'inv-004',
      quote_id: 'qt-001',
      project_id: 'proj-001',
      client_id: 'cl-001',
      invoice_number: 'FA-2025-0022',
      status: 'sent',
      subtotal: 8600,
      tax_rate: 20,
      tax_amount: 1720,
      amount: 10320,
      due_date: '2026-02-28',
      paid_date: null,
      paid_amount: 0,
      notes: 'Acompte 40% - Phase APS/APD',
      created_by: 'user-1',
      created_at: '2026-01-28T10:00:00Z',
      updated_at: '2026-01-28T10:00:00Z',
    },
  ],
  'cl-002': [
    {
      id: 'inv-002',
      quote_id: 'qt-003',
      project_id: 'proj-002',
      client_id: 'cl-002',
      invoice_number: 'FA-2025-0016',
      status: 'paid',
      subtotal: 55500,
      tax_rate: 20,
      tax_amount: 11100,
      amount: 66600,
      due_date: '2025-08-30',
      paid_date: '2025-08-25',
      paid_amount: 66600,
      notes: 'Acompte 30% - Phase Esquisse/APS',
      created_by: 'user-1',
      created_at: '2025-07-15T10:00:00Z',
      updated_at: '2025-08-25T10:00:00Z',
    },
  ],
  'cl-004': [],
};

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getTypeBadgeStyle(type: Client['type']): string {
  switch (type) {
    case 'particulier':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'professionnel':
      return 'bg-violet-50 text-violet-700 border border-violet-200';
    case 'public':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
}

function getTypeLabel(type: Client['type']): string {
  const found = CLIENT_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

// ============================================
// Edit Client Modal
// ============================================

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email || '',
    phone: client.phone || '',
    company: client.company || '',
    address: client.address || '',
    city: client.city || '',
    postal_code: client.postal_code || '',
    type: client.type,
    notes: client.notes || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mise a jour client:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Modifier le client
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Societe / Organisme
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de client
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as Client['type'],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              {CLIENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Tab Components
// ============================================

function ProjectsTab({ projects }: { projects: Project[] }) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Aucun projet pour ce client</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">
                  {project.reference}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(project.status)}`}
                >
                  {project.status === 'active'
                    ? 'Actif'
                    : project.status === 'completed'
                      ? 'Termine'
                      : project.status === 'on_hold'
                        ? 'En pause'
                        : 'Annule'}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mt-1">{project.name}</h4>
              {project.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {getPhaseLabel(project.phase)}
              </span>
              {project.budget && (
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatCurrency(project.budget)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
            {project.surface_m2 && <span>{project.surface_m2} m2</span>}
            {project.city && <span>{project.city}</span>}
            {project.start_date && (
              <span>Debut : {formatDate(project.start_date)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuotesTab({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Aucun devis pour ce client</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{quote.quote_number}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {formatDate(quote.created_at)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(quote.status)}`}
              >
                {quote.status === 'draft'
                  ? 'Brouillon'
                  : quote.status === 'sent'
                    ? 'Envoye'
                    : quote.status === 'accepted'
                      ? 'Accepte'
                      : quote.status === 'rejected'
                        ? 'Refuse'
                        : 'Expire'}
              </span>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatCurrency(quote.total)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Aucune facture pour ce client</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {invoice.invoice_number}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Echeance : {invoice.due_date ? formatDate(invoice.due_date) : '-'}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(invoice.status)}`}
              >
                {invoice.status === 'draft'
                  ? 'Brouillon'
                  : invoice.status === 'sent'
                    ? 'Envoyee'
                    : invoice.status === 'paid'
                      ? 'Payee'
                      : invoice.status === 'overdue'
                        ? 'En retard'
                        : 'Annulee'}
              </span>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
          </div>
          {invoice.paid_date && (
            <p className="text-xs text-emerald-600 mt-2">
              Paye le {formatDate(invoice.paid_date)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function NotesTab({ notes }: { notes: string | null }) {
  if (!notes) {
    return (
      <div className="text-center py-12">
        <StickyNote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Aucune note pour ce client</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {notes}
      </p>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

type TabKey = 'projets' | 'devis' | 'factures' | 'notes';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'projets', label: 'Projets', icon: FolderOpen },
  { key: 'devis', label: 'Devis', icon: FileText },
  { key: 'factures', label: 'Factures', icon: Receipt },
  { key: 'notes', label: 'Notes', icon: StickyNote },
];

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabKey>('projets');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get client data (fallback for unknown IDs)
  const client = MOCK_CLIENTS[clientId] || MOCK_CLIENTS['cl-001'];
  const projects = MOCK_PROJECTS[clientId] || [];
  const quotes = MOCK_QUOTES[clientId] || [];
  const invoices = MOCK_INVOICES[clientId] || [];

  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.paid_amount, 0);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/clients')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux clients
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold ${getAvatarColor(client.id)}`}
              >
                {getInitials(client.name)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {client.name}
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeStyle(client.type)}`}
                  >
                    {getTypeLabel(client.type)}
                  </span>
                </div>
                {client.company && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {client.company}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>

        {/* Contact Info + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Contact Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Informations de contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {client.email && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-900">{client.email}</p>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Telephone</p>
                    <p className="text-sm text-gray-900">{client.phone}</p>
                  </div>
                </div>
              )}
              {client.company && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Societe</p>
                    <p className="text-sm text-gray-900">{client.company}</p>
                  </div>
                </div>
              )}
              {(client.address || client.city) && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Adresse</p>
                    <p className="text-sm text-gray-900">
                      {[client.address, client.postal_code, client.city]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Apercu</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Projets</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {projects.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Devis</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {quotes.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Factures</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {invoices.length}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-600">CA encaisse</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(totalRevenue)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Client depuis</span>
                </div>
                <span className="text-sm text-gray-900">
                  {formatDate(client.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-0 -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === 'projets' && projects.length > 0 && (
                    <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                      {projects.length}
                    </span>
                  )}
                  {tab.key === 'devis' && quotes.length > 0 && (
                    <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                      {quotes.length}
                    </span>
                  )}
                  {tab.key === 'factures' && invoices.length > 0 && (
                    <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                      {invoices.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'projets' && <ProjectsTab projects={projects} />}
          {activeTab === 'devis' && <QuotesTab quotes={quotes} />}
          {activeTab === 'factures' && <InvoicesTab invoices={invoices} />}
          {activeTab === 'notes' && <NotesTab notes={client.notes} />}
        </div>
      </div>

      {/* Edit Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
      />
    </div>
  );
}
