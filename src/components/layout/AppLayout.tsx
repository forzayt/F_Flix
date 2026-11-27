import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/watch/');

  return (
    <div className="relative min-h-screen">
      {/* Ambient aurora background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="aurora left-[-12%] top-[-8%] h-[440px] w-[440px] animate-float-slow bg-primary/25" />
        <div className="aurora right-[-10%] top-[16%] h-[380px] w-[380px] animate-pulse-glow bg-blue-500/15" />
        <div className="aurora bottom-[-16%] left-[28%] h-[420px] w-[420px] bg-fuchsia-500/10" />
      </div>

      {!isPlayer && <Sidebar />}
      {!isPlayer && <TopBar />}

      <main
        className={
          isPlayer
            ? 'relative z-10 min-h-screen'
            : 'relative z-10 min-h-screen pb-24 md:pb-0 md:pl-[84px]'
        }
      >
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.div>
      </main>

      {!isPlayer && <MobileNav />}
    </div>
  );
};

export default AppLayout;
