import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  User,
  Bell,
  Settings,
  SlidersHorizontal,
  Calendar,
  BarChart2,
  Package as BoxIcon,
  X,
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { PATHS } from '../routes/paths';
import useAuth from '../hooks/useAuth';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useAppTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate(PATHS.LOGIN);
    }
  };

  const menuItems = [
    { text: 'Orders', icon: <ShoppingBag size={20} />, path: PATHS.ADMIN_ORDERS },
    { text: 'Schedule', icon: <Calendar size={20} />, path: PATHS.ADMIN_SCHEDULE },
    { text: 'Products', icon: <BoxIcon size={20} />, path: PATHS.ADMIN_PRODUCTS },
    { text: 'Reports', icon: <BarChart2 size={20} />, path: PATHS.ADMIN_REPORTS },
    { text: 'Settings', icon: <Settings size={20} />, path: PATHS.ADMIN_SETTINGS },
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: PATHS.DASHBOARD },
    { text: 'Filters', icon: <SlidersHorizontal size={20} />, path: PATHS.ROOT, search: '?openFilters=1' },
    { text: 'Profile', icon: <User size={20} />, path: PATHS.PROFILE },
    { text: 'Settings', icon: <Settings size={20} />, path: PATHS.PROFILE },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 font-bold text-white">
          R
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">RentalSystem</span>
      </div>
      <hr className="border-border" />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive =
              item.path !== '#' &&
              (item.search
                ? location.pathname === item.path && location.search.includes('openFilters=1')
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));
            
            return (
              <li key={item.text}>
                <button
                  onClick={() => {
                    if (item.path !== '#') {
                      navigate(item.search ? { pathname: item.path, search: item.search } : item.path);
                      setMobileOpen(false);
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'
                    }
                  >
                    {item.icon}
                  </span>
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform border-r bg-background transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute right-4 top-4">
          <button onClick={() => setMobileOpen(false)} className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden w-[260px] shrink-0 border-r bg-background md:block">
        <div className="fixed h-full w-[260px]">{sidebarContent}</div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Appbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="mr-4 text-muted-foreground md:hidden"
            >
              <MenuIcon size={20} />
            </button>
            <h2 className="text-sm font-semibold">Workspace</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="rounded-md p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell size={20} />
            </button>
            <div className="mx-2 h-6 w-px bg-border"></div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                U
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-80 zoom-in-95">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(PATHS.PROFILE);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <User size={16} /> My Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(PATHS.PROFILE);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings size={16} /> Settings
                    </button>
                  </div>
                  <hr className="border-border" />
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
