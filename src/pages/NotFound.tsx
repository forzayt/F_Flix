import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-highlight glass w-full max-w-md rounded-3xl px-8 py-12 text-center"
      >
        <p className="text-gradient font-display text-7xl font-extrabold">404</p>
        <h1 className="mt-3 text-xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-white/45">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="brand-gradient glow-primary mt-8 inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          <Home size={16} />
          Return home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
