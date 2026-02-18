'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Upload,
  MessageSquare,
  Receipt,
  UserPlus,
  Calendar,
  AlertCircle,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

// ============================================
// Types
// ============================================

type ActivityType =
  | 'phase_update'
  | 'document_upload'
  | 'comment'
  | 'invoice'
  | 'client'
  | 'meeting'
  | 'deadline';

type FilterType = 'all' | 'projects' | 'documents' | 'invoices' | 'team';
type DateRange = 'today' | '7days' | '30days' | '3months';

interface ActivityItem {
  id: string;
  type: ActivityType;
  userName: string;
  avatarColor: string;
  description: string;
  projectName: string | null;
  projectId: string | null;
  time: string;
  dateGroup: string;
  timestamp: string;
}

// ============================================
// Constants
// ============================================

const TYPE_COLORS: Record<ActivityType, string> = {
  phase_update: '#2563EB',
  document_upload: '#8b5cf6',
  comment: '#f59e0b',
  invoice: '#059669',
  client: '#06b6d4',
  meeting: '#ec4899',
  deadline: '#dc2626',
};

const TYPE_ICONS: Record<ActivityType, typeof FolderKanban> = {
  phase_update: FolderKanban,
  document_upload: Upload,
  comment: MessageSquare,
  invoice: Receipt,
  client: UserPlus,
  meeting: Calendar,
  deadline: AlertCircle,
};

const TYPE_LABELS: Record<ActivityType, string> = {
  phase_update: 'Phase',
  document_upload: 'Document',
  comment: 'Commentaire',
  invoice: 'Facture',
  client: 'Client',
  meeting: 'Reunion',
  deadline: 'Echeance',
};

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'projects', label: 'Projets' },
  { key: 'documents', label: 'Documents' },
  { key: 'invoices', label: 'Factures' },
  { key: 'team', label: 'Equipe' },
];

const DATE_RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: 'today', label: "Aujourd'hui" },
  { key: '7days', label: '7 jours' },
  { key: '30days', label: '30 jours' },
  { key: '3months', label: '3 mois' },
];

const AVATAR_COLORS: Record<string, string> = {
  'Jean Dupont': '#2563EB',
  'Marie Lefevre': '#8b5cf6',
  'Sophie Bernard': '#059669',
  'Thomas Moreau': '#f59e0b',
  'Claire Petit': '#ec4899',
};

// ============================================
// Mock Data - 24 activity entries across 5 days
// ============================================

const MOCK_ACTIVITIES: ActivityItem[] = [
  // Aujourd'hui - 18 fevrier 2026
  {
    id: 'a01',
    type: 'phase_update',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a valide la phase DCE de',
    projectName: 'Residence Les Terrasses',
    projectId: '1',
    time: '10:32',
    dateGroup: "Aujourd'hui",
    timestamp: '2026-02-18T10:32:00',
  },
  {
    id: 'a02',
    type: 'document_upload',
    userName: 'Marie Lefevre',
    avatarColor: AVATAR_COLORS['Marie Lefevre'],
    description: 'a importe 3 plans dans',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '09:45',
    dateGroup: "Aujourd'hui",
    timestamp: '2026-02-18T09:45:00',
  },
  {
    id: 'a03',
    type: 'comment',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a ajoute un commentaire sur',
    projectName: 'Bureaux Nextech',
    projectId: '3',
    time: '09:12',
    dateGroup: "Aujourd'hui",
    timestamp: '2026-02-18T09:12:00',
  },
  {
    id: 'a04',
    type: 'meeting',
    userName: 'Claire Petit',
    avatarColor: AVATAR_COLORS['Claire Petit'],
    description: 'a planifie une reunion chantier pour',
    projectName: 'Restaurant Le Comptoir',
    projectId: '4',
    time: '08:30',
    dateGroup: "Aujourd'hui",
    timestamp: '2026-02-18T08:30:00',
  },
  {
    id: 'a05',
    type: 'invoice',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a cree la facture FAC-00245 pour',
    projectName: 'SCI Les Terrasses',
    projectId: '1',
    time: '08:05',
    dateGroup: "Aujourd'hui",
    timestamp: '2026-02-18T08:05:00',
  },

  // Hier - 17 fevrier 2026
  {
    id: 'a06',
    type: 'phase_update',
    userName: 'Thomas Moreau',
    avatarColor: AVATAR_COLORS['Thomas Moreau'],
    description: 'a passe en phase PRO le projet',
    projectName: 'Bureaux Nextech',
    projectId: '3',
    time: '17:45',
    dateGroup: 'Hier',
    timestamp: '2026-02-17T17:45:00',
  },
  {
    id: 'a07',
    type: 'document_upload',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a importe le CCTP dans',
    projectName: 'Residence Les Terrasses',
    projectId: '1',
    time: '16:20',
    dateGroup: 'Hier',
    timestamp: '2026-02-17T16:20:00',
  },
  {
    id: 'a08',
    type: 'client',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a ajoute un nouveau client :',
    projectName: 'Mairie de Lyon',
    projectId: null,
    time: '15:00',
    dateGroup: 'Hier',
    timestamp: '2026-02-17T15:00:00',
  },
  {
    id: 'a09',
    type: 'comment',
    userName: 'Marie Lefevre',
    avatarColor: AVATAR_COLORS['Marie Lefevre'],
    description: 'a ajoute un commentaire sur',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '14:10',
    dateGroup: 'Hier',
    timestamp: '2026-02-17T14:10:00',
  },
  {
    id: 'a10',
    type: 'deadline',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a signale une echeance depassee : Depot PC -',
    projectName: 'Ecole Montessori',
    projectId: '5',
    time: '10:30',
    dateGroup: 'Hier',
    timestamp: '2026-02-17T10:30:00',
  },

  // Lundi 16 fevrier 2026
  {
    id: 'a11',
    type: 'invoice',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a envoye la facture FAC-00244 pour',
    projectName: 'Restaurant Le Comptoir',
    projectId: '4',
    time: '17:00',
    dateGroup: 'Lundi 16 fevrier',
    timestamp: '2026-02-16T17:00:00',
  },
  {
    id: 'a12',
    type: 'document_upload',
    userName: 'Thomas Moreau',
    avatarColor: AVATAR_COLORS['Thomas Moreau'],
    description: 'a importe les rendus 3D dans',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '15:30',
    dateGroup: 'Lundi 16 fevrier',
    timestamp: '2026-02-16T15:30:00',
  },
  {
    id: 'a13',
    type: 'phase_update',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a valide la phase APD de',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '14:00',
    dateGroup: 'Lundi 16 fevrier',
    timestamp: '2026-02-16T14:00:00',
  },
  {
    id: 'a14',
    type: 'meeting',
    userName: 'Claire Petit',
    avatarColor: AVATAR_COLORS['Claire Petit'],
    description: 'a planifie la reunion de lancement de',
    projectName: 'Ecole Montessori',
    projectId: '5',
    time: '11:15',
    dateGroup: 'Lundi 16 fevrier',
    timestamp: '2026-02-16T11:15:00',
  },
  {
    id: 'a15',
    type: 'comment',
    userName: 'Thomas Moreau',
    avatarColor: AVATAR_COLORS['Thomas Moreau'],
    description: 'a ajoute une note technique sur',
    projectName: 'Residence Les Terrasses',
    projectId: '1',
    time: '09:45',
    dateGroup: 'Lundi 16 fevrier',
    timestamp: '2026-02-16T09:45:00',
  },

  // Vendredi 13 fevrier 2026
  {
    id: 'a16',
    type: 'client',
    userName: 'Marie Lefevre',
    avatarColor: AVATAR_COLORS['Marie Lefevre'],
    description: 'a mis a jour les coordonnees de',
    projectName: 'Nextech SAS',
    projectId: null,
    time: '16:40',
    dateGroup: 'Vendredi 13 fevrier',
    timestamp: '2026-02-13T16:40:00',
  },
  {
    id: 'a17',
    type: 'invoice',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a encaisse le paiement de FAC-00240 pour',
    projectName: 'Bureaux Nextech',
    projectId: '3',
    time: '15:20',
    dateGroup: 'Vendredi 13 fevrier',
    timestamp: '2026-02-13T15:20:00',
  },
  {
    id: 'a18',
    type: 'document_upload',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a importe le rapport de sol dans',
    projectName: 'Ecole Montessori',
    projectId: '5',
    time: '14:00',
    dateGroup: 'Vendredi 13 fevrier',
    timestamp: '2026-02-13T14:00:00',
  },
  {
    id: 'a19',
    type: 'deadline',
    userName: 'Claire Petit',
    avatarColor: AVATAR_COLORS['Claire Petit'],
    description: 'a ajoute une echeance : Rendu APD -',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '11:30',
    dateGroup: 'Vendredi 13 fevrier',
    timestamp: '2026-02-13T11:30:00',
  },
  {
    id: 'a20',
    type: 'phase_update',
    userName: 'Thomas Moreau',
    avatarColor: AVATAR_COLORS['Thomas Moreau'],
    description: 'a demarre la phase ACT de',
    projectName: 'Restaurant Le Comptoir',
    projectId: '4',
    time: '09:00',
    dateGroup: 'Vendredi 13 fevrier',
    timestamp: '2026-02-13T09:00:00',
  },

  // Jeudi 12 fevrier 2026
  {
    id: 'a21',
    type: 'meeting',
    userName: 'Jean Dupont',
    avatarColor: AVATAR_COLORS['Jean Dupont'],
    description: 'a participe a la reunion de suivi de',
    projectName: 'Residence Les Terrasses',
    projectId: '1',
    time: '16:00',
    dateGroup: 'Jeudi 12 fevrier',
    timestamp: '2026-02-12T16:00:00',
  },
  {
    id: 'a22',
    type: 'comment',
    userName: 'Marie Lefevre',
    avatarColor: AVATAR_COLORS['Marie Lefevre'],
    description: 'a ajoute un commentaire sur',
    projectName: 'Restaurant Le Comptoir',
    projectId: '4',
    time: '14:30',
    dateGroup: 'Jeudi 12 fevrier',
    timestamp: '2026-02-12T14:30:00',
  },
  {
    id: 'a23',
    type: 'document_upload',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a importe le contrat signe dans',
    projectName: 'Ecole Montessori',
    projectId: '5',
    time: '11:00',
    dateGroup: 'Jeudi 12 fevrier',
    timestamp: '2026-02-12T11:00:00',
  },
  {
    id: 'a24',
    type: 'invoice',
    userName: 'Sophie Bernard',
    avatarColor: AVATAR_COLORS['Sophie Bernard'],
    description: 'a cree la facture FAC-00243 pour',
    projectName: 'Maison Martin',
    projectId: '2',
    time: '09:15',
    dateGroup: 'Jeudi 12 fevrier',
    timestamp: '2026-02-12T09:15:00',
  },
];

// ============================================
// Filter logic mapping
// ============================================

const FILTER_TYPE_MAP: Record<FilterType, ActivityType[]> = {
  all: ['phase_update', 'document_upload', 'comment', 'invoice', 'client', 'meeting', 'deadline'],
  projects: ['phase_update', 'meeting', 'deadline'],
  documents: ['document_upload'],
  invoices: ['invoice'],
  team: ['comment', 'client'],
};

// ============================================
// Component
// ============================================

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [visibleCount, setVisibleCount] = useState(12);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Filter activities
  const filteredActivities = useMemo(() => {
    const allowedTypes = FILTER_TYPE_MAP[activeFilter];
    return MOCK_ACTIVITIES.filter((a) => allowedTypes.includes(a.type));
  }, [activeFilter]);

  // Visible activities (pagination)
  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  // Group by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: ActivityItem[] }[] = [];
    let currentGroup: string | null = null;

    for (const activity of visibleActivities) {
      if (activity.dateGroup !== currentGroup) {
        currentGroup = activity.dateGroup;
        groups.push({ label: currentGroup, items: [activity] });
      } else {
        groups[groups.length - 1].items.push(activity);
      }
    }

    return groups;
  }, [visibleActivities]);

  const currentDateRangeLabel =
    DATE_RANGE_OPTIONS.find((d) => d.key === dateRange)?.label || '30 jours';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* ============================== */}
      {/* Page Header                    */}
      {/* ============================== */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '4px',
          }}
        >
          Activite
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Historique complet de l&apos;activite de votre cabinet
        </p>
      </div>

      {/* ============================== */}
      {/* Filters Bar                    */}
      {/* ============================== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        {/* Type filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <button
                key={option.key}
                onClick={() => {
                  setActiveFilter(option.key);
                  setVisibleCount(12);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #2563EB' : '1px solid #e5e7eb',
                  backgroundColor: isActive ? '#2563EB' : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                {option.key === 'all' && (
                  <Filter style={{ width: '14px', height: '14px' }} />
                )}
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Date range dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <Calendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
            {currentDateRangeLabel}
            <ChevronDown
              style={{
                width: '14px',
                height: '14px',
                color: '#9ca3af',
                transform: dateDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            />
          </button>

          {dateDropdownOpen && (
            <>
              {/* Invisible overlay to close dropdown */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setDateDropdownOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '4px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  minWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {DATE_RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setDateRange(option.key);
                      setDateDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: dateRange === option.key ? 600 : 400,
                      color: dateRange === option.key ? '#2563EB' : '#374151',
                      backgroundColor: dateRange === option.key ? '#eff6ff' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 100ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (dateRange !== option.key) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (dateRange !== option.key) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================== */}
      {/* Activity count                 */}
      {/* ============================== */}
      <p
        style={{
          fontSize: '13px',
          color: '#9ca3af',
          marginBottom: '20px',
        }}
      >
        {filteredActivities.length} activite{filteredActivities.length > 1 ? 's' : ''}
      </p>

      {/* ============================== */}
      {/* Timeline                       */}
      {/* ============================== */}
      <div style={{ position: 'relative' }}>
        {/* Vertical timeline line */}
        <div
          style={{
            position: 'absolute',
            left: '19px',
            top: '40px',
            bottom: '0',
            width: '2px',
            backgroundColor: '#e5e7eb',
          }}
        />

        {grouped.map((group, groupIndex) => (
          <div key={group.label} style={{ marginBottom: '8px' }}>
            {/* Date group header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar
                  style={{ width: '16px', height: '16px', color: '#6b7280' }}
                />
              </div>
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  padding: '4px 12px',
                  borderRadius: '6px',
                }}
              >
                {group.label}
              </h2>
            </div>

            {/* Activity items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {group.items.map((activity, itemIndex) => {
                const Icon = TYPE_ICONS[activity.type];
                const color = TYPE_COLORS[activity.type];
                const isLast =
                  groupIndex === grouped.length - 1 &&
                  itemIndex === group.items.length - 1;

                return (
                  <div
                    key={activity.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      position: 'relative',
                      paddingBottom: isLast ? '0' : '0',
                    }}
                  >
                    {/* Avatar (overlays timeline) */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: activity.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#ffffff',
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      }}
                    >
                      {getInitials(activity.userName)}
                    </div>

                    {/* Card */}
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '0',
                        overflow: 'hidden',
                        display: 'flex',
                        transition: 'box-shadow 150ms ease, border-color 150ms ease',
                        cursor: 'default',
                        marginBottom: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          '0 2px 8px rgba(0,0,0,0.06)';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {/* Left color stripe */}
                      <div
                        style={{
                          width: '4px',
                          flexShrink: 0,
                          backgroundColor: color,
                        }}
                      />

                      {/* Content */}
                      <div
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Left: description */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#374151',
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#111827' }}>
                              {activity.userName}
                            </span>{' '}
                            {activity.description}{' '}
                            {activity.projectName && (
                              activity.projectId ? (
                                <Link
                                  href={`/dashboard/projects/${activity.projectId}`}
                                  style={{
                                    fontWeight: 600,
                                    color: '#2563EB',
                                    textDecoration: 'none',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textDecoration = 'underline';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textDecoration = 'none';
                                  }}
                                >
                                  {activity.projectName}
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 600, color: '#111827' }}>
                                  {activity.projectName}
                                </span>
                              )
                            )}
                          </p>
                        </div>

                        {/* Right: meta */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexShrink: 0,
                          }}
                        >
                          {/* Type badge */}
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: `${color}14`,
                              color: color,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Icon
                              style={{
                                width: '12px',
                                height: '12px',
                              }}
                            />
                            {TYPE_LABELS[activity.type]}
                          </span>

                          {/* Time */}
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredActivities.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af',
            }}
          >
            <Filter
              style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 12px',
                color: '#d1d5db',
              }}
            />
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#6b7280' }}>
              Aucune activite trouvee
            </p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Essayez de modifier les filtres
            </p>
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* Load more button               */}
      {/* ============================== */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '20px' }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 28px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
          >
            Charger plus
            <ChevronDown style={{ width: '16px', height: '16px' }} />
          </button>
          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '8px',
            }}
          >
            {visibleCount} sur {filteredActivities.length} activites
          </p>
        </div>
      )}

      {/* Bottom padding */}
      {!hasMore && filteredActivities.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 0 20px',
            color: '#d1d5db',
            fontSize: '13px',
          }}
        >
          Fin de l&apos;historique
        </div>
      )}
    </div>
  );
}
