'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronDown,
  FolderKanban,
  Receipt,
  MessageSquare,
  AlertCircle,
  UserPlus,
  FileText,
  Info,
  X,
  Settings,
  Filter,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type NotificationType =
  | 'project_update'
  | 'invoice'
  | 'comment'
  | 'deadline'
  | 'team'
  | 'document'
  | 'system';

type DateGroup = 'Aujourd\'hui' | 'Hier' | 'Cette semaine' | 'Plus ancien';

type FilterTab = 'all' | 'unread' | NotificationType;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  dateGroup: DateGroup;
  isRead: boolean;
  projectName?: string;
  actionLabel?: string;
  actionHref?: string;
}

// ============================================
// Constants
// ============================================

const TYPE_CONFIG: Record<
  NotificationType,
  { color: string; bgLight: string; icon: LucideIcon; label: string }
> = {
  project_update: {
    color: '#2563EB',
    bgLight: '#eff6ff',
    icon: FolderKanban,
    label: 'Projets',
  },
  invoice: {
    color: '#059669',
    bgLight: '#ecfdf5',
    icon: Receipt,
    label: 'Factures',
  },
  comment: {
    color: '#8b5cf6',
    bgLight: '#f5f3ff',
    icon: MessageSquare,
    label: 'Commentaires',
  },
  deadline: {
    color: '#dc2626',
    bgLight: '#fef2f2',
    icon: AlertCircle,
    label: 'Alertes',
  },
  team: {
    color: '#f59e0b',
    bgLight: '#fffbeb',
    icon: UserPlus,
    label: 'Équipe',
  },
  document: {
    color: '#6b7280',
    bgLight: '#f9fafb',
    icon: FileText,
    label: 'Documents',
  },
  system: {
    color: '#0ea5e9',
    bgLight: '#f0f9ff',
    icon: Info,
    label: 'Système',
  },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'project_update', label: 'Projets' },
  { key: 'invoice', label: 'Factures' },
  { key: 'team', label: 'Équipe' },
  { key: 'deadline', label: 'Alertes' },
  { key: 'comment', label: 'Commentaires' },
  { key: 'document', label: 'Documents' },
  { key: 'system', label: 'Système' },
];

const DATE_GROUP_ORDER: DateGroup[] = [
  'Aujourd\'hui',
  'Hier',
  'Cette semaine',
  'Plus ancien',
];

// ============================================
// Mock Data — 20 Notifications
// ============================================

const INITIAL_NOTIFICATIONS: Notification[] = [
  // — Aujourd'hui (1-5) —
  {
    id: 'notif-001',
    type: 'project_update',
    title: 'Phase DCE validée',
    description:
      'La phase Dossier de Consultation des Entreprises a été validée par le maître d\'ouvrage. Vous pouvez maintenant lancer les appels d\'offres.',
    timestamp: 'Il y a 12 minutes',
    dateGroup: 'Aujourd\'hui',
    isRead: false,
    projectName: 'Résidence Les Terrasses',
    actionLabel: 'Voir le projet',
  },
  {
    id: 'notif-002',
    type: 'invoice',
    title: 'Facture #FAC-00234 payée',
    description:
      'Le paiement de 12 400 € a été reçu par virement bancaire. La facture est maintenant marquée comme soldée.',
    timestamp: 'Il y a 45 minutes',
    dateGroup: 'Aujourd\'hui',
    isRead: false,
    projectName: 'Villa Beaumont',
    actionLabel: 'Voir la facture',
  },
  {
    id: 'notif-003',
    type: 'comment',
    title: 'Commentaire de Marie Lefèvre',
    description:
      'Marie a laissé un commentaire sur les plans du RDC : « Les cotes de la cuisine semblent incorrectes, pouvez-vous vérifier ? »',
    timestamp: 'Il y a 1 heure',
    dateGroup: 'Aujourd\'hui',
    isRead: false,
    projectName: 'Résidence Les Terrasses',
    actionLabel: 'Répondre',
  },
  {
    id: 'notif-004',
    type: 'deadline',
    title: 'Échéance dans 3 jours',
    description:
      'Le dépôt du permis de construire pour le projet Maison Martin est prévu le 21 février. Assurez-vous que tous les documents sont prêts.',
    timestamp: 'Il y a 2 heures',
    dateGroup: 'Aujourd\'hui',
    isRead: false,
    projectName: 'Maison Martin',
    actionLabel: 'Voir l\'échéance',
  },
  {
    id: 'notif-005',
    type: 'team',
    title: 'Sophie Bernard a rejoint l\'équipe',
    description:
      'Sophie Bernard a accepté votre invitation et rejoint le cabinet en tant que collaboratrice architecte. Elle a accès aux projets en cours.',
    timestamp: 'Il y a 3 heures',
    dateGroup: 'Aujourd\'hui',
    isRead: false,
    actionLabel: 'Voir le profil',
  },

  // — Hier (6-10) —
  {
    id: 'notif-006',
    type: 'document',
    title: 'Plan PRO importé',
    description:
      'Le plan de phase PRO a été importé avec succès dans le projet. Le fichier fait 24,3 Mo au format DWG.',
    timestamp: 'Hier à 17h30',
    dateGroup: 'Hier',
    isRead: false,
    projectName: 'Bureaux Nextech',
    actionLabel: 'Voir le document',
  },
  {
    id: 'notif-007',
    type: 'project_update',
    title: 'Nouveau jalon atteint',
    description:
      'Le jalon « Livraison APS » a été marqué comme terminé. Le projet passe maintenant en phase APD.',
    timestamp: 'Hier à 14h15',
    dateGroup: 'Hier',
    isRead: false,
    projectName: 'École Montessori',
    actionLabel: 'Voir le projet',
  },
  {
    id: 'notif-008',
    type: 'invoice',
    title: 'Rappel facture #FAC-00229',
    description:
      'La facture de 8 750 € est en retard de 15 jours. Un rappel automatique a été envoyé au client Entreprise Duval.',
    timestamp: 'Hier à 09h00',
    dateGroup: 'Hier',
    isRead: false,
    actionLabel: 'Voir la facture',
  },
  {
    id: 'notif-009',
    type: 'comment',
    title: 'Réponse de Pierre Dumont',
    description:
      'Pierre a répondu à votre commentaire concernant les finitions intérieures : « D\'accord, je mets à jour les plans avec les nouvelles spécifications. »',
    timestamp: 'Hier à 08h45',
    dateGroup: 'Hier',
    isRead: true,
    projectName: 'Résidence Les Terrasses',
    actionLabel: 'Voir le fil',
  },
  {
    id: 'notif-010',
    type: 'deadline',
    title: 'Livraison plans en retard',
    description:
      'La livraison des plans d\'exécution était prévue hier. Veuillez mettre à jour le planning ou contacter le client.',
    timestamp: 'Hier à 08h00',
    dateGroup: 'Hier',
    isRead: true,
    projectName: 'Maison Martin',
    actionLabel: 'Mettre à jour',
  },

  // — Cette semaine (11-15) —
  {
    id: 'notif-011',
    type: 'team',
    title: 'Rôle mis à jour',
    description:
      'Le rôle de Lucas Moreau a été modifié de « Stagiaire » à « Collaborateur ». Il a maintenant accès à la gestion de projets.',
    timestamp: 'Lundi à 16h00',
    dateGroup: 'Cette semaine',
    isRead: true,
    actionLabel: 'Voir les rôles',
  },
  {
    id: 'notif-012',
    type: 'document',
    title: 'Export PDF terminé',
    description:
      'L\'export PDF du dossier complet du projet Restaurant Le Comptoir est prêt. Le fichier contient 87 pages.',
    timestamp: 'Lundi à 11h30',
    dateGroup: 'Cette semaine',
    isRead: true,
    projectName: 'Restaurant Le Comptoir',
    actionLabel: 'Télécharger',
  },
  {
    id: 'notif-013',
    type: 'project_update',
    title: 'Nouveau client ajouté',
    description:
      'L\'entreprise Nexon a été ajoutée à votre base clients. Un projet de rénovation de bureaux est en cours de création.',
    timestamp: 'Dimanche à 10h00',
    dateGroup: 'Cette semaine',
    isRead: true,
    actionLabel: 'Voir le client',
  },
  {
    id: 'notif-014',
    type: 'system',
    title: 'Mise à jour système',
    description:
      'Une maintenance est prévue samedi 22 février de 02h00 à 04h00. L\'application sera temporairement indisponible.',
    timestamp: 'Dimanche à 09h00',
    dateGroup: 'Cette semaine',
    isRead: true,
    actionLabel: 'En savoir plus',
  },
  {
    id: 'notif-015',
    type: 'invoice',
    title: 'Devis #DEV-00156 accepté',
    description:
      'Le devis de 45 000 € HT pour la Villa Beaumont a été accepté par le client. Vous pouvez générer la première facture d\'acompte.',
    timestamp: 'Samedi à 15h00',
    dateGroup: 'Cette semaine',
    isRead: true,
    projectName: 'Villa Beaumont',
    actionLabel: 'Créer la facture',
  },

  // — Plus ancien (16-20) —
  {
    id: 'notif-016',
    type: 'comment',
    title: 'Commentaire sur estimation',
    description:
      'Pierre Martin a commenté l\'estimation budgétaire : « Le poste gros œuvre semble sous-estimé par rapport au marché actuel. »',
    timestamp: 'Il y a 8 jours',
    dateGroup: 'Plus ancien',
    isRead: true,
    projectName: 'Maison Martin',
    actionLabel: 'Voir le commentaire',
  },
  {
    id: 'notif-017',
    type: 'invoice',
    title: 'Paiement partiel reçu',
    description:
      'Un paiement partiel de 5 000 € a été reçu sur la facture #FAC-00230. Le solde restant est de 3 750 €.',
    timestamp: 'Il y a 10 jours',
    dateGroup: 'Plus ancien',
    isRead: true,
    actionLabel: 'Voir la facture',
  },
  {
    id: 'notif-018',
    type: 'document',
    title: 'Document partagé',
    description:
      'Le CCTP Lot 03 — Charpente/Couverture a été partagé avec l\'équipe projet. Tous les collaborateurs y ont maintenant accès.',
    timestamp: 'Il y a 12 jours',
    dateGroup: 'Plus ancien',
    isRead: true,
    projectName: 'École Montessori',
    actionLabel: 'Ouvrir le document',
  },
  {
    id: 'notif-019',
    type: 'team',
    title: 'Invitation acceptée',
    description:
      'Thomas Garcia a accepté votre invitation à collaborer sur le projet Résidence Les Terrasses en tant que consultant structure.',
    timestamp: 'Il y a 2 semaines',
    dateGroup: 'Plus ancien',
    isRead: true,
    projectName: 'Résidence Les Terrasses',
    actionLabel: 'Voir l\'équipe',
  },
  {
    id: 'notif-020',
    type: 'system',
    title: 'Sauvegarde automatique',
    description:
      'La sauvegarde hebdomadaire a été effectuée avec succès. 45 fichiers ont été archivés pour une taille totale de 1,2 Go.',
    timestamp: 'Il y a 2 semaines',
    dateGroup: 'Plus ancien',
    isRead: true,
    actionLabel: 'Voir les sauvegardes',
  },
];

const ITEMS_PER_PAGE = 10;

// ============================================
// Component
// ============================================

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [hoveredDismiss, setHoveredDismiss] = useState<string | null>(null);
  const [hoveredReadLink, setHoveredReadLink] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<FilterTab | null>(null);
  const [hoveredMarkAll, setHoveredMarkAll] = useState(false);
  const [hoveredSettings, setHoveredSettings] = useState(false);
  const [hoveredLoadMore, setHoveredLoadMore] = useState(false);

  // Derived data
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread')
      return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const visibleNotifications = useMemo(
    () => filteredNotifications.slice(0, visibleCount),
    [filteredNotifications, visibleCount]
  );

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    for (const notif of visibleNotifications) {
      if (!groups[notif.dateGroup]) {
        groups[notif.dateGroup] = [];
      }
      groups[notif.dateGroup].push(notif);
    }
    return groups;
  }, [visibleNotifications]);

  const hasMore = visibleCount < filteredNotifications.length;

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
    };
    for (const type of Object.keys(TYPE_CONFIG)) {
      counts[type] = notifications.filter((n) => n.type === type).length;
    }
    return counts;
  }, [notifications]);

  // Actions
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  // Reset visible count when changing filter
  const handleFilterChange = useCallback((tab: FilterTab) => {
    setActiveFilter(tab);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  return (
    <div className="flex flex-col" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* ============================== */}
      {/* Header Row                     */}
      {/* ============================== */}
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '24px' }}>
        {/* Title + Badge */}
        <div className="flex items-center gap-3">
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#2563EB',
                borderRadius: '9999px',
                lineHeight: '20px',
              }}
            >
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mark all as read */}
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            onMouseEnter={() => setHoveredMarkAll(true)}
            onMouseLeave={() => setHoveredMarkAll(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: unreadCount === 0 ? '#9ca3af' : hoveredMarkAll ? '#1d4ed8' : '#2563EB',
              backgroundColor: unreadCount === 0 ? '#f3f4f6' : hoveredMarkAll ? '#eff6ff' : '#ffffff',
              border: `1px solid ${unreadCount === 0 ? '#e5e7eb' : hoveredMarkAll ? '#bfdbfe' : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
              opacity: unreadCount === 0 ? 0.6 : 1,
            }}
          >
            <CheckCheck style={{ width: '15px', height: '15px' }} />
            Tout marquer comme lu
          </button>

          {/* Settings gear */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              onMouseEnter={() => setHoveredSettings(true)}
              onMouseLeave={() => setHoveredSettings(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: hoveredSettings ? '#f9fafb' : '#ffffff',
                color: hoveredSettings ? '#374151' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              title="Paramètres de notifications"
            >
              <Settings style={{ width: '16px', height: '16px' }} />
            </button>

            {/* Settings dropdown */}
            {settingsOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setSettingsOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    padding: '6px',
                    zIndex: 50,
                  }}
                >
                  {[
                    { label: 'Préférences email', icon: Bell },
                    { label: 'Notifications push', icon: Bell },
                    { label: 'Ne pas déranger', icon: BellOff },
                    { label: 'Gérer les filtres', icon: Filter },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSettingsOpen(false)}
                      className="flex items-center gap-2"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: 450,
                        color: '#374151',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <item.icon style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* Filter Tabs                    */}
      {/* ============================== */}
      <div
        className="flex items-center gap-2 flex-wrap"
        style={{
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          const isHovered = hoveredTab === tab.key;
          const count = filterCounts[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 450,
                color: isActive ? '#ffffff' : isHovered ? '#374151' : '#6b7280',
                backgroundColor: isActive
                  ? '#2563EB'
                  : isHovered
                    ? '#f3f4f6'
                    : '#ffffff',
                border: `1px solid ${isActive ? '#2563EB' : '#e5e7eb'}`,
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '0 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                    color: isActive ? '#ffffff' : '#9ca3af',
                    lineHeight: '18px',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================== */}
      {/* Notification List               */}
      {/* ============================== */}
      {filteredNotifications.length === 0 ? (
        /* Empty State */
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              marginBottom: '20px',
            }}
          >
            <Bell style={{ width: '32px', height: '32px', color: '#9ca3af' }} />
          </div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '8px',
            }}
          >
            Aucune notification
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              maxWidth: '360px',
              lineHeight: 1.6,
            }}
          >
            {activeFilter === 'unread'
              ? 'Vous avez lu toutes vos notifications. Bravo !'
              : activeFilter !== 'all'
                ? `Aucune notification de type « ${FILTER_TABS.find((t) => t.key === activeFilter)?.label ?? ''} » pour le moment.`
                : 'Vous n\'avez aucune notification pour le moment. Elles apparaîtront ici lorsque quelque chose se passera.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: '32px' }}>
          {DATE_GROUP_ORDER.map((group) => {
            const items = groupedNotifications[group];
            if (!items || items.length === 0) return null;

            return (
              <div key={group}>
                {/* Date Group Header */}
                <div
                  className="flex items-center gap-3"
                  style={{ marginBottom: '12px' }}
                >
                  <h2
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {group}
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                </div>

                {/* Notification Cards */}
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  {items.map((notif) => {
                    const config = TYPE_CONFIG[notif.type];
                    const IconComp = config.icon;
                    const isHovered = hoveredCard === notif.id;

                    return (
                      <div
                        key={notif.id}
                        onMouseEnter={() => setHoveredCard(notif.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'flex-start',
                          backgroundColor: notif.isRead
                            ? isHovered
                              ? '#fafafa'
                              : '#ffffff'
                            : isHovered
                              ? '#f8faff'
                              : '#fafcff',
                          border: `1px solid ${
                            notif.isRead
                              ? isHovered
                                ? '#d1d5db'
                                : '#e5e7eb'
                              : isHovered
                                ? '#bfdbfe'
                                : '#dbeafe'
                          }`,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 180ms ease',
                          boxShadow: isHovered
                            ? '0 4px 12px -2px rgba(0,0,0,0.08)'
                            : '0 1px 3px -1px rgba(0,0,0,0.04)',
                        }}
                      >
                        {/* Left Colored Stripe */}
                        <div
                          style={{
                            width: '4px',
                            alignSelf: 'stretch',
                            backgroundColor: config.color,
                            flexShrink: 0,
                            borderRadius: '4px 0 0 4px',
                          }}
                        />

                        {/* Card Content */}
                        <div
                          className="flex items-start gap-3 flex-1"
                          style={{ padding: '14px 16px' }}
                        >
                          {/* Icon Circle */}
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: config.bgLight,
                              flexShrink: 0,
                              marginTop: '1px',
                            }}
                          >
                            <IconComp
                              style={{
                                width: '17px',
                                height: '17px',
                                color: config.color,
                              }}
                            />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1" style={{ minWidth: 0 }}>
                            {/* Title Row */}
                            <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                              {/* Unread dot */}
                              {!notif.isRead && (
                                <span
                                  style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2563EB',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <h3
                                style={{
                                  fontSize: '14px',
                                  fontWeight: notif.isRead ? 450 : 600,
                                  color: '#111827',
                                  lineHeight: 1.3,
                                }}
                              >
                                {notif.title}
                              </h3>
                            </div>

                            {/* Description */}
                            <p
                              style={{
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#6b7280',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                marginBottom: '8px',
                              }}
                            >
                              {notif.description}
                            </p>

                            {/* Meta Row */}
                            <div className="flex items-center gap-3 flex-wrap">
                              {/* Timestamp */}
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: '#9ca3af',
                                  fontWeight: 400,
                                }}
                              >
                                {notif.timestamp}
                              </span>

                              {/* Project Badge */}
                              {notif.projectName && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '2px 8px',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    color: '#4b5563',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '6px',
                                    lineHeight: '18px',
                                  }}
                                >
                                  <FolderKanban style={{ width: '10px', height: '10px' }} />
                                  {notif.projectName}
                                </span>
                              )}

                              {/* Mark as read link */}
                              {!notif.isRead && (
                                <>
                                  <span style={{ color: '#d1d5db', fontSize: '12px' }}>·</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notif.id);
                                    }}
                                    onMouseEnter={() => setHoveredReadLink(notif.id)}
                                    onMouseLeave={() => setHoveredReadLink(null)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: 0,
                                      fontSize: '12px',
                                      fontWeight: 500,
                                      color: hoveredReadLink === notif.id ? '#1d4ed8' : '#2563EB',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      textDecoration: hoveredReadLink === notif.id ? 'underline' : 'none',
                                      transition: 'all 150ms ease',
                                    }}
                                  >
                                    <Check style={{ width: '12px', height: '12px' }} />
                                    Marquer comme lu
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Right Side: Action + Dismiss */}
                          <div
                            className="flex items-center gap-2"
                            style={{
                              flexShrink: 0,
                              marginLeft: '8px',
                              opacity: isHovered ? 1 : 0,
                              transition: 'opacity 150ms ease',
                            }}
                          >
                            {/* Action Button */}
                            {notif.actionLabel && (
                              <button
                                onMouseEnter={() => setHoveredAction(notif.id)}
                                onMouseLeave={() => setHoveredAction(null)}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  color: hoveredAction === notif.id ? '#ffffff' : '#2563EB',
                                  backgroundColor:
                                    hoveredAction === notif.id ? '#2563EB' : '#eff6ff',
                                  border: '1px solid',
                                  borderColor:
                                    hoveredAction === notif.id ? '#2563EB' : '#bfdbfe',
                                  borderRadius: '7px',
                                  cursor: 'pointer',
                                  transition: 'all 150ms ease',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {notif.actionLabel}
                              </button>
                            )}

                            {/* Dismiss Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notif.id);
                              }}
                              onMouseEnter={() => setHoveredDismiss(notif.id)}
                              onMouseLeave={() => setHoveredDismiss(null)}
                              title="Supprimer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor:
                                  hoveredDismiss === notif.id ? '#fef2f2' : 'transparent',
                                color:
                                  hoveredDismiss === notif.id ? '#dc2626' : '#9ca3af',
                                cursor: 'pointer',
                                transition: 'all 150ms ease',
                              }}
                            >
                              <X style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ============================== */}
          {/* Load More Button               */}
          {/* ============================== */}
          {hasMore && (
            <div className="flex justify-center" style={{ paddingTop: '8px', paddingBottom: '16px' }}>
              <button
                onClick={loadMore}
                onMouseEnter={() => setHoveredLoadMore(true)}
                onMouseLeave={() => setHoveredLoadMore(false)}
                className="flex items-center gap-2"
                style={{
                  padding: '10px 28px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: hoveredLoadMore ? '#1d4ed8' : '#2563EB',
                  backgroundColor: hoveredLoadMore ? '#eff6ff' : '#ffffff',
                  border: `1px solid ${hoveredLoadMore ? '#bfdbfe' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: hoveredLoadMore
                    ? '0 2px 8px -2px rgba(37,99,235,0.15)'
                    : '0 1px 2px -1px rgba(0,0,0,0.05)',
                }}
              >
                <ChevronDown style={{ width: '16px', height: '16px' }} />
                Charger plus ({filteredNotifications.length - visibleCount} restante
                {filteredNotifications.length - visibleCount > 1 ? 's' : ''})
              </button>
            </div>
          )}

          {/* ============================== */}
          {/* Summary Footer                 */}
          {/* ============================== */}
          {!hasMore && filteredNotifications.length > 0 && (
            <div
              className="flex items-center justify-center"
              style={{
                padding: '20px 0 8px',
                borderTop: '1px solid #f3f4f6',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  fontWeight: 400,
                }}
              >
                {filteredNotifications.length} notification
                {filteredNotifications.length > 1 ? 's' : ''} au total
                {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
