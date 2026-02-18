'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Send,
} from 'lucide-react';

/* ─────────────────────── TYPES ─────────────────────── */

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  privacy: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  privacy?: string;
}

/* ─────────────────────── DATA ─────────────────────── */

const subjectOptions = [
  'Demande de démo',
  'Question sur les tarifs',
  'Support technique',
  'Partenariat',
  'Autre',
];

const faqData = [
  {
    question: 'Comment se déroule une démo personnalisée ?',
    answer:
      'La démo dure environ 30 minutes. Nous analysons vos besoins, vous présentons les fonctionnalités clés adaptées à votre cabinet, et répondons à toutes vos questions. Vous pouvez ensuite tester ArchiPro gratuitement pendant 14 jours.',
  },
  {
    question: 'Est-il possible de migrer mes données depuis un autre outil ?',
    answer:
      'Absolument. Notre équipe vous accompagne dans la migration de vos projets, clients et documents depuis Excel, Archireport, ou tout autre outil que vous utilisez actuellement. La migration est incluse dans le setup.',
  },
  {
    question: 'Proposez-vous des tarifs pour les grandes agences ?',
    answer:
      'Oui, nous proposons des offres sur mesure pour les agences de plus de 10 collaborateurs. Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins spécifiques.',
  },
  {
    question: 'Quels sont les délais de mise en place ?',
    answer:
      'La mise en place standard prend entre 1 et 4 semaines selon la complexité de votre configuration. Cela inclut le paramétrage, la migration des données, la formation de votre équipe et un suivi post-déploiement.',
  },
];

const contactCards = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@archipro.fr',
    detail: 'Réponse sous 24h',
    href: 'mailto:contact@archipro.fr',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    value: '04 72 00 00 00',
    detail: 'Lun-Ven, 9h-18h',
    href: 'tel:+33472000000',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Lyon, France',
    detail: '15 rue de la République, 69001 Lyon',
    href: null,
  },
  {
    icon: Calendar,
    title: 'Réserver une démo',
    value: '30 minutes de présentation personnalisée',
    detail: null,
    href: null,
    isDemo: true,
  },
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    privacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Le nom du cabinet est requis';
    }

    if (!formData.subject) {
      newErrors.subject = 'Veuillez sélectionner un sujet';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    if (!formData.privacy) {
      newErrors.privacy = 'Vous devez accepter la politique de confidentialité';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  /* ─────────────── Input style helper ─────────────── */
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: hasError ? '1.5px solid #EF4444' : '1px solid #D1D5DB',
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: 500,
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
              style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              style={{ fontSize: 14, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
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
            <Mail size={14} />
            Nous sommes à votre écoute
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
            Contactez-nous
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: '#6B7280',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Une question, une demande de démo ou un projet de partenariat ?
            Notre équipe vous répond sous 24 heures.
          </p>
        </div>
      </section>

      {/* ==================== FORM + CONTACT INFO ==================== */}
      <section style={{ padding: '48px 24px 96px' }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12"
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          {/* ────── LEFT COLUMN: FORM ────── */}
          <div className="lg:col-span-3">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                border: '1px solid #E5E7EB',
                padding: 'clamp(24px, 4vw, 40px)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {isSubmitted ? (
                /* ── Success State ── */
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ padding: '60px 20px', textAlign: 'center' }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 9999,
                      backgroundColor: '#DCFCE7',
                      marginBottom: 24,
                    }}
                  >
                    <CheckCircle2 size={36} style={{ color: '#16A34A' }} />
                  </div>
                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: '#111827',
                      marginBottom: 12,
                    }}
                  >
                    Message envoyé !
                  </h2>
                  <p
                    style={{
                      fontSize: 16,
                      color: '#6B7280',
                      lineHeight: 1.7,
                      maxWidth: 420,
                      marginBottom: 32,
                    }}
                  >
                    Merci pour votre message. Notre équipe vous contactera
                    dans les 24 heures ouvrées.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        company: '',
                        subject: '',
                        message: '',
                        privacy: false,
                      });
                    }}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit}>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    Envoyez-nous un message
                  </h2>
                  <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
                    Remplissez le formulaire ci-dessous et nous reviendrons vers vous rapidement.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: 20 }}>
                    {/* Full Name */}
                    <div>
                      <label style={labelStyle}>
                        Nom complet <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        style={inputStyle(!!errors.fullName)}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = errors.fullName ? '#EF4444' : '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      {errors.fullName && <p style={errorTextStyle}>{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>
                        Adresse email <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="jean@cabinet-archi.fr"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        style={inputStyle(!!errors.email)}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = errors.email ? '#EF4444' : '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: 20 }}>
                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>Téléphone (optionnel)</label>
                      <input
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        style={inputStyle(false)}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label style={labelStyle}>
                        Cabinet / Société <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Cabinet d'architecture Dupont"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        style={inputStyle(!!errors.company)}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = errors.company ? '#EF4444' : '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      {errors.company && <p style={errorTextStyle}>{errors.company}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>
                      Sujet <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        style={{
                          ...inputStyle(!!errors.subject),
                          appearance: 'none',
                          paddingRight: 40,
                          color: formData.subject ? '#111827' : '#9CA3AF',
                          cursor: 'pointer',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = errors.subject ? '#EF4444' : '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <option value="" disabled>
                          Sélectionnez un sujet
                        </option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#9CA3AF',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                    {errors.subject && <p style={errorTextStyle}>{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>
                      Message <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      placeholder="Décrivez votre besoin, votre projet ou votre question..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      style={{
                        ...inputStyle(!!errors.message),
                        resize: 'vertical',
                        minHeight: 120,
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#2563EB';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.message ? '#EF4444' : '#D1D5DB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {errors.message && <p style={errorTextStyle}>{errors.message}</p>}
                  </div>

                  {/* Privacy checkbox */}
                  <div style={{ marginBottom: 28 }}>
                    <label className="flex items-start gap-3" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.privacy}
                        onChange={(e) => handleChange('privacy', e.target.checked)}
                        style={{
                          width: 18,
                          height: 18,
                          marginTop: 2,
                          accentColor: '#2563EB',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                        J&apos;accepte la{' '}
                        <a
                          href="#"
                          style={{
                            color: '#2563EB',
                            textDecoration: 'underline',
                            fontWeight: 500,
                          }}
                        >
                          politique de confidentialité
                        </a>{' '}
                        et le traitement de mes données personnelles. <span style={{ color: '#EF4444' }}>*</span>
                      </span>
                    </label>
                    {errors.privacy && <p style={errorTextStyle}>{errors.privacy}</p>}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2"
                    style={{
                      width: '100%',
                      padding: '14px 28px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: isSubmitting ? '#93C5FD' : '#2563EB',
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                      boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#ffffff',
                            borderRadius: 9999,
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ────── RIGHT COLUMN: CONTACT INFO ────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#DBEAFE';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: '#EFF6FF',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} style={{ color: '#2563EB' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#6B7280',
                          marginBottom: 4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {card.title}
                      </p>
                      {card.href ? (
                        <a
                          href={card.href}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#111827',
                            textDecoration: 'none',
                            display: 'block',
                            marginBottom: card.detail ? 4 : 0,
                          }}
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#111827',
                            margin: 0,
                            marginBottom: card.detail ? 4 : 0,
                          }}
                        >
                          {card.value}
                        </p>
                      )}
                      {card.detail && (
                        <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                          {card.detail}
                        </p>
                      )}
                      {card.isDemo && (
                        <Link
                          href="#"
                          className="inline-flex items-center gap-2"
                          style={{
                            marginTop: 12,
                            padding: '8px 20px',
                            borderRadius: 8,
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '1px solid #DBEAFE',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DBEAFE';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                          }}
                        >
                          Planifier un créneau
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Trust indicators ── */}
            <div
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #E5E7EB',
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: 16,
                }}
              >
                Pourquoi nous contacter ?
              </p>
              <ul
                className="flex flex-col gap-3"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {[
                  'Démo personnalisée de 30 minutes',
                  'Accompagnement migration gratuit',
                  'Essai gratuit 14 jours sans engagement',
                  'Support en français basé à Lyon',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 9999,
                        backgroundColor: '#DCFCE7',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={12} style={{ color: '#16A34A' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section style={{ padding: '96px 24px', backgroundColor: '#F9FAFB' }}>
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
              Les réponses aux questions les plus courantes.
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
                    backgroundColor: isOpen ? '#ffffff' : '#ffffff',
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
                  href="/contact"
                  style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  Contact
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
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>04 72 00 00 00</span>
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

      {/* ── Keyframe for spinner ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
