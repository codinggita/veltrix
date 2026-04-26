import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    <div className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary/30 bg-[#0A0A0A]">
      <TopNav />

      <main className="flex-grow pt-32 md:pt-40 pb-24 flex flex-col gap-24 md:gap-40">
        
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col items-center text-center z-10">
          <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full w-[300px] md:w-[1000px] h-[300px] md:h-[600px] -top-32 left-1/2 -translate-x-1/2 -z-10 pointer-events-none"></div>
          
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-headline font-extrabold text-5xl md:text-8xl tracking-tight text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]"
            >
              Master your <br className="hidden md:block"/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/50 to-primary italic">sovereign wealth.</span>
            </motion.h1>
            
            <p className="font-body text-base md:text-xl text-gray-400 max-w-2xl mb-12 md:mb-20 leading-relaxed font-light px-4">
              The definitive ledger for high-net-worth ecosystems. Escape legacy chaos and architect your financial future.
            </p>
          </motion.div>
          
          {/* Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="w-full relative rounded-[20px] md:rounded-[32px] overflow-hidden bg-black/40 backdrop-blur-lg border border-white/10 p-1 md:p-2 shadow-2xl flex-1"
          >
            <div className="w-full h-full bg-[#111111] rounded-[14px] md:rounded-[24px] border border-white/[0.05] overflow-hidden flex flex-col relative">
              <div className="h-10 md:h-12 border-b border-white/[0.05] flex items-center px-4 md:px-5 justify-between bg-white/[0.02]">
                <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div></div>
              </div>
              <div className="flex-1 flex p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
                <div className="hidden lg:flex w-48 flex-col gap-3">
                  <div className="h-9 bg-primary/20 rounded-md border border-primary/30 w-full"></div>
                  {[1,2,3].map(i => <div key={i} className="h-9 bg-white/5 rounded-md w-full"></div>)}
                </div>
                <div className="flex-1 flex flex-col gap-4 md:gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {STATS_DATA.map((s, i) => <div key={s.id} className={i === 2 ? 'hidden lg:block' : ''}><StatCard {...s} /></div>)}
                  </div>
                  <div className="flex-1 bg-[#1A1A1A] rounded-xl border border-white/[0.05] p-4 md:p-6 flex flex-col min-h-[150px]">
                    <div className="h-full flex items-end gap-2 md:gap-4 mt-auto">
                      {CHART_BARS.map((bar, i) => <div key={i} style={{ height: bar.h }} className={`w-full rounded-t-sm md:rounded-t-md ${bar.highlight ? 'bg-primary' : 'bg-primary/20'}`}></div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 bg-black/80 backdrop-blur-2xl p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/10 flex flex-col gap-1 md:gap-3 z-30 shadow-2xl scale-75 md:scale-100 origin-bottom-right">
              <span className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Total Liquidity
              </span>
              <span className="font-bold text-xl md:text-4xl text-white tracking-tight">₹ 84,20,500</span>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-white tracking-tight mb-12 md:mb-20 text-center">Engineering <span className="italic text-primary">Brilliance.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard title="Automated Invoicing" desc="Generate institutional-grade invoices instantly." VisualComponent={VisualInvoicing} gradientDirection="br" />
            <FeatureCard title="Deep Analytics" desc="Spectral visualizations reveal macro patterns." VisualComponent={VisualAnalytics} gradientDirection="bl" />
            <FeatureCard title="Client Mastery" desc="Unified CRM dossiers replace lost threads." VisualComponent={VisualClient} gradientDirection="tr" />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 w-full text-center relative pb-24">
          <div className="relative z-10 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[32px] p-10 md:p-20 shadow-2xl overflow-hidden flex flex-col items-center">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-white tracking-tight mb-6 leading-tight">Initialize Your Ledger.</h2>
            <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-12 max-w-lg font-light">Claim sovereignty over chaotic financial data in seconds.</p>
            <Link to={isAuthenticated ? "/app/dashboard" : "/signup"} className="bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-sm md:text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
