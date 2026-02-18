'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Plus,
  Upload,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Activity,
  FileText,
  Image,
  FolderOpen,
  Calendar,
  MapPin,
  Ruler,
  Euro,
  User,
  ClipboardList,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getPhaseLabel,
  getInitials,
  cn,
} from '@/lib/utils';
import { PROJECT_PHASES, TASK_PRIORITIES, DOCUMENT_CATEGORIES } from '@/lib/constants';
import type {
  Project,
  ProjectPhase,
  TaskStatus,
  TaskPriority,
} from '@/types';

// ============================================
// Mock Data
// ============================================

interface MockTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_name: string;
  due_date: string | null;
}

interface MockDocument {
  id: string;
  name: string;
  category: 'plan' | 'render' | 'contract' | 'permit' | 'report' | 'photo' | 'other';
  file_type: string;
  file_size: number;
  created_at: string;
}

interface MockComment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface MockActivity {
  id: string;
  action: string;
  description: string;
  user_name: string;
  created_at: string;
  icon_type: 'task' | 'document' | 'comment' | 'phase' | 'general';
}

interface ProjectDetail extends Project {
  client_name: string;
  tasks: MockTask[];
  documents: MockDocument[];
  comments: MockComment[];
  activities: MockActivity[];
  progress: number;
}

const MOCK_PROJECTS: Record<string, ProjectDetail> = {
  '1': {
    id: '1',
    name: 'Résidence Les Terrasses',
    description: 'Construction neuve R+3, 24 logements collectifs avec parking souterrain, espaces verts et local commercial en rez-de-chaussée.',
    reference: 'PRJ-00012',
    client_id: 'c1',
    client_name: 'SCI Les Terrasses',
    status: 'active',
    phase: 'dce',
    budget: 320000,
    surface_m2: 2400,
    address: '12 rue des Lilas',
    city: 'Lyon',
    postal_code: '69003',
    start_date: '2025-09-01',
    end_date: '2026-12-31',
    created_by: 'u1',
    created_at: '2025-09-01',
    updated_at: '2026-02-15',
    progress: 50,
    tasks: [
      {
        id: 't1',
        title: 'Finaliser les plans d\'execution structure',
        status: 'in_progress',
        priority: 'high',
        assignee_name: 'Jean Dupont',
        due_date: '2026-02-28',
      },
      {
        id: 't2',
        title: 'Rediger le CCTP Lot 01 - Gros oeuvre',
        status: 'todo',
        priority: 'high',
        assignee_name: 'Marie Laurent',
        due_date: '2026-03-10',
      },
      {
        id: 't3',
        title: 'Verification conformite thermique RE2020',
        status: 'review',
        priority: 'medium',
        assignee_name: 'Pierre Martin',
        due_date: '2026-02-25',
      },
      {
        id: 't4',
        title: 'Mise a jour du planning general',
        status: 'done',
        priority: 'low',
        assignee_name: 'Jean Dupont',
        due_date: '2026-02-15',
      },
      {
        id: 't5',
        title: 'Consultation entreprises - Lot Electricite',
        status: 'todo',
        priority: 'urgent',
        assignee_name: 'Marie Laurent',
        due_date: '2026-03-05',
      },
    ],
    documents: [
      {
        id: 'd1',
        name: 'Plans RDC - Phase DCE v3.dwg',
        category: 'plan',
        file_type: 'application/dwg',
        file_size: 4250000,
        created_at: '2026-02-14',
      },
      {
        id: 'd2',
        name: 'Rendu facade sud.png',
        category: 'render',
        file_type: 'image/png',
        file_size: 8900000,
        created_at: '2026-02-10',
      },
      {
        id: 'd3',
        name: 'Contrat MOE signe.pdf',
        category: 'contract',
        file_type: 'application/pdf',
        file_size: 1200000,
        created_at: '2025-09-15',
      },
      {
        id: 'd4',
        name: 'Rapport etude thermique.pdf',
        category: 'report',
        file_type: 'application/pdf',
        file_size: 2800000,
        created_at: '2026-01-20',
      },
    ],
    comments: [
      {
        id: 'cm1',
        user_name: 'Jean Dupont',
        content: 'J\'ai mis à jour les plans du RDC pour intégrer les remarques du bureau de contrôle. Les réserves sur les sorties de secours ont été levées.',
        created_at: '2026-02-16T14:30:00Z',
      },
      {
        id: 'cm2',
        user_name: 'Marie Laurent',
        content: 'Le client a validé les choix de matériaux pour les parties communes. On peut lancer la rédaction des CCTP.',
        created_at: '2026-02-14T09:15:00Z',
      },
      {
        id: 'cm3',
        user_name: 'Pierre Martin',
        content: 'Attention : le rapport thermique montre un depassement du Bbio sur la facade nord. Il faudra renforcer l\'isolation ou modifier les surfaces vitrees.',
        created_at: '2026-02-12T16:45:00Z',
      },
    ],
    activities: [
      {
        id: 'a1',
        action: 'document_upload',
        description: 'A importé "Plans RDC - Phase DCE v3.dwg"',
        user_name: 'Jean Dupont',
        created_at: '2026-02-14T15:00:00Z',
        icon_type: 'document',
      },
      {
        id: 'a2',
        action: 'task_completed',
        description: 'A terminé "Mise a jour du planning general"',
        user_name: 'Jean Dupont',
        created_at: '2026-02-15T10:30:00Z',
        icon_type: 'task',
      },
      {
        id: 'a3',
        action: 'comment_added',
        description: 'A ajouté un commentaire sur le projet',
        user_name: 'Pierre Martin',
        created_at: '2026-02-12T16:45:00Z',
        icon_type: 'comment',
      },
      {
        id: 'a4',
        action: 'phase_changed',
        description: 'Phase du projet changée de PRO a DCE',
        user_name: 'Jean Dupont',
        created_at: '2026-02-01T09:00:00Z',
        icon_type: 'phase',
      },
      {
        id: 'a5',
        action: 'task_created',
        description: 'A créé la tâche "Consultation entreprises - Lot Electricite"',
        user_name: 'Marie Laurent',
        created_at: '2026-02-10T11:20:00Z',
        icon_type: 'task',
      },
    ],
  },
};

// ============================================
// Helpers
// ============================================

function getTaskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    todo: 'À faire',
    in_progress: 'En cours',
    review: 'En revue',
    done: 'Terminé',
  };
  return labels[status] || status;
}

function getPriorityConfig(priority: TaskPriority) {
  const config: Record<TaskPriority, { label: string; color: string; dotColor: string }> = {
    low: { label: 'Basse', color: 'text-gray-500', dotColor: 'bg-gray-400' },
    medium: { label: 'Moyenne', color: 'text-amber-600', dotColor: 'bg-amber-400' },
    high: { label: 'Haute', color: 'text-orange-600', dotColor: 'bg-orange-500' },
    urgent: { label: 'Urgente', color: 'text-red-600', dotColor: 'bg-red-500' },
  };
  return config[priority] || config.low;
}

function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    prospect: 'bg-slate-100 text-slate-700',
    esquisse: 'bg-violet-50 text-violet-700',
    aps: 'bg-indigo-50 text-indigo-700',
    apd: 'bg-blue-50 text-blue-700',
    pro: 'bg-sky-50 text-sky-700',
    dce: 'bg-teal-50 text-teal-700',
    act: 'bg-green-50 text-green-700',
    visa: 'bg-lime-50 text-lime-700',
    det: 'bg-yellow-50 text-yellow-700',
    aor: 'bg-orange-50 text-orange-700',
    reception: 'bg-red-50 text-red-700',
    delivered: 'bg-emerald-50 text-emerald-700',
  };
  return colors[phase] || 'bg-gray-100 text-gray-700';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
}

function getCategoryLabel(category: string): string {
  const cat = DOCUMENT_CATEGORIES.find((c) => c.value === category);
  return cat ? cat.label : category;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    plan: 'bg-blue-50 text-blue-700 border-blue-200',
    render: 'bg-purple-50 text-purple-700 border-purple-200',
    contract: 'bg-amber-50 text-amber-700 border-amber-200',
    permit: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    report: 'bg-red-50 text-red-700 border-red-200',
    photo: 'bg-teal-50 text-teal-700 border-teal-200',
    other: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return colors[category] || 'bg-gray-50 text-gray-600 border-gray-200';
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return Image;
  return FileText;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

function getActivityIcon(iconType: string) {
  switch (iconType) {
    case 'task':
      return ClipboardList;
    case 'document':
      return FileText;
    case 'comment':
      return MessageSquare;
    case 'phase':
      return Activity;
    default:
      return Activity;
  }
}

function getActivityIconColor(iconType: string): string {
  switch (iconType) {
    case 'task':
      return 'bg-blue-100 text-blue-600';
    case 'document':
      return 'bg-emerald-100 text-emerald-600';
    case 'comment':
      return 'bg-purple-100 text-purple-600';
    case 'phase':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

// ============================================
// Tab Types
// ============================================

type TabKey = 'tâches' | 'documents' | 'commentaires' | 'activité';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'tâches', label: 'Tâches', icon: ClipboardList },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'commentaires', label: 'Commentaires', icon: MessageSquare },
  { key: 'activité', label: 'Activité', icon: Activity },
];

// ============================================
// Component
// ============================================

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabKey>('tâches');
  const [commentText, setCommentText] = useState('');

  // Get project data (fallback for unknown IDs)
  const project = MOCK_PROJECTS[projectId] || MOCK_PROJECTS['1'];

  // Determiné current phase index for timeline
  const currentPhaseIndex = PROJECT_PHASES.findIndex((p) => p.key === project.phase);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  getPhaseColor(project.phase)
                )}
              >
                {getPhaseLabel(project.phase)}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  getStatusColor(project.status)
                )}
              >
                {getStatusLabel(project.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {project.reference} - {project.client_name}
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Edit className="h-4 w-4" />
          Modifier
        </button>
      </div>

      {/* Phase Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 overflow-x-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Avancement des phases</p>
        <div className="flex items-center gap-0 min-w-[700px]">
          {PROJECT_PHASES.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isFuture = index > currentPhaseIndex;
            return (
              <div key={phase.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-[#2563EB] text-white ring-4 ring-blue-100'
                          : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-1.5 text-[10px] font-medium text-center leading-tight',
                      isCompleted
                        ? 'text-emerald-600'
                        : isCurrent
                          ? 'text-[#2563EB] font-semibold'
                          : 'text-gray-400'
                    )}
                  >
                    {phase.label}
                  </span>
                </div>
                {index < PROJECT_PHASES.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 -mt-4',
                      index < currentPhaseIndex ? 'bg-emerald-400' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Client & Project Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations du projet</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm font-medium text-gray-900">{project.client_name}</p>
              </div>
            </div>
            {project.address && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Adresse</p>
                  <p className="text-sm text-gray-900">
                    {project.address}, {project.postal_code} {project.city}
                  </p>
                </div>
              </div>
            )}
            {project.surface_m2 && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                  <Ruler className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Surface</p>
                  <p className="text-sm text-gray-900">{project.surface_m2} m2</p>
                </div>
              </div>
            )}
            {project.budget && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <Euro className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <FolderOpen className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Référence</p>
                <p className="text-sm font-mono text-gray-900">{project.reference}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress & Dates */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Avancement</h3>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Progression globale</p>
                <p className="text-sm font-bold text-gray-900">{project.progress}%</p>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Phase actuelle</span>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    getPhaseColor(project.phase)
                  )}
                >
                  {getPhaseLabel(project.phase)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date de début</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {project.start_date ? formatDate(project.start_date) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date de fin estimée</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {project.end_date ? formatDate(project.end_date) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            let count = 0;
            if (tab.key === 'tâches') count = project.tasks.length;
            if (tab.key === 'documents') count = project.documents.length;
            if (tab.key === 'commentaires') count = project.comments.length;
            if (tab.key === 'activité') count = project.activities.length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* ===== TACHES TAB ===== */}
        {activeTab === 'tâches' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">
                {project.tasks.length} tâche{project.tasks.length !== 1 ? 's' : ''}
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </button>
            </div>
            {project.tasks.map((task) => {
              const priorityConfig = getPriorityConfig(task.priority);
              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            getStatusColor(task.status)
                          )}
                        >
                          {getTaskStatusLabel(task.status)}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <span className={cn('inline-block h-2 w-2 rounded-full', priorityConfig.dotColor)} />
                          <span className={cn('font-medium', priorityConfig.color)}>
                            {priorityConfig.label}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                        {getInitials(task.assignee_name)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assignee_name}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== DOCUMENTS TAB ===== */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">
                {project.documents.length} document{project.documents.length !== 1 ? 's' : ''}
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.documents.map((doc) => {
                const IconComp = getFileIcon(doc.file_type);
                return (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                        <IconComp className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                              getCategoryColor(doc.category)
                            )}
                          >
                            {getCategoryLabel(doc.category)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{formatDate(doc.created_at)}</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== COMMENTAIRES TAB ===== */}
        {activeTab === 'commentaires' && (
          <div className="space-y-4">
            {project.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                  {getInitials(comment.user_name)}
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{comment.user_name}</p>
                      <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Comment Input */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                JD
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-none transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button
                    disabled={!commentText.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ACTIVITE TAB ===== */}
        {activeTab === 'activité' && (
          <div className="space-y-0">
            {project.activities.map((activity, index) => {
              const IconComp = getActivityIcon(activity.icon_type);
              const iconColor = getActivityIconColor(activity.icon_type);
              const isLast = index === project.activities.length - 1;

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  {/* Icon */}
                  <div
                    className={cn(
                      'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      iconColor
                    )}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{activity.user_name}</span>
                      <span>-</span>
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
