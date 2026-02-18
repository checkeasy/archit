'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  LogOut,
  Key,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Clock,
  MapPin,
  Fingerprint,
  FileText,
  QrCode,
  Copy,
  RefreshCw,
} from 'lucide-react';

// ============================================
// Shared styles
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

const sectionDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '2px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: '#2563EB',
  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
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
  padding: '10px 20px',
  fontSize: '14px',
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
  gap: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: '#dc2626',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

const dangerOutlineButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#dc2626',
  backgroundColor: 'transparent',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#f3f4f6',
  margin: '16px 0',
  border: 'none',
};

// ============================================
// Toggle Switch Component
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
    <div className="flex items-center justify-between" style={{ padding: '12px 0' }}>
      <div className="flex-1 min-w-0" style={{ paddingRight: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{label}</p>
        {description && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          height: '24px',
          width: '44px',
          flexShrink: 0,
          cursor: 'pointer',
          borderRadius: '12px',
          border: '2px solid transparent',
          backgroundColor: enabled ? '#2563EB' : '#d1d5db',
          transition: 'background-color 0.2s ease',
          outline: 'none',
          padding: 0,
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
            display: 'inline-block',
            height: '20px',
            width: '20px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s ease',
            transform: enabled ? 'translateX(20px)' : 'translateX(0px)',
          }}
        />
      </button>
    </div>
  );
}

// ============================================
// Password Input Component
// ============================================

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleVisibility,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputStyle,
            ...(focused ? inputFocusStyle : {}),
            paddingRight: '42px',
          }}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
        >
          {showPassword ? (
            <EyeOff style={{ width: '16px', height: '16px' }} />
          ) : (
            <Eye style={{ width: '16px', height: '16px' }} />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Section Header Component
// ============================================

function SectionHeader({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
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
          color: iconColor,
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: '18px', height: '18px' }} />
      </div>
      <div>
        <h2 style={sectionTitleStyle}>{title}</h2>
        <p style={sectionDescStyle}>{description}</p>
      </div>
    </div>
  );
}

// ============================================
// Mock data
// ============================================

interface ActiveSession {
  id: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

const activeSessions: ActiveSession[] = [
  {
    id: 's1',
    browser: 'Chrome',
    os: 'MacOS',
    location: 'Paris, France',
    lastActive: 'Session actuelle',
    isCurrent: true,
    icon: Monitor,
  },
  {
    id: 's2',
    browser: 'Safari',
    os: 'iPhone',
    location: 'Lyon, France',
    lastActive: 'il y a 2 heures',
    isCurrent: false,
    icon: Smartphone,
  },
  {
    id: 's3',
    browser: 'Firefox',
    os: 'Windows',
    location: 'Marseille, France',
    lastActive: 'il y a 1 jour',
    isCurrent: false,
    icon: Monitor,
  },
];

interface SecurityEvent {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  description: string;
  timestamp: string;
  ip: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

const securityEvents: SecurityEvent[] = [
  {
    id: 'e1',
    type: 'success',
    description: 'Connexion réussie',
    timestamp: 'Aujourd\'hui, 09:32',
    ip: '92.184.112.45',
    icon: CheckCircle,
  },
  {
    id: 'e2',
    type: 'info',
    description: 'Mot de passe modifié',
    timestamp: 'Il y a 3 jours, 14:15',
    ip: '92.184.112.45',
    icon: Key,
  },
  {
    id: 'e3',
    type: 'warning',
    description: 'Nouveau dispositif détecté',
    timestamp: 'Il y a 5 jours, 11:02',
    ip: '176.132.45.89',
    icon: Smartphone,
  },
  {
    id: 'e4',
    type: 'info',
    description: 'Export de données',
    timestamp: 'Il y a 1 semaine, 16:45',
    ip: '92.184.112.45',
    icon: Download,
  },
  {
    id: 'e5',
    type: 'success',
    description: '2FA activé',
    timestamp: 'Il y a 2 semaines, 10:20',
    ip: '92.184.112.45',
    icon: Fingerprint,
  },
  {
    id: 'e6',
    type: 'danger',
    description: 'Tentative de connexion échouée',
    timestamp: 'Il y a 3 semaines, 03:14',
    ip: '203.45.167.22',
    icon: AlertTriangle,
  },
];

const recoveryCodes = [
  'A7K2-M9P4',
  'B3F8-L6T1',
  'C5H0-N2W7',
  'D9J4-Q8R3',
  'E1M6-S5V9',
  'F8P2-U7X0',
  'G4R7-W3Y5',
  'H6T1-Z9B8',
];

// ============================================
// Password Strength Helpers
// ============================================

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '#d1d5db' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Très faible', color: '#dc2626' };
  if (score === 2) return { score: 2, label: 'Faible', color: '#f59e0b' };
  if (score === 3) return { score: 3, label: 'Moyen', color: '#eab308' };
  if (score === 4) return { score: 4, label: 'Fort', color: '#22c55e' };
  return { score: 5, label: 'Très fort', color: '#16a34a' };
}

// ============================================
// Main Page
// ============================================

export default function SecuritySettingsPage() {
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<ActiveSession[]>(activeSessions);

  // Privacy toggles
  const [shareUsageData, setShareUsageData] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Password strength
  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const canChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    passwordsMatch;

  async function handleChangePassword() {
    if (!canChangePassword) return;
    setSavingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function handleDisconnectSession(sessionId: string) {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }

  function handleDisconnectAllOthers() {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  }

  return (
    <div className="mx-auto max-w-3xl" style={{ paddingBottom: '32px' }}>
      {/* Back link + Page header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-1.5"
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
            marginBottom: '16px',
            display: 'inline-flex',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Retour aux paramètres
        </Link>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '12px' }}>
          Sécurité et confidentialité
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          Gérez la sécurité de votre compte, vos sessions et vos préférences de confidentialité.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* ============================================ */}
        {/* Section 1: Mot de passe */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <SectionHeader
            icon={Lock}
            title="Mot de passe"
            description="Modifiez votre mot de passe pour sécuriser votre compte"
            iconBg="#EFF6FF"
            iconColor="#2563EB"
          />

          <div className="flex flex-col gap-4" style={{ maxWidth: '480px' }}>
            <PasswordInput
              id="currentPassword"
              label="Mot de passe actuel"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Votre mot de passe actuel"
              showPassword={showCurrentPassword}
              onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
            />

            <PasswordInput
              id="newPassword"
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Minimum 8 caractères"
              showPassword={showNewPassword}
              onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
            />

            {/* Password strength indicator */}
            {newPassword.length > 0 && (
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Force du mot de passe
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      height: '100%',
                      backgroundColor: strength.color,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            <PasswordInput
              id="confirmPassword"
              label="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirmez le mot de passe"
              showPassword={showConfirmPassword}
              onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {newPassword && confirmPassword && !passwordsMatch && (
              <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '-8px' }}>
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          <hr style={dividerStyle} />

          <div className="flex items-center justify-between">
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>
              Dernière modification : il y a 45 jours
            </p>
            <button
              onClick={handleChangePassword}
              disabled={!canChangePassword || savingPassword}
              style={{
                ...primaryButtonStyle,
                opacity: (!canChangePassword || savingPassword) ? 0.5 : 1,
                cursor: (!canChangePassword || savingPassword) ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (canChangePassword && !savingPassword)
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                if (canChangePassword && !savingPassword)
                  e.currentTarget.style.backgroundColor = '#2563EB';
              }}
            >
              <Shield style={{ width: '16px', height: '16px' }} />
              {savingPassword ? 'Modification en cours...' : 'Modifier le mot de passe'}
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* Section 2: Authentification a deux facteurs */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <SectionHeader
            icon={Fingerprint}
            title="Authentification à deux facteurs (2FA)"
            description="Ajoutez une couche de sécurité supplémentaire à votre compte"
            iconBg="#F0FDF4"
            iconColor="#16a34a"
          />

          <ToggleSwitch
            enabled={twoFAEnabled}
            onChange={setTwoFAEnabled}
            label="Activer l'authentification à deux facteurs"
            description="Utilisez une application d'authentification (Google Authenticator, Authy) pour générer des codes de vérification"
          />

          {twoFAEnabled && (
            <div style={{ marginTop: '16px' }}>
              {/* QR Code placeholder */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                  Scannez ce QR code avec votre application d'authentification :
                </p>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: '#f9fafb',
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <QrCode style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
                    <span style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
                      QR Code 2FA
                    </span>
                  </div>
                </div>
              </div>

              <hr style={dividerStyle} />

              {/* Recovery codes */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                      Codes de récupération
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      Conservez ces codes dans un endroit sûr. Ils vous permettront de vous connecter si vous perdez votre téléphone.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '12px' }}>
                    {recoveryCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#374151',
                          letterSpacing: '1px',
                        }}
                      >
                        {showRecoveryCodes ? code : '●●●●-●●●●'}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                      style={secondaryButtonStyle}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      {showRecoveryCodes ? (
                        <EyeOff style={{ width: '14px', height: '14px' }} />
                      ) : (
                        <Eye style={{ width: '14px', height: '14px' }} />
                      )}
                      {showRecoveryCodes ? 'Masquer' : 'Afficher'}
                    </button>
                    <button
                      style={secondaryButtonStyle}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      <Copy style={{ width: '14px', height: '14px' }} />
                      Copier
                    </button>
                    <button
                      style={{
                        ...secondaryButtonStyle,
                        color: '#2563EB',
                        borderColor: '#bfdbfe',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      <RefreshCw style={{ width: '14px', height: '14px' }} />
                      Générer de nouveaux codes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* Section 3: Sessions actives */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <SectionHeader
            icon={Globe}
            title="Sessions actives"
            description="Gérez les appareils connectés à votre compte"
            iconBg="#FFF7ED"
            iconColor="#EA580C"
          />

          <div className="flex flex-col gap-3">
            {sessions.map((session) => {
              const SessionIcon = session.icon;
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: session.isCurrent ? '#f0fdf4' : '#f9fafb',
                    border: `1px solid ${session.isCurrent ? '#bbf7d0' : '#e5e7eb'}`,
                    borderRadius: '10px',
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        flexShrink: 0,
                      }}
                    >
                      <SessionIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                          {session.browser} / {session.os}
                        </p>
                        {session.isCurrent && (
                          <span
                            className="inline-flex items-center gap-1"
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#16a34a',
                              backgroundColor: '#dcfce7',
                              padding: '2px 8px',
                              borderRadius: '12px',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#16a34a',
                                display: 'inline-block',
                              }}
                            />
                            Actuelle
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3" style={{ marginTop: '2px' }}>
                        <span className="inline-flex items-center gap-1" style={{ fontSize: '12px', color: '#6b7280' }}>
                          <MapPin style={{ width: '12px', height: '12px' }} />
                          {session.location}
                        </span>
                        <span className="inline-flex items-center gap-1" style={{ fontSize: '12px', color: '#9ca3af' }}>
                          <Clock style={{ width: '12px', height: '12px' }} />
                          {session.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleDisconnectSession(session.id)}
                      style={dangerOutlineButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut style={{ width: '14px', height: '14px' }} />
                      Déconnecter
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {sessions.filter((s) => !s.isCurrent).length > 0 && (
            <>
              <hr style={dividerStyle} />
              <div className="flex justify-end">
                <button
                  onClick={handleDisconnectAllOthers}
                  style={{
                    ...dangerOutlineButtonStyle,
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogOut style={{ width: '14px', height: '14px' }} />
                  Déconnecter toutes les autres sessions
                </button>
              </div>
            </>
          )}
        </div>

        {/* ============================================ */}
        {/* Section 4: Journal de securite */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <SectionHeader
            icon={FileText}
            title="Journal de sécurité"
            description="Historique des événements liés à la sécurité de votre compte"
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
          />

          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {/* Timeline line */}
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                backgroundColor: '#e5e7eb',
              }}
            />

            <div className="flex flex-col gap-1">
              {securityEvents.map((event, index) => {
                const EventIcon = event.icon;
                const dotColors: Record<string, { bg: string; border: string }> = {
                  success: { bg: '#dcfce7', border: '#16a34a' },
                  warning: { bg: '#fef9c3', border: '#eab308' },
                  info: { bg: '#dbeafe', border: '#2563EB' },
                  danger: { bg: '#fecaca', border: '#dc2626' },
                };
                const iconColors: Record<string, string> = {
                  success: '#16a34a',
                  warning: '#eab308',
                  info: '#2563EB',
                  danger: '#dc2626',
                };
                const colors = dotColors[event.type];

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3"
                    style={{
                      position: 'relative',
                      padding: '10px 0',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-24px',
                        top: '14px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: colors.bg,
                        border: `2px solid ${colors.border}`,
                        zIndex: 1,
                      }}
                    />

                    {/* Event content */}
                    <div
                      className="flex items-center justify-between flex-1"
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        marginLeft: '4px',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <EventIcon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: iconColors[event.type],
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                            {event.description}
                          </p>
                          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                            {event.timestamp}
                          </p>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: '#9ca3af',
                          backgroundColor: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {event.ip}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Section 5: Confidentialite des donnees */}
        {/* ============================================ */}
        <div style={cardStyle}>
          <SectionHeader
            icon={Shield}
            title="Confidentialité des données"
            description="Contrôlez la manière dont vos données sont utilisées"
            iconBg="#FEF2F2"
            iconColor="#dc2626"
          />

          <div>
            <ToggleSwitch
              enabled={shareUsageData}
              onChange={setShareUsageData}
              label="Partager les données d'utilisation anonymes"
              description="Aidez-nous à améliorer ArchiPro en partageant des statistiques d'utilisation anonymisées"
            />
            <hr style={dividerStyle} />
            <ToggleSwitch
              enabled={marketingEmails}
              onChange={setMarketingEmails}
              label="Emails marketing"
              description="Recevez des informations sur les nouvelles fonctionnalités, les promotions et les conseils"
            />
          </div>

          <hr style={{ ...dividerStyle, margin: '20px 0' }} />

          {/* RGPD Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                  Télécharger mes données
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Exportez toutes vos données personnelles conformément au RGPD (format JSON)
                </p>
              </div>
              <button
                style={secondaryButtonStyle}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                Télécharger
              </button>
            </div>

            <hr style={dividerStyle} />

            {/* Delete account */}
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '16px 20px',
              }}
            >
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b' }}>
                      Supprimer mon compte
                    </p>
                    <p style={{ fontSize: '12px', color: '#b91c1c', marginTop: '2px' }}>
                      Cette action est irréversible. Toutes vos données, projets et fichiers seront définitivement supprimés.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={dangerButtonStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Supprimer
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b', marginBottom: '8px' }}>
                    Êtes-vous absolument certain ? Tapez{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>SUPPRIMER</span>{' '}
                    pour confirmer.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Tapez SUPPRIMER"
                    style={{
                      ...inputStyle,
                      borderColor: '#fca5a5',
                      marginBottom: '12px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#dc2626';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#fca5a5';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      disabled={deleteConfirmText !== 'SUPPRIMER'}
                      style={{
                        ...dangerButtonStyle,
                        opacity: deleteConfirmText !== 'SUPPRIMER' ? 0.5 : 1,
                        cursor: deleteConfirmText !== 'SUPPRIMER' ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (deleteConfirmText === 'SUPPRIMER')
                          e.currentTarget.style.backgroundColor = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        if (deleteConfirmText === 'SUPPRIMER')
                          e.currentTarget.style.backgroundColor = '#dc2626';
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                      Confirmer la suppression
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        color: '#6b7280',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
