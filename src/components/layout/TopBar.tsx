import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const TopBar = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname === '/search') {
      setValue(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
    inputRef.current?.blur();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-40 md:left-[84px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 via-black/25 to-transparent" />

      <div className="relative flex items-center justify-center px-4 pb-3 pt-4 md:px-8 md:pt-5">
        <motion.form
          onSubmit={handleSubmit}
          animate={{ scale: focused ? 1.015 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={cn(
            'group relative flex w-full max-w-xl items-center gap-3 rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-colors duration-300',
            focused
              ? 'border-primary/50 bg-black/55 shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_18px_50px_-24px_hsl(var(--brand-glow)/0.8)]'
              : 'border-white/10 bg-black/35 hover:border-white/20'
          )}
        >
          <Search
            size={18}
            className={cn(
              'shrink-0 transition-colors',
              focused ? 'text-primary' : 'text-white/50'
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search movies, TV shows, anime..."
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/40 sm:block">
            Ctrl K
          </kbd>
          <button
            type="submit"
            aria-label="Search"
            className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white opacity-90 transition-opacity hover:opacity-100"
          >
            <Search size={15} />
          </button>
        </motion.form>

        <div className="absolute right-4 hidden items-center gap-3 md:right-8 md:flex">
          <Link
            to="/anime"
            aria-label="Anime"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white/60 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
          >
            <Sparkles size={17} />
          </Link>
          <Link
            to="/"
            aria-label="Profile"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-sm font-semibold text-white backdrop-blur-xl"
          >
            FF
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
