import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { easeOutExpo } from '@/lib/motion';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader = ({ eyebrow, title, description, children }: PageHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: easeOutExpo }}
    className="mb-8"
  >
    {eyebrow && (
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/90">
        {eyebrow}
      </p>
    )}
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl">
      {title}
    </h1>
    {description && (
      <p className="mt-2 max-w-xl text-sm text-white/45 md:text-base">{description}</p>
    )}
    {children}
  </motion.div>
);

export default PageHeader;
