import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ title, actions, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 min-h-screen bg-bg-primary"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
            <span>Veltrix Dashboard</span>
            <span>&bull;</span>
            <span className="capitalize">{title}</span>
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="animate-in fade-in duration-500">{children}</div>
    </motion.div>
  );
};

export default PageWrapper;
