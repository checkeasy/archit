'use client';

import Link from 'next/link';
import {
  FolderKanban,
  FileText,
  Receipt,
  Files,
  Calendar,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Check,
  Building2,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';

/* ─────────────────────── DATA ─────────────────────── */

const statBadges = [
  { value: '500+', label: 'cabinets' },
  { value: '10 000+', label: 'projets gérés' },
  { value: '99.9%', label: 'uptime' },
];

interface Feature {
  id: string;
  icon: typeof FolderKanban;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  bullets: string[];
  mockType: 'pipeline' | 'invoice' | 'documents' | 'calendar' | 'chart' | 'messages';
}

const features: Feature[] = [
  {
    id: 'projects',
    icon: FolderKanban,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    title: 'Gestion de projets',
    subtitle: 'Suivez chaque phase de vos projets architecturaux, de l\'Esquisse à la Livraison, avec une vision claire et centralisée.',
    bullets: [
      'Suivi par phase : Esquisse, APS, APD, PRO, DCE, ACT, DET, AOR, Livraison',
      'Tableaux Kanban personnalisables par statut ou phase',
      'Suivi budgétaire en temps réel avec alertes de dépassement',
      'Jalons et échéances automatiques liés au planning',
    ],
    mockType: 'pipeline',
  },
  {
    id: 'invoicing',
    icon: FileText,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    title: 'Devis et Factures',
    subtitle: 'Créez des devis professionnels et générez vos factures conformes en quelques clics, avec calcul automatique de la TVA.',
    bullets: [
      'Génération PDF aux couleurs de votre cabinet',
      'Calcul automatique TVA 10% / 20% selon type de travaux',
      'Suivi des paiements et relances automatisées',
      'Facturation par phase MOP (Esquisse, APS, APD, PRO...)',
    ],
    mockType: 'invoice',
  },
  {
    id: 'documents',
    icon: Files,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    title: 'Gestion documentaire',
    subtitle: 'Centralisez tous vos documents de projet : plans, rendus 3D, contrats, permis de construire et pièces administratives.',
    bullets: [
      'Stockage centralisé avec arborescence par projet',
      'Versioning automatique des plans et documents',
      'Partage sécurisé avec vos clients et partenaires',
      'Recherche instantanée par nom, date ou type de fichier',
    ],
    mockType: 'documents',
  },
  {
    id: 'planning',
    icon: Calendar,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    title: 'Planning et Calendrier',
    subtitle: 'Planifiez les réunions de chantier, les rendez-vous clients et les échéances réglementaires dans un calendrier unifié.',
    bullets: [
      'Vue calendrier hebdomadaire, mensuelle et annuelle',
      'Planification d\'équipe avec gestion des disponibilités',
      'Rappels automatiques pour les échéances réglementaires',
      'Synchronisation avec Google Calendar et Outlook',
    ],
    mockType: 'calendar',
  },
  {
    id: 'reports',
    icon: BarChart3,
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    title: 'Rapports et Analyses',
    subtitle: 'Analysez la performance de votre cabinet avec des tableaux de bord clairs : chiffre d\'affaires, rentabilité par projet, charge d\'équipe.',
    bullets: [
      'Tableau de bord du chiffre d\'affaires mensuel et annuel',
      'Rentabilité par projet avec suivi des heures passées',
      'Analyse de la charge de travail par collaborateur',
      'Export des rapports en PDF et CSV',
    ],
    mockType: 'chart',
  },
  {
    id: 'messaging',
    icon: MessageSquare,
    iconColor: '#0891B2',
    iconBg: '#ECFEFF',
    title: 'Messagerie intégrée',
    subtitle: 'Communiquez avec vos clients et votre équipe directement depuis ArchiPro, avec des conversations liées à chaque projet.',
    bullets: [
      'Messagerie en temps réel par projet ou par client',
      'Partage de fichiers et de plans dans la conversation',
      'Notifications intelligentes et fil d\'activité',
      'Historique complet et recherche dans les échanges',
    ],
    mockType: 'messages',
  },
];

const integrations = [
  { name: 'Google Calendar', color: '#4285F4' },
  { name: 'Dropbox', color: '#0061FF' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'AutoCAD', color: '#E51937' },
  { name: 'Google Drive', color: '#0F9D58' },
  { name: 'Slack', color: '#4A154B' },
];

/* ─────────────────────── MOCK UI COMPONENTS ─────────────────────── */

function MockPipeline() {
  const phases = [
    { name: 'Esquisse', count: 3, color: '#2563EB' },
    { name: 'APS', count: 2, color: '#7C3AED' },
    { name: 'APD', count: 1, color: '#D97706' },
    { name: 'PRO', count: 2, color: '#059669' },
    { name: 'Chantier', count: 1, color: '#DC2626' },
  ];
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Pipeline projets</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#2563EB',
            backgroundColor: '#EFF6FF',
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          9 projets
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {phases.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <span style={{ fontSize: 11, color: '#6B7280', width: 64, flexShrink: 0 }}>{p.name}</span>
            <div
              style={{
                flex: 1,
                height: 8,
                backgroundColor: '#F3F4F6',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(p.count / 3) * 100}%`,
                  height: '100%',
                  backgroundColor: p.color,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', width: 16, textAlign: 'right' }}>
              {p.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockInvoice() {
  const lines = [
    { desc: 'Phase APS - Villa Méditerranée', amount: '4 800' },
    { desc: 'Phase APD - Résidence Les Pins', amount: '7 200' },
    { desc: 'Modification plans - Loft Confluence', amount: '1 350' },
  ];
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Facture #2026-042</span>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>SCI Les Terrasses du Parc</div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#059669',
            backgroundColor: '#ECFDF5',
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          Payée
        </span>
      </div>
      <div className="flex flex-col gap-2" style={{ marginBottom: 12 }}>
        {lines.map((l) => (
          <div key={l.desc} className="flex items-center justify-between">
            <span style={{ fontSize: 11, color: '#6B7280' }}>{l.desc}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{l.amount} &euro;</span>
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: '1px solid #F3F4F6',
          paddingTop: 10,
        }}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Total TTC</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#2563EB' }}>16 020 &euro;</span>
        </div>
      </div>
    </div>
  );
}

function MockDocuments() {
  const docs = [
    { name: 'Plans RDC - v3.2.dwg', type: 'Plan', date: '14 fév', icon: '📐' },
    { name: 'Permis de construire.pdf', type: 'Admin', date: '12 fév', icon: '📄' },
    { name: 'Rendu 3D Salon.png', type: 'Rendu', date: '10 fév', icon: '🖼' },
    { name: 'CCTP Lot Plomberie.docx', type: 'DCE', date: '08 fév', icon: '📋' },
  ];
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Documents récents</span>
        <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Tout voir</span>
      </div>
      <div className="flex flex-col gap-2">
        {docs.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-3"
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              backgroundColor: '#F9FAFB',
            }}
          >
            <span style={{ fontSize: 16 }}>{d.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.name}
              </div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{d.type}</div>
            </div>
            <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCalendar() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const events = [
    { time: '09:00', label: 'Réunion chantier Villa', color: '#2563EB' },
    { time: '11:30', label: 'RDV client - M. Dupont', color: '#7C3AED' },
    { time: '14:00', label: 'Revue de plans APD', color: '#059669' },
  ];
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Février 2026</span>
        <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Aujourd&apos;hui</span>
      </div>
      <div className="grid grid-cols-7 gap-1" style={{ marginBottom: 14 }}>
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#9CA3AF',
              textAlign: 'center',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
          <div
            key={d}
            className="flex items-center justify-center"
            style={{
              fontSize: 11,
              fontWeight: d === 18 ? 700 : 400,
              color: d === 18 ? '#ffffff' : '#374151',
              backgroundColor: d === 18 ? '#2563EB' : 'transparent',
              borderRadius: 6,
              width: '100%',
              aspectRatio: '1',
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {events.map((e) => (
          <div key={e.label} className="flex items-center gap-2">
            <div style={{ width: 3, height: 20, borderRadius: 2, backgroundColor: e.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{e.time}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{e.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockChart() {
  const months = ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];
  const values = [45, 62, 55, 78, 85, 92];
  const maxVal = Math.max(...values);
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Chiffre d&apos;affaires</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>+23%</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
        127 400 &euro;
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 16 }}>6 derniers mois</div>
      <div className="flex items-end gap-2" style={{ height: 80 }}>
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center" style={{ flex: 1, gap: 4 }}>
            <div
              style={{
                width: '100%',
                height: `${(v / maxVal) * 60}px`,
                backgroundColor: i === values.length - 1 ? '#2563EB' : '#DBEAFE',
                borderRadius: 4,
                transition: 'height 0.3s ease',
              }}
            />
            <span style={{ fontSize: 9, color: '#9CA3AF' }}>{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockMessages() {
  const messages = [
    { sender: 'Marie L.', text: 'Les plans du RDC sont validés, on peut passer à la phase PRO.', time: '10:42', isOwn: false },
    { sender: 'Vous', text: 'Parfait, je lance la mise à jour du CCTP ce matin.', time: '10:45', isOwn: true },
    { sender: 'Jean-Pierre M.', text: 'Le BET confirme la conformité RE2020 pour le lot structure.', time: '10:48', isOwn: false },
  ];
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Villa Méditerranée</span>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: '#059669',
          }}
        />
      </div>
      <div className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className="flex flex-col"
            style={{ alignItems: m.isOwn ? 'flex-end' : 'flex-start' }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: m.isOwn ? '#2563EB' : '#6B7280',
                marginBottom: 3,
              }}
            >
              {m.sender}
            </div>
            <div
              style={{
                fontSize: 11,
                lineHeight: 1.5,
                color: m.isOwn ? '#ffffff' : '#374151',
                backgroundColor: m.isOwn ? '#2563EB' : '#F3F4F6',
                padding: '8px 12px',
                borderRadius: 10,
                maxWidth: '85%',
              }}
            >
              {m.text}
            </div>
            <span style={{ fontSize: 9, color: '#9CA3AF', marginTop: 2 }}>{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockUI({ type }: { type: Feature['mockType'] }) {
  switch (type) {
    case 'pipeline':
      return <MockPipeline />;
    case 'invoice':
      return <MockInvoice />;
    case 'documents':
      return <MockDocuments />;
    case 'calendar':
      return <MockCalendar />;
    case 'chart':
      return <MockChart />;
    case 'messages':
      return <MockMessages />;
    default:
      return null;
  }
}

/* ─────────────────────── MAIN PAGE ─────────────────────── */

export default function FeaturesPage() {
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
              href="/features"
              style={{ fontSize: 14, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
            >
              Fonctionnalités
            </Link>
            <Link
              href="/pricing"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
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
          padding: '80px 24px 64px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
            Plateforme tout-en-un pour architectes
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
            Tout ce dont votre
            <br />
            <span style={{ color: '#2563EB' }}>cabinet a besoin</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 600,
              margin: '0 auto 40px',
            }}
          >
            Une solution complète pour gérer vos projets architecturaux de A à Z :
            suivi de chantier, devis, factures, documents et collaboration d&apos;équipe.
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {statBadges.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2"
                style={{
                  padding: '10px 20px',
                  borderRadius: 9999,
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{s.value}</span>
                <span style={{ fontSize: 13, color: '#6B7280' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURE SECTIONS ==================== */}
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isReversed = index % 2 === 1;
        const bgColor = index % 2 === 0 ? '#ffffff' : '#F9FAFB';

        return (
          <section
            key={feature.id}
            id={feature.id}
            style={{
              padding: '96px 24px',
              backgroundColor: bgColor,
            }}
          >
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              style={{
                maxWidth: 1100,
                margin: '0 auto',
                direction: isReversed ? 'rtl' : 'ltr',
              }}
            >
              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                <div
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: feature.iconBg,
                    marginBottom: 24,
                  }}
                >
                  <Icon size={26} style={{ color: feature.iconColor }} />
                </div>

                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.025em',
                    marginBottom: 16,
                    lineHeight: 1.2,
                  }}
                >
                  {feature.title}
                </h2>

                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: '#6B7280',
                    marginBottom: 28,
                  }}
                >
                  {feature.subtitle}
                </p>

                <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 9999,
                          backgroundColor: '#DCFCE7',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Check size={12} style={{ color: '#16A34A' }} />
                      </div>
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock UI side */}
              <div style={{ direction: 'ltr' }}>
                <div
                  style={{
                    padding: 24,
                    backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#ffffff',
                    borderRadius: 20,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  }}
                >
                  <MockUI type={feature.mockType} />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ==================== KEY BENEFITS ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#111827' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Pourquoi choisir ArchiPro ?
            </h2>
            <p style={{ fontSize: 18, color: '#9CA3AF', maxWidth: 520, margin: '0 auto' }}>
              Des avantages concrets pour votre cabinet d&apos;architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: '45 min gagnées par jour',
                description: 'Automatisez les tâches répétitives : facturation, suivi de phase, relances clients et gestion documentaire.',
              },
              {
                icon: Shield,
                title: 'Données sécurisées en France',
                description: 'Vos plans et documents sont hébergés sur des serveurs français certifiés, avec chiffrement AES-256 et conformité RGPD.',
              },
              {
                icon: Building2,
                title: 'Conçu pour les architectes',
                description: 'Vocabulaire métier intégré : phases MOP, bordereaux UNTEC, permis de construire, DCE. Pas d\'adaptation nécessaire.',
              },
            ].map((item) => {
              const BenefitIcon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    padding: 32,
                    borderRadius: 16,
                    border: '1px solid #1F2937',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: 'rgba(37,99,235,0.15)',
                      marginBottom: 20,
                    }}
                  >
                    <BenefitIcon size={24} style={{ color: '#60A5FA' }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#9CA3AF' }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== INTEGRATIONS ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            S&apos;intègre avec vos outils
          </h2>
          <p
            style={{
              fontSize: 18,
              color: '#6B7280',
              maxWidth: 520,
              margin: '0 auto 48px',
            }}
          >
            ArchiPro se connecte aux outils que vous utilisez déjà au quotidien.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ maxWidth: 600, margin: '0 auto' }}>
            {integrations.map((integ) => (
              <div
                key={integ.name}
                className="flex items-center justify-center gap-3"
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 9999,
                    backgroundColor: integ.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{integ.name}</span>
              </div>
            ))}
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
            Prêt à transformer votre cabinet ?
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
              Essai gratuit 14 jours
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/pricing"
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
              Voir les tarifs
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
                  href="/features"
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
