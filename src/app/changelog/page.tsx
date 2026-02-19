'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  Tag,
  ChevronRight,
  FileText,
  Calculator,
  FolderOpen,
  MessageSquare,
  Bell,
  FileDown,
  Building2,
  Rocket,
  Wrench,
  CheckCircle2,
  Filter,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BadgeType = 'new' | 'improvement' | 'fix';
type FilterType = 'all' | 'new' | 'improvement' | 'fix';

interface ChangelogEntry {
  version: string;
  date: string;
  month: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge: BadgeType;
  changes: string[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const badgeConfig: Record<BadgeType, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'Nouveauté', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  improvement: { label: 'Amélioration', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  fix: { label: 'Correction', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'new', label: 'Nouveautés' },
  { key: 'improvement', label: 'Améliorations' },
  { key: 'fix', label: 'Corrections' },
];

const entries: ChangelogEntry[] = [
  {
    version: 'v2.7',
    date: '15 février 2026',
    month: 'Février 2026',
    title: 'Gestion avancée des devis',
    icon: FileText,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    badge: 'new',
    changes: [
      'Aperçu détaillé des devis avec lignes de facturation ventilées par phase MOP',
      'Suivi de validité et alertes automatiques d\'expiration à J-7 et J-3',
      'Export PDF amélioré avec en-tête personnalisable du cabinet',
      'Calcul automatique des honoraires selon barème et surface',
    ],
  },
  {
    version: 'v2.6',
    date: '3 février 2026',
    month: 'Février 2026',
    title: 'Page À propos et Mentions légales',
    icon: Building2,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    badge: 'new',
    changes: [
      'Page équipe et valeurs présentant l\'identité du cabinet',
      'Conformité RGPD complète avec gestion du consentement',
      'Pages Mentions légales, CGV et Politique de confidentialité intégrées',
    ],
  },
  {
    version: 'v2.5',
    date: '20 janvier 2026',
    month: 'Janvier 2026',
    title: 'Système de notifications',
    icon: Bell,
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    badge: 'new',
    changes: [
      'Préférences email et push personnalisables par type de notification',
      'Planification des heures de réception (ne pas déranger)',
      'Notifications en temps réel pour les échéances de permis et jalons projet',
      'Centre de notifications avec historique et marquage lu/non-lu',
    ],
  },
  {
    version: 'v2.4',
    date: '8 janvier 2026',
    month: 'Janvier 2026',
    title: 'Export et rapports avancés',
    icon: FileDown,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    badge: 'improvement',
    changes: [
      'Centre d\'exports multi-format : PDF, Excel, CSV et ZIP',
      'Tableaux de bord analytiques enrichis avec graphiques interactifs',
      'Rapports de synthèse mensuels automatisés par projet',
      'Export groupé de documents par lot ou par phase de chantier',
    ],
  },
  {
    version: 'v2.3',
    date: '10 décembre 2025',
    month: 'Décembre 2025',
    title: 'Gestion documentaire',
    icon: FolderOpen,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badge: 'new',
    changes: [
      'Upload et organisation de documents par projet et par catégorie',
      'Aperçu intégré des fichiers PDF, images et plans sans téléchargement',
      'Partage sécurisé de documents avec clients via lien temporaire',
      'Versioning automatique avec historique des modifications',
    ],
  },
  {
    version: 'v2.2',
    date: '18 novembre 2025',
    month: 'Novembre 2025',
    title: 'Messagerie intégrée',
    icon: MessageSquare,
    iconColor: '#0891B2',
    iconBg: '#ECFEFF',
    badge: 'new',
    changes: [
      'Chat en temps réel avec les clients et les collaborateurs',
      'Conversations liées à un projet spécifique pour un suivi contextualisé',
      'Pièces jointes et partage de plans directement dans les discussions',
      'Historique des échanges consultable et recherchable',
    ],
  },
  {
    version: 'v2.1',
    date: '5 novembre 2025',
    month: 'Novembre 2025',
    title: 'Améliorations de performance',
    icon: Wrench,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badge: 'fix',
    changes: [
      'Optimisation du chargement du dashboard : temps réduit de 60%',
      'Correction de bugs d\'affichage sur les vues mobiles',
      'Amélioration de la stabilité des uploads de fichiers volumineux',
      'Correction du calcul des totaux sur les bordereaux de prix',
    ],
  },
  {
    version: 'v2.0',
    date: '15 octobre 2025',
    month: 'Octobre 2025',
    title: 'Lancement d\'ArchiPro v2.0',
    icon: Rocket,
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    badge: 'new',
    changes: [
      'Gestion de projets par phases architecturales (Esquisse, APS, APD, PRO, DCE, ACT)',
      'Suivi des clients avec fiches détaillées et historique des échanges',
      'Module de facturation par phase avec templates loi MOP',
      'Planning et calendrier intégré avec vues jour, semaine et mois',
      'Interface entièrement repensée avec design system professionnel',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChangelogPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<FilterType | null>(null);
  const [ctaPrimaryHover, setCtaPrimaryHover] = useState(false);
  const [ctaSecondaryHover, setCtaSecondaryHover] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'all') return true;
    return entry.badge === activeFilter;
  });

  const scrollToVersion = (version: string) => {
    setActiveVersion(version);
    const el = document.getElementById(version);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          {/* Logo */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Fonctionnalités', href: '/features' },
              { label: 'Tarifs', href: '/pricing' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14,
                  color: hoveredNav === item.href ? '#111827' : '#6B7280',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={() => setHoveredNav(item.href)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
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
          padding: '72px 24px 48px',
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
              marginBottom: 28,
              border: '1px solid #DBEAFE',
            }}
          >
            <Sparkles size={14} />
            Journal des mises à jour
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
            Changelog
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 560,
              margin: '0 auto 0',
            }}
          >
            Toutes les nouveautés et améliorations d&apos;ArchiPro.
            Découvrez les dernières fonctionnalités ajoutées à votre
            plateforme de gestion architecturale.
          </p>
        </div>
      </section>

      {/* ==================== FILTER PILLS ==================== */}
      <section style={{ padding: '0 24px 48px', backgroundColor: '#ffffff' }}>
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <Filter size={16} style={{ color: '#9CA3AF', marginRight: 4 }} />
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.key;
            const isHovered = hoveredFilter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                onMouseEnter={() => setHoveredFilter(opt.key)}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 9999,
                  border: isActive ? '1px solid #2563EB' : '1px solid #E5E7EB',
                  backgroundColor: isActive
                    ? '#2563EB'
                    : isHovered
                      ? '#F9FAFB'
                      : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== CHANGELOG TIMELINE ==================== */}
      <section style={{ padding: '0 24px 96px' }}>
        <div
          className="flex flex-col lg:flex-row gap-10"
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          {/* ---------- LEFT SIDEBAR: Version Timeline ---------- */}
          <aside
            className="hidden lg:block"
            style={{
              width: 220,
              flexShrink: 0,
              position: 'sticky',
              top: 100,
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                padding: 20,
                backgroundColor: '#F9FAFB',
                borderRadius: 14,
                border: '1px solid #F3F4F6',
              }}
            >
              <h3
                className="flex items-center gap-2"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 16,
                }}
              >
                <Tag size={13} />
                Versions
              </h3>

              <ul
                className="flex flex-col gap-1"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {filteredEntries.map((entry) => {
                  const isActive = activeVersion === entry.version;
                  return (
                    <li key={entry.version}>
                      <button
                        onClick={() => scrollToVersion(entry.version)}
                        className="flex items-center justify-between"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                          transition: 'background-color 0.15s',
                          textAlign: 'left',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: isActive ? '#2563EB' : '#111827',
                            }}
                          >
                            {entry.version}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#9CA3AF',
                              marginTop: 2,
                            }}
                          >
                            {entry.month}
                          </div>
                        </div>
                        <ChevronRight
                          size={14}
                          style={{
                            color: isActive ? '#2563EB' : '#D1D5DB',
                            transition: 'color 0.15s',
                          }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Subscribe box */}
            <div
              style={{
                marginTop: 20,
                padding: 20,
                backgroundColor: '#EFF6FF',
                borderRadius: 14,
                border: '1px solid #DBEAFE',
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1E40AF',
                  marginBottom: 8,
                }}
              >
                Restez informé
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#3B82F6',
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                Recevez les nouveautés directement par email.
              </p>
              <Link
                href="/register"
                className="flex items-center justify-center gap-1"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#2563EB',
                  borderRadius: 8,
                  padding: '8px 0',
                  textDecoration: 'none',
                  width: '100%',
                }}
              >
                S&apos;abonner
                <ExternalLink size={12} />
              </Link>
            </div>
          </aside>

          {/* ---------- MAIN: Changelog Entries ---------- */}
          <div className="flex-1" style={{ minWidth: 0 }}>
            {/* Mobile version pills */}
            <div
              className="flex lg:hidden flex-wrap gap-2"
              style={{ marginBottom: 32 }}
            >
              {filteredEntries.map((entry) => (
                <button
                  key={entry.version}
                  onClick={() => scrollToVersion(entry.version)}
                  style={{
                    padding: '6px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    cursor: 'pointer',
                    backgroundColor:
                      activeVersion === entry.version ? '#2563EB' : '#ffffff',
                    color:
                      activeVersion === entry.version ? '#ffffff' : '#374151',
                    transition: 'all 0.15s',
                  }}
                >
                  {entry.version}
                </button>
              ))}
            </div>

            {/* Results count */}
            {activeFilter !== 'all' && (
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: 24 }}
              >
                <CheckCircle2 size={16} style={{ color: '#9CA3AF' }} />
                <span style={{ fontSize: 14, color: '#6B7280' }}>
                  {filteredEntries.length} mise{filteredEntries.length > 1 ? 's' : ''} à jour
                </span>
              </div>
            )}

            {/* Empty state */}
            {filteredEntries.length === 0 && (
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  padding: '80px 24px',
                  textAlign: 'center',
                  backgroundColor: '#F9FAFB',
                  borderRadius: 16,
                }}
              >
                <Filter size={40} style={{ color: '#D1D5DB', marginBottom: 16 }} />
                <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 4 }}>
                  Aucune mise à jour dans cette catégorie
                </p>
                <p style={{ fontSize: 14, color: '#9CA3AF' }}>
                  Essayez un autre filtre pour voir plus de résultats.
                </p>
              </div>
            )}

            {/* Entries */}
            <div className="flex flex-col gap-0">
              {filteredEntries.map((entry, idx) => {
                const Icon = entry.icon;
                const cfg = badgeConfig[entry.badge];

                return (
                  <article
                    key={entry.version}
                    id={entry.version}
                    style={{ scrollMarginTop: 110 }}
                  >
                    {/* Timeline layout */}
                    <div className="flex items-stretch gap-0">
                      {/* LEFT: Date column */}
                      <div
                        className="hidden md:flex flex-col items-end"
                        style={{
                          width: 160,
                          flexShrink: 0,
                          paddingRight: 28,
                          paddingTop: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#111827',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {entry.month}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#9CA3AF',
                            marginTop: 4,
                          }}
                        >
                          {entry.date}
                        </span>
                      </div>

                      {/* CENTER: Timeline line + dot */}
                      <div
                        className="hidden md:flex flex-col items-center"
                        style={{
                          width: 24,
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 9999,
                            backgroundColor: idx === 0 ? '#2563EB' : '#D1D5DB',
                            border: idx === 0 ? '3px solid #DBEAFE' : '3px solid #F3F4F6',
                            flexShrink: 0,
                            marginTop: 6,
                            zIndex: 1,
                          }}
                        />
                        {/* Line */}
                        {idx < filteredEntries.length - 1 && (
                          <div
                            style={{
                              width: 2,
                              flex: 1,
                              backgroundColor: '#E5E7EB',
                            }}
                          />
                        )}
                      </div>

                      {/* RIGHT: Content */}
                      <div
                        style={{
                          flex: 1,
                          paddingLeft: 28,
                          paddingBottom: idx < filteredEntries.length - 1 ? 48 : 0,
                        }}
                      >
                        {/* Mobile date */}
                        <div
                          className="md:hidden flex items-center gap-2"
                          style={{ marginBottom: 12 }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#6B7280',
                            }}
                          >
                            {entry.date}
                          </span>
                        </div>

                        {/* Card */}
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            border: '1px solid #E5E7EB',
                            padding: '28px 28px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            transition: 'box-shadow 0.2s',
                          }}
                        >
                          {/* Top row: Icon + Version + Badge + Latest */}
                          <div
                            className="flex flex-wrap items-center gap-3"
                            style={{ marginBottom: 16 }}
                          >
                            {/* Icon */}
                            <div
                              className="flex items-center justify-center"
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: entry.iconBg,
                                flexShrink: 0,
                              }}
                            >
                              <Icon size={22} style={{ color: entry.iconColor }} />
                            </div>

                            {/* Version badge */}
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#2563EB',
                                backgroundColor: '#EFF6FF',
                                padding: '4px 10px',
                                borderRadius: 6,
                                border: '1px solid #DBEAFE',
                              }}
                            >
                              {entry.version}
                            </span>

                            {/* Category badge */}
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: cfg.color,
                                backgroundColor: cfg.bg,
                                border: `1px solid ${cfg.border}`,
                                padding: '4px 10px',
                                borderRadius: 6,
                              }}
                            >
                              {cfg.label}
                            </span>

                            {/* Latest tag */}
                            {idx === 0 && activeFilter === 'all' && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: '#ffffff',
                                  backgroundColor: '#2563EB',
                                  padding: '3px 8px',
                                  borderRadius: 4,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                Dernière version
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h2
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              color: '#111827',
                              letterSpacing: '-0.02em',
                              marginBottom: 16,
                              lineHeight: 1.3,
                            }}
                          >
                            {entry.title}
                          </h2>

                          {/* Changes list */}
                          <div
                            style={{
                              backgroundColor: '#F9FAFB',
                              borderRadius: 12,
                              border: '1px solid #F3F4F6',
                              padding: '18px 22px',
                            }}
                          >
                            <h4
                              className="flex items-center gap-2"
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#374151',
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              <Zap size={13} style={{ color: '#2563EB' }} />
                              Ce qui change
                            </h4>
                            <ul
                              className="flex flex-col gap-3"
                              style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                              }}
                            >
                              {entry.changes.map((change, ci) => (
                                <li
                                  key={ci}
                                  className="flex items-start gap-3"
                                >
                                  <div
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: 9999,
                                      backgroundColor: cfg.color,
                                      flexShrink: 0,
                                      marginTop: 7,
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: 14,
                                      lineHeight: 1.6,
                                      color: '#4B5563',
                                    }}
                                  >
                                    {change}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            Envie de tester ces nouveautés ?
          </h2>
          <p style={{ fontSize: 17, color: '#6B7280', marginBottom: 36, lineHeight: 1.7 }}>
            Rejoignez les 500+ cabinets d&apos;architecture qui utilisent ArchiPro au quotidien
            pour gérer leurs projets, devis et chantiers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2"
              onMouseEnter={() => setCtaPrimaryHover(true)}
              onMouseLeave={() => setCtaPrimaryHover(false)}
              style={{
                padding: '14px 32px',
                backgroundColor: ctaPrimaryHover ? '#1d4ed8' : '#2563EB',
                color: '#ffffff',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                transition: 'background-color 0.2s',
              }}
            >
              Commencer gratuitement
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2"
              onMouseEnter={() => setCtaSecondaryHover(true)}
              onMouseLeave={() => setCtaSecondaryHover(false)}
              style={{
                padding: '14px 32px',
                backgroundColor: ctaSecondaryHover ? '#F9FAFB' : '#ffffff',
                color: '#374151',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                border: '1px solid #D1D5DB',
                transition: 'background-color 0.2s',
              }}
            >
              Voir les fonctionnalités
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
              <span style={{ fontWeight: 700, fontSize: 18, color: '#ffffff' }}>
                ArchiPro
              </span>
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
                  href="/changelog"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Nouveautés
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
                <Link
                  href="/blog"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Contact
                </Link>
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
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Confidentialité
                </Link>
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
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>
                  Lyon, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32, textAlign: 'center' }}
        >
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            &copy; 2026 ArchiPro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
