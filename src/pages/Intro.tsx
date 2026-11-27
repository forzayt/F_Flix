import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles } from 'lucide-react';

const SIGNUP_FORM = 'signup';
const LOGIN_FORM = 'login';

const Intro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<'signup' | 'login'>(SIGNUP_FORM);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (form === SIGNUP_FORM && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // For now, just navigate to the main app
    navigate('/');
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  const switchForm = () => {
    setForm(form === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* ───── Blurred gradient background (Stremio-style) ───── */}
      <div className="pointer-events-none fixed inset-[-4rem] -z-10">
        {/* Bottom-left blob */}
        <div
          className="absolute -bottom-[20%] -left-[10%] h-[65%] w-[55%] rounded-full opacity-80"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(258 90% 55% / 0.45) 0%, hsl(240 70% 20% / 0.25) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Top-right blob */}
        <div
          className="absolute -right-[10%] -top-[20%] h-[60%] w-[55%] rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(224 90% 56% / 0.35) 0%, hsl(258 60% 30% / 0.2) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Subtle center glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(258 80% 60% / 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ───── Heading / Branding ───── */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-12 flex flex-col items-center text-center md:mb-16"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="brand-gradient glow-primary mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-2xl md:h-20 md:w-20 md:rounded-[1.5rem]"
        >
          <Play size={32} fill="currentColor" className="ml-1 md:ml-1.5" />
        </motion.div>

        {/* Title */}
        <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Forza Flix
        </h1>

        {/* Slogan */}
        <p className="text-lg font-normal text-white/50 md:text-xl">
          All the entertainment you love, in one place
        </p>
      </motion.div>

      {/* ───── Content: Form + Options (side-by-side on desktop) ───── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        className="flex w-full max-w-[52rem] flex-col-reverse items-start justify-center gap-8 px-6 md:flex-row md:gap-6 md:px-4"
      >
        {/* ── Left: Email / Password Form ── */}
        <form onSubmit={handleSubmit} className="w-full md:w-[22rem]" noValidate>
          {/* Email */}
          <div className="relative mb-3">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 backdrop-blur-sm transition-colors focus:border-primary/50 focus:bg-white/[0.07] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-3.5 pl-11 pr-11 text-sm text-white placeholder:text-white/35 backdrop-blur-sm transition-colors focus:border-primary/50 focus:bg-white/[0.07] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/60"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm password (signup only) */}
          <AnimatePresence mode="wait">
            {form === SIGNUP_FORM && (
              <motion.div
                key="confirm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="relative mb-3">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 backdrop-blur-sm transition-colors focus:border-primary/50 focus:bg-white/[0.07] focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot password (login only) */}
          {form === LOGIN_FORM && (
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                className="text-xs text-primary/80 transition-colors hover:text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3 rounded-lg bg-red-500/10 px-4 py-2.5 text-center text-xs font-medium text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-transparent py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[hsl(240,25%,5%)]"
          >
            {form === SIGNUP_FORM ? 'Sign Up' : 'Log In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* ── Right: Social / Alternative buttons ── */}
        <div className="flex w-full flex-col gap-3 md:ml-4 md:w-[22rem]">
          {/* Google button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-3.5 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Apple button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white/90 py-3.5 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-white hover:shadow-lg"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>

          {/* Switch form button */}
          <button
            type="button"
            onClick={switchForm}
            className="mt-1 flex w-full items-center justify-center rounded-full border-2 border-white/90 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[hsl(240,25%,5%)]"
          >
            {form === SIGNUP_FORM ? 'Log In' : 'Sign Up with Email'}
          </button>

          {/* Guest login (signup only) */}
          {form === SIGNUP_FORM && (
            <button
              type="button"
              onClick={handleGuestLogin}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/90 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[hsl(240,25%,5%)]"
            >
              <User size={16} />
              Continue as Guest
            </button>
          )}
        </div>
      </motion.div>

      {/* ───── Footer badge ───── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center gap-2 text-xs text-white/25"
      >
        <Sparkles size={12} />
        Powered by Forza Flix
      </motion.div>
    </div>
  );
};

export default Intro;
