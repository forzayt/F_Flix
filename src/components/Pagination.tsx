import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const max = Math.min(totalPages, 500);

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="glass flex h-11 items-center gap-1 rounded-2xl px-4 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={16} />
        Previous
      </motion.button>

      <span className="glass-soft rounded-2xl px-4 py-2.5 text-sm text-white/55">
        Page <span className="font-semibold text-white">{page}</span> of {max}
      </span>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange(page + 1)}
        disabled={page >= max}
        className="brand-gradient glow-primary flex h-11 items-center gap-1 rounded-2xl px-4 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
};

export default Pagination;
