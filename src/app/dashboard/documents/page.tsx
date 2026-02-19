'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Files,
  Upload,
  Search,
  FileText,
  File,
  Download,
  Trash2,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  HardDrive,
  FolderOpen,
  X,
  ArrowUpDown,
  CheckSquare,
  Square,
  CloudUpload,
  FileSpreadsheet,
  FileCode,
  Image,
  FileCheck,
  Camera,
  Ruler,
  Palette,
  ScrollText,
  Shield,
  BarChart3,
  Eye,
  Share2,
  Copy,
  ChevronDown,
  SortAsc,
  SortDesc,
  Minus,
  Clock,
  Star,
  Filter,
  RefreshCw,
  Tag,
  History,
  Lock,
  CheckCircle2,
  FolderPlus,
  Archive,
  Globe,
} from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '@/lib/constants';

// ============================================
// Types
// ============================================

type DocumentCategory = 'plan' | 'render' | 'contract' | 'permit' | 'report' | 'photo' | 'other';
type SortField = 'name' | 'date' | 'size' | 'type';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

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
  shared: boolean;
  shared_with: string[];
  starred: boolean;
  locked: boolean;
  tags: string[];
  description: string;
  thumbnail_color: string;
}

// ============================================
// Category configuration with icons and inline colors
// ============================================

const categoryConfig: Record<
  DocumentCategory,
  { label: string; icon: typeof Files; color: string; bgColor: string; borderColor: string; textColor: string }
> = {
  plan: {
    label: 'Plans',
    icon: Ruler,
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1e40af',
  },
  render: {
    label: 'Rendus 3D',
    icon: Palette,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    textColor: '#6d28d9',
  },
  contract: {
    label: 'Contrats',
    icon: ScrollText,
    color: '#b45309',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    textColor: '#92400e',
  },
  permit: {
    label: 'Permis',
    icon: Shield,
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    textColor: '#065f46',
  },
  report: {
    label: 'Rapports',
    icon: BarChart3,
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    textColor: '#991b1b',
  },
  photo: {
    label: 'Photos',
    icon: Camera,
    color: '#0d9488',
    bgColor: '#f0fdfa',
    borderColor: '#5eead4',
    textColor: '#115e59',
  },
  other: {
    label: 'Autres',
    icon: FolderOpen,
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#d1d5db',
    textColor: '#374151',
  },
};

const categoryTabList: { value: DocumentCategory | 'all'; label: string; icon: typeof Files }[] = [
  { value: 'all', label: 'Tous', icon: Files },
  { value: 'plan', label: 'Plans', icon: Ruler },
  { value: 'render', label: 'Rendus 3D', icon: Palette },
  { value: 'contract', label: 'Contrats', icon: ScrollText },
  { value: 'permit', label: 'Permis', icon: Shield },
  { value: 'report', label: 'Rapports', icon: BarChart3 },
  { value: 'photo', label: 'Photos', icon: Camera },
  { value: 'other', label: 'Autres', icon: FolderOpen },
];

// ============================================
// Mock projects
// ============================================

const mockProjects = [
  { id: 'p1', name: 'Villa Méditerranée' },
  { id: 'p2', name: 'Bureaux Haussmann' },
  { id: 'p3', name: 'Résidence Émeraude' },
  { id: 'p4', name: 'École Jean Jaurès' },
  { id: 'p5', name: 'Maison Passive Collines' },
  { id: 'p6', name: 'Loft Bastille' },
];

// ============================================
// Mock documents (16 varied, realistic)
// ============================================

const mockDocuments: MockDocument[] = [
  {
    id: 'doc-1',
    project_id: 'p1',
    project_name: 'Villa Méditerranée',
    name: 'Plan RDC - Villa Méditerranée.dwg',
    file_url: '#',
    file_type: 'application/dwg',
    file_size: 4_250_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 3,
    category: 'plan',
    created_at: '2026-02-18T14:30:00Z',
    shared: true,
    shared_with: ['BET Structure', 'Entreprise Générale'],
    starred: true,
    locked: false,
    tags: ['APD', 'RDC', 'Architecture'],
    description: 'Plan du rez-de-chaussée, phase APD validée',
    thumbnail_color: '#dbeafe',
  },
  {
    id: 'doc-2',
    project_id: 'p2',
    project_name: 'Bureaux Haussmann',
    name: 'Rendu 3D façade principale.png',
    file_url: '#',
    file_type: 'image/png',
    file_size: 8_900_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 2,
    category: 'render',
    created_at: '2026-02-17T09:15:00Z',
    shared: true,
    shared_with: ['Client MOA'],
    starred: true,
    locked: false,
    tags: ['Façade', 'Présentation client'],
    description: 'Rendu photoréaliste façade haussmannienne rénovée',
    thumbnail_color: '#ede9fe',
  },
  {
    id: 'doc-3',
    project_id: 'p1',
    project_name: 'Villa Méditerranée',
    name: 'Contrat MOE - Phase PRO.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 1_200_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 2,
    category: 'contract',
    created_at: '2026-02-16T16:45:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: true,
    tags: ['MOE', 'PRO', 'Contrat'],
    description: 'Contrat de maîtrise d\'oeuvre signé, phase PRO',
    thumbnail_color: '#fef3c7',
  },
  {
    id: 'doc-4',
    project_id: 'p3',
    project_name: 'Résidence Émeraude',
    name: 'Permis de construire - Résidence Émeraude.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 15_800_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 1,
    category: 'permit',
    created_at: '2026-02-15T11:00:00Z',
    shared: true,
    shared_with: ['Mairie 13e', 'BET Thermique'],
    starred: true,
    locked: true,
    tags: ['PC', 'Dépôt', 'Urbanisme'],
    description: 'Dossier PC complet déposé le 15/02/2026',
    thumbnail_color: '#d1fae5',
  },
  {
    id: 'doc-5',
    project_id: 'p4',
    project_name: 'École Jean Jaurès',
    name: 'Rapport étude thermique RE2020.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 2_800_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 1,
    category: 'report',
    created_at: '2026-02-14T10:20:00Z',
    shared: true,
    shared_with: ['BET Thermique'],
    starred: false,
    locked: false,
    tags: ['RE2020', 'Thermique', 'ERP'],
    description: 'Étude thermique réglementaire RE2020 pour ERP type R',
    thumbnail_color: '#fee2e2',
  },
  {
    id: 'doc-6',
    project_id: 'p1',
    project_name: 'Villa Méditerranée',
    name: 'Photos chantier - Gros oeuvre semaine 12.jpg',
    file_url: '#',
    file_type: 'image/jpeg',
    file_size: 22_400_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'photo',
    created_at: '2026-02-13T15:30:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: false,
    tags: ['Chantier', 'Gros oeuvre', 'Suivi'],
    description: 'Reportage photo gros oeuvre, avancement semaine 12',
    thumbnail_color: '#ccfbf1',
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
    created_at: '2026-02-12T08:45:00Z',
    shared: true,
    shared_with: ['Entreprise Générale'],
    starred: false,
    locked: false,
    tags: ['DCE', 'CCTP', 'Lot 02'],
    description: 'Cahier des clauses techniques lot gros oeuvre',
    thumbnail_color: '#f3f4f6',
  },
  {
    id: 'doc-8',
    project_id: 'p3',
    project_name: 'Résidence Émeraude',
    name: 'Plan masse - Esquisse V2.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 6_100_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 2,
    category: 'plan',
    created_at: '2026-02-10T13:10:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: false,
    tags: ['Esquisse', 'Plan masse'],
    description: 'Plan de masse phase esquisse, deuxième itération',
    thumbnail_color: '#dbeafe',
  },
  {
    id: 'doc-9',
    project_id: 'p5',
    project_name: 'Maison Passive Collines',
    name: 'Coupe longitudinale A-A.dwg',
    file_url: '#',
    file_type: 'application/dwg',
    file_size: 3_780_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 1,
    category: 'plan',
    created_at: '2026-02-08T11:45:00Z',
    shared: true,
    shared_with: ['BET Structure'],
    starred: false,
    locked: false,
    tags: ['Coupe', 'Structure'],
    description: 'Coupe longitudinale passant par axe structurel A-A',
    thumbnail_color: '#dbeafe',
  },
  {
    id: 'doc-10',
    project_id: 'p4',
    project_name: 'École Jean Jaurès',
    name: 'Bordereau métrés UNTEC Lot 03.xlsx',
    file_url: '#',
    file_type: 'application/xlsx',
    file_size: 520_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 2,
    category: 'other',
    created_at: '2026-01-30T09:20:00Z',
    shared: true,
    shared_with: ['Économiste'],
    starred: false,
    locked: false,
    tags: ['UNTEC', 'Métrés', 'Lot 03'],
    description: 'Bordereau quantitatif UNTEC pour lot plomberie',
    thumbnail_color: '#f3f4f6',
  },
  {
    id: 'doc-11',
    project_id: 'p2',
    project_name: 'Bureaux Haussmann',
    name: 'Perspective intérieure hall d\'accueil.jpg',
    file_url: '#',
    file_type: 'image/jpeg',
    file_size: 12_400_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'render',
    created_at: '2026-01-28T16:00:00Z',
    shared: true,
    shared_with: ['Client MOA'],
    starred: true,
    locked: false,
    tags: ['Intérieur', 'Hall', 'Perspective'],
    description: 'Perspective intérieure du hall avec mobilier',
    thumbnail_color: '#ede9fe',
  },
  {
    id: 'doc-12',
    project_id: 'p5',
    project_name: 'Maison Passive Collines',
    name: 'Attestation conformité RE2020.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 890_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 1,
    category: 'permit',
    created_at: '2026-01-25T14:10:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: true,
    tags: ['RE2020', 'Attestation'],
    description: 'Attestation de conformité réglementaire RE2020',
    thumbnail_color: '#d1fae5',
  },
  {
    id: 'doc-13',
    project_id: 'p3',
    project_name: 'Résidence Émeraude',
    name: 'PV réception gros oeuvre - Lot 01.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 2_100_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 1,
    category: 'report',
    created_at: '2026-01-22T10:30:00Z',
    shared: true,
    shared_with: ['Entreprise GO', 'MOA'],
    starred: false,
    locked: true,
    tags: ['PV', 'Réception', 'Gros oeuvre'],
    description: 'Procès-verbal de réception des travaux gros oeuvre',
    thumbnail_color: '#fee2e2',
  },
  {
    id: 'doc-14',
    project_id: 'p1',
    project_name: 'Villa Méditerranée',
    name: 'Avenant n°2 - Travaux supplémentaires.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 680_000,
    uploaded_by: 'u1',
    uploader_name: 'Jean Dupont',
    version: 1,
    category: 'contract',
    created_at: '2026-01-20T08:00:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: true,
    tags: ['Avenant', 'Travaux sup.'],
    description: 'Avenant pour travaux complémentaires terrasse',
    thumbnail_color: '#fef3c7',
  },
  {
    id: 'doc-15',
    project_id: 'p4',
    project_name: 'École Jean Jaurès',
    name: 'Plan étage R+1 - Phase PRO.dwg',
    file_url: '#',
    file_type: 'application/dwg',
    file_size: 5_320_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 5,
    category: 'plan',
    created_at: '2026-01-18T13:45:00Z',
    shared: true,
    shared_with: ['BET Structure', 'BET Fluides'],
    starred: false,
    locked: false,
    tags: ['PRO', 'R+1', 'ERP'],
    description: 'Plan de l\'étage R+1, version PRO définitive',
    thumbnail_color: '#dbeafe',
  },
  {
    id: 'doc-16',
    project_id: 'p6',
    project_name: 'Loft Bastille',
    name: 'Rendu 3D terrasse panoramique.jpg',
    file_url: '#',
    file_type: 'image/jpeg',
    file_size: 9_700_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'render',
    created_at: '2026-01-15T09:00:00Z',
    shared: true,
    shared_with: ['Client MOA'],
    starred: true,
    locked: false,
    tags: ['Terrasse', 'Panoramique', 'Rendu'],
    description: 'Vue 3D de la terrasse avec panorama parisien',
    thumbnail_color: '#ede9fe',
  },
  {
    id: 'doc-17',
    project_id: 'p5',
    project_name: 'Maison Passive Collines',
    name: 'Photos terrain avant travaux.jpg',
    file_url: '#',
    file_type: 'image/jpeg',
    file_size: 18_600_000,
    uploaded_by: 'u2',
    uploader_name: 'Marie Laurent',
    version: 1,
    category: 'photo',
    created_at: '2026-01-12T09:00:00Z',
    shared: false,
    shared_with: [],
    starred: false,
    locked: false,
    tags: ['Terrain', 'Avant travaux'],
    description: 'Photos du terrain nu avant démarrage',
    thumbnail_color: '#ccfbf1',
  },
  {
    id: 'doc-18',
    project_id: 'p6',
    project_name: 'Loft Bastille',
    name: 'Diagnostic amiante avant travaux.pdf',
    file_url: '#',
    file_type: 'application/pdf',
    file_size: 3_200_000,
    uploaded_by: 'u3',
    uploader_name: 'Pierre Martin',
    version: 1,
    category: 'report',
    created_at: '2026-01-10T14:00:00Z',
    shared: true,
    shared_with: ['BET Amiante'],
    starred: false,
    locked: true,
    tags: ['Diagnostic', 'Amiante', 'Rénovation'],
    description: 'Rapport de diagnostic amiante avant démolition',
    thumbnail_color: '#fee2e2',
  },
];

// ============================================
// Storage calculations
// ============================================

const TOTAL_STORAGE_BYTES = 10 * 1_073_741_824; // 10 Go
const usedStorageBytes = mockDocuments.reduce((sum, doc) => sum + doc.file_size, 0);
const storagePercentage = Math.round((usedStorageBytes / TOTAL_STORAGE_BYTES) * 100);

// ============================================
// KPI computations
// ============================================

const sharedDocsCount = mockDocuments.filter((d) => d.shared).length;
const recentlyModifiedCount = mockDocuments.filter((d) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(d.created_at) >= sevenDaysAgo;
}).length;
const starredDocsCount = mockDocuments.filter((d) => d.starred).length;

// ============================================
// Helpers
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(1)} Mo`;
  return `${(bytes / 1_073_741_824).toFixed(2)} Go`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function formatDateRelative(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return formatDate(dateStr);
}

function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
}

function getFileIcon(fileType: string) {
  if (fileType.includes('dwg')) return FileCode;
  if (fileType.includes('xlsx') || fileType.includes('xls')) return FileSpreadsheet;
  if (fileType.startsWith('image/')) return Image;
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('doc')) return FileCheck;
  return File;
}

function getFileIconStyle(fileType: string): { color: string; bgColor: string } {
  if (fileType.includes('dwg')) return { color: '#6366f1', bgColor: '#eef2ff' };
  if (fileType.includes('xlsx') || fileType.includes('xls')) return { color: '#059669', bgColor: '#ecfdf5' };
  if (fileType.startsWith('image/') && fileType.includes('png')) return { color: '#7c3aed', bgColor: '#f5f3ff' };
  if (fileType.startsWith('image/')) return { color: '#0d9488', bgColor: '#f0fdfa' };
  if (fileType.includes('pdf')) return { color: '#dc2626', bgColor: '#fef2f2' };
  if (fileType.includes('doc')) return { color: '#2563EB', bgColor: '#eff6ff' };
  return { color: '#6b7280', bgColor: '#f9fafb' };
}

function getExtensionBadgeStyle(fileType: string): { color: string; bgColor: string } {
  if (fileType.includes('dwg')) return { color: '#4338ca', bgColor: '#e0e7ff' };
  if (fileType.includes('xlsx') || fileType.includes('xls')) return { color: '#047857', bgColor: '#d1fae5' };
  if (fileType.includes('png')) return { color: '#6d28d9', bgColor: '#ede9fe' };
  if (fileType.includes('jpeg') || fileType.includes('jpg')) return { color: '#0f766e', bgColor: '#ccfbf1' };
  if (fileType.includes('pdf')) return { color: '#b91c1c', bgColor: '#fee2e2' };
  if (fileType.includes('doc')) return { color: '#1d4ed8', bgColor: '#dbeafe' };
  return { color: '#4b5563', bgColor: '#f3f4f6' };
}

// ============================================
// Sort comparators
// ============================================

function sortDocuments(docs: MockDocument[], field: SortField, direction: SortDirection): MockDocument[] {
  const sorted = [...docs].sort((a, b) => {
    switch (field) {
      case 'name':
        return a.name.localeCompare(b.name, 'fr');
      case 'date':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'size':
        return a.file_size - b.file_size;
      case 'type':
        return a.file_type.localeCompare(b.file_type);
      default:
        return 0;
    }
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
}

// ============================================
// Page component
// ============================================

export default function DocumentsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [starredFilter, setStarredFilter] = useState(false);
  const [sharedFilter, setSharedFilter] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter logic
  const filteredDocuments = useMemo(() => {
    return sortDocuments(
      mockDocuments.filter((doc) => {
        const matchesSearch =
          searchQuery === '' ||
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory =
          selectedCategory === 'all' || doc.category === selectedCategory;
        const matchesProject =
          selectedProject === 'all' || doc.project_id === selectedProject;
        const matchesStarred = !starredFilter || doc.starred;
        const matchesShared = !sharedFilter || doc.shared;
        return matchesSearch && matchesCategory && matchesProject && matchesStarred && matchesShared;
      }),
      sortField,
      sortDirection
    );
  }, [searchQuery, selectedCategory, selectedProject, starredFilter, sharedFilter, sortField, sortDirection]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedProject !== 'all' ||
    starredFilter ||
    sharedFilter;

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProject('all');
    setStarredFilter(false);
    setSharedFilter(false);
  }

  // Selection logic
  const allSelected = filteredDocuments.length > 0 && filteredDocuments.every((doc) => selectedDocs.has(doc.id));
  const someSelected = filteredDocuments.some((doc) => selectedDocs.has(doc.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(filteredDocuments.map((d) => d.id)));
    }
  }

  function toggleSelectDoc(docId: string) {
    const next = new Set(selectedDocs);
    if (next.has(docId)) {
      next.delete(docId);
    } else {
      next.add(docId);
    }
    setSelectedDocs(next);
  }

  // Sort label
  const sortLabels: Record<SortField, string> = {
    name: 'Nom',
    date: 'Date',
    size: 'Taille',
    type: 'Type',
  };

  // Category counts
  const categoryCounts: Record<string, number> = { all: mockDocuments.length };
  for (const doc of mockDocuments) {
    categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
  }

  // Drag and drop handlers (visual only)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
              lineHeight: '1.2',
            }}
          >
            Documents
          </h1>
          <p style={{ marginTop: '6px', fontSize: '0.9rem', color: '#6b7280' }}>
            Gérez, organisez et partagez tous les documents de vos projets d'architecture
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#374151',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <FolderPlus style={{ width: '16px', height: '16px' }} />
            Nouveau dossier
          </button>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#2563EB',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            <Upload style={{ width: '16px', height: '16px' }} />
            Importer
          </Link>
        </div>
      </div>

      {/* ============================================
          4 KPI CARDS
          ============================================ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Total documents */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px 22px',
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total documents
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '6px', letterSpacing: '-0.02em' }}>
                {mockDocuments.length}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                sur {mockProjects.length} projets
              </p>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
              }}
            >
              <Files style={{ width: '24px', height: '24px', color: '#2563EB' }} />
            </div>
          </div>
        </div>

        {/* KPI 2: Storage */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px 22px',
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Stockage utilisé
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '6px', letterSpacing: '-0.02em' }}>
                {formatFileSize(usedStorageBytes)}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                sur {formatFileSize(TOTAL_STORAGE_BYTES)}
              </p>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: storagePercentage > 80 ? '#fef2f2' : storagePercentage > 60 ? '#fffbeb' : '#f0fdf4',
              }}
            >
              <HardDrive
                style={{
                  width: '24px',
                  height: '24px',
                  color: storagePercentage > 80 ? '#dc2626' : storagePercentage > 60 ? '#f59e0b' : '#16a34a',
                }}
              />
            </div>
          </div>
          {/* Mini progress bar */}
          <div
            style={{
              marginTop: '12px',
              width: '100%',
              height: '6px',
              borderRadius: '999px',
              backgroundColor: '#f3f4f6',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${storagePercentage}%`,
                height: '100%',
                borderRadius: '999px',
                backgroundColor: storagePercentage > 80 ? '#dc2626' : storagePercentage > 60 ? '#f59e0b' : '#16a34a',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* KPI 3: Shared */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px 22px',
            transition: 'box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onClick={() => {
            setSharedFilter(!sharedFilter);
            setStarredFilter(false);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Partagés
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '6px', letterSpacing: '-0.02em' }}>
                {sharedDocsCount}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                avec BET, MOA, entreprises
              </p>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: sharedFilter ? '#dbeafe' : '#faf5ff',
                border: sharedFilter ? '2px solid #2563EB' : 'none',
              }}
            >
              <Share2 style={{ width: '24px', height: '24px', color: sharedFilter ? '#2563EB' : '#7c3aed' }} />
            </div>
          </div>
        </div>

        {/* KPI 4: Recently modified */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '20px 22px',
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Récemment modifiés
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '6px', letterSpacing: '-0.02em' }}>
                {recentlyModifiedCount}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                dans les 7 derniers jours
              </p>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fff7ed',
              }}
            >
              <Clock style={{ width: '24px', height: '24px', color: '#f97316' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          DRAG & DROP UPLOAD ZONE
          ============================================ */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-3"
        style={{
          border: isDragOver ? '2px solid #2563EB' : '2px dashed #d1d5db',
          borderRadius: '14px',
          padding: isDragOver ? '40px 24px' : '28px 24px',
          backgroundColor: isDragOver ? '#eff6ff' : '#fafbfc',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => { /* Would trigger file input */ }}
      >
        {isDragOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: isDragOver ? '#dbeafe' : '#f3f4f6',
              transition: 'all 0.25s',
            }}
          >
            <CloudUpload
              style={{
                width: '26px',
                height: '26px',
                color: isDragOver ? '#2563EB' : '#9ca3af',
                transition: 'color 0.25s',
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isDragOver ? '#2563EB' : '#374151' }}>
              {isDragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers ici'}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '3px' }}>
              ou{' '}
              <span style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                parcourir
              </span>{' '}
              — PDF, DWG, IFC, JPG, PNG, DOCX, XLSX (max 500 Mo)
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          CATEGORY FILTER TABS
          ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '6px',
        }}
      >
        <div className="flex items-center gap-1 overflow-x-auto" style={{ padding: '2px' }}>
          {categoryTabList.map((tab) => {
            const isActive = selectedCategory === tab.value;
            const TabIcon = tab.icon;
            const count = categoryCounts[tab.value] || 0;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(isActive && tab.value !== 'all' ? 'all' : tab.value)}
                className="flex items-center gap-2 shrink-0"
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#6b7280',
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <TabIcon style={{ width: '15px', height: '15px' }} />
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: isActive ? 'rgba(255,255,255,0.9)' : '#9ca3af',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    minWidth: '22px',
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================
          TOOLBAR: search, project filter, sort, view toggle
          ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '16px 20px',
        }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute"
              style={{
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par nom, projet ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                padding: '10px 14px 10px 42px',
                fontSize: '0.875rem',
                color: '#111827',
                backgroundColor: '#fafbfc',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = '#fafbfc';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute"
                style={{
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  color: '#9ca3af',
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>

          {/* Project filter */}
          <div className="relative">
            <FolderOpen
              className="absolute"
              style={{
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}
            />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                appearance: 'none',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                padding: '10px 36px 10px 40px',
                fontSize: '0.875rem',
                color: '#111827',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="all">Tous les projets</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute"
              style={{
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '14px',
                height: '14px',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Starred filter */}
          <button
            onClick={() => setStarredFilter(!starredFilter)}
            className="flex items-center gap-1.5"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: starredFilter ? '1px solid #f59e0b' : '1px solid #e5e7eb',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: starredFilter ? '#b45309' : '#6b7280',
              backgroundColor: starredFilter ? '#fffbeb' : '#fafbfc',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <Star style={{ width: '15px', height: '15px', fill: starredFilter ? '#f59e0b' : 'none', color: starredFilter ? '#f59e0b' : '#9ca3af' }} />
            Favoris
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              <ArrowUpDown style={{ width: '15px', height: '15px', color: '#6b7280' }} />
              <span>{sortLabels[sortField]}</span>
              {sortDirection === 'asc' ? (
                <SortAsc style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
              ) : (
                <SortDesc style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
              )}
            </button>
            {showSortDropdown && (
              <div
                className="absolute"
                style={{
                  right: 0,
                  top: '46px',
                  zIndex: 20,
                  width: '200px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 12px 28px -5px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.06)',
                  padding: '4px',
                }}
              >
                {(['date', 'name', 'size', 'type'] as SortField[]).map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      if (sortField === field) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortField(field);
                        setSortDirection(field === 'date' ? 'desc' : 'asc');
                      }
                      setShowSortDropdown(false);
                    }}
                    className="flex items-center justify-between w-full"
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: sortField === field ? 600 : 400,
                      color: sortField === field ? '#2563EB' : '#374151',
                      backgroundColor: sortField === field ? '#eff6ff' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (sortField !== field) e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      if (sortField !== field) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{sortLabels[field]}</span>
                    {sortField === field && (
                      sortDirection === 'asc' ? (
                        <SortAsc style={{ width: '14px', height: '14px' }} />
                      ) : (
                        <SortDesc style={{ width: '14px', height: '14px' }} />
                      )
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div
            className="flex items-center gap-1"
            style={{
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              padding: '3px',
              backgroundColor: '#fafbfc',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center justify-center"
              style={{
                padding: '7px 10px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? '#2563EB' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#9ca3af',
                transition: 'all 0.2s',
              }}
            >
              <LayoutGrid style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center justify-center"
              style={{
                padding: '7px 10px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? '#2563EB' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : '#9ca3af',
                transition: 'all 0.2s',
              }}
            >
              <List style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Bulk actions bar */}
        {someSelected && (
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563EB' }}>
              {selectedDocs.size} document{selectedDocs.size > 1 ? 's' : ''} sélectionné{selectedDocs.size > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
              <button
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Download style={{ width: '14px', height: '14px' }} />
                Télécharger
              </button>
              <button
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Share2 style={{ width: '14px', height: '14px' }} />
                Partager
              </button>
              <button
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Archive style={{ width: '14px', height: '14px' }} />
                Archiver
              </button>
              <button
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #fca5a5',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#dc2626',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
                Supprimer
              </button>
              <button
                onClick={() => setSelectedDocs(new Set())}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  color: '#9ca3af',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Active text filters */}
        {hasActiveFilters && (
          <div
            className="flex items-center gap-2 flex-wrap"
            style={{
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <Filter style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Filtres actifs :</span>
            {searchQuery && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#1d4ed8',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                }}
              >
                &laquo; {searchQuery} &raquo;
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#1d4ed8', display: 'flex' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: categoryConfig[selectedCategory].textColor,
                  backgroundColor: categoryConfig[selectedCategory].bgColor,
                  border: `1px solid ${categoryConfig[selectedCategory].borderColor}`,
                }}
              >
                {categoryConfig[selectedCategory].label}
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: categoryConfig[selectedCategory].textColor,
                    display: 'flex',
                  }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            )}
            {selectedProject !== 'all' && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                }}
              >
                {mockProjects.find((p) => p.id === selectedProject)?.name}
                <button
                  onClick={() => setSelectedProject('all')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#374151', display: 'flex' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            )}
            {starredFilter && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#b45309',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fcd34d',
                }}
              >
                Favoris
                <button
                  onClick={() => setStarredFilter(false)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#b45309', display: 'flex' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            )}
            {sharedFilter && (
              <span
                className="inline-flex items-center gap-1"
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6d28d9',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #c4b5fd',
                }}
              >
                Partagés
                <button
                  onClick={() => setSharedFilter(false)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#6d28d9', display: 'flex' }}
                >
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              style={{
                marginLeft: 'auto',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#dc2626',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              Effacer tout
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          RESULTS COUNT + SELECT ALL
          ============================================ */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
          <span style={{ fontWeight: 600, color: '#111827' }}>{filteredDocuments.length}</span>{' '}
          document{filteredDocuments.length !== 1 ? 's' : ''}{' '}
          {hasActiveFilters ? 'trouvés' : 'au total'}
          {hasActiveFilters && (
            <span style={{ color: '#9ca3af' }}> sur {mockDocuments.length}</span>
          )}
        </p>
        {filteredDocuments.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2"
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: allSelected ? '#2563EB' : '#6b7280',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {allSelected ? (
              <CheckSquare style={{ width: '15px', height: '15px', color: '#2563EB' }} />
            ) : someSelected ? (
              <Minus style={{ width: '15px', height: '15px', color: '#2563EB' }} />
            ) : (
              <Square style={{ width: '15px', height: '15px' }} />
            )}
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        )}
      </div>

      {/* ============================================
          CONTENT
          ============================================ */}
      {filteredDocuments.length === 0 ? (
        /* ============================================
           EMPTY STATE
           ============================================ */
        <div
          className="flex flex-col items-center justify-center"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '72px 24px',
            textAlign: 'center',
          }}
        >
          {/* Illustration */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '24px',
                backgroundColor: '#f3f4f6',
                position: 'relative',
              }}
            >
              <Files style={{ width: '40px', height: '40px', color: '#d1d5db' }} />
            </div>
            {/* Decorative dots */}
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search style={{ width: '12px', height: '12px', color: '#93c5fd' }} />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-10px',
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter style={{ width: '10px', height: '10px', color: '#fbbf24' }} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
            Aucun document trouvé
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px', maxWidth: '380px', lineHeight: '1.6' }}>
            Aucun document ne correspond à vos critères de recherche.
            Essayez de modifier vos filtres ou importez un nouveau document.
          </p>
          <div className="flex items-center gap-3" style={{ marginTop: '24px' }}>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <RefreshCw style={{ width: '15px', height: '15px' }} />
              Réinitialiser les filtres
            </button>
            <Link
              href="/dashboard/documents/new"
              className="flex items-center gap-2"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#2563EB',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
            >
              <Upload style={{ width: '15px', height: '15px' }} />
              Importer un document
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* ============================================
           GRID VIEW
           ============================================ */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredDocuments.map((doc) => {
            const IconComponent = getFileIcon(doc.file_type);
            const iconStyle = getFileIconStyle(doc.file_type);
            const catConfig = categoryConfig[doc.category];
            const ext = getFileExtension(doc.name);
            const extBadge = getExtensionBadgeStyle(doc.file_type);
            const isSelected = selectedDocs.has(doc.id);
            const isHovered = hoveredCardId === doc.id;

            return (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #e5e7eb',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCardId(doc.id)}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  if (menuOpen === doc.id) return;
                  setMenuOpen(null);
                }}
              >
                {/* Thumbnail area */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: '120px',
                    backgroundColor: doc.thumbnail_color,
                    position: 'relative',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <IconComponent
                    style={{
                      width: '40px',
                      height: '40px',
                      color: iconStyle.color,
                      opacity: 0.6,
                    }}
                  />

                  {/* Extension badge on thumbnail */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      color: extBadge.color,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    {ext}
                  </div>

                  {/* Shared indicator */}
                  {doc.shared && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: '#6d28d9',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Globe style={{ width: '10px', height: '10px' }} />
                      Partagé
                    </div>
                  )}

                  {/* Checkbox overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      opacity: isSelected || isHovered ? 1 : 0,
                      transition: 'opacity 0.15s',
                      zIndex: 2,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectDoc(doc.id);
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.8)',
                        backgroundColor: isSelected ? '#2563EB' : 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(4px)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#ffffff' : '#6b7280',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSelected ? (
                        <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                      ) : (
                        <Square style={{ width: '14px', height: '14px' }} />
                      )}
                    </button>
                  </div>

                  {/* Starred + Menu overlay */}
                  <div
                    className="flex items-center gap-1"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      opacity: isSelected || isHovered || doc.starred ? 1 : 0,
                      transition: 'opacity 0.15s',
                      zIndex: 2,
                    }}
                  >
                    {doc.starred && (
                      <div
                        style={{
                          padding: '4px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                        }}
                      >
                        <Star style={{ width: '14px', height: '14px', fill: '#f59e0b', color: '#f59e0b' }} />
                      </div>
                    )}
                    {doc.locked && (
                      <div
                        style={{
                          padding: '4px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                        }}
                      >
                        <Lock style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                      </div>
                    )}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === doc.id ? null : doc.id);
                        }}
                        style={{
                          padding: '4px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          backdropFilter: 'blur(4px)',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: isHovered ? 'flex' : 'none',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)')}
                      >
                        <MoreVertical style={{ width: '16px', height: '16px' }} />
                      </button>
                      {menuOpen === doc.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '32px',
                            zIndex: 30,
                            width: '200px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 12px 28px -5px rgba(0,0,0,0.12)',
                            padding: '4px',
                          }}
                        >
                          {[
                            { icon: Eye, label: 'Aperçu', color: '#374151' },
                            { icon: Download, label: 'Télécharger', color: '#374151' },
                            { icon: Share2, label: 'Partager', color: '#374151' },
                            { icon: Copy, label: 'Dupliquer', color: '#374151' },
                            { icon: History, label: 'Historique versions', color: '#374151' },
                            { icon: Tag, label: 'Modifier les tags', color: '#374151' },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              className="flex items-center gap-2.5 w-full"
                              style={{
                                padding: '9px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                color: item.color,
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <item.icon style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                              {item.label}
                            </button>
                          ))}
                          <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '4px 0' }} />
                          <button
                            className="flex items-center gap-2.5 w-full"
                            style={{
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8125rem',
                              color: '#dc2626',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: isSelected ? '15px' : '16px' }}>
                  {/* File name */}
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.3',
                    }}
                    title={doc.name}
                  >
                    {doc.name}
                  </h3>

                  {/* Project name */}
                  <p
                    className="flex items-center gap-1.5"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <FolderOpen style={{ width: '12px', height: '12px', color: '#9ca3af', flexShrink: 0 }} />
                    {doc.project_name}
                  </p>

                  {/* Badges row */}
                  <div className="flex items-center gap-1.5 flex-wrap" style={{ marginTop: '10px' }}>
                    {/* Category badge */}
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: catConfig.textColor,
                        backgroundColor: catConfig.bgColor,
                        border: `1px solid ${catConfig.borderColor}`,
                      }}
                    >
                      {catConfig.label}
                    </span>
                    {/* Version badge */}
                    {doc.version > 1 && (
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '999px',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          backgroundColor: '#f3f4f6',
                        }}
                      >
                        v{doc.version}
                      </span>
                    )}
                    {/* Tags (max 2) */}
                    {doc.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '2px 7px',
                          borderRadius: '999px',
                          fontSize: '0.625rem',
                          fontWeight: 500,
                          color: '#4b5563',
                          backgroundColor: '#f9fafb',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '999px',
                          fontSize: '0.625rem',
                          fontWeight: 500,
                          color: '#9ca3af',
                        }}
                      >
                        +{doc.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div
                    className="flex items-center justify-between"
                    style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid #f3f4f6',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                        <Calendar style={{ width: '11px', height: '11px' }} />
                        {formatDateRelative(doc.created_at)}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                        <HardDrive style={{ width: '11px', height: '11px' }} />
                        {formatFileSize(doc.file_size)}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '999px',
                        backgroundColor: '#f3f4f6',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: '#6b7280',
                      }}
                      title={doc.uploader_name}
                    >
                      {doc.uploader_name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>

                  {/* Hover action buttons */}
                  {isHovered && (
                    <div
                      className="flex gap-2"
                      style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #f3f4f6',
                      }}
                    >
                      <button
                        className="flex flex-1 items-center justify-center gap-1.5"
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#374151',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.borderColor = '#bfdbfe';
                          e.currentTarget.style.color = '#2563EB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <Eye style={{ width: '13px', height: '13px' }} />
                        Aperçu
                      </button>
                      <button
                        className="flex flex-1 items-center justify-center gap-1.5"
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#374151',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0fdf4';
                          e.currentTarget.style.borderColor = '#86efac';
                          e.currentTarget.style.color = '#16a34a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <Download style={{ width: '13px', height: '13px' }} />
                        Télécharger
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ============================================
           LIST VIEW
           ============================================ */
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  <th
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      width: '40px',
                    }}
                  >
                    <button
                      onClick={toggleSelectAll}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: allSelected ? '#2563EB' : '#d1d5db',
                        display: 'flex',
                      }}
                    >
                      {allSelected ? (
                        <CheckSquare style={{ width: '16px', height: '16px' }} />
                      ) : someSelected ? (
                        <Minus style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                      ) : (
                        <Square style={{ width: '16px', height: '16px' }} />
                      )}
                    </button>
                  </th>
                  {[
                    { label: 'Nom', className: '', width: undefined },
                    { label: 'Projet', className: 'hidden sm:table-cell', width: undefined },
                    { label: 'Catégorie', className: 'hidden md:table-cell', width: undefined },
                    { label: 'Taille', className: 'hidden lg:table-cell', width: undefined },
                    { label: 'Modifié le', className: 'hidden lg:table-cell', width: undefined },
                    { label: 'Partagé', className: 'hidden xl:table-cell', width: undefined },
                  ].map((col, idx) => (
                    <th
                      key={idx}
                      className={col.className}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => {
                  const IconComponent = getFileIcon(doc.file_type);
                  const iconStyle = getFileIconStyle(doc.file_type);
                  const catConfig = categoryConfig[doc.category];
                  const ext = getFileExtension(doc.name);
                  const extBadge = getExtensionBadgeStyle(doc.file_type);
                  const isSelected = selectedDocs.has(doc.id);

                  return (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: index < filteredDocuments.length - 1 ? '1px solid #f9fafb' : 'none',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#fafbfc';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => toggleSelectDoc(doc.id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: isSelected ? '#2563EB' : '#d1d5db',
                            display: 'flex',
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <Square style={{ width: '16px', height: '16px' }} />
                          )}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center shrink-0"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor: iconStyle.bgColor,
                            }}
                          >
                            <IconComponent style={{ width: '20px', height: '20px', color: iconStyle.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                style={{
                                  fontSize: '0.8125rem',
                                  fontWeight: 600,
                                  color: '#111827',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '280px',
                                }}
                              >
                                {doc.name}
                              </p>
                              {doc.starred && (
                                <Star style={{ width: '12px', height: '12px', fill: '#f59e0b', color: '#f59e0b', flexShrink: 0 }} />
                              )}
                              {doc.locked && (
                                <Lock style={{ width: '12px', height: '12px', color: '#9ca3af', flexShrink: 0 }} />
                              )}
                            </div>
                            <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                              <span
                                style={{
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.6rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.05em',
                                  color: extBadge.color,
                                  backgroundColor: extBadge.bgColor,
                                }}
                              >
                                {ext}
                              </span>
                              {doc.version > 1 && (
                                <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                                  v{doc.version}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell" style={{ padding: '12px 16px' }}>
                        <span
                          className="flex items-center gap-1.5"
                          style={{ fontSize: '0.8125rem', color: '#4b5563' }}
                        >
                          <FolderOpen style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                          {doc.project_name}
                        </span>
                      </td>
                      <td className="hidden md:table-cell" style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: catConfig.textColor,
                            backgroundColor: catConfig.bgColor,
                            border: `1px solid ${catConfig.borderColor}`,
                          }}
                        >
                          {catConfig.label}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell" style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
                          {formatFileSize(doc.file_size)}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell" style={{ padding: '12px 16px' }}>
                        <div>
                          <span style={{ fontSize: '0.8125rem', color: '#374151' }}>
                            {formatDate(doc.created_at)}
                          </span>
                          <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '1px' }}>
                            {formatDateRelative(doc.created_at)}
                          </p>
                        </div>
                      </td>
                      <td className="hidden xl:table-cell" style={{ padding: '12px 16px' }}>
                        {doc.shared ? (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="flex items-center justify-center"
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '999px',
                                backgroundColor: '#ecfdf5',
                              }}
                            >
                              <CheckCircle2 style={{ width: '12px', height: '12px', color: '#059669' }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>
                              {doc.shared_with.length} dest.
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#d1d5db' }}>
                            Non partagé
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            title="Aperçu"
                            style={{
                              padding: '7px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#eff6ff';
                              e.currentTarget.style.color = '#2563EB';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#9ca3af';
                            }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            title="Télécharger"
                            style={{
                              padding: '7px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0fdf4';
                              e.currentTarget.style.color = '#16a34a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#9ca3af';
                            }}
                          >
                            <Download style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            title="Partager"
                            style={{
                              padding: '7px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f5f3ff';
                              e.currentTarget.style.color = '#7c3aed';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#9ca3af';
                            }}
                          >
                            <Share2 style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            title="Supprimer"
                            style={{
                              padding: '7px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fef2f2';
                              e.currentTarget.style.color = '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#9ca3af';
                            }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
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

      {/* ============================================
          FOOTER STORAGE INFO BAR
          ============================================ */}
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '16px 20px',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
            }}
          >
            <HardDrive style={{ width: '18px', height: '18px', color: '#2563EB' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
              {formatFileSize(usedStorageBytes)} utilisés sur {formatFileSize(TOTAL_STORAGE_BYTES)}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {formatFileSize(TOTAL_STORAGE_BYTES - usedStorageBytes)} disponibles — {mockDocuments.length} fichiers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            style={{
              width: '180px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: '#f3f4f6',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${storagePercentage}%`,
                height: '100%',
                borderRadius: '999px',
                backgroundColor: storagePercentage > 80 ? '#dc2626' : storagePercentage > 60 ? '#f59e0b' : '#2563EB',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: storagePercentage > 80 ? '#dc2626' : storagePercentage > 60 ? '#f59e0b' : '#2563EB',
            }}
          >
            {storagePercentage}%
          </span>
        </div>
      </div>

      {/* Click-away handler for dropdowns */}
      {(menuOpen || showSortDropdown) && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 10 }}
          onClick={() => {
            setMenuOpen(null);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
}
