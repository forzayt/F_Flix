import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clapperboard,
  Home,
  Play,
  Radio,
  Search,
  Sparkles,
  Tv,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/movies', label: 'Movies', icon: Clapperboard },
  { to: '/tv-series', label: 'TV Series', icon: Tv },
  { to: '/anime', label: 'Anime', icon: Sparkles },
  { to: '/Live', label: 'Live TV', icon: Radio },
  { to: '/search', label: 'Search', icon: Search },
];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[84px] flex-col items-center justify-between border-r border-white/[0.06] bg-[hsl(240_24%_5%/0.72)] py-5 backdrop-blur-2xl md:flex">
      {/* Logo */}
      <NavLink to="/" aria-label="Forza Flix home" className="group relative">
        <motion.span
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="brand-gradient glow-primary flex h-11 w-11 items-center justify-center rounded-2xl text-white"
        >
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </motion.span>
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          Forza Flix
        </span>
      </NavLink>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} aria-label={label} className="group relative">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="rail-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="brand-gradient absolute inset-0 rounded-2xl opacity-90 shadow-[0_10px_30px_-10px_hsl(var(--brand-glow)/0.8)]"
                  />
                )}
                <motion.span
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    'relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                  )}
                >
                  <Icon size={21} strokeWidth={1.9} />
                </motion.span>
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Profile"
        className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white"
      >
        <UserRound size={19} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[hsl(240_24%_5%)]" />
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:opacity-100">
          Profile
        </span>
      </motion.button>
    </aside>
  );
};

export default Sidebar;
