'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  PlayCircle,
  Sparkles,
  Headphones,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  Zap,
  Send,
  HelpCircle,
  FolderKanban,
  CreditCard,
  FileText,
  Users,
  UserCog,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

type FAQCategory = 'all' | 'projets' | 'facturation' | 'documents' | 'equipe' | 'compte';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  bgHover: string;
}

interface CategoryPill {
  key: FAQCategory;
  label: string;
  icon: React.ElementType;
}

// ============================================
// Mock Data
// ============================================

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Guide de démarrage',
    description: 'Commencez à utiliser ArchiPro en 5 minutes',
    icon: BookOpen,
    color: '#2563EB',
    bgLight: '#EFF6FF',
    bgHover: '#DBEAFE',
  },
  {
    title: 'Tutoriels vidéo',
    description: 'Apprenez avec nos vidéos pas à pas',
    icon: PlayCircle,
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    bgHover: '#EDE9FE',
  },
  {
    title: 'Nouveautés',
    description: 'Découvrez les dernières fonctionnalités',
    icon: Sparkles,
    color: '#059669',
    bgLight: '#ECFDF5',
    bgHover: '#D1FAE5',
  },
  {
    title: 'Contacter le support',
    description: 'Notre équipe est là pour vous aider',
    icon: Headphones,
    color: '#EA580C',
    bgLight: '#FFF7ED',
    bgHover: '#FFEDD5',
  },
];

const CATEGORY_PILLS: CategoryPill[] = [
  { key: 'all', label: 'Tout', icon: HelpCircle },
  { key: 'projets', label: 'Projets', icon: FolderKanban },
  { key: 'facturation', label: 'Facturation', icon: CreditCard },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'equipe', label: 'Équipe', icon: Users },
  { key: 'compte', label: 'Compte', icon: UserCog },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'projets',
    question: 'Comment créer un nouveau projet ?',
    answer:
      'Pour créer un nouveau projet, rendez-vous dans la section "Projets" depuis le menu latéral, puis cliquez sur le bouton "Nouveau projet" en haut à droite. Remplissez les informations du client (nom, adresse, contact), sélectionnez la phase initiale du projet (Esquisse, APS, APD, etc.), définissez le budget prévisionnel et la surface en m². Vous pouvez également ajouter une description détaillée, les dates de début et de fin prévisionnelles, ainsi que l\'adresse du chantier. Une fois validé, votre projet apparaîtra dans votre tableau de bord avec un numéro de référence unique.',
  },
  {
    id: 'faq-2',
    category: 'projets',
    question: 'Comment gérer les phases d\'un projet ?',
    answer:
      'ArchiPro intègre les 12 phases architecturales standard de la loi MOP : Esquisse (ESQ), Avant-Projet Sommaire (APS), Avant-Projet Détaillé (APD), Projet (PRO), Dossier de Consultation des Entreprises (DCE), Assistance aux Contrats de Travaux (ACT), VISA, Direction de l\'Exécution des Travaux (DET), Assistance aux Opérations de Réception (AOR), et Réception. Pour changer la phase d\'un projet, ouvrez la fiche projet et utilisez le sélecteur de phase. Chaque transition est enregistrée dans l\'historique du projet avec la date et l\'auteur de la modification.',
  },
  {
    id: 'faq-3',
    category: 'projets',
    question: 'Comment partager un projet avec un collaborateur ?',
    answer:
      'Pour partager un projet, ouvrez la fiche du projet concerné et accédez à l\'onglet "Équipe". Cliquez sur "Inviter un membre", saisissez l\'adresse email du collaborateur et sélectionnez son rôle (Architecte, Collaborateur ou Lecteur). Le collaborateur recevra un email d\'invitation avec un lien d\'accès. S\'il n\'a pas encore de compte ArchiPro, il pourra en créer un gratuitement. Vous pouvez gérer les permissions de chaque membre à tout moment depuis cet onglet.',
  },
  {
    id: 'faq-4',
    category: 'facturation',
    question: 'Comment créer et envoyer une facture ?',
    answer:
      'Rendez-vous dans la section "Factures" et cliquez sur "Nouvelle facture". Sélectionnez le projet et le client associés, puis ajoutez les lignes de facturation avec la description, la quantité et le prix unitaire. ArchiPro calcule automatiquement les montants HT, la TVA (20% par défaut, modifiable) et le TTC. Vous pouvez personnaliser les conditions de paiement et ajouter des notes. Une fois la facture validée, envoyez-la directement par email depuis ArchiPro. Le client recevra un PDF professionnel avec votre logo et vos coordonnées.',
  },
  {
    id: 'faq-5',
    category: 'facturation',
    question: 'Quels sont les modes de paiement acceptés ?',
    answer:
      'ArchiPro vous permet de proposer plusieurs modes de paiement à vos clients : le virement bancaire (avec affichage automatique de votre RIB sur la facture), le paiement par carte bancaire via notre partenaire Stripe (commission de 1.4% + 0.25€ par transaction), et le chèque. Vous pouvez configurer vos préférences de paiement par défaut dans les Paramètres > Facturation. Pour chaque facture, vous pouvez activer ou désactiver les modes de paiement proposés individuellement.',
  },
  {
    id: 'faq-6',
    category: 'facturation',
    question: 'Comment suivre les paiements en retard ?',
    answer:
      'Le tableau de bord affiche en permanence le nombre de factures en attente et le montant total dû. Pour un suivi détaillé, accédez à la section "Factures" et filtrez par statut "En retard". ArchiPro envoie automatiquement des rappels par email aux clients dont la facture dépasse la date d\'échéance (configurable dans Paramètres > Notifications). Vous pouvez également consulter les rapports financiers dans la section "Rapports" pour analyser les délais de paiement moyens, le taux de recouvrement et l\'évolution de votre trésorerie.',
  },
  {
    id: 'faq-7',
    category: 'documents',
    question: 'Quels formats de fichiers sont supportés ?',
    answer:
      'ArchiPro supporte un large éventail de formats adaptés au métier d\'architecte : les documents (PDF, DOC, DOCX, XLS, XLSX), les plans et dessins techniques (DWG, DXF, IFC, RVT), les images (JPG, JPEG, PNG, TIFF, SVG, WEBP), les fichiers de présentation (PPT, PPTX) et les archives (ZIP, RAR). La taille maximale par fichier est de 500 Mo. Pour les fichiers IFC et DWG, une prévisualisation 3D est disponible directement dans le navigateur. Les fichiers PDF sont indexés pour la recherche en texte intégral.',
  },
  {
    id: 'faq-8',
    category: 'documents',
    question: 'Comment organiser mes documents par projet ?',
    answer:
      'Chaque projet dispose d\'un espace de stockage structuré avec une arborescence prédéfinie : Plans (ESQ, APS, APD, PRO, EXE), Documents administratifs (PC, AT, assurances), Photos (chantier, existant), Correspondance et Divers. Vous pouvez personnaliser cette arborescence dans les paramètres du projet. Utilisez le glisser-déposer pour importer des fichiers et les organiser dans les dossiers. La recherche globale permet de retrouver n\'importe quel document par nom, contenu ou métadonnées. Le versionnage automatique conserve l\'historique de chaque fichier modifié.',
  },
  {
    id: 'faq-9',
    category: 'equipe',
    question: 'Comment inviter un membre de mon équipe ?',
    answer:
      'Pour inviter un nouveau membre, accédez aux Paramètres > Équipe et cliquez sur "Inviter un membre". Saisissez son adresse email professionnelle et sélectionnez le rôle approprié (Administrateur, Architecte ou Collaborateur). Un email d\'invitation sera envoyé avec un lien sécurisé valable 7 jours. Le nouveau membre pourra créer son mot de passe et accéder immédiatement à l\'espace de travail. Vous pouvez inviter jusqu\'à 15 membres avec le plan Pro, et un nombre illimité avec le plan Entreprise.',
  },
  {
    id: 'faq-10',
    category: 'equipe',
    question: 'Quels sont les différents rôles disponibles ?',
    answer:
      'ArchiPro propose trois niveaux de rôles avec des permissions distinctes :\n\n• Administrateur : accès complet à toutes les fonctionnalités, gestion des membres, paramètres de facturation, suppression de projets et données, gestion de l\'abonnement.\n\n• Architecte : création et gestion des projets, accès aux documents et à la facturation, modification des fiches clients, export des données. Ne peut pas gérer les membres ni modifier les paramètres de l\'agence.\n\n• Collaborateur : consultation et contribution aux projets assignés, import de documents, ajout de commentaires. Ne peut pas créer de projets ni accéder à la facturation.',
  },
];

const SUPPORT_SUBJECTS = [
  'Question technique',
  'Bug',
  'Suggestion',
  'Facturation',
  'Autre',
];

// ============================================
// Sub-component: QuickActionCard
// ============================================

function QuickActionCard({ action }: { action: QuickAction }) {
  const [hovered, setHovered] = useState(false);
  const Icon = action.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hovered
          ? '0 8px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: hovered ? action.bgHover : action.bgLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Icon
          style={{
            width: '24px',
            height: '24px',
            color: action.color,
          }}
        />
      </div>
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '6px',
        }}
      >
        {action.title}
      </h3>
      <p
        style={{
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: 1.5,
        }}
      >
        {action.description}
      </p>
      <div
        className="flex items-center gap-1"
        style={{
          marginTop: '14px',
          fontSize: '13px',
          fontWeight: 500,
          color: action.color,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <span>En savoir plus</span>
        <ExternalLink style={{ width: '13px', height: '13px' }} />
      </div>
    </div>
  );
}

// ============================================
// Sub-component: FAQAccordionItem
// ============================================

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const categoryMeta = CATEGORY_PILLS.find((c) => c.key === item.category);

  return (
    <div
      style={{
        backgroundColor: isOpen ? '#FAFBFF' : '#ffffff',
        border: isOpen ? '1px solid #DBEAFE' : '1px solid #e5e7eb',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full"
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          textAlign: 'left',
          border: 'none',
          outline: 'none',
        }}
      >
        <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
          {categoryMeta && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              {categoryMeta.label}
            </span>
          )}
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: isOpen ? '#1d4ed8' : '#111827',
              transition: 'color 0.2s ease',
            }}
          >
            {item.question}
          </span>
        </div>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: isOpen ? '#DBEAFE' : '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: '12px',
            transition: 'all 0.2s ease',
          }}
        >
          <ChevronDown
            style={{
              width: '16px',
              height: '16px',
              color: isOpen ? '#2563EB' : '#6b7280',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease, color 0.2s ease',
            }}
          />
        </div>
      </button>

      <div
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}
      >
        <div
          style={{
            padding: '0 20px 18px 20px',
            fontSize: '13.5px',
            lineHeight: 1.7,
            color: '#4b5563',
            whiteSpace: 'pre-line',
          }}
        >
          {item.answer}
        </div>
        <div
          className="flex items-center gap-4"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
          }}
        >
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            Cette réponse vous a-t-elle aidé ?
          </span>
          <div className="flex items-center gap-2">
            <button
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#059669',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '6px',
                padding: '4px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D1FAE5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ECFDF5';
              }}
            >
              Oui
            </button>
            <button
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                padding: '4px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEE2E2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
              }}
            >
              Non
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openFAQId, setOpenFAQId] = useState<string | null>(null);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Filter FAQ items
  const filteredFAQs = useMemo(() => {
    let items = FAQ_ITEMS;

    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Handle FAQ toggle
  const handleToggleFAQ = (id: string) => {
    setOpenFAQId((prev) => (prev === id ? null : id));
  };

  // Handle contact form submission
  const handleSendMessage = () => {
    if (!contactSubject || !contactMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactSubject('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* ============================== */}
      {/* Hero Section                   */}
      {/* ============================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
          borderRadius: '16px',
          padding: '48px 40px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '20%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '-30px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HelpCircle
                style={{
                  width: '22px',
                  height: '22px',
                  color: '#ffffff',
                }}
              />
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Centre d'aide
            </h1>
          </div>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '28px',
              maxWidth: '480px',
              lineHeight: 1.5,
            }}
          >
            Trouvez rapidement des réponses à vos questions
          </p>

          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '600px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <Search
                style={{
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af',
                }}
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans l'aide..."
              style={{
                width: '100%',
                height: '52px',
                paddingLeft: '48px',
                paddingRight: '16px',
                fontSize: '15px',
                color: '#111827',
                backgroundColor: '#ffffff',
                border: '2px solid transparent',
                borderRadius: '12px',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#93C5FD';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15), 0 0 0 3px rgba(59,130,246,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* Quick Actions                  */}
      {/* ============================== */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        style={{ marginBottom: '40px' }}
      >
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.title} action={action} />
        ))}
      </div>

      {/* ============================== */}
      {/* FAQ Section                    */}
      {/* ============================== */}
      <div style={{ marginBottom: '40px' }}>
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle
                style={{ width: '18px', height: '18px', color: '#D97706' }}
              />
            </div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              Questions fréquentes
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            {filteredFAQs.length} résultat{filteredFAQs.length > 1 ? 's' : ''}
            {searchQuery && (
              <span>
                {' '}pour « <strong style={{ color: '#374151' }}>{searchQuery}</strong> »
              </span>
            )}
          </p>
        </div>

        {/* Category Pills */}
        <div
          className="flex flex-wrap gap-2"
          style={{ marginBottom: '20px' }}
        >
          {CATEGORY_PILLS.map((pill) => {
            const isActive = activeCategory === pill.key;
            const Icon = pill.icon;
            return (
              <button
                key={pill.key}
                onClick={() => {
                  setActiveCategory(pill.key);
                  setOpenFAQId(null);
                }}
                className="flex items-center gap-1.5"
                style={{
                  padding: '7px 14px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#4b5563',
                  backgroundColor: isActive ? '#2563EB' : '#ffffff',
                  border: isActive ? '1px solid #2563EB' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(37,99,235,0.25)'
                    : '0 1px 2px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <Icon
                  style={{
                    width: '14px',
                    height: '14px',
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => (
              <FAQAccordionItem
                key={item.id}
                item={item}
                isOpen={openFAQId === item.id}
                onToggle={() => handleToggleFAQ(item.id)}
              />
            ))
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Search style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
              </div>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Aucun résultat trouvé
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                Essayez avec d'autres mots-clés ou contactez notre support
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================== */}
      {/* Contact Support Section        */}
      {/* ============================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6',
            backgroundColor: '#fafbfc',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Headphones
                style={{ width: '18px', height: '18px', color: '#EA580C' }}
              />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Contacter le support
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                Vous ne trouvez pas votre réponse ? Écrivez-nous directement.
              </p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left: Contact Form (3 cols) */}
          <div
            className="lg:col-span-3"
            style={{
              padding: '28px 24px',
              borderRight: 'none',
            }}
          >
            {messageSent ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Send
                    style={{
                      width: '24px',
                      height: '24px',
                      color: '#059669',
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#059669',
                    marginBottom: '6px',
                  }}
                >
                  Message envoyé !
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Subject */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Sujet
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 40px 0 14px',
                        fontSize: '14px',
                        color: contactSubject ? '#111827' : '#9ca3af',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#93C5FD';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="" disabled>
                        Sélectionnez un sujet
                      </option>
                      {SUPPORT_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: '#9ca3af',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Décrivez votre problème ou question en détail..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#111827',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#93C5FD';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginTop: '6px',
                    }}
                  >
                    {contactMessage.length} / 2000 caractères
                  </p>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!contactSubject || !contactMessage.trim()}
                    className="flex items-center gap-2"
                    style={{
                      height: '44px',
                      padding: '0 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor:
                        !contactSubject || !contactMessage.trim()
                          ? '#93C5FD'
                          : '#2563EB',
                      border: 'none',
                      borderRadius: '10px',
                      cursor:
                        !contactSubject || !contactMessage.trim()
                          ? 'not-allowed'
                          : 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow:
                        !contactSubject || !contactMessage.trim()
                          ? 'none'
                          : '0 2px 8px rgba(37,99,235,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (contactSubject && contactMessage.trim()) {
                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (contactSubject && contactMessage.trim()) {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }
                    }}
                  >
                    <Send style={{ width: '16px', height: '16px' }} />
                    <span>Envoyer le message</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Info (2 cols) */}
          <div
            className="lg:col-span-2"
            style={{
              padding: '28px 24px',
              backgroundColor: '#FAFBFC',
              borderTop: '1px solid #f3f4f6',
              borderLeft: 'none',
            }}
          >
            <style>{`
              @media (min-width: 1024px) {
                .contact-info-panel {
                  border-top: none !important;
                  border-left: 1px solid #f3f4f6 !important;
                }
              }
            `}</style>
            <div
              className="contact-info-panel flex flex-col gap-6"
              style={{
                borderTop: 'inherit',
                borderLeft: 'inherit',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Coordonnées
                </h3>
                <div className="flex flex-col gap-5">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail
                        style={{
                          width: '17px',
                          height: '17px',
                          color: '#2563EB',
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#9ca3af',
                          marginBottom: '2px',
                        }}
                      >
                        Email
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        support@archipro.fr
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone
                        style={{
                          width: '17px',
                          height: '17px',
                          color: '#059669',
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#9ca3af',
                          marginBottom: '2px',
                        }}
                      >
                        Téléphone
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        01 23 45 67 89
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#F5F3FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Clock
                        style={{
                          width: '17px',
                          height: '17px',
                          color: '#7C3AED',
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#9ca3af',
                          marginBottom: '2px',
                        }}
                      >
                        Horaires
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        Lun - Ven, 9h - 18h
                      </p>
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF3C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Zap
                        style={{
                          width: '17px',
                          height: '17px',
                          color: '#D97706',
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#9ca3af',
                          marginBottom: '2px',
                        }}
                      >
                        Temps de réponse moyen
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#059669',
                        }}
                      >
                        {'< 2 heures'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support status */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#22C55E',
                      boxShadow: '0 0 6px rgba(34,197,94,0.4)',
                    }}
                  />
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#059669',
                    }}
                  >
                    Support en ligne
                  </p>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  Notre équipe est actuellement disponible pour répondre à vos questions.
                </p>
              </div>

              {/* Useful links */}
              <div>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#6b7280',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Liens utiles
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Documentation API', icon: FileText },
                    { label: 'Changelog', icon: Sparkles },
                    { label: 'Statut des services', icon: Zap },
                  ].map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <button
                        key={link.label}
                        className="flex items-center gap-2"
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <LinkIcon
                          style={{
                            width: '14px',
                            height: '14px',
                            color: '#6b7280',
                          }}
                        />
                        <span style={{ flex: 1 }}>{link.label}</span>
                        <ChevronRight
                          style={{
                            width: '14px',
                            height: '14px',
                            color: '#9ca3af',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* Footer Help Bar                */}
      {/* ============================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen
                style={{ width: '16px', height: '16px', color: '#2563EB' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                Besoin de plus d'aide ?
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Consultez notre documentation complète ou rejoignez la communauté ArchiPro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <FileText style={{ width: '14px', height: '14px' }} />
              <span>Documentation</span>
            </button>
            <button
              className="flex items-center gap-1.5"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#2563EB',
                border: '1px solid #2563EB',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }}
            >
              <Users style={{ width: '14px', height: '14px' }} />
              <span>Communauté</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
