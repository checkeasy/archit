'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  UserPlus,
  Users,
  Clock,
  Building2,
  UserCheck,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  Briefcase,
  X,
  Send,
  RefreshCw,
  XCircle,
  Edit3,
  UserMinus,
  Trash2,
  Crown,
  Palette,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type MemberRole = 'Admin' | 'Architecte' | 'Collaborateur';
type MemberStatus = 'Actif' | 'En attente';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  dateLabel: string;
  isPending: boolean;
  avatarColor: string;
}

// ============================================
// Mock Data
// ============================================

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    title: 'Architecte DPLG',
    email: 'jean.dupont@cabinet-dupont.fr',
    role: 'Admin',
    status: 'Actif',
    dateLabel: 'Rejoint le 15/01/2025',
    isPending: false,
    avatarColor: '#2563EB',
  },
  {
    id: '2',
    name: 'Marie Lefèvre',
    title: "Architecte d'intérieur",
    email: 'marie.lefevre@cabinet-dupont.fr',
    role: 'Architecte',
    status: 'Actif',
    dateLabel: 'Rejoint le 03/03/2025',
    isPending: false,
    avatarColor: '#7C3AED',
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    title: 'Chef de projet',
    email: 'sophie.bernard@cabinet-dupont.fr',
    role: 'Collaborateur',
    status: 'Actif',
    dateLabel: 'Rejoint le 20/05/2025',
    isPending: false,
    avatarColor: '#059669',
  },
  {
    id: '4',
    name: 'Pierre Martin',
    title: 'Dessinateur projeteur',
    email: 'pierre.martin@cabinet-dupont.fr',
    role: 'Collaborateur',
    status: 'Actif',
    dateLabel: 'Rejoint le 08/09/2025',
    isPending: false,
    avatarColor: '#D97706',
  },
  {
    id: '5',
    name: 'Camille Roux',
    title: 'Stagiaire architecte',
    email: 'camille.roux@cabinet-dupont.fr',
    role: 'Collaborateur',
    status: 'Actif',
    dateLabel: 'Rejoint le 06/01/2026',
    isPending: false,
    avatarColor: '#DC2626',
  },
  {
    id: '6',
    name: 'thomas.garcia@gmail.com',
    title: '',
    email: 'thomas.garcia@gmail.com',
    role: 'Architecte',
    status: 'En attente',
    dateLabel: 'Invité le 10/02/2026',
    isPending: true,
    avatarColor: '#9CA3AF',
  },
  {
    id: '7',
    name: 'julie.blanc@outlook.fr',
    title: '',
    email: 'julie.blanc@outlook.fr',
    role: 'Collaborateur',
    status: 'En attente',
    dateLabel: 'Invité le 15/02/2026',
    isPending: true,
    avatarColor: '#9CA3AF',
  },
];

// ============================================
// Helpers
// ============================================

function getInitials(name: string): string {
  if (name.includes('@')) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRoleBadgeStyle(role: MemberRole): React.CSSProperties {
  switch (role) {
    case 'Admin':
      return {
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        border: '1px solid #BFDBFE',
      };
    case 'Architecte':
      return {
        backgroundColor: '#F5F3FF',
        color: '#7C3AED',
        border: '1px solid #DDD6FE',
      };
    case 'Collaborateur':
      return {
        backgroundColor: '#F9FAFB',
        color: '#4B5563',
        border: '1px solid #E5E7EB',
      };
  }
}

function getStatusBadgeStyle(status: MemberStatus): React.CSSProperties {
  switch (status) {
    case 'Actif':
      return {
        backgroundColor: '#F0FDF4',
        color: '#16A34A',
        border: '1px solid #BBF7D0',
      };
    case 'En attente':
      return {
        backgroundColor: '#FFFBEB',
        color: '#D97706',
        border: '1px solid #FDE68A',
      };
  }
}

// ============================================
// Action Dropdown Component
// ============================================

function ActionDropdown({ member }: { member: TeamMember }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const actions = member.isPending
    ? [
        { label: 'Renvoyer l’invitation', icon: RefreshCw, color: '#2563EB' },
        { label: 'Annuler l’invitation', icon: XCircle, color: '#DC2626' },
      ]
    : [
        { label: 'Modifier le rôle', icon: Edit3, color: '#4B5563' },
        { label: 'Désactiver', icon: UserMinus, color: '#D97706' },
        { label: 'Supprimer', icon: Trash2, color: '#DC2626' },
      ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          backgroundColor: open ? '#F3F4F6' : '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F3F4F6';
          e.currentTarget.style.borderColor = '#D1D5DB';
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }
        }}
      >
        <MoreHorizontal style={{ width: '16px', height: '16px', color: '#6B7280' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '38px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
            zIndex: 50,
            minWidth: '200px',
            padding: '4px',
            animation: 'fadeInDown 150ms ease',
          }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: action.color,
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon style={{ width: '15px', height: '15px' }} />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// Invite Modal Component
// ============================================

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Architecte' | 'Collaborateur'>('Architecte');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!email) return;
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 200ms ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '460px',
          padding: '0',
          animation: 'scaleIn 200ms ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus style={{ width: '18px', height: '18px', color: '#2563EB' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
                Inviter un membre
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Envoyez une invitation par email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#9CA3AF',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#4B5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="invite-email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Adresse email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9CA3AF',
                }}
              />
              <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  fontSize: '14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#111827',
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Rôle
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['Architecte', 'Collaborateur'] as const).map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: isSelected
                        ? r === 'Architecte'
                          ? '2px solid #7C3AED'
                          : '2px solid #6B7280'
                        : '1px solid #E5E7EB',
                      backgroundColor: isSelected
                        ? r === 'Architecte'
                          ? '#F5F3FF'
                          : '#F9FAFB'
                        : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected
                        ? r === 'Architecte'
                          ? '#7C3AED'
                          : '#4B5563'
                        : '#6B7280',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {r === 'Architecte' ? (
                      <Building2 style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Briefcase style={{ width: '16px', height: '16px' }} />
                    )}
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info box */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontSize: '12px', color: '#0369A1', lineHeight: 1.5, margin: 0 }}>
              Un email d&apos;invitation sera envoyé avec un lien pour rejoindre votre cabinet.
              L&apos;invitation expire après 7 jours.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                color: '#4B5563',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={!email || sending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: !email || sending ? '#93C5FD' : '#2563EB',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: !email || sending ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (email && !sending) {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                }
              }}
              onMouseLeave={(e) => {
                if (email && !sending) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }
              }}
            >
              <Send style={{ width: '15px', height: '15px' }} />
              {sending ? 'Envoi en cours...' : 'Envoyer l’invitation'}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const stats = [
    {
      label: 'Membres actifs',
      value: 5,
      icon: Users,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
    },
    {
      label: 'Invitations en attente',
      value: 2,
      icon: Clock,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
    },
    {
      label: 'Architectes',
      value: 3,
      icon: Building2,
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
    },
    {
      label: 'Collaborateurs',
      value: 4,
      icon: UserCheck,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
  ];

  const rolePermissions = [
    {
      role: 'Admin',
      description: 'Accès complet à toutes les fonctionnalités',
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: Crown,
      permissions: [
        'Gestion des membres',
        'Facturation et abonnement',
        'Paramètres du cabinet',
        'Tous les projets et documents',
      ],
    },
    {
      role: 'Architecte',
      description: 'Gestion complète des projets',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: Palette,
      permissions: [
        'Projets et documents',
        'Clients et contacts',
        'Devis et facturation',
        'Calendrier et planification',
      ],
    },
    {
      role: 'Collaborateur',
      description: 'Accès aux projets assignés',
      color: '#4B5563',
      bgColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      icon: Briefcase,
      permissions: [
        'Projets assignés uniquement',
        'Documents partagés',
        'Commentaires et notes',
        'Consultation du calendrier',
      ],
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ============================================ */}
      {/* Page Header                                  */}
      {/* ============================================ */}
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/dashboard/settings"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B7280',
            textDecoration: 'none',
            marginBottom: '16px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Retour aux paramètres
        </Link>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Gestion de l’équipe
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
              Gérez les membres de votre cabinet et leurs permissions
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.3)';
            }}
          >
            <UserPlus style={{ width: '17px', height: '17px' }} />
            Inviter un membre
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Stats Cards                                  */}
      {/* ============================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                transition: 'box-shadow 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: '22px', height: '22px', color: stat.iconColor }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#111827',
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', margin: 0, marginTop: '2px' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* Team Members Table                           */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          marginBottom: '28px',
          overflow: 'hidden',
        }}
      >
        {/* Table header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users style={{ width: '18px', height: '18px', color: '#6B7280' }} />
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
              Membres de l&apos;équipe
            </h2>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                backgroundColor: '#F3F4F6',
                padding: '2px 8px',
                borderRadius: '20px',
              }}
            >
              {teamMembers.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Membre
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Rôle
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: '12px 24px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => {
                const initials = getInitials(member.name);
                return (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: index < teamMembers.length - 1 ? '1px solid #F9FAFB' : 'none',
                      transition: 'background-color 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FAFBFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Member info */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Avatar */}
                        {member.isPending ? (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#F3F4F6',
                              border: '2px dashed #D1D5DB',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Mail style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: member.avatarColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: '14px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                        )}

                        {/* Name + details */}
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: member.isPending ? '#6B7280' : '#111827',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.isPending ? member.email : member.name}
                          </p>
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#9CA3AF',
                              margin: 0,
                              marginTop: '2px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.isPending ? '(invitation)' : `${member.title} \u2022 ${member.email}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          ...getRoleBadgeStyle(member.role),
                        }}
                      >
                        {member.role === 'Admin' && <ShieldCheck style={{ width: '12px', height: '12px' }} />}
                        {member.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          ...getStatusBadgeStyle(member.status),
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor:
                              member.status === 'Actif' ? '#16A34A' : '#D97706',
                          }}
                        />
                        {member.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                        {member.dateLabel}
                      </p>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ActionDropdown member={member} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================ */}
      {/* Roles & Permissions Section                  */}
      {/* ============================================ */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Rôles et permissions
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            Découvrez les différents niveaux d&apos;accès disponibles
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {rolePermissions.map((rp) => {
            const Icon = rp.icon;
            return (
              <div
                key={rp.role}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${rp.borderColor}`,
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'box-shadow 200ms ease, transform 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.07)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: rp.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: rp.color }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0,
                      }}
                    >
                      {rp.role}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, marginTop: '2px' }}>
                      {rp.description}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '16px' }} />

                {/* Permissions list */}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {rp.permissions.map((perm, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 0',
                        fontSize: '13px',
                        color: '#4B5563',
                      }}
                    >
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: rp.color,
                          flexShrink: 0,
                        }}
                      />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Responsive grid styles                       */}
      {/* ============================================ */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>

      {/* Invite Modal */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
    </div>
  );
}
