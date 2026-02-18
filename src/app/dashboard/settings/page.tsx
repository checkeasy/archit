'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Building2,
  Bell,
  Shield,
  AlertTriangle,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CreditCard,
  Plug,
  Users,
  ChevronRight,
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
// Toggle Switch component
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
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2',
          enabled ? 'bg-[#2563EB]' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}

// ============================================
// Settings Page
// ============================================

export default function SettingsPage() {
  // Profile state
  const [fullName, setFullName] = useState(mockProfile.full_name);
  const [phone, setPhone] = useState(mockProfile.phone || '');
  const [firmName, setFirmName] = useState(mockProfile.firm_name || '');
  const [siret, setSiret] = useState(mockProfile.siret || '');
  const [address, setAddress] = useState(mockProfile.address || '');

  // Company state
  const [companyName, setCompanyName] = useState(
    mockProfile.firm_name || ''
  );
  const [companyAddress, setCompanyAddress] = useState(
    mockProfile.address || ''
  );
  const [companySiret, setCompanySiret] = useState(
    mockProfile.siret || ''
  );

  // Notification préférences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Saving states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Initials for avatar
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSaveProfile() {
    setSavingProfile(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingProfile(false);
  }

  async function handleSaveCompany() {
    setSavingCompany(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingCompany(false);
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) return;
    setSavingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const inputClassName =
    'block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none';
  const labelClassName = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez votre profil, votre cabinet et vos préférences.
        </p>
      </div>

      {/* Settings sub-pages navigation */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/settings/profile"
          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Profil</p>
            <p className="text-xs text-gray-500">Informations personnelles</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link
          href="/dashboard/settings/team"
          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Équipe</p>
            <p className="text-xs text-gray-500">Gestion des membres</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link
          href="/dashboard/settings/billing"
          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Facturation</p>
            <p className="text-xs text-gray-500">Plans et paiements</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link
          href="/dashboard/settings/integrations"
          className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}>
            <Plug className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Intégrations</p>
            <p className="text-xs text-gray-500">API et services tiers</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
        <Link
          href="/dashboard/settings/security"
          className="group flex items-center gap-4"
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            textDecoration: 'none',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fca5a5';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#fef2f2',
            }}
          >
            <Shield className="h-5 w-5" style={{ color: '#ef4444' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Sécurité</p>
            <p className="text-xs text-gray-500">2FA, sessions et confidentialité</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
      </div>

      {/* ============================================ */}
      {/* Profile Section */}
      {/* ============================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Profil personnel
            </h2>
            <p className="text-xs text-gray-500">
              Vos informations personnelles et de contact
            </p>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] text-lg font-semibold">
              {initials}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Photo de profil
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG ou GIF. Max 2 Mo.
            </p>
            <button className="mt-1 text-xs font-medium text-[#2563EB] hover:text-blue-800 transition-colors">
              Modifier la photo
            </button>
          </div>
        </div>

        {/* Profile form */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className={labelClassName}>
              Nom complet
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClassName}
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={mockProfile.email}
              readOnly
              className={cn(
                inputClassName,
                'bg-gray-50 text-gray-500 cursor-not-allowed'
              )}
            />
            <p className="mt-1 text-xs text-gray-400">
              L&apos;email ne peut pas être modifié
            </p>
          </div>

          <div>
            <label htmlFor="phone" className={labelClassName}>
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClassName}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="firmName" className={labelClassName}>
              Nom du cabinet
            </label>
            <input
              id="firmName"
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className={inputClassName}
              placeholder="Mon cabinet d'architecture"
            />
          </div>

          <div>
            <label htmlFor="siret" className={labelClassName}>
              SIRET
            </label>
            <input
              id="siret"
              type="text"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
              className={inputClassName}
              placeholder="123 456 789 00012"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClassName}>
              Adresse
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClassName}
              placeholder="15 rue de la Paix, 75002 Paris"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: savingProfile ? '#93bbfd' : '#2563EB' }}
            onMouseEnter={(e) => {
              if (!savingProfile)
                e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (!savingProfile)
                e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Save className="h-4 w-4" />
            {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Company Section */}
      {/* ============================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Cabinet / Entreprise
            </h2>
            <p className="text-xs text-gray-500">
              Informations de votre structure professionnelle
            </p>
          </div>
        </div>

        {/* Logo upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Logo du cabinet
            </p>
            <p className="text-xs text-gray-500">
              Apparaitra sur vos devis et factures. SVG, PNG ou JPG.
            </p>
            <button className="mt-1 text-xs font-medium text-[#2563EB] hover:text-blue-800 transition-colors">
              Importer un logo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className={labelClassName}>
              Nom du cabinet
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClassName}
              placeholder="Cabinet d'Architecture"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="companyAddress" className={labelClassName}>
              Adresse du cabinet
            </label>
            <input
              id="companyAddress"
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className={inputClassName}
              placeholder="15 rue de la Paix, 75002 Paris"
            />
          </div>

          <div>
            <label htmlFor="companySiret" className={labelClassName}>
              SIRET
            </label>
            <input
              id="companySiret"
              type="text"
              value={companySiret}
              onChange={(e) => setCompanySiret(e.target.value)}
              className={inputClassName}
              placeholder="123 456 789 00012"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveCompany}
            disabled={savingCompany}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: savingCompany ? '#93bbfd' : '#2563EB' }}
            onMouseEnter={(e) => {
              if (!savingCompany)
                e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (!savingCompany)
                e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Save className="h-4 w-4" />
            {savingCompany ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Notifications Section */}
      {/* ============================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-xs text-gray-500">
              Configurez vos préférences de notification
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <ToggleSwitch
            enabled={emailNotifs}
            onChange={setEmailNotifs}
            label="Notifications par email"
            description="Recevez les notifications importantes par email"
          />
          <ToggleSwitch
            enabled={projectUpdates}
            onChange={setProjectUpdates}
            label="Mises à jour des projets"
            description="Soyez informé des changements de statut et des nouvelles tâches"
          />
          <ToggleSwitch
            enabled={invoiceReminders}
            onChange={setInvoiceReminders}
            label="Rappels de facturation"
            description="Rappels pour les factures en attente et les échéances"
          />
          <ToggleSwitch
            enabled={weeklySummary}
            onChange={setWeeklySummary}
            label="Résumé hebdomadaire"
            description="Recevez un résumé de l'activité chaque lundi matin"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* Security Section */}
      {/* ============================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Sécurité
            </h2>
            <p className="text-xs text-gray-500">
              Modifiez votre mot de passe
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className={labelClassName}>
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={cn(inputClassName, 'pr-10')}
                placeholder="Votre mot de passe actuel"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className={labelClassName}>
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={cn(inputClassName, 'pr-10')}
                placeholder="Nouveau mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClassName}>
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClassName}
              placeholder="Confirmer le mot de passe"
            />
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Les mots de passe ne correspondent pas
                </p>
              )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={
              savingPassword ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: savingPassword ? '#93bbfd' : '#2563EB',
            }}
            onMouseEnter={(e) => {
              if (!savingPassword)
                e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (!savingPassword)
                e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Shield className="h-4 w-4" />
            {savingPassword
              ? 'Modification en cours...'
              : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Danger Zone */}
      {/* ============================================ */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-red-900">
              Zone dangereuse
            </h2>
            <p className="text-xs text-red-500">
              Actions irréversibles sur votre compte
            </p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Supprimer le compte
              </p>
              <p className="text-xs text-gray-500">
                Cette action supprimera définitivement votre compte et toutes
                vos données. Cette action est irréversible.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer le compte
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800 mb-3">
              Êtes-vous absolument certain ? Tapez{' '}
              <span className="font-mono font-bold">SUPPRIMER</span> pour
              confirmer.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="block w-full rounded-lg border border-red-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none mb-3"
              placeholder="Tapez SUPPRIMER"
            />
            <div className="flex items-center gap-2">
              <button
                disabled={deleteConfirmText !== 'SUPPRIMER'}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Confirmer la suppression
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
              >
                Annulér
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacer for mobile scroll */}
      <div className="h-4" />
    </div>
  );
}
