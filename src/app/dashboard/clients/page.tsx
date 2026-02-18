'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  FolderOpen,
  X,
  Users,
  Filter,
} from 'lucide-react';
import type { Client } from '@/types';
import { CLIENT_TYPES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';

// ============================================
// Mock Data
// ============================================

const MOCK_CLIENTS: (Client & { project_count: number })[] = [
  {
    id: 'cl-001',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.fr',
    phone: '06 12 34 56 78',
    company: null,
    address: '15 rue de la Paix',
    city: 'Paris',
    postal_code: '75002',
    notes: 'Projet de renovation appartement haussmannien',
    type: 'particulier',
    created_by: 'user-1',
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
    project_count: 2,
  },
  {
    id: 'cl-002',
    name: 'Jean-Pierre Martin',
    email: 'jp.martin@martinimmobilier.fr',
    phone: '01 42 33 44 55',
    company: 'Martin Immobilier SAS',
    address: '8 avenue Foch',
    city: 'Lyon',
    postal_code: '69006',
    notes: 'Promoteur immobilier - projets residentiels',
    type: 'professionnel',
    created_by: 'user-1',
    created_at: '2025-08-20T14:30:00Z',
    updated_at: '2025-11-01T09:00:00Z',
    project_count: 5,
  },
  {
    id: 'cl-003',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@gmail.com',
    phone: '06 98 76 54 32',
    company: null,
    address: '22 chemin des Vignes',
    city: 'Aix-en-Provence',
    postal_code: '13100',
    notes: 'Construction maison individuelle neuve',
    type: 'particulier',
    created_by: 'user-1',
    created_at: '2025-10-05T08:00:00Z',
    updated_at: '2025-10-05T08:00:00Z',
    project_count: 1,
  },
  {
    id: 'cl-004',
    name: 'Commune de Versailles',
    email: 'urbanisme@versailles.fr',
    phone: '01 39 24 88 00',
    company: 'Mairie de Versailles',
    address: '4 place de la Loi',
    city: 'Versailles',
    postal_code: '78000',
    notes: 'Marche public - renovation de la mediatheque centrale',
    type: 'public',
    created_by: 'user-1',
    created_at: '2025-07-10T11:00:00Z',
    updated_at: '2025-12-15T16:00:00Z',
    project_count: 3,
  },
  {
    id: 'cl-005',
    name: 'Philippe Moreau',
    email: 'p.moreau@cabinetmoreau.fr',
    phone: '04 91 22 33 44',
    company: 'Cabinet Moreau & Associes',
    address: '12 boulevard Longchamp',
    city: 'Marseille',
    postal_code: '13001',
    notes: 'Amenagement de bureaux professionnels',
    type: 'professionnel',
    created_by: 'user-1',
    created_at: '2025-11-01T09:00:00Z',
    updated_at: '2025-11-20T14:00:00Z',
    project_count: 2,
  },
  {
    id: 'cl-006',
    name: 'Claire Petit',
    email: 'claire.petit@outlook.fr',
    phone: '06 55 44 33 22',
    company: null,
    address: '3 impasse du Moulin',
    city: 'Bordeaux',
    postal_code: '33000',
    notes: 'Extension maison + garage',
    type: 'particulier',
    created_by: 'user-1',
    created_at: '2025-12-01T10:30:00Z',
    updated_at: '2025-12-01T10:30:00Z',
    project_count: 1,
  },
];

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-teal-500',
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
// New Client Modal
// ============================================

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Partial<Client>) => void;
}

function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postal_code: '',
    type: 'particulier' as Client['type'],
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      company: formData.company || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      city: formData.city || null,
      postal_code: formData.postal_code || null,
      notes: formData.notes || null,
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      postal_code: '',
      type: 'particulier',
      notes: '',
    });
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
            Nouveau client
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
              placeholder="Ex: Marie Dubois"
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
                placeholder="email@exemple.fr"
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
                placeholder="06 12 34 56 78"
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
              placeholder="Nom de la societe (optionnel)"
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
              placeholder="Adresse postale"
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
                placeholder="Ville"
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
                placeholder="75000"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Notes sur le client..."
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
              Creer le client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter((client) => {
      const matchesSearch =
        search === '' ||
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        (client.company &&
          client.company.toLowerCase().includes(search.toLowerCase())) ||
        (client.email &&
          client.email.toLowerCase().includes(search.toLowerCase()));

      const matchesType =
        typeFilter === 'all' || client.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const handleNewClient = (client: Partial<Client>) => {
    console.log('Nouveau client:', client);
    // In production, this would save to Supabase
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-sm text-gray-500 mt-1">
              {MOCK_CLIENTS.length} clients au total
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau client
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">Tous les types</option>
              {CLIENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Client Grid */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Aucun client trouve</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${getAvatarColor(client.id)}`}
                  >
                    {getInitials(client.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#2563EB] transition-colors truncate">
                        {client.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeStyle(client.type)}`}
                      >
                        {getTypeLabel(client.type)}
                      </span>
                    </div>

                    {client.company && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-500 truncate">
                          {client.company}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">
                        {client.email}
                      </span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {client.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {client.project_count} projet{client.project_count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Client Modal */}
      <NewClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNewClient}
      />
    </div>
  );
}
