import React from 'react';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-400">
      <Navbar />
      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Background blobs for tech aesthetic */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
