import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ==========================================
// 1. DATA CONSTANTS
// ==========================================
export const STATS_DATA = [
  { id: 'in', title: 'Inflow', value: '₹ 42,50,000', trend: '+12.5%', isPositive: true },
  { id: 'out', title: 'Outflow', value: '₹ 14,20,000', trend: '-2.4%', isPositive: false },
  { id: 'net', title: 'Net Position', value: '₹ 28,30,000', trend: '+18.2%', isPositive: true, isHighlight: true }
];

export const CHART_BARS = [
  { h: '30%', glow: false, highlight: false },
  { h: '45%', glow: false, highlight: false },
  { h: '35%', glow: false, highlight: false },
  { h: '60%', glow: false, highlight: false },
  { h: '80%', glow: true, highlight: false },
  { h: '55%', glow: false, highlight: false },
  { h: '100%', glow: true, highlight: true }
];

export const FOOTER_LINKS = ["Privacy", "Terms", "Advisory", "Support"];

// ==========================================
// 2. REUSABLE MICRO-COMPONENTS
// ==========================================
export const FadeInWhenVisible = ({ children, delay = 0, y = 30 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

import { useSelector } from 'react-redux';

export const TopNav = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#0A0A0A]/70 backdrop-blur-3xl shadow-none no-border border-b border-white/[0.02]"
    >
      <div className="flex justify-between items-center w-full px-8 py-5 mx-auto max-w-7xl">
        <div className="text-2xl font-black text-white tracking-tighter font-headline flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">currency_exchange</span>
          Veltrix
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-full scale-95 active:scale-90">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
          <Link to={isAuthenticated ? "/app/dashboard" : "/login"} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95">
            {isAuthenticated ? "Go to Dashboard" : "Access Terminal"}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export const Footer = () => (
  <footer className="bg-[#0A0A0A] w-full py-16 px-8 border-t border-white/5 relative z-10 mt-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start">
        <div className="text-xl font-bold text-white font-headline tracking-tighter mb-2 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-primary text-xl">currency_exchange</span>Veltrix
        </div>
        <p className="font-body text-xs tracking-wide text-gray-600">
          © 2026 Veltrix. Engineered for Sovereign Wealth.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {FOOTER_LINKS.map(link => (
          <a key={link} className="font-body text-xs tracking-wider uppercase text-gray-500 hover:text-white transition-colors" href="#">{link}</a>
        ))}
      </div>
    </div>
  </footer>
);

// ==========================================
// 3. UI MOCKUP COMPONENTS
// ==========================================
export const StatCard = ({ title, value, trend, isPositive, isHighlight }) => {
  const icon = isPositive ? 'trending_up' : 'trending_down';
  const color = isPositive ? (isHighlight ? 'text-primary' : 'text-emerald-400') : 'text-rose-400';
  
  if (isHighlight) {
    return (
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-[#1A1A1A] rounded-xl p-6 border border-primary/20 relative overflow-hidden group/card hover:border-primary/50 transition-colors cursor-default">
        <div className="absolute inset-0 bg-primary/5 group-hover/card:bg-primary/10 transition-colors"></div>
        <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] text-primary/70 mb-3 uppercase tracking-[0.2em] font-bold">{title}</div>
          <div className="text-3xl font-semibold text-white tabular-nums tracking-tight text-glow">{value}</div>
          <div className={`text-xs ${color} mt-3 font-medium flex items-center gap-1`}><span className="material-symbols-outlined text-[14px]">arrow_upward</span> {trend}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-[#1A1A1A] rounded-xl p-6 border border-white/[0.05] hover:bg-[#202020] transition-colors cursor-default">
      <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-[0.2em] font-bold">{title}</div>
      <div className="text-3xl font-semibold text-white tabular-nums tracking-tight">{value}</div>
      <div className={`text-xs ${color} mt-3 font-medium flex items-center gap-1`}><span className="material-symbols-outlined text-[14px]">{icon}</span> {trend}</div>
    </motion.div>
  );
};

// ==========================================
// 4. FEATURE VISUALS
// ==========================================
export const VisualInvoicing = () => (
  <div className="h-40 rounded-xl bg-black mb-10 relative overflow-hidden flex items-center justify-center border border-white/[0.05]">
    <span className="material-symbols-outlined text-5xl text-primary/40 group-hover:text-primary transition-colors duration-500 group-hover:scale-110">receipt_long</span>
    <div className="absolute bottom-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
      <div className="bg-[#1A1A1A] p-3 rounded-lg border border-white/10 shadow-2xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[14px] text-primary">check</span>
        </div>
        <div>
          <div className="text-[10px] text-gray-500">Invoice Paid</div>
          <div className="text-xs font-bold text-white">₹85,000</div>
        </div>
      </div>
    </div>
  </div>
);

export const VisualAnalytics = () => (
  <div className="h-40 rounded-xl bg-black mb-10 relative overflow-hidden flex items-end justify-between p-6 border border-white/[0.05]">
    <div className="w-1/4 bg-white/5 h-[40%] rounded-t-sm group-hover:h-[50%] transition-all duration-500"></div>
    <div className="w-1/4 bg-primary/20 h-[60%] rounded-t-sm border-t border-primary/50 group-hover:bg-primary/30 transition-all duration-500"></div>
    <div className="w-1/4 bg-white/5 h-[30%] rounded-t-sm group-hover:h-[20%] transition-all duration-500"></div>
    <div className="w-1/4 bg-primary/50 h-[80%] rounded-t-sm border-t-2 border-primary group-hover:h-[95%] group-hover:bg-primary/80 transition-all duration-500 shadow-[0_0_15px_rgba(79,70,229,0)] group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
  </div>
);

export const VisualClient = ({ isHovered }) => (
  <div className="h-40 rounded-xl bg-black mb-10 relative overflow-hidden flex items-center justify-center border border-white/[0.05]">
    <div className="flex relative items-center justify-center w-full">
      <motion.div 
        animate={{ x: isHovered ? -45 : -25 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-14 h-14 rounded-full bg-[#1A1A1A] border-4 border-[#111111] flex items-center justify-center z-30 shadow-2xl relative"
      >
        <span className="material-symbols-outlined text-gray-500">person</span>
        <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111111] animate-pulse"></div>
      </motion.div>
      
      <motion.div 
        animate={{ x: isHovered ? 0 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-14 h-14 rounded-full bg-[#202020] border-4 border-[#111111] flex items-center justify-center z-20 shadow-xl relative"
      >
        <span className="material-symbols-outlined text-primary/50">corporate_fare</span>
      </motion.div>
      
      <motion.div 
        animate={{ x: isHovered ? 45 : 25 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-14 h-14 rounded-full bg-primary/20 border-4 border-[#111111] flex items-center justify-center z-10 backdrop-blur-sm shadow-[0_0_20px_rgba(79,70,229,0.2)] relative"
      >
        <span className="text-xs text-primary font-bold">+12</span>
      </motion.div>
    </div>
    
    {/* Background pulsing circle on hover */}
    <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    <div className={`absolute w-60 h-60 bg-primary/10 rounded-full blur-[60px] transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
  </div>
);

export const FeatureCard = ({ title, desc, VisualComponent, gradientDirection }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#111111] rounded-[24px] p-10 border border-white/[0.05] hover:border-primary/30 transition-colors duration-500 flex flex-col h-full group relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-${gradientDirection} from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <VisualComponent isHovered={isHovered} />
      <h3 className="font-headline font-bold text-2xl text-white mb-4 relative z-10">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mt-auto relative z-10 text-left">{desc}</p>
    </div>
  );
};
