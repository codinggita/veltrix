import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../../components/ui/SEO';
import { 
  STATS_DATA, 
  CHART_BARS, 
  FadeInWhenVisible, 
  TopNav, 
  Footer, 
  StatCard, 
  FeatureCard, 
  VisualInvoicing, 
  VisualAnalytics, 
  VisualClient 
} from '../../components/landing/LandingComponents';

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary/30 bg-[#09090B]">
      <SEO 
        title="Master Your Sovereign Wealth" 
        description="The definitive ledger for high-net-worth ecosystems. Escape legacy chaos and architect your financial future with Veltrix."
      />
      <TopNav />

      <main className="flex-grow pt-32 md:pt-40 pb-24 flex flex-col gap-24 md:gap-40">
        
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col items-center text-center z-10">
          <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full w-[300px] md:w-[1000px] h-[300px] md:h-[600px] -top-32 left-1/2 -translate-x-1/2 -z-10 pointer-events-none mix-blend-screen"></div>
          
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0, 0, 1] }}
              className="font-headline font-black text-5xl md:text-8xl tracking-tighter text-white mb-6 md:mb-8 leading-[1.05]"
            >
              Master your <br className="hidden md:block"/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-primary italic">sovereign wealth.</span>
            </motion.h1>
            
            <p className="font-body text-base md:text-xl text-text-secondary max-w-2xl mb-12 md:mb-20 leading-relaxed font-medium px-4 tracking-tight">
              The definitive ledger for high-net-worth ecosystems. Escape legacy chaos and architect your financial future.
            </p>
          </motion.div>
          
          {/* Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0, 0, 1] }}
            className="w-full relative rounded-[24px] md:rounded-[36px] overflow-hidden glass-panel p-1.5 md:p-2.5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] flex-1 ring-1 ring-white/10"
          >
            <div className="w-full h-full bg-[#09090B] rounded-[18px] md:rounded-[28px] border border-white/5 overflow-hidden flex flex-col relative shadow-inner">
              <div className="h-10 md:h-12 border-b border-white/[0.05] flex items-center px-4 md:px-5 justify-between bg-white/[0.01]">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm"></div><div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div><div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm"></div></div>
              </div>
              <div className="flex-1 flex p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
                <div className="hidden lg:flex w-52 flex-col gap-3">
                  <div className="h-10 bg-primary/20 rounded-xl border border-primary/30 w-full shadow-[0_0_15px_rgba(99,102,241,0.2)]"></div>
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl w-full"></div>)}
                </div>
                <div className="flex-1 flex flex-col gap-4 md:gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {STATS_DATA.map((s, i) => <div key={s.id} className={i === 2 ? 'hidden lg:block' : ''}><StatCard {...s} /></div>)}
                  </div>
                  <div className="flex-1 premium-card rounded-2xl p-4 md:p-6 flex flex-col min-h-[150px]">
                    <div className="h-full flex items-end gap-2 md:gap-4 mt-auto">
                      {CHART_BARS.map((bar, i) => <div key={i} style={{ height: bar.h }} className={`w-full rounded-t-sm md:rounded-t-md transition-all duration-1000 ${bar.highlight ? 'bg-primary shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-white/10'}`}></div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 glass-panel p-5 md:p-8 rounded-2xl md:rounded-3xl flex flex-col gap-1 md:gap-2 z-30 shadow-[0_20px_40px_rgba(0,0,0,0.5)] scale-75 md:scale-100 origin-bottom-right ring-1 ring-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_#10B981]"></span>Billing Momentum
                </span>
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-black tracking-widest">+18.4%</span>
              </div>
              <span className="font-black text-2xl md:text-4xl text-white tracking-tight tabular-nums">₹ 3,39,161</span>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-20">
          <h2 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tighter mb-12 md:mb-20 text-center">Engineering <span className="italic text-primary text-glow">Brilliance.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard title="Automated Invoicing" desc="Generate institutional-grade invoices instantly." VisualComponent={VisualInvoicing} gradientDirection="br" />
            <FeatureCard title="Deep Analytics" desc="Spectral visualizations reveal macro patterns." VisualComponent={VisualAnalytics} gradientDirection="bl" />
            <FeatureCard title="Client Mastery" desc="Unified CRM dossiers replace lost threads." VisualComponent={VisualClient} gradientDirection="tr" />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 w-full text-center relative pb-24">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full z-0 mix-blend-screen"></div>
          <div className="relative z-10 glass-panel rounded-[32px] md:rounded-[40px] p-12 md:p-24 shadow-2xl overflow-hidden flex flex-col items-center ring-1 ring-white/10">
            <h2 className="font-headline font-black text-4xl md:text-6xl text-white tracking-tighter mb-6 leading-tight">Initialize Your Ledger.</h2>
            <p className="text-text-secondary text-base md:text-xl mb-10 md:mb-14 max-w-xl font-medium tracking-tight">Claim sovereignty over chaotic financial data in seconds.</p>
            <Link to={isAuthenticated ? "/app/dashboard" : "/signup"} className="bg-white text-[#09090B] px-10 md:px-14 py-4 md:py-5 rounded-full font-black text-sm md:text-lg hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all scale-btn flex items-center gap-3">
              {isAuthenticated ? "Enter Dashboard" : "Start Free Trial"}
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
