'use client';

import { useState } from 'react';
import {
  Files,
  Upload,
  Search,
  Filter,
  FileImage,
  FileText,
  File,
  Download,
  Trash2,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  HardDrive,
  User,
  FolderOpen,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Document } from '@/types';

// ============================================
// Category configuration
// ============================================

type DocumentCategory = Document['category'];

const categoryConfig: Record<
  DocumentCategory,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  plan: {
    label: 'Plans',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  render: {
    label: 'Rendus 3D',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  contract: {
    label: 'Contrats',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  permit: {
    label: 'Permis',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  report: {
    label: 'Rapports',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  photo: {
    label: 'Photos',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  other: {
    label: 'Autres',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

const categoryOptions: { value: DocumentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'plan', label: 'Plans' },
  { value: 'render', label: 'Rendus 3D' },
  { value: 'contract', label: 'Contrats' },
  { value: 'permit', label: 'Permis' },
  { value: 'report', label: 'Rapports' },
  { value: 'photo', label: 'Photos' },
  { value: 'other', label: 'Autres' },
];

// ============================================
// Mock projects for filter
// ============================================

const mockProjects = [
  { id: 'p1', name: 'Villa Mediterranee' },
  { id: 'p2', name: 'Bureaux Haussmann' },
  { id: 'p3', name: 'Residence Les Oliviers' },
  { id: 'p4', name: 'Ecole Jean Jaures' },
];

// ============================================
// Mock documents
// ============================================

interface MockDocument {
  id: string;
  project_id: string;
  project_name: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploader_name: string;
  version: number;
  category: DocumentCategory;
  created_at: string;
}

const mockDocuments: MockDocument[] = [
  {
    id: 'doc-1',
    project_id: 'p1',
    project_name: 'Villa Mediterranee',
    name: 'Plan RDC - Phase APD.dwg',
    file_url: '#',
    file_type: 'application/dwg',
    file_size: 4_250_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 3,
    category: 'plan',
    created_at: '2026-02-15T14:30:00Z',
  },
  {
    id: 'doc-2',
    project_id: 'p2',
    project_name: 'Bureaux Haussmann',
    name: 'Rendu facade principale.png',
    file_url: '#',
    file_type: 'image/png',
    file_size: 8_900_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'render',
    created_at: '2026-02-14T09:15:00Z',
  },
  {
    id: 'doc-3',
    project_id: 'p1',
    project_name: 'Villa Mediterranee',
    name: 'Contrat MOE - Phase PRO.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 1_200_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 2,
    category: 'contract',
    created_at: '2026-02-12T16:45:00Z',
  },
  {
    id: 'doc-4',
    project_id: 'p3',
    project_name: 'Residence Les Oliviers',
    name: 'Permis de construire PC-075-2026-001.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 3_500_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 1,
    category: 'permit',
    created_at: '2026-02-10T11:00:00Z',
  },
  {
    id: 'doc-5',
    project_id: 'p4',
    project_name: 'Ecole Jean Jaures',
    name: 'Rapport etude thermique RE2020.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 2_800_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 1,
    category: 'report',
    created_at: '2026-02-08T10:20:00Z',
  },
  {
    id: 'doc-6',
    project_id: 'p1',
    project_name: 'Villa Mediterranee',
    name: 'Photos chantier - Gros oeuvre.jpg',
    file_url: '#',
    file_type: 'image/jpeg',
    file_size: 15_600_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'photo',
    created_at: '2026-02-06T15:30:00Z',
  },
  {
    id: 'doc-7',
    project_id: 'p2',
    project_name: 'Bureaux Haussmann',
    name: 'CCTP Lot 02 - Gros oeuvre.docx',
    file_url: '#',
    file_type: 'application/docx',
    file_size: 950_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 4,
    category: 'other',
    created_at: '2026-02-05T08:45:00Z',
  },
  {
    id: 'doc-8',
    project_id: 'p3',
    project_name: 'Residence Les Oliviers',
    name: 'Plan masse - Esquisse V2.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 6_100_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 2,
    category: 'plan',
    created_at: '2026-02-03T13:10:00Z',
  },
];

// ============================================
// Helpers
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(1)} Mo`;
  return `${(bytes / 1_073_741_824).toFixed(1)} Go`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return FileImage;
  if (
    fileType.includes('pdf') ||
    fileType.includes('doc') ||
    fileType.includes('text')
  )
    return FileText;
  return File;
}

function getFileIconColor(fileType: string): string {
  if (fileType.startsWith('image/')) return 'text-teal-500';
  if (fileType.includes('pdf')) return 'text-red-500';
  if (fileType.includes('doc')) return 'text-blue-500';
  if (fileType.includes('dwg')) return 'text-indigo-500';
  return 'text-gray-400';
}

// ============================================
// Page component
// ============================================

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    DocumentCategory | 'all'
  >('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filter logic
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesProject =
      selectedProject === 'all' || doc.project_id === selectedProject;
    return matchesSearch && matchesCategory && matchesProject;
  });

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedProject !== 'all';

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProject('all');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} trouvés
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#2563EB' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#1d4ed8')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#2563EB')
          }
        >
          <Upload className="h-4 w-4" />
          Importer
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value as DocumentCategory | 'all'
                )
              }
              className="appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project filter */}
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white cursor-pointer"
            >
              <option value="all">Tous les projets</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Filtres actifs :</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  categoryConfig[selectedCategory].bgColor,
                  categoryConfig[selectedCategory].color,
                  categoryConfig[selectedCategory].borderColor
                )}
              >
                {categoryConfig[selectedCategory].label}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedProject !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                {mockProjects.find((p) => p.id === selectedProject)?.name}
                <button
                  onClick={() => setSelectedProject('all')}
                  className="hover:text-gray-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-auto"
            >
              Effacer tout
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Files className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            Aucun document trouve
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Modifiez vos filtres ou importez un nouveau document.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const IconComponent = getFileIcon(doc.file_type);
            const iconColor = getFileIconColor(doc.file_type);
            const catConfig = categoryConfig[doc.category];

            return (
              <div
                key={doc.id}
                className="group relative bg-white border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md"
              >
                {/* Menu button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === doc.id ? null : doc.id)
                    }
                    className="p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuOpen === doc.id && (
                    <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </button>
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>

                {/* File icon + name */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <IconComponent className={cn('h-5 w-5', iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-6">
                      {doc.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                      {doc.project_name}
                    </p>
                  </div>
                </div>

                {/* Category badge */}
                <div className="mt-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      catConfig.bgColor,
                      catConfig.color,
                      catConfig.borderColor
                    )}
                  >
                    {catConfig.label}
                  </span>
                  {doc.version > 1 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
                      v{doc.version}
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(doc.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {formatFileSize(doc.file_size)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <User className="h-3 w-3" />
                  <span>{doc.uploader_name}</span>
                </div>

                {/* Hover actions */}
                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-gray-100">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="h-3.5 w-3.5" />
                    Télécharger
                  </button>
                  <button className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="hidden xl:table-cell px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDocuments.map((doc) => {
                  const IconComponent = getFileIcon(doc.file_type);
                  const iconColor = getFileIconColor(doc.file_type);
                  const catConfig = categoryConfig[doc.category];

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                            <IconComponent
                              className={cn('h-4 w-4', iconColor)}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] lg:max-w-[300px]">
                              {doc.name}
                            </p>
                            {doc.version > 1 && (
                              <span className="text-xs text-gray-400">
                                Version {doc.version}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {doc.project_name}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            catConfig.bgColor,
                            catConfig.color,
                            catConfig.borderColor
                          )}
                        >
                          {catConfig.label}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-500">
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-500">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-3 text-sm text-gray-500">
                        {doc.uploader_name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
