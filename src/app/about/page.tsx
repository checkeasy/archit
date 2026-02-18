'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Sparkles,
  Shield,
  Heart,
  Lightbulb,
  Users,
  FolderKanban,
  FileText,
  Award,
  Newspaper,
} from 'lucide-react';

/* ─────────────────────── DATA ─────────────────────── */

const values = [
  {
    icon: Sparkles,
    title: 'Simplicité',
    description:
      'Rendre simple ce qui est complexe. Notre interface est pensée pour que chaque architecte puisse se concentrer sur ce qui compte : créer, concevoir, bâtir.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description:
      '99.9% de disponibilité garantie. Vos données sont chiffrées, sauvegardées quotidiennement et hébergées en France. Votre travail est en sécurité.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Heart,
    title: 'Proximité',
    description:
      'Support 100% français, basé à Lyon. Une équipe qui comprend votre métier parce qu\'elle vient du même monde que vous.',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Amélioration continue guidée par vos retours. Fonctionnalités IA en développement pour automatiser les tâches répétitives et vous faire gagner du temps.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

const teamMembers = [
  {
    name: 'Thomas Mercier',
    role: 'Co-fondateur & CEO',
    bio: 'Architecte DPLG, 15 ans d\'expérience. Passionné par la technologie au service de l\'architecture.',
    initials: 'TM',
    color: '#2563EB',
  },
  {
    name: 'Claire Dubois',
    role: 'Co-fondatrice & CTO',
    bio: 'Ingénieure polytechnicienne, ex-Dassault Systèmes. Experte en logiciels métier et architecture cloud.',
    initials: 'CD',
    color: '#7C3AED',
  },
  {
    name: 'Antoine Moreau',
    role: 'Lead Développeur',
    bio: 'Full-stack passionné, contributeur open source. Spécialiste React et systèmes temps réel.',
    initials: 'AM',
    color: '#059669',
  },
  {
    name: 'Julie Fontaine',
    role: 'Directrice Design',
    bio: 'UX/UI designer avec 10 ans d\'expérience. Anciennement chez Adobe, spécialiste des outils créatifs.',
    initials: 'JF',
    color: '#DC2626',
  },
  {
    name: 'Marc Lefèvre',
    role: 'Directeur Commercial',
    bio: 'Expert en SaaS B2B, passé par Salesforce et Doctolib. Spécialiste de la relation client.',
    initials: 'ML',
    color: '#D97706',
  },
  {
    name: 'Léa Bernard',
    role: 'Responsable Support',
    bio: 'Formée en architecture, elle comprend vos enjeux. Votre interlocutrice privilégiée au quotidien.',
    initials: 'LB',
    color: '#0891B2',
  },
];

const metrics = [
  { value: '500+', label: 'Cabinets d\'architecture' },
  { value: '12 000+', label: 'Projets gérés' },
  { value: '35 000+', label: 'Documents stockés' },
  { value: '15', label: 'Collaborateurs' },
];

const pressLogos = [
  { name: 'Le Moniteur', abbrev: 'LM' },
  { name: 'AMC Architecture', abbrev: 'AMC' },
  { name: 'd\'architectures', abbrev: 'd\'A' },
  { name: 'Batiactu', abbrev: 'BA' },
  { name: 'Archiscopie', abbrev: 'AS' },
];

const timeline = [
  {
    year: '2023',
    title: 'La genèse',
    description:
      'Thomas et Claire se rencontrent lors d\'un hackathon dédié à l\'architecture. Frustrés par les outils existants, ils décident de créer ArchiPro.',
  },
  {
    year: '2024',
    title: 'Le lancement',
    description:
      'Après 8 mois de développement et des dizaines d\'entretiens avec des architectes, la première version d\'ArchiPro est lancée. 50 cabinets adoptent la plateforme dès le premier mois.',
  },
  {
    year: '2025',
    title: 'L\'accélération',
    description:
      'Levée de fonds de 2M€, recrutement de l\'équipe à 15 personnes. Lancement du module de facturation et du calendrier collaboratif. 300 cabinets utilisateurs.',
  },
  {
    year: '2026',
    title: 'Aujourd\'hui',
    description:
      'Plus de 500 cabinets font confiance à ArchiPro. Lancement des fonctionnalités IA et expansion vers la Belgique et la Suisse.',
  },
];

/* ─────────────────────── PAGE ─────────────────────── */

export default function AboutPage() {
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
            <Link
              href="/features"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
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
              href="/contact"
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Contact
            </Link>
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
          padding: '80px 24px 64px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
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
            <Building2 size={14} />
            Notre mission
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 24,
            }}
          >
            Simplifier le quotidien
            <br />
            <span style={{ color: '#2563EB' }}>des architectes</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 640,
              margin: '0 auto 0',
            }}
          >
            ArchiPro est né d&apos;une conviction : les architectes méritent des outils à la
            hauteur de leur créativité. Nous construisons la plateforme que nous aurions
            aimé avoir quand nous exercions encore.
          </p>
        </div>
      </section>

      {/* ==================== STORY / TIMELINE ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              className="inline-flex items-center gap-2"
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
                border: '1px solid #DBEAFE',
              }}
            >
              <FolderKanban size={14} />
              Notre histoire
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
              De la frustration à la solution
            </h2>
            <p
              style={{
                fontSize: 18,
                color: '#6B7280',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Fondée en 2023 à Lyon par des architectes et des ingénieurs, ArchiPro est
              née d&apos;un constat simple : les outils de gestion existants ne sont pas
              adaptés au métier d&apos;architecte.
            </p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div
              className="hidden md:block"
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#E5E7EB',
                transform: 'translateX(-50%)',
              }}
            />

            <div className="flex flex-col gap-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6"
                  style={{
                    flexDirection: index % 2 === 0 ? undefined : undefined,
                  }}
                >
                  {/* Left side (or content on mobile) */}
                  <div
                    className="md:w-1/2"
                    style={{
                      textAlign: index % 2 === 0 ? 'right' : 'left',
                      order: index % 2 === 0 ? 1 : 3,
                      paddingRight: index % 2 === 0 ? 40 : 0,
                      paddingLeft: index % 2 === 0 ? 0 : 40,
                    }}
                  >
                    {index % 2 === 0 ? (
                      <>
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#111827',
                            marginBottom: 8,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: '#6B7280',
                          }}
                        >
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Center dot */}
                  <div
                    className="hidden md:flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 9999,
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 14,
                      flexShrink: 0,
                      order: 2,
                      zIndex: 1,
                      boxShadow: '0 0 0 6px #ffffff, 0 0 0 8px #E5E7EB',
                    }}
                  >
                    {item.year}
                  </div>

                  {/* Right side */}
                  <div
                    className="md:w-1/2"
                    style={{
                      textAlign: index % 2 === 0 ? 'left' : 'right',
                      order: index % 2 === 0 ? 3 : 1,
                      paddingLeft: index % 2 === 0 ? 40 : 0,
                      paddingRight: index % 2 === 0 ? 0 : 40,
                    }}
                  >
                    {index % 2 !== 0 ? (
                      <>
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#111827',
                            marginBottom: 8,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: '#6B7280',
                          }}
                        >
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Mobile year badge (visible only on small screens) */}
                  <div
                    className="md:hidden flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9999,
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                      order: 0,
                    }}
                  >
                    {item.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VALUES ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              className="inline-flex items-center gap-2"
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
                border: '1px solid #DBEAFE',
              }}
            >
              <Award size={14} />
              Nos valeurs
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
              Ce qui nous guide au quotidien
            </h2>
            <p
              style={{
                fontSize: 18,
                color: '#6B7280',
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Quatre principes fondamentaux qui orientent chacune de nos décisions
              produit et chaque interaction avec nos clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  style={{
                    padding: 32,
                    backgroundColor: '#ffffff',
                    border: '1px solid #F3F4F6',
                    borderRadius: 16,
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: v.bg,
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={26} style={{ color: v.color }} />
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 10,
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: '#6B7280',
                    }}
                  >
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== TEAM ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              className="inline-flex items-center gap-2"
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
                border: '1px solid #DBEAFE',
              }}
            >
              <Users size={14} />
              L&apos;équipe
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
              Les visages derrière ArchiPro
            </h2>
            <p
              style={{
                fontSize: 18,
                color: '#6B7280',
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Une équipe passionnée qui mêle expertise architecturale, savoir-faire
              technologique et sens du service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                style={{
                  padding: 32,
                  backgroundColor: '#ffffff',
                  border: '1px solid #F3F4F6',
                  borderRadius: 16,
                  textAlign: 'center',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 9999,
                    backgroundColor: member.color,
                    color: '#ffffff',
                    fontSize: 24,
                    fontWeight: 800,
                    margin: '0 auto 20px',
                    boxShadow: `0 8px 24px ${member.color}33`,
                  }}
                >
                  {member.initials}
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: 4,
                  }}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#2563EB',
                    marginBottom: 12,
                  }}
                >
                  {member.role}
                </p>

                {/* Bio */}
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: '#6B7280',
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NUMBERS ==================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#111827' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                marginBottom: 12,
              }}
            >
              ArchiPro en chiffres
            </h2>
            <p style={{ fontSize: 16, color: '#9CA3AF' }}>
              Des résultats concrets qui témoignent de la confiance de nos utilisateurs.
            </p>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            style={{ textAlign: 'center' }}
          >
            {metrics.map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 15, color: '#9CA3AF' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRESS / PARTNERS ==================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
              border: '1px solid #DBEAFE',
            }}
          >
            <Newspaper size={14} />
            Presse
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 12,
            }}
          >
            Ils parlent de nous
          </h2>
          <p
            style={{
              fontSize: 16,
              color: '#6B7280',
              marginBottom: 48,
              maxWidth: 480,
              margin: '0 auto 48px',
            }}
          >
            ArchiPro est reconnu par les médias de référence de l&apos;architecture et du
            bâtiment en France.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {pressLogos.map((press) => (
              <div
                key={press.name}
                className="flex items-center justify-center"
                style={{
                  padding: '16px 32px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  minWidth: 150,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#374151',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {press.abbrev}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    {press.name}
                  </div>
                </div>
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
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            Rejoignez l&apos;aventure ArchiPro
          </h2>
          <p
            style={{
              fontSize: 18,
              color: '#6B7280',
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Plus de 500 cabinets nous font déjà confiance. Essayez ArchiPro
            gratuitement pendant 14 jours, sans engagement et sans carte bancaire.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
              href="/contact"
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
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
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
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  CGV
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
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

        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            paddingTop: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            &copy; 2026 ArchiPro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
