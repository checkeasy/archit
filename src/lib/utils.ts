import { type ClassValue, clsx } from 'clsx';

// Simple cn utility without tailwind-merge for now
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateLong(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function generateReference(prefix: string, number: number): string {
  return `${prefix}-${String(number).padStart(5, '0')}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    prospect: 'Prospect',
    esquisse: 'Esquisse',
    aps: 'APS',
    apd: 'APD',
    pro: 'PRO',
    dce: 'DCE',
    act: 'ACT',
    visa: 'VISA',
    det: 'DET',
    aor: 'AOR',
    reception: 'Réception',
    delivered: 'Livré',
  };
  return labels[phase] || phase;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    sent: 'bg-blue-50 text-blue-700 border-blue-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-gray-50 text-gray-500 border-gray-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
    todo: 'bg-gray-50 text-gray-600 border-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    review: 'bg-purple-50 text-purple-700 border-purple-200',
    done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200';
}
