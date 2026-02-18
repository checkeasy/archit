'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { NAV_ITEMS } from '@/lib/constants';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  Files,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

// Map icon string names from constants to actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  Files,
  Settings,
};

// Derive page title from the current route
function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Tableau de bord';
  const match = NAV_ITEMS.find(
    (item) => item.href !== '/dashboard' && pathname.startsWith(item.href)
  );
  return match?.label ?? 'Tableau de bord';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, setProfile, setLoading: setAuthLoading } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch the user profile from Supabase on mount
  useEffect(() => {
    async function loadProfile() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const isDevMode = supabaseUrl.includes('your-project') || !supabaseUrl;

      // Dev mode: use mock profile
      if (isDevMode) {
        setProfile({
          id: 'dev-user',
          email: 'jean.dupont@cabinet-archi.fr',
          full_name: 'Jean Dupont',
          avatar_url: null,
          role: 'architect',
          firm_name: 'Atelier Dupont Architecture',
          phone: '06 12 34 56 78',
          address: '15 rue de la Paix, 75002 Paris',
          siret: '123 456 789 00012',
          created_at: '2025-01-01',
          updated_at: '2026-02-18',
        });
        setAuthLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name ?? user.email ?? '',
          avatar_url: null,
          role: 'architect',
          firm_name: null,
          phone: null,
          address: null,
          siret: null,
          created_at: user.created_at,
          updated_at: user.created_at,
        });
      }

      setAuthLoading(false);
    }

    loadProfile();
  }, [router, setProfile, setAuthLoading]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/login');
  }, [router, setProfile]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  // Check if a nav item is the currently active route
  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const displayName = profile?.full_name ?? profile?.email ?? '';
  const initials = displayName ? getInitials(displayName) : '?';
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* ============================== */}
      {/* Mobile overlay                 */}
      {/* ============================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================== */}
      {/* Sidebar                        */}
      {/* ============================== */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand + mobile close */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: '#2563EB' }}
            >
              A
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              ArchiPro
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const IconComponent = ICON_MAP[item.icon];
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative',
                      active
                        ? 'text-[#2563eb] bg-[#eff6ff]'
                        : 'text-[#6b7280] hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    {/* Left accent bar for active item */}
                    {active && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                        style={{ backgroundColor: '#2563eb' }}
                      />
                    )}
                    {IconComponent && (
                      <IconComponent
                        className="h-[18px] w-[18px] shrink-0"
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-gray-100 p-3 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            {/* Initials avatar */}
            {profile ? (
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ backgroundColor: '#2563EB' }}
              >
                {initials}
              </div>
            ) : (
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
            )}

            {/* Name and firm */}
            <div className="flex-1 min-w-0">
              {profile ? (
                <>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile.firm_name ?? profile.email ?? ''}
                  </p>
                </>
              ) : (
                <>
                  <span className="block h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <span className="block h-3 w-32 bg-gray-100 rounded animate-pulse mt-1.5" />
                </>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Se deconnecter"
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================== */}
      {/* Top header                     */}
      {/* ============================== */}
      <header className="fixed top-0 right-0 left-0 lg:left-[260px] z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
        {/* Left side: hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </div>

        {/* Right side: notifications + user avatar */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

          {/* User avatar in header */}
          {profile ? (
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white cursor-default"
              style={{ backgroundColor: '#2563EB' }}
              title={displayName}
            >
              {initials}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          )}

        </div>
      </header>

      {/* ============================== */}
      {/* Main content area              */}
      {/* ============================== */}
      <main className="lg:ml-[260px] pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
