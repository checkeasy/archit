'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Users,
  CreditCard,
  Plug,
  Bell,
  Shield,
  ChevronRight,
  Pencil,
  Download,
  Trash2,
  AlertTriangle,
  Clock,
  HardDrive,
  CalendarDays,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

// ============================================
// Mock profile data
// ============================================

const mockProfile: Profile = {
  id: 'u1',
  email: 'jean.dupont@cabinet-dupont.fr',
  full_name: 'Jean Dupont',
  avatar_url: null,
  role: 'admin',
  firm_name: 'Cabinet Dupont Architectes',
  phone: '06 12 34 56 78',
  address: '15 rue de la Paix, 75002 Paris',
  siret: '123 456 789 00012',
  created_at: '2025-06-01T10:00:00Z',
  updated_at: '2026-02-10T14:30:00Z',
};

// ============================================
// Navigation card data
// ============================================

const settingsCards = [
  {
    href: '/dashboard/settings/profile',
    icon: User,
    title: 'Profil',
    description: 'Informations personnelles et coordonnées',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    hoverBorder: '#93C5FD',
    hoverShadow: 'rgba(37,99,235,0.08)',
  },
  {
    href: '/dashboard/settings/team',
    icon: Users,
    title: 'Équipe',
    description: 'Membres, rôles et permissions',
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    hoverBorder: '#C4B5FD',
    hoverShadow: 'rgba(124,58,237,0.08)',
  },
  {
    href: '/dashboard/settings/billing',
    icon: CreditCard,
    title: 'Facturation',
    description: 'Abonnement, plans et paiements',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    hoverBorder: '#6EE7B7',
    hoverShadow: 'rgba(5,150,105,0.08)',
  },
  {
    href: '/dashboard/settings/integrations',
    icon: Plug,
    title: 'Intégrations',
    description: 'API, connecteurs et services tiers',
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    hoverBorder: '#FDBA74',
    hoverShadow: 'rgba(234,88,12,0.08)',
  },
  {
    href: '/dashboard/settings/notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Email, push et alertes projet',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    hoverBorder: '#FCD34D',
    hoverShadow: 'rgba(217,119,6,0.08)',
  },
  {
    href: '/dashboard/settings/security',
    icon: Shield,
    title: 'Sécurité',
    description: '2FA, sessions et confidentialité',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    hoverBorder: '#FCA5A5',
    hoverShadow: 'rgba(220,38,38,0.08)',
  },
];

// ============================================
// SettingsNavCard component
// ============================================

function SettingsNavCard({
  href,
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  hoverBorder,
  hoverShadow,
}: (typeof settingsCards)[number]) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4"
      style={{
        padding: '20px',
        borderRadius: 14,
        border: '1.5px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        textDecoration: 'none',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.boxShadow = `0 4px 16px ${hoverShadow}`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E7EB';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: iconBg,
        }}
      >
        <Icon style={{ width: 22, height: 22, color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#111827',
            marginBottom: 2,
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
      <ChevronRight
        style={{
          width: 18,
          height: 18,
          color: '#D1D5DB',
          transition: 'all 200ms ease',
        }}
        className="group-hover:translate-x-0.5"
      />
    </Link>
  );
}

// ============================================
// Delete confirmation modal
// ============================================

function DeleteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  async function handleDelete() {
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDeleting(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md mx-4"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(0,0,0,0.16)',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #FEE2E2',
            backgroundColor: '#FEF2F2',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FEE2E2',
              }}
            >
              <AlertTriangle style={{ width: 20, height: 20, color: '#DC2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#991B1B' }}>
                Supprimer le compte
              </p>
              <p style={{ fontSize: 12, color: '#DC2626' }}>
                Action irréversible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#991B1B',
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>
            Cette action supprimera définitivement votre compte, vos projets,
            vos documents et toutes vos données associées.
            <strong style={{ color: '#111827' }}> Cette action est irréversible.</strong>
          </p>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="deleteConfirm"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 8 }}
            >
              Tapez <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 6px', borderRadius: 4 }}>SUPPRIMER</span> pour confirmer
            </label>
            <input
              id="deleteConfirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                fontSize: 14,
                borderRadius: 10,
                border: '1.5px solid #FCA5A5',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                color: '#111827',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#DC2626';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#FCA5A5';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'SUPPRIMER' || deleting}
              className="flex-1 flex items-center justify-center gap-2"
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                border: 'none',
                backgroundColor: confirmText === 'SUPPRIMER' && !deleting ? '#DC2626' : '#F9A8A8',
                color: '#FFFFFF',
                cursor: confirmText === 'SUPPRIMER' && !deleting ? 'pointer' : 'not-allowed',
                opacity: confirmText === 'SUPPRIMER' && !deleting ? 1 : 0.6,
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (confirmText === 'SUPPRIMER' && !deleting) {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }
              }}
              onMouseLeave={(e) => {
                if (confirmText === 'SUPPRIMER' && !deleting) {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }
              }}
            >
              <Trash2 style={{ width: 16, height: 16 }} />
              {deleting ? 'Suppression...' : 'Supprimer définitivement'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 10,
                border: '1.5px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Settings Page
// ============================================

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Derived values
  const initials = mockProfile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const lastLogin = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date('2026-02-19T09:15:00Z'));

  // Storage values
  const storageUsedGo = 2.4;
  const storageTotalGo = 10;
  const storagePercent = Math.round((storageUsedGo / storageTotalGo) * 100);

  // Team values
  const teamCurrent = 4;
  const teamMax = 10;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ============================================ */}
      {/* Page Header */}
      {/* ============================================ */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          Paramètres
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280' }}>
          Gérez votre profil, votre cabinet et vos préférences.
        </p>
      </div>

      {/* ============================================ */}
      {/* Navigation Grid (3 cols x 2 rows) */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <SettingsNavCard key={card.href} {...card} />
        ))}
      </div>

      {/* ============================================ */}
      {/* Quick Profile Section */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: 16,
          padding: '28px',
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                border: '2.5px solid #BFDBFE',
                fontSize: 22,
                fontWeight: 700,
                color: '#2563EB',
                letterSpacing: 1,
              }}
            >
              {initials}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
                  {mockProfile.full_name}
                </h2>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 6,
                    padding: '3px 10px',
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}
                >
                  Administrateur
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
                {mockProfile.email}
              </p>
              <div className="flex items-center gap-1.5" style={{ marginTop: 8 }}>
                <Clock style={{ width: 13, height: 13, color: '#9CA3AF' }} />
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>
                  Dernière connexion : {lastLogin}
                </p>
              </div>
            </div>
          </div>

          {/* Quick edit button */}
          <Link
            href="/dashboard/settings/profile"
            className="flex items-center gap-2 shrink-0"
            style={{
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: '#2563EB',
              backgroundColor: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DBEAFE';
              e.currentTarget.style.borderColor = '#93C5FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EFF6FF';
              e.currentTarget.style.borderColor = '#BFDBFE';
            }}
          >
            <Pencil style={{ width: 14, height: 14 }} />
            Modifier le profil
          </Link>
        </div>
      </div>

      {/* ============================================ */}
      {/* Account Summary Section */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: 16,
          padding: '28px',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 24 }}>
          Résumé du compte
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Current plan */}
          <div
            style={{
              padding: '18px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAFA',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <CreditCard style={{ width: 16, height: 16, color: '#059669' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Abonnement
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>Pro</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 5,
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Actif
              </span>
            </div>
          </div>

          {/* Storage */}
          <div
            style={{
              padding: '18px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAFA',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <HardDrive style={{ width: 16, height: 16, color: '#2563EB' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Stockage
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              {storageUsedGo} Go <span style={{ fontWeight: 400, color: '#9CA3AF' }}>/ {storageTotalGo} Go</span>
            </p>
            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                backgroundColor: '#E5E7EB',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${storagePercent}%`,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: storagePercent > 80 ? '#DC2626' : '#2563EB',
                  transition: 'width 500ms ease',
                }}
              />
            </div>
          </div>

          {/* Team members */}
          <div
            style={{
              padding: '18px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAFA',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <Users style={{ width: 16, height: 16, color: '#7C3AED' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Membres
              </span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>
              {teamCurrent}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#9CA3AF' }}> / {teamMax}</span>
            </p>
          </div>

          {/* Next billing */}
          <div
            style={{
              padding: '18px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAFA',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <CalendarDays style={{ width: 16, height: 16, color: '#D97706' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Prochaine facture
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
              1 mars 2026
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              99 EUR / mois
            </p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Danger Zone */}
      {/* ============================================ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #FECACA',
          borderRadius: 16,
          padding: '28px',
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#FEF2F2',
            }}
          >
            <AlertTriangle style={{ width: 18, height: 18, color: '#DC2626' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991B1B', margin: 0 }}>
              Zone dangereuse
            </h3>
            <p style={{ fontSize: 13, color: '#DC2626', marginTop: 2 }}>
              Actions irréversibles sur votre compte
            </p>
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            border: '1px solid #F3F4F6',
            overflow: 'hidden',
          }}
        >
          {/* Export data */}
          <div
            className="flex items-center justify-between flex-wrap gap-4"
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid #F3F4F6',
            }}
          >
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                Exporter toutes les données
              </p>
              <p style={{ fontSize: 13, color: '#6B7280' }}>
                Téléchargez une archive complète de vos projets, documents et factures.
              </p>
            </div>
            <button
              className="flex items-center gap-2 shrink-0"
              style={{
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #D1D5DB',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
            >
              <Download style={{ width: 15, height: 15 }} />
              Exporter (ZIP)
            </button>
          </div>

          {/* Delete account */}
          <div
            className="flex items-center justify-between flex-wrap gap-4"
            style={{
              padding: '18px 20px',
              backgroundColor: '#FFFBFB',
            }}
          >
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#991B1B', marginBottom: 2 }}>
                Supprimer le compte
              </p>
              <p style={{ fontSize: 13, color: '#6B7280' }}>
                Supprime définitivement votre compte et toutes les données associées.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 shrink-0"
              style={{
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                color: '#DC2626',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #FECACA',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
                e.currentTarget.style.borderColor = '#FCA5A5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#FECACA';
              }}
            >
              <Trash2 style={{ width: 15, height: 15 }} />
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacer for mobile scroll */}
      <div style={{ height: 16 }} />

      {/* Delete confirmation modal */}
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
