'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

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
// Radio button style helper
// ============================================
function radioWrapperStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: selected ? '2px solid #2563EB' : '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: selected ? '#eff6ff' : '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: selected ? '#1d4ed8' : '#374151',
    fontWeight: selected ? 500 : 400,
    transition: 'all 0.15s ease',
  };
}

// ============================================
// Client types
// ============================================
const CLIENT_TYPE_OPTIONS = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'public', label: 'Public' },
] as const;

type ClientType = 'particulier' | 'professionnel' | 'public';

// ============================================
// Component
// ============================================
export default function NewClientPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState<ClientType>('particulier');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Le nom du client est requis.');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success('Client créé avec succès !');
    setSubmitting(false);
    router.push('/dashboard/clients');
  };

  return (
    <div className="space-y-6" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <button type="button" style={backButtonStyle}>
            <ArrowLeft style={{ height: '16px', width: '16px', color: '#6b7280' }} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Nouveau client
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>
            Ajoutez un nouveau client a votre carnet
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =============================== */}
        {/* Section 1: Informations du client */}
        {/* =============================== */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Informations du client</h2>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label style={labelStyle}>
                Nom <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marie Dubois"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Type</label>
              <div className="flex gap-3">
                {CLIENT_TYPE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    style={radioWrapperStyle(type === opt.value)}
                  >
                    <input
                      type="radio"
                      name="client_type"
                      value={opt.value}
                      checked={type === opt.value}
                      onChange={(e) => setType(e.target.value as ClientType)}
                      style={{ accentColor: '#2563EB' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.fr"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============================== */}
        {/* Section 2: Societe               */}
        {/* =============================== */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Societe</h2>
          <div>
            <label style={labelStyle}>Societe / Organisme</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nom de la societe (optionnel)"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>
        </div>

        {/* =============================== */}
        {/* Section 3: Adresse               */}
        {/* =============================== */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Adresse</h2>
          <div className="space-y-4">
            {/* Adresse */}
            <div>
              <label style={labelStyle}>Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="15 rue de la Paix"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>

            {/* Ville + Code postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
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
                  placeholder="75002"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============================== */}
        {/* Section 4: Notes                 */}
        {/* =============================== */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Notes</h2>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complementaires sur le client..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>
        </div>

        {/* =============================== */}
        {/* Submit area                      */}
        {/* =============================== */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/clients">
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
            {submitting ? 'Creation...' : 'Creer le client'}
          </button>
        </div>
      </form>
    </div>
  );
}
