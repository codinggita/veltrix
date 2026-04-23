import React from 'react';
import { Link } from 'react-router-dom';
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

// ==========================================
// MAIN PAGE
// ==========================================
const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-white bg-[#0A0A0A]">
      <TopNav />

      <main className="flex-grow pt-40 pb-24 flex flex-col gap-40">
        
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-8 w-full flex flex-col items-center text-center z-10 pt-8 lg:pt-16 min-h-[90vh]">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full w-[1000px] h-[600px] -top-32 left-1/2 -translate-x-1/2 -z-10 pointer-events-none mix-blend-screen"></div>
          
          {/* Title & Copy */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline font-extrabold text-6xl md:text-8xl tracking-tight text-white mb-8 max-w-5xl leading-[1.05] drop-shadow-2xl mt-4"
            >
              Master your <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-container to-primary italic">sovereign wealth.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-xl text-gray-400 max-w-2xl mb-20 leading-relaxed font-light"
            >
              The definitive ledger for high-net-worth ecosystems. Escape legacy chaos and architect your financial future with atmospheric precision.
            </motion.p>
          </motion.div>
          
          {/* Visual Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 80, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative rounded-[24px] overflow-hidden bg-black/40 backdrop-blur-lg border border-white/10 p-2 shadow-[0_0_100px_rgba(79,70,229,0.15)] flex-1 group"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-full bg-[#111111] rounded-[16px] border border-white/[0.05] overflow-hidden flex flex-col relative shadow-2xl z-10"
            >
              {/* Window Header */}
              <div className="h-12 border-b border-white/[0.05] flex items-center px-5 justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20"></div>
                </div>
                <div className="flex gap-4 opacity-50">
                  <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                  <div className="h-2 w-8 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Window Body */}
              <div className="flex-1 flex p-5 gap-5">
                {/* Sidebar Mock */}
                <motion.div 
                  initial="hidden" animate="visible"
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
                  className="w-48 flex flex-col gap-3"
                >
                  <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="h-9 bg-primary/20 rounded-md border border-primary/30 flex items-center px-4 relative overflow-hidden">
                    <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000"></motion.div>
                    <div className="h-2 w-16 bg-primary/80 rounded-full"></div>
                  </motion.div>
                  {[12, 20, 16].map((w, i) => (
                    <motion.div key={i} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="h-9 hover:bg-white/5 transition-colors rounded-md flex items-center px-4">
                      <div className={`h-2 w-${w} bg-white/20 rounded-full`}></div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-5">
                  {/* Top Stats Cards */}
                  <motion.div 
                    initial="hidden" animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 1.2 } } }}
                    className="grid grid-cols-3 gap-5"
                  >
                    {STATS_DATA.map(stat => <StatCard key={stat.id} {...stat} />)}
                  </motion.div>

                  {/* Capital Velocity Chart Mock */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="flex-1 bg-[#1A1A1A] rounded-xl border border-white/[0.05] p-6 flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
                    <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8 relative z-10">Capital Velocity Target</div>
                    
                    <div className="flex-1 flex items-end gap-4 relative z-10">
                      {CHART_BARS.map((bar, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: bar.h }}
                          transition={{ duration: 1, delay: 1.8 + (i * 0.1), type: "spring", stiffness: 50 }}
                          className="w-full relative group/bar flex flex-col justify-end"
                        >
                          <div className={`w-full h-full rounded-t-md transition-all duration-300 ${bar.highlight ? 'bg-primary/50 group-hover/bar:bg-primary/70' : 'bg-primary/20 group-hover/bar:bg-primary/40'}`}>
                            <div className={`absolute top-0 w-full h-1 rounded-t-md ${bar.highlight ? 'bg-primary shadow-[0_0_20px_rgba(79,70,229,0.8)]' : 'bg-white/20 group-hover/bar:bg-white/40'} ${bar.glow ? 'animate-pulse' : ''}`}></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Total Liquidity Widget (Overlaying the mockup) */}
            <motion.div 
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8, type: "spring", stiffness: 60 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 flex flex-col gap-3 z-30 shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-pointer group/total"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover/total:bg-primary/10 transition-colors rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-transparent rounded-2xl blur-lg opacity-0 group-hover/total:opacity-100 transition-opacity duration-500"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-[0.25em] font-bold relative z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Total Appraised Liquidity
              </span>
              <span className="font-body font-bold text-4xl text-white tabular-nums tracking-tight relative z-10">₹ 84,20,500</span>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURE SHOWCASE */}
        <section className="max-w-7xl mx-auto px-8 w-full mt-32">
          <FadeInWhenVisible>
            <h2 className="font-headline font-bold text-4xl text-white tracking-tight mb-20 text-center">Engineering <span className="italic text-primary">Brilliance.</span></h2>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInWhenVisible delay={0.1}>
              <FeatureCard 
                title="Automated Invoicing" 
                desc="Generate and deploy institutional-grade invoices instantly. Track settlement with uncompromising clarity and eliminate manual follow-ups."
                VisualComponent={VisualInvoicing}
                gradientDirection="br"
              />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.3}>
              <FeatureCard 
                title="Deep Analytics" 
                desc="Transform raw data into strategic narrative. Spectral visualizations reveal macro patterns invisible to standard spreadsheets."
                VisualComponent={VisualAnalytics}
                gradientDirection="bl"
              />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.5}>
              <FeatureCard 
                title="Client Mastery" 
                desc="Maintain sovereign control over client relationships. Unified CRM dossiers replace fragmented and lost communication threads."
                VisualComponent={VisualClient}
                gradientDirection="tr"
              />
            </FadeInWhenVisible>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="max-w-4xl mx-auto px-8 w-full text-center relative py-24 mt-20">
          <FadeInWhenVisible y={40}>
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full z-0"></div>
            <div className="relative z-10 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              
              <h2 className="font-headline font-extrabold text-5xl text-white tracking-tight mb-6">Initialize Your Ledger.</h2>
              <p className="text-gray-400 text-lg mb-12 max-w-lg mx-auto font-light">
                Step into absolute clarity. Claim your sovereignty over chaotic financial data in seconds.
              </p>
              <Link to="/signup" className="group relative bg-white text-black px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-3">
                Start Free Trial
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </FadeInWhenVisible>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
