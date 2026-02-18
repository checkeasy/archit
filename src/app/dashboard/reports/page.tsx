'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Euro,
  Building2,
} from 'lucide-react';

// ============================================
// Types
// ============================================
type Period = 'month' | 'quarter' | 'year' | 'custom';

// ============================================
// Data
// ============================================
const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette annee' },
  { value: 'custom', label: 'Personnalise' },
];

const KPI_DATA = [
  {
    label: "Chiffre d'affaires",
    value: '284 500 \u20AC',
    change: '+18%',
    changeLabel: 'vs annee precedente',
    positive: true,
    icon: Euro,
  },
  {
    label: 'Projets livres',
    value: '8',
    change: '+3',
    changeLabel: 'vs annee precedente',
    positive: true,
    icon: Building2,
  },
  {
    label: 'Taux de conversion devis',
    value: '72%',
    change: '+5%',
    changeLabel: 'vs annee precedente',
    positive: true,
    icon: BarChart3,
  },
  {
    label: 'Delai moyen de paiement',
    value: '34 jours',
    change: '-8 jours',
    changeLabel: 'vs annee precedente',
    positive: true,
    icon: Calendar,
  },
  {
    label: 'Marge moyenne',
    value: '28%',
    change: '+2%',
    changeLabel: 'vs annee precedente',
    positive: true,
    icon: PieChart,
  },
];

const REVENUE_MONTHS = [
  'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec',
];
const REVENUE_VALUES = [18500, 22300, 28100, 31200, 24800, 26400, 19200, 32100, 28400, 35200, 29800, 38500];
const REVENUE_MAX = 40000;

const PROJECT_TYPES = [
  { label: 'Residentiel', percent: 45, count: 12, color: '#2563EB' },
  { label: 'Tertiaire', percent: 25, count: 7, color: '#7c3aed' },
  { label: 'Public', percent: 15, count: 4, color: '#059669' },
  { label: 'Commercial', percent: 10, count: 3, color: '#f59e0b' },
  { label: 'Renovation', percent: 5, count: 1, color: '#ef4444' },
];

const TOP_CLIENTS = [
  { name: 'SCI Les Terrasses', revenue: 85000 },
  { name: 'Nextech SAS', revenue: 62000 },
  { name: 'SARL Le Comptoir', revenue: 48000 },
  { name: 'Mairie de Caluire', revenue: 42000 },
  { name: 'M. et Mme Martin', revenue: 35000 },
];

const PHASE_DATA = [
  { phase: 'Esquisse', projets: 3, duree: '4 semaines', budget: '12 000 \u20AC', marge: '32%' },
  { phase: 'APS', projets: 2, duree: '6 semaines', budget: '18 500 \u20AC', marge: '30%' },
  { phase: 'APD', projets: 4, duree: '8 semaines', budget: '24 000 \u20AC', marge: '28%' },
  { phase: 'PRO', projets: 3, duree: '10 semaines', budget: '35 000 \u20AC', marge: '26%' },
  { phase: 'DCE', projets: 2, duree: '5 semaines', budget: '15 000 \u20AC', marge: '31%' },
  { phase: 'ACT', projets: 1, duree: '3 semaines', budget: '8 000 \u20AC', marge: '35%' },
  { phase: 'VISA', projets: 2, duree: '12 semaines', budget: '28 000 \u20AC', marge: '25%' },
  { phase: 'DET', projets: 3, duree: '20 semaines', budget: '42 000 \u20AC', marge: '22%' },
  { phase: 'AOR', projets: 1, duree: '4 semaines', budget: '10 000 \u20AC', marge: '29%' },
  { phase: 'Reception', projets: 2, duree: '2 semaines', budget: '6 000 \u20AC', marge: '34%' },
];

const INVOICE_STATUSES = [
  { label: 'Payees', percent: 65, count: 92, color: '#059669' },
  { label: 'En attente', percent: 20, count: 28, color: '#f59e0b' },
  { label: 'En retard', percent: 10, count: 14, color: '#dc2626' },
  { label: 'Annulees', percent: 5, count: 8, color: '#9ca3af' },
];

const MONTHLY_COMPARISON = [
  { month: 'Sep 2025', ca: '28 400 \u20AC', projets: 3, factures: 12, encaissement: '88%' },
  { month: 'Oct 2025', ca: '35 200 \u20AC', projets: 4, factures: 15, encaissement: '91%' },
  { month: 'Nov 2025', ca: '29 800 \u20AC', projets: 2, factures: 11, encaissement: '85%' },
  { month: 'Dec 2025', ca: '38 500 \u20AC', projets: 5, factures: 18, encaissement: '93%' },
  { month: 'Jan 2026', ca: '31 200 \u20AC', projets: 3, factures: 14, encaissement: '87%' },
  { month: 'Fev 2026', ca: '26 800 \u20AC', projets: 2, factures: 10, encaissement: '82%' },
];

// ============================================
// Shared styles
// ============================================
const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '16px',
};

// ============================================
// Helpers
// ============================================
function formatRevenue(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k \u20AC`;
  return `${val} \u20AC`;
}

function formatCurrencyFR(val: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}

// ============================================
// SVG Donut component
// ============================================
function DonutChart({ data }: { data: typeof INVOICE_STATUSES }) {
  const size = 140;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((segment, i) => {
        const offset = circumference * (1 - cumulativePercent / 100);
        const segLen = circumference * (segment.percent / 100);
        cumulativePercent += segment.percent;
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segLen} ${circumference - segLen}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        );
      })}
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        style={{ fontSize: '22px', fontWeight: 700, fill: '#111827' }}
      >
        142
      </text>
      <text
        x={size / 2}
        y={size / 2 + 14}
        textAnchor="middle"
        style={{ fontSize: '11px', fill: '#6b7280' }}
      >
        factures
      </text>
    </svg>
  );
}

// ============================================
// Component
// ============================================
export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('year');

  // Revenue chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 60 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const barWidth = plotWidth / REVENUE_VALUES.length - 8;
  const yLabels = [0, 10000, 20000, 30000, 40000];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ===== PAGE HEADER ===== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Rapports &amp; Analyses
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Vue d&apos;ensemble de la performance de votre cabinet
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Period selector */}
          <div
            style={{
              display: 'inline-flex',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
            }}
          >
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  backgroundColor: period === p.value ? '#2563EB' : 'transparent',
                  color: period === p.value ? '#ffffff' : '#6b7280',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export button */}
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid #2563EB',
              backgroundColor: '#2563EB',
              color: '#ffffff',
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
            <Download style={{ width: '16px', height: '16px' }} />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} style={cardStyle}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                  {kpi.label}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
                {kpi.value}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '8px',
                }}
              >
                {kpi.positive ? (
                  <TrendingUp style={{ width: '14px', height: '14px', color: '#059669' }} />
                ) : (
                  <TrendingDown style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                )}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: kpi.positive ? '#059669' : '#dc2626',
                  }}
                >
                  {kpi.change}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {kpi.changeLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== REVENUE CHART ===== */}
      <div style={cardStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>
            Evolution du chiffre d&apos;affaires
          </h2>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Jan 2025 - Dec 2025</span>
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: '100%', minWidth: '600px', height: 'auto' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {yLabels.map((yVal) => {
              const y =
                chartPadding.top +
                plotHeight -
                (yVal / REVENUE_MAX) * plotHeight;
              return (
                <g key={yVal}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={chartWidth - chartPadding.right}
                    y2={y}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                  <text
                    x={chartPadding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    style={{ fontSize: '11px', fill: '#9ca3af' }}
                  >
                    {yVal === 0 ? '0\u20AC' : `${yVal / 1000}k\u20AC`}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {REVENUE_VALUES.map((val, i) => {
              const barHeight = (val / REVENUE_MAX) * plotHeight;
              const x =
                chartPadding.left +
                (plotWidth / REVENUE_VALUES.length) * i +
                (plotWidth / REVENUE_VALUES.length - barWidth) / 2;
              const y = chartPadding.top + plotHeight - barHeight;

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill="#2563EB"
                    opacity={0.85}
                  />
                  {/* Value label on top of bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    style={{ fontSize: '9px', fill: '#6b7280', fontWeight: 500 }}
                  >
                    {formatRevenue(val)}
                  </text>
                  {/* Month label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartPadding.top + plotHeight + 20}
                    textAnchor="middle"
                    style={{ fontSize: '11px', fill: '#6b7280' }}
                  >
                    {REVENUE_MONTHS[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ===== TWO-COLUMN: PROJECT TYPES + TOP CLIENTS ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Project types - horizontal bars */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Repartition par type de projet</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PROJECT_TYPES.map((type) => (
              <div key={type.label}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    {type.label}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {type.percent}% - {type.count} projet{type.count > 1 ? 's' : ''}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${type.percent}%`,
                      height: '100%',
                      backgroundColor: type.color,
                      borderRadius: '5px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Top clients par CA</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {TOP_CLIENTS.map((client, i) => (
              <div
                key={client.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < TOP_CLIENTS.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor:
                        i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : i === 2 ? '#fef3c7' : '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: i === 0 ? '#d97706' : i === 1 ? '#6b7280' : i === 2 ? '#b45309' : '#9ca3af',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                    {client.name}
                  </span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}>
                  {formatCurrencyFR(client.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PERFORMANCE BY PHASE ===== */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Performance par phase</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '700px',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr>
                {['Phase', 'Projets actifs', 'Duree moyenne', 'Budget moyen', 'Taux de marge'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.05em',
                        color: '#6b7280',
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {PHASE_DATA.map((row, i) => (
                <tr
                  key={row.phase}
                  style={{
                    borderBottom:
                      i < PHASE_DATA.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {row.phase}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.projets}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.duree}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.budget}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor:
                          parseFloat(row.marge) >= 30 ? '#ecfdf5' : parseFloat(row.marge) >= 25 ? '#eff6ff' : '#fef2f2',
                        color:
                          parseFloat(row.marge) >= 30 ? '#059669' : parseFloat(row.marge) >= 25 ? '#2563EB' : '#dc2626',
                      }}
                    >
                      {row.marge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== INVOICE STATUS ===== */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Statut des factures</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '40px',
            justifyContent: 'center',
          }}
        >
          {/* Donut chart */}
          <DonutChart data={INVOICE_STATUSES} />

          {/* Status cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              flex: 1,
              minWidth: '300px',
            }}
          >
            {INVOICE_STATUSES.map((status) => (
              <div
                key={status.label}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafa',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: status.color,
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280' }}>
                    {status.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                    {status.percent}%
                  </span>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    ({status.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MONTHLY COMPARISON ===== */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Comparaison mensuelle</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '650px',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr>
                {['Mois', 'CA', 'Projets demarres', 'Factures emises', "Taux d'encaissement"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.05em',
                        color: '#6b7280',
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_COMPARISON.map((row, i) => (
                <tr
                  key={row.month}
                  style={{
                    borderBottom:
                      i < MONTHLY_COMPARISON.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {row.month}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#2563EB' }}>
                    {row.ca}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.projets}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.factures}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor:
                          parseInt(row.encaissement) >= 90 ? '#ecfdf5' : parseInt(row.encaissement) >= 85 ? '#eff6ff' : '#fef2f2',
                        color:
                          parseInt(row.encaissement) >= 90 ? '#059669' : parseInt(row.encaissement) >= 85 ? '#2563EB' : '#dc2626',
                      }}
                    >
                      {row.encaissement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
