'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Camera,
  Eye,
  EyeOff,
  Shield,
  Globe,
  Clock,
  Bell,
  MessageSquare,
  FolderKanban,
  Receipt,
  Mail,
  AlertTriangle,
  Trash2,
  CheckCircle,
  X,
  User,
  Building2,
  Lock,
  ChevronDown,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: typeof Bell;
}

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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical' as const,
  fontFamily: 'inherit',
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

const dangerCardStyle: React.CSSProperties = {
  ...cardStyle,
  border: '1px solid #fecaca',
  backgroundColor: '#fef2f2',
};

const dangerButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#dc2626',
  backgroundColor: 'transparent',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: 'none',
  paddingRight: '36px',
  cursor: 'pointer',
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
// Toast Notification Component
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
// Input with focus management
// ============================================

function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  helperText,
  rightElement,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputStyle,
            ...(focused ? inputFocusStyle : {}),
            ...(disabled ? { backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'not-allowed' } : {}),
            ...(rightElement ? { paddingRight: '42px' } : {}),
          }}
        />
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {helperText && (
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{helperText}</p>
      )}
    </div>
  );
}

// ============================================
// Textarea with focus management
// ============================================

function FormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...textareaStyle,
          ...(focused ? inputFocusStyle : {}),
        }}
      />
    </div>
  );
}

// ============================================
// Select with focus management
// ============================================

function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...selectStyle,
            ...(focused ? inputFocusStyle : {}),
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#6b7280',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// Radio Group Component
// ============================================

function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <div className="flex flex-col gap-2" style={{ marginTop: '4px' }}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3"
            style={{ cursor: 'pointer', fontSize: '14px', color: '#374151' }}
          >
            <span
              onClick={() => onChange(opt.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: `2px solid ${value === opt.value ? '#2563EB' : '#d1d5db'}`,
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {value === opt.value && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                  }}
                />
              )}
            </span>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              style={{ display: 'none' }}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
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
  icon: typeof User;
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
// Main Profile Page Component
// ============================================

export default function ProfileSettingsPage() {
  // ---- Personal info state ----
  const [fullName, setFullName] = useState('Jean Dupont');
  const [email, setEmail] = useState('jean.dupont@cabinet-dupont.fr');
  const [phone, setPhone] = useState('06 12 34 56 78');
  const [title, setTitle] = useState('Architecte DPLG');

  // ---- Firm info state ----
  const [firmName, setFirmName] = useState('Atelier Dupont Architecture');
  const [firmAddress, setFirmAddress] = useState('15 rue de la Paix, 75002 Paris');
  const [firmSiret, setFirmSiret] = useState('123 456 789 00012');
  const [firmWebsite, setFirmWebsite] = useState('www.atelier-dupont.fr');
  const [firmDescription, setFirmDescription] = useState(
    'Cabinet d\'architecture fondé en 2015, spécialisé dans la réhabilitation et la construction durable.'
  );

  // ---- Security state ----
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // ---- Preferences state ----
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('europe-paris');
  const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
  const [currency, setCurrency] = useState('eur');

  // ---- Notification preferences ----
  const [notifications, setNotifications] = useState<NotificationPreference[]>([
    {
      id: 'comments',
      label: 'Nouveaux commentaires',
      description: 'Recevez une notification pour chaque nouveau commentaire sur vos projets',
      enabled: true,
      icon: MessageSquare,
    },
    {
      id: 'projects',
      label: 'Mises à jour de projets',
      description: 'Soyez informé des changements de statut et de phase',
      enabled: true,
      icon: FolderKanban,
    },
    {
      id: 'invoices',
      label: 'Factures et paiements',
      description: 'Notifications pour les factures envoyées, payées ou en retard',
      enabled: true,
      icon: Receipt,
    },
    {
      id: 'weekly',
      label: 'Résumé hebdomadaire',
      description: 'Un récapitulatif de votre activité envoyé chaque lundi matin',
      enabled: false,
      icon: Mail,
    },
    {
      id: 'deadlines',
      label: 'Rappels d\'échéances',
      description: 'Rappels avant les dates limites de vos projets et tâches',
      enabled: true,
      icon: Clock,
    },
  ]);

  // ---- Toast state ----
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  // ---- Saving state ----
  const [saving, setSaving] = useState(false);

  // ---- Initials ----
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ---- Show toast helper ----
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // ---- Toggle notification ----
  const toggleNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }, []);

  // ---- Save all changes ----
  const handleSave = useCallback(async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSaving(false);
    showToast('Modifications enregistrées avec succès');
  }, [showToast]);

  // ---- Change password ----
  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Mot de passe modifié avec succès');
  }, [currentPassword, newPassword, confirmPassword, showToast]);

  // ---- Password match check ----
  const passwordsMatch = newPassword === confirmPassword;
  const canChangePassword = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
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
              Mon profil
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Gérez vos informations personnelles, la sécurité de votre compte et vos préférences.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...primaryButtonStyle,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* ================================================ */}
        {/* Two-Column Layout                                */}
        {/* ================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================== */}
          {/* LEFT COLUMN (2/3)                              */}
          {/* ============================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* -------------------------------------------- */}
            {/* Section 1: Informations personnelles         */}
            {/* -------------------------------------------- */}
            <div style={cardStyle}>
              <SectionHeader
                icon={User}
                iconBg="#EFF6FF"
                iconColor="#2563EB"
                title="Informations personnelles"
                description="Votre identité et vos coordonnées de contact"
              />

              {/* Avatar area */}
              <div
                className="flex items-center gap-4"
                style={{ marginBottom: '24px' }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      fontSize: '24px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <Camera style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                    {fullName}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                    {title}
                  </p>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#2563EB',
                      cursor: 'pointer',
                      marginTop: '6px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1d4ed8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#2563EB'; }}
                  >
                    Changer la photo
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormInput
                    id="fullName"
                    label="Nom complet"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Jean Dupont"
                  />
                </div>
                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="jean.dupont@cabinet-dupont.fr"
                />
                <FormInput
                  id="phone"
                  label="Téléphone"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="06 12 34 56 78"
                />
                <div className="sm:col-span-2">
                  <FormInput
                    id="title"
                    label="Titre / Fonction"
                    value={title}
                    onChange={setTitle}
                    placeholder="Architecte DPLG"
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------------------- */}
            {/* Section 2: Informations du cabinet           */}
            {/* -------------------------------------------- */}
            <div style={cardStyle}>
              <SectionHeader
                icon={Building2}
                iconBg="#F5F3FF"
                iconColor="#7C3AED"
                title="Informations du cabinet"
                description="Les données de votre structure professionnelle"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormInput
                    id="firmName"
                    label="Nom du cabinet"
                    value={firmName}
                    onChange={setFirmName}
                    placeholder="Atelier Dupont Architecture"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormInput
                    id="firmAddress"
                    label="Adresse"
                    value={firmAddress}
                    onChange={setFirmAddress}
                    placeholder="15 rue de la Paix, 75002 Paris"
                  />
                </div>
                <FormInput
                  id="firmSiret"
                  label="SIRET"
                  value={firmSiret}
                  onChange={setFirmSiret}
                  placeholder="123 456 789 00012"
                />
                <FormInput
                  id="firmWebsite"
                  label="Site web"
                  value={firmWebsite}
                  onChange={setFirmWebsite}
                  placeholder="www.atelier-dupont.fr"
                />
                <div className="sm:col-span-2">
                  <FormTextarea
                    id="firmDescription"
                    label="Description"
                    value={firmDescription}
                    onChange={setFirmDescription}
                    placeholder="Décrivez votre cabinet..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------------------- */}
            {/* Section 3: Sécurité                          */}
            {/* -------------------------------------------- */}
            <div style={cardStyle}>
              <SectionHeader
                icon={Lock}
                iconBg="#ECFDF5"
                iconColor="#059669"
                title="Sécurité"
                description="Gérez votre mot de passe et la sécurité de votre compte"
              />

              {/* Change password */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                  Changer le mot de passe
                </p>

                <div className="grid grid-cols-1 gap-4" style={{ maxWidth: '480px' }}>
                  <FormInput
                    id="currentPassword"
                    label="Mot de passe actuel"
                    type="password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Votre mot de passe actuel"
                  />

                  <div>
                    <label htmlFor="newPassword" style={labelStyle}>
                      Nouveau mot de passe
                    </label>
                    <NewPasswordInput
                      id="newPassword"
                      value={newPassword}
                      onChange={setNewPassword}
                      showPassword={showNewPassword}
                      onToggleShow={() => setShowNewPassword(!showNewPassword)}
                      placeholder="Minimum 8 caractères"
                    />
                    {newPassword.length > 0 && newPassword.length < 8 && (
                      <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                        Le mot de passe doit contenir au moins 8 caractères
                      </p>
                    )}
                  </div>

                  <div>
                    <FormInput
                      id="confirmPassword"
                      label="Confirmer le nouveau mot de passe"
                      type="password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Confirmez le nouveau mot de passe"
                    />
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <button
                      onClick={handleChangePassword}
                      disabled={!canChangePassword}
                      style={{
                        ...secondaryButtonStyle,
                        opacity: canChangePassword ? 1 : 0.5,
                        cursor: canChangePassword ? 'pointer' : 'not-allowed',
                      }}
                      onMouseEnter={(e) => {
                        if (canChangePassword) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                    >
                      <Shield style={{ width: '16px', height: '16px' }} />
                      Modifier le mot de passe
                    </button>
                  </div>
                </div>
              </div>

              <hr style={dividerStyle} />

              {/* Two-factor authentication */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0" style={{ paddingRight: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      Authentification à deux facteurs
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', lineHeight: 1.5 }}>
                      Ajoutez une couche de sécurité supplémentaire à votre compte.
                      Lorsque cette option est activée, vous devrez saisir un code de vérification
                      envoyé sur votre téléphone en plus de votre mot de passe à chaque connexion.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={twoFactorEnabled}
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(
                        !twoFactorEnabled
                          ? 'Authentification à deux facteurs activée'
                          : 'Authentification à deux facteurs désactivée'
                      );
                    }}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      height: '28px',
                      width: '52px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: '14px',
                      border: '2px solid transparent',
                      backgroundColor: twoFactorEnabled ? '#059669' : '#d1d5db',
                      transition: 'background-color 0.2s ease',
                      outline: 'none',
                      padding: 0,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        height: '24px',
                        width: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s ease',
                        transform: twoFactorEnabled ? 'translateX(24px)' : 'translateX(0px)',
                      }}
                    />
                  </button>
                </div>
                {twoFactorEnabled && (
                  <div
                    className="flex items-center gap-2"
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '8px',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    <CheckCircle style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: '#065f46', fontWeight: 500 }}>
                      L'authentification à deux facteurs est activée pour votre compte.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================== */}
          {/* RIGHT COLUMN (1/3)                             */}
          {/* ============================================== */}
          <div className="space-y-6">
            {/* -------------------------------------------- */}
            {/* Card 1: Préférences                          */}
            {/* -------------------------------------------- */}
            <div style={cardStyle}>
              <SectionHeader
                icon={Globe}
                iconBg="#EFF6FF"
                iconColor="#2563EB"
                title="Préférences"
                description="Langue, fuseau horaire et formats"
              />

              <div className="space-y-4">
                <FormSelect
                  id="language"
                  label="Langue"
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: 'fr', label: 'Français' },
                    { value: 'en', label: 'English' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'es', label: 'Español' },
                    { value: 'it', label: 'Italiano' },
                  ]}
                />

                <FormSelect
                  id="timezone"
                  label="Fuseau horaire"
                  value={timezone}
                  onChange={setTimezone}
                  options={[
                    { value: 'europe-paris', label: 'Europe/Paris (UTC+1)' },
                    { value: 'europe-london', label: 'Europe/London (UTC+0)' },
                    { value: 'europe-berlin', label: 'Europe/Berlin (UTC+1)' },
                    { value: 'europe-zurich', label: 'Europe/Zurich (UTC+1)' },
                    { value: 'america-new-york', label: 'America/New_York (UTC-5)' },
                    { value: 'america-montreal', label: 'America/Montreal (UTC-5)' },
                  ]}
                />

                <RadioGroup
                  label="Format de date"
                  name="dateFormat"
                  value={dateFormat}
                  onChange={setDateFormat}
                  options={[
                    { value: 'dd-mm-yyyy', label: 'JJ/MM/AAAA' },
                    { value: 'mm-dd-yyyy', label: 'MM/JJ/AAAA' },
                  ]}
                />

                <FormSelect
                  id="currency"
                  label="Devise"
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: 'eur', label: 'EUR (€)' },
                    { value: 'usd', label: 'USD ($)' },
                    { value: 'gbp', label: 'GBP (£)' },
                    { value: 'chf', label: 'CHF (Fr.)' },
                  ]}
                />
              </div>
            </div>

            {/* -------------------------------------------- */}
            {/* Card 2: Notifications email                  */}
            {/* -------------------------------------------- */}
            <div style={cardStyle}>
              <SectionHeader
                icon={Bell}
                iconBg="#FFFBEB"
                iconColor="#D97706"
                title="Notifications email"
                description="Choisissez les alertes que vous souhaitez recevoir"
              />

              <div>
                {notifications.map((notif, index) => (
                  <div key={notif.id}>
                    {index > 0 && <hr style={dividerStyle} />}
                    <ToggleSwitch
                      enabled={notif.enabled}
                      onChange={() => toggleNotification(notif.id)}
                      label={notif.label}
                      description={notif.description}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* -------------------------------------------- */}
            {/* Card 3: Zone danger                          */}
            {/* -------------------------------------------- */}
            <div style={dangerCardStyle}>
              <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fee2e2',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#991b1b' }}>
                    Zone danger
                  </h2>
                  <p style={{ fontSize: '13px', color: '#dc2626' }}>
                    Actions irréversibles
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.6, marginBottom: '16px' }}>
                La suppression de votre compte est définitive. Toutes vos données,
                projets, documents et factures seront perdus de manière irréversible.
                Cette action ne peut pas être annulée.
              </p>

              <button
                style={dangerButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#f87171';
                  e.currentTarget.style.color = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#fca5a5';
                  e.currentTarget.style.color = '#dc2626';
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: '32px' }} />
      </div>

      {/* Toast notification */}
      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}

// ============================================
// Password Input with Eye Toggle
// ============================================

function NewPasswordInput({
  id,
  value,
  onChange,
  showPassword,
  onToggleShow,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
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
          paddingRight: '42px',
          ...(focused ? inputFocusStyle : {}),
        }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          transition: 'color 0.15s ease',
          borderRadius: '4px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#374151'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {showPassword ? (
          <EyeOff style={{ width: '16px', height: '16px' }} />
        ) : (
          <Eye style={{ width: '16px', height: '16px' }} />
        )}
      </button>
    </div>
  );
}
