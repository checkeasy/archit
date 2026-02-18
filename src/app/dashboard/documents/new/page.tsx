'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  File,
  FileImage,
  X,
  Tag,
  Check,
  FolderOpen,
  Layers,
  AlignLeft,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
}

// ============================================
// Mock data
// ============================================

const mockProjects = [
  { id: 'p1', name: 'Résidence Les Terrasses' },
  { id: 'p2', name: 'Maison Martin' },
  { id: 'p3', name: 'Bureaux Nextech' },
];

const categories = [
  'Plans',
  'Rendus 3D',
  'Contrats',
  'Permis',
  'Rapports',
  'Photos',
  'Autres',
];

const phases = [
  'Esquisse',
  'APS',
  'APD',
  'PRO',
  'DCE',
  'ACT',
  'VISA',
  'DET',
  'AOR',
];

const mockUploadedFiles: UploadedFile[] = [
  {
    id: 'f1',
    name: 'Plan RDC - Phase APD v3.pdf',
    size: 4_250_000,
    type: 'application/pdf',
    progress: 100,
  },
  {
    id: 'f2',
    name: 'Coupe longitudinale A-A.dwg',
    size: 2_800_000,
    type: 'application/dwg',
    progress: 100,
  },
  {
    id: 'f3',
    name: 'Photo facade sud - chantier.jpg',
    size: 6_100_000,
    type: 'image/jpeg',
    progress: 100,
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

function getFileIconInfo(fileType: string): {
  Icon: typeof FileText;
  color: string;
  bg: string;
} {
  if (fileType.startsWith('image/')) {
    return { Icon: FileImage, color: '#059669', bg: '#ecfdf5' };
  }
  if (fileType.includes('pdf')) {
    return { Icon: FileText, color: '#dc2626', bg: '#fef2f2' };
  }
  if (fileType.includes('dwg') || fileType.includes('dxf')) {
    return { Icon: File, color: '#2563EB', bg: '#eff6ff' };
  }
  return { Icon: File, color: '#6b7280', bg: '#f9fafb' };
}

function getFileTypeLabel(fileType: string): string {
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('dwg')) return 'DWG';
  if (fileType.includes('dxf')) return 'DXF';
  if (fileType.includes('jpeg') || fileType.includes('jpg')) return 'JPEG';
  if (fileType.includes('png')) return 'PNG';
  if (fileType.includes('zip')) return 'ZIP';
  return 'Fichier';
}

// ============================================
// Page component
// ============================================

export default function DocumentUploadPage() {
  // Drag & drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Files state
  const [files, setFiles] = useState<UploadedFile[]>(mockUploadedFiles);

  // Form state
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['architecture', 'plans']);
  const [tagInput, setTagInput] = useState('');
  const [isShared, setIsShared] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 100,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const selectedFiles = Array.from(e.target.files);
      const newFiles: UploadedFile[] = selectedFiles.map((f, i) => ({
        id: `sel-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type,
        progress: 100,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  return (
    <div className="space-y-6">
      {/* ============================== */}
      {/* Header                         */}
      {/* ============================== */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/documents"
          className="flex items-center justify-center shrink-0"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#6b7280',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.color = '#111827';
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
        </Link>
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
              lineHeight: '32px',
            }}
          >
            Ajouter un document
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '2px',
            }}
          >
            Importez des fichiers et renseignez les informations du document
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ============================== */}
        {/* Left column: Upload + files    */}
        {/* ============================== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Drag & drop zone */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '16px',
              }}
            >
              Zone de téléversement
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragOver
                  ? '2px dashed #2563EB'
                  : '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center' as const,
                cursor: 'pointer',
                backgroundColor: isDragOver ? '#eff6ff' : '#fafbfc',
                transition: 'all 200ms ease',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{ marginBottom: '16px' }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: isDragOver ? '#dbeafe' : '#f3f4f6',
                    transition: 'all 200ms ease',
                  }}
                >
                  <UploadCloud
                    style={{
                      width: '28px',
                      height: '28px',
                      color: isDragOver ? '#2563EB' : '#9ca3af',
                      transition: 'color 200ms ease',
                    }}
                  />
                </div>
              </div>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: isDragOver ? '#2563EB' : '#374151',
                  marginBottom: '4px',
                }}
              >
                {isDragOver
                  ? 'Déposez vos fichiers ici'
                  : 'Glissez vos fichiers ici'}
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                ou{' '}
                <span
                  style={{
                    color: '#2563EB',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
                >
                  parcourir vos fichiers
                </span>
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '12px',
                }}
              >
                Formats acceptés : PDF, DWG, DXF, JPEG, PNG, ZIP — Max. 50 Mo
                par fichier
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.dwg,.dxf,.jpeg,.jpg,.png,.zip"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Fichiers sélectionnés
                </h2>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: 500,
                  }}
                >
                  {files.length} fichier{files.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {files.map((file) => {
                  const { Icon, color, bg } = getFileIconInfo(file.type);
                  const typeLabel = getFileTypeLabel(file.type);

                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #f3f4f6',
                        backgroundColor: '#fafbfc',
                      }}
                    >
                      {/* File type icon */}
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: bg,
                        }}
                      >
                        <Icon
                          style={{
                            width: '20px',
                            height: '20px',
                            color: color,
                          }}
                        />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </p>
                        <div className="flex items-center gap-3" style={{ marginTop: '4px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                            }}
                          >
                            {formatFileSize(file.size)}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: color,
                              backgroundColor: bg,
                              padding: '1px 8px',
                              borderRadius: '4px',
                              letterSpacing: '0.025em',
                            }}
                          >
                            {typeLabel}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div
                          style={{
                            marginTop: '8px',
                            height: '4px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${file.progress}%`,
                              backgroundColor:
                                file.progress === 100 ? '#059669' : '#2563EB',
                              borderRadius: '2px',
                              transition: 'width 300ms ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* Status + remove */}
                      <div className="flex items-center gap-2 shrink-0">
                        {file.progress === 100 && (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#ecfdf5',
                            }}
                          >
                            <Check
                              style={{
                                width: '14px',
                                height: '14px',
                                color: '#059669',
                              }}
                            />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                            e.currentTarget.style.color = '#9ca3af';
                          }}
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================== */}
        {/* Right column: Metadata form    */}
        {/* ============================== */}
        <div className="space-y-6">
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '20px',
              }}
            >
              Informations du document
            </h2>

            <div className="space-y-5">
              {/* Project selector */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  <FolderOpen
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#9ca3af',
                    }}
                  />
                  Projet
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: selectedProject ? '#111827' : '#9ca3af',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none' as const,
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath d=%27M3 5l3 3 3-3%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(37, 99, 235, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Sélectionner un projet</option>
                  {mockProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category selector */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  <Layers
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#9ca3af',
                    }}
                  />
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: selectedCategory ? '#111827' : '#9ca3af',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none' as const,
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath d=%27M3 5l3 3 3-3%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(37, 99, 235, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phase selector */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  <Layers
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#9ca3af',
                    }}
                  />
                  Phase du projet
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: selectedPhase ? '#111827' : '#9ca3af',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none' as const,
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath d=%27M3 5l3 3 3-3%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(37, 99, 235, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Sélectionner une phase</option>
                  {phases.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  <AlignLeft
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#9ca3af',
                    }}
                  />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le contenu du document..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: '#111827',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    outline: 'none',
                    resize: 'vertical' as const,
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(37, 99, 235, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  <Tag
                    style={{
                      width: '14px',
                      height: '14px',
                      color: '#9ca3af',
                    }}
                  />
                  Tags
                </label>
                <div
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    backgroundColor: '#ffffff',
                    minHeight: '42px',
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1"
                        style={{
                          padding: '3px 10px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#2563EB',
                          backgroundColor: '#eff6ff',
                          borderRadius: '6px',
                          border: '1px solid #bfdbfe',
                        }}
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#93c5fd',
                            padding: '0',
                            marginLeft: '2px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#2563EB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#93c5fd';
                          }}
                        >
                          <X style={{ width: '12px', height: '12px' }} />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={
                          tags.length === 0 ? 'Ajouter un tag...' : ''
                        }
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          color: '#111827',
                          backgroundColor: 'transparent',
                          minWidth: '80px',
                          padding: '2px 0',
                        }}
                      />
                      {tagInput.trim() && (
                        <button
                          onClick={addTag}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#2563EB',
                            color: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus style={{ width: '12px', height: '12px' }} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '4px',
                  }}
                >
                  Appuyez sur Entrée pour ajouter un tag
                </p>
              </div>

              {/* Visibility toggle */}
              <div>
                <label
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '10px',
                  }}
                >
                  {isShared ? (
                    <Eye
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#9ca3af',
                      }}
                    />
                  ) : (
                    <EyeOff
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#9ca3af',
                      }}
                    />
                  )}
                  Visibilité
                </label>
                <div
                  className="flex items-center gap-0"
                  style={{
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setIsShared(false)}
                    className="flex items-center justify-center gap-2 flex-1"
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: !isShared ? '#2563EB' : '#ffffff',
                      color: !isShared ? '#ffffff' : '#6b7280',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <EyeOff style={{ width: '14px', height: '14px' }} />
                    Privé
                  </button>
                  <button
                    onClick={() => setIsShared(true)}
                    className="flex items-center justify-center gap-2 flex-1"
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      border: 'none',
                      borderLeft: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      backgroundColor: isShared ? '#2563EB' : '#ffffff',
                      color: isShared ? '#ffffff' : '#6b7280',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Eye style={{ width: '14px', height: '14px' }} />
                    Partagé avec le client
                  </button>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '6px',
                  }}
                >
                  {isShared
                    ? 'Le client pourra consulter ce document depuis son portail.'
                    : 'Seuls les membres du cabinet ont accès à ce document.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="flex items-center justify-end gap-3"
            style={{ paddingBottom: '8px' }}
          >
            <Link
              href="/dashboard/documents"
              className="inline-flex items-center justify-center"
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
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
              Annuler
            </Link>
            <button
              className="inline-flex items-center justify-center gap-2"
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#2563EB',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.boxShadow =
                  '0 1px 2px rgba(37, 99, 235, 0.2)';
              }}
            >
              <UploadCloud style={{ width: '16px', height: '16px' }} />
              Importer les documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
