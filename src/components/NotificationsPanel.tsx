'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import {
  FolderKanban,
  Receipt,
  MessageSquare,
  AlertCircle,
  UserPlus,
  FileText,
  Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
type NotificationType =
  | 'project_update'
  | 'invoice'
  | 'comment'
  | 'deadline'
  | 'team'
  | 'document';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  projectName?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Type config ─────────────────────────────────────────────────────
const TYPE_CONFIG: Record<NotificationType, { color: string; icon: LucideIcon }> = {
  project_update: { color: '#2563EB', icon: FolderKanban },
  invoice: { color: '#059669', icon: Receipt },
  comment: { color: '#8b5cf6', icon: MessageSquare },
  deadline: { color: '#dc2626', icon: AlertCircle },
  team: { color: '#f59e0b', icon: UserPlus },
  document: { color: '#6b7280', icon: FileText },
};

// ─── Mock notifications ──────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'project_update',
    title: 'Phase DCE validée',
    description: 'La phase DCE du projet a été validée par le maître d\'ouvrage.',
    time: 'Il y a 5 min',
    read: false,
    projectName: 'Résidence Les Terrasses',
  },
  {
    id: 'notif-2',
    type: 'invoice',
    title: 'Facture #FAC-00234 payée',
    description: 'Le paiement de 12 400 € a été reçu sur votre compte.',
    time: 'Il y a 23 min',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'comment',
    title: 'Nouveau commentaire de Marie Lefèvre',
    description: 'Marie a commenté sur le plan du RDC : "Il faudrait revoir l\'implantation..."',
    time: 'Il y a 1h',
    read: false,
    projectName: 'Maison Martin',
  },
  {
    id: 'notif-4',
    type: 'deadline',
    title: 'Échéance dans 3 jours',
    description: 'Le dépôt du permis de construire doit être effectué avant le 21 février.',
    time: 'Il y a 2h',
    read: false,
    projectName: 'Restaurant Le Comptoir',
  },
  {
    id: 'notif-5',
    type: 'team',
    title: 'Sophie Bernard a rejoint l\'équipe',
    description: 'Sophie a accepté votre invitation en tant que collaboratrice.',
    time: 'Il y a 3h',
    read: false,
  },
  {
    id: 'notif-6',
    type: 'document',
    title: 'Plan PRO importé',
    description: 'Le plan PRO de la phase APD a été importé avec succès.',
    time: 'Il y a 4h',
    read: false,
    projectName: 'Bureaux Nextech',
  },
  {
    id: 'notif-7',
    type: 'project_update',
    title: 'Nouveau jalon atteint',
    description: 'Le projet est passé en phase APS. Félicitations !',
    time: 'Il y a 5h',
    read: false,
    projectName: 'École Montessori',
  },
  {
    id: 'notif-8',
    type: 'invoice',
    title: 'Rappel : Facture #FAC-00229 en attente',
    description: 'Cette facture de 8 750 € est en attente depuis 15 jours.',
    time: 'Il y a 6h',
    read: false,
  },
  {
    id: 'notif-9',
    type: 'comment',
    title: 'Réponse de Pierre Dumont',
    description: 'Pierre a répondu à votre question sur les finitions intérieures.',
    time: 'Hier',
    read: true,
    projectName: 'Résidence Les Terrasses',
  },
  {
    id: 'notif-10',
    type: 'deadline',
    title: 'Échéance passée - Livraison plans',
    description: 'La livraison des plans définitifs était prévue hier.',
    time: 'Hier',
    read: true,
    projectName: 'Maison Martin',
  },
  {
    id: 'notif-11',
    type: 'team',
    title: 'Rôle mis à jour - Lucas Moreau',
    description: 'Lucas est passé de "Lecteur" à "Éditeur" sur le projet.',
    time: 'Il y a 2 jours',
    read: true,
    projectName: 'Bureaux Nextech',
  },
  {
    id: 'notif-12',
    type: 'document',
    title: 'Export PDF terminé',
    description: 'Le dossier complet PRO a été exporté en PDF (34 pages).',
    time: 'Il y a 3 jours',
    read: true,
    projectName: 'Restaurant Le Comptoir',
  },
];

// ─── Component ───────────────────────────────────────────────────────
export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── Inject keyframe animation once ─────────────────────────────────
  useEffect(() => {
    const styleId = 'notifications-panel-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes notifPanelIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // ─── Close on Escape ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Close on outside click ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    // Delay to prevent the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ─── Mark all as read ───────────────────────────────────────────────
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── Mark single as read ────────────────────────────────────────────
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: '56px',
        right: '16px',
        width: '380px',
        maxHeight: '480px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        zIndex: 50,
        animation: 'notifPanelIn 200ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '10px' }}>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: '24px',
              }}
            >
              Notifications
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 7px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#2563EB',
                  borderRadius: '11px',
                  lineHeight: '1',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#2563EB',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* ─── Notifications List ─── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {notifications.length === 0 ? (
          /* ─── Empty State ─── */
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: '48px 20px',
              gap: '12px',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
              }}
            >
              <Bell
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#9ca3af',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#6b7280',
              }}
            >
              Aucune notification
            </span>
            <span
              style={{
                fontSize: '13px',
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              Vous serez notifié des mises à jour de vos projets ici.
            </span>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = TYPE_CONFIG[notification.type];
            const IconComponent = config.icon;
            const isHovered = hoveredId === notification.id;

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                onMouseEnter={() => setHoveredId(notification.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px 16px 12px 0',
                  cursor: 'pointer',
                  backgroundColor: isHovered
                    ? '#f3f4f6'
                    : notification.read
                      ? '#ffffff'
                      : '#f8faff',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 150ms ease',
                  position: 'relative',
                }}
              >
                {/* ─── Left color indicator ─── */}
                <div
                  style={{
                    width: '4px',
                    alignSelf: 'stretch',
                    backgroundColor: notification.read ? 'transparent' : config.color,
                    borderRadius: '0 4px 4px 0',
                    flexShrink: 0,
                  }}
                />

                {/* ─── Icon ─── */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${config.color}14`,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <IconComponent
                    style={{
                      width: '18px',
                      height: '18px',
                      color: config.color,
                    }}
                  />
                </div>

                {/* ─── Content ─── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-start justify-between" style={{ gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: notification.read ? 500 : 600,
                        color: '#111827',
                        lineHeight: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#2563EB',
                          flexShrink: 0,
                          marginTop: '5px',
                        }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      lineHeight: '17px',
                      marginTop: '2px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: '2px 0 0 0',
                    }}
                  >
                    {notification.description}
                  </p>

                  <div
                    className="flex items-center"
                    style={{
                      marginTop: '6px',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: 400,
                      }}
                    >
                      {notification.time}
                    </span>
                    {notification.projectName && (
                      <>
                        <span
                          style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            backgroundColor: '#d1d5db',
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: 500,
                          }}
                        >
                          {notification.projectName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Footer ─── */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            textAlign: 'center',
          }}
        >
          <button
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#2563EB',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: '6px',
              transition: 'background-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
}
