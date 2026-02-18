import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Projets', href: '/dashboard/projects', icon: 'FolderKanban' },
  { label: 'Clients', href: '/dashboard/clients', icon: 'Users' },
  { label: 'Devis', href: '/dashboard/quotes', icon: 'FileText' },
  { label: 'Factures', href: '/dashboard/invoices', icon: 'Receipt' },
  { label: 'Documents', href: '/dashboard/documents', icon: 'Files' },
  { label: 'Planning', href: '/dashboard/calendar', icon: 'Calendar' },
  { label: 'Rapports', href: '/dashboard/reports', icon: 'BarChart3' },
  { label: 'Paramètres', href: '/dashboard/settings', icon: 'Settings' },
];

export const PROJECT_PHASES = [
  { key: 'prospect', label: 'Prospect', color: '#94a3b8' },
  { key: 'esquisse', label: 'Esquisse', color: '#8b5cf6' },
  { key: 'aps', label: 'APS', color: '#6366f1' },
  { key: 'apd', label: 'APD', color: '#3b82f6' },
  { key: 'pro', label: 'PRO', color: '#0ea5e9' },
  { key: 'dce', label: 'DCE', color: '#14b8a6' },
  { key: 'act', label: 'ACT', color: '#22c55e' },
  { key: 'visa', label: 'VISA', color: '#84cc16' },
  { key: 'det', label: 'DET', color: '#eab308' },
  { key: 'aor', label: 'AOR', color: '#f97316' },
  { key: 'reception', label: 'Réception', color: '#ef4444' },
  { key: 'delivered', label: 'Livré', color: '#059669' },
] as const;

export const CLIENT_TYPES = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'public', label: 'Public' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Basse', color: '#94a3b8' },
  { value: 'medium', label: 'Moyenne', color: '#eab308' },
  { value: 'high', label: 'Haute', color: '#f97316' },
  { value: 'urgent', label: 'Urgente', color: '#ef4444' },
] as const;

export const DOCUMENT_CATEGORIES = [
  { value: 'plan', label: 'Plans' },
  { value: 'render', label: 'Rendus 3D' },
  { value: 'contract', label: 'Contrats' },
  { value: 'permit', label: 'Permis' },
  { value: 'report', label: 'Rapports' },
  { value: 'photo', label: 'Photos' },
  { value: 'other', label: 'Autres' },
] as const;

export const QUOTE_CONDITIONS_DEFAULT = `Conditions de paiement : 30% à la commande, 40% en cours de mission, 30% à la livraison.
Les honoraires sont soumis à la TVA au taux en vigueur.
Le présent devis est valable 30 jours à compter de sa date d'émission.`;
