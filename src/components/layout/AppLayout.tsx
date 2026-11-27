import { useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

const AppLayout = () => {
  const location = useLocation();
  const isFullscreen =
    location.pathname.startsWith('/watch/') ||
    location.pathname.startsWith('/movie/') ||
    location.pathname.startsWith('/tv/');

  return (
    <div className="relative min-h-screen bg-black">
      {!isFullscreen && <Sidebar />}
      {!isFullscreen && <TopBar />}

      <main
        className={
          isFullscreen
            ? 'relative z-10 min-h-screen'
            : 'relative z-10 min-h-screen pb-24 md:pb-0 md:pl-24'
        }
      >
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <Outlet />
        </motion.div>
      </main>

      {!isFullscreen && <MobileNav />}
    </div>
  );
};

export default AppLayout;
