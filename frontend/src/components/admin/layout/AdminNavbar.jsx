import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Package, BarChart2, Settings, ChevronDown, LogOut, User, FileText, X, Menu } from 'lucide-react';
import Logo from '../../ui/Logo';
import useAuth from '../../../hooks/useAuth';
import { PATHS } from '../../../routes/paths';
import { cn } from '../../../lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', path: PATHS.ADMIN_DASHBOARD, icon: LayoutDashboard, match: ['/admin'] },
  { label: 'Schedule', path: PATHS.ADMIN_SCHEDULE, icon: Calendar, match: ['/schedule'] },
  {
    label: 'Products', icon: Package, match: ['/products'],
    children: [
      { label: 'All Products', path: PATHS.ADMIN_PRODUCT_CREATE },
    ],
  },
  { label: 'Reports', path: PATHS.ADMIN_REPORTS, icon: BarChart2, match: ['/reports'] },
  {
    label: 'Settings', icon: Settings, match: ['/settings', '/users', '/quotations'],
    children: [
      { label: 'Users', path: PATHS.ADMIN_USERS },
      { label: 'Quotation Template', path: PATHS.ADMIN_QUOTATIONS },
    ],
  },
];

function NavDropdown({ item, isActive, navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground/70 hover:bg-accent hover:text-foreground'
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          {/* Click-away */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[160px] overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
            {item.children.map((child) => (
              <button
                key={child.label}
                onClick={() => { setOpen(false); navigate(child.path); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {child.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setProfileOpen(false);
    try { await logout(); } catch (err) { console.error(err); }
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate(PATHS.LOGIN, { replace: true });
    }
  };

  const isActive = (item) =>
    item.match?.some((m) => location.pathname.includes(m));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              if (item.children) {
                return (
                  <NavDropdown key={item.label} item={item} isActive={active} navigate={navigate} />
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Profile + Mobile toggle */}
        <div className="flex items-center gap-3">
          {/* User info (desktop) */}
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-bold leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {user?.role}
            </span>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-2 ring-primary/20 transition-shadow hover:ring-primary/40"
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); navigate(PATHS.PROFILE); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.path) { navigate(item.path); setMobileOpen(false); }
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive(item) ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
