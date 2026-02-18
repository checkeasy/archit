'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  Zap,
} from 'lucide-react';

/* ─────────────────────── DATA ─────────────────────── */

const plans = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'Pour les architectes indépendants',
    monthlyPrice: 29,
    annualPrice: 23,
    popular: false,
    cta: 'Démarrer avec Solo',
    features: [
      '5 projets actifs',
      '3 clients',
      '1 Go de stockage',
      'Devis & Factures',
      'Support par email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les cabinets en croissance',
    monthlyPrice: 49,
    annualPrice: 39,
    popular: true,
    cta: 'Démarrer avec Pro',
    features: [
      'Projets illimités',
      'Clients illimités',
      '10 Go de stockage',
      'Planning & Calendrier',
      'Rapports avancés',
      'Exports PDF / CSV',
      'Support prioritaire',
    ],
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    description: 'Pour les agences avec équipe',
    monthlyPrice: 89,
    annualPrice: 71,
    popular: false,
    cta: 'Démarrer avec Cabinet',
    features: [
      'Tout du plan Pro +',
      'Gestion d\'équipe (jusqu\'à 10 membres)',
      '50 Go de stockage',
      'Intégrations API',
      'Webhooks',
      'Support dédié',
      'Formation personnalisée',
    ],
  },
];

type FeatureAvailability = boolean | string;

interface ComparisonRow {
  label: string;
  solo: FeatureAvailability;
  pro: FeatureAvailability;
  cabinet: FeatureAvailability;
}

const comparisonData: ComparisonRow[] = [
  { label: 'Projets actifs', solo: '5', pro: 'Illimités', cabinet: 'Illimités' },
  { label: 'Clients', solo: '3', pro: 'Illimités', cabinet: 'Illimités' },
  { label: 'Stockage', solo: '1 Go', pro: '10 Go', cabinet: '50 Go' },
  { label: 'Devis', solo: true, pro: true, cabinet: true },
  { label: 'Factures', solo: true, pro: true, cabinet: true },
  { label: 'Planning & Calendrier', solo: false, pro: true, cabinet: true },
  { label: 'Rapports avancés', solo: false, pro: true, cabinet: true },
  { label: 'Exports PDF / CSV', solo: false, pro: true, cabinet: true },
  { label: 'Gestion d\'équipe', solo: false, pro: false, cabinet: 'Jusqu\'à 10' },
  { label: 'Intégrations API', solo: false, pro: false, cabinet: true },
  { label: 'Support', solo: 'Email', pro: 'Prioritaire', cabinet: 'Dédié' },
];

const faqData = [
  {
    question: 'Puis-je essayer ArchiPro gratuitement ?',
    answer:
      'Oui, chaque plan bénéficie d\'un essai gratuit de 14 jours, sans carte bancaire requise. Vous pouvez explorer toutes les fonctionnalités du plan choisi avant de vous engager.',
  },
  {
    question: 'Comment fonctionne la facturation annuelle ?',
    answer:
      'En choisissant la facturation annuelle, vous bénéficiez d\'une réduction de 20 % par rapport au tarif mensuel. Le paiement est effectué en une seule fois pour l\'année complète.',
  },
  {
    question: 'Puis-je changer de plan en cours de route ?',
    answer:
      'Absolument. Vous pouvez passer à un plan supérieur à tout moment. La différence de tarif sera calculée au prorata de la période restante. Le passage à un plan inférieur prend effet à la fin de la période de facturation en cours.',
  },
  {
    question: 'Comment puis-je annuler mon abonnement ?',
    answer:
      'Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L\'accès reste actif jusqu\'à la fin de la période de facturation en cours. Aucun frais d\'annulation ne s\'applique.',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      'Vos données sont hébergées en France sur des serveurs certifiés, avec chiffrement AES-256 au repos et TLS 1.3 en transit. Nous sommes conformes au RGPD et réalisons des audits de sécurité réguliers.',
  },
  {
    question: 'Puis-je importer mes données depuis un autre outil ?',
    answer:
      'Oui, ArchiPro propose un assistant d\'importation pour migrer vos projets, clients et documents depuis Excel, ArchiReport ou tout autre outil. Notre équipe support vous accompagne dans la migration.',
  },
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* ==================== HEADER / NAV ==================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}
        >
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                backgroundColor: '#2563EB',
                borderRadius: 8,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              A
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>ArchiPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Fonctionnalités
            </Link>
            <Link
              href="/pricing"
              style={{ fontSize: 14, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
            >
              Tarifs
            </Link>
            <Link
              href="/#contact"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 8,
              }}
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: 8,
                backgroundColor: '#2563EB',
              }}
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section
        style={{
          padding: '80px 24px 48px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 32,
              border: '1px solid #DBEAFE',
            }}
          >
            <Zap size={14} />
            14 jours d&apos;essai gratuit sur tous les plans
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 20,
            }}
          >
            Des tarifs simples
            <br />
            <span style={{ color: '#2563EB' }}>et transparents</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 520,
              margin: '0 auto 40px',
            }}
          >
            Choisissez le plan adapté à la taille de votre cabinet.
            Sans engagement, sans surprise.
          </p>

          {/* Toggle mensuel / annuel */}
          <div
            className="inline-flex items-center gap-3"
            style={{
              padding: '4px 6px',
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: !isAnnual ? '#ffffff' : 'transparent',
                color: !isAnnual ? '#111827' : '#6B7280',
                boxShadow: !isAnnual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className="flex items-center gap-2"
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: isAnnual ? '#ffffff' : 'transparent',
                color: isAnnual ? '#111827' : '#6B7280',
                boxShadow: isAnnual ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Annuel
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 9999,
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                -20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== PRICING CARDS ==================== */}
      <section style={{ padding: '48px 24px 96px' }}>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                style={{
                  padding: plan.popular ? 40 : 36,
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  border: plan.popular ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  boxShadow: plan.popular
                    ? '0 8px 30px rgba(37,99,235,0.12)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.03)' : 'none',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '5px 20px',
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      borderRadius: 9999,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Le plus populaire
                  </div>
                )}

                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                    {price}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>&euro;</span>
                  <span style={{ fontSize: 16, color: '#9CA3AF', marginLeft: 4 }}>/mois</span>
                </div>

                {isAnnual && (
                  <p style={{ fontSize: 13, color: '#16A34A', marginBottom: 24, fontWeight: 500 }}>
                    Soit {price * 12} &euro; facturés par an
                    <span
                      style={{
                        textDecoration: 'line-through',
                        color: '#9CA3AF',
                        marginLeft: 8,
                      }}
                    >
                      {plan.monthlyPrice * 12} &euro;
                    </span>
                  </p>
                )}
                {!isAnnual && (
                  <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 24 }}>
                    Facturation mensuelle
                  </p>
                )}

                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2"
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    backgroundColor: plan.popular ? '#2563EB' : '#ffffff',
                    color: plan.popular ? '#ffffff' : '#374151',
                    border: plan.popular ? '2px solid #2563EB' : '1px solid #D1D5DB',
                    transition: 'background-color 0.2s, border-color 0.2s',
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </Link>

                <div
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#F3F4F6',
                    margin: '28px 0',
                  }}
                />

                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Ce qui est inclus
                </p>

                <ul
                  className="flex flex-col gap-3"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 9999,
                          backgroundColor: '#DCFCE7',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Check size={12} style={{ color: '#16A34A' }} />
                      </div>
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== COMPARISON TABLE ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Comparez les plans en détail
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 500, margin: '0 auto' }}>
              Trouvez le plan qui correspond le mieux à vos besoins.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-4 items-center"
              style={{
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                padding: '20px 24px',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280' }}>
                Fonctionnalité
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', textAlign: 'center' }}>
                Solo
              </div>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#2563EB',
                  }}
                >
                  Pro
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', textAlign: 'center' }}>
                Cabinet
              </div>
            </div>

            {/* Table rows */}
            {comparisonData.map((row, index) => (
              <div
                key={row.label}
                className="grid grid-cols-4 items-center"
                style={{
                  padding: '16px 24px',
                  borderBottom:
                    index < comparisonData.length - 1 ? '1px solid #F3F4F6' : 'none',
                }}
              >
                <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{row.label}</div>
                {(['solo', 'pro', 'cabinet'] as const).map((planKey) => {
                  const val = row[planKey];
                  return (
                    <div
                      key={planKey}
                      className="flex items-center justify-center"
                      style={{ textAlign: 'center' }}
                    >
                      {val === true ? (
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 9999,
                            backgroundColor: '#DCFCE7',
                          }}
                        >
                          <Check size={13} style={{ color: '#16A34A' }} />
                        </div>
                      ) : val === false ? (
                        <X size={16} style={{ color: '#D1D5DB' }} />
                      ) : (
                        <span
                          style={{
                            fontSize: 14,
                            color: planKey === 'pro' ? '#2563EB' : '#374151',
                            fontWeight: planKey === 'pro' ? 600 : 500,
                          }}
                        >
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Questions fréquentes
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280' }}>
              Tout ce que vous devez savoir sur nos tarifs.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqData.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    backgroundColor: isOpen ? '#F9FAFB' : '#ffffff',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between"
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        color: '#6B7280',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px' }}>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.7,
                          color: '#6B7280',
                          margin: 0,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        style={{
          padding: '96px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: '#EFF6FF',
              marginBottom: 24,
            }}
          >
            <Building2 size={28} style={{ color: '#2563EB' }} />
          </div>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            Prêt à simplifier la gestion de votre cabinet ?
          </h2>
          <p style={{ fontSize: 18, color: '#6B7280', marginBottom: 40 }}>
            Rejoignez plus de 500 cabinets d&apos;architecture qui font confiance à ArchiPro.
            Essai gratuit de 14 jours, sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2"
              style={{
                padding: '16px 36px',
                backgroundColor: '#2563EB',
                color: '#ffffff',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              }}
            >
              Commencer gratuitement
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2"
              style={{
                padding: '16px 36px',
                backgroundColor: '#ffffff',
                color: '#374151',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                border: '1px solid #D1D5DB',
              }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ padding: '64px 24px 32px', backgroundColor: '#111827' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            paddingBottom: 48,
            borderBottom: '1px solid #1F2937',
          }}
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#2563EB',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                A
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#ffffff' }}>ArchiPro</span>
            </div>
            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>
              La plateforme de gestion pour les architectes.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Produit
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <Link
                  href="/#features"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Démo
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Ressources
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  API
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Légal
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  CGV
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}
            >
              Contact
            </h4>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <a
                  href="mailto:contact@archipro.fr"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  contact@archipro.fr
                </a>
              </li>
              <li>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Lyon, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            &copy; 2026 ArchiPro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
