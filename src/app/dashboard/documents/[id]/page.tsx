'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  FileImage,
  FileText,
  File,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  User,
  Calendar,
  HardDrive,
  FolderOpen,
  Tag,
  Send,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  MessageSquare,
  History,
  FileCheck,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface DocumentVersion {
  version: number;
  date: string;
  uploadedBy: string;
  fileSize: string;
  changes: string;
  isCurrent: boolean;
}

interface DocumentComment {
  id: string;
  author: string;
  avatarInitials: string;
  date: string;
  content: string;
}

interface RelatedDocument {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  date: string;
  fileType: string;
}

// ============================================
// Category configuration
// ============================================

const categoryStyles: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  plan: {
    label: 'Plans',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  render: {
    label: 'Rendus 3D',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  contract: {
    label: 'Contrats',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  permit: {
    label: 'Permis',
    color: '#047857',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  report: {
    label: 'Rapports',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  photo: {
    label: 'Photos',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
  },
  other: {
    label: 'Autres',
    color: '#4b5563',
    bg: '#f9fafb',
    border: '#e5e7eb',
  },
};

// ============================================
// Mock data
// ============================================

const mockDocument = {
  id: 'doc-1',
  name: 'Plan RDC - Phase DCE v3.dwg',
  fileName: 'Plan_RDC_Phase_DCE_v3.dwg',
  fileType: 'application/dwg',
  fileTypeLabel: 'AutoCAD Drawing (.dwg)',
  fileSize: '4,25 Mo',
  fileSizeBytes: 4_456_448,
  category: 'plan',
  projectId: 'p1',
  projectName: 'Villa Méditerranée',
  uploadedBy: 'Jean Dupont',
  uploadedById: 'u1',
  uploadDate: '15 février 2026',
  uploadDateShort: '15/02/2026',
  lastModified: '17 février 2026 à 14h32',
  version: 3,
  description:
    'Plan du rez-de-chaussée en phase DCE, incluant les cotations détaillées et les réseaux techniques.',
};

const mockVersions: DocumentVersion[] = [
  {
    version: 3,
    date: '15/02/2026',
    uploadedBy: 'Jean Dupont',
    fileSize: '4,25 Mo',
    changes: 'Mise à jour des cotations et ajout des réseaux CVC',
    isCurrent: true,
  },
  {
    version: 2,
    date: '28/01/2026',
    uploadedBy: 'Marie Laurent',
    fileSize: '3,80 Mo',
    changes: 'Correction des dimensions du séjour et de la cuisine',
    isCurrent: false,
  },
  {
    version: 1,
    date: '10/01/2026',
    uploadedBy: 'Jean Dupont',
    fileSize: '3,12 Mo',
    changes: 'Version initiale du plan RDC phase DCE',
    isCurrent: false,
  },
];

const mockComments: DocumentComment[] = [
  {
    id: 'c1',
    author: 'Marie Laurent',
    avatarInitials: 'ML',
    date: '16 février 2026 à 09h15',
    content:
      'Les cotations de la terrasse ne correspondent pas au relevé topographique. Il faudrait vérifier avec le géomètre avant validation.',
  },
  {
    id: 'c2',
    author: 'Jean Dupont',
    avatarInitials: 'JD',
    date: '16 février 2026 à 11h42',
    content:
      'Bien noté, je contacte le cabinet de géomètre cet après-midi. La correction sera intégrée dans la v4.',
  },
  {
    id: 'c3',
    author: 'Pierre Martin',
    avatarInitials: 'PM',
    date: '17 février 2026 à 08h30',
    content:
      'Attention aussi à la position du regard EP en façade sud, il y a un conflit avec le réseau existant repéré lors de la visite chantier.',
  },
];

const mockRelatedDocuments: RelatedDocument[] = [
  {
    id: 'doc-r1',
    name: 'Plan R+1 - Phase DCE v2.dwg',
    category: 'plan',
    categoryLabel: 'Plans',
    date: '14/02/2026',
    fileType: 'application/dwg',
  },
  {
    id: 'doc-r2',
    name: 'Coupe longitudinale AA.dwg',
    category: 'plan',
    categoryLabel: 'Plans',
    date: '12/02/2026',
    fileType: 'application/dwg',
  },
  {
    id: 'doc-r3',
    name: 'Rendu 3D façade principale.png',
    category: 'render',
    categoryLabel: 'Rendus 3D',
    date: '10/02/2026',
    fileType: 'image/png',
  },
  {
    id: 'doc-r4',
    name: 'CCTP Lot 01 - Gros oeuvre.pdf',
    category: 'other',
    categoryLabel: 'Autres',
    date: '08/02/2026',
    fileType: 'application/pdf',
  },
];

// ============================================
// Helpers
// ============================================

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
  if (fileType.startsWith('image/')) return '#14b8a6';
  if (fileType.includes('pdf')) return '#ef4444';
  if (fileType.includes('doc')) return '#3b82f6';
  if (fileType.includes('dwg')) return '#6366f1';
  return '#9ca3af';
}

// ============================================
// Sub-components
// ============================================

function CategoryBadge({ category }: { category: string }) {
  const config = categoryStyles[category] || categoryStyles.other;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        padding: '2px 10px',
      }}
    >
      {config.label}
    </span>
  );
}

function AvatarInitials({
  initials,
  size = 'md',
}: {
  initials: string;
  size?: 'sm' | 'md';
}) {
  const dimensions = size === 'sm' ? 28 : 36;
  const fontSize = size === 'sm' ? '11px' : '13px';
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: '50%',
        backgroundColor: '#eff6ff',
        color: '#2563EB',
        fontSize,
        fontWeight: 600,
      }}
    >
      {initials}
    </div>
  );
}

// ============================================
// Main page component
// ============================================

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [zoomLevel, setZoomLevel] = useState(100);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<DocumentComment[]>(mockComments);
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'versions' | 'comments'>('info');

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 25));
  };

  const handleZoomFit = () => {
    setZoomLevel(100);
  };

  // Comment handler
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: DocumentComment = {
      id: `c-${Date.now()}`,
      author: 'Jean Dupont',
      avatarInitials: 'JD',
      date: 'À l\'instant',
      content: newComment.trim(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  const doc = mockDocument;
  const catConfig = categoryStyles[doc.category] || categoryStyles.other;
  const DocIcon = getFileIcon(doc.fileType);
  const docIconColor = getFileIconColor(doc.fileType);

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}
      <div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px 24px',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Back button */}
          <Link
            href="/dashboard/documents"
            className="flex items-center justify-center shrink-0"
            style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#6b7280',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.3,
                }}
              >
                {doc.name}
              </h1>
              <CategoryBadge category={doc.category} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                }}
              >
                v{doc.version}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className="flex items-center gap-1.5"
                style={{ fontSize: '13px', color: '#6b7280' }}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                {doc.projectName}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ fontSize: '13px', color: '#6b7280' }}
              >
                <User className="h-3.5 w-3.5" />
                {doc.uploadedBy}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ fontSize: '13px', color: '#6b7280' }}
              >
                <Calendar className="h-3.5 w-3.5" />
                {doc.uploadDateShort}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              transition: 'all 0.15s',
              cursor: 'pointer',
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
            <Download className="h-4 w-4" />
            Télécharger
          </button>
          <button
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              transition: 'all 0.15s',
              cursor: 'pointer',
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
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          <button
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              backgroundColor: '#ffffff',
              color: '#dc2626',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Main content: Preview + Sidebar */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left: Preview area (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Document Preview Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Preview toolbar */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Aperçu du document
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span
                  className="flex items-center justify-center"
                  style={{
                    minWidth: 48,
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: '#e5e7eb',
                    margin: '0 4px',
                  }}
                />
                <button
                  onClick={handleZoomFit}
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Preview area */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                height: 340,
                backgroundColor: '#f9fafb',
                position: 'relative',
              }}
            >
              {/* Grid pattern background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  opacity: 0.4,
                }}
              />
              <div
                className="flex flex-col items-center gap-4"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  transform: `scale(${zoomLevel / 100})`,
                  transition: 'transform 0.2s ease',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <FileImage
                    className="h-8 w-8"
                    style={{ color: '#6366f1' }}
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    Aperçu du document
                  </span>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    {doc.fileName}
                  </span>
                  <span style={{ fontSize: '12px', color: '#d1d5db' }}>
                    {doc.fileSize}
                  </span>
                </div>
                <button
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{
                    marginTop: 8,
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }}
                >
                  <Download className="h-4 w-4" />
                  Ouvrir le fichier
                </button>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* Version History */}
          {/* ============================================ */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
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
                <History
                  className="h-4.5 w-4.5"
                  style={{ color: '#6b7280' }}
                />
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Historique des versions
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '9999px',
                    padding: '1px 8px',
                  }}
                >
                  {mockVersions.length}
                </span>
              </div>
              {mockVersions.length > 2 && (
                <button
                  onClick={() => setShowAllVersions(!showAllVersions)}
                  className="inline-flex items-center gap-1 text-sm"
                  style={{
                    color: '#2563EB',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontWeight: 500,
                  }}
                >
                  {showAllVersions ? 'Réduire' : 'Tout afficher'}
                  {showAllVersions ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <th
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'left',
                      }}
                    >
                      Version
                    </th>
                    <th
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'left',
                      }}
                    >
                      Date
                    </th>
                    <th
                      className="hidden md:table-cell"
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'left',
                      }}
                    >
                      Auteur
                    </th>
                    <th
                      className="hidden sm:table-cell"
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'left',
                      }}
                    >
                      Taille
                    </th>
                    <th
                      className="hidden lg:table-cell"
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'left',
                      }}
                    >
                      Modifications
                    </th>
                    <th
                      style={{
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'right',
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllVersions ? mockVersions : mockVersions.slice(0, 2)).map(
                    (version) => (
                      <tr
                        key={version.version}
                        style={{
                          borderBottom: '1px solid #f9fafb',
                          backgroundColor: version.isCurrent
                            ? '#eff6ff'
                            : '#ffffff',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <td style={{ padding: '12px 20px' }}>
                          <div className="flex items-center gap-2">
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#111827',
                              }}
                            >
                              v{version.version}
                            </span>
                            {version.isCurrent && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: '#047857',
                                  backgroundColor: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  borderRadius: '9999px',
                                  padding: '1px 8px',
                                }}
                              >
                                Actuelle
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '12px 20px',
                            fontSize: '13px',
                            color: '#6b7280',
                          }}
                        >
                          {version.date}
                        </td>
                        <td
                          className="hidden md:table-cell"
                          style={{
                            padding: '12px 20px',
                            fontSize: '13px',
                            color: '#6b7280',
                          }}
                        >
                          {version.uploadedBy}
                        </td>
                        <td
                          className="hidden sm:table-cell"
                          style={{
                            padding: '12px 20px',
                            fontSize: '13px',
                            color: '#6b7280',
                          }}
                        >
                          {version.fileSize}
                        </td>
                        <td
                          className="hidden lg:table-cell"
                          style={{
                            padding: '12px 20px',
                            fontSize: '13px',
                            color: '#6b7280',
                            maxWidth: 280,
                          }}
                        >
                          <span className="truncate block">
                            {version.changes}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '12px 20px',
                            textAlign: 'right',
                          }}
                        >
                          <button
                            className="inline-flex items-center justify-center"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              color: '#6b7280',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.color = '#2563EB';
                              e.currentTarget.style.borderColor = '#bfdbfe';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.color = '#6b7280';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                            title={`Télécharger la version ${version.version}`}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================ */}
          {/* Comments Section */}
          {/* ============================================ */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
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
              <MessageSquare
                className="h-4.5 w-4.5"
                style={{ color: '#6b7280' }}
              />
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Commentaires
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#9ca3af',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '9999px',
                  padding: '1px 8px',
                }}
              >
                {comments.length}
              </span>
            </div>

            {/* Comment list */}
            <div style={{ padding: '16px 20px' }} className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="flex gap-3"
                  style={{
                    paddingBottom: index < comments.length - 1 ? 16 : 0,
                    borderBottom:
                      index < comments.length - 1
                        ? '1px solid #f3f4f6'
                        : 'none',
                  }}
                >
                  <AvatarInitials initials={comment.avatarInitials} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {comment.author}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {comment.date}
                      </span>
                    </div>
                    <p
                      style={{
                        marginTop: 4,
                        fontSize: '13px',
                        color: '#4b5563',
                        lineHeight: 1.6,
                      }}
                    >
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* New comment input */}
            <div
              className="flex gap-3"
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <AvatarInitials initials="JD" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="flex-1"
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(37,99,235,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={handleAddComment}
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '8px',
                    backgroundColor: newComment.trim()
                      ? '#2563EB'
                      : '#e5e7eb',
                    color: newComment.trim() ? '#ffffff' : '#9ca3af',
                    border: 'none',
                    cursor: newComment.trim() ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (newComment.trim()) {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newComment.trim()) {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }
                  }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Right: Document Info Sidebar (1/3) */}
        {/* ============================================ */}
        <div className="xl:col-span-1 space-y-6">
          {/* Document Metadata Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Informations du document
              </span>
            </div>

            <div className="space-y-0">
              {/* Nom du fichier */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <FileCheck
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Nom du fichier
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                      wordBreak: 'break-all',
                    }}
                  >
                    {doc.fileName}
                  </span>
                </div>
              </div>

              {/* Type de fichier */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <DocIcon
                  className="h-4 w-4 shrink-0"
                  style={{ color: docIconColor, marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Type de fichier
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {doc.fileTypeLabel}
                  </span>
                </div>
              </div>

              {/* Taille */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <HardDrive
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Taille
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {doc.fileSize}
                  </span>
                </div>
              </div>

              {/* Catégorie */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <Tag
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 4,
                    }}
                  >
                    Catégorie
                  </span>
                  <CategoryBadge category={doc.category} />
                </div>
              </div>

              {/* Projet associé */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <FolderOpen
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Projet associé
                  </span>
                  <Link
                    href={`/dashboard/projects/${doc.projectId}`}
                    className="inline-flex items-center gap-1"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#2563EB',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1d4ed8';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#2563EB';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {doc.projectName}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Importé par */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <User
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Importé par
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {doc.uploadedBy}
                  </span>
                </div>
              </div>

              {/* Date d'import */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <Calendar
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Date d&apos;import
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {doc.uploadDate}
                  </span>
                </div>
              </div>

              {/* Dernière modification */}
              <div
                className="flex items-start gap-3"
                style={{
                  padding: '14px 20px',
                }}
              >
                <Clock
                  className="h-4 w-4 shrink-0"
                  style={{ color: '#9ca3af', marginTop: 2 }}
                />
                <div className="flex-1">
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Dernière modification
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                    }}
                  >
                    {doc.lastModified}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* Description Card */}
          {/* ============================================ */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Description
              </span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <p
                style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  lineHeight: 1.7,
                }}
              >
                {doc.description}
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* Quick Actions Card */}
          {/* ============================================ */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Actions rapides
              </span>
            </div>
            <div className="space-y-1" style={{ padding: '8px 12px' }}>
              <button
                className="flex items-center gap-3 w-full"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Download className="h-4 w-4" style={{ color: '#6b7280' }} />
                Télécharger le fichier
              </button>
              <button
                className="flex items-center gap-3 w-full"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Share2 className="h-4 w-4" style={{ color: '#6b7280' }} />
                Partager avec un collaborateur
              </button>
              <button
                className="flex items-center gap-3 w-full"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Layers className="h-4 w-4" style={{ color: '#6b7280' }} />
                Importer une nouvelle version
              </button>
              <button
                className="flex items-center gap-3 w-full"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer le document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Related Documents */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
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
            <FolderOpen className="h-4.5 w-4.5" style={{ color: '#6b7280' }} />
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Documents liés
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#9ca3af',
                backgroundColor: '#f3f4f6',
                borderRadius: '9999px',
                padding: '1px 8px',
              }}
            >
              {doc.projectName}
            </span>
          </div>
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-1 text-sm"
            style={{
              color: '#2563EB',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#2563EB';
            }}
          >
            Voir tous les documents
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 xl:grid-cols-4">
          {mockRelatedDocuments.map((relDoc, index) => {
            const RelIcon = getFileIcon(relDoc.fileType);
            const relIconColor = getFileIconColor(relDoc.fileType);
            const relCatConfig =
              categoryStyles[relDoc.category] || categoryStyles.other;

            return (
              <Link
                key={relDoc.id}
                href={`/dashboard/documents/${relDoc.id}`}
                className="flex items-center gap-3 group"
                style={{
                  padding: '16px 20px',
                  borderRight:
                    index < mockRelatedDocuments.length - 1
                      ? '1px solid #f3f4f6'
                      : 'none',
                  borderBottom: '1px solid #f3f4f6',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '10px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <RelIcon
                    className="h-5 w-5"
                    style={{ color: relIconColor }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    {relDoc.name}
                  </p>
                  <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: relCatConfig.color,
                        backgroundColor: relCatConfig.bg,
                        border: `1px solid ${relCatConfig.border}`,
                        borderRadius: '9999px',
                        padding: '1px 8px',
                      }}
                    >
                      {relCatConfig.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {relDoc.date}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
