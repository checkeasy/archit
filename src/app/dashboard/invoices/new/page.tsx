'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

// ============================================
// Mock Data
// ============================================

const MOCK_CLIENTS = [
  { id: 'c1', name: 'SCI Les Terrasses' },
  { id: 'c2', name: 'M. et Mme Martin' },
  { id: 'c3', name: 'Nextech SAS' },
  { id: 'c4', name: 'SARL Le Comptoir' },
  { id: 'c5', name: 'Mairie de Caluire' },
];

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Residence Les Terrasses', clientId: 'c1' },
  { id: 'p2', name: 'Maison Martin', clientId: 'c2' },
  { id: 'p3', name: 'Bureaux Nextech', clientId: 'c3' },
  { id: 'p4', name: 'Restaurant Le Comptoir', clientId: 'c4' },
  { id: 'p5', name: 'Ecole Montessori', clientId: 'c5' },
];

const MOCK_QUOTES = [
  { id: 'q1', number: 'DEVIS-00001', projectId: 'p1' },
  { id: 'q2', number: 'DEVIS-00002', projectId: 'p2' },
  { id: 'q3', number: 'DEVIS-00003', projectId: 'p3' },
  { id: 'q4', number: 'DEVIS-00004', projectId: 'p4' },
];

// ============================================
// Helpers
// ============================================

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function generateInvoiceNumber() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `FAC-${num}`;
}

// ============================================
// Inline Style Constants
// ============================================

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#ffffff',
  color: '#111827',
};

const inputReadOnlyStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: '#f9fafb',
  color: '#6b7280',
  cursor: 'not-allowed',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'auto' as React.CSSProperties['appearance'],
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '6px',
};

const lineItemRowStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #f3f4f6',
};

const headerCellStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase' as React.CSSProperties['textTransform'],
  letterSpacing: '0.05em',
  padding: '0 4px',
};

const addButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#2563EB',
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#2563EB',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  borderRadius: '8px',
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '32px',
  width: '32px',
  borderRadius: '8px',
  color: '#9ca3af',
  background: 'none',
  border: 'none',
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
  backgroundColor: '#ffffff',
};

// ============================================
// Component
// ============================================

export default function NewInvoicePage() {
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState('FAC-00000');
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      description: '',
      quantity: 1,
      unit: 'forfait',
      unit_price: 0,
    },
  ]);

  // Generate random number only on client side to avoid hydration mismatch
  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  // ---- Line item operations ----

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: '',
        quantity: 1,
        unit: 'forfait',
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // ---- Calculations ----

  const getLineTotal = (item: InvoiceLineItem) => item.quantity * item.unit_price;

  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxRate = 20;
  const taxAmount = subtotal * (taxRate / 100);
  const totalTTC = subtotal + taxAmount;

  // ---- Filtered options ----

  const filteredQuotes = quoteId
    ? MOCK_QUOTES
    : MOCK_QUOTES.filter((q) => !projectId || q.projectId === projectId);

  // ---- Handlers ----

  const handleSubmit = (action: 'draft' | 'send') => {
    if (!clientId) {
      alert('Veuillez selectionner un client.');
      return;
    }
    if (items.every((item) => !item.description.trim())) {
      alert('Veuillez ajouter au moins une ligne avec une description.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      if (action === 'draft') {
        alert(`Facture ${invoiceNumber} enregistrée en brouillon.`);
      } else {
        alert(`Facture ${invoiceNumber} envoyée avec succès.`);
      }
      router.push('/dashboard/invoices');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" style={backButtonStyle}>
          <ArrowLeft style={{ height: '16px', width: '16px', color: '#6b7280' }} />
        </Link>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
            Nouvelle facture
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px', fontFamily: 'monospace' }}>
            {invoiceNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================================================ */}
        {/* Left Column - Main Content */}
        {/* ================================================ */}
        <div className="lg:col-span-2 space-y-6">

          {/* General Information Card */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
              Informations generales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Invoice Number */}
              <div>
                <label style={labelStyle}>
                  Numero de facture
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  readOnly
                  style={inputReadOnlyStyle}
                />
              </div>

              {/* Client */}
              <div>
                <label style={labelStyle}>
                  Client <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={clientId}
                  onChange={(e) => {
                    setClientId(e.target.value);
                    setProjectId('');
                    setQuoteId('');
                  }}
                  style={selectStyle}
                >
                  <option value="">Selectionner un client</option>
                  {MOCK_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Projet associe */}
              <div>
                <label style={labelStyle}>
                  Projet associe
                </label>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setQuoteId('');
                  }}
                  style={selectStyle}
                >
                  <option value="">Aucun projet</option>
                  {MOCK_PROJECTS
                    .filter((p) => !clientId || p.clientId === clientId)
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Devis associe */}
              <div>
                <label style={labelStyle}>
                  Devis associe (optionnel)
                </label>
                <select
                  value={quoteId}
                  onChange={(e) => setQuoteId(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Aucun devis</option>
                  {filteredQuotes.map((quote) => (
                    <option key={quote.id} value={quote.id}>
                      {quote.number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date d'echeance */}
              <div>
                <label style={labelStyle}>
                  Date d&apos;echeance
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* ================================================ */}
          {/* Invoice Line Items Card */}
          {/* ================================================ */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
              Lignes de facture
            </h2>
            <div className="space-y-3">
              {/* Header row - desktop only */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-2" style={{ padding: '0 4px' }}>
                <div className="col-span-4" style={headerCellStyle}>Description</div>
                <div className="col-span-2" style={headerCellStyle}>Quantite</div>
                <div className="col-span-1" style={headerCellStyle}>Unite</div>
                <div className="col-span-2" style={headerCellStyle}>Prix unit. HT</div>
                <div className="col-span-2" style={{ ...headerCellStyle, textAlign: 'right' }}>Total HT</div>
                <div className="col-span-1"></div>
              </div>

              {/* Line items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
                  style={lineItemRowStyle}
                >
                  {/* Description */}
                  <div className="sm:col-span-4">
                    <label className="block sm:hidden" style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Description de la prestation"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Quantite */}
                  <div className="sm:col-span-2">
                    <label className="block sm:hidden" style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                      Quantite
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      style={inputStyle}
                    />
                  </div>

                  {/* Unite */}
                  <div className="sm:col-span-1">
                    <label className="block sm:hidden" style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                      Unite
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Prix unitaire */}
                  <div className="sm:col-span-2">
                    <label className="block sm:hidden" style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                      Prix unit. HT
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unit_price}
                      onChange={(e) =>
                        updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)
                      }
                      style={inputStyle}
                    />
                  </div>

                  {/* Total */}
                  <div className="sm:col-span-2 flex items-center justify-end">
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      {formatCurrency(getLineTotal(item))}
                    </span>
                  </div>

                  {/* Delete button */}
                  <div className="sm:col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      style={{
                        ...deleteButtonStyle,
                        opacity: items.length === 1 ? 0.3 : 1,
                        cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (items.length > 1) {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 style={{ height: '16px', width: '16px' }} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add line button */}
              <button
                onClick={addItem}
                style={addButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Plus style={{ height: '16px', width: '16px' }} />
                Ajouter une ligne
              </button>
            </div>
          </div>

          {/* ================================================ */}
          {/* Notes Card */}
          {/* ================================================ */}
          <div style={cardStyle}>
            <label style={labelStyle}>
              Notes
            </label>
            <textarea
              rows={4}
              placeholder="Notes additionnelles pour cette facture..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                ...inputStyle,
                resize: 'none' as React.CSSProperties['resize'],
              }}
            />
          </div>
        </div>

        {/* ================================================ */}
        {/* Right Column - Summary */}
        {/* ================================================ */}
        <div className="space-y-6">
          <div style={{ ...cardStyle, position: 'sticky' as React.CSSProperties['position'], top: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
              Recapitulatif
            </h2>

            <div className="space-y-3">
              {/* Sous-total */}
              <div className="flex items-center justify-between" style={{ fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Sous-total HT</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* TVA */}
              <div className="flex items-center justify-between" style={{ fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>TVA ({taxRate}%)</span>
                <span style={{ fontWeight: 500, color: '#374151' }}>
                  {formatCurrency(taxAmount)}
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    Total TTC
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                    {formatCurrency(totalTTC)}
                  </span>
                </div>
              </div>
            </div>

            {/* Nombre de lignes */}
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div className="flex items-center justify-between" style={{ fontSize: '13px' }}>
                <span style={{ color: '#6b7280' }}>Lignes de facture</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{items.length}</span>
              </div>
              {clientId && (
                <div className="flex items-center justify-between" style={{ fontSize: '13px', marginTop: '4px' }}>
                  <span style={{ color: '#6b7280' }}>Client</span>
                  <span style={{ fontWeight: 500, color: '#111827' }}>
                    {MOCK_CLIENTS.find((c) => c.id === clientId)?.name}
                  </span>
                </div>
              )}
              {dueDate && (
                <div className="flex items-center justify-between" style={{ fontSize: '13px', marginTop: '4px' }}>
                  <span style={{ color: '#6b7280' }}>Echeance</span>
                  <span style={{ fontWeight: 500, color: '#111827' }}>
                    {new Intl.DateTimeFormat('fr-FR').format(new Date(dueDate))}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '24px' }} className="space-y-3">
              <button
                onClick={() => handleSubmit('send')}
                disabled={isSaving}
                style={{
                  ...primaryButtonStyle,
                  opacity: isSaving ? 0.6 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }}
              >
                <Send style={{ height: '16px', width: '16px' }} />
                Envoyer la facture
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={isSaving}
                style={{
                  ...secondaryButtonStyle,
                  opacity: isSaving ? 0.6 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                <Save style={{ height: '16px', width: '16px' }} />
                Enregistrer brouillon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
