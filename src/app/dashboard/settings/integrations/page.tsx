'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Key,
  Plug,
  Webhook,
  Download,
  Upload,
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  FileText,
  FileSpreadsheet,
  Archive,
  ToggleLeft,
  ToggleRight,
  Clock,
  Activity,
  Link2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  letter: string;
  color: string;
  bgColor: string;
}

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered: string;
  createdAt: string;
}

interface ExportOption {
  id: string;
  label: string;
  format: string;
  description: string;
  icon: typeof FileText;
  iconColor: string;
  iconBg: string;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

// ============================================
// Shared Styles
// ============================================

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '4px',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: '#2563EB',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const dangerButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#dc2626',
  backgroundColor: 'transparent',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const smallButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#374151',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const badgeConnectedStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: '#f0fdf4',
  color: '#16a34a',
  border: '1px solid #bbf7d0',
};

const badgeDisconnectedStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: '#f9fafb',
  color: '#6b7280',
  border: '1px solid #e5e7eb',
};

const badgeActiveStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  backgroundColor: '#f0fdf4',
  color: '#16a34a',
  border: '1px solid #bbf7d0',
};

const badgeInactiveStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fecaca',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#f3f4f6',
  margin: '16px 0',
  border: 'none',
};

// ============================================
// Mock Data
// ============================================

const initialApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Clé de production',
    key: 'ak_live_8f2e4a91c3b7d56e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7f3d',
    maskedKey: 'ak_live_****...****7f3d',
    createdAt: '15 janvier 2026',
    lastUsed: '18 février 2026',
    status: 'active',
  },
  {
    id: 'key-2',
    name: 'Clé de test',
    key: 'ak_test_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e9a21',
    maskedKey: 'ak_test_****...****9a21',
    createdAt: '20 janvier 2026',
    lastUsed: '17 février 2026',
    status: 'active',
  },
];

const initialIntegrations: Integration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Synchroniser votre planning et vos rendez-vous clients',
    connected: true,
    letter: 'G',
    color: '#4285F4',
    bgColor: '#EBF3FF',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Stockage et partage de documents de projet',
    connected: false,
    letter: 'D',
    color: '#0061FF',
    bgColor: '#E6F0FF',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Paiements en ligne et facturation automatisée',
    connected: true,
    letter: 'S',
    color: '#635BFF',
    bgColor: '#F0EFFF',
  },
  {
    id: 'autocad',
    name: 'AutoCAD',
    description: 'Import de plans DWG et synchronisation de fichiers',
    connected: false,
    letter: 'A',
    color: '#E51937',
    bgColor: '#FEE8EC',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Stockage cloud et collaboration documentaire',
    connected: false,
    letter: 'G',
    color: '#0F9D58',
    bgColor: '#E6F7EF',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notifications d\'équipe et alertes de projet',
    connected: true,
    letter: 'S',
    color: '#E01E5A',
    bgColor: '#FDE8EE',
  },
];

const initialWebhooks: WebhookEntry[] = [
  {
    id: 'wh-1',
    url: 'https://api.monsite.fr/webhooks/archipro',
    events: ['projet.créé', 'projet.modifié', 'projet.terminé'],
    active: true,
    lastTriggered: '18 fév. 2026 à 14:32',
    createdAt: '10 janvier 2026',
  },
  {
    id: 'wh-2',
    url: 'https://hooks.slack.com/services/T01/B02/abc123',
    events: ['facture.envoyée', 'facture.payée'],
    active: true,
    lastTriggered: '17 fév. 2026 à 09:15',
    createdAt: '25 janvier 2026',
  },
  {
    id: 'wh-3',
    url: 'https://n8n.monserveur.com/webhook/archipro-sync',
    events: ['client.créé', 'document.uploadé'],
    active: false,
    lastTriggered: '05 fév. 2026 à 18:40',
    createdAt: '01 février 2026',
  },
];

const exportOptions: ExportOption[] = [
  {
    id: 'export-projects',
    label: 'Projets',
    format: 'CSV',
    description: 'Tous vos projets avec détails, phases et statuts',
    icon: FileSpreadsheet,
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
  },
  {
    id: 'export-clients',
    label: 'Clients',
    format: 'CSV',
    description: 'Liste complète de vos clients et contacts',
    icon: FileSpreadsheet,
    iconColor: '#2563EB',
    iconBg: '#eff6ff',
  },
  {
    id: 'export-invoices',
    label: 'Factures',
    format: 'PDF',
    description: 'Toutes vos factures au format PDF',
    icon: FileText,
    iconColor: '#dc2626',
    iconBg: '#fef2f2',
  },
  {
    id: 'export-all',
    label: 'Tous les documents',
    format: 'ZIP',
    description: 'Archive complète de tous vos fichiers et données',
    icon: Archive,
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff',
  },
];

// ============================================
// Toast Component
// ============================================

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, onClose]);

  if (!toast.visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 20px',
        borderRadius: '10px',
        backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
        animation: 'slideInUp 0.3s ease',
      }}
    >
      {toast.type === 'success' ? (
        <CheckCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
      ) : (
        <AlertTriangle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
      )}
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '4px',
          opacity: 0.8,
          display: 'flex',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  );
}

// ============================================
// Section Header Component
// ============================================

function SectionHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: typeof Key;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: iconBg,
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: '18px', height: '18px', color: iconColor }} />
      </div>
      <div>
        <h2 style={sectionTitleStyle}>{title}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>{description}</p>
      </div>
    </div>
  );
}

// ============================================
// API Key Row Component
// ============================================

function ApiKeyRow({
  apiKey,
  onCopy,
  onRegenerate,
  onDelete,
  onToggleVisibility,
  isVisible,
}: {
  apiKey: ApiKey;
  onCopy: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
}) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fafbfc',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#d1d5db';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Key name and status */}
      <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
            }}
          >
            <Key style={{ width: '15px', height: '15px', color: '#2563EB' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {apiKey.name}
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: '2px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                Créée le {apiKey.createdAt}
              </span>
              <span style={{ fontSize: '12px', color: '#d1d5db' }}>|</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                Dernière utilisation : {apiKey.lastUsed}
              </span>
            </div>
          </div>
        </div>
        <span style={badgeConnectedStyle}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#16a34a',
            }}
          />
          Active
        </span>
      </div>

      {/* Key value */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          marginBottom: '12px',
        }}
      >
        <code
          style={{
            flex: 1,
            fontSize: '13px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            color: '#374151',
            letterSpacing: '0.3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {isVisible ? apiKey.key : apiKey.maskedKey}
        </code>
        <button
          onClick={onToggleVisibility}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
          title={isVisible ? 'Masquer la clé' : 'Afficher la clé'}
        >
          {isVisible ? (
            <EyeOff style={{ width: '15px', height: '15px' }} />
          ) : (
            <Eye style={{ width: '15px', height: '15px' }} />
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          style={smallButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <Copy style={{ width: '13px', height: '13px' }} />
          Copier
        </button>
        <button
          onClick={onRegenerate}
          style={smallButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <RefreshCw style={{ width: '13px', height: '13px' }} />
          Régénérer
        </button>
        <button
          onClick={onDelete}
          style={{
            ...smallButtonStyle,
            color: '#dc2626',
            borderColor: '#fecaca',
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
          <Trash2 style={{ width: '13px', height: '13px' }} />
          Supprimer
        </button>
      </div>
    </div>
  );
}

// ============================================
// Integration Card Component
// ============================================

function IntegrationCard({
  integration,
  onToggle,
}: {
  integration: Integration;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        padding: '20px',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
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
      {/* Header: icon + badge */}
      <div className="flex items-start justify-between" style={{ marginBottom: '14px' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: integration.bgColor,
            fontSize: '20px',
            fontWeight: 700,
            color: integration.color,
            flexShrink: 0,
          }}
        >
          {integration.letter}
        </div>
        <span style={integration.connected ? badgeConnectedStyle : badgeDisconnectedStyle}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: integration.connected ? '#16a34a' : '#9ca3af',
            }}
          />
          {integration.connected ? 'Connecté' : 'Non connecté'}
        </span>
      </div>

      {/* Name + description */}
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>
        {integration.name}
      </h3>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: 1.5 }}>
        {integration.description}
      </p>

      {/* Connect/Disconnect button */}
      {integration.connected ? (
        <button
          onClick={onToggle}
          style={{
            ...secondaryButtonStyle,
            width: '100%',
            justifyContent: 'center',
            fontSize: '13px',
            padding: '9px 16px',
            color: '#dc2626',
            borderColor: '#fecaca',
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
          <XCircle style={{ width: '15px', height: '15px' }} />
          Déconnecter
        </button>
      ) : (
        <button
          onClick={onToggle}
          style={{
            ...primaryButtonStyle,
            width: '100%',
            justifyContent: 'center',
            fontSize: '13px',
            padding: '9px 16px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
        >
          <Link2 style={{ width: '15px', height: '15px' }} />
          Connecter
        </button>
      )}
    </div>
  );
}

// ============================================
// Webhook Row Component
// ============================================

function WebhookRow({
  webhook,
  onToggle,
  onDelete,
}: {
  webhook: WebhookEntry;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fafbfc',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#d1d5db';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Top row: URL, status, toggle */}
      <div className="flex items-start justify-between" style={{ marginBottom: '10px' }}>
        <div className="flex-1 min-w-0" style={{ paddingRight: '12px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
            <Webhook style={{ width: '14px', height: '14px', color: '#6b7280', flexShrink: 0 }} />
            <code
              style={{
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                color: '#111827',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {webhook.url}
            </code>
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
            <span style={webhook.active ? badgeActiveStyle : badgeInactiveStyle}>
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: webhook.active ? '#16a34a' : '#dc2626',
                }}
              />
              {webhook.active ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <button
            onClick={onToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              color: webhook.active ? '#16a34a' : '#9ca3af',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            title={webhook.active ? 'Désactiver' : 'Activer'}
          >
            {webhook.active ? (
              <ToggleRight style={{ width: '17px', height: '17px' }} />
            ) : (
              <ToggleLeft style={{ width: '17px', height: '17px' }} />
            )}
          </button>
          <button
            onClick={onDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              color: '#dc2626',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            title="Supprimer"
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '10px' }}>
        {webhook.events.map((event) => (
          <span
            key={event}
            style={{
              display: 'inline-block',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 500,
              backgroundColor: '#eff6ff',
              color: '#2563EB',
              border: '1px solid #bfdbfe',
            }}
          >
            {event}
          </span>
        ))}
      </div>

      {/* Last triggered + created */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Activity style={{ width: '12px', height: '12px', color: '#9ca3af' }} />
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            Dernier déclenchement : {webhook.lastTriggered}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock style={{ width: '12px', height: '12px', color: '#9ca3af' }} />
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            Créé le {webhook.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Export Card Component
// ============================================

function ExportCard({
  option,
  onExport,
  exporting,
}: {
  option: ExportOption;
  onExport: () => void;
  exporting: boolean;
}) {
  const Icon = option.icon;
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fafbfc',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#d1d5db';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: option.iconBg,
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '18px', height: '18px', color: option.iconColor }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {option.label}
            </p>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {option.format}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
            {option.description}
          </p>
        </div>
      </div>

      <button
        onClick={onExport}
        disabled={exporting}
        style={{
          ...smallButtonStyle,
          opacity: exporting ? 0.6 : 1,
          cursor: exporting ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!exporting) {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        <Download style={{ width: '13px', height: '13px' }} />
        {exporting ? 'Export...' : 'Exporter'}
      </button>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function IntegrationsPage() {
  // ---- API keys state ----
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // ---- Integrations state ----
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  // ---- Webhooks state ----
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(initialWebhooks);

  // ---- Export state ----
  const [exportingId, setExportingId] = useState<string | null>(null);

  // ---- Import state ----
  const [isDragOver, setIsDragOver] = useState(false);
  const [importedFile, setImportedFile] = useState<string | null>(null);

  // ---- Toast state ----
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  // ---- Toast helper ----
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // ---- API Key handlers ----
  const handleCopyKey = useCallback((key: ApiKey) => {
    navigator.clipboard?.writeText(key.key);
    showToast('Clé API copiée dans le presse-papiers');
  }, [showToast]);

  const handleRegenerateKey = useCallback((keyId: string) => {
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === keyId
          ? {
              ...k,
              key: 'ak_live_' + Math.random().toString(36).substring(2, 50) + 'new1',
              maskedKey: 'ak_live_****...****new1',
              lastUsed: 'À l\'instant',
            }
          : k
      )
    );
    showToast('Clé API régénérée avec succès');
  }, [showToast]);

  const handleDeleteKey = useCallback((keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    showToast('Clé API supprimée');
  }, [showToast]);

  const handleCreateKey = useCallback(() => {
    const newKey: ApiKey = {
      id: 'key-' + Date.now(),
      name: 'Nouvelle clé API',
      key: 'ak_live_' + Math.random().toString(36).substring(2, 50) + 'abcd',
      maskedKey: 'ak_live_****...****abcd',
      createdAt: '18 février 2026',
      lastUsed: 'Jamais',
      status: 'active',
    };
    setApiKeys((prev) => [...prev, newKey]);
    showToast('Nouvelle clé API créée');
  }, [showToast]);

  const toggleKeyVisibility = useCallback((keyId: string) => {
    setVisibleKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  }, []);

  // ---- Integration handlers ----
  const handleToggleIntegration = useCallback((integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, connected: !i.connected } : i
      )
    );
    const integration = integrations.find((i) => i.id === integrationId);
    if (integration) {
      showToast(
        integration.connected
          ? `${integration.name} déconnecté`
          : `${integration.name} connecté avec succès`
      );
    }
  }, [integrations, showToast]);

  // ---- Webhook handlers ----
  const handleToggleWebhook = useCallback((webhookId: string) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === webhookId ? { ...w, active: !w.active } : w
      )
    );
    const webhook = webhooks.find((w) => w.id === webhookId);
    if (webhook) {
      showToast(
        webhook.active
          ? 'Webhook désactivé'
          : 'Webhook activé'
      );
    }
  }, [webhooks, showToast]);

  const handleDeleteWebhook = useCallback((webhookId: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== webhookId));
    showToast('Webhook supprimé');
  }, [showToast]);

  const handleAddWebhook = useCallback(() => {
    const newWebhook: WebhookEntry = {
      id: 'wh-' + Date.now(),
      url: 'https://example.com/webhook/new',
      events: ['projet.créé'],
      active: true,
      lastTriggered: 'Jamais',
      createdAt: '18 février 2026',
    };
    setWebhooks((prev) => [...prev, newWebhook]);
    showToast('Nouveau webhook ajouté');
  }, [showToast]);

  // ---- Export handler ----
  const handleExport = useCallback(async (optionId: string) => {
    setExportingId(optionId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExportingId(null);
    const opt = exportOptions.find((o) => o.id === optionId);
    showToast(`Export ${opt?.label} (${opt?.format}) lancé avec succès`);
  }, [showToast]);

  // ---- Import handlers ----
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setImportedFile(files[0].name);
      showToast(`Fichier "${files[0].name}" prêt pour l'import`);
    }
  }, [showToast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImportedFile(files[0].name);
      showToast(`Fichier "${files[0].name}" prêt pour l'import`);
    }
  }, [showToast]);

  // ---- Stats ----
  const connectedCount = integrations.filter((i) => i.connected).length;
  const activeWebhookCount = webhooks.filter((w) => w.active).length;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
        {/* ================================================ */}
        {/* Back Link                                        */}
        {/* ================================================ */}
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#6b7280',
            textDecoration: 'none',
            marginBottom: '24px',
            display: 'inline-flex',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Retour aux paramètres
        </Link>

        {/* ================================================ */}
        {/* Page Header                                      */}
        {/* ================================================ */}
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ marginBottom: '32px' }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              Intégrations & API
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Gérez vos clés API, services connectés, webhooks et vos données d'import/export.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
              }}
            >
              <Plug style={{ width: '15px', height: '15px', color: '#16a34a' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>
                {connectedCount} connecté{connectedCount > 1 ? 's' : ''}
              </span>
            </div>
            <div
              className="flex items-center gap-2"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
              }}
            >
              <Webhook style={{ width: '15px', height: '15px', color: '#2563EB' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>
                {activeWebhookCount} webhook{activeWebhookCount > 1 ? 's' : ''} actif{activeWebhookCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 1: API Keys                              */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <SectionHeader
            icon={Key}
            iconBg="#FFFBEB"
            iconColor="#D97706"
            title="Clés API"
            description="Gérez vos clés d'accès à l'API ArchiPro"
          />

          {/* Info banner */}
          <div
            className="flex items-start gap-3"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              marginBottom: '20px',
            }}
          >
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
              Vos clés API sont confidentielles. Ne les partagez jamais publiquement et ne les incluez pas dans votre code source. Utilisez des variables d'environnement pour les stocker.
            </p>
          </div>

          {/* API Keys list */}
          <div className="space-y-3" style={{ marginBottom: '20px' }}>
            {apiKeys.map((key) => (
              <ApiKeyRow
                key={key.id}
                apiKey={key}
                onCopy={() => handleCopyKey(key)}
                onRegenerate={() => handleRegenerateKey(key.id)}
                onDelete={() => handleDeleteKey(key.id)}
                onToggleVisibility={() => toggleKeyVisibility(key.id)}
                isVisible={!!visibleKeys[key.id]}
              />
            ))}
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleCreateKey}
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Créer une nouvelle clé API
            </button>
            <a
              href="#"
              className="inline-flex items-center gap-1.5"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#2563EB',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#1d4ed8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#2563EB'; }}
            >
              <ExternalLink style={{ width: '14px', height: '14px' }} />
              Documentation API
              <ChevronRight style={{ width: '14px', height: '14px' }} />
            </a>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 2: Connected Services                    */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <SectionHeader
            icon={Plug}
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
            title="Services connectés"
            description="Connectez ArchiPro à vos outils préférés"
          />

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={() => handleToggleIntegration(integration.id)}
              />
            ))}
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 3: Webhooks                              */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ECFDF5',
                  flexShrink: 0,
                }}
              >
                <Webhook style={{ width: '18px', height: '18px', color: '#059669' }} />
              </div>
              <div>
                <h2 style={sectionTitleStyle}>Webhooks</h2>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Recevez des notifications en temps réel sur vos endpoints
                </p>
              </div>
            </div>
            <button
              onClick={handleAddWebhook}
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Ajouter un webhook
            </button>
          </div>

          {/* Info text */}
          <div
            className="flex items-start gap-3"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              marginBottom: '20px',
            }}
          >
            <Activity style={{ width: '16px', height: '16px', color: '#0369a1', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#0c4a6e', lineHeight: 1.5, margin: 0 }}>
              Les webhooks envoient une requête HTTP POST à l'URL configurée lorsque les événements sélectionnés se produisent. Assurez-vous que votre endpoint répond avec un code 200.
            </p>
          </div>

          {/* Webhooks list */}
          {webhooks.length > 0 ? (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <WebhookRow
                  key={webhook.id}
                  webhook={webhook}
                  onToggle={() => handleToggleWebhook(webhook.id)}
                  onDelete={() => handleDeleteWebhook(webhook.id)}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center"
              style={{
                padding: '40px 24px',
                borderRadius: '10px',
                border: '2px dashed #e5e7eb',
                backgroundColor: '#fafbfc',
              }}
            >
              <Webhook style={{ width: '32px', height: '32px', color: '#d1d5db', marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', margin: '0 0 4px 0' }}>
                Aucun webhook configuré
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                Ajoutez un webhook pour recevoir des notifications en temps réel.
              </p>
            </div>
          )}

          {/* Available events summary */}
          <div style={{ marginTop: '20px' }}>
            <hr style={dividerStyle} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>
              Événements disponibles
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'projet.créé',
                'projet.modifié',
                'projet.terminé',
                'facture.envoyée',
                'facture.payée',
                'facture.en_retard',
                'client.créé',
                'client.modifié',
                'document.uploadé',
                'document.signé',
                'tâche.terminée',
                'devis.accepté',
              ].map((event) => (
                <span
                  key={event}
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: '#f9fafb',
                    color: '#4b5563',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 4: Export & Import                        */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <SectionHeader
            icon={Download}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            title="Export & Import"
            description="Exportez vos données ou importez depuis un fichier CSV"
          />

          {/* Export options */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
              Exporter vos données
            </p>
            <div className="space-y-3">
              {exportOptions.map((option) => (
                <ExportCard
                  key={option.id}
                  option={option}
                  onExport={() => handleExport(option.id)}
                  exporting={exportingId === option.id}
                />
              ))}
            </div>
          </div>

          <hr style={dividerStyle} />

          {/* Import section */}
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              Importer des données
            </p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              Importez vos projets, clients ou contacts depuis un fichier CSV. Le fichier doit respecter le format attendu.
            </p>

            {/* Drag and drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                padding: '32px 24px',
                borderRadius: '12px',
                border: `2px dashed ${isDragOver ? '#2563EB' : '#d1d5db'}`,
                backgroundColor: isDragOver ? '#eff6ff' : '#fafbfc',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                const input = document.getElementById('file-import-input');
                if (input) input.click();
              }}
            >
              <input
                id="file-import-input"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div
                className="flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: isDragOver ? '#dbeafe' : '#f3f4f6',
                  margin: '0 auto 14px auto',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Upload
                  style={{
                    width: '22px',
                    height: '22px',
                    color: isDragOver ? '#2563EB' : '#9ca3af',
                    transition: 'color 0.2s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: '0 0 4px 0' }}>
                {isDragOver
                  ? 'Déposez votre fichier ici'
                  : 'Glissez-déposez votre fichier CSV ici'}
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 12px 0' }}>
                ou cliquez pour sélectionner un fichier
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                }}
              >
                Formats acceptés : .csv (max 10 Mo)
              </span>
            </div>

            {/* Imported file indicator */}
            {importedFile && (
              <div
                className="flex items-center justify-between"
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                }}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#166534', margin: 0 }}>
                      {importedFile}
                    </p>
                    <p style={{ fontSize: '12px', color: '#15803d', margin: '2px 0 0 0' }}>
                      Fichier prêt pour l'importation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    style={{
                      ...primaryButtonStyle,
                      padding: '8px 16px',
                      fontSize: '13px',
                    }}
                    onClick={() => {
                      showToast('Import lancé avec succès');
                      setImportedFile(null);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }}
                  >
                    <Upload style={{ width: '14px', height: '14px' }} />
                    Importer
                  </button>
                  <button
                    onClick={() => setImportedFile(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#16a34a',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dcfce7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Retirer le fichier"
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            )}

            {/* Import format help */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Format de fichier attendu
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>Projets :</strong> nom, client, phase, statut, date_début, date_fin, budget
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>Clients :</strong> nom, email, téléphone, adresse, entreprise, siret
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>Encodage :</strong> UTF-8 avec séparateur virgule ou point-virgule
                  </span>
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#2563EB',
                  textDecoration: 'none',
                  marginTop: '10px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1d4ed8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#2563EB'; }}
              >
                <Download style={{ width: '13px', height: '13px' }} />
                Télécharger un modèle CSV
              </a>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* API Usage Stats (bonus informational section)     */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                flexShrink: 0,
              }}
            >
              <Activity style={{ width: '18px', height: '18px', color: '#dc2626' }} />
            </div>
            <div>
              <h2 style={sectionTitleStyle}>Utilisation de l'API</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                Suivez votre consommation d'appels API ce mois-ci
              </p>
            </div>
          </div>

          {/* Usage stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '16px' }}>
            {/* Requests this month */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafbfc',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Requêtes ce mois
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0', lineHeight: 1.1 }}>
                12 847
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                sur 50 000 incluses
              </p>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: '10px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '25.7%',
                    height: '100%',
                    borderRadius: '3px',
                    backgroundColor: '#2563EB',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Errors this month */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafbfc',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Taux d'erreur
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a', margin: '0 0 4px 0', lineHeight: 1.1 }}>
                0.3%
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                38 erreurs sur 12 847 requêtes
              </p>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: '10px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '0.3%',
                    height: '100%',
                    borderRadius: '3px',
                    backgroundColor: '#16a34a',
                    minWidth: '4px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Average response time */}
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafbfc',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Temps de réponse moyen
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0', lineHeight: 1.1 }}>
                142 ms
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                Objectif : &lt; 500 ms
              </p>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: '10px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '28.4%',
                    height: '100%',
                    borderRadius: '3px',
                    backgroundColor: '#d97706',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Rate limit info */}
          <div
            className="flex items-start gap-3"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <Clock style={{ width: '16px', height: '16px', color: '#6b7280', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: '#111827' }}>Limite de débit :</strong> 100 requêtes/minute par clé API.
                En cas de dépassement, les requêtes seront rejetées avec un code 429.
                Contactez le support pour augmenter vos limites.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: '32px' }} />
      </div>

      {/* Toast notification */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .sm\\:grid-cols-2 {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .sm\\:grid-cols-3 {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
        @media (max-width: 1024px) {
          .lg\\:grid-cols-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
