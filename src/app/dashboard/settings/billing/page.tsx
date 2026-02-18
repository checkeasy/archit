'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Receipt,
  FileText,
  Building2,
  Check,
  Download,
  Edit3,
  Plus,
  Crown,
  Zap,
  Rocket,
  Save,
  ChevronRight,
  Star,
  Users,
  FolderKanban,
  HardDrive,
  Headphones,
  Mail,
  Code,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

type PlanId = 'starter' | 'pro' | 'enterprise';
type InvoiceStatus = 'Payée' | 'En attente';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: typeof Star;
  iconBg: string;
  iconColor: string;
  features: string[];
  highlighted?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
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

// ============================================
// Mock Data
// ============================================

const currentPlanId: PlanId = 'pro';

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: 'mois',
    description: 'Idéal pour les architectes indépendants',
    icon: Star,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    features: [
      '10 projets actifs',
      '3 utilisateurs',
      '5 Go de stockage',
      'Support par email',
      'Modèles de devis standard',
      'Export PDF',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'mois',
    description: 'Pour les cabinets en croissance',
    icon: Zap,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    highlighted: true,
    features: [
      '25 projets actifs',
      '10 utilisateurs',
      '10 Go de stockage',
      'Support prioritaire',
      'Modèles de devis personnalisés',
      'Rapports avancés',
      'Intégration calendrier',
      'Gestion des phases',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'mois',
    description: 'Pour les grands cabinets et agences',
    icon: Rocket,
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    features: [
      'Projets illimités',
      'Utilisateurs illimités',
      '50 Go de stockage',
      'Support dédié + API',
      'Modèles sur mesure',
      'Rapports personnalisés',
      'Intégrations avancées',
      'SLA garanti',
      'Formation incluse',
    ],
  },
];

const usageData = [
  {
    label: 'Projets actifs',
    current: 12,
    max: 25,
    icon: FolderKanban,
    color: '#2563EB',
    bgColor: '#DBEAFE',
  },
  {
    label: 'Utilisateurs',
    current: 5,
    max: 10,
    icon: Users,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
  },
  {
    label: 'Stockage',
    current: 2.4,
    max: 10,
    unit: 'Go',
    icon: HardDrive,
    color: '#059669',
    bgColor: '#D1FAE5',
  },
];

const invoices: Invoice[] = [
  {
    id: 'INV-2026-006',
    date: '01/02/2026',
    description: 'Abonnement Pro - Février 2026',
    amount: 49.0,
    status: 'Payée',
  },
  {
    id: 'INV-2026-005',
    date: '01/01/2026',
    description: 'Abonnement Pro - Janvier 2026',
    amount: 49.0,
    status: 'Payée',
  },
  {
    id: 'INV-2025-004',
    date: '01/12/2025',
    description: 'Abonnement Pro - Décembre 2025',
    amount: 49.0,
    status: 'Payée',
  },
  {
    id: 'INV-2025-003',
    date: '01/11/2025',
    description: 'Abonnement Pro - Novembre 2025',
    amount: 49.0,
    status: 'Payée',
  },
  {
    id: 'INV-2025-002',
    date: '01/10/2025',
    description: 'Abonnement Pro - Octobre 2025',
    amount: 49.0,
    status: 'Payée',
  },
  {
    id: 'INV-2025-001',
    date: '01/09/2025',
    description: 'Abonnement Pro - Septembre 2025',
    amount: 49.0,
    status: 'En attente',
  },
];

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
  icon: typeof CreditCard;
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
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '2px',
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>{description}</p>
      </div>
    </div>
  );
}

// ============================================
// FormInput Component
// ============================================

function FormInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          ...(focused ? inputFocusStyle : {}),
        }}
      />
    </div>
  );
}

// ============================================
// Progress Bar Component
// ============================================

function ProgressBar({
  current,
  max,
  color,
  bgColor,
}: {
  current: number;
  max: number;
  color: string;
  bgColor: string;
}) {
  const percentage = Math.min((current / max) * 100, 100);
  const isHigh = percentage >= 80;

  return (
    <div
      style={{
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        backgroundColor: bgColor,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          borderRadius: '4px',
          backgroundColor: isHigh ? '#EF4444' : color,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

// ============================================
// Plan Card Component
// ============================================

function PlanCard({
  plan,
  isCurrent,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  onSelect: (id: PlanId) => void;
}) {
  const Icon = plan.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        border: plan.highlighted
          ? '2px solid #2563EB'
          : '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        boxShadow: hovered
          ? '0 8px 25px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* Current plan badge */}
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: '-1px',
            right: '20px',
            backgroundColor: '#2563EB',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '0 0 8px 8px',
            letterSpacing: '0.02em',
          }}
        >
          Plan actuel
        </div>
      )}

      {/* Plan icon and name */}
      <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: plan.iconBg,
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '20px', height: '20px', color: plan.iconColor }} />
        </div>
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}
          >
            {plan.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '2px' }}>
            {plan.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1" style={{ marginBottom: '20px' }}>
        <span
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1,
          }}
        >
          {plan.price}
        </span>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
          }}
        >
          {'\u20AC'}
        </span>
        <span
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginLeft: '2px',
          }}
        >
          / {plan.period}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#f3f4f6',
          marginBottom: '20px',
        }}
      />

      {/* Features list */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3"
            style={{
              padding: '6px 0',
              fontSize: '13px',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            <Check
              style={{
                width: '16px',
                height: '16px',
                color: plan.iconColor,
                flexShrink: 0,
                marginTop: '1px',
              }}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* Action button */}
      <div style={{ marginTop: '20px' }}>
        {isCurrent ? (
          <button
            disabled
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'not-allowed',
            }}
          >
            <Crown style={{ width: '16px', height: '16px' }} />
            Plan actuel
          </button>
        ) : (
          <button
            onClick={() => onSelect(plan.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: plan.highlighted ? '#ffffff' : '#374151',
              backgroundColor: plan.highlighted ? '#2563EB' : '#ffffff',
              border: plan.highlighted ? 'none' : '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (plan.highlighted) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              } else {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }
            }}
            onMouseLeave={(e) => {
              if (plan.highlighted) {
                e.currentTarget.style.backgroundColor = '#2563EB';
              } else {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
          >
            {plan.id === 'enterprise' ? (
              <>
                <Mail style={{ width: '16px', height: '16px' }} />
                Contacter les ventes
              </>
            ) : (
              <>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
                Choisir ce plan
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Invoice Status Badge
// ============================================

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const isPaid = status === 'Payée';

  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: isPaid ? '#F0FDF4' : '#FFFBEB',
        color: isPaid ? '#16A34A' : '#D97706',
        border: `1px solid ${isPaid ? '#BBF7D0' : '#FDE68A'}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isPaid ? '#16A34A' : '#D97706',
        }}
      />
      {status}
    </span>
  );
}

// ============================================
// Main Billing Page Component
// ============================================

export default function BillingPage() {
  // Plan selection state
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(currentPlanId);
  const [showPlanComparison, setShowPlanComparison] = useState(false);

  // Payment method edit state
  const [editingPayment, setEditingPayment] = useState(false);

  // Billing info state
  const [companyName, setCompanyName] = useState('Cabinet Dupont Architectes SARL');
  const [billingAddress, setBillingAddress] = useState(
    '15 rue de la Paix, 75002 Paris, France'
  );
  const [vatNumber, setVatNumber] = useState('FR 12 345678901');
  const [savingBillingInfo, setSavingBillingInfo] = useState(false);

  // Save billing info handler
  async function handleSaveBillingInfo() {
    setSavingBillingInfo(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingBillingInfo(false);
  }

  // Handle plan selection
  function handleSelectPlan(planId: PlanId) {
    setSelectedPlan(planId);
  }

  // Current plan data
  const currentPlan = plans.find((p) => p.id === currentPlanId)!;

  return (
    <>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          animation: 'fadeIn 0.3s ease',
        }}
      >
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

        {/* ================================================ */}
        {/* Page Header                                      */}
        {/* ================================================ */}
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ marginBottom: '32px' }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.2,
              }}
            >
              Facturation et abonnement
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Gérez votre abonnement, vos moyens de paiement et consultez vos factures.
            </p>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 1: Current Plan & Usage                  */}
        {/* ================================================ */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <SectionHeader
            icon={CreditCard}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            title="Abonnement actuel"
            description="Votre plan et votre consommation en cours"
          />

          {/* Plan info bar */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{
              padding: '16px 20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  flexShrink: 0,
                }}
              >
                <Zap style={{ width: '24px', height: '24px', color: '#2563EB' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    Plan {currentPlan.name}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: '#DBEAFE',
                      color: '#2563EB',
                    }}
                  >
                    Actif
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, marginTop: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#111827', fontSize: '20px' }}>
                    {currentPlan.price}{'\u20AC'}
                  </span>
                  <span style={{ marginLeft: '4px' }}>/ {currentPlan.period}</span>
                  <span style={{ marginLeft: '12px', fontSize: '13px' }}>
                    Prochain renouvellement le 01/03/2026
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPlanComparison(!showPlanComparison)}
              style={{
                ...secondaryButtonStyle,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <Crown style={{ width: '16px', height: '16px' }} />
              {showPlanComparison ? 'Masquer les plans' : 'Changer de plan'}
            </button>
          </div>

          {/* Usage stats */}
          <div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '16px',
              }}
            >
              Consommation du mois
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {usageData.map((item) => {
                const Icon = item.icon;
                const percentage = Math.round((item.current / item.max) * 100);
                const unit = item.unit || '';
                const isHigh = percentage >= 80;

                return (
                  <div
                    key={item.label}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #f3f4f6',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: '12px' }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          style={{
                            width: '16px',
                            height: '16px',
                            color: item.color,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#374151',
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: isHigh ? '#EF4444' : '#6b7280',
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <ProgressBar
                      current={item.current}
                      max={item.max}
                      color={item.color}
                      bgColor={item.bgColor}
                    />

                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#111827' }}>
                        {item.current}{unit ? ` ${unit}` : ''}
                      </span>
                      {' '}sur{' '}
                      <span style={{ fontWeight: 600, color: '#111827' }}>
                        {item.max}{unit ? ` ${unit}` : ''}
                      </span>
                      {' '}utilisés
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 2: Plan Comparison (collapsible)         */}
        {/* ================================================ */}
        {showPlanComparison && (
          <div
            style={{
              marginBottom: '24px',
              animation: 'slideDown 0.3s ease',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '4px',
                }}
              >
                Comparer les plans
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                Choisissez le plan qui correspond le mieux aux besoins de votre cabinet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={plan.id === currentPlanId}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>

            {/* Annual savings notice */}
            <div
              className="flex items-center justify-center gap-3"
              style={{
                marginTop: '20px',
                padding: '14px 20px',
                backgroundColor: '#FFFBEB',
                borderRadius: '10px',
                border: '1px solid #FDE68A',
              }}
            >
              <Clock style={{ width: '18px', height: '18px', color: '#D97706', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#92400E', margin: 0 }}>
                <span style={{ fontWeight: 600 }}>
                  Économisez 20%
                </span>
                {' '}en choisissant la facturation annuelle.{' '}
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D97706',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Passer en annuel
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================================================ */}
        {/* Two-column layout for payment & billing info     */}
        {/* ================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
          {/* ============================================== */}
          {/* Section 3: Payment Method                      */}
          {/* ============================================== */}
          <div style={cardStyle}>
            <SectionHeader
              icon={CreditCard}
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Moyen de paiement"
              description="Votre carte bancaire enregistrée"
            />

            {/* Current card */}
            <div
              style={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafafa',
                marginBottom: '16px',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Visa icon placeholder */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#1a1f71',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      flexShrink: 0,
                    }}
                  >
                    VISA
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0,
                      }}
                    >
                      Visa se terminant par 4242
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0,
                        marginTop: '2px',
                      }}
                    >
                      Expire le 12/2027
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingPayment(!editingPayment)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
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
                >
                  <Edit3
                    style={{ width: '14px', height: '14px', color: '#6b7280' }}
                  />
                </button>
              </div>

              {/* Card details indicator */}
              <div
                className="flex items-center gap-2"
                style={{ marginTop: '12px' }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: '#F0FDF4',
                    color: '#16A34A',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <Check style={{ width: '10px', height: '10px' }} />
                  Carte par défaut
                </span>
              </div>
            </div>

            {/* Add payment method button */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6b7280',
                backgroundColor: '#ffffff',
                border: '2px dashed #d1d5db',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.color = '#2563EB';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Ajouter une méthode de paiement
            </button>
          </div>

          {/* ============================================== */}
          {/* Section 5: Billing Information                 */}
          {/* ============================================== */}
          <div style={cardStyle}>
            <SectionHeader
              icon={Building2}
              iconBg="#F5F3FF"
              iconColor="#7C3AED"
              title="Informations de facturation"
              description="Les données qui apparaissent sur vos factures"
            />

            <div className="space-y-4">
              <FormInput
                id="companyName"
                label="Raison sociale"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Cabinet Dupont Architectes SARL"
              />

              <FormInput
                id="billingAddress"
                label="Adresse de facturation"
                value={billingAddress}
                onChange={setBillingAddress}
                placeholder="15 rue de la Paix, 75002 Paris"
              />

              <FormInput
                id="vatNumber"
                label="Numéro de TVA intracommunautaire"
                value={vatNumber}
                onChange={setVatNumber}
                placeholder="FR 12 345678901"
              />
            </div>

            <div
              className="flex justify-end"
              style={{ marginTop: '20px' }}
            >
              <button
                onClick={handleSaveBillingInfo}
                disabled={savingBillingInfo}
                style={{
                  ...primaryButtonStyle,
                  opacity: savingBillingInfo ? 0.7 : 1,
                  cursor: savingBillingInfo ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!savingBillingInfo)
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  if (!savingBillingInfo)
                    e.currentTarget.style.backgroundColor = '#2563EB';
                }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                {savingBillingInfo ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* Section 4: Billing History                       */}
        {/* ================================================ */}
        <div
          style={{
            ...cardStyle,
            padding: 0,
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {/* Section header inside card with padding */}
          <div style={{ padding: '24px 24px 0 24px' }}>
            <SectionHeader
              icon={Receipt}
              iconBg="#ECFDF5"
              iconColor="#059669"
              title="Historique de facturation"
              description="Vos six dernières factures"
            />
          </div>

          {/* Invoice table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    borderTop: '1px solid #f3f4f6',
                  }}
                >
                  <th
                    style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Facture
                  </th>
                  <th
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Montant
                  </th>
                  <th
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Statut
                  </th>
                  <th
                    style={{
                      padding: '12px 24px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom:
                        index < invoices.length - 1
                          ? '1px solid #f9fafb'
                          : 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FAFBFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Invoice ID */}
                    <td style={{ padding: '14px 24px' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#F3F4F6',
                            flexShrink: 0,
                          }}
                        >
                          <FileText
                            style={{
                              width: '14px',
                              height: '14px',
                              color: '#6b7280',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#111827',
                          }}
                        >
                          {invoice.id}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#6b7280',
                        }}
                      >
                        {invoice.date}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#374151',
                          fontWeight: 500,
                        }}
                      >
                        {invoice.description}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {invoice.amount.toFixed(2)}{'\u20AC'}
                      </span>
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        padding: '14px 16px',
                        textAlign: 'center',
                      }}
                    >
                      <StatusBadge status={invoice.status} />
                    </td>

                    {/* Download */}
                    <td
                      style={{
                        padding: '14px 24px',
                        textAlign: 'right',
                      }}
                    >
                      <button
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#6b7280',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Download
                          style={{ width: '12px', height: '12px' }}
                        />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View all invoices link */}
          <div
            className="flex items-center justify-center"
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #f3f4f6',
              backgroundColor: '#fafafa',
            }}
          >
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563EB',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Voir toutes les factures
              <ExternalLink style={{ width: '13px', height: '13px' }} />
            </button>
          </div>
        </div>

        {/* ================================================ */}
        {/* Help Section                                     */}
        {/* ================================================ */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            padding: '20px 24px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '32px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                flexShrink: 0,
              }}
            >
              <Headphones
                style={{ width: '18px', height: '18px', color: '#2563EB' }}
              />
            </div>
            <div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0,
                }}
              >
                Besoin d&apos;aide avec votre abonnement ?
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0,
                  marginTop: '2px',
                }}
              >
                Notre équipe support est disponible du lundi au vendredi, de 9h à 18h.
              </p>
            </div>
          </div>
          <button
            style={{
              ...secondaryButtonStyle,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <Mail style={{ width: '16px', height: '16px' }} />
            Contacter le support
          </button>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: '32px' }} />
      </div>

      {/* ================================================ */}
      {/* Responsive grid styles                           */}
      {/* ================================================ */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
