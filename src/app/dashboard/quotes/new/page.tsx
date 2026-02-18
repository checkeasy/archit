'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import type { QuoteItem } from '@/types';
import { formatCurrency, getPhaseLabel } from '@/lib/utils';
import { QUOTE_CONDITIONS_DEFAULT, PROJECT_PHASES } from '@/lib/constants';

interface LineItem {
  id: string;
  description: string;
  phase: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

const MOCK_CLIENTS = [
  { id: 'c1', name: 'Jean-Pierre Dumont' },
  { id: 'c2', name: 'Marie Lefèvre' },
  { id: 'c3', name: 'SCI Les Ateliers' },
  { id: 'c4', name: 'Famille Bernard' },
  { id: 'c5', name: 'Commune de Versailles' },
  { id: 'c6', name: 'Antoine Moreau' },
];

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Rénovation maison bourgeoise' },
  { id: 'p2', name: 'Extension villa contemporaine' },
  { id: 'p3', name: 'Aménagement bureaux startup' },
  { id: 'p4', name: 'Construction maison passive' },
  { id: 'p6', name: 'Réhabilitation loft industriel' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function NewQuotePage() {
  const router = useRouter();

  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [quoteNumber] = useState('DEVIS-00007');
  const [taxRate, setTaxRate] = useState(20);
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState(QUOTE_CONDITIONS_DEFAULT);

  const [items, setItems] = useState<LineItem[]>([
    {
      id: generateId(),
      description: '',
      phase: '',
      quantity: 1,
      unit: 'forfait',
      unit_price: 0,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: '',
        phase: '',
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

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getLineTotal = (item: LineItem) => item.quantity * item.unit_price;

  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/quotes"
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau devis</h1>
          <p className="text-sm text-gray-500 mt-0.5">{quoteNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Project Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un client</option>
                  {MOCK_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Projet (optionnel)
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Aucun projet</option>
                  {MOCK_PROJECTS.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Valide jusqu&apos;au
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  N° de devis
                </label>
                <input
                  type="text"
                  value={quoteNumber}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Lignes du devis
            </h2>
            <div className="space-y-3">
              {/* Header row */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Phase</div>
                <div className="col-span-1">Qté</div>
                <div className="col-span-1">Unité</div>
                <div className="col-span-2">Prix unit. HT</div>
                <div className="col-span-1 text-right">Total HT</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start p-3 bg-gray-50/50 rounded-lg border border-gray-100"
                >
                  <div className="sm:col-span-4">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Description de la prestation"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">
                      Phase
                    </label>
                    <select
                      value={item.phase}
                      onChange={(e) => updateItem(item.id, 'phase', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">—</option>
                      {PROJECT_PHASES.map((phase) => (
                        <option key={phase.key} value={phase.key}>
                          {phase.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">
                      Qté
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">
                      Unité
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block sm:hidden text-xs font-medium text-gray-500 mb-1">
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-end sm:justify-end">
                    <span className="text-sm font-medium text-gray-900 sm:mt-0 mt-2">
                      {formatCurrency(getLineTotal(item))}
                    </span>
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Ajouter une ligne
              </button>
            </div>
          </div>

          {/* Notes & Conditions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                rows={3}
                placeholder="Notes additionnelles..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Conditions
              </label>
              <textarea
                rows={4}
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Récapitulatif</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Sous-total HT</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">TVA</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500 text-xs">%</span>
                </div>
                <span className="font-medium text-gray-700">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total TTC</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
                <Send className="h-4 w-4" />
                Envoyer
              </button>
              <button className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">
                <Save className="h-4 w-4" />
                Enregistrer brouillon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
