import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#ffffff' }}>
      <div className="flex flex-col items-center" style={{ maxWidth: 520, padding: '40px 24px', textAlign: 'center' }}>

        {/* 404 number */}
        <p
          style={{
            fontSize: 128,
            fontWeight: 800,
            lineHeight: 1,
            color: '#e5e7eb',
            letterSpacing: '-4px',
            margin: 0,
            userSelect: 'none',
          }}
        >
          404
        </p>

        {/* SVG illustration: architectural blueprint with magnifying glass */}
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '24px 0 32px 0' }}
          aria-hidden="true"
        >
          {/* Blueprint grid background */}
          <rect x="20" y="10" width="120" height="100" rx="4" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
          {/* Grid lines */}
          <line x1="40" y1="10" x2="40" y2="110" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="80" y1="10" x2="80" y2="110" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="100" y1="10" x2="100" y2="110" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="120" y1="10" x2="120" y2="110" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="20" y1="30" x2="140" y2="30" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="20" y1="50" x2="140" y2="50" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="20" y1="70" x2="140" y2="70" stroke="#dbeafe" strokeWidth="0.75" />
          <line x1="20" y1="90" x2="140" y2="90" stroke="#dbeafe" strokeWidth="0.75" />

          {/* Building outline on blueprint */}
          <rect x="45" y="35" width="50" height="65" rx="1" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Roof / triangle */}
          <polygon points="42,35 70,18 98,35" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Windows */}
          <rect x="52" y="44" width="12" height="12" rx="1" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <rect x="76" y="44" width="12" height="12" rx="1" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <rect x="52" y="64" width="12" height="12" rx="1" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <rect x="76" y="64" width="12" height="12" rx="1" fill="none" stroke="#60a5fa" strokeWidth="1" />
          {/* Door */}
          <rect x="62" y="82" width="16" height="18" rx="1" fill="none" stroke="#60a5fa" strokeWidth="1" />

          {/* Dimension annotation lines */}
          <line x1="45" y1="108" x2="95" y2="108" stroke="#93c5fd" strokeWidth="1" />
          <line x1="45" y1="105" x2="45" y2="111" stroke="#93c5fd" strokeWidth="1" />
          <line x1="95" y1="105" x2="95" y2="111" stroke="#93c5fd" strokeWidth="1" />

          {/* Magnifying glass */}
          <circle cx="145" cy="95" r="28" fill="#ffffff" fillOpacity="0.85" stroke="#2563EB" strokeWidth="2.5" />
          <circle cx="145" cy="95" r="22" fill="none" stroke="#bfdbfe" strokeWidth="1" />
          {/* Handle */}
          <line x1="166" y1="117" x2="185" y2="148" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          {/* Question mark inside magnifying glass */}
          <text
            x="145"
            y="102"
            textAnchor="middle"
            style={{
              fontSize: 24,
              fontWeight: 700,
              fill: '#2563EB',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            ?
          </text>
        </svg>

        {/* Heading */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 12px 0',
            lineHeight: 1.3,
          }}
        >
          Page introuvable
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 16,
            color: '#6b7280',
            lineHeight: 1.6,
            margin: '0 0 36px 0',
          }}
        >
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3" style={{ width: '100%' }}>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2"
            style={{
              width: '100%',
              maxWidth: 300,
              padding: '12px 24px',
              background: '#2563EB',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={undefined}
          >
            <ArrowLeft size={18} />
            Retour au tableau de bord
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2"
            style={{
              width: '100%',
              maxWidth: 300,
              padding: '12px 24px',
              background: 'transparent',
              color: '#374151',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 8,
              border: '1.5px solid #d1d5db',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            <Home size={18} />
            Page d'accueil
          </Link>
        </div>

        {/* Logo + Copyright */}
        <div
          className="flex items-center gap-2"
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: '1px solid #f3f4f6',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {/* ArchiPro mini logo */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="24" height="24" rx="6" fill="#2563EB" />
            <path
              d="M7 18L12 6L17 18"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="9"
              y1="14"
              x2="15"
              y2="14"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: 13,
              color: '#9ca3af',
              fontWeight: 500,
            }}
          >
            ArchiPro &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
