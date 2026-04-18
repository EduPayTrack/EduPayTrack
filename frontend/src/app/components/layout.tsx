import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useAuth } from '../state/auth-context';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
    >
      <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, navItems, logout, notifications } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const roleLabel =
    user?.role === 'admin' ? 'Administrator' :
    user?.role === 'accounts' ? 'Accounts Staff' :
    'Student';

  const roleBadgeColor =
    user?.role === 'admin' ? 'bg-primary/15 text-primary border-primary/25' :
    user?.role === 'accounts' ? 'bg-info/15 text-info border-info/25' :
    'bg-success/15 text-success border-success/25';

  return (
    <>
      {/* Brand header */}
      <div className="flex items-center gap-2.5 px-3 h-12 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-[13px] text-sidebar-accent-foreground tracking-tight">
            EduPayTrack
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href));
            
          const isNotifs = item.label === 'Notifications';

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:translate-x-0.5'
              )}
            >
              <div className="relative">
                <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {isNotifs && unreadCount > 0 && (
                  <span
                    key={`dot-${unreadCount}`}
                    className="absolute -top-[2px] -right-[2px] h-[8px] w-[8px] rounded-full bg-primary ring-2 ring-sidebar border border-transparent animate-in zoom-in fade-in duration-200"
                  />
                )}
              </div>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {isNotifs && unreadCount > 0 && (
                <div
                  key={`badge-${unreadCount}`}
                  className="flex h-[18px] min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground animate-in zoom-in fade-in duration-200"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — user info */}
      <div className="border-t border-sidebar-border p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-[11px] font-bold leading-none flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-accent-foreground truncate leading-tight">
              {user?.name || 'User'}
            </p>
            <Badge variant="outline" className={`text-[9px] h-4 px-1.5 mt-0.5 ${roleBadgeColor}`}>
              {roleLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function AppSidebar() {
  return (
    <aside className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 w-56">
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex md:hidden items-center justify-between h-12 border-b border-border bg-background/95 backdrop-blur-sm px-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-56 bg-sidebar border-sidebar-border">
              <div className="flex flex-col h-full">
                <SidebarContent onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="font-bold text-[13px] text-foreground tracking-tight">EduPayTrack</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
