'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  LayoutDashboard,
  Files,
  Settings,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  type LucideIcon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

// ─── Mock data ───────────────────────────────────────────────────────
const QUICK_ACTIONS: CommandItem[] = [
  { id: 'new-project', label: 'Nouveau projet', href: '/dashboard/projects/new', icon: FolderKanban, category: 'Actions rapides' },
  { id: 'new-client', label: 'Nouveau client', href: '/dashboard/clients/new', icon: Users, category: 'Actions rapides' },
  { id: 'new-quote', label: 'Nouveau devis', href: '/dashboard/quotes/new', icon: FileText, category: 'Actions rapides' },
  { id: 'new-invoice', label: 'Nouvelle facture', href: '/dashboard/invoices/new', icon: Receipt, category: 'Actions rapides' },
];

const PROJECTS: CommandItem[] = [
  { id: 'proj-1', label: 'Residence Les Terrasses', href: '/dashboard/projects/proj-1', icon: FolderKanban, category: 'Projets' },
  { id: 'proj-2', label: 'Maison Martin', href: '/dashboard/projects/proj-2', icon: FolderKanban, category: 'Projets' },
  { id: 'proj-3', label: 'Bureaux Nextech', href: '/dashboard/projects/proj-3', icon: FolderKanban, category: 'Projets' },
  { id: 'proj-4', label: 'Restaurant Le Comptoir', href: '/dashboard/projects/proj-4', icon: FolderKanban, category: 'Projets' },
  { id: 'proj-5', label: 'Ecole Montessori', href: '/dashboard/projects/proj-5', icon: FolderKanban, category: 'Projets' },
];

const CLIENTS: CommandItem[] = [
  { id: 'cli-1', label: 'SCI Les Terrasses', href: '/dashboard/clients/cli-1', icon: Users, category: 'Clients' },
  { id: 'cli-2', label: 'M. et Mme Martin', href: '/dashboard/clients/cli-2', icon: Users, category: 'Clients' },
  { id: 'cli-3', label: 'Nextech SAS', href: '/dashboard/clients/cli-3', icon: Users, category: 'Clients' },
  { id: 'cli-4', label: 'SARL Le Comptoir', href: '/dashboard/clients/cli-4', icon: Users, category: 'Clients' },
  { id: 'cli-5', label: 'Mairie de Caluire', href: '/dashboard/clients/cli-5', icon: Users, category: 'Clients' },
];

const PAGES: CommandItem[] = [
  { id: 'page-dashboard', label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
  { id: 'page-projects', label: 'Projets', href: '/dashboard/projects', icon: FolderKanban, category: 'Pages' },
  { id: 'page-clients', label: 'Clients', href: '/dashboard/clients', icon: Users, category: 'Pages' },
  { id: 'page-quotes', label: 'Devis', href: '/dashboard/quotes', icon: FileText, category: 'Pages' },
  { id: 'page-invoices', label: 'Factures', href: '/dashboard/invoices', icon: Receipt, category: 'Pages' },
  { id: 'page-documents', label: 'Documents', href: '/dashboard/documents', icon: Files, category: 'Pages' },
  { id: 'page-settings', label: 'Parametres', href: '/dashboard/settings', icon: Settings, category: 'Pages' },
];

const ALL_SEARCHABLE = [...PROJECTS, ...CLIENTS, ...PAGES];

// ─── Component ───────────────────────────────────────────────────────
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ─── Inject keyframe animation once ─────────────────────────────────
  useEffect(() => {
    const styleId = 'command-palette-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes commandPaletteIn {
        from { opacity: 0; transform: scale(0.98) translateY(-8px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // ─── Filter results based on query ─────────────────────────────────
  const results = useMemo(() => {
    if (!query.trim()) return QUICK_ACTIONS;

    const lowerQuery = query.toLowerCase();
    return ALL_SEARCHABLE.filter((item) =>
      item.label.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // ─── Group results by category ─────────────────────────────────────
  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of results) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [results]);

  // ─── Flat list for keyboard navigation ─────────────────────────────
  const flatResults = useMemo(() => {
    const flat: CommandItem[] = [];
    for (const category of Object.keys(groupedResults)) {
      flat.push(...groupedResults[category]);
    }
    return flat;
  }, [groupedResults]);

  // ─── Reset state on open ───────────────────────────────────────────
  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // ─── Navigate to selected item ─────────────────────────────────────
  const navigateTo = useCallback(
    (item: CommandItem) => {
      closePalette();
      router.push(item.href);
    },
    [closePalette, router]
  );

  // ─── Global keyboard shortcut (Cmd+K / Ctrl+K) ────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, openPalette, closePalette]);

  // ─── Listen for custom open event from header button ───────────────
  useEffect(() => {
    function handleOpenEvent() {
      openPalette();
    }
    window.addEventListener('open-command-palette', handleOpenEvent);
    return () => window.removeEventListener('open-command-palette', handleOpenEvent);
  }, [openPalette]);

  // ─── Focus input when opened ───────────────────────────────────────
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // ─── Reset selected index when results change ──────────────────────
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // ─── Scroll selected item into view ────────────────────────────────
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // ─── Keyboard navigation within the palette ────────────────────────
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, flatResults.length - 1) : prev - 1
        );
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          navigateTo(flatResults[selectedIndex]);
        }
        return;
      }
    },
    [closePalette, flatResults, selectedIndex, navigateTo]
  );

  if (!open) return null;

  // Track the global flat index as we render groups
  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center"
      style={{ paddingTop: '120px' }}
    >
      {/* ─── Backdrop ─── */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={closePalette}
      />

      {/* ─── Modal ─── */}
      <div
        className="relative flex flex-col"
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          animation: 'commandPaletteIn 150ms ease-out',
        }}
      >
        {/* ─── Search Input ─── */}
        <div className="flex items-center" style={{ padding: '16px 20px', gap: '12px' }}>
          <Search
            style={{ width: '20px', height: '20px', color: '#9ca3af', flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Rechercher des projets, clients, pages..."
            style={{
              flex: 1,
              fontSize: '18px',
              fontWeight: 400,
              color: '#111827',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              lineHeight: '28px',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                fontSize: '12px',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Effacer
            </button>
          )}
        </div>

        {/* ─── Divider ─── */}
        <div style={{ height: '1px', backgroundColor: '#e5e7eb' }} />

        {/* ─── Results ─── */}
        <div
          ref={listRef}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {flatResults.length === 0 ? (
            <div
              className="flex items-center justify-center"
              style={{
                padding: '40px 20px',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              Aucun resultat pour &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '4px' }}>
                {/* Category header */}
                <div
                  style={{
                    padding: '8px 12px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {category}
                </div>

                {/* Items */}
                {items.map((item) => {
                  const currentIndex = globalIndex;
                  globalIndex++;
                  const isSelected = currentIndex === selectedIndex;
                  const IconComponent = item.icon;

                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      onClick={() => navigateTo(item)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className="flex items-center w-full"
                      style={{
                        padding: '10px 12px',
                        gap: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        transition: 'background-color 100ms ease',
                        textAlign: 'left',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6',
                          flexShrink: 0,
                          transition: 'background-color 100ms ease',
                        }}
                      >
                        <IconComponent
                          style={{
                            width: '16px',
                            height: '16px',
                            color: isSelected ? '#2563eb' : '#6b7280',
                            transition: 'color 100ms ease',
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          flex: 1,
                          fontSize: '14px',
                          fontWeight: 500,
                          color: isSelected ? '#1e40af' : '#374151',
                          transition: 'color 100ms ease',
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Category badge */}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: '#9ca3af',
                          backgroundColor: isSelected ? '#dbeafe' : '#f9fafb',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          transition: 'background-color 100ms ease',
                        }}
                      >
                        {item.category}
                      </span>

                      {/* Enter hint on selected */}
                      {isSelected && (
                        <CornerDownLeft
                          style={{
                            width: '14px',
                            height: '14px',
                            color: '#93c5fd',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* ─── Footer ─── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '10px 16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div className="flex items-center" style={{ gap: '16px' }}>
            {/* Escape */}
            <div className="flex items-center" style={{ gap: '6px' }}>
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 6px',
                  fontSize: '11px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: '#6b7280',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  boxShadow: '0 1px 0 #d1d5db',
                }}
              >
                Echap
              </kbd>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>fermer</span>
            </div>

            {/* Arrow navigation */}
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div className="flex items-center" style={{ gap: '2px' }}>
                <kbd
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxShadow: '0 1px 0 #d1d5db',
                  }}
                >
                  <ArrowUp style={{ width: '12px', height: '12px' }} />
                </kbd>
                <kbd
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    boxShadow: '0 1px 0 #d1d5db',
                  }}
                >
                  <ArrowDown style={{ width: '12px', height: '12px' }} />
                </kbd>
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>naviguer</span>
            </div>

            {/* Enter */}
            <div className="flex items-center" style={{ gap: '6px' }}>
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 6px',
                  fontSize: '11px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: '#6b7280',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  boxShadow: '0 1px 0 #d1d5db',
                }}
              >
                ↵
              </kbd>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>ouvrir</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
