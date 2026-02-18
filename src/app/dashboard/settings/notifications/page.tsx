'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  Clock,
  Globe,
  Save,
  Check,
  MessageSquare,
  AlertTriangle,
  AtSign,
  FileText,
  Users,
  Settings,
  Zap,
  CalendarClock,
  Receipt,
  FolderOpen,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Shared inline styles
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
};

const sectionDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '2px',
};

const iconBoxBlue: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: '#EFF6FF',
  color: '#2563EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconBoxAmber: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: '#FFFBEB',
  color: '#D97706',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconBoxPurple: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: '#F5F3FF',
  color: '#7C3AED',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconBoxGreen: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: '#ECFDF5',
  color: '#059669',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconBoxRose: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: '#FFF1F2',
  color: '#E11D48',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#f3f4f6',
  margin: '0',
  border: 'none',
};

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  backgroundColor: '#059669',
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 500,
  boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
};

// ============================================
// ToggleSwitch component (inline, animated)
// ============================================

function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '14px 0' }}>
      <div className="flex-1 min-w-0" style={{ paddingRight: '16px' }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#111827',
            margin: 0,
            lineHeight: '1.4',
          }}
        >
          {label}
        </p>
        {description && (
          <p
            style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '3px 0 0 0',
              lineHeight: '1.4',
            }}
          >
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: '44px',
          height: '24px',
          flexShrink: 0,
          cursor: 'pointer',
          borderRadius: '12px',
          border: '2px solid transparent',
          backgroundColor: enabled ? '#2563EB' : '#d1d5db',
          transition: 'background-color 0.2s ease',
          padding: 0,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transform: enabled ? 'translateX(20px)' : 'translateX(0px)',
            transition: 'transform 0.2s ease',
            pointerEvents: 'none',
          }}
        />
      </button>
    </div>
  );
}

// ============================================
// MiniToggle for the category table cells
// ============================================

function MiniToggle({
  enabled,
  onChange,
  ariaLabel,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!enabled)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '36px',
        height: '20px',
        flexShrink: 0,
        cursor: 'pointer',
        borderRadius: '10px',
        border: '2px solid transparent',
        backgroundColor: enabled ? '#2563EB' : '#d1d5db',
        transition: 'background-color 0.2s ease',
        padding: 0,
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span
        style={{
          display: 'block',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          transform: enabled ? 'translateX(16px)' : 'translateX(0px)',
          transition: 'transform 0.2s ease',
          pointerEvents: 'none',
        }}
      />
    </button>
  );
}

// ============================================
// DayCheckbox for the schedule section
// ============================================

function DayCheckbox({
  label,
  shortLabel,
  checked,
  onChange,
}: {
  label: string;
  shortLabel: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        border: checked ? '2px solid #2563EB' : '2px solid #d1d5db',
        backgroundColor: checked ? '#EFF6FF' : '#ffffff',
        color: checked ? '#2563EB' : '#6b7280',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.borderColor = '#9ca3af';
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }
      }}
    >
      {shortLabel}
    </button>
  );
}

// ============================================
// Types for category channels
// ============================================

interface CategoryChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface CategoryRow {
  id: string;
  label: string;
  icon: React.ReactNode;
  channels: CategoryChannels;
}

// ============================================
// Main Notifications Settings Page
// ============================================

export default function NotificationsSettingsPage() {
  // ---- Email notification toggles ----
  const [emailNewComments, setEmailNewComments] = useState(true);
  const [emailProjectStatus, setEmailProjectStatus] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [emailDeadlineReminders, setEmailDeadlineReminders] = useState(true);
  const [emailTeamInvitations, setEmailTeamInvitations] = useState(false);
  const [emailWeeklySummary, setEmailWeeklySummary] = useState(true);
  const [emailNewsletter, setEmailNewsletter] = useState(false);

  // ---- Push notification toggles ----
  const [pushBrowserEnabled, setPushBrowserEnabled] = useState(false);
  const [pushInstantMessages, setPushInstantMessages] = useState(true);
  const [pushUrgentAlerts, setPushUrgentAlerts] = useState(true);
  const [pushMentions, setPushMentions] = useState(true);

  // ---- Do Not Disturb schedule ----
  const [dndEnabled, setDndEnabled] = useState(true);
  const [dndFrom, setDndFrom] = useState('20:00');
  const [dndTo, setDndTo] = useState('08:00');

  // ---- Days of the week (Lun-Dim) ----
  const [daysActive, setDaysActive] = useState<Record<string, boolean>>({
    lun: true,
    mar: true,
    mer: true,
    jeu: true,
    ven: true,
    sam: false,
    dim: false,
  });

  // ---- Notification channels per category ----
  const [categories, setCategories] = useState<CategoryRow[]>([
    {
      id: 'projets',
      label: 'Projets',
      icon: <FolderOpen style={{ width: '16px', height: '16px' }} />,
      channels: { email: true, push: true, inApp: true },
    },
    {
      id: 'factures',
      label: 'Factures',
      icon: <Receipt style={{ width: '16px', height: '16px' }} />,
      channels: { email: true, push: false, inApp: true },
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText style={{ width: '16px', height: '16px' }} />,
      channels: { email: false, push: false, inApp: true },
    },
    {
      id: 'equipe',
      label: 'Équipe',
      icon: <Users style={{ width: '16px', height: '16px' }} />,
      channels: { email: true, push: true, inApp: true },
    },
    {
      id: 'systeme',
      label: 'Système',
      icon: <Settings style={{ width: '16px', height: '16px' }} />,
      channels: { email: true, push: false, inApp: true },
    },
  ]);

  // ---- Push permission state ----
  const [pushPermission, setPushPermission] = useState<'default' | 'granted' | 'denied'>('default');

  // ---- Saving & toast ----
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ---- Handlers ----

  const handleToggleDay = useCallback((day: string) => {
    setDaysActive((prev) => ({ ...prev, [day]: !prev[day] }));
  }, []);

  const handleCategoryToggle = useCallback(
    (categoryId: string, channel: keyof CategoryChannels) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                channels: {
                  ...cat.channels,
                  [channel]: !cat.channels[channel],
                },
              }
            : cat
        )
      );
    },
    []
  );

  const handleRequestPushPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        setPushPermission('granted');
        setPushBrowserEnabled(true);
      } else if (result === 'denied') {
        setPushPermission('denied');
        setPushBrowserEnabled(false);
      }
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // ---- Day data ----
  const daysList: { key: string; label: string; short: string }[] = [
    { key: 'lun', label: 'Lundi', short: 'Lun' },
    { key: 'mar', label: 'Mardi', short: 'Mar' },
    { key: 'mer', label: 'Mercredi', short: 'Mer' },
    { key: 'jeu', label: 'Jeudi', short: 'Jeu' },
    { key: 'ven', label: 'Vendredi', short: 'Ven' },
    { key: 'sam', label: 'Samedi', short: 'Sam' },
    { key: 'dim', label: 'Dimanche', short: 'Dim' },
  ];

  // ---- Time select style ----
  const timeSelectStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '32px',
    minWidth: '110px',
  };

  // ---- Time options for selects ----
  const timeOptions: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeOptions.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      );
    }
  }

  // ---- Table header cell style ----
  const tableHeaderCellStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '10px 16px',
    textAlign: 'center',
  };

  const tableBodyCellStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const tableRowLabelStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
  };

  return (
    <div className="mx-auto max-w-3xl" style={{ paddingBottom: '40px' }}>
      {/* ============================================ */}
      {/* Back link */}
      {/* ============================================ */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Retour aux paramètres
        </Link>
      </div>

      {/* ============================================ */}
      {/* Page Header */}
      {/* ============================================ */}
      <div className="flex items-start gap-4" style={{ marginBottom: '32px' }}>
        <div style={iconBoxAmber}>
          <Bell style={{ width: '20px', height: '20px' }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              lineHeight: '1.3',
            }}
          >
            Préférences de notifications
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '6px 0 0 0',
              lineHeight: '1.5',
            }}
          >
            Personnalisez la manière dont vous recevez vos notifications.
            Choisissez les alertes qui comptent pour vous et désactivez celles
            qui ne sont pas nécessaires.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ============================================ */}
        {/* Section 1: Email Notifications */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div style={iconBoxBlue}>
              <Mail style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 style={sectionTitleStyle}>Notifications par email</h2>
              <p style={sectionDescStyle}>
                Sélectionnez les emails que vous souhaitez recevoir
              </p>
            </div>
          </div>

          <div>
            <ToggleSwitch
              enabled={emailNewComments}
              onChange={setEmailNewComments}
              label="Nouveaux commentaires sur vos projets"
              description="Recevez un email lorsqu'un collaborateur commente un de vos projets"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailProjectStatus}
              onChange={setEmailProjectStatus}
              label="Mises à jour de statut de projet"
              description="Soyez informé lorsque le statut d'un projet change (en cours, validé, livré)"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailInvoices}
              onChange={setEmailInvoices}
              label="Nouvelles factures et paiements reçus"
              description="Notifications pour les factures émises, payées ou en retard"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailDeadlineReminders}
              onChange={setEmailDeadlineReminders}
              label="Rappels d'échéances (3 jours avant)"
              description="Un rappel automatique 3 jours avant chaque échéance de projet"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailTeamInvitations}
              onChange={setEmailTeamInvitations}
              label="Invitations d'équipe"
              description="Lorsqu'un membre vous invite à rejoindre un projet ou une équipe"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailWeeklySummary}
              onChange={setEmailWeeklySummary}
              label="Résumé hebdomadaire d'activité"
              description="Un récapitulatif complet de votre activité envoyé chaque lundi matin"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={emailNewsletter}
              onChange={setEmailNewsletter}
              label="Newsletter et nouveautés produit"
              description="Restez informé des nouvelles fonctionnalités et mises à jour d'ArchiPro"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* Section 2: Push Notifications */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div style={iconBoxPurple}>
              <Smartphone style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 style={sectionTitleStyle}>Notifications push</h2>
              <p style={sectionDescStyle}>
                Recevez des alertes directement dans votre navigateur
              </p>
            </div>
          </div>

          <div>
            {/* Browser push with activate button */}
            <div className="flex items-center justify-between" style={{ padding: '14px 0' }}>
              <div className="flex-1 min-w-0" style={{ paddingRight: '16px' }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#111827',
                    margin: 0,
                    lineHeight: '1.4',
                  }}
                >
                  Notifications push dans le navigateur
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '3px 0 0 0',
                    lineHeight: '1.4',
                  }}
                >
                  {pushPermission === 'granted'
                    ? 'Les notifications push sont activées pour ce navigateur'
                    : pushPermission === 'denied'
                      ? 'Les notifications push ont été refusées. Modifiez les paramètres de votre navigateur.'
                      : 'Autorisez les notifications push pour recevoir des alertes en temps réel'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {pushPermission === 'granted' ? (
                  <div
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#059669',
                      backgroundColor: '#ECFDF5',
                      padding: '6px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <Check style={{ width: '14px', height: '14px' }} />
                    Activé
                  </div>
                ) : pushPermission === 'denied' ? (
                  <div
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#DC2626',
                      backgroundColor: '#FEF2F2',
                      padding: '6px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <AlertTriangle style={{ width: '14px', height: '14px' }} />
                    Refusé
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestPushPermission}
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: '#2563EB',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }}
                  >
                    Activer
                  </button>
                )}
              </div>
            </div>
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={pushInstantMessages}
              onChange={setPushInstantMessages}
              label="Messages instantanés"
              description="Recevez une notification push pour chaque nouveau message reçu"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={pushUrgentAlerts}
              onChange={setPushUrgentAlerts}
              label="Alertes urgentes (dépassement budget, échéance dépassée)"
              description="Notifications immédiates pour les événements critiques nécessitant votre attention"
            />
            <hr style={dividerStyle} />

            <ToggleSwitch
              enabled={pushMentions}
              onChange={setPushMentions}
              label="Mentions dans les commentaires"
              description="Lorsque quelqu'un vous mentionne avec @ dans un commentaire"
            />
          </div>
        </div>

        {/* ============================================ */}
        {/* Section 3: Notification Schedule */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div style={iconBoxGreen}>
              <Clock style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 style={sectionTitleStyle}>Plage horaire des notifications</h2>
              <p style={sectionDescStyle}>
                Définissez quand vous souhaitez recevoir vos notifications
              </p>
            </div>
          </div>

          {/* Do Not Disturb toggle + time range */}
          <div
            style={{
              backgroundColor: dndEnabled ? '#FFFBEB' : '#f9fafb',
              border: dndEnabled ? '1px solid #FDE68A' : '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '24px',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: dndEnabled ? '16px' : '0' }}>
              <div className="flex items-center gap-3">
                <CalendarClock
                  style={{
                    width: '18px',
                    height: '18px',
                    color: dndEnabled ? '#D97706' : '#9ca3af',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: dndEnabled ? '#92400E' : '#6b7280',
                      margin: 0,
                    }}
                  >
                    Ne pas déranger
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: dndEnabled ? '#B45309' : '#9ca3af',
                      margin: '2px 0 0 0',
                    }}
                  >
                    Suspendre les notifications pendant une plage horaire définie
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={dndEnabled}
                onChange={setDndEnabled}
                label="Ne pas déranger"
              />
            </div>

            {dndEnabled && (
              <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#92400E',
                  }}
                >
                  De
                </span>
                <select
                  value={dndFrom}
                  onChange={(e) => setDndFrom(e.target.value)}
                  style={timeSelectStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {timeOptions.map((t) => (
                    <option key={`from-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#92400E',
                  }}
                >
                  à
                </span>
                <select
                  value={dndTo}
                  onChange={(e) => setDndTo(e.target.value)}
                  style={timeSelectStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {timeOptions.map((t) => (
                    <option key={`to-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Days of the week */}
          <div style={{ marginBottom: '24px' }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#111827',
                margin: '0 0 4px 0',
              }}
            >
              Jours actifs pour les notifications
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0 0 14px 0',
              }}
            >
              Sélectionnez les jours où vous souhaitez recevoir des notifications
            </p>
            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
              {daysList.map((day) => (
                <DayCheckbox
                  key={day.key}
                  label={day.label}
                  shortLabel={day.short}
                  checked={daysActive[day.key]}
                  onChange={() => handleToggleDay(day.key)}
                />
              ))}
            </div>
          </div>

          {/* Timezone */}
          <hr style={dividerStyle} />
          <div className="flex items-center gap-3" style={{ paddingTop: '16px' }}>
            <Globe
              style={{
                width: '16px',
                height: '16px',
                color: '#6b7280',
                flexShrink: 0,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  margin: 0,
                }}
              >
                Fuseau horaire
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '2px 0 0 0',
                }}
              >
                Europe/Paris (UTC+1) - Les horaires de notification sont basés sur ce fuseau
              </p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Section 4: Notification Channels per Category */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div style={iconBoxRose}>
              <Zap style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 style={sectionTitleStyle}>Canaux par catégorie</h2>
              <p style={sectionDescStyle}>
                Choisissez les canaux de notification pour chaque type d'activité
              </p>
            </div>
          </div>

          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-4"
              style={{
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  ...tableHeaderCellStyle,
                  textAlign: 'left',
                }}
              >
                Catégorie
              </div>
              <div style={tableHeaderCellStyle}>
                <div className="flex items-center justify-center gap-1.5">
                  <Mail style={{ width: '13px', height: '13px' }} />
                  Email
                </div>
              </div>
              <div style={tableHeaderCellStyle}>
                <div className="flex items-center justify-center gap-1.5">
                  <Smartphone style={{ width: '13px', height: '13px' }} />
                  Push
                </div>
              </div>
              <div style={tableHeaderCellStyle}>
                <div className="flex items-center justify-center gap-1.5">
                  <Monitor style={{ width: '13px', height: '13px' }} />
                  In-app
                </div>
              </div>
            </div>

            {/* Table rows */}
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="grid grid-cols-4 items-center"
                style={{
                  borderBottom:
                    index < categories.length - 1
                      ? '1px solid #f3f4f6'
                      : 'none',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? '#ffffff' : '#fafbfc';
                }}
              >
                <div style={tableRowLabelStyle}>
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: '#6b7280', flexShrink: 0 }}>
                      {category.icon}
                    </span>
                    {category.label}
                  </div>
                </div>
                <div style={tableBodyCellStyle}>
                  <div className="flex justify-center">
                    <MiniToggle
                      enabled={category.channels.email}
                      onChange={() =>
                        handleCategoryToggle(category.id, 'email')
                      }
                      ariaLabel={`Email pour ${category.label}`}
                    />
                  </div>
                </div>
                <div style={tableBodyCellStyle}>
                  <div className="flex justify-center">
                    <MiniToggle
                      enabled={category.channels.push}
                      onChange={() =>
                        handleCategoryToggle(category.id, 'push')
                      }
                      ariaLabel={`Push pour ${category.label}`}
                    />
                  </div>
                </div>
                <div style={tableBodyCellStyle}>
                  <div className="flex justify-center">
                    <MiniToggle
                      enabled={category.channels.inApp}
                      onChange={() =>
                        handleCategoryToggle(category.id, 'inApp')
                      }
                      ariaLabel={`In-app pour ${category.label}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '12px',
              fontStyle: 'italic',
            }}
          >
            Les notifications in-app sont toujours visibles dans votre centre de
            notifications, même si elles sont désactivées ici.
          </p>
        </div>

        {/* ============================================ */}
        {/* Save Button */}
        {/* ============================================ */}
        <div className="flex items-center justify-between" style={{ paddingTop: '8px' }}>
          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0,
            }}
          >
            Les modifications seront appliquées immédiatement après l'enregistrement.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2"
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: saving ? '#93bbfd' : '#2563EB',
              border: 'none',
              borderRadius: '10px',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(37, 99, 235, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.boxShadow =
                  '0 1px 3px rgba(37, 99, 235, 0.2)';
              }
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {saving
              ? 'Enregistrement en cours...'
              : 'Enregistrer les préférences'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Success Toast */}
      {/* ============================================ */}
      {showToast && (
        <div
          style={{
            ...toastStyle,
            opacity: showToast ? 1 : 0,
            transform: showToast ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <Check style={{ width: '18px', height: '18px' }} />
          Préférences de notifications enregistrées avec succès
        </div>
      )}
    </div>
  );
}
