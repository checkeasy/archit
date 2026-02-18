'use client';

import { useState } from 'react';
import {
  FileText,
  Receipt,
  BarChart3,
  Calculator,
  FileDown,
  Download,
  Clock,
  HardDrive,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Info,
  Calendar,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  File,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface QuickExportCard {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

interface RecentExport {
  id: string;
  date: string;
  type: 'Devis' | 'Facture' | 'Rapport' | 'Récapitulatif';
  projectName: string;
  format: 'PDF' | 'CSV' | 'Excel';
  fileSize: string;
  status: 'Prêt' | 'En cours' | 'Erreur';
  progress?: number;
}

interface ScheduledExport {
  id: string;
  name: string;
  frequency: string;
  nextExecution: string;
  enabled: boolean;
  type: string;
}

interface MockProject {
  id: string;
  name: string;
  reference: string;
}

// ============================================
// Mock Data
// ============================================

const quickExportCards: QuickExportCard[] = [
  {
    id: 'devis',
    title: 'Générer un devis PDF',
    description: 'Créez un devis professionnel à partir de vos projets et lots définis.',
    icon: FileText,
    accentColor: '#2563EB',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
  },
  {
    id: 'facture',
    title: 'Générer une facture PDF',
    description: 'Éditez une facture conforme avec TVA, références et conditions.',
    icon: Receipt,
    accentColor: '#059669',
    accentBg: '#ECFDF5',
    accentBorder: '#A7F3D0',
  },
  {
    id: 'rapport',
    title: 'Rapport de projet',
    description: 'Exportez un rapport complet avec avancement, budget et planning.',
    icon: BarChart3,
    accentColor: '#7C3AED',
    accentBg: '#F5F3FF',
    accentBorder: '#C4B5FD',
  },
  {
    id: 'recap',
    title: 'Récapitulatif comptable',
    description: 'Synthèse financière avec ventilation par projet et par mois.',
    icon: Calculator,
    accentColor: '#D97706',
    accentBg: '#FFFBEB',
    accentBorder: '#FCD34D',
  },
];

const mockProjects: MockProject[] = [
  { id: '1', name: 'Résidence Les Terrasses', reference: 'PRJ-00012' },
  { id: '2', name: 'Maison Martin', reference: 'PRJ-00011' },
  { id: '3', name: 'Bureaux Nextech', reference: 'PRJ-00010' },
  { id: '4', name: 'Restaurant Le Comptoir', reference: 'PRJ-00009' },
];

const recentExports: RecentExport[] = [
  {
    id: 'exp-1',
    date: '18/02/2026',
    type: 'Devis',
    projectName: 'Résidence Les Terrasses',
    format: 'PDF',
    fileSize: '2,4 Mo',
    status: 'Prêt',
  },
  {
    id: 'exp-2',
    date: '18/02/2026',
    type: 'Facture',
    projectName: 'Maison Martin',
    format: 'PDF',
    fileSize: '1,8 Mo',
    status: 'En cours',
    progress: 67,
  },
  {
    id: 'exp-3',
    date: '17/02/2026',
    type: 'Rapport',
    projectName: 'Bureaux Nextech',
    format: 'PDF',
    fileSize: '5,1 Mo',
    status: 'Prêt',
  },
  {
    id: 'exp-4',
    date: '17/02/2026',
    type: 'Devis',
    projectName: 'Restaurant Le Comptoir',
    format: 'Excel',
    fileSize: '890 Ko',
    status: 'Erreur',
  },
  {
    id: 'exp-5',
    date: '16/02/2026',
    type: 'Récapitulatif',
    projectName: 'Tous les projets',
    format: 'CSV',
    fileSize: '340 Ko',
    status: 'Prêt',
  },
  {
    id: 'exp-6',
    date: '15/02/2026',
    type: 'Facture',
    projectName: 'Résidence Les Terrasses',
    format: 'PDF',
    fileSize: '1,6 Mo',
    status: 'Prêt',
  },
  {
    id: 'exp-7',
    date: '14/02/2026',
    type: 'Rapport',
    projectName: 'Maison Martin',
    format: 'PDF',
    fileSize: '4,3 Mo',
    status: 'Prêt',
  },
  {
    id: 'exp-8',
    date: '13/02/2026',
    type: 'Devis',
    projectName: 'Bureaux Nextech',
    format: 'PDF',
    fileSize: '2,1 Mo',
    status: 'Prêt',
  },
];

const initialScheduledExports: ScheduledExport[] = [
  {
    id: 'sched-1',
    name: 'Récapitulatif mensuel',
    frequency: '1er de chaque mois',
    nextExecution: '01/03/2026',
    enabled: true,
    type: 'Récapitulatif comptable',
  },
  {
    id: 'sched-2',
    name: 'Sauvegarde documents',
    frequency: 'Tous les vendredis',
    nextExecution: '21/02/2026',
    enabled: true,
    type: 'Archive complète',
  },
];

// ============================================
// Helper: type badge colors
// ============================================

function getTypeBadgeStyle(type: string): { backgroundColor: string; color: string; borderColor: string } {
  switch (type) {
    case 'Devis':
      return { backgroundColor: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' };
    case 'Facture':
      return { backgroundColor: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' };
    case 'Rapport':
      return { backgroundColor: '#F5F3FF', color: '#7C3AED', borderColor: '#C4B5FD' };
    case 'Récapitulatif':
      return { backgroundColor: '#FFFBEB', color: '#D97706', borderColor: '#FCD34D' };
    default:
      return { backgroundColor: '#F3F4F6', color: '#6B7280', borderColor: '#E5E7EB' };
  }
}

// ============================================
// Helper: status rendering
// ============================================

function getStatusStyle(status: string): { backgroundColor: string; color: string; borderColor: string } {
  switch (status) {
    case 'Prêt':
      return { backgroundColor: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' };
    case 'En cours':
      return { backgroundColor: '#FFFBEB', color: '#D97706', borderColor: '#FCD34D' };
    case 'Erreur':
      return { backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' };
    default:
      return { backgroundColor: '#F3F4F6', color: '#6B7280', borderColor: '#E5E7EB' };
  }
}

// ============================================
// Helper: format icon
// ============================================

function getFormatIcon(format: string) {
  switch (format) {
    case 'PDF':
      return File;
    case 'CSV':
      return FileText;
    case 'Excel':
      return FileSpreadsheet;
    default:
      return File;
  }
}

// ============================================
// Component
// ============================================

export default function ExportsPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>(initialScheduledExports);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredGenerateBtn, setHoveredGenerateBtn] = useState<string | null>(null);
  const [hoveredDownloadBtn, setHoveredDownloadBtn] = useState<string | null>(null);
  const [hoveredLaunchBtn, setHoveredLaunchBtn] = useState(false);

  // Toggle scheduled export
  const toggleScheduledExport = (id: string) => {
    setScheduledExports((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, enabled: !exp.enabled } : exp))
    );
  };

  // Simulate export launch
  const handleLaunchExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  // Storage data
  const storageUsedGo = 2.4;
  const storageTotalGo = 10;
  const storagePercent = (storageUsedGo / storageTotalGo) * 100;
  const exportsThisMonth = 23;
  const exportsLimit = 100;
  const exportsPercent = (exportsThisMonth / exportsLimit) * 100;

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* Page Header                                  */}
      {/* ============================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
              }}
            >
              <FileDown style={{ width: '22px', height: '22px', color: '#2563EB' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                Centre d'exports
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '2px' }}>
                Générez et téléchargez vos devis, factures et rapports de projets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Quick Export Cards                            */}
      {/* ============================================ */}
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
          <FileDown style={{ width: '18px', height: '18px', color: '#6B7280' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Exports rapides
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickExportCards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#ffffff',
                  border: `1px solid ${isHovered ? card.accentBorder : '#E5E7EB'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: isHovered
                    ? '0 4px 12px rgba(0,0,0,0.08)'
                    : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <div className="flex flex-col gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: card.accentBg,
                      border: `1px solid ${card.accentBorder}`,
                    }}
                  >
                    <Icon style={{ width: '24px', height: '24px', color: card.accentColor }} />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#111827',
                        marginBottom: '6px',
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        lineHeight: '1.5',
                      }}
                    >
                      {card.description}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <button
                    onMouseEnter={() => setHoveredGenerateBtn(card.id)}
                    onMouseLeave={() => setHoveredGenerateBtn(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: hoveredGenerateBtn === card.id ? card.accentColor : card.accentBg,
                      color: hoveredGenerateBtn === card.id ? '#ffffff' : card.accentColor,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Générer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Export Configuration                         */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Filter style={{ width: '18px', height: '18px', color: '#6B7280' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Configuration de l'export
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Project Select */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Projet
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  color: selectedProject ? '#111827' : '#9CA3AF',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
              >
                <option value="">Sélectionner un projet...</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.reference})
                  </option>
                ))}
                <option value="all">Tous les projets</option>
              </select>
              <ChevronDown
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9CA3AF',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Document Type Select */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Type de document
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  color: selectedDocType ? '#111827' : '#9CA3AF',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
              >
                <option value="">Sélectionner un type...</option>
                <option value="devis">Devis</option>
                <option value="facture">Facture</option>
                <option value="rapport">Rapport</option>
                <option value="recapitulatif">Récapitulatif</option>
              </select>
              <ChevronDown
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9CA3AF',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Période
            </label>
            <div className="flex items-center gap-2">
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="Du"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    color: dateFrom ? '#111827' : '#9CA3AF',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
                />
              </div>
              <span style={{ fontSize: '13px', color: '#9CA3AF', flexShrink: 0 }}>au</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="Au"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    color: dateTo ? '#111827' : '#9CA3AF',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563EB'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Format Selection + Launch Button */}
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}
        >
          {/* Format Buttons */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Format de sortie
            </label>
            <div className="flex items-center gap-2">
              {['PDF', 'CSV', 'Excel'].map((format) => {
                const isActive = selectedFormat === format;
                const FormatIcon = getFormatIcon(format);
                return (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? '#2563EB' : '#D1D5DB'}`,
                      backgroundColor: isActive ? '#EFF6FF' : '#ffffff',
                      color: isActive ? '#2563EB' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <FormatIcon style={{ width: '14px', height: '14px' }} />
                    {format}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Launch Export Button */}
          <button
            onClick={handleLaunchExport}
            disabled={isExporting}
            onMouseEnter={() => setHoveredLaunchBtn(true)}
            onMouseLeave={() => setHoveredLaunchBtn(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: isExporting
                ? '#93C5FD'
                : hoveredLaunchBtn
                  ? '#1D4ED8'
                  : '#2563EB',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
              minWidth: '180px',
            }}
          >
            {isExporting ? (
              <>
                <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} />
                Export en cours...
              </>
            ) : (
              <>
                <Download style={{ width: '18px', height: '18px' }} />
                Lancer l'export
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Recent Exports Table                         */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div className="flex items-center gap-2">
            <Clock style={{ width: '18px', height: '18px', color: '#6B7280' }} />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Exports récents
            </h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#F3F4F6',
                color: '#6B7280',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {recentExports.length}
            </span>
          </div>
          <button
            className="flex items-center gap-1"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#ffffff',
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            Actualiser
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Projet
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Format
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Taille
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentExports.map((exp) => {
                const typeBadge = getTypeBadgeStyle(exp.type);
                const statusBadge = getStatusStyle(exp.status);
                const FormatIcon = getFormatIcon(exp.format);
                const isRowHovered = hoveredRow === exp.id;

                return (
                  <tr
                    key={exp.id}
                    onMouseEnter={() => setHoveredRow(exp.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: '1px solid #F9FAFB',
                      backgroundColor: isRowHovered ? '#F9FAFB' : '#ffffff',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Date */}
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                        {exp.date}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px 24px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: typeBadge.backgroundColor,
                          color: typeBadge.color,
                          border: `1px solid ${typeBadge.borderColor}`,
                        }}
                      >
                        {exp.type}
                      </span>
                    </td>

                    {/* Project Name */}
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                        {exp.projectName}
                      </span>
                    </td>

                    {/* Format */}
                    <td style={{ padding: '14px 24px' }}>
                      <div className="flex items-center gap-1.5">
                        <FormatIcon style={{ width: '14px', height: '14px', color: '#9CA3AF' }} />
                        <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                          {exp.format}
                        </span>
                      </div>
                    </td>

                    {/* File Size */}
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>
                        {exp.fileSize}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 24px' }}>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: statusBadge.backgroundColor,
                            color: statusBadge.color,
                            border: `1px solid ${statusBadge.borderColor}`,
                          }}
                        >
                          {exp.status === 'Prêt' && (
                            <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                          )}
                          {exp.status === 'En cours' && (
                            <Loader2
                              className="animate-spin"
                              style={{ width: '12px', height: '12px' }}
                            />
                          )}
                          {exp.status === 'Erreur' && (
                            <XCircle style={{ width: '12px', height: '12px' }} />
                          )}
                          {exp.status}
                        </span>
                        {exp.status === 'En cours' && exp.progress !== undefined && (
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                width: '60px',
                                height: '4px',
                                borderRadius: '2px',
                                backgroundColor: '#FEF3C7',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${exp.progress}%`,
                                  height: '100%',
                                  borderRadius: '2px',
                                  backgroundColor: '#D97706',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>
                              {exp.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      {exp.status === 'Prêt' && (
                        <button
                          onMouseEnter={() => setHoveredDownloadBtn(exp.id)}
                          onMouseLeave={() => setHoveredDownloadBtn(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: `1px solid ${hoveredDownloadBtn === exp.id ? '#2563EB' : '#D1D5DB'}`,
                            backgroundColor: hoveredDownloadBtn === exp.id ? '#EFF6FF' : '#ffffff',
                            color: hoveredDownloadBtn === exp.id ? '#2563EB' : '#374151',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Download style={{ width: '14px', height: '14px' }} />
                          Télécharger
                        </button>
                      )}
                      {exp.status === 'En cours' && (
                        <span style={{ fontSize: '13px', color: '#D97706', fontWeight: 500 }}>
                          Patientez...
                        </span>
                      )}
                      {exp.status === 'Erreur' && (
                        <button
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #FECACA',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <RefreshCw style={{ width: '14px', height: '14px' }} />
                          Réessayer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {recentExports.map((exp) => {
            const typeBadge = getTypeBadgeStyle(exp.type);
            const statusBadge = getStatusStyle(exp.status);

            return (
              <div
                key={exp.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #F3F4F6',
                }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {exp.projectName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      {exp.date} - {exp.fileSize}
                    </p>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: statusBadge.backgroundColor,
                      color: statusBadge.color,
                      border: `1px solid ${statusBadge.borderColor}`,
                    }}
                  >
                    {exp.status === 'En cours' && (
                      <Loader2
                        className="animate-spin"
                        style={{ width: '10px', height: '10px' }}
                      />
                    )}
                    {exp.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      display: 'inline-flex',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: typeBadge.backgroundColor,
                      color: typeBadge.color,
                    }}
                  >
                    {exp.type}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{exp.format}</span>
                  {exp.status === 'Prêt' && (
                    <button
                      style={{
                        marginLeft: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#ffffff',
                        color: '#2563EB',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      <Download style={{ width: '12px', height: '12px' }} />
                      Télécharger
                    </button>
                  )}
                </div>
                {exp.status === 'En cours' && exp.progress !== undefined && (
                  <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: '#FEF3C7',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${exp.progress}%`,
                          height: '100%',
                          borderRadius: '2px',
                          backgroundColor: '#D97706',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>
                      {exp.progress}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Scheduled Exports                            */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
          <Calendar style={{ width: '18px', height: '18px', color: '#6B7280' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Exports programmés
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {scheduledExports.map((scheduled) => (
            <div
              key={scheduled.id}
              style={{
                padding: '20px',
                borderRadius: '10px',
                border: `1px solid ${scheduled.enabled ? '#BFDBFE' : '#E5E7EB'}`,
                backgroundColor: scheduled.enabled ? '#F8FAFF' : '#FAFAFA',
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                      {scheduled.name}
                    </h3>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: scheduled.enabled ? '#ECFDF5' : '#F3F4F6',
                        color: scheduled.enabled ? '#059669' : '#9CA3AF',
                      }}
                    >
                      {scheduled.enabled ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>
                      <span style={{ fontWeight: 500 }}>Type :</span> {scheduled.type}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>
                      <span style={{ fontWeight: 500 }}>Fréquence :</span> {scheduled.frequency}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Clock style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />
                      <p style={{ fontSize: '13px', color: '#6B7280' }}>
                        <span style={{ fontWeight: 500 }}>Prochain export :</span>{' '}
                        <span style={{ color: scheduled.enabled ? '#2563EB' : '#9CA3AF', fontWeight: 600 }}>
                          {scheduled.nextExecution}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleScheduledExport(scheduled.id)}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: scheduled.enabled ? '#2563EB' : '#D1D5DB',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    flexShrink: 0,
                    padding: 0,
                  }}
                  title={scheduled.enabled ? 'Désactiver' : 'Activer'}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: scheduled.enabled ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* Storage & Limits                             */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
          <HardDrive style={{ width: '18px', height: '18px', color: '#6B7280' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Stockage et limites
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Storage Used */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Espace de stockage
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                {storageUsedGo} Go / {storageTotalGo} Go
              </p>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: '#F3F4F6',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${storagePercent}%`,
                  height: '100%',
                  borderRadius: '5px',
                  backgroundColor: storagePercent > 80 ? '#DC2626' : storagePercent > 60 ? '#D97706' : '#2563EB',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              {(storageTotalGo - storageUsedGo).toFixed(1)} Go disponibles
            </p>
          </div>

          {/* Exports This Month */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Exports ce mois
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                {exportsThisMonth} / {exportsLimit}
              </p>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: '#F3F4F6',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${exportsPercent}%`,
                  height: '100%',
                  borderRadius: '5px',
                  backgroundColor: exportsPercent > 80 ? '#DC2626' : exportsPercent > 60 ? '#D97706' : '#059669',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              {exportsLimit - exportsThisMonth} exports restants ce mois
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div
          className="flex items-start gap-3"
          style={{
            marginTop: '20px',
            padding: '14px 16px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
          }}
        >
          <Info
            style={{
              width: '18px',
              height: '18px',
              color: '#2563EB',
              flexShrink: 0,
              marginTop: '1px',
            }}
          />
          <div>
            <p style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
              Les exports sont conservés pendant 30 jours avant d'être automatiquement supprimés.
              Pensez à télécharger vos documents importants.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
