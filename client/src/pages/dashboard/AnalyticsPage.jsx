import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { 
  RevenueTrendChart, 
  ClientConcentrationChart, 
  ARAgingChart,
  GrowthVelocityChart
} from '../../components/analytics/InsightCharts';
import PageWrapper from '../../components/layout/PageWrapper';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [velocity, setVelocity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Time');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [insightsRes, velocityRes] = await Promise.all([
          axiosInstance.get(`/analytics/insights?period=${activeFilter}`),
          axiosInstance.get('/analytics/velocity')
        ]);
        setData(insightsRes.data.data);
        setVelocity(velocityRes.data.data);
      } catch (error) {
        toast.error('Failed to load financial intelligence');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [activeFilter]);

  const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#F43F5E', '#EF4444'];
  const totalUnpaid = data?.arAging?.reduce((a, b) => a + (b.amount || 0), 0) || 0;

  if (loading) {
    return (
      <PageWrapper title="">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <PageWrapper title="">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Financial Insights</h1>
            <p className="text-text-muted mt-1 text-sm md:text-base">Comprehensive overview of financial performance and billing momentum.</p>
          </div>
          
          <div className="flex bg-[#18181B] p-1.5 rounded-xl ring-1 ring-white/5 shadow-inner w-fit">
            {['YTD', 'All Time'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all scale-btn ${
                  activeFilter === filter ? 'bg-[#27272A] text-white shadow-md ring-1 ring-white/10' : 'text-text-muted hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Revenue vs Expenses</h3>
                <p className="text-sm text-text-muted mt-1">Filtered by {activeFilter}</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] md:text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_#6366f1]"></div><span className="text-text-secondary uppercase tracking-widest font-black">Revenue</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-[0_0_10px_#f43f5e]"></div><span className="text-text-secondary uppercase tracking-widest font-black">Expense</span></div>
              </div>
            </div>
            <RevenueTrendChart data={data} />
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Client Concentration</h3>
                <p className="text-sm text-text-muted mt-1 text-nowrap">Revenue by top accounts</p>
              </div>
            </div>
            <ClientConcentrationChart data={data?.clientConcentration} colors={COLORS} />
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">A/R Aging</h3>
                <p className="text-sm text-text-muted mt-1">Outstanding invoices by age</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-2xl font-black text-white tabular-nums tracking-tight">₹{totalUnpaid.toLocaleString('en-IN')}</span>
                <span className="text-[10px] uppercase tracking-widest text-danger font-black mt-1">Total Unpaid</span>
              </div>
            </div>
            <ARAgingChart data={data?.arAging} />
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-auto z-10">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Billing Momentum</h3>
                <p className="text-sm text-text-muted mt-1">Month-over-month sales</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider ring-1 ${Number(velocity?.growthPercentage) >= 0 ? 'bg-success/10 text-success ring-success/20' : 'bg-danger/10 text-danger ring-danger/20'}`}>
                {Number(velocity?.growthPercentage) >= 0 ? '+' : ''}{velocity?.growthPercentage || 0}%
              </div>
            </div>
            <div className="mt-8 z-10">
              <div className="text-4xl font-black text-white tabular-nums tracking-tight">₹{velocity?.currentMonthMRR?.toLocaleString('en-IN') || 0}</div>
              <div className="text-sm font-bold text-text-muted mt-2 tracking-wide uppercase">Total Billed This Month</div>
            </div>
            <GrowthVelocityChart data={velocity?.trend} />
          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default AnalyticsPage;
