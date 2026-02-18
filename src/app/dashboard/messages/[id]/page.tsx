'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  Video,
  PanelRightOpen,
  PanelRightClose,
  Paperclip,
  Send,
  Smile,
  Check,
  CheckCheck,
  File,
  Image,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  X,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  time: string;
  dateLabel: string | null;
  isMe: boolean;
  isRead: boolean;
  attachments?: { name: string; type: 'image' | 'file'; size: string }[];
}

interface SharedFile {
  name: string;
  type: 'plan' | 'photo' | 'document' | 'render';
  size: string;
  date: string;
}

interface ConversationInfo {
  id: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  projectName: string;
  projectId: string;
  projectColor: string;
  avatarColor: string;
  isOnline: boolean;
  lastSeen: string;
  sharedFiles: SharedFile[];
}

// ============================================
// Mock Data - Conversation with Marie Laurent
// ============================================

const CONVERSATION_MAP: Record<string, ConversationInfo> = {
  'conv-001': {
    id: 'conv-001',
    contactName: 'Marie Laurent',
    contactRole: 'Cliente particulier',
    contactEmail: 'marie.laurent@gmail.com',
    contactPhone: '06 78 45 12 90',
    contactLocation: 'Aix-en-Provence (13)',
    projectName: 'Villa Laurent - Aix',
    projectId: 'proj-008',
    projectColor: '#059669',
    avatarColor: '#8b5cf6',
    isOnline: true,
    lastSeen: 'En ligne',
    sharedFiles: [
      { name: 'APS_Villa_Laurent_v2.1.dwg', type: 'plan', size: '6,3 Mo', date: '14 fév. 2026' },
      { name: 'Facade_Sud_Rendu3D.png', type: 'render', size: '3,1 Mo', date: '12 fév. 2026' },
      { name: 'Photos_Terrain_Lot42.zip', type: 'photo', size: '18,7 Mo', date: '08 fév. 2026' },
      { name: 'Devis_Gros_Oeuvre_Estimation.pdf', type: 'document', size: '420 Ko', date: '05 fév. 2026' },
    ],
  },
  'conv-002': {
    id: 'conv-002',
    contactName: 'Pierre Martin',
    contactRole: 'Client particulier',
    contactEmail: 'p.martin@outlook.fr',
    contactPhone: '07 62 33 18 45',
    contactLocation: 'Marseille (13)',
    projectName: 'Maison Martin',
    projectId: 'proj-003',
    projectColor: '#2563EB',
    avatarColor: '#f59e0b',
    isOnline: false,
    lastSeen: 'Vu il y a 2h',
    sharedFiles: [
      { name: 'PRO_Maison_Martin_v1.dwg', type: 'plan', size: '4,8 Mo', date: '16 fév. 2026' },
      { name: 'Bardage_Bois_Echantillons.jpg', type: 'photo', size: '2,4 Mo', date: '10 fév. 2026' },
    ],
  },
};

const MESSAGES_MAP: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-001',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'Bonjour Jean, j\'espère que vous allez bien. J\'ai quelques questions sur les plans de la villa que vous nous avez envoyés la semaine dernière.',
      time: '09:12',
      dateLabel: 'Hier',
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-002',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Bonjour Marie ! Bien sûr, je suis à votre écoute. De quels points souhaitez-vous discuter ?',
      time: '09:25',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-003',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'D\'abord, concernant la cuisine ouverte sur le séjour. Mon mari et moi, on aimerait finalement un îlot central plutôt que le plan de travail en L qu\'on avait validé. Est-ce que c\'est encore possible à ce stade de l\'APS ?',
      time: '09:31',
      dateLabel: null,
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-004',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Tout à fait, c\'est encore le bon moment pour ce type de modification. L\'APS est justement la phase où l\'on ajuste le plan d\'ensemble. Je vais intégrer un îlot de 2,40 m x 0,90 m avec un point d\'eau et des rangements. Il faudra juste prévoir le passage des réseaux en sol.',
      time: '09:40',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-005',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'Parfait, ça nous convient. Et pour les baies vitrées côté jardin, on avait parlé de menuiseries aluminium anthracite. Vous avez des préconisations de fournisseurs ?',
      time: '10:02',
      dateLabel: null,
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-006',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Pour les baies vitrées de cette dimension (3,60 m de large), je recommande soit Technal série Lumeal, soit Schüco ASS 77 PD. Les deux offrent d\'excellentes performances thermiques pour être conforme RE2020. Je vous prépare un comparatif avec les tarifs estimatifs.',
      time: '10:15',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-007',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'Super, merci beaucoup. Et dernière question pour aujourd\'hui : le permis de construire, on en est où ? La mairie d\'Aix a donné des retours ?',
      time: '10:28',
      dateLabel: null,
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-008',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Le dossier PC a été déposé le 3 février. Le récépissé indique un délai d\'instruction de 2 mois, donc réponse attendue début avril. Pour l\'instant, aucune demande de pièces complémentaires, ce qui est bon signe. Je surveille ça de près.',
      time: '10:35',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-009',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'Bonjour Jean ! J\'ai repensé à notre échange d\'hier. Pour l\'îlot central, est-ce qu\'on pourrait intégrer une plaque de cuisson à induction plutôt que juste un point d\'eau ? Et prévoir une hotte aspirante encastrée dans le plafond ?',
      time: '08:45',
      dateLabel: 'Aujourd\'hui',
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-010',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Bonjour Marie ! Oui, c\'est tout à fait faisable. Pour la plaque à induction dans l\'îlot, il faudra prévoir l\'alimentation électrique en 32A dans le sol. Pour la hotte au plafond, je recommande un modèle encastré type Elica ou Novy, c\'est discret et performant.',
      time: '09:02',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-011',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Par contre, attention : la hotte au plafond nécessite un faux-plafond d\'au moins 30 cm, ce qui va réduire la hauteur sous plafond à 2,40 m au-dessus de l\'îlot. À valider avec vous sur place.',
      time: '09:05',
      dateLabel: null,
      isMe: true,
      isRead: true,
      attachments: [
        { name: 'APS_Villa_Laurent_v2.1.dwg', type: 'file', size: '6,3 Mo' },
      ],
    },
    {
      id: 'msg-012',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'D\'accord, 2,40 m ça nous semble suffisant pour la zone cuisine. En revanche, on veut garder la hauteur maximale côté séjour. C\'est possible d\'avoir deux hauteurs de plafond différentes dans la même pièce ?',
      time: '09:20',
      dateLabel: null,
      isMe: false,
      isRead: true,
    },
    {
      id: 'msg-013',
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content: 'Absolument, c\'est même très courant et ça crée un bel effet architectural. On peut marquer la transition cuisine/séjour avec un décrochement de plafond. Le séjour gardera ses 2,70 m sous plafond, et la partie cuisine sera à 2,40 m. Je mets à jour les coupes et je vous envoie une perspective 3D d\'ici vendredi.',
      time: '09:30',
      dateLabel: null,
      isMe: true,
      isRead: true,
    },
    {
      id: 'msg-014',
      senderId: 'user-marie',
      senderName: 'Marie Laurent',
      content: 'Vous êtes formidable, merci Jean ! On a hâte de voir le rendu. Ah, j\'ai aussi reçu le devis estimatif pour le gros oeuvre, on le regarde ce soir avec mon mari et on vous fait un retour demain.',
      time: '09:42',
      dateLabel: null,
      isMe: false,
      isRead: false,
    },
  ],
  'conv-002': [
    {
      id: 'msg-p-001',
      senderId: 'user-pierre',
      senderName: 'Pierre Martin',
      content: 'Merci pour le dernier rendu, on valide la version avec le bardage bois.',
      time: '14:10',
      dateLabel: 'Aujourd\'hui',
      isMe: false,
      isRead: true,
    },
  ],
};

// ============================================
// Helper: Avatar Component
// ============================================

function Avatar({
  name,
  color,
  size = 40,
  isOnline,
}: {
  name: string;
  color: string;
  size?: number;
  isOnline?: boolean;
}) {
  const initials = getInitials(name);
  return (
    <div className="relative shrink-0">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          color: '#ffffff',
          fontSize: size * 0.35,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </div>
      {isOnline && (
        <div
          className="absolute"
          style={{
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: '2px solid #ffffff',
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Helper: Date Separator
// ============================================

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" style={{ padding: '16px 0 8px' }}>
      <div className="flex-1" style={{ height: 1, backgroundColor: '#e5e7eb' }} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: '#9ca3af',
          padding: '0 4px',
        }}
      >
        {label}
      </span>
      <div className="flex-1" style={{ height: 1, backgroundColor: '#e5e7eb' }} />
    </div>
  );
}

// ============================================
// Helper: Message Bubble
// ============================================

function MessageBubble({
  message,
  showAvatar,
  contactName,
  contactColor,
}: {
  message: Message;
  showAvatar: boolean;
  contactName: string;
  contactColor: string;
}) {
  const [showTime, setShowTime] = useState(false);

  return (
    <div
      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
      style={{ padding: '2px 0' }}
    >
      <div
        className={`flex items-end gap-2 ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}
        style={{ maxWidth: '70%' }}
      >
        {/* Avatar slot */}
        <div style={{ width: 28, flexShrink: 0 }}>
          {showAvatar && !message.isMe && (
            <Avatar name={contactName} color={contactColor} size={28} />
          )}
        </div>

        {/* Message content */}
        <div
          className="relative"
          onMouseEnter={() => setShowTime(true)}
          onMouseLeave={() => setShowTime(false)}
        >
          <div
            style={{
              padding: '10px 14px',
              borderRadius: message.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: message.isMe ? '#2563EB' : '#f3f4f6',
              color: message.isMe ? '#ffffff' : '#1f2937',
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {message.content}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-col gap-2" style={{ marginTop: 8 }}>
                {message.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: message.isMe ? 'rgba(255,255,255,0.15)' : '#ffffff',
                      border: message.isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                    }}
                  >
                    {att.type === 'image' ? (
                      <Image
                        style={{
                          width: 16,
                          height: 16,
                          color: message.isMe ? '#bfdbfe' : '#6b7280',
                        }}
                      />
                    ) : (
                      <File
                        style={{
                          width: 16,
                          height: 16,
                          color: message.isMe ? '#bfdbfe' : '#6b7280',
                        }}
                      />
                    )}
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <p
                        className="truncate"
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: message.isMe ? '#ffffff' : '#374151',
                          margin: 0,
                        }}
                      >
                        {att.name}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: message.isMe ? '#bfdbfe' : '#9ca3af',
                          margin: 0,
                        }}
                      >
                        {att.size}
                      </p>
                    </div>
                    <Download
                      style={{
                        width: 14,
                        height: 14,
                        color: message.isMe ? '#bfdbfe' : '#9ca3af',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time + read receipt on hover */}
          {showTime && (
            <div
              className={`absolute flex items-center gap-1 ${message.isMe ? 'right-0' : 'left-0'}`}
              style={{
                bottom: -18,
                fontSize: 11,
                color: '#9ca3af',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{message.time}</span>
              {message.isMe && (
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {message.isRead ? (
                    <CheckCheck
                      style={{
                        width: 12,
                        height: 12,
                        color: '#2563EB',
                      }}
                    />
                  ) : (
                    <Check
                      style={{
                        width: 12,
                        height: 12,
                        color: '#9ca3af',
                      }}
                    />
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Helper: Typing Indicator
// ============================================

function TypingIndicator({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-end gap-2" style={{ padding: '2px 0' }}>
      <div style={{ width: 28, flexShrink: 0 }}>
        <Avatar name={name} color={color} size={28} />
      </div>
      <div
        className="flex items-center gap-1"
        style={{
          padding: '12px 16px',
          borderRadius: '16px 16px 16px 4px',
          backgroundColor: '#f3f4f6',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#9ca3af',
            animation: 'typingDot 1.4s infinite ease-in-out',
            animationDelay: '0s',
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#9ca3af',
            animation: 'typingDot 1.4s infinite ease-in-out',
            animationDelay: '0.2s',
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#9ca3af',
            animation: 'typingDot 1.4s infinite ease-in-out',
            animationDelay: '0.4s',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>
        {name.split(' ')[0]} écrit...
      </span>
    </div>
  );
}

// ============================================
// Helper: File type icon color
// ============================================

function getFileTypeInfo(type: SharedFile['type']): { color: string; label: string } {
  switch (type) {
    case 'plan':
      return { color: '#2563EB', label: 'Plan' };
    case 'photo':
      return { color: '#059669', label: 'Photo' };
    case 'render':
      return { color: '#8b5cf6', label: 'Rendu 3D' };
    case 'document':
      return { color: '#f59e0b', label: 'Document' };
    default:
      return { color: '#6b7280', label: 'Fichier' };
  }
}

// ============================================
// Main Page Component
// ============================================

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation data based on ID
  useEffect(() => {
    const info = CONVERSATION_MAP[conversationId] || CONVERSATION_MAP['conv-001'];
    const msgs = MESSAGES_MAP[conversationId] || MESSAGES_MAP['conv-001'];
    setConversationInfo(info);
    setMessages(msgs);
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Simulate typing stops after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    const content = messageInput.trim();
    if (!content) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content,
      time,
      dateLabel: null,
      isMe: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
    inputRef.current?.focus();

    // Simulate typing after sending
    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => setIsTyping(false), 4500);
  }, [messageInput]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationInfo) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 112px)' }}>
        <p style={{ fontSize: 14, color: '#9ca3af' }}>Chargement de la conversation...</p>
      </div>
    );
  }

  return (
    <>
      {/* Keyframes for typing animation */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div
        className="flex"
        style={{
          height: 'calc(100vh - 112px)',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* ============================================ */}
        {/* Main Chat Area                              */}
        {/* ============================================ */}
        <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>

          {/* ---- Chat Header ---- */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid #f3f4f6',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Left: back + contact info */}
            <div className="flex items-center gap-3">
              {/* Back button */}
              <Link
                href="/dashboard/messages"
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#6b7280',
                  transition: 'all 150ms ease',
                  textDecoration: 'none',
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
                <ArrowLeft style={{ width: 18, height: 18 }} />
              </Link>

              {/* Avatar */}
              <Avatar
                name={conversationInfo.contactName}
                color={conversationInfo.avatarColor}
                size={40}
                isOnline={conversationInfo.isOnline}
              />

              {/* Name + role + project */}
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {conversationInfo.contactName}
                  </h3>
                  {conversationInfo.isOnline && (
                    <span
                      className="flex items-center gap-1"
                      style={{
                        fontSize: 11,
                        color: '#22c55e',
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          display: 'inline-block',
                        }}
                      />
                      En ligne
                    </span>
                  )}
                  {!conversationInfo.isOnline && (
                    <span
                      style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        fontWeight: 400,
                      }}
                    >
                      {conversationInfo.lastSeen}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    {conversationInfo.contactRole}
                  </span>
                  <span style={{ fontSize: 12, color: '#d1d5db' }}>·</span>
                  <span
                    className="inline-flex items-center"
                    style={{
                      padding: '1px 8px',
                      borderRadius: 5,
                      backgroundColor: conversationInfo.projectColor + '14',
                      color: conversationInfo.projectColor,
                      fontSize: 11,
                      fontWeight: 500,
                      border: `1px solid ${conversationInfo.projectColor}30`,
                    }}
                  >
                    {conversationInfo.projectName}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2">
              {/* Phone */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                  e.currentTarget.style.borderColor = '#86efac';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                title="Appeler"
              >
                <Phone style={{ width: 16, height: 16, color: '#22c55e' }} />
              </button>

              {/* Video */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                title="Appel vidéo"
              >
                <Video style={{ width: 16, height: 16, color: '#2563EB' }} />
              </button>

              {/* Info panel toggle */}
              <button
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: showInfoPanel ? '1px solid #93c5fd' : '1px solid #e5e7eb',
                  backgroundColor: showInfoPanel ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!showInfoPanel) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showInfoPanel) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
                title={showInfoPanel ? 'Masquer les détails' : 'Afficher les détails'}
              >
                {showInfoPanel ? (
                  <PanelRightClose style={{ width: 16, height: 16, color: '#2563EB' }} />
                ) : (
                  <PanelRightOpen style={{ width: 16, height: 16, color: '#6b7280' }} />
                )}
              </button>
            </div>
          </div>

          {/* ---- Messages Area ---- */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: '16px 24px',
              backgroundColor: '#fafbfc',
            }}
          >
            {messages.map((message, index) => {
              const showDateSeparator =
                message.dateLabel &&
                (index === 0 || messages[index - 1]?.dateLabel !== message.dateLabel);

              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId !== message.senderId ||
                showDateSeparator;

              const isNewGroup =
                index > 0 && messages[index - 1]?.senderId !== message.senderId;

              return (
                <div key={message.id}>
                  {showDateSeparator && message.dateLabel && (
                    <DateSeparator label={message.dateLabel} />
                  )}
                  <div style={{ marginTop: isNewGroup ? 16 : 0 }}>
                    <MessageBubble
                      message={message}
                      showAvatar={!!showAvatar}
                      contactName={conversationInfo.contactName}
                      contactColor={conversationInfo.avatarColor}
                    />
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ marginTop: 16 }}>
                <TypingIndicator
                  name={conversationInfo.contactName}
                  color={conversationInfo.avatarColor}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---- Message Input ---- */}
          <div
            className="shrink-0"
            style={{
              padding: '12px 20px 16px',
              borderTop: '1px solid #f3f4f6',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{
                padding: '8px 8px 8px 12px',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onFocus={(e) => {
                const container = e.currentTarget;
                container.style.borderColor = '#93c5fd';
                container.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
              }}
              onBlur={(e) => {
                const container = e.currentTarget;
                container.style.borderColor = '#e5e7eb';
                container.style.boxShadow = 'none';
              }}
            >
              {/* Attachment */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Joindre un fichier"
              >
                <Paperclip style={{ width: 18, height: 18, color: '#6b7280' }} />
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                  color: '#1f2937',
                  lineHeight: 1.5,
                  padding: '4px 0',
                }}
              />

              {/* Emoji */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Insérer un émoticône"
              >
                <Smile style={{ width: 18, height: 18, color: '#6b7280' }} />
              </button>

              {/* Send */}
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: messageInput.trim() ? '#2563EB' : '#e5e7eb',
                  cursor: messageInput.trim() ? 'pointer' : 'default',
                  transition: 'all 150ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (messageInput.trim()) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (messageInput.trim()) {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                  }
                }}
              >
                <Send
                  style={{
                    width: 16,
                    height: 16,
                    color: messageInput.trim() ? '#ffffff' : '#9ca3af',
                    marginLeft: 1,
                  }}
                />
              </button>
            </div>

            {/* Input hint */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '6px 4px 0' }}
            >
              <span style={{ fontSize: 11, color: '#d1d5db' }}>
                Appuyez sur Entrée pour envoyer
              </span>
              <span style={{ fontSize: 11, color: '#d1d5db' }}>
                {messageInput.length > 0 ? `${messageInput.length} caractères` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Right Info Sidebar (collapsible)            */}
        {/* ============================================ */}
        {showInfoPanel && (
          <div
            className="flex flex-col shrink-0 overflow-y-auto"
            style={{
              width: 320,
              borderLeft: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Sidebar header */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Détails du contact
              </h4>
              <button
                onClick={() => setShowInfoPanel(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X style={{ width: 16, height: 16, color: '#6b7280' }} />
              </button>
            </div>

            {/* Contact card */}
            <div
              className="flex flex-col items-center"
              style={{
                padding: '24px 20px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <Avatar
                name={conversationInfo.contactName}
                color={conversationInfo.avatarColor}
                size={64}
                isOnline={conversationInfo.isOnline}
              />
              <h4
                style={{
                  margin: '12px 0 2px',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#111827',
                  textAlign: 'center',
                }}
              >
                {conversationInfo.contactName}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#6b7280',
                  textAlign: 'center',
                }}
              >
                {conversationInfo.contactRole}
              </p>
              {conversationInfo.isOnline ? (
                <span
                  className="flex items-center gap-1"
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: '#22c55e',
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'inline-block',
                    }}
                  />
                  En ligne
                </span>
              ) : (
                <span style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>
                  {conversationInfo.lastSeen}
                </span>
              )}
            </div>

            {/* Contact info list */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h5
                style={{
                  margin: '0 0 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Informations
              </h5>

              {/* Email */}
              <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  <Mail style={{ width: 14, height: 14, color: '#6b7280' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Email</p>
                  <p
                    className="truncate"
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#374151',
                      fontWeight: 500,
                    }}
                  >
                    {conversationInfo.contactEmail}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  <Phone style={{ width: 14, height: 14, color: '#6b7280' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Téléphone</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#374151',
                      fontWeight: 500,
                    }}
                  >
                    {conversationInfo.contactPhone}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  <MapPin style={{ width: 14, height: 14, color: '#6b7280' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Localisation</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#374151',
                      fontWeight: 500,
                    }}
                  >
                    {conversationInfo.contactLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Project link */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h5
                style={{
                  margin: '0 0 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Projet associé
              </h5>
              <Link
                href={`/dashboard/projects/${conversationInfo.projectId}`}
                className="flex items-center justify-between"
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${conversationInfo.projectColor}30`,
                  backgroundColor: conversationInfo.projectColor + '08',
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = conversationInfo.projectColor + '14';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = conversationInfo.projectColor + '08';
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: conversationInfo.projectColor,
                    }}
                  >
                    {conversationInfo.projectName}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                    Voir le projet
                  </p>
                </div>
                <ExternalLink
                  style={{
                    width: 14,
                    height: 14,
                    color: conversationInfo.projectColor,
                    flexShrink: 0,
                  }}
                />
              </Link>
            </div>

            {/* Shared files */}
            <div style={{ padding: '16px 20px' }}>
              <h5
                style={{
                  margin: '0 0 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Fichiers partagés ({conversationInfo.sharedFiles.length})
              </h5>

              <div className="flex flex-col gap-2">
                {conversationInfo.sharedFiles.map((file, idx) => {
                  const typeInfo = getFileTypeInfo(file.type);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #f3f4f6',
                        backgroundColor: '#fafbfc',
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fafbfc';
                        e.currentTarget.style.borderColor = '#f3f4f6';
                      }}
                    >
                      {/* File icon */}
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          backgroundColor: typeInfo.color + '14',
                        }}
                      >
                        {file.type === 'photo' || file.type === 'render' ? (
                          <Image style={{ width: 16, height: 16, color: typeInfo.color }} />
                        ) : (
                          <File style={{ width: 16, height: 16, color: typeInfo.color }} />
                        )}
                      </div>

                      {/* File info */}
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <p
                          className="truncate"
                          style={{
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#374151',
                          }}
                        >
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                          <span
                            style={{
                              fontSize: 11,
                              color: typeInfo.color,
                              fontWeight: 500,
                            }}
                          >
                            {typeInfo.label}
                          </span>
                          <span style={{ fontSize: 11, color: '#d1d5db' }}>·</span>
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{file.size}</span>
                          <span style={{ fontSize: 11, color: '#d1d5db' }}>·</span>
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{file.date}</span>
                        </div>
                      </div>

                      {/* Download */}
                      <Download
                        style={{
                          width: 14,
                          height: 14,
                          color: '#9ca3af',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
