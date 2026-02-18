'use client';

import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  icon: LucideIcon;
  accentColor: string;
}

export function StatCard({
  label,
  value,
  subValue,
  change,
  icon: Icon,
  accentColor,
}: StatCardProps) {
  // Determine change indicator color
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');
  const changeColor = isPositive ? '#16a34a' : isNegative ? '#dc2626' : '#6b7280';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div className="flex items-start justify-between">
        {/* Text content */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Label */}
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#6b7280',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.025em',
            }}
          >
            {label}
          </span>

          {/* Value */}
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#111827',
              lineHeight: '1.2',
            }}
          >
            {value}
          </span>

          {/* Sub-value and change */}
          <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
            {subValue && (
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                {subValue}
              </span>
            )}
            {change && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: changeColor,
                  backgroundColor: isPositive
                    ? '#f0fdf4'
                    : isNegative
                    ? '#fef2f2'
                    : '#f9fafb',
                  padding: '1px 8px',
                  borderRadius: '9999px',
                }}
              >
                {change}
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: `${accentColor}14`,
          }}
        >
          <Icon style={{ width: '22px', height: '22px', color: accentColor }} />
        </div>
      </div>
    </div>
  );
}
