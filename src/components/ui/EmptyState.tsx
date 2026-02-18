'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {/* Icon circle */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          marginBottom: '20px',
        }}
      >
        <Icon style={{ width: '28px', height: '28px', color: '#9ca3af' }} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 24px 0',
            maxWidth: '360px',
            lineHeight: '1.5',
          }}
        >
          {description}
        </p>
      )}

      {/* CTA button */}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center"
          style={{
            height: '40px',
            padding: '0 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            backgroundColor: '#2563eb',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
