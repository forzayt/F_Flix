import { NavLink } from 'react-router-dom';
import {
  Clapperboard,
  Github,
  Home,
  Sparkles,
  Tv,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navTabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/movies', label: 'Movies', icon: Clapperboard },
  { to: '/tv-series', label: 'TV Series', icon: Tv },
  { to: '/anime', label: 'Anime', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 flex-col items-center bg-transparent md:flex">
      {/* ── Stremio-style logo area ── */}
      <NavLink
        to="/"
        aria-label="Forza Flix home"
        className="flex h-[5.5rem] w-full items-center justify-center"
      >
        <img
          src="/favicon.png"
          alt="Forza Flix"
          className="h-10 w-10 object-contain opacity-90"
        />
      </NavLink>

      {/* ── Tab buttons (Stremio VerticalNavBar style) ── */}
      <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto py-2 scrollbar-hide">
        {navTabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className="group"
          >
            {({ isActive }) => (
              <div
                className={cn(
                  'flex h-[4.2rem] w-[4.2rem] flex-col items-center justify-center rounded-xl transition-colors duration-150',
                  isActive
                    ? 'bg-white/[0.05]'
                    : 'hover:bg-white/[0.05]',
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={1.7}
                  className={cn(
                    'mb-1 transition-colors duration-150',
                    isActive
                      ? 'text-[hsl(258,80%,60%)]'
                      : 'text-white/[0.35] group-hover:text-white/60',
                  )}
                />
                <span
                  className={cn(
                    'max-w-full truncate px-1 text-[0.65rem] font-medium leading-tight transition-all duration-150',
                    isActive
                      ? 'text-[hsl(258,80%,60%)]'
                      : 'text-white/0 group-hover:text-white/60',
                  )}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}

        {/* ── GitHub external link (last in order) ── */}
        <a
          href="https://github.com/forzayt/F_Flix"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="group"
        >
          <div className="flex h-[4.2rem] w-[4.2rem] flex-col items-center justify-center rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
            <Github
              size={22}
              strokeWidth={1.7}
              className="mb-1 text-white/[0.35] transition-colors duration-150 group-hover:text-white/60"
            />
            <span className="max-w-full truncate px-1 text-[0.65rem] font-medium leading-tight text-white/0 transition-all duration-150 group-hover:text-white/60">
              GitHub
            </span>
          </div>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
