import Link from 'next/link';
import {
  FolderKanban,
  Users,
  FileText,
  Files,
  LayoutGrid,
  MessageSquare,
  ArrowRight,
  Check,
  Building2,
} from 'lucide-react';

const features = [
  {
    icon: FolderKanban,
    title: 'Gestion de projets',
    description:
      'Suivez chaque phase de vos projets, de l\'esquisse à la livraison. 12 phases architecturales intégrées.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Users,
    title: 'CRM Clients',
    description:
      'Centralisez vos contacts, historique et communications. Particuliers, professionnels et marchés publics.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: FileText,
    title: 'Devis et Factures',
    description:
      'Créez des devis professionnels et générez vos factures en un clic. Suivi des paiements automatisé.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Files,
    title: 'Documents',
    description:
      'Organisez vos plans, rendus 3D, contrats et permis. Versioning et partage sécurisé.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: LayoutGrid,
    title: 'Vue Kanban',
    description:
      'Visualisez l\'avancement de tous vos projets sur un tableau kanban par phase architecturale.',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    icon: MessageSquare,
    title: 'Collaboration',
    description:
      'Travaillez en équipe avec des commentaires, notifications et suivi d\'activité en temps réel.',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
];

const stats = [
  { value: '500+', label: 'Cabinets d\'architecture' },
  { value: '12 000+', label: 'Projets gérés' },
  { value: '98%', label: 'Satisfaction client' },
  { value: '45min', label: 'Gagnées par jour' },
];

const steps = [
  {
    number: '1',
    title: 'Créez votre compte',
    description: 'Inscription gratuite, sans carte bancaire.',
  },
  {
    number: '2',
    title: 'Configurez votre cabinet',
    description: 'Importez vos projets et clients existants.',
  },
  {
    number: '3',
    title: 'Gérez tout depuis un seul espace',
    description: 'Projets, devis, factures, documents.',
  },
];

const plans = [
  {
    name: 'Solo',
    price: '29',
    period: '/mois',
    description: 'Pour les architectes indépendants',
    popular: false,
    features: ['1 utilisateur', '10 projets actifs', 'Devis & Factures', 'Support email'],
  },
  {
    name: 'Cabinet',
    price: '79',
    period: '/mois',
    description: 'Pour les cabinets en croissance',
    popular: true,
    features: [
      '5 utilisateurs',
      'Projets illimités',
      'Collaboration équipe',
      'Support prioritaire',
    ],
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    period: '',
    description: 'Pour les grandes structures',
    popular: false,
    features: [
      'Utilisateurs illimités',
      'Accès API',
      'SSO / SAML',
      'Account manager dédié',
    ],
  },
];

export default function LandingPage() {
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
            <Link href="/features" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
              Fonctionnalités
            </Link>
            <Link href="/pricing" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
              Tarifs
            </Link>
            <Link href="/contact" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
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
            Conçu par des architectes, pour des architectes
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 24,
            }}
          >
            La plateforme tout-en-un
            <br />
            <span style={{ color: '#2563EB' }}>pour les architectes</span>
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
            Gérez vos projets, clients, devis et factures depuis un seul espace.
            Conçu par des architectes, pour des architectes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ marginBottom: 48 }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 32px',
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
              href="/login"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 32px',
                backgroundColor: '#ffffff',
                color: '#374151',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                border: '1px solid #D1D5DB',
              }}
            >
              Voir la démo
            </Link>
          </div>

          <p style={{ fontSize: 14, color: '#9CA3AF' }}>
            Utilisé par plus de 500 cabinets d&apos;architecture en France
          </p>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 560, margin: '0 auto' }}>
              Des outils puissants pour gérer chaque aspect de votre cabinet d&apos;architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
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
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: f.bg,
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#6B7280' }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section style={{ padding: '80px 24px', backgroundColor: '#111827' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 15, color: '#9CA3AF' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Prêt en 3 minutes
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280' }}>
              Commencez à utiliser ArchiPro en quelques étapes simples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} style={{ textAlign: 'center' }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 9999,
                    backgroundColor: '#2563EB',
                    color: '#ffffff',
                    fontSize: 22,
                    fontWeight: 800,
                    margin: '0 auto 20px',
                  }}
                >
                  {step.number}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#6B7280' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section id="pricing" style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Des tarifs simples et transparents
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
              Choisissez le plan adapté à la taille de votre cabinet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                style={{
                  padding: 40,
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  border: plan.popular ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  boxShadow: plan.popular
                    ? '0 8px 30px rgba(37,99,235,0.12)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 20px',
                      backgroundColor: '#2563EB',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      borderRadius: 9999,
                    }}
                  >
                    Populaire
                  </div>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1" style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: plan.price === 'Sur mesure' ? 28 : 48, fontWeight: 800, color: '#111827' }}>
                    {plan.price === 'Sur mesure' ? plan.price : `${plan.price} \u20AC`}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 16, color: '#9CA3AF' }}>{plan.period}</span>
                  )}
                </div>

                <ul className="flex flex-col gap-3" style={{ marginBottom: 32, listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <Check size={18} style={{ color: '#059669', flexShrink: 0 }} />
                      <span style={{ fontSize: 15, color: '#374151' }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price === 'Sur mesure' ? '/contact' : '/register'}
                  className="flex items-center justify-center"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    backgroundColor: plan.popular ? '#2563EB' : '#ffffff',
                    color: plan.popular ? '#ffffff' : '#374151',
                    border: plan.popular ? 'none' : '1px solid #D1D5DB',
                  }}
                >
                  {plan.price === 'Sur mesure' ? 'Nous contacter' : 'Commencer'}
                </Link>
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
            Prêt à simplifier la gestion de votre cabinet ?
          </h2>
          <p style={{ fontSize: 18, color: '#6B7280', marginBottom: 40 }}>
            Rejoignez les 500+ cabinets qui font confiance à ArchiPro.
          </p>
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
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer id="contact" style={{ padding: '64px 24px 32px', backgroundColor: '#111827' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
          style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 48, borderBottom: '1px solid #1F2937' }}
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
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Produit
            </h4>
            <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link href="/features" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Fonctionnalités</Link></li>
              <li><Link href="/pricing" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Tarifs</Link></li>
              <li><Link href="/login" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Démo</Link></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Ressources
            </h4>
            <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>API</a></li>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Légal
            </h4>
            <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Mentions légales</a></li>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>CGV</a></li>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Confidentialité</a></li>
              <li><a href="#" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>Cookies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Contact
            </h4>
            <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="mailto:contact@archipro.fr" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>contact@archipro.fr</a></li>
              <li><span style={{ fontSize: 14, color: '#9CA3AF' }}>Lyon, France</span></li>
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
