'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// Mock Clients
// ============================================
const MOCK_CLIENTS = [
  { id: 'c1', name: 'SCI Les Terrasses' },
  { id: 'c2', name: 'M. et Mme Martin' },
  { id: 'c3', name: 'Nextech SAS' },
  { id: 'c4', name: 'SARL Le Comptoir' },
  { id: 'c5', name: 'Mairie de Caluire' },
];

// ============================================
// Phase options
// ============================================
const PHASE_OPTIONS = [
  { key: 'esquisse', label: 'Esquisse' },
  { key: 'aps', label: 'APS' },
  { key: 'apd', label: 'APD' },
  { key: 'pro', label: 'PRO' },
  { key: 'dce', label: 'DCE' },
  { key: 'act', label: 'ACT' },
  { key: 'visa', label: 'VISA' },
  { key: 'det', label: 'DET' },
  { key: 'aor', label: 'AOR' },
  { key: 'reception', label: 'Reception' },
  { key: 'delivered', label: 'Livre' },
];

// ============================================
// Helper: generate reference
// ============================================
function generateRéférence(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `PRJ-${num}`;
}

// ============================================
// Inline style constants
// ============================================
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '6px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgb(0 0 0 / 0.05)',
  padding: '24px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '20px',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: '#2563EB',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const backButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '36px',
  width: '36px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  cursor: 'pointer',
};

// ============================================
// Component
// ============================================
export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [reference, setRéférence] = useState('PRJ-00000');

  useEffect(() => {
    setRéférence(generateRéférence());
  }, []);
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState('esquisse');
  const [budget, setBudget] = useState('');
  const [surface, setSurface] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Le nom du projet est requis.');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success('Projet créé avec succès !');
    setSubmitting(false);
    router.push('/dashboard/projects');
  };

  // Format budget display
  const formatBudgetDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <button type="button" style={backButtonStyle}>
            <ArrowLeft style={{ height: '16px', width: '16px', color: '#6b7280' }} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Nouveau projet
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>
            Créez un nouveau projet d&apos;architecture
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* =============================== */}
          {/* Section 1: Informations generales */}
          {/* =============================== */}
          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h2 style={sectionTitleStyle}>Informations generales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom du projet */}
              <div>
                <label style={labelStyle}>
                  Nom du projet <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Residence Les Terrasses"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* Référence */}
              <div>
                <label style={labelStyle}>Référence</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setRéférence(e.target.value)}
                  placeholder="PRJ-XXXXX"
                  style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#111827';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.color = '#6b7280';
                  }}
                />
              </div>

              {/* Client */}
              <div>
                <label style={labelStyle}>Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                >
                  <option value="">Selectionner un client</option>
                  {MOCK_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description - full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Decrivez le projet..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
          </div>

          {/* =============================== */}
          {/* Section 2: Phase et planning     */}
          {/* =============================== */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Phase et planning</h2>
            <div className="space-y-4">
              {/* Phase initiale */}
              <div>
                <label style={labelStyle}>Phase initiale</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                >
                  {PHASE_OPTIONS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date de début */}
              <div>
                <label style={labelStyle}>Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* Date de fin estimée */}
              <div>
                <label style={labelStyle}>Date de fin estimée</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
          </div>

          {/* =============================== */}
          {/* Section 3: Localisation          */}
          {/* =============================== */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Localisation</h2>
            <div className="space-y-4">
              {/* Adresse */}
              <div>
                <label style={labelStyle}>Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="12 rue des Lilas"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* Ville + Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lyon"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Code postal</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="69003"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
              </div>

              {/* Surface */}
              <div>
                <label style={labelStyle}>Surface (m2)</label>
                <input
                  type="number"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="200"
                  min={0}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
          </div>

          {/* =============================== */}
          {/* Section 4: Budget                */}
          {/* =============================== */}
          <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h2 style={sectionTitleStyle}>Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Budget estime (EUR)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="250000"
                  min={0}
                  step={1000}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              <div className="flex items-end">
                {budget && (
                  <p style={{ fontSize: '14px', color: '#6b7280', paddingBottom: '10px' }}>
                    {formatBudgetDisplay(budget)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =============================== */}
        {/* Submit area                      */}
        {/* =============================== */}
        <div
          className="flex items-center justify-end gap-3"
          style={{ marginTop: '24px' }}
        >
          <Link href="/dashboard/projects">
            <button
              type="button"
              style={{
                padding: '10px 24px',
                backgroundColor: '#fff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Annulér
            </button>
          </Link>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            style={{
              ...primaryButtonStyle,
              opacity: submitting || !name.trim() ? 0.5 : 1,
              cursor: submitting || !name.trim() ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save style={{ height: '16px', width: '16px' }} />
            {submitting ? 'Creation...' : 'Creer le projet'}
          </button>
        </div>
      </form>
    </div>
  );
}
