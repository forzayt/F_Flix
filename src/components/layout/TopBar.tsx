import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSearchPage = location.pathname === '/search';
  const urlQuery = isSearchPage ? searchParams.get('q') || '' : '';

  const [value, setValue] = useState(urlQuery);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchPage) {
      setValue(urlQuery);
      inputRef.current?.focus();
    } else {
      setValue('');
    }
  }, [isSearchPage, urlQuery]);

  // Live-update search query param when typing on /search
  useEffect(() => {
    if (!isSearchPage) return;
    const trimmed = value.trim();
    if (trimmed === urlQuery) return;
    const timer = setTimeout(() => {
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [value, isSearchPage, urlQuery, setSearchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!isSearchPage) {
          navigate('/search');
        } else {
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchPage, navigate]);

  const handleBarClick = () => {
    if (!isSearchPage) {
      navigate('/search');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setValue('');
    if (isSearchPage) {
      setSearchParams({}, { replace: true });
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-x-0 top-0 z-40 md:left-24"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Top-bar row: search centered, profile on right */}
      <div className="flex h-[5.5rem] items-center justify-between px-4">
        {/* Spacer for balance */}
        <div className="hidden w-14 md:block" />

        {/* ── Stremio-style search bar ── */}
        <form
          onSubmit={handleSubmit}
          onClick={handleBarClick}
          className={cn(
            'relative flex h-[3.25rem] w-full max-w-[30rem] items-center rounded-full transition-colors duration-200',
            focused || isSearchPage
              ? 'bg-white/[0.08]'
              : 'cursor-pointer bg-white/[0.05] hover:bg-white/[0.07]',
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            readOnly={!isSearchPage}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search or paste a link"
            aria-label="Search"
            className={cn(
              'h-full flex-1 bg-transparent pl-8 pr-2 text-sm font-medium text-white/90 placeholder:text-white/[0.6] focus:outline-none',
              !isSearchPage && 'cursor-pointer',
            )}
          />
          {value.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-full items-center justify-center px-5 text-white/60 transition-colors hover:text-white"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Search"
              className="flex h-full items-center justify-center px-5"
            >
              <Search size={18} strokeWidth={1.8} className="text-white/60" />
            </button>
          )}
        </form>

        {/* ── Profile button (Stremio NavMenu trigger style) ── */}
        <button
          type="button"
          aria-label="Profile"
          className="flex h-14 w-14 items-center justify-center rounded-xl opacity-60 transition-opacity hover:bg-white/[0.05] hover:opacity-100"
        >
          <User size={22} strokeWidth={1.7} className="text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
