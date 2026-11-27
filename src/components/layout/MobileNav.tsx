import { NavLink } from 'react-router-dom';
import {
  Clapperboard,
  Home,
  Radio,
  Search,
  Sparkles,
  Tv,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/movies', label: 'Movies', icon: Clapperboard },
  { to: '/tv-series', label: 'TV', icon: Tv },
  { to: '/anime', label: 'Anime', icon: Sparkles },
  { to: '/Live', label: 'Live', icon: Radio },
  { to: '/search', label: 'Search', icon: Search },
];

const MobileNav = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-50 md:hidden"
    style={{
      background: 'linear-gradient(0deg, rgba(0,0,0,0.98) 60%, rgba(0,0,0,0) 100%)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}
  >
    <div className="flex h-[5.5rem] items-end justify-around px-2 pb-2">
      {tabs.map(({ to, label, icon: Icon, end }) => (
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
                'flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-transform duration-100 active:scale-90',
              )}
            >
              <Icon
                size={22}
                strokeWidth={1.7}
                className={cn(
                  'mb-0.5 transition-colors duration-150',
                  isActive
                    ? 'text-[hsl(258,80%,60%)]'
                    : 'text-white/[0.35]',
                )}
              />
              <span
                className={cn(
                  'text-[0.65rem] font-medium transition-colors duration-150',
                  isActive
                    ? 'text-[hsl(258,80%,60%)]'
                    : 'text-white/60',
                )}
              >
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileNav;
