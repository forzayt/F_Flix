import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Home, Radio, Search, Sparkles, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/movies', label: 'Movies', icon: Clapperboard },
  { to: '/tv-series', label: 'TV', icon: Tv },
  { to: '/anime', label: 'Anime', icon: Sparkles },
  { to: '/Live', label: 'Live', icon: Radio },
  { to: '/search', label: 'Search', icon: Search },
];

const MobileNav = () => (
  <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden">
    <div className="glass-strong flex items-center justify-around rounded-3xl px-2 py-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} aria-label={label} className="relative">
          {({ isActive }) => (
            <span className="relative flex h-11 w-11 items-center justify-center">
              {isActive && (
                <motion.span
                  layoutId="mobile-active"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="brand-gradient absolute inset-0 rounded-2xl opacity-90"
                />
              )}
              <Icon
                size={19}
                strokeWidth={1.9}
                className={cn(
                  'relative transition-colors',
                  isActive ? 'text-white' : 'text-white/50'
                )}
              />
            </span>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileNav;
