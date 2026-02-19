'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Building2,
  Send,
  ChevronRight,
  Tag,
  TrendingUp,
  FileText,
  Lightbulb,
  BarChart3,
  Newspaper,
  Ruler,
} from 'lucide-react';

/* ─────────────────────── TYPES ─────────────────────── */

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  date: string;
  readTime: string;
  gradient: string;
  featured?: boolean;
}

/* ─────────────────────── DATA ─────────────────────── */

const categories = [
  { label: 'Tous', icon: null },
  { label: 'Guides', icon: BookOpen },
  { label: 'Tutoriels', icon: Lightbulb },
  { label: 'Actualités', icon: Newspaper },
  { label: 'Études de cas', icon: BarChart3 },
  { label: 'Productivité', icon: TrendingUp },
];

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string; iconBg: string }> = {
  'Guides': {
    bg: '#EFF6FF',
    text: '#2563EB',
    border: '#DBEAFE',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 40%, #60A5FA 100%)',
    iconBg: '#DBEAFE',
  },
  'Tutoriels': {
    bg: '#F5F3FF',
    text: '#7C3AED',
    border: '#E9D5FF',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 40%, #A78BFA 100%)',
    iconBg: '#EDE9FE',
  },
  'Actualités': {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 40%, #FBBF24 100%)',
    iconBg: '#FEF3C7',
  },
  'Études de cas': {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    gradient: 'linear-gradient(135deg, #065F46 0%, #059669 40%, #34D399 100%)',
    iconBg: '#D1FAE5',
  },
  'Productivité': {
    bg: '#FFF1F2',
    text: '#E11D48',
    border: '#FECDD3',
    gradient: 'linear-gradient(135deg, #9F1239 0%, #E11D48 40%, #FB7185 100%)',
    iconBg: '#FFE4E6',
  },
};

const articles: Article[] = [
  {
    id: 'optimiser-gestion-projets-architecture-2026',
    title: 'Comment optimiser la gestion de vos projets d\'architecture en 2026',
    excerpt: 'Découvrez les meilleures pratiques pour piloter vos projets de la phase Esquisse à la Livraison, avec des outils et méthodes éprouvés par les cabinets les plus performants de France.',
    category: 'Guides',
    author: 'Marie Dupont',
    authorInitials: 'MD',
    authorColor: '#2563EB',
    date: '14 février 2026',
    readTime: '12 min',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 40%, #60A5FA 100%)',
    featured: true,
  },
  {
    id: 'guide-complet-phases-projet-architectural',
    title: 'Guide complet : Les phases d\'un projet architectural (de l\'ESQ au DOE)',
    excerpt: 'Esquisse, APS, APD, PRO, DCE, ACT, DET, AOR... Maîtrisez chaque étape du projet architectural selon la loi MOP et optimisez vos livrables.',
    category: 'Guides',
    author: 'Thomas Bernard',
    authorInitials: 'TB',
    authorColor: '#059669',
    date: '10 février 2026',
    readTime: '15 min',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 40%, #60A5FA 100%)',
  },
  {
    id: '5-outils-indispensables-architectes-modernes',
    title: '5 outils indispensables pour les architectes modernes',
    excerpt: 'De la modélisation BIM à la gestion de chantier, notre sélection des outils numériques qui transforment le quotidien des agences d\'architecture.',
    category: 'Productivité',
    author: 'Sophie Martin',
    authorInitials: 'SM',
    authorColor: '#E11D48',
    date: '7 février 2026',
    readTime: '8 min',
    gradient: 'linear-gradient(135deg, #9F1239 0%, #E11D48 40%, #FB7185 100%)',
  },
  {
    id: 'etude-de-cas-renovation-hotel-particulier-parisien',
    title: 'Étude de cas : Rénovation d\'un hôtel particulier parisien du XVIIIe siècle',
    excerpt: 'Comment le cabinet Moreau & Associés a digitalisé le suivi de la rénovation complète d\'un hôtel particulier classé, avec extraction IFC et PV chantier automatisés.',
    category: 'Études de cas',
    author: 'Pierre Moreau',
    authorInitials: 'PM',
    authorColor: '#059669',
    date: '3 février 2026',
    readTime: '10 min',
    gradient: 'linear-gradient(135deg, #065F46 0%, #059669 40%, #34D399 100%)',
  },
  {
    id: 'facturation-architecte-erreurs-a-eviter',
    title: 'Facturation architecte : Les 7 erreurs les plus courantes à éviter',
    excerpt: 'Retenue de garantie oubliée, acomptes mal calculés, phases MOP mal facturées... Les pièges qui coûtent cher aux cabinets et comment les contourner.',
    category: 'Tutoriels',
    author: 'Claire Rousseau',
    authorInitials: 'CR',
    authorColor: '#7C3AED',
    date: '29 janvier 2026',
    readTime: '9 min',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 40%, #A78BFA 100%)',
  },
  {
    id: 're2020-changements-architectes-2026',
    title: 'RE2020 : Tout ce qui change pour les architectes en 2026',
    excerpt: 'Les nouvelles exigences du seuil carbone entrent en vigueur. Voici comment adapter vos projets neufs et anticiper les contrôles de conformité thermique.',
    category: 'Actualités',
    author: 'Antoine Leroy',
    authorInitials: 'AL',
    authorColor: '#B45309',
    date: '25 janvier 2026',
    readTime: '11 min',
    gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 40%, #FBBF24 100%)',
  },
  {
    id: 'tutoriel-creer-bordereau-untec-automatiquement',
    title: 'Tutoriel : Créer un bordereau UNTEC automatiquement depuis vos plans',
    excerpt: 'Pas à pas, découvrez comment extraire vos métrés depuis un fichier IFC ou un plan PDF et générer un bordereau conforme en quelques minutes.',
    category: 'Tutoriels',
    author: 'Julie Lambert',
    authorInitials: 'JL',
    authorColor: '#7C3AED',
    date: '20 janvier 2026',
    readTime: '7 min',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 40%, #A78BFA 100%)',
  },
  {
    id: 'etude-de-cas-agence-10-salaries-gain-productivite',
    title: 'Étude de cas : Comment une agence de 10 salariés a gagné 15h par semaine',
    excerpt: 'L\'agence Fontaine Architecture a automatisé ses DCE, ses PV de chantier et sa facturation MOP. Retour d\'expérience détaillé avec chiffres concrets.',
    category: 'Études de cas',
    author: 'Marc Dubois',
    authorInitials: 'MDu',
    authorColor: '#059669',
    date: '15 janvier 2026',
    readTime: '13 min',
    gradient: 'linear-gradient(135deg, #065F46 0%, #059669 40%, #34D399 100%)',
  },
  {
    id: 'automatiser-pv-chantier-guide-pratique',
    title: 'Automatiser vos PV de chantier : guide pratique pour architectes',
    excerpt: 'Photos géolocalisées, annotations sur plan, signatures électroniques et archivage conforme. Comment passer du Word manuel au PV automatisé.',
    category: 'Productivité',
    author: 'Lucas Petit',
    authorInitials: 'LP',
    authorColor: '#E11D48',
    date: '10 janvier 2026',
    readTime: '8 min',
    gradient: 'linear-gradient(135deg, #9F1239 0%, #E11D48 40%, #FB7185 100%)',
  },
  {
    id: 'intelligence-artificielle-architecture-2026',
    title: 'L\'IA au service de l\'architecture : état des lieux et perspectives 2026',
    excerpt: 'Extraction de métrés, génération de CCTP, analyse des offres... Comment l\'intelligence artificielle transforme concrètement le métier d\'architecte.',
    category: 'Actualités',
    author: 'Léa Bernard',
    authorInitials: 'LB',
    authorColor: '#B45309',
    date: '5 janvier 2026',
    readTime: '10 min',
    gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 40%, #FBBF24 100%)',
  },
];

/* ─────────────────────── HELPER ─────────────────────── */

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Guides': return BookOpen;
    case 'Tutoriels': return Lightbulb;
    case 'Actualités': return Newspaper;
    case 'Études de cas': return BarChart3;
    case 'Productivité': return TrendingUp;
    default: return FileText;
  }
};

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [subscribeHover, setSubscribeHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'Tous' || article.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const gridArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

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
                  color: item.href === '/blog' ? '#2563EB' : hoveredNav === item.href ? '#111827' : '#6B7280',
                  textDecoration: 'none',
                  fontWeight: item.href === '/blog' ? 600 : 500,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={() => setHoveredNav(item.href)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block"
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
          background: 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFF 50%, #FFFFFF 100%)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              backgroundColor: '#ffffff',
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 32,
              border: '1px solid #DBEAFE',
              boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
            }}
          >
            <BookOpen size={14} />
            Blog &amp; Ressources
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 20,
            }}
          >
            Blog &amp; Ressources
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
            Conseils, guides et actualités pour les architectes.
            Optimisez votre pratique avec nos ressources dédiées au métier.
          </p>

          {/* Search Bar */}
          <div
            className="flex items-center"
            style={{
              maxWidth: 560,
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              padding: '4px 4px 4px 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            <Search size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '12px',
                fontSize: 15,
                color: '#111827',
                backgroundColor: 'transparent',
              }}
            />
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563EB',
                color: '#ffffff',
                borderRadius: 8,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY FILTER PILLS ==================== */}
      <section style={{ padding: '0 24px 48px', backgroundColor: '#ffffff' }}>
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          style={{ maxWidth: 900, margin: '0 auto' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            const isHovered = hoveredCategory === cat.label;
            const catStyle = cat.label !== 'Tous' ? categoryColors[cat.label] : null;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                onMouseEnter={() => setHoveredCategory(cat.label)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="flex items-center gap-2"
                style={{
                  padding: '8px 20px',
                  borderRadius: 9999,
                  border: isActive
                    ? `2px solid ${catStyle?.text || '#2563EB'}`
                    : isHovered
                      ? `1px solid ${catStyle?.border || '#D1D5DB'}`
                      : '1px solid #E5E7EB',
                  backgroundColor: isActive
                    ? catStyle?.text || '#2563EB'
                    : isHovered
                      ? catStyle?.bg || '#F9FAFB'
                      : '#ffffff',
                  color: isActive
                    ? '#ffffff'
                    : isHovered && catStyle
                      ? catStyle.text
                      : '#374151',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {CatIcon && <CatIcon size={14} />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== FEATURED ARTICLE ==================== */}
      {featuredArticle && (
        <section style={{ padding: '0 24px 64px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-0"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              {/* Image placeholder */}
              <div
                className="flex items-end"
                style={{
                  background: featuredArticle.gradient,
                  minHeight: 340,
                  padding: 40,
                  position: 'relative',
                }}
              >
                {/* Decorative elements */}
                <div
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    width: 120,
                    height: 120,
                    borderRadius: 9999,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 60,
                    right: 60,
                    width: 80,
                    height: 80,
                    borderRadius: 9999,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 160,
                    height: 160,
                    borderRadius: 9999,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                />

                <div className="flex flex-col gap-4" style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Ruler size={32} style={{ color: '#ffffff' }} />
                  </div>
                  <div>
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Article vedette
                    </span>
                    <div
                      style={{
                        color: '#ffffff',
                        fontSize: 14,
                        fontWeight: 500,
                        marginTop: 4,
                        opacity: 0.9,
                      }}
                    >
                      {featuredArticle.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="flex flex-col justify-center"
                style={{ padding: '40px 40px', backgroundColor: '#ffffff' }}
              >
                <div
                  className="inline-flex items-center gap-1"
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    backgroundColor: categoryColors[featuredArticle.category]?.bg || '#EFF6FF',
                    color: categoryColors[featuredArticle.category]?.text || '#2563EB',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 16,
                    alignSelf: 'flex-start',
                    border: `1px solid ${categoryColors[featuredArticle.category]?.border || '#DBEAFE'}`,
                  }}
                >
                  <Tag size={11} />
                  {featuredArticle.category}
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    marginBottom: 16,
                  }}
                >
                  {featuredArticle.title}
                </h2>

                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: '#6B7280',
                    marginBottom: 24,
                  }}
                >
                  {featuredArticle.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4" style={{ marginBottom: 28 }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9999,
                        backgroundColor: featuredArticle.authorColor,
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {featuredArticle.authorInitials}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                      {featuredArticle.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{featuredArticle.readTime} de lecture</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredArticle.id}`}
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563EB',
                    color: '#ffffff',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                  }}
                >
                  Lire l&apos;article
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== ARTICLES GRID ==================== */}
      <section style={{ padding: '0 24px 96px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
              {activeCategory === 'Tous' ? 'Tous les articles' : activeCategory}
            </h2>
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>
              {gridArticles.length} article{gridArticles.length !== 1 ? 's' : ''}
            </span>
          </div>

          {gridArticles.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center"
              style={{
                padding: '80px 24px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                borderRadius: 16,
                border: '1px solid #F3F4F6',
              }}
            >
              <Search size={40} style={{ color: '#D1D5DB', marginBottom: 16 }} />
              <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 4 }}>
                Aucun article trouvé
              </p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>
                Essayez une autre recherche ou une catégorie différente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => {
                const isHovered = hoveredCard === article.id;
                const catColor = categoryColors[article.category];
                const CategoryIcon = getCategoryIcon(article.category);
                return (
                  <Link
                    key={article.id}
                    href={`/blog/${article.id}`}
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={() => setHoveredCard(article.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <article
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        border: isHovered ? `1px solid ${catColor?.border || '#D1D5DB'}` : '1px solid #E5E7EB',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease',
                        boxShadow: isHovered
                          ? '0 16px 48px rgba(0,0,0,0.1)'
                          : '0 1px 4px rgba(0,0,0,0.03)',
                        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                        height: '100%',
                      }}
                    >
                      {/* Image placeholder */}
                      <div
                        className="flex items-center justify-center"
                        style={{
                          background: article.gradient,
                          height: 180,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Decorative circle */}
                        <div
                          style={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 100,
                            height: 100,
                            borderRadius: 9999,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: -20,
                            left: -20,
                            width: 80,
                            height: 80,
                            borderRadius: 9999,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                          }}
                        />

                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            transition: 'transform 0.3s',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                          }}
                        >
                          <CategoryIcon size={28} style={{ color: '#ffffff' }} />
                        </div>

                        {/* Category badge on image */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            padding: '4px 10px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            color: catColor?.text || '#2563EB',
                            fontSize: 11,
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {article.category}
                        </div>

                        {/* Reading time badge */}
                        <div
                          className="flex items-center gap-1"
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            padding: '4px 8px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <Clock size={10} style={{ color: '#ffffff' }} />
                          <span style={{ fontSize: 11, color: '#ffffff', fontWeight: 500 }}>
                            {article.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: '20px 20px 24px' }}>
                        <h3
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: '#111827',
                            lineHeight: 1.4,
                            marginBottom: 8,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {article.title}
                        </h3>

                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: '#6B7280',
                            marginBottom: 16,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {article.excerpt}
                        </p>

                        {/* Author + Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex items-center justify-center"
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 9999,
                                backgroundColor: article.authorColor,
                                color: '#ffffff',
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {article.authorInitials}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                              {article.author}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar size={12} style={{ color: '#9CA3AF' }} />
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                              {article.date.split(' ').slice(0, 2).join(' ')}
                            </span>
                          </div>
                        </div>

                        {/* Read more indicator */}
                        <div
                          className="flex items-center gap-1"
                          style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid #F3F4F6',
                            color: isHovered ? catColor?.text || '#2563EB' : '#9CA3AF',
                            fontSize: 13,
                            fontWeight: 600,
                            transition: 'color 0.2s',
                          }}
                        >
                          Lire la suite
                          <ChevronRight
                            size={14}
                            style={{
                              transition: 'transform 0.2s',
                              transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                            }}
                          />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ==================== NEWSLETTER CTA ==================== */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, #F0F5FF 0%, #EFF6FF 100%)',
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{ marginBottom: 24 }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: '#2563EB',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              }}
            >
              <Send size={24} />
            </div>
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
            Restez informé
          </h2>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: '#6B7280',
              marginBottom: 32,
              maxWidth: 480,
              margin: '0 auto 32px',
            }}
          >
            Recevez nos derniers articles, guides pratiques et actualités
            réglementaires directement dans votre boîte mail. Un email par semaine, pas plus.
          </p>

          <div
            className="flex flex-col sm:flex-row items-stretch gap-3"
            style={{
              maxWidth: 480,
              margin: '0 auto 16px',
            }}
          >
            <input
              type="email"
              placeholder="votre@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid #D1D5DB',
                fontSize: 15,
                color: '#111827',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            />
            <button
              onMouseEnter={() => setSubscribeHover(true)}
              onMouseLeave={() => setSubscribeHover(false)}
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: subscribeHover ? '#1d4ed8' : '#2563EB',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
              }}
            >
              S&apos;abonner
            </button>
          </div>

          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            Pas de spam. Désabonnement en un clic.
          </p>
        </div>
      </section>

      {/* ==================== SECONDARY CTA ==================== */}
      <section
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              marginBottom: 16,
            }}
          >
            Prêt à moderniser votre cabinet ?
          </h2>
          <p style={{ fontSize: 17, color: '#6B7280', marginBottom: 36, lineHeight: 1.7 }}>
            Rejoignez les 500+ cabinets d&apos;architecture qui gèrent leurs projets,
            métrés, DCE et factures avec ArchiPro.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2"
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              padding: '16px 36px',
              backgroundColor: ctaHover ? '#1d4ed8' : '#2563EB',
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
                <Link href="/features" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/login" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
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
                <Link href="/blog" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
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
                <Link href="/legal" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/legal" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/legal" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}>
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
