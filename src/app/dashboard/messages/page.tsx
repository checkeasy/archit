'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Paperclip,
  Send,
  MoreHorizontal,
  MessageSquare,
  Check,
  CheckCheck,
  Image,
  File,
  ChevronDown,
  X,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface Conversation {
  id: string;
  contactName: string;
  contactRole: string;
  projectName: string | null;
  projectColor: string | null;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageTimestamp: number;
  unreadCount: number;
  avatarColor: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  time: string;
  dateLabel: string | null;
  isMe: boolean;
  isRead: boolean;
  attachments?: { name: string; type: 'image' | 'file'; size: string }[];
}

// ============================================
// Mock Data
// ============================================

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    contactName: 'Marie Lefèvre',
    contactRole: 'Directrice de projet',
    projectName: 'Résidence Les Terrasses',
    projectColor: '#2563EB',
    lastMessage: 'J\'ai mis à jour les plans du niveau R+2 avec les modifications demandées pour le balcon.',
    lastMessageTime: 'Il y a 5 min',
    lastMessageTimestamp: Date.now() - 5 * 60 * 1000,
    unreadCount: 3,
    avatarColor: '#8b5cf6',
    isOnline: true,
  },
  {
    id: 'conv-002',
    contactName: 'Pierre Martin',
    contactRole: 'Client particulier',
    projectName: 'Maison Martin',
    projectColor: '#059669',
    lastMessage: 'Merci pour le dernier rendu, on valide la version avec le bardage bois.',
    lastMessageTime: 'Il y a 2h',
    lastMessageTimestamp: Date.now() - 2 * 60 * 60 * 1000,
    unreadCount: 0,
    avatarColor: '#f59e0b',
    isOnline: false,
  },
  {
    id: 'conv-003',
    contactName: 'Thomas Garcia',
    contactRole: 'Client professionnel',
    projectName: 'Restaurant Le Comptoir',
    projectColor: '#dc2626',
    lastMessage: 'Pouvez-vous intégrer une mezzanine dans le plan ? Le budget le permet.',
    lastMessageTime: 'Il y a 4h',
    lastMessageTimestamp: Date.now() - 4 * 60 * 60 * 1000,
    unreadCount: 1,
    avatarColor: '#06b6d4',
    isOnline: true,
  },
  {
    id: 'conv-004',
    contactName: 'Sophie Bernard',
    contactRole: 'Ingénieure structure',
    projectName: 'Bureaux Nextech',
    projectColor: '#7c3aed',
    lastMessage: 'Les calculs de charge pour la toiture terrasse sont validés. RAS sur le voile béton.',
    lastMessageTime: 'Hier',
    lastMessageTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    unreadCount: 0,
    avatarColor: '#059669',
    isOnline: false,
  },
  {
    id: 'conv-005',
    contactName: 'Lucas Moreau',
    contactRole: 'Économiste de la construction',
    projectName: 'École Montessori',
    projectColor: '#ea580c',
    lastMessage: 'Le chiffrage de la phase DCE est prêt. On dépasse légèrement l\'enveloppe de 2%.',
    lastMessageTime: 'Hier',
    lastMessageTimestamp: Date.now() - 30 * 60 * 60 * 1000,
    unreadCount: 2,
    avatarColor: '#e11d48',
    isOnline: false,
  },
  {
    id: 'conv-006',
    contactName: 'Camille Roux',
    contactRole: 'Architecte associée',
    projectName: null,
    projectColor: null,
    lastMessage: 'On se fait un point demain matin à 9h pour le planning de la semaine ?',
    lastMessageTime: 'Lundi',
    lastMessageTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    unreadCount: 0,
    avatarColor: '#2563EB',
    isOnline: true,
  },
];

const MESSAGES_CONV_001: Message[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'Bonjour Jean, j\'ai regardé les plans du R+2 que vous avez envoyés vendredi. Quelques points à revoir ensemble.',
    timestamp: '2026-02-18T09:15:00',
    time: '09:15',
    dateLabel: 'Aujourd\'hui',
    isMe: false,
    isRead: true,
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'user-me',
    senderName: 'Jean Dupont',
    content: 'Bonjour Marie ! Oui, j\'attends vos retours. Quels sont les points qui posent question ?',
    timestamp: '2026-02-18T09:18:00',
    time: '09:18',
    dateLabel: null,
    isMe: true,
    isRead: true,
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'D\'abord, le balcon du T4 côté sud. Le client souhaite l\'agrandir de 1,20m pour avoir une vraie terrasse. Est-ce que c\'est faisable structurellement sans toucher au voile porteur ?',
    timestamp: '2026-02-18T09:22:00',
    time: '09:22',
    dateLabel: null,
    isMe: false,
    isRead: true,
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'user-me',
    senderName: 'Jean Dupont',
    content: 'C\'est possible avec un porte-à-faux en dalle béton. Il faudra renforcer l\'armature en conséquence. Je vais faire une note de calcul rapide et en parler avec Sophie de chez BET Structure.',
    timestamp: '2026-02-18T09:30:00',
    time: '09:30',
    dateLabel: null,
    isMe: true,
    isRead: true,
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'Parfait. Deuxième point : les matériaux de façade. On avait prévu un enduit clair, mais le client hésite avec un parement pierre naturelle. Ça change quoi côté budget et planning ?',
    timestamp: '2026-02-18T10:05:00',
    time: '10:05',
    dateLabel: null,
    isMe: false,
    isRead: true,
  },
  {
    id: 'msg-006',
    conversationId: 'conv-001',
    senderId: 'user-me',
    senderName: 'Jean Dupont',
    content: 'Le parement pierre va ajouter environ 15-20% sur le lot façade. Côté planning, il faut compter 3 semaines supplémentaires pour l\'approvisionnement. Je mets à jour le chiffrage et je vous envoie un comparatif d\'ici jeudi.',
    timestamp: '2026-02-18T10:12:00',
    time: '10:12',
    dateLabel: null,
    isMe: true,
    isRead: true,
  },
  {
    id: 'msg-007',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'Très bien. Dernière chose : la phase APD est calée pour le 15 mars. On est dans les temps ?',
    timestamp: '2026-02-18T10:20:00',
    time: '10:20',
    dateLabel: null,
    isMe: false,
    isRead: true,
  },
  {
    id: 'msg-008',
    conversationId: 'conv-001',
    senderId: 'user-me',
    senderName: 'Jean Dupont',
    content: 'Oui, on est bien avancés. Les plans sont à 85% et les coupes sont terminées. Il reste les détails techniques des menuiseries et le carnet de finitions. On devrait boucler la semaine prochaine.',
    timestamp: '2026-02-18T10:25:00',
    time: '10:25',
    dateLabel: null,
    isMe: true,
    isRead: true,
  },
  {
    id: 'msg-009',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'Super. J\'ai mis à jour les plans du niveau R+2 avec les modifications demandées pour le balcon.',
    timestamp: '2026-02-18T14:30:00',
    time: '14:30',
    dateLabel: null,
    isMe: false,
    isRead: false,
    attachments: [
      { name: 'R+2_Plans_v3.2.dwg', type: 'file', size: '4,2 Mo' },
      { name: 'R+2_Facade_Sud.png', type: 'image', size: '1,8 Mo' },
    ],
  },
  {
    id: 'msg-010',
    conversationId: 'conv-001',
    senderId: 'user-marie',
    senderName: 'Marie Lefèvre',
    content: 'J\'ai aussi ajouté une variante avec le garde-corps vitré comme discuté. Dites-moi ce que vous en pensez.',
    timestamp: '2026-02-18T14:32:00',
    time: '14:32',
    dateLabel: null,
    isMe: false,
    isRead: false,
  },
];

// ============================================
// Helper Components
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

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="flex items-center justify-center shrink-0"
      style={{
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 600,
        padding: '0 6px',
      }}
    >
      {count}
    </span>
  );
}

function ProjectBadge({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center"
      style={{
        padding: '2px 10px',
        borderRadius: 6,
        backgroundColor: color + '14',
        color: color,
        fontSize: 12,
        fontWeight: 500,
        border: `1px solid ${color}30`,
      }}
    >
      {name}
    </span>
  );
}

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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time on hover */}
          {showTime && (
            <div
              className={`absolute ${message.isMe ? 'right-0' : 'left-0'}`}
              style={{
                bottom: -18,
                fontSize: 11,
                color: '#9ca3af',
                whiteSpace: 'nowrap',
              }}
            >
              {message.time}
              {message.isMe && (
                <span style={{ marginLeft: 4 }}>
                  {message.isRead ? (
                    <CheckCheck
                      style={{
                        width: 12,
                        height: 12,
                        display: 'inline',
                        verticalAlign: 'middle',
                        color: '#2563EB',
                      }}
                    />
                  ) : (
                    <Check
                      style={{
                        width: 12,
                        height: 12,
                        display: 'inline',
                        verticalAlign: 'middle',
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

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: 40 }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: '#f3f4f6',
          marginBottom: 20,
        }}
      >
        <MessageSquare style={{ width: 36, height: 36, color: '#9ca3af' }} />
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: '#374151',
          margin: '0 0 8px 0',
        }}
      >
        Sélectionnez une conversation
      </h3>
      <p
        style={{
          fontSize: 14,
          color: '#9ca3af',
          margin: 0,
          textAlign: 'center',
          maxWidth: 300,
          lineHeight: 1.5,
        }}
      >
        Choisissez une conversation dans la liste pour commencer à échanger avec vos collaborateurs et clients.
      </p>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(MESSAGES_CONV_001);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.contactName.toLowerCase().includes(q) ||
        (c.projectName && c.projectName.toLowerCase().includes(q)) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null;

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  }, [selectedConversationId]);

  // Handle send message
  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content || !selectedConversationId) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: 'user-me',
      senderName: 'Jean Dupont',
      content,
      timestamp: now.toISOString(),
      time,
      dateLabel: null,
      isMe: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversationId
          ? {
              ...c,
              lastMessage: content,
              lastMessageTime: 'À l\'instant',
              lastMessageTimestamp: Date.now(),
            }
          : c
      )
    );

    // Focus back on input
    inputRef.current?.focus();
  };

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Total unread count
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
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
      {/* Left Panel - Conversation List              */}
      {/* ============================================ */}
      <div
        className="flex flex-col shrink-0"
        style={{
          width: 340,
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <div className="flex items-center gap-2">
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: '#111827',
              }}
            >
              Messages
            </h2>
            {totalUnread > 0 && (
              <span
                className="flex items-center justify-center"
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '0 7px',
                }}
              >
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-1.5"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: '#2563EB',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            Nouveau
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div
            className="flex items-center gap-2"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              transition: 'border-color 150ms ease',
            }}
          >
            <Search style={{ width: 16, height: 16, color: '#9ca3af', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: 13,
                color: '#374151',
                lineHeight: 1.4,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#e5e7eb',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <X style={{ width: 12, height: 12, color: '#6b7280' }} />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '4px 8px' }}>
          {filteredConversations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: '40px 20px', textAlign: 'center' }}
            >
              <Search style={{ width: 32, height: 32, color: '#d1d5db', marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                Aucune conversation trouvée
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;
              const isHovered = conversation.id === hoveredConversation;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  onMouseEnter={() => setHoveredConversation(conversation.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  className="flex items-start gap-3 w-full text-left"
                  style={{
                    padding: '12px 12px',
                    borderRadius: 10,
                    backgroundColor: isSelected
                      ? '#eff6ff'
                      : isHovered
                        ? '#f9fafb'
                        : 'transparent',
                    border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    name={conversation.contactName}
                    color={conversation.avatarColor}
                    size={44}
                    isOnline={conversation.isOnline}
                  />

                  <div className="flex-1" style={{ minWidth: 0 }}>
                    {/* Name + time row */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="truncate"
                        style={{
                          fontSize: 14,
                          fontWeight: conversation.unreadCount > 0 ? 600 : 500,
                          color: '#111827',
                        }}
                      >
                        {conversation.contactName}
                      </span>
                      <span
                        className="shrink-0"
                        style={{
                          fontSize: 11,
                          color: conversation.unreadCount > 0 ? '#2563EB' : '#9ca3af',
                          fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                        }}
                      >
                        {conversation.lastMessageTime}
                      </span>
                    </div>

                    {/* Project badge */}
                    {conversation.projectName && (
                      <div style={{ marginTop: 3 }}>
                        <span
                          style={{
                            fontSize: 11,
                            color: conversation.projectColor || '#6b7280',
                            fontWeight: 500,
                          }}
                        >
                          {conversation.projectName}
                        </span>
                      </div>
                    )}

                    {/* Last message + unread row */}
                    <div className="flex items-center justify-between gap-2" style={{ marginTop: 3 }}>
                      <p
                        className="truncate"
                        style={{
                          fontSize: 13,
                          color: conversation.unreadCount > 0 ? '#374151' : '#9ca3af',
                          fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {conversation.lastMessage}
                      </p>
                      <UnreadBadge count={conversation.unreadCount} />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* Right Panel - Message Thread                */}
      {/* ============================================ */}
      {selectedConversation ? (
        <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
          {/* Thread Header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid #f3f4f6',
              backgroundColor: '#ffffff',
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar
                name={selectedConversation.contactName}
                color={selectedConversation.avatarColor}
                size={38}
                isOnline={selectedConversation.isOnline}
              />
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
                    {selectedConversation.contactName}
                  </h3>
                  {selectedConversation.isOnline && (
                    <span
                      style={{
                        fontSize: 11,
                        color: '#22c55e',
                        fontWeight: 500,
                      }}
                    >
                      En ligne
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    {selectedConversation.contactRole}
                  </span>
                  {selectedConversation.projectName && selectedConversation.projectColor && (
                    <>
                      <span style={{ fontSize: 12, color: '#d1d5db' }}>·</span>
                      <ProjectBadge
                        name={selectedConversation.projectName}
                        color={selectedConversation.projectColor}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="relative"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  backgroundColor: showMenu ? '#f3f4f6' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!showMenu) e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  if (!showMenu) e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <MoreHorizontal style={{ width: 18, height: 18, color: '#6b7280' }} />
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div
                  className="absolute"
                  style={{
                    top: 48,
                    right: 20,
                    width: 200,
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    padding: '4px',
                    zIndex: 50,
                  }}
                >
                  {[
                    { label: 'Voir le profil', action: () => {} },
                    { label: 'Voir le projet', action: () => {} },
                    { label: 'Rechercher dans les messages', action: () => {} },
                    { label: 'Épingler la conversation', action: () => {} },
                    { label: 'Marquer comme non lu', action: () => {} },
                    { label: 'Archiver', action: () => {} },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setShowMenu(false);
                      }}
                      className="w-full text-left"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#374151',
                        transition: 'background-color 100ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: '16px 24px',
              backgroundColor: '#fafbfc',
            }}
          >
            {messages.map((message, index) => {
              // Determiné if we should show a date separator
              const showDateSeparator =
                message.dateLabel &&
                (index === 0 || messages[index - 1]?.dateLabel !== message.dateLabel);

              // Determiné if we should show avatar (first message or different sender than previous)
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId !== message.senderId ||
                showDateSeparator;

              // Add spacing between message groups from different senders
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
                      contactName={selectedConversation.contactName}
                      contactColor={selectedConversation.avatarColor}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
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
                padding: '8px 8px 8px 16px',
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
              {/* Attachment button */}
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

              {/* Send button */}
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

            {/* Typing hint */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '6px 4px 0',
              }}
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
      ) : (
        <EmptyState />
      )}

      {/* ============================================ */}
      {/* Compose Modal                               */}
      {/* ============================================ */}
      {showComposeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowComposeModal(false);
          }}
        >
          <div
            style={{
              width: 480,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Nouveau message
              </h3>
              <button
                onClick={() => setShowComposeModal(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 8,
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
                <X style={{ width: 18, height: 18, color: '#6b7280' }} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '16px 20px' }}>
              {/* Recipient field */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 6,
                  }}
                >
                  Destinataire
                </label>
                <input
                  type="text"
                  placeholder="Nom du contact ou email..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    color: '#1f2937',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                    transition: 'border-color 150ms ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

              {/* Project field */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 6,
                  }}
                >
                  Projet (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Associer à un projet..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    color: '#1f2937',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                    transition: 'border-color 150ms ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>

              {/* Message field */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 6,
                  }}
                >
                  Message
                </label>
                <textarea
                  placeholder="Écrire votre message..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    color: '#1f2937',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    transition: 'border-color 150ms ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="flex items-center justify-end gap-3"
              style={{
                padding: '12px 20px 16px',
                borderTop: '1px solid #f3f4f6',
              }}
            >
              <button
                onClick={() => setShowComposeModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Annulér
              </button>
              <button
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#2563EB',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
