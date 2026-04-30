import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export const STATS_DATA = [
  { id: 'rev', title: 'Total Revenue', value: '₹ 11,47,584', trend: '+12.5%', isPositive: true },
  { id: 'pend', title: 'Pending Amount', value: '₹ 2,45,000', trend: '-2.1%', isPositive: true }, // Less pending is good
  { id: 'act', title: 'Active Invoices', value: '71', trend: '+8', isPositive: true, isHighlight: true }
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

export const TopNav = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#0A0A0A]/70 backdrop-blur-3xl border-b border-white/[0.02]"
    >
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 md:py-5 mx-auto max-w-7xl">
        <div className="text-xl md:text-2xl font-black text-white tracking-tighter font-headline flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-2xl md:text-3xl transition-transform group-hover:rotate-12">currency_exchange</span>
          Veltrix
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <button className="hidden md:flex text-gray-400 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-full scale-95 active:scale-90">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
          <Link to={isAuthenticated ? "/app/dashboard" : "/login"} className="bg-white text-black px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
            {isAuthenticated ? "Dashboard" : "Access Terminal"}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export const Footer = () => (
  <footer className="bg-[#0A0A0A] w-full py-12 md:py-16 px-6 md:px-8 border-t border-white/5 relative z-10 mt-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="text-xl font-bold text-white font-headline tracking-tighter mb-2 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-primary text-xl">currency_exchange</span>Veltrix
        </div>
        <p className="font-body text-[10px] md:text-xs tracking-wide text-gray-600 uppercase font-black">
          © 2026 Veltrix. Engineered for Sovereign Wealth.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {FOOTER_LINKS.map(link => (
          <a key={link} className="font-body text-[10px] md:text-xs tracking-wider uppercase text-gray-500 hover:text-white transition-colors" href="#">{link}</a>
        ))}
      </div>
    </div>
  </footer>
);

export const StatCard = ({ title, value, trend, trendIcon, trendColor, isHighlight }) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className={`bg-[#1A1A1A] rounded-xl p-3 md:p-6 border ${isHighlight ? 'border-primary/20' : 'border-white/[0.05]'} relative overflow-hidden group/card transition-colors cursor-default`}>
      {isHighlight && <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>}
      <div className="relative z-10">
        <div className={`text-[8px] md:text-[10px] ${isHighlight ? 'text-primary/70' : 'text-gray-500'} mb-1 md:mb-3 uppercase tracking-[0.2em] font-bold truncate`}>{title}</div>
        <div className="text-base md:text-2xl lg:text-3xl font-black text-white tabular-nums tracking-tighter whitespace-nowrap overflow-hidden">{value}</div>
        <div className={`text-[8px] md:text-xs ${trendColor} mt-1 md:mt-3 font-bold flex items-center gap-0.5`}><span className="material-symbols-outlined text-[10px] md:text-[14px]">{trendIcon}</span> {trend}</div>
      </div>
    </motion.div>
  );
};

export const VisualInvoicing = () => (
  <div className="h-32 md:h-40 rounded-xl bg-black mb-6 md:mb-10 relative overflow-hidden flex items-center justify-center border border-white/[0.05]">
    <span className="material-symbols-outlined text-4xl md:text-5xl text-primary/40 group-hover:text-primary transition-colors duration-500 group-hover:scale-110">receipt_long</span>
  </div>
);

export const VisualAnalytics = () => (
  <div className="h-32 md:h-40 rounded-xl bg-black mb-6 md:mb-10 relative overflow-hidden flex items-end justify-between p-4 md:p-6 border border-white/[0.05]">
    <div className="w-1/4 bg-white/5 h-[40%] rounded-t-sm group-hover:h-[50%] transition-all duration-500"></div>
    <div className="w-1/4 bg-primary/20 h-[60%] rounded-t-sm border-t border-primary/50 group-hover:bg-primary/30 transition-all duration-500"></div>
    <div className="w-1/4 bg-white/5 h-[30%] rounded-t-sm group-hover:h-[20%] transition-all duration-500"></div>
    <div className="w-1/4 bg-primary/50 h-[80%] rounded-t-sm border-t-2 border-primary group-hover:h-[95%] group-hover:bg-primary/80 transition-all duration-500"></div>
  </div>
);

export const VisualClient = ({ isHovered }) => (
  <div className="h-32 md:h-40 rounded-xl bg-black mb-6 md:mb-10 relative overflow-hidden flex items-center justify-center border border-white/[0.05]">
    <div className="flex relative items-center justify-center w-full">
      <motion.div animate={{ x: isHovered ? -35 : -15 }} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#1A1A1A] border-4 border-[#111111] flex items-center justify-center z-30 shadow-2xl relative">
        <span className="material-symbols-outlined text-gray-500 text-sm md:text-base">person</span>
      </motion.div>
      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#202020] border-4 border-[#111111] flex items-center justify-center z-20 relative">
        <span className="material-symbols-outlined text-primary/50 text-sm md:text-base">corporate_fare</span>
      </div>
      <motion.div animate={{ x: isHovered ? 35 : 15 }} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary/20 border-4 border-[#111111] flex items-center justify-center z-10 backdrop-blur-sm relative">
        <span className="text-[10px] md:text-xs text-primary font-bold">+12</span>
      </motion.div>
    </div>
  </div>
);

export const FeatureCard = ({ title, desc, VisualComponent, gradientDirection }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      className="bg-[#111111] rounded-[24px] p-8 md:p-10 border border-white/[0.05] hover:border-primary/30 transition-colors duration-500 flex flex-col h-full group relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-${gradientDirection} from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <VisualComponent isHovered={isHovered} />
      <h3 className="font-headline font-bold text-xl md:text-2xl text-white mb-3 md:mb-4 relative z-10">{title}</h3>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-auto relative z-10 text-left">{desc}</p>
    </div>
  );
};
