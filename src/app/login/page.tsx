'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isDevMode = supabaseUrl.includes('your-project') || !supabaseUrl;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Dev mode: accept any credentials and redirect
    if (isDevMode) {
      await new Promise((r) => setTimeout(r, 400));
      setLoading(false);
      router.push('/dashboard');
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    setEmail('jean.dupont@cabinet-archi.fr');
    setPassword('demo1234');
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#2563EB',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>A</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            ArchiPro
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px' }}>
            Connectez-vous à votre espace de gestion
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #d1d5db',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
            padding: '32px',
          }}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#b91c1c',
                  marginBottom: '20px',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@cabinet.fr"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #9ca3af',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#9ca3af'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #9ca3af',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#9ca3af'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: loading ? '#93c5fd' : '#2563EB',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'; }}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo access button (dev mode only) */}
          {isDevMode && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '12px' }}>
                Mode démonstration
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#059669',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#dcfce7'; e.currentTarget.style.borderColor = '#86efac'; } }}
                onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; } }}
              >
                Accès démo — Jean Dupont, Architecte
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: '#2563EB', fontWeight: 500, textDecoration: 'none' }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
