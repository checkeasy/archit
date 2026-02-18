'use client';

import { PROJECT_PHASES } from '@/lib/constants';

type BadgeType = 'project' | 'quote' | 'invoice' | 'task' | 'phase';

interface StatusBadgeProps {
  status: string;
  type: BadgeType;
}

// ------------------------------------------------------------------
// Color map: each status maps to [backgroundColor, textColor, label]
// ------------------------------------------------------------------

const PROJECT_STATUS_MAP: Record<string, [string, string, string]> = {
  active:    ['#dcfce7', '#166534', 'Actif'],
  on_hold:   ['#fef9c3', '#854d0e', 'En pause'],
  completed: ['#dbeafe', '#1e40af', 'Terminé'],
  cancelled: ['#fee2e2', '#991b1b', 'Annulé'],
};

const QUOTE_STATUS_MAP: Record<string, [string, string, string]> = {
  draft:    ['#f3f4f6', '#374151', 'Brouillon'],
  sent:     ['#dbeafe', '#1e40af', 'Envoyé'],
  accepted: ['#dcfce7', '#166534', 'Accepté'],
  rejected: ['#fee2e2', '#991b1b', 'Refusé'],
  expired:  ['#fef9c3', '#854d0e', 'Expiré'],
};

const INVOICE_STATUS_MAP: Record<string, [string, string, string]> = {
  draft:     ['#f3f4f6', '#374151', 'Brouillon'],
  sent:      ['#dbeafe', '#1e40af', 'Envoyée'],
  paid:      ['#dcfce7', '#166534', 'Payée'],
  overdue:   ['#fee2e2', '#991b1b', 'En retard'],
  cancelled: ['#f3f4f6', '#6b7280', 'Annulée'],
};

const TASK_STATUS_MAP: Record<string, [string, string, string]> = {
  todo:        ['#f3f4f6', '#374151', 'À faire'],
  in_progress: ['#dbeafe', '#1e40af', 'En cours'],
  review:      ['#fef9c3', '#854d0e', 'En revue'],
  done:        ['#dcfce7', '#166534', 'Terminé'],
};

const TYPE_MAP: Record<BadgeType, Record<string, [string, string, string]>> = {
  project: PROJECT_STATUS_MAP,
  quote:   QUOTE_STATUS_MAP,
  invoice: INVOICE_STATUS_MAP,
  task:    TASK_STATUS_MAP,
  phase:   {}, // handled separately via PROJECT_PHASES constant
};

function getPhaseInfo(status: string): [string, string, string] {
  const phase = PROJECT_PHASES.find((p) => p.key === status);
  if (!phase) return ['#f3f4f6', '#374151', status];
  // Use the phase color as text, and a light version as background
  return [`${phase.color}20`, phase.color, phase.label];
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let bgColor: string;
  let textColor: string;
  let label: string;

  if (type === 'phase') {
    [bgColor, textColor, label] = getPhaseInfo(status);
  } else {
    const map = TYPE_MAP[type];
    const entry = map[status];
    if (entry) {
      [bgColor, textColor, label] = entry;
    } else {
      bgColor = '#f3f4f6';
      textColor = '#374151';
      label = status;
    }
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '20px',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        color: textColor,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
